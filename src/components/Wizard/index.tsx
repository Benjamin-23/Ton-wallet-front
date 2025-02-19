import { createContext, useContext, useState } from 'react';

const WizardContext = createContext();

// helper function to get context
export function useWizardContext () {
	return useContext(WizardContext);
}

export function WizardContainer ({ children }) {
	const [ numStages, setNumStages ] = useState();
	const [ currentStage, setCurrentStage ] = useState(1); // start at 1
	const [ state, setState ] = useState();

	const ctx = {
		state,
		setState,
		numStages,
		setNumStages,
		currentStage,
		handleGoToStage: (stage) => setCurrentStage(stage),
		handleNext: (callback: () => void) => {
			setCurrentStage((stage) => stage + 1);
			if (typeof callback === 'function') callback();
		},
		handlePrev: () => setCurrentStage((stage) => stage - 1),
	};
	return (
		<WizardContext.Provider value={ctx}>
			{children}
		</WizardContext.Provider>
	);
}

