import React, {
	useMemo,
	// useRef,
} from 'react';
import {
	useConst,
} from '@astolat/hooks';

import {
	createReducerContext,
	ReducerState,
	ReducerContextReturnType,
} from '../reducer-context';

export type ActionReducer<S extends ReducerState> = (state: S, ...payload: any[]) => S;
export type ActionDefinition<S extends ReducerState> = {
	[type: string]: ActionReducer<S>;
};
export type ActionType<
	S extends ReducerState,
	A extends ActionDefinition<S>
> = keyof A & string;
export type ActionPayload<
	S extends ReducerState,
	A extends ActionDefinition<S>,
	T extends ActionType<S, A> = ActionType<S, A>
> = {
	[type in ActionType<S, A>]: A[type] extends (state: S, ...p: infer P) => S ? P : [];
}[T];
export type Action<
	S extends ReducerState,
	A extends ActionDefinition<S>,
	T extends ActionType<S, A> = ActionType<S, A>
> = {
	[type in ActionType<S, A>]: {
		type: type;
		payload: ActionPayload<S, A, type>;
	};
}[T];
export type Actions<
	S extends ReducerState,
	A extends ActionDefinition<S>
> = {
	[type in ActionType<S, A>]: (...payload: ActionPayload<S, A, type>) => void;
};
export interface ActionContextReturnType<
	S extends ReducerState,
	A extends ActionDefinition<S>
> {
	ActionContextProvider: ReducerContextReturnType<S, Action<S, A>>['ReducerContextProvider'];
	useActionContext(): [S, Actions<S, A>];
	useActions(): Actions<S, A>;
	useActionState(): S;
}

export function createActionContext<
	S extends ReducerState,
	A extends ActionDefinition<S>
>(actions: A, initialState: S): ActionContextReturnType<S, A> {
	const reducer: React.Reducer<S, Action<S, A>> = (
		state,
		{ type, payload }
	) => actions[type] instanceof Function ? actions[type](state, ...payload) || state : state;

	const {
		ReducerContextProvider: ActionContextProvider,
		useReducerDispatch: useActionDispatch,
		useReducerState: useActionState,
	} = createReducerContext(reducer, initialState);

	ActionContextProvider.displayName = 'ActionContextProvider';

	const useActions: ActionContextReturnType<S, A>['useActions'] = () => {
		const dispatch = useActionDispatch();

		return useMemo(
			() =>
				Object.keys(actions).reduce(
					(funcs, type: ActionType<S, A>) => ({
						...funcs,
						[type]: (...payload: ActionPayload<S, A>): void =>
							dispatch({ type, payload }),
					}),
					{} as Actions<S, A>
				),
				[dispatch]
		);
	};

	const useActionContext: ActionContextReturnType<S, A>['useActionContext'] = () => [
		useActionState(),
		useActions(),
	];

	return {
		ActionContextProvider,
		useActionContext,
		useActions,
		useActionState,
	};
}

export interface ActionContextProps<S extends ReducerState, A extends ActionDefinition<S>> {
	actions: A;
	value: S;
}

export default function ActionContainer<S extends ReducerState, A extends ActionDefinition<S>>({
	actions,
	value,
	children,
}: React.PropsWithChildren<ActionContextProps<S, A>>) {
	const {
		ActionContextProvider,
	} = useConst(() => createActionContext(actions, value));

	return (
		<ActionContextProvider>
			{ children }
		</ActionContextProvider>
	);
}
