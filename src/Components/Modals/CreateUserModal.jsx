import { Button, Dialog, DialogTitle, IconButton, TextField } from '@mui/material';
import { Field, Formik } from 'formik';
import React, { useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import createUserSchema from '../../Constants/Form Schemas/CreateUserSchema';
import apiConnect from '../../Utils/ApiConnector';
import toast from 'react-hot-toast';
import { asyncWrapper } from '../../Utils/asyncWrapper';


const CreateUserModal = ({ open, handleClose, handleAddUser }) => {


    const [loading, setLoading] = useState(false)

    const handleSubmitAction = asyncWrapper(async (values) => {
        const response = await apiConnect("post", "/admin/createUser", values)
        const user = {
            ...response.data.user,
            attemptedQuestions: 0,
            solvedQuestions: 0,
            notAttemptedQuestions: response.data.totalQuestions
        }
        // console.log(response.data)
        handleAddUser(user)
        toast.success("User created successfully")
        handleClose()
    })

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle className='flex justify-between items-center gap-x-3 w-full' >
                Create a New User
                <IconButton onClick={handleClose} >
                    <RxCross2 size={20} />
                </IconButton>
            </DialogTitle>
            <Formik
                initialValues={{
                    name: "",
                    email: ""
                }}
                validationSchema={createUserSchema}
                onSubmit={(values, action) => {
                    console.log(values)
                    setLoading(true)
                    handleSubmitAction(values).finally(() => setLoading(false))
                }}
            >
                {
                    ({ errors, touched, handleSubmit }) => (
                        <form
                            className='flex flex-col px-4 mb-5 lg:w-[30vw] gap-y-3'
                            onSubmit={handleSubmit}
                        >
                            <Field
                                as={TextField}
                                name="name"
                                label="Name"
                                size="small"
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors?.name}
                                required
                            />
                            <Field
                                as={TextField}
                                name="email"
                                label="Email"
                                size="small"
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors?.email}
                                required
                            />
                            <Button
                                variant='contained'
                                type='submit'
                                disabled={loading}
                            >
                                Create
                            </Button>
                        </form>
                    )
                }
            </Formik>
        </Dialog>
    )
}

export default CreateUserModal