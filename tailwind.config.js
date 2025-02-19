/** @type {import('tailwindcss').Config} */
import konstaConfig from 'konsta/config';

export default konstaConfig({
	darkMode: 'class',
	content: [ './index.html', './src/**/*.{js,ts,jsx,tsx}' ],
	theme: {
		extend: {
			fontFamily: { 'sans': [ 'Nunito', 'sans-serif' ] },
			ios: 'font-sans',
			colors: {
				primary: 'white',
				'md-dark-primary': 'white',
				secondary: 'black',
				'ios-primary-shade': 'white',
			},
		},
	},
	plugins: [],
});
