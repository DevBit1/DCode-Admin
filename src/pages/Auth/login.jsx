import { Button, Paper, TextField } from "@mui/material"
import { Field, Formik } from "formik"
import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import loginSchema from '../../Constants/Form Schemas/LoginFormSchema'
import { useSocketContext } from '../../Context/SocketContextProvider'
import { loginUser } from "../../Redux/slices/authSlice"




const Login = () => {

  
  const { authLoading } = useSelector(state => state.auth)
  const dispatch = useDispatch()


  const handleLogin = (val) => {
    dispatch(loginUser(val))
  }



  return (
    <Paper
      elevation={5}
      className='md:w-[30vw]'
    >
      <Formik
        initialValues={{
          email: "",
          password: ""
        }}
        onSubmit={(values, actions) => {
          handleLogin(values)
        }}
        validationSchema={loginSchema}
      >
        {
          ({ errors, handleSubmit, touched }) => (
            <form
              className='min-w-full max-w-full flex flex-col p-5 gap-y-3'
              onSubmit={handleSubmit}
            >
              <Field
                as={TextField}
                name="email"
                label="Email"
                type="email"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors?.email}
                placeholder="Email Address"
                required
              />
              <Field
                as={TextField}
                name="password"
                label="Password"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors?.password}
                placeholder="Your password"
                type="password"
                required
              />
              <Button
                variant='contained'
                type='submit'
                disabled={authLoading}
              >
                Log In
              </Button>
            </form>
          )
        }
      </Formik>
    </Paper>
  )
}

export default Login