import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { RxCross2 } from "react-icons/rx";
import { useDispatch } from 'react-redux';
import { useSocketContext } from '../../Context/SocketContextProvider';
import { clearUser } from '../../Redux/slices/authSlice';

const LogoutModal = ({ open, handleClose }) => {

    const dispatch = useDispatch()
    const { disconnectSocket } = useSocketContext()

    const handleLogout = () => {
        dispatch(clearUser())
        disconnectSocket()
    }


   

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            className='border-2 border-pink-500'
            maxWidth={"xs"}
            fullWidth
        >
            <DialogTitle className='flex justify-end items-center w-full' >
                <IconButton onClick={handleClose}>
                    <RxCross2 size={20} />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Typography
                    sx={{
                        fontSize: "20px"
                    }}
                >
                    Are you sure you want to logout ?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    variant='contained'
                    onClick={() => {
                        handleLogout()
                        handleClose()
                    }}
                >
                    Yes
                </Button>
                <Button
                    variant='contained'
                    sx={{
                        bgcolor: "grey",
                        color: "white"
                    }}
                    onClick={handleClose}
                >
                    No
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default LogoutModal