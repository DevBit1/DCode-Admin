import { Button, Paper, Stack, TextField } from '@mui/material';
import { Field, Formik } from "formik";
import React, { useEffect } from 'react';
import { MdAdd } from "react-icons/md";
import { NavLink, useNavigate } from 'react-router-dom';
import { testCaseSchema } from '../../../Constants/Form Schemas/QuestionSchema';
import { useQuestionContext } from '../../../Context/QuestionContextProvider';
import toast from 'react-hot-toast';


const TestCasePage = () => {

    const {
        handleAddTestCase,
        handleCreateQuestion,
        handelUpdateQuestion,
        questionData: { testCases, params },
        numOfParams,
        handleResetTestCases,
        changeNumberOfParams,
        isEdit,
        updatedValues,
        handleChangeTestCaseField,
        handleChangeTestCaseFieldInput,
        handleRemoveTestCase
    } = useQuestionContext()

    const navigate = useNavigate()


    const handleCreate = async () => {

        if (isEdit) {
            const data = updatedValues()


            if (!data) {
                toast("No changes have been made")
            }
            else {
                handelUpdateQuestion(data, navigate)
            }
        }
        else {
            handleCreateQuestion(navigate)
        }

    }

    const handleChangeCustom = (field, value, index) => {
        handleChangeTestCaseField(index, field, value)
    }

    const handleInputChange = (inputIndex, value, index) => {
        handleChangeTestCaseFieldInput(index, inputIndex, value)
    }

    // This helps us reset the array if in case the user changes the numOfParams
    useEffect(() => {
        // This is to avoid resetting for the first render
        if (numOfParams !== params && numOfParams >= 0) {
            handleResetTestCases()
        }
        // console.log(params)
        changeNumberOfParams(params)
    }, [])



    return (
        <div className='md:w-[400px] w-[70vw] mt-5 min-h-[500px] max-h-[500px] flex flex-col justify-start items-center overflow-y-auto'>
            <div className='flex justify-between py-3 md:w-[300px] w-[50vw]'>
                <NavLink to={'../'}>
                    <div
                        className='bg-slate-300 hover:cursor-pointer p-2 rounded-md hover:scale-90 transition-all duration-200'
                    >
                        Back
                    </div>
                </NavLink>


                <div
                    className='bg-slate-300 flex items-center gap-x-2 max-w-max hover:cursor-pointer p-2 rounded-md hover:scale-90 transition-all duration-200'
                    onClick={handleAddTestCase}
                >
                    Add Test
                    <MdAdd />
                </div>

            </div>

            <Formik
                initialValues={{ testCases }}
                validationSchema={testCaseSchema}
                onSubmit={(values, actions) => {
                    console.log("hi")
                    handleCreate()
                }}
                enableReinitialize={true}

            >
                {
                    ({ handleSubmit, handleChange, errors, touched }) => (
                        <form
                            onSubmit={(e) => {
                                handleSubmit(e)
                            }}
                            className='flex flex-col justify-center items-center gap-y-4'
                        >
                            <Stack
                                spacing={2}
                                sx={{
                                    maxHeight:"350px",
                                    overflowY:"auto"
                                }}
                            >
                                {
                                    testCases.map((testCase, testCaseInd) => (
                                        <Paper
                                            elevation={4}
                                            key={testCaseInd}
                                        >
                                            <div
                                                className='md:w-[300px] w-[50vw] h-max px-3 py-4 flex flex-col gap-y-3 rounded-lg'
                                            >
                                                {
                                                    Object.keys(testCase).filter((ele) => ele !== "_id" && ele !== "__v").map((ele, ind) => {

                                                        if (ele == 'input') {

                                                            return (
                                                                testCase[ele].map((inp, index) => (
                                                                    <Field
                                                                        as={TextField}
                                                                        name={`testCases[${testCaseInd}].input[${index}]`}
                                                                        label={`Input ${index + 1}`}
                                                                        size={"small"}
                                                                        onChange={(e) => {
                                                                            handleChange(e)
                                                                            handleInputChange(index, e.target.value, testCaseInd)
                                                                        }}
                                                                        error={Boolean(errors.testCases?.[testCaseInd]?.input?.[index])}
                                                                        helperText={errors.testCases?.[testCaseInd]?.input?.[index]}
                                                                    />
                                                                ))
                                                            )
                                                        }
                                                        return (
                                                            <Field
                                                                as={TextField}
                                                                name={`testCases[${testCaseInd}].${ele}`}
                                                                label={ele.toUpperCase()}
                                                                size={"small"}
                                                                onChange={(e) => {
                                                                    handleChange(e)
                                                                    handleChangeCustom(ele, e.target.value, testCaseInd)
                                                                }}
                                                                error={Boolean(errors.testCases?.[testCaseInd]?.[ele])}
                                                                helperText={errors.testCases?.[testCaseInd]?.[ele]}
                                                            />
                                                        )
                                                    })
                                                }
                                                <Button
                                                    variant={'contained'}
                                                    onClick={() => handleRemoveTestCase(testCaseInd)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </Paper>
                                    ))
                                }
                            </Stack>
                            {
                                testCases.length > 0 && (
                                    <Button
                                        variant="contained"
                                        type='submit'
                                    >
                                        Submit
                                    </Button>
                                )
                            }
                        </form>
                    )
                }
            </Formik>
        </div>
    )
}

export default TestCasePage