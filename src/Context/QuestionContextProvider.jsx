import { createContext, useCallback, useContext, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { HOME, HOME_ListQuestion } from "../Constants/RoutePaths";
import debounce from "../Constants/debounce";
import apiConnect from "../Utils/ApiConnector";
import { asyncWrapper } from "../Utils/asyncWrapper";
import toast from "react-hot-toast";



const QuestionContext = createContext({})

// I didn't go for using custom hook for creating a question bcs then when we take in picture the "edit question" functionality we need to use the same "Question" page for editting and since we can't send data between siblings i would have to manage the "selected question for edit" in a context level state , and in the "Question" page then we would have to conditional render based on the context-level state / custom-hook state.

// But if I use only the context API approach we will have only one state to manage , no more conditional rendering in the "Question" page
const QuestionContextProvider = ({ children }) => {

    const [isEdit, setIsEdit] = useState(false)
    const [editQuestion, setEditQuestion] = useState(null)

    const { user } = useSelector(state => state.auth)

    const reducer = (state, action) => {
        switch (action.type) {
            case "title": {
                return {
                    ...state,
                    title: action.value
                };
            }
            case "question": {
                return {
                    ...state,
                    question: action.value
                }
            }
            case "params": {
                return {
                    ...state,
                    params: action.value
                }
            }
            case "codeStructure": {
                return {
                    ...state,
                    codeStructure: action.value
                }
            }
            case "difficulty": {
                return {
                    ...state,
                    difficulty: action.value
                }
            }
            case "tags": {
                return {
                    ...state,
                    tags: [...action.value]
                }
            }
            case "resetTestCases": {
                return {
                    ...state,
                    testCases: []
                }
            }
            case "addTestCase": {

                return {
                    ...state,
                    testCases: [...state.testCases, action.payload]
                }
            }
            case "removeTestCase": {
                return {
                    ...state,
                    testCases: state.testCases.filter((ele, ind) => ind !== action.payload)
                }
            }
            case "changeTestField": {
                // Here we need the index of the testCase, testField name (except "input"), value

                // This will contain the new updated testcase array
                const updatedTestCases = structuredClone(state.testCases)

                updatedTestCases[action.testCaseIndex][action.testCaseField] = action.value

                return {
                    ...state,
                    testCases: updatedTestCases
                }
            }
            case "changeTestFieldInput": {
                // Here we will need the index of "testCase", index of the "input" array and the value for that "input" index
                const updatedTestCases = structuredClone(state.testCases)

                updatedTestCases[action.testCaseIndex]["input"][action.testCaseInputIndex] = action.value

                return {
                    ...state,
                    testCases: updatedTestCases
                }
            }
            case "reset": {
                return {
                    title: "",
                    question: "",
                    params: 1,
                    testCases: [],
                    codeStructure: "",
                    difficulty: "",
                    tags: []
                }
            }
            case "setQuestionObject": {

                // The "structuredClone" helps us create a deep copy of even the nested objects which if not done would lead to failing the 
                // the intension behind this state
                // console.log("Here I am ,", action.payload)
                const newObj = structuredClone(action.payload)

                return newObj
            }
        }

        throw Error("Unknown action " + action.type)
    }


    const [state, dispatch] = useReducer(reducer, {
        title: "",
        question: "",
        params: 1,
        testCases: [],
        codeStructure: "",
        difficulty: "",
        tags: []
    })


    // This state is to let us reset the testCases array in case the user changes the number of params after going through the testCase page
    const [numOfParams, setNumOfParams] = useState(-1)



    // This function "sets" "numOfParams" to check if the user has been changing the "params" multiple times in which case we reset the "testCases" array
    const changeNumberOfParams = (val) => {
        setNumOfParams(val)
    }


    // The following 7 functions are for manipulating form data and creating a question

    const handleQuestionFieldChange = (field, val) => {
        dispatch({
            type: field,
            value: val
        })
    }

    const handleResetTestCases = () => {
        dispatch({
            type: "resetTestCases"
        })
    }

    const handleAddTestCase = asyncWrapper(async () => {

        const payload = {
            description: 'Empty',
            input: new Array(Number(state.params)).fill(""),
            output: 'Empty',
            matcher: 'toBe'
        }

        // console.log(user)

        try {
            if (isEdit) {

                const response = await apiConnect("put", `/admin/testcase/add/${editQuestion._id}`, payload, {
                    Authorization: `Bearer ${user}`
                })

                console.log(response.data.newTest)

                // Bcs when we "edit" after add we need "_id" which doesn't exist for a newly added testCase since the above mentioned
                // "payload" doesn't have a _id which will lead to creation of a testCase with "_id : null"
                payload._id = response.data.newTest._id

                // This handles the changes for to the Questions-list since we have avoided fetching all questions always
                setQuestions(prev => {
                    return prev.map((ele) => {
                        if (ele._id == editQuestion._id) {
                            return { ...ele, testCases: [...ele.testCases, payload] }
                        }
                        return ele
                    })
                })
            }

            dispatch({
                type: "addTestCase",
                payload
            })
        } catch (error) {
            throw new Error(`Error while adding TestCase : ${error.response?.data.message || error.message}`)
        }
    })

    const handleRemoveTestCase = asyncWrapper(async (id) => {

        try {
            if (isEdit) {
                const isConfirm = window.confirm("Are you sure you want to delete this TestCase?")

                // We are getting an index from the "caller" so we have to get the "_id" of the testCase to send to the server
                const { _id: tId } = state.testCases.find((ele, ind) => ind == id)

                if (isConfirm) {
                    // const response = await axios.put(`${import.meta.env.VITE_BASE_URL_ADMIN}/testcase/remove?qId=${editQuestion._id}&tId=${tId}`, {}, {
                    //     headers: {
                    //         Authorization: `Bearer ${user?.token}`
                    //     }
                    // })

                    const response = await apiConnect("put", `/admin/testcase/remove`, null, {
                        Authorization: `Bearer ${user}`
                    }, {
                        qId: editQuestion._id,
                        tId: tId
                    })

                    console.log(response.data)

                    setQuestions(prev => {
                        return prev.map((ele) => {
                            if (ele._id == editQuestion._id) {
                                return { ...ele, testCases: ele.testCases.filter((item) => item._id != tId) }
                            }
                            return ele
                        })
                    })

                    dispatch({
                        type: "removeTestCase",
                        payload: id
                    })
                }
            }
            else {
                dispatch({
                    type: "removeTestCase",
                    payload: id
                })
            }
        } catch (error) {
            throw new Error(`Error while removing TestCase : ${error.response?.data.message || error.message}`)
        }

    })

    const handleChangeTestCaseField = (testCaseIndex, testCaseField, value) => {
        dispatch({
            type: "changeTestField",
            testCaseIndex,
            testCaseField,
            value
        })
    }

    const handleChangeTestCaseFieldInput = (testCaseIndex, testCaseInputIndex, value) => {
        dispatch({
            type: "changeTestFieldInput",
            testCaseIndex,
            testCaseInputIndex,
            value
        })
    }

    const handleResetQuestion = () => {
        setIsEdit(false)
        setEditQuestion(null)
        dispatch({
            type: "reset"
        })
    }

    const handleCreateQuestion = asyncWrapper(async (navigate) => {
        try {

            const response = await apiConnect("post", "/admin/question", state, {
                Authorization: `Bearer ${user}`
            })

            dispatch({
                type: "reset"
            })



            toast.success("Question created")

            navigate(`${HOME}/${HOME_ListQuestion}`)
        } catch (error) {
            throw new Error(error.response?.data.message || error.message)
        }
    })


    // The following 3 functions are used while updating a question

    // This function returns an object with all the changed values
    const updatedValues = () => {
        const formData = {}

        if (editQuestion.title !== state.title) {
            formData.title = state.title
        }

        if (editQuestion.question !== state.question) {
            formData.question = state.question
        }

        if (editQuestion.params !== state.params) {
            formData.params = state.params
        }

        if (editQuestion.difficulty !== state.difficulty) {
            formData.difficulty = state.difficulty
        }

        if (JSON.stringify(editQuestion.testCases) !== JSON.stringify(state.testCases)) {
            // The "structuredClone" helps us create a deep copy of even the nested objects
            // formData.testCases = structuredClone(state.testCases)

            // This is to ensure only the updated testCases are added and not all testCases as in the above case
            let temp = editQuestion.testCases.map((ele) => JSON.stringify(ele))

            let filteredData = state.testCases.filter((ele) => !temp.includes(JSON.stringify(ele)))

            // This is to make sure "edit" doesn't happen if changes are only made in terms of removing testCases
            // since we will be managing remove testCases separately

            // Would add a testCase twice if not for the validation XXXXXX
            if (filteredData.length > 0) {
                formData.testCases = filteredData
            }
        }

        if (JSON.stringify(editQuestion.tags) !== JSON.stringify(state.tags)) {
            // Should i check for empty array
            formData.tags = state.tags
        }

        if (editQuestion.codeStructure !== state.codeStructure) {
            formData.codeStructure = state.codeStructure
        }

        if (Object.keys(formData).length == 0) {
            return false
        }

        return formData
    }

    const handelUpdateQuestion = asyncWrapper(async (val, navigate) => {
        try {

            const response = await apiConnect("put", `/admin/question/${editQuestion._id}`, val, {
                Authorization: `Bearer ${user}`
            })

            handleResetQuestion()

            navigate(`${HOME}/${HOME_ListQuestion}`)

        } catch (error) {
            throw new Error(`Error while updating question : ${error.response?.data.message || error.message}`)
        }
    })

    const handleSetEditQuestionObject = (val) => {

        console.log("Received for Edit,", val)

        setIsEdit(true)
        setEditQuestion(structuredClone(val))
    }

    const handleSetQuestionObject = (val) => {
        console.log("Received this : ", val)

        dispatch({
            type: "setQuestionObject",
            payload: val
        })
    }





    const values = {
        questionData: state,
        numOfParams,
        isEdit,
        editQuestion,
        changeNumberOfParams,
        handleQuestionFieldChange,
        handleResetTestCases,
        handleAddTestCase,
        handleRemoveTestCase,
        handleChangeTestCaseField,
        handleChangeTestCaseFieldInput,
        handleResetQuestion,
        handleCreateQuestion,
        handelUpdateQuestion,
        handleSetQuestionObject,
        handleSetEditQuestionObject,
        updatedValues,
    }


    return (
        <QuestionContext.Provider value={values}>
            {
                children
            }
        </QuestionContext.Provider>
    )
}

export const useQuestionContext = () => useContext(QuestionContext)

export default QuestionContextProvider