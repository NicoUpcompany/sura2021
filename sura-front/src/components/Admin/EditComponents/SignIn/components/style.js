import styled from "styled-components";

export const Handle = styled.div((props) => ({
	borderBottom: "0 solid transparent",
	borderRight: "15px solid black",
	borderTop: "15px solid transparent",
	bottom: 0,
	cursor: props.cursor,
	display: "inline-block",
	height: 0,
	position: "absolute",
	right: 0,
	width: 0,
}));

export const Resizable = styled.div({
	backgroundColor: "rgba(154, 154, 154, 0.2)",
	padding: "0",
	position: "relative",
});
