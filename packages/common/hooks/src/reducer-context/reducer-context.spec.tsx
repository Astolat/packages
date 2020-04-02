import React from 'react';
import {
	mount,
} from 'enzyme';

import {
	createReducerContext,
} from './';

type State = {
	current: number;
	prev?: number;
};

const actions = {
	add: ({ current }: State, num = 1): State => ({
		current: current + num,
		prev: current,
	}),
	sub: ({ current }: State, num = 1): State => ({
		current: current - num,
		prev: current,
	}),
	set: ({ current }: State, newVal = 0): State => ({
		current: newVal,
		prev: current,
	}),
};

const initialState: State = {
	current: 0,
};

const {
	useReducerContext,
	Provider,
} = createReducerContext(actions, initialState);

function App(): JSX.Element {
	return (
		<Provider value={ { current: 0 } }>
			<TestComp />
		</Provider>
	);
}

function TestComp(): JSX.Element {
	const [{
		current,
		prev,
	}, {
		add,
		sub,
		set,
	}] = useReducerContext();

	return (
		<div>
			<input
				id="current"
				readOnly={ true }
				value={ current }
			/>
			<input
				id="prev"
				readOnly={ true }
				value={ prev }
			/>
			<button
				id="add"
				onClick={ (): void => add() }
			/>
			<button
				id="add10"
				onClick={ (): void => add(10) }
			/>
			<button
				id="sub"
				onClick={ (): void => sub() }
			/>
			<button
				id="sub10"
				onClick={ (): void => sub(10) }
			/>
			<button
				id="set"
				onClick={ (): void => set() }
			/>
			<button
				id="set10"
				onClick={ (): void => set(10) }
			/>
		</div>
	);
}

describe(`@astolat/hooks/reducer-context`, () => {

	test('', () => {
		const wrapper = mount(<App/>);
		const current = wrapper.find('#current');

		expect(wrapper.find('#current')).toHaveProp('value', 0);
	});
});
