import React, {
	createContext,
	useContext,
	useReducer,
	useRef,
} from 'react';


type ActionState = {
	[key: string]: any;
};

type ActionReducer<S extends ActionState> = (state: S, ...payload: any[]) => S;

type ActionDefinition<S extends ActionState> = {
	[type: string]: ActionReducer<S>;
};

type ActionType<A extends ActionDefinition<S>, S extends ActionState> = keyof A & string;

type ActionPayload<A extends ActionDefinition<S>, S extends ActionState, T extends ActionType<A, S> = ActionType<A, S>> = {
	[type in ActionType<A, S>]: A[type] extends ((state: S, ...p: infer P) => S)
		? P
		: []
}[T];

type Action<A extends ActionDefinition<S>, S extends ActionState, T extends ActionType<A, S> = ActionType<A, S>> = {
	[type in ActionType<A, S>]: {
		type: type;
		payload: ActionPayload<A, S, type>;
	};
}[T];

type Actions<A extends ActionDefinition<S>, S extends ActionState> = {
	[type in ActionType<A, S>]: (...payload: ActionPayload<A, S, type>) => void;
};

type ReducerContextConsumerProps<A extends ActionDefinition<S>, S extends ActionState> = {
	children: (state: S, actions: Actions<A, S>) => React.ReactElement;
};

type ReducerContextProviderProps<A extends ActionDefinition<S>, S extends ActionState> = {
	value?: Partial<S>;
};

type ReducerContextAPI<A extends ActionDefinition<S>, S extends ActionState> = {
	Consumer: React.FunctionComponent<ReducerContextConsumerProps<A, S>>;
	Provider: React.FunctionComponent<ReducerContextProviderProps<A, S>>;
	useReducerContext: () => [S, Actions<A, S>];
};

const REF_VALUE = Symbol('REF_VALUE');

export function useConst<F extends () => any, T extends ReturnType<F>>(func: F): T {
	const ref = useRef<T>(REF_VALUE as T);

	if (ref.current === REF_VALUE) {
		ref.current = func();
	}

	return ref.current;
}

/**
 * Create a new `React.Context` with a built-in reducer.
 *
 * @param actions A map of action reducer functions
 * @param initialState The initial values of the context state
 */
export function createReducerContext<A extends ActionDefinition<S>, S extends ActionState>(actions: A, initialState: S): ReducerContextAPI<A, S> {
	const reducer: React.Reducer<S, Action<A, S>> = (state, { type, payload }): S => {
		if (actions[type] instanceof Function) {
			return actions[type](state, ...payload) || state;
		}

		return state;
	};

	const StateContext = createContext(initialState);
	const ActionContext = createContext({} as Actions<A, S>);

	const useReducerContext: ReducerContextAPI<A, S>['useReducerContext'] = () => [
		useContext(StateContext),
		useContext(ActionContext),
	];

	const Consumer: ReducerContextAPI<A, S>['Consumer'] = ({
		children,
	}) => children(...useReducerContext());

	const Provider: ReducerContextAPI<A, S>['Provider'] = ({
		value,
		children,
	}) => {
		const [state, dispatch] = useReducer(reducer, { ...initialState, ...value });
		const actionState = useConst(() => (
			Object.keys(actions)
				.reduce((funcs, type) => ({
					...funcs,
					[type]: (...payload: ActionPayload<A, S>): void => dispatch({ type, payload }),
				}), {} as Actions<A, S>)
		));

		return (
			<StateContext.Provider
				value={ state }
			>
				<ActionContext.Provider
					value={ actionState }
				>
					{ children }
				</ActionContext.Provider>
			</StateContext.Provider>
		);
	};

	return {
		Consumer,
		Provider,
		useReducerContext,
	};
}
