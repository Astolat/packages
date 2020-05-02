import React from 'react';
import {
	renderHook,
	act,
} from '@testing-library/react-hooks';

import {
	createActionContext,
} from './index';

interface State {
	value: number;
}

const actions = {
	add: (state: State, num = 1): State => ({
		...state,
		value: state.value + num,
	}),
	sub: (state: State, num = 1): State => ({
		...state,
		value: state.value - num,
	}),
};

const initialState: State = {
	value: 0,
};

describe('action-context', () => {
	const {
		ActionContextProvider,
		useActionContext,
		useActionState,
		useActions,
	} = createActionContext(actions, initialState);

	const wrapper: React.FunctionComponent = ({ children }) => (
		<ActionContextProvider>
			{ children }
		</ActionContextProvider>
	);

	describe('useActionContext', () => {

		test('returns [state, actions]', () => {
			const {
				result,
			} = renderHook(() => useActionContext(), { wrapper });

			expect(result.current)
				.toEqual(expect.any(Array));

			expect(result.current)
				.toHaveLength(2);

			expect(result.current[0])
				.toEqual({
					value: 0,
				});

			expect(result.current[1])
				.toEqual({
					add: expect.any(Function),
					sub: expect.any(Function),
				});
		});

		test('actions update state', () => {
			const {
				result,
			} = renderHook(() => useActionContext(), { wrapper });

			expect(result.current[0])
				.toHaveProperty('value', 0);

			act(() => result.current[1].add(5));

			expect(result.current[0])
				.toHaveProperty('value', 5);

			act(() => result.current[1].add());

			expect(result.current[0])
				.toHaveProperty('value', 6);

			act(() => result.current[1].sub());

			expect(result.current[0])
				.toHaveProperty('value', 5);
			act(() => result.current[1].sub(3));

			expect(result.current[0])
				.toHaveProperty('value', 2);
		});
	});

	describe('useActionState', () => {
		test('returns state', () => {
			const {
				result,
			} = renderHook(() => useActionState(), { wrapper });

			expect(result.current)
				.toEqual({
					value: 0,
				});
		});
	});

	describe('useActions', () => {
		test('returns actions', () => {
			const {
				result,
			} = renderHook(() => useActions(), { wrapper });

			expect(result.current)
				.toEqual({
					add: expect.any(Function),
					sub: expect.any(Function),
				});
		});
	});
});
