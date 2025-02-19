import { Route, Routes } from 'react-router-dom';

import { Select } from './select';
import { Amount } from './amount';
import { Window } from './window';

// import { Payment } from './payment';
// import { Uniramp } from './uniramp';
// import { LetsExachange } from './letsexachange';

export const ExchangesRouter = () => {
	return (
		<Routes>
			<Route path="/select" element={<Select />} />
			{/* <Route path="/lets_exachange" element={<LetsExachange />} />
			<Route path="/uniramp" element={<Uniramp />} />*/}
			<Route path="/amount/:methodName" element={<Amount />} />
			<Route path="/window/:methodName" element={<Window />} /> 
		</Routes>
	);
};

