import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { setUser } from './Redux/slices/authSlice'
import router from './Routes/mainRouter'


const App = () => {


  const dispatch = useDispatch()

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
      <RouterProvider router={router}></RouterProvider>
    </div>
  )
}

export default App