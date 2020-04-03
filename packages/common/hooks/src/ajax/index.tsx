import React, {
	useState,
	createContext,
	useEffect,
	useMemo,
	useContext,
} from 'react';


interface AjaxStatus {
	abort?: AbortController['abort'];
	error?: boolean;
	loading: boolean;
	request?: Promise<void>;
	response?: Response;
	status?: Response['status'];
	success?: boolean;
}

interface AjaxState<T> extends AjaxStatus {
	data?: T;
}

function useAjax<T = {}>(...args: Parameters<typeof fetch>): [T|void, AjaxStatus] {
	const [input, init = {}] = args;
	const controller = useMemo(() => (
		new AbortController()
	), []);
	const {
		signal,
	} = controller;
	const abort = controller.abort.bind(controller);
	const [{
		data,
		error,
		loading,
		request,
		response,
		status,
		success,
	}, setData] = useState<AjaxState<T>>({
		loading: true,
	});

	useEffect(() => {
		if (request) {
			abort();
		}

		setData({
			data,
			loading: true,
			request: fetch(input, {
				...init,
				signal,
			})
				.then(async response => setData({
					data: await response.json() as T,
					loading: false,
					response,
					success: true,
				}))
				.catch(error => setData({
					data,
					error,
					loading: false,
					success: false,
				})),
		});
	}, [...args]);

	return [data, {
		abort,
		error: error || false,
		loading: !!loading,
		response,
		status,
		success,
	}];
}

type AjaxContextProviderProps = {
	children: React.ReactNode;
	init?: RequestInit;
	input: RequestInfo;
};

type AjaxContextConsumerProps<T extends object = {}> = {
	children: (data: T, status?: AjaxStatus) => React.ReactNode;
};

export function createAjaxContext<T extends object = {}>(initialState: T = {} as T) {
	const DataContext = createContext<T>(initialState);
	const StatusContext = createContext<AjaxStatus>({
		loading: true,
	});

	function useAjaxContext(): [T, AjaxStatus] {
		return [
			useContext(DataContext),
			useContext(StatusContext),
		];
	}

	function AjaxContextProvider(props: AjaxContextProviderProps) {
		const {
			children,
			init,
			input,
		} = props;

		const [data, status] = useAjax(input, init);

		return (
			<DataContext.Provider
				value={ data }
			>
				<StatusContext.Provider
					value={ status }
				>
					{ children }
				</StatusContext.Provider>
			</DataContext.Provider>
		);
	}

	function AjaxContextConsumer(props: AjaxContextConsumerProps<T>) {
		const {
			children,
		} = props;
		const args = useAjaxContext();

		return children(...args);
	}

	function useAjaxSuccessEffect(...args: Parameters<typeof useEffect>) {
		const [effect, deps = []] = args;
		const {
			loading,
			success,
		} = useContext(StatusContext);

		useEffect(() => {
			if (
				!loading &&
				success
			) {
				effect();
			}
		}, [loading, success, ...deps]);
	}

	function useAjaxErrorEffect(...args: Parameters<typeof useEffect>) {
		const [effect, deps = []] = args;
		const {
			loading,
			success,
			error,
		} = useContext(StatusContext);

		useEffect(() => {
			if (
				!loading &&
				!success &&
				error
			) {
				effect();
			}
		}, [loading, success, error, ...deps]);
	}

	return {
		Consumer: AjaxContextConsumer,
		Provider: AjaxContextProvider,
		useAjaxContext,
		useAjaxErrorEffect,
		useAjaxSuccessEffect,
	};
}
