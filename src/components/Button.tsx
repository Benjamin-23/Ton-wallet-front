import { Button } from 'konsta/react';

export const CustomButton = ({ onClick, children, ...props }) => {
	return (
		<Button
			colors={{ fillTextIos: 'dark:text-black', fillTextMaterial: 'dark:text-black' }}
			large
			onClick={onClick}
			{...props}
		>
			{children}
		</Button>
	);
};