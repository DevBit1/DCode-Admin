import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useSearchParams } from 'react-router-dom'
import { HOME, HOME_DASHBOARD } from '../../Constants/RoutePaths'

const LoginWrapper = ({ children }) => {

    const { user } = useSelector(state => state.auth)
    const [searchParams] = useSearchParams()

    // This helps us retain page location even in reloads
    const path = searchParams?.get('path') || `${HOME}/${HOME_DASHBOARD}`
    // console.log("Inside Login",location)

    if(user){
        return <Navigate to={path}/>
    }

    return (
        children
    )
}

export default LoginWrapper