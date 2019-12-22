import React, {
	createContext,
	useContext,
	useReducer,
	useMemo,
} from 'react';


type ActionDefinition<T extends object = {}> = {
	[type: string]: (state: T, ...payload: any[]) => T;
};

type ActionState<A extends ActionDefinition> = A extends ActionDefinition<infer T> ? T : never;
type ActionType<A extends ActionDefinition> = keyof A;
type ActionPayload<A extends ActionDefinition, T extends ActionType<A> = ActionType<A>> = {
	[type in ActionType<A>]: A[type] extends ((s: ActionState<A>, ...p: infer P) => ActionState<A>)
		? Parameters<(...payload: P) => any>
		: Parameters<A[type]>
}[T];

type Action<A extends ActionDefinition, T extends ActionType<A> = ActionType<A>> = {
	[type in ActionType<A>]: {
		type: type;
		payload: ActionPayload<A, type>;
	};
}[T];

type Actions<A extends ActionDefinition> = {
	/**
	 * Some comment
	 */
	[type in ActionType<A>]: (...payload: ActionPayload<A, type>) => void;
};


/**
 * Create a new `React.Context` with a built-in reducer.
 *
 * @param actions A map of action reducer functions
 * @param initialState The initial values of the context state
 *
 * ### Example
 * #### **`context.ts`**
 * ```ts
 * type State = {
 * 	currentValue: number;
 * 	previousValue?: number;
 * };
 *
 * const initialState: State = {
 * 	currentValue: 0,
 * };
 *
 * const actions = {
 * 	add: (state: State, num: number = 1): State => ({
 * 		...state,
 * 		currentValue: state.currentValue + num,
 * 		previousValue: state.currentValue,
 * 	}),
 * 	subtract: (state: State, num: number = 1): State => ({
 * 		...state,
 * 		currentValue: state.currentValue - num,
 * 		previousValue: state.currentValue,
 * 	}),
 * 	multiply: (state: State, num: number): State => ({
 * 		...state,
 * 		currentValue: state.currentValue * num,
 * 		previousValue: state.currentValue,
 * 	}),
 * 	undo: (state: State): State => ({
 * 		...state,
 * 		currentValue: state.previousValue,
 * 		previousValue: state.currentValue,
 * 	}),
 * };
 *
 * const {
 * 	useReducerContext,
 * 	Provider,
 * } = createReducerContext(actions, initialState);
 *
 * export {
 * 	useReducerContext,
 * 	Provider,
 * };
 * ```
 * #### **`some-component.tsx`**
 * ```tsx
 * function SomeComponent() {
 * 	const [
 * 		{
 * 			currentValue,
 * 		},
 * 		{
 * 			add,
 * 			subtract,
 * 			multiply,
 * 			undo,
 * 		},
 * 	] = useReducerContext();
 *
 * 	return (
 * 		<div>
 * 			<h1>Current Value: { currentValue }</h1>
 * 			<button onClick={ () => add() }>+1</button>
 * 			<button onClick={ () => add(10) }>+10</button>
 * 			<button onClick={ () => subtract(1) }>-1</button>
 * 			<button onClick={ () => subtract(10) }>-10</button>
 * 			<button onClick={ () => subtract(10) }>x10</button>
 * 			<button onClick={ () => subtract(100) }>x100</button>
 * 			<button onClick={ () => undo() }>Undo</button>
 * 		</div>
 * 	);
 * }
 * ```
 */
export function createReducerContext<T extends object, A extends ActionDefinition<T>>(actions: A, initialState: T = {} as T) {
	const reducer: React.Reducer<T, Action<A>> = (state, action): T => {
		const {
			type,
			payload,
		} = action;

		if (actions[type] instanceof Function) {
			return {
				...(actions[type](state, ...payload) || state),
			};
		}

		return state;
	};

	const StateContext = createContext(initialState);
	const ActionContext = createContext<Actions<A>>({} as Actions<A>);

	const useReducerContext = (): [T, Actions<A>] => [
		useContext(StateContext),
		useContext(ActionContext),
	];

	function ReducerContextProvider(props: React.ProviderProps<T>) {
		const {
			value,
			children,
		} = props;
		const [state, dispatch] = useReducer(reducer, value);
		const actionState = useMemo(() => (
			Object.keys(actions)
				.reduce<Actions<A>>((funcs: Actions<A>, type: ActionType<A>) => ({
					...funcs,
					[type]: (...payload: ActionPayload<A>) => dispatch({ type, payload }),
				}), {} as Actions<A>)
		), []);

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
		)
	}

	return {
		useReducerContext,
		Provider: ReducerContextProvider,
	};
}
