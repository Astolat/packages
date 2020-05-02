import React, {
	useContext,
	createContext,
	useReducer,
} from 'react';

export type ReducerState = Record<string, any>;
export interface ReducerAction {
	type: string;
	payload: any;
}
export interface ReducerContextReturnType<
	S extends ReducerState,
	A extends ReducerAction
> {
	ReducerContextProvider: React.FunctionComponent<{ value?: Partial<S> }>;
	useReducerContext(): [S, React.Dispatch<A>];
	useReducerDispatch(): React.Dispatch<A>;
	useReducerState(): S;
}

export function createReducerContext<S extends ReducerState, A extends ReducerAction>(
	reducer: React.Reducer<S, A>,
	initialState: S
): ReducerContextReturnType<S, A> {
	const StateContext = createContext<S>(initialState);
	const DispatchContext = createContext<React.Dispatch<A>>(() => undefined);

	const useReducerState: ReducerContextReturnType<S, A>['useReducerState'] = () => useContext(StateContext);
	const useReducerDispatch: ReducerContextReturnType<S, A>['useReducerDispatch'] = () => useContext(DispatchContext);
	const useReducerContext: ReducerContextReturnType<S, A>['useReducerContext'] = () => [
		useReducerState(),
		useReducerDispatch(),
	];

	const ReducerContextProvider: ReducerContextReturnType<S, A>['ReducerContextProvider'] = ({ value, children }) => {
		const [state, dispatch] = useReducer(reducer, {
			...initialState,
			...value,
		});

		return (
			<StateContext.Provider value={ state }>
				<DispatchContext.Provider value={ dispatch }>
					{ children }
				</DispatchContext.Provider>
			</StateContext.Provider>
		);
	};

	ReducerContextProvider.displayName = 'ReducerContextProvider';

	return {
		ReducerContextProvider,
		useReducerContext,
		useReducerDispatch,
		useReducerState,
	};
}
