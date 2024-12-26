import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import apiConnect from "../../Utils/ApiConnector"
import toast from "react-hot-toast"


export const loginUser = createAsyncThunk("login", async (values, thunkAPI) => {
    try {
        const response = await apiConnect("post", "/admin/login", values)

        localStorage.setItem("user", response.data.token)

        // "dispatch" resolves the call to "action" at runtime
        thunkAPI.dispatch(setUser(response.data.token))

        toast.success("Welcome to the admin panel")

        return response.data.token
    } catch (error) {
        toast.error(error.response?.data.message || error.message)
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
})




const initialState = {
    user: null,
    authLoading: false,
}

const authSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUser(state, action) {
            state.user = null
            localStorage.clear()
        },
        setUser(state, action) {
            state.user = action.payload
        }
    },
    extraReducers: (builder) => {
        // "action.payload" will contain the fulfilled return value 
        builder.addCase(loginUser.pending, (state, action) => {
            state.authLoading = true
        })
        builder.addCase(loginUser.rejected, (state, action) => {
            console.error(action.payload)
        })
        builder.addMatcher(loginUser.settled, (state, action) => {
            state.authLoading = false
        })
    }
})

export const { setUser, clearUser } = authSlice.actions
export default authSlice.reducer