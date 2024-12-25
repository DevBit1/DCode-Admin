import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { links } from '../../Constants/NavBarLinks'
import { IoLogOut } from "react-icons/io5";
import LogoutModal from '../Modals/LogoutModal';


const SideNavBar = ({ className }) => {

    const [openModal, setOpenModal] = useState(false)

    const handleCloseModal = () => {
        console.log("Got invoked")
        setOpenModal(false)
    }

    // useEffect(() => {
    //     console.log(openModal)
    // }, [openModal])



    return (
        <List
            className={`flex flex-col gap-y-3 ${className} text-black`}
            sx={{
                position: {
                    xs: "absolute",
                    md: "relative"
                },
                zIndex: 10
            }}
        >
            {
                links.map((ele, id) => (
                    <NavLink to={ele.path} key={id} className='flex items-center'>
                        <ListItemButton>
                            <ListItemIcon className='text-xl'>
                                {ele.icon}
                            </ListItemIcon>
                            <ListItemText>
                                {ele.name}
                            </ListItemText>
                        </ListItemButton>
                    </NavLink>
                ))
            }
            <ListItemButton
                onClick={() => setOpenModal(true)}
            >
                <ListItemIcon className='text-xl'>
                    <IoLogOut />
                </ListItemIcon>
                <ListItemText
                >
                    Logout
                </ListItemText>
            </ListItemButton>

            
            <LogoutModal
                open={openModal}
                handleClose={handleCloseModal}
            />
        </List>
    )
}

export default SideNavBar