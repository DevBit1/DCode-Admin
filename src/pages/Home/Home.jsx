import React, { useState } from 'react'
import SideNavBar from '../../Components/Home Components/SideNavBar'
import { Outlet } from 'react-router-dom'
import { GoSidebarCollapse } from "react-icons/go";
import { GoSidebarExpand } from "react-icons/go";



const Home = () => {


    const [showSideBar, setShowSideBar] = useState(false)

    return (
        <div className='flex flex-col w-full h-full'>
            <div className='min-w-full mt-7 px-2 md:hidden'>
                {
                    showSideBar ?
                        (
                            <GoSidebarExpand
                                size={"30px"}
                                onClick={() => setShowSideBar(prev => !prev)}
                            />
                        ) : (
                            <GoSidebarCollapse
                                size={"30px"}
                                onClick={() => setShowSideBar(prev => !prev)}
                            />
                        )
                }
            </div>
            <div className='flex w-full h-full relative'>
                <SideNavBar className={`${showSideBar ? 'block' : 'hidden md:block'
                    } md:w-1/5 min-h-screen bg-[#fb8500] text-white p-5 overflow-y-auto`} />
                <div 
                    className='md:w-4/5 w-full flex justify-center h-full'
                >
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Home