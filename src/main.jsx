import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import axios from 'axios'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from "react-router-dom"
import QuestionContextProvider from './Context/QuestionContextProvider.jsx'
import SocketContextProvider from './Context/SocketContextProvider.jsx'
import './index.css'
import store from "./Redux/mainReducer.js"
import router from "./Routes/mainRouter.jsx"

// To allow receiving and sending "cookies"
axios.defaults.withCredentials = true

const theme = createTheme({
  palette: {
    primary: {
      main: "#ffb703"
    },
    customColor: {
      main: "#fb8500"
    },
    customColor2: {
      main: "#e4b61a"
    },
    textWhite: {
      main: "#ffffff",
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024
    }
  }
})



createRoot(document.getElementById('root')).render(

  // <StrictMode>
  <Provider store={store}>
    <SocketContextProvider>
      <QuestionContextProvider>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router}/>
          <CssBaseline />
        </ThemeProvider>
      </QuestionContextProvider>
    </SocketContextProvider>
  </Provider>
  //  </StrictMode>

)
