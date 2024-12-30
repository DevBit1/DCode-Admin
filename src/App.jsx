import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, RouterProvider, useNavigate } from 'react-router-dom'
import { setUser } from './Redux/slices/authSlice'
import router from './Routes/mainRouter'
import { HOME, LOGIN } from './Constants/RoutePaths'


const App = () => {

  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Persistent login, the socket is getting connected in its context provider
  useEffect(() => {
    if (localStorage.getItem("user")) {
      dispatch(setUser(localStorage.getItem("user")))
    }
  }, [])


  return (
    <div className='h-screen w-screen flex justify-center items-center'>
      <Toaster
        position="top-center"
      />
      {/* <RouterProvider router={router}></RouterProvider> */}
      <Outlet />
    </div>
  )
}

export default App