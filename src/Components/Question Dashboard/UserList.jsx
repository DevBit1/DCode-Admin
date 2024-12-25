import {
    Box,
    Collapse,
    FormControl,
    InputLabel,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    Typography,
    Pagination
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FaUser } from "react-icons/fa";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { NavLink } from 'react-router-dom';
import { QUESTION_DASHBOARD_USER } from '../../Constants/RoutePaths';
import { useDataContext } from '../../pages/Question Dashboard';
import PaginationComponent from '../Common/PaginationComponent';


const Userlist = () => {

    const { fetchParams: { page, limit, name }, handler: dispatchFunction, solutions, totalPages } = useDataContext()

    //Since we will have multiple Users, and each user will need its own dropdown, thats why taking this array helps in tracking the flag for each user
    const [open, setOpen] = useState([])

    const handleClick = (ind) => {
        console.log(ind)
        setOpen(prev => {
            prev[ind] = !prev[ind]
            return [...prev]
        })
    }

    const handlePageChange = (val) => {
        dispatchFunction({
            type:"page",
            payload:val
        })
    }

    useEffect(() => {
        if (solutions.length > 0) {
            setOpen(new Array(solutions.length).fill(false))
        }
    }, [solutions.user])


    return (
        <div className='h-full w-full max-w-full overflow-auto flex flex-col'>
            <header>
                <Typography variant="h3" component="h2">
                    Users
                </Typography>
                <hr />
            </header>
            <Box className='max-h-max flex justify-between px-2 mt-3'>
                <FormControl size="small">
                    <InputLabel id="rows_per_page">Rows</InputLabel>
                    <Select
                        size='small'
                        labelId="rows_per_page"
                        id="rows_per_page"
                        value={limit}
                        onChange={(e) => dispatchFunction({ type: "limit", payload: e.target.value })}
                        className='min-w-[100px]'
                        label="Rows"
                    >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={30}>50</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    value={name}
                    label="Search"
                    size='small'
                    className='ml-3'
                    onChange={(e) => dispatchFunction({ type: "name", payload: e.target.value })}
                />
            </Box>
            {
                solutions.length > 0 ?
                    (
                        <>
                            <List className='flex flex-col flex-1 min-w-full overflow-y-auto'>
                                {

                                    solutions.map((ele, ind) => (
                                        <Box>
                                            <ListItemButton onClick={() => handleClick(ind)}>
                                                <ListItemIcon>
                                                    <FaUser />
                                                </ListItemIcon>
                                                <ListItemText primary={ele.user.name} />
                                                {
                                                    !open[ind] ?
                                                        (
                                                            <MdExpandMore />
                                                        ) :
                                                        (
                                                            <MdExpandLess />
                                                        )
                                                }
                                            </ListItemButton>
                                            <Collapse in={open[ind]} timeout="auto" unmountOnExit>
                                                <List component="div" disablePadding>
                                                    {
                                                        ele.solutions.map((ele, index, theArr) => {
                                                            return (
                                                                <NavLink
                                                                    to={`../${QUESTION_DASHBOARD_USER}`}
                                                                    state={ele}
                                                                >
                                                                    <ListItemButton sx={{ pl: 4, color: ele.success ? "green" : "red" }}>
                                                                        {
                                                                            `Attempt ${theArr.length - index}`
                                                                        }
                                                                    </ListItemButton>
                                                                </NavLink>
                                                            )
                                                        })
                                                    }
                                                </List>
                                            </Collapse>
                                        </Box>
                                    ))
                                }
                            </List>
                            <Box className=' max-h-max flex justify-center px-2 py-1'>
                                {/* <Pagination count={totalPages} page={page} onChange={(e, value) => dispatchFunction({ type: "page", payload: value })} showFirstButton showLastButton /> */}
                                <PaginationComponent
                                    totalPages={totalPages}
                                    page={page}
                                    handlePageChange={handlePageChange}
                                    showFirstButton={true}
                                    showLastButton={true}
                                />
                            </Box>
                        </>
                    ) :
                    (
                        <Typography>
                            No users have attempted the question yet
                        </Typography>
                    )
            }
        </div >
    )
}

export default Userlist