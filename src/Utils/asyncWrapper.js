import toast from "react-hot-toast"


export const asyncWrapper = (AFunction) => {
    return async function (...args) {
        return Promise.resolve(AFunction(...args)).catch((error) => {
            console.error(error)
            toast.error(error.response?.data.message || error.message)
        })
    }
}