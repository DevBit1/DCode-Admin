import React, { useEffect } from 'react'
import Container from '../../../Components/Common/Container'
import { Outlet } from 'react-router-dom'
import { useQuestionContext } from '../../../Context/QuestionContextProvider'

const QuestionCreationContainer = () => {


    const { handleResetQuestion, editQuestion, handleSetQuestionObject } = useQuestionContext()


    // Be sure to remove StrictMode since the useEffect will run twice(which would never let us assign the edited Question values)
    // This makes sure that our page clears up all data whenever the main parent component unmounts
    // We can't apply in inside <Question/> or <TestCasePage/>
    useEffect(() => {
        if(editQuestion){
            handleSetQuestionObject(editQuestion)
        }

        return () => {
            handleResetQuestion()
        }
    }, [])


    return (
        <Container>
            <Outlet />
        </Container>
    )
}

export default QuestionCreationContainer