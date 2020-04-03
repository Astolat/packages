import {
	useRef,
} from 'react';

const REF_VALUE = Symbol('REF_VALUE');

export function useConst<F extends () => any, T extends ReturnType<F>>(
	func: F
): T {
	const ref = useRef<T>(REF_VALUE as T);

	if (ref.current === REF_VALUE) {
		ref.current = func();
	}

	return ref.current;
}
