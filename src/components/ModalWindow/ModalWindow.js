import React from 'react';
import { Modal, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import GalaxyCard from '../GalaxyCard/GalaxyCard';

const useStyles = makeStyles({
    box: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    },
});

const ModalWindow = ({ children, ...restProps }) => {
    const classes = useStyles();

    return (
        <Modal {...restProps}>
            <Box>
                <GalaxyCard className={classes.box}>
                    {children}
                </GalaxyCard>
            </Box>
        </Modal>
    );
};

export default ModalWindow;
