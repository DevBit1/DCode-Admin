import * as yup from "yup"

const isValidJson = (val) => {
    try {
        JSON.parse(val)
        return true
    } catch (error) {
        return false
    }
}


export const questionSchema = yup.object({
    title: yup.string().required("Title is required"),
    question: yup.string().required("Please define the question"),
    params: yup.number().required("Please provide number of params"),
    codeStructure: yup.string().required("Please provide the skeleton of the function"),
    difficulty: yup.string().required("Select a difficulty"),
    tags: yup.array().min(1, "Please select atleast one tag")
})

export const testCaseSchema = yup.object({
    testCases: yup.array().of(
        yup.object({
            description: yup.string().required("Please provide Test Desc"),
            // the ".of()" lets us specify schema validation to each element of the array
            input: yup.array().of(
                yup.string().required("Please give a input").test("is-JSON", "Invalid JSON format", (value) => {
                    return isValidJson(value); // Validate each element individually
                })
            ),
            output: yup.string().required("Please specify the output").test("is-JSON", "Output is not a valid JSON", (value, context) => {
                return isValidJson(value)
            })
        })
    )
})