import { Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import React from 'react'

const ExitRoomModal = ({ open, handleClose, handleDeleteRoom }) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth={"xs"}
            fullWidth
        >
            <DialogContent>
                <Typography>
                    Are you sure you want to leave the room ?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    variant='contained'
                    onClick={() => {
                        handleDeleteRoom()
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

export default ExitRoomModal