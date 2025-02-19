import useCanvas from './useCanvas';

export const Canvas = props => {  
	const { draw, ...rest } = props;
	const canvasRef = useCanvas(draw);
  
	return <canvas ref={canvasRef} {...rest}/>;
};
