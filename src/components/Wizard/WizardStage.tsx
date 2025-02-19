import { useEffect, Children } from 'react';
import { useWizardContext } from '.';

export function WizardStages ({ children }) {
	const { currentStage, setNumStages } = useWizardContext();
	const childrenCount = Children.count(children);

	// set num of stages, based on num of children passed in
	useEffect(
		() => setNumStages(childrenCount),
		[ childrenCount, setNumStages ]
	);

	const currentStageComponent = 
      Children.toArray(children)[currentStage - 1];

	return currentStageComponent;
}