import React from 'react';
import { ToastsStore } from 'react-toasts';
import { useTheme } from '@mui/material/styles';
import { makeStyles, createStyles } from '@mui/styles';
import { Box, Drawer, Typography, IconButton, Divider } from '@mui/material';
import { Droppable } from 'react-beautiful-dnd';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { DRAWER_WIDTH } from '../../helpers/constants';
import { getListStyle } from '../../helpers/dragAndDropHelpers';
import laserSwordIcon from "../../assets/icons/red-laser-sword.png";
import chewbacca from "../../assets/icons/chewbacca.svg";
import DrawerHeader from '../DrawerHeader/DrawerHeader';

const useStyles = makeStyles(() => createStyles({
    smallIcon: {
        width: 30,
        height: 30,
    },
    itemBox: {
        background: 'rgba(255, 255, 255, .5)',
        borderRadius: 15,
    },
    titleWithIcon: {
        display: 'flex',
        alignItems: 'center',
    },
    hint: {
        color: 'grey',
        fontSize: 12,
    },
}));

const FavoriteCharactersSideBar = ({
    open,
    favorites,
    isDragging,
    updateFavorites,
    handleDrawerClose,
}) => {
    const theme = useTheme();
    const classes = useStyles();

    return (
       <Drawer
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeader>
                <Typography textAlign="left" component="span" className={classes.titleWithIcon}>
                    Favorite Characters{!!favorites.length && `: ${favorites.length}`}
                    <img src={chewbacca} className={classes.smallIcon} />
                </Typography>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <Droppable droppableId="sidebar">
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        style={{...getListStyle(snapshot.isDraggingOver, isDragging), height: '90vh', overflow: 'scroll' }}
                    >
                        {!!favorites.length ? favorites.map((item) => (
                            <Box
                                my={1}
                                px={1}
                                key={item}
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                className={classes.itemBox}
                            >
                                <Typography key={item}>
                                    {item}
                                </Typography>
                                <IconButton
                                    onClick={() => {
                                        updateFavorites([...favorites].filter((favItem) => favItem !== item));
                                        ToastsStore.success(`${item} has been deleted from the favorite characters list successfully!`);
                                    }}
                                >
                                    <img alt="blue-laser-sword-icon" src={laserSwordIcon} className={classes.smallIcon} />
                                </IconButton>
                            </Box>
                        )) : (
                            <Box display="flex" height="100%" justifyContent="center" alignItems="center">
                                <Typography className={classes.hint}>
                                    Drop your favorite characters here
                                </Typography>
                            </Box>
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </Drawer>
    );
};

export default FavoriteCharactersSideBar;
