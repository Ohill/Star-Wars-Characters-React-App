import Space from "../assets/images/space.jpeg";
import Galaxy from "../assets/images/galaxy.jpeg";

const GRID = 8;

export const getListStyle = (isDraggingOver, isDragging) => ({
    background: isDraggingOver ? `url(${Galaxy})` : isDragging ? `url(${Space})` : 'white',
    padding: GRID,
    width: 285,
    height: '105%',
});

export const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: GRID,
    borderRadius: 15,
    margin: `0 0 ${GRID}px 0`,

    // change background colour if dragging
    background: isDragging ? `url(${Galaxy})` : `url(${Space})`,

    // styles we need to apply on draggables
    ...draggableStyle
});
