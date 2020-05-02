import {
	createReducerContext,
} from './index';

interface State {
	value: number;
};

const reducer = (state: State, { type, payload }): State => ({
	add: (num = 1) => ({
		...state,
		value: state.value + num,
	}),
	sub: (num = 1) => ({
		...state,
		value: state.value - num,
	}),
}[type](payload));

describe('reducer-context', () => {

});
