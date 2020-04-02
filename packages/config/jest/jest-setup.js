try {
	const { JSDOM } = require('jsdom');
	const jsdom = new JSDOM(`
		<!doctype html>
		<html>
			<head></head>
			<body></body>
		</html>
	`, {
		url: 'http://astolat.com',
	});
	const {
		window,
	} = jsdom;

	Object.defineProperties(global, {
		...Object.getOwnPropertyDescriptors(window),
		window: {
			value: window,
		},
	});
} catch (err) {
	console.dir(err, {
		colors: true,
	});
}

try {
	const React = require('react');
	const {
		configure,
	} = require('enzyme');
	const {
		version,
	} = require('react/package.json');
	const [reactVersion] = version.split('.');
	const Adapter = require(`enzyme-adapter-react-${ reactVersion }`);

	// Object.defineProperties(global, {
	// 	React: {
	// 		value: React,
	// 	},
	// });

	configure({
		adapter: new Adapter(),
	});
} catch (err) {
	console.dir(err, {
		colors: true,
	});
	// Don't have React or Enzyme
}