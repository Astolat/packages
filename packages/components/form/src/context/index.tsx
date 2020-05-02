import {
	createActionContext,
} from '@astolat/context';

import * as actions from './actions';
import {
	initialState,
} from './state';

const {
	ActionContextProvider: FormProvider,
	useActionContext: useForm,
	useActionDispatch: useFormDispatch,
	useActionState: useFormState,
	useActions: useFormActions,
} = createActionContext(actions, initialState);

export {
	FormProvider,
	useForm,
	useFormDispatch,
	useFormState,
	useFormActions,
};
