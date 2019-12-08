class Something {
	static test(arg: string): string {
		return `Something.test() => ${ arg }`;
	}
}

describe('Some', () => {
	test('thing', () => {
		console.log(Something.test('stuff'));
		expect(true).toBe(true);
	});
});
