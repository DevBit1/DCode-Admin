import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { LOGIN } from '../../Constants/RoutePaths'

const Authenticated = ({ children }) => {


    const location = useLocation()
    const { user } = useSelector(state => state.auth)


    // console.log(location.pathname, "Inside Authenticated")


    if (!user) {
        return <Navigate to={`${LOGIN}?path=${location.pathname}`}></Navigate>
    }

    return children ? children : <Outlet />
}

export default Authenticated