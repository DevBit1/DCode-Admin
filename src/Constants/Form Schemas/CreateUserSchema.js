import * as yup from "yup"


const createUser = yup.object({
    email: yup.string().email("Not a valid email format").required("Email is required"),
    name: yup.string().required("Please provide a name to the user")
})

export default createUser