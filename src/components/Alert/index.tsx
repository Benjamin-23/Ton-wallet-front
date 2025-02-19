import { Page, Block } from 'konsta/react';
import styled from 'styled-components';
import ConfettiExplosion from 'react-confetti-explosion';

const Container = styled(Page)`
  display: flex;
  flex-direction: column;

	.invalid-feedback {
		color: red;
	}
`;

const Footer = styled.div`
  margin-top: auto;
  margin-bottom: 30px;
`;

export const Success = ({ subtitle, title, buttonText, onClick }) => {
	return (
		<Container>
			<div className="pl-4-safe pr-4-safe mt-8 flex justify-center items-center -mb-6 font-semibold text-[1.5rem] text-center">
				{title}
				<ConfettiExplosion />
			</div>
			<Block>
				<p className="text-center">
					{subtitle}
				</p>
			</Block>
			<Footer className="mx-4">
				<button
					type="submit"
					onClick={onClick}
					className="flex text-center justify-center items-center appearance-none py-1 transition-colors focus:outline-none cursor-pointer select-none overflow-hidden z-10 w-full flex relative uppercase duration-100 font-semibold px-2 rounded text-black bg-primary active:bg-ios-primary-shade h-11"
					role="button"
					tabIndex={0}
				>
					{buttonText}
				</button>
			</Footer>
		</Container>
	);
};