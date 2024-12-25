import axios from "axios"

const axiosInstance = axios.create({
    baseURL: "http://localhost:5030/api/v1",
    withCredentials: true,
})

const apiConnect = (method, url, body, headers, params) => {
    return axiosInstance({
        method: method ? method.toLowerCase() : "get",
        url : url ? url : "/",
        data : body ? body : null,
        headers: headers ? headers : null,
        params : params ? params : null
    })
}

export default apiConnect