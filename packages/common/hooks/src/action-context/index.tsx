import React, {
	createContext,
	useContext,
	Fragment,
	useRef,
} from 'react';

import {
	createReducerContext,
	ReducerState,
} from '../reducer-context';

type ActionReducer<S extends ReducerState> = (state: S, ...payload: any[]) => S;

type ActionDefinition<S extends ReducerState> = {
	[type: string]: ActionReducer<S>;
};

type ActionType<
	A extends ActionDefinition<S>,
	S extends ReducerState
> = keyof A & string;

type ActionPayload<
	A extends ActionDefinition<S>,
	S extends ReducerState,
	T extends ActionType<A, S> = ActionType<A, S>
> = {
	[type in ActionType<A, S>]: A[type] extends (state: S, ...p: infer P) => S
		? P
		: [];
}[T];

type Action<
	A extends ActionDefinition<S>,
	S extends ReducerState,
	T extends ActionType<A, S> = ActionType<A, S>
> = {
	[type in ActionType<A, S>]: {
		type: type;
		payload: ActionPayload<A, S, type>;
	};
}[T];

type Actions<A extends ActionDefinition<S>, S extends ReducerState> = {
	[type in ActionType<A, S>]: (...payload: ActionPayload<A, S, type>) => void;
};

type ActionContextConsumerProps<
	A extends ActionDefinition<S>,
	S extends ReducerState
> = {
	children: (state: S, actions: Actions<A, S>) => React.ReactElement;
};

type ActionContextProviderProps<
	A extends ActionDefinition<S>,
	S extends ReducerState
> = {
	value?: Partial<S>;
};

type ActionContextAPI<
	A extends ActionDefinition<S>,
	S extends ReducerState
> = {
	Consumer: React.FunctionComponent<ActionContextConsumerProps<A, S>>;
	Provider: React.FunctionComponent<ActionContextProviderProps<A, S>>;
	useActionContext: () => [S, Actions<A, S>];
};



export function createActionContext<
	A extends ActionDefinition<S>,
	S extends ReducerState
>(actions: A, initialState: S): ActionContextAPI<A, S> {
	const reducer: React.Reducer<S, Action<A, S>> = (
		state,
		{ type, payload }
	) => {
		if (actions[type] instanceof Function) {
			return actions[type](state, ...payload) || state;
		}

		return state;
	}

	const {
		Provider: ReducerProvider,
		useReducerContext,
	} = createReducerContext(reducer, initialState);
	const DispatchContext = createContext({} as Actions<A, S>);

	const useActionContext: ActionContextAPI<A, S>['useActionContext'] = () => [useReducerContext()[0], useContext(DispatchContext)];

	const Consumer: ActionContextAPI<A, S>['Consumer'] = ({ children }) => {
		const [state, dispatch] = useActionContext();

		return (
			<Fragment>
				{ children(state, dispatch) }
			</Fragment>
		);
	};

	const DispatchContextProvider: React.FunctionComponent = ({
		children,
	}) => {
		const [, dispatch] = useReducerContext();
		const actionRef = useRef<Actions<A, S>>();

		if (!actionRef.current) {
			actionRef.current = Object.keys(actions)
				.reduce((funcs, type) => ({
				...funcs,
				[type]: (...payload: ActionPayload<A, S>): void => dispatch({ type, payload }),
			}), {} as Actions<A, S>)
		}

		return (
			<DispatchContext.Provider value={ actionRef.current }>
				{ children }
			</DispatchContext.Provider>
		)
	};

	const Provider: ActionContextAPI<A, S>['Provider'] = ({
		value,
		children,
	}) => (
		<ReducerProvider value={ {
			...initialState,
			...value,
		} }>
			<DispatchContextProvider>
				{ children }
			</DispatchContextProvider>
		</ReducerProvider>
	);

	return {
		Consumer,
		Provider,
		useActionContext,
	};
}
