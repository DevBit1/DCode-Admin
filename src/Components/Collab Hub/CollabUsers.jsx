import { Box, Button, Checkbox, List, ListItem, ListItemButton, ListItemText, TextField, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import debounce from '../../Constants/debounce'
import apiConnect from '../../Utils/ApiConnector'
import { asyncWrapper } from '../../Utils/asyncWrapper'

const CollabUsers = ({ room }) => {

    const [search, setSearch] = useState("")
    const [users, setUsers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([]) // contains users who are presently selected for sending requests
    const [disabledUsers, setDisabledUsers] = useState([]) // Contains users who have already got a request or are online

    const fetchUsers = asyncWrapper(async (search = "", selectedUsers, disabledUsers) => {
        try {
            const response = await apiConnect("get", `/admin/getUsers?search=${search}`)

            console.log(response.data)
            const temp = response.data.users.map((ele) => {

                // This is for disabling
                ele.disabled = disabledUsers.find((item) => item._id == ele._id) || false
                // This is for the checkbox
                ele.checked = disabledUsers.find((item) => item._id == ele._id) ? true : (selectedUsers.find((item) => item._id == ele._id) ? true : false)

                return ele
            })

            setUsers(temp)
        } catch (error) {
            throw new Error(`Error fetching users : ${error.response?.data.message || error.message}`)
        }
    })

    // These are the users who have already got the requests
    const fetchDisabledUsers = asyncWrapper(async () => {
        try {
            const res = await apiConnect("get", `/getRoomRequests/${room}`)

            // console.log(res.data.requests)
            setDisabledUsers(res.data.requests)
        } catch (error) {
            throw new Error(`Error while fetching disabled users : ${error.response?.data.message || error.message}`)
        }
    })

    const sendRequest = asyncWrapper(async (selectedUsers, disableSelectedUsers) => {
        try {
            await apiConnect("post", "/send-request", {
                room,
                receiver: selectedUsers.map(ele => ele._id)
            })
            disableSelectedUsers()
        } catch (error) {
            throw new Error(`Error while sending requests : ${error.response?.data.message || error.message}`)
        }
    })

    const disableSelectedUsers = () => {
        setDisabledUsers(prev => [...prev, ...selectedUsers])
        setSelectedUsers([])
        setSearch("")
    }

    const debouncedFetchUsers = useCallback(debounce(fetchUsers, 300), [])
    const debouncedSendRequest = useCallback(debounce(sendRequest, 300), [])


    const handleSendRequest = () => {
        debouncedSendRequest(selectedUsers, disableSelectedUsers)
    }

    useEffect(() => {
        debouncedFetchUsers(search, selectedUsers, disabledUsers)
    }, [search])

    useEffect(() => {
        fetchDisabledUsers()
    }, [])



    return (
        <Box
            className='w-full h-full flex flex-col gap-y-4 py-3'
        >
            <Box
                className='w-full flex gap-x-3 px-2'
            >
                <TextField
                    label="Search User"
                    fullWidth
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {
                    Object.keys(selectedUsers).length > 0 && (
                        <Button
                            variant='contained'
                            size="small"
                            onClick={handleSendRequest}
                        >
                            <Typography
                                className='flex gap-x-2'
                                sx={{
                                    fontSize: "13px"
                                }}
                            >
                                Send
                                <Box>{Object.keys(selectedUsers).length}</Box>
                            </Typography>
                        </Button>
                    )
                }
            </Box>
            <Box
                className="flex-1 w-full overflow-auto"
            >
                <List>
                    {
                        !search.trim() ?
                            (
                                selectedUsers.length > 0 ?
                                    (
                                        selectedUsers.map((ele) => (
                                            <ListItemButton
                                                onClick={() => {
                                                    setSelectedUsers(prev => {
                                                        return prev.filter((item) => item._id !== ele._id)
                                                    })
                                                }}
                                                disabled={ele.disabled}
                                            >
                                                <Checkbox
                                                    checked={ele.checked}
                                                />
                                                <ListItemText primary={ele.name} />
                                            </ListItemButton>
                                        ))
                                    ) :
                                    (
                                        disabledUsers.map((ele) => (
                                            <ListItemButton
                                                disabled={true}
                                            >
                                                <Checkbox
                                                    checked={true}
                                                />
                                                <ListItemText primary={ele.name} />
                                            </ListItemButton>
                                        ))
                                    )
                            ) :
                            (
                                users.length > 0 ?
                                    (
                                        users.map((ele) => (
                                            <ListItemButton
                                                onClick={() => {
                                                    setUsers(prev => {
                                                        return prev.map((item => {
                                                            if (item._id == ele._id) {
                                                                item.checked = !item.checked

                                                                // Setting "selectedUsers" here bcs here we would know which element got changed and accordingly make changes to our "selectedUsers"
                                                                if (item.checked) {
                                                                    setSelectedUsers(prev => (
                                                                        [
                                                                            ...prev,
                                                                            ele
                                                                        ]
                                                                    ))
                                                                }
                                                                else {
                                                                    setSelectedUsers(prev => {
                                                                        return prev.filter((user) => user._id !== ele._id)
                                                                    })
                                                                }
                                                            }
                                                            return item
                                                        }))
                                                    })

                                                }}
                                                disabled={ele.disabled}
                                            >
                                                <Checkbox
                                                    checked={ele.checked}
                                                />
                                                <ListItemText primary={ele.name} />
                                            </ListItemButton>
                                        ))
                                    ) :
                                    (
                                        <ListItem>
                                            No users
                                        </ListItem>
                                    )
                            )
                    }
                </List>
            </Box>
        </Box>
    )
}

export default CollabUsers