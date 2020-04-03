import React, {
	useContext,
	createContext,
	useReducer,
	Fragment,
} from 'react';

export type ReducerState = {
	[key: string]: any;
};

type ReducerContextAPI<S extends ReducerState, A> = {
	Consumer: React.FunctionComponent<{ children: (state: S, dispatch: React.Dispatch<A>) => React.ReactElement }>;
	Provider: React.FunctionComponent<{ value: S }>;
	useReducerContext: () => [S, React.Dispatch<A>];
};

export function createReducerContext<S, A>(reducer: React.Reducer<S, A>, initialState: S): ReducerContextAPI<S, A> {
	const StateContext = createContext<S>(initialState);
	const DispatchContext = createContext<React.Dispatch<A>>(() => {});

	const useReducerContext: ReducerContextAPI<S, A>['useReducerContext'] = () => ([
		useContext(StateContext),
		useContext(DispatchContext),
	]);

	const Consumer: ReducerContextAPI<S, A>['Consumer'] = ({ children }) => {
		const [state, dispatch] = useReducerContext();

		return (
			<Fragment>
				{ children(state, dispatch) }
			</Fragment>
		);
	};

	const Provider: ReducerContextAPI<S, A>['Provider'] = ({
		value,
		children,
	}) => {
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

	return {
		Consumer,
		Provider,
		useReducerContext,
	};
}
