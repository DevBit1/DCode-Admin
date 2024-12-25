import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { LOGIN } from '../../Constants/RoutePaths'

const Authenticated = ({ children, redirect }) => {

    // console.log(flag)

    const location = useLocation()
    const { user } = useSelector(state => state.auth)

    // console.log("Inside Authenticated, ",user)

    // This allows us to use this component even for preventing access to the login page
    let flag = location.pathname === LOGIN ? !user : !!user


    if (!flag) {
        return <Navigate to={redirect}></Navigate>
    }

    return children ? children : <Outlet />
}

export default Authenticated