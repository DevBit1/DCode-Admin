import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid2";
import MarkdownPreview from '@uiw/react-markdown-preview';
import React, { createContext, useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { HOME, HOME_ListQuestion } from '../../Constants/RoutePaths';
import apiConnect from '../../Utils/ApiConnector';
import { debounce } from '@mui/material';
import { GoSidebarCollapse } from "react-icons/go";
import { GoSidebarExpand } from "react-icons/go";


const reducer = (state, action) => {
  switch (action.type) {
    case "page": {
      return {
        ...state,
        page: action.payload
      }
    }
    case "limit": {
      return {
        ...state,
        limit: action.payload
      }
    }
    case "name": {
      return {
        ...state,
        name: action.payload
      }
    }
  }
}

const Datacontext = createContext({})



const QuestionDashBoard = () => {

  const { qId } = useParams()

  // Used to store data from server
  const [question, setQuestion] = useState("")
  const [solutions, setSolutions] = useState([])
  const [totalPages, setTotalPages] = useState(1)

  // To manage data in the UI
  const [fetchParams, dispatch] = useReducer(reducer, { page: 1, limit: 10, name: "" })
  const [showSideBar, setShowSideBar] = useState(false)





  const fetchQuestionDetails = async (page, limit, name) => {
    try {
      // console.log("Calling api.........")
      const response = await apiConnect("get", `/admin/question/${qId}`, null, null, {
        page: page,
        limit: limit,
        search: name.trim()
      })

      setQuestion(response.data.question.question)
      setSolutions(response.data.solutions)
      setTotalPages(response.data.totalPages)

    } catch (error) {
      console.error("Error while fetching question details", error)
    }
  }

  const debouncedFunc = useCallback(debounce(fetchQuestionDetails, 300), [])



  useEffect(() => {
    console.log(fetchParams)
    if (qId) {
      debouncedFunc(fetchParams.page, fetchParams.limit, fetchParams.name)
    }
  }, [fetchParams])



  return (
    <Box
      className="w-screen h-full flex flex-col"
    >
      <Box className="flex justify-between px-3 bg-[#e4b61a]">
        <div className='flex p-2 md:p-3 justify-between items-center'>
          <NavLink to={`${HOME}/${HOME_ListQuestion}`}>
            <FaArrowLeft />
          </NavLink>
        </div>
        <div className='md:hidden border-2 border-red-700'>
          {
            showSideBar ?
              (
                <GoSidebarCollapse size={"30px"} onClick={() => setShowSideBar(prev => !prev)}/>
              ) :
              (
                <GoSidebarExpand size={"30px"} onClick={() => setShowSideBar(prev => !prev)}/>
              )
          }
        </div>
      </Box>
      <Grid
        container
        className="w-[100%] flex-1 overflow-y-auto"
        spacing={2}
      >
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
          className="overflow-y-auto"
        >
          <MarkdownPreview
            source={question}
            style={{ padding: 16, height: "100%" }}
          >
          </MarkdownPreview>
        </Grid>
        <Grid
          size={
            {
              xs: 12,
              md: 6,
            }
          }
          className={`h-full p-2 md:block md:static absolute ${showSideBar ? "block" : "hidden"} bg-white`}
        >
          <Datacontext.Provider value={{ fetchParams, handler: dispatch, solutions, totalPages }}>
            <Outlet />
          </Datacontext.Provider>
        </Grid>
      </Grid>
    </Box>
  )
}

export const useDataContext = () => useContext(Datacontext)


export default QuestionDashBoard