import Editor from '@monaco-editor/react';
import { Box, Divider, Grid2, List, ListItemButton, ListItemIcon, ListItemText, Tab, Tabs, Collapse, Paper, Stack, ListItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";
import { NavLink, useLocation } from 'react-router-dom';
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import JsonView from '@uiw/react-json-view';


const Userdata = () => {

  const location = useLocation()
  const [code, setCode] = useState("")
  const [passedTests, setPassedTests] = useState({
    show: false,
    data: []
  })
  const [failedTests, setFailedTests] = useState({
    show: false,
    data: []
  })

  const [view, setView] = useState("code")

  const handleView = (event, newVal) => {
    console.log(newVal)
    setView(newVal)
  }

  const handleShowPassed = () => {
    setPassedTests(prev => ({
      ...prev,
      show: !prev.show
    }))
  }

  const handleShowFailed = () => {
    setFailedTests(prev => ({
      ...prev,
      show: !prev.show
    }))
  }


  useEffect(() => {
    // console.log("loc state", location)
    setCode(location.state.code)
    setPassedTests(prev => ({
      ...prev,
      data: location.state.passedTests
    }))
    setFailedTests(prev => ({
      ...prev,
      data: location.state.failedTests
    }))
  }, [location])

  return (
    <Box className="py-1 h-full max-h-full flex flex-col">
      <Grid2 container className="items-center">
        <Grid2 size={3}>
          <NavLink to={`../`}>
            <FaArrowLeft />
          </NavLink>
        </Grid2>
        <Grid2>
          <Tabs value={view} onChange={handleView}>
            <Tab label="Code" value={"code"} />
            <Tab label="Test Cases" value={"testcase"} />
          </Tabs>
        </Grid2>
      </Grid2>
      <Divider variant='fullWidth' />
      <Box className="flex-grow max-h-full overflow-y-auto">
        {
          view == "code" ?
            (
              <Editor
                height={"100%"}
                theme="vs-dark"
                value={code}
                options={{
                  readOnly: true
                }}
                className='mt-2'
              />
            ) :
            (
              <List>
                {
                  failedTests.data.length > 0 && (
                    <>
                      <ListItemButton
                        onClick={handleShowFailed}
                      >
                        <ListItemIcon>
                          <RxCross2 className='text-red-600 text-3xl' />
                        </ListItemIcon>
                        <ListItemText primary={"Failed Tests"} />
                        {
                          !failedTests?.show ?
                            (
                              <MdExpandMore />
                            ) :
                            (
                              <MdExpandLess />
                            )
                        }
                      </ListItemButton>
                      <Collapse in={failedTests.show} timeout="auto" unmountOnExit sx={{ px: 4 }}>
                        <Stack spacing={2} className='overflow-y-auto'>
                          {
                            failedTests?.data.map((ele) => {
                              return (
                                <Box
                                  className='bg-slate-300 p-2 rounded-md'
                                >
                                  <JsonView
                                    value={{
                                      name: ele.name,
                                      Expected: ele.expected,
                                      actual: ele.actual,
                                      input: ele?.input || "No Inputs"
                                    }}
                                  />
                                </Box>
                              )
                            })
                          }
                        </Stack>
                      </Collapse>
                    </>
                  )
                }

                {
                  failedTests.data.length > 0 && passedTests.data.length > 0 && (
                    <Divider variant='inset' />
                  )
                }

                {
                  passedTests.data.length > 0 && (
                    <>
                      <ListItemButton
                        onClick={handleShowPassed}
                      >
                        <ListItemIcon>
                          <TiTick className='text-green-600 text-3xl' />
                        </ListItemIcon>
                        <ListItemText primary={"Passed Tests"} />
                        {
                          !passedTests?.show ?
                            (
                              <MdExpandMore />
                            ) :
                            (
                              <MdExpandLess />
                            )
                        }
                      </ListItemButton>
                      <Collapse in={passedTests.show} timeout="auto" unmountOnExit sx={{ px: 4 }}>
                        <Stack spacing={2}>
                          {
                            passedTests?.data.map((ele) => {
                              return (
                                <Box
                                  className='bg-slate-300 p-2 rounded-md'
                                >
                                  <JsonView
                                    value={{
                                      name: ele.name,
                                      Expected: ele.expected,
                                      actual: ele.actual,
                                      input: ele?.input || "No Inputs"
                                    }}
                              
                                  />
                                </Box>
                              )
                            })
                          }
                        </Stack>
                      </Collapse>
                    </>
                  )
                }
              </List>
            )
        }
      </Box>
    </Box>
  )
}

export default Userdata