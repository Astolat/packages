import React, {
	useContext,
	useState,
	createContext,
} from 'react';


/**
 *
 * @param initialState
 */
export function createStateContext<T extends object = {}>(initialState: T) {
	const Context = createContext<T>(initialState);
	function useStateContext() {
		return useContext<T>(Context);
	}
	function StateContextProvider(props: React.ProviderProps<T>) {
		const {
			value,
			children,
		} = props;
		const [state, setState] = useState<T>(value);

		return (
			<Context.Provider
				value={ {
					...state,
					setState,
				} }
			>
				{ children }
			</Context.Provider>
		);
	}

	return {
		useStateContext,
		Provider: StateContextProvider as React.Provider<T & {
			setState: React.Dispatch<React.SetStateAction<T>>;
		}>,
	};
}
