import React from 'react';
import { Box } from '@mui/system';
import { makeStyles } from '@mui/styles';
import classNames from 'classnames';
import Galaxy from "../../assets/images/galaxy.jpeg";

const useStyles = makeStyles({
    card: {
        borderRadius: '10px',
        backgroundImage: `url(${Galaxy})`,
    },
    innerBox: {
        borderRadius: '10px',
        backgroundColor: 'rgba(255, 255, 255, .5)',
    },
});

const GalaxyCard = ({ children, className, ...restProps }) => {
    const classes = useStyles();

    return (
        <Box p={2} className={classNames(className, classes.card)} {...restProps}>
            <Box p={2} className={classes.innerBox}>
                {children}
            </Box>
        </Box>
    );
};

export default GalaxyCard;
