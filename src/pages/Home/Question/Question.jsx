import React, { useEffect, useState } from 'react'
import { useQuestionContext } from '../../../Context/QuestionContextProvider'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { HOME, HOME_CreateQuestion, HOME_CreateQuestion_CreateTestCases } from '../../../Constants/RoutePaths'
import { Formik, Field } from "formik"
import { Paper, TextField, Select, MenuItem, FormControl, InputLabel, Autocomplete, FormHelperText } from "@mui/material"
import axios from 'axios'
import { questionSchema } from '../../../Constants/Form Schemas/QuestionSchema'

const QuestionDetail = () => {


    const navigate = useNavigate()

    const [options, setOptions] = useState([])


    const {
        questionData: {
            title,
            question,
            params,
            tags,
            difficulty,
            codeStructure
        },
        handleQuestionFieldChange
    } = useQuestionContext()


    const goToNextPage = () => {
        navigate(`${HOME}/${HOME_CreateQuestion}/${HOME_CreateQuestion_CreateTestCases}`)
    }

    const fetchAllTags = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/tags`)
            console.log(response.data)
            setOptions(response.data.result)
        } catch (error) {
            console.error(error)
        }
    }


    const handleChangeCustom = (field, val) => {
        // console.log(field, val)
        handleQuestionFieldChange(field, val)
    }


    useEffect(() => {
        fetchAllTags()
    }, [])



    return (
        <Paper
            elevation={5}
        >
            <Formik
                initialValues={
                    {
                        title,
                        question,
                        params,
                        tags,
                        difficulty,
                        codeStructure
                    }
                }
                validationSchema={questionSchema}
                onSubmit={(values, actions) => {
                    // console.log(values)
                    goToNextPage()
                }}
                enableReinitialize={true}
            >
                {
                    ({ handleSubmit, handleChange, errors, touched, setFieldValue, setFieldTouched }) => (
                        <form
                            className='md:w-[400px] w-[70vw] h-max p-5 flex flex-col gap-y-3 rounded-lg'
                            onSubmit={handleSubmit}
                        >
                            <Field
                                as={TextField}
                                label="Title"
                                name="title"
                                placeholder="Give a title"
                                onChange={(e) => {
                                    handleChange(e) // This calls the internal "handleChange" of formik, which if not called won't update the Target's value
                                    handleChangeCustom(e.target.name, e.target.value) // This handle state change in the context
                                }}
                                error={touched.title && Boolean(errors.title)}
                                helperText={touched.title && errors.title}
                                size={"small"}

                            />
                            <Field
                                as={TextField}
                                multiline
                                label="Question"
                                name="question"
                                placeholder="Define the question"
                                // className="max-h-[150px] overflow-auto"
                                maxRows={7}
                                onChange={(e) => {
                                    handleChange(e) // This calls the internal "handleChange" of formik, which if not called won't update the Target's value
                                    handleChangeCustom(e.target.name, e.target.value) // This handle state change in the context
                                }}
                                error={touched.question && Boolean(errors.question)}
                                helperText={touched.question && errors.question}
                                size={"small"}

                            />
                            <Field
                                as={TextField}
                                label="Number of Params"
                                name="params"
                                placeholder="Set the number of params"
                                onChange={(e) => {
                                    handleChange(e) // This calls the internal "handleChange" of formik, which if not called won't update the Target's value
                                    // console.log("hi")
                                    handleChangeCustom(e.target.name, e.target.value) // This handle state change in the context
                                }}
                                inputProps={{ min: 1 }}
                                type="number"
                                error={touched.params && Boolean(errors.params)}
                                helperText={touched.params && errors.params}
                                size={"small"}

                            />
                            <FormControl fullWidth error={touched.difficulty && Boolean(errors.difficulty)} size={"small"}>
                                <InputLabel>Difficulty</InputLabel>
                                <Field
                                    as={Select}
                                    name="difficulty"
                                    label="Difficulty"
                                    onChange={(e) => {
                                        handleChange(e) // This calls the internal "handleChange" of formik, which if not called won't update the Target's value
                                        handleChangeCustom(e.target.name, e.target.value) // This handle state change in the context
                                    }}
                                    size={"small"}
                                >
                                    <MenuItem value="" disabled>Select one</MenuItem>
                                    <MenuItem value="easy">Easy</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="hard">Hard</MenuItem>
                                </Field>
                                {touched.difficulty && errors.difficulty && (
                                    <FormHelperText>{errors.difficulty}</FormHelperText>
                                )}
                            </FormControl>

                            <Field
                                as={TextField}
                                multiline
                                label="Function structure"
                                name="codeStructure"
                                placeholder="Give the structure of the function"
                                onChange={(e) => {
                                    handleChange(e) // This calls the internal "handleChange" of formik, which if not called won't update the Target's value
                                    handleChangeCustom(e.target.name, e.target.value) // This handle state change in the context
                                }}
                                error={touched.codeStructure && Boolean(errors.codeStructure)}
                                helperText={touched.codeStructure && errors.codeStructure}
                                size={"small"}

                            />

                            <Autocomplete
                                multiple
                                options={options}
                                value={tags}
                                onChange={(e, newValue) => {
                                    setFieldValue("tags", newValue) // We need to use this bcs "handleChange" of Formik isn't compatible with MUI Autocomplete
                                    handleChangeCustom("tags", newValue) // This handle state change in the context
                                }}
                                onBlur={() => setFieldTouched("tags", true)}
                                getOptionLabel={(option) => {
                                    const temp = option.name.split("")
                                    temp[0] = temp[0].toUpperCase()
                                    return temp.join("")
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Tags"
                                        error={touched.tags && Boolean(errors.tags)}
                                        helperText={touched.tags && errors.tags}
                                        size={"small"}

                                    />
                                )}
                            >
                            </Autocomplete>

                            <button
                                className='bg-slate-300 hover:cursor-pointer p-2 rounded-md hover:scale-90 transition-all duration-200'
                            // onClick={goToNextPage}
                            >
                                Next
                            </button>

                        </form>
                    )
                }
            </Formik>
        </Paper>
    )
}

export default QuestionDetail