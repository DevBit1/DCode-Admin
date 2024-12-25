import { Box, Button, List, ListItem, ListItemButton, TextField, Typography } from '@mui/material'
import { Field, Formik } from 'formik'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CODE_COLLAB } from '../../../Constants/RoutePaths'
import { useSocketContext } from '../../../Context/SocketContextProvider'


const CodeHub = () => {

    const navigate = useNavigate()
    const { rooms, handleCreateRoom, handleDeleteRoom } = useSocketContext()

    return (
        <Box
            className="w-full h-full border-2 border-green-700 flex flex-col items-center gap-y-5 p-5"
        >
            <Formik
                initialValues={{
                    roomName: ""
                }}
                onSubmit={(values, actions) => {
                    handleCreateRoom(values.roomName)
                    actions.resetForm({
                        roomName: ""
                    })
                }}
            >
                {
                    ({ handleSubmit, values }) => (
                        <form
                            className='flex gap-x-3'
                            onSubmit={handleSubmit}
                        >
                            <Field
                                as={TextField}
                                label="Create Room"
                                placeholder='Give a name'
                                name="roomName"
                                size="small"
                            />
                            <Button
                                variant="contained"
                                type='submit'
                                className="w-max h-max"
                                disabled={values.roomName.trim().length == 0}
                            >
                                Create
                            </Button>
                        </form>
                    )
                }
            </Formik>
            <Box
                className="flex-1 flex justify-center w-full overflow-auto"
            >
                <List
                    className="h-full flex flex-col gap-y-2"
                >
                    {
                        rooms.length > 0 ?
                            (
                                rooms.map((ele) => {
                                    return (
                                        <Box key={ele._id}>
                                            <ListItemButton
                                                sx={{
                                                    minWidth: 350,
                                                    maxHeight: "max-Content",
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    bgcolor: "rgb(203,213,225)",
                                                    borderRadius: 2
                                                }}
                                                className='rounded-md'
                                            >
                                                <Typography>{ele.name}</Typography>
                                                <Box
                                                    className="flex gap-x-2"
                                                >
                                                    <Button
                                                        variant='contained'
                                                        size="small"
                                                        onClick={() => {
                                                            navigate(`${CODE_COLLAB}/${ele.name}`)
                                                        }}
                                                    >
                                                        Go To
                                                    </Button>
                                                    <Button
                                                        variant='contained'
                                                        size="small"
                                                        sx={{
                                                            bgcolor: "red",
                                                            color: "white"
                                                        }}
                                                        onClick={() => handleDeleteRoom(ele.name)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Box>
                                            </ListItemButton>
                                        </Box>
                                    )
                                })
                            ) :
                            (
                                <ListItem>
                                    No rooms have been added
                                </ListItem>
                            )
                    }
                </List>
            </Box>
        </Box>
    )
}

export default CodeHub