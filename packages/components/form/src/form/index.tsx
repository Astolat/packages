import React, {
	useRef,
} from 'react';

import {
	FormProvider,
} from '../context';

export interface FormProps {

}

const Form: React.FunctionComponent<FormProps> = ({

}) => {
	const formRef = useRef(null);

	return (
		<FormProvider>
			<form ref={ formRef }/>
		</FormProvider>
	);
};

Form.displayName = 'Form';

export default Form;
