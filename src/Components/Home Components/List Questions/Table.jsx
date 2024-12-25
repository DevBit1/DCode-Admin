import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { HOME_CreateQuestion, QUESTION_DASHBOARD } from "../../../Constants/RoutePaths"
import { useQuestionContext } from '../../../Context/QuestionContextProvider'
import { getConvertedTime } from '../../../Utils/DateConverter'
import Loading from '../../Common/Loading'

function TableComponent({ tableCol = [], data = [], loading }) {

    const {
        handleSetEditQuestionObject
    } = useQuestionContext()




    const navigate = useNavigate()

    const setEdit = (question) => {
        handleSetEditQuestionObject(question)
        navigate(`../${HOME_CreateQuestion}`)
    }





    return (
        <TableContainer component={Box} className='rounded-md border-2  md:max-w-[70vw] w-full flex-1'>
            <Table
                stickyHeader
            >
                <TableHead>
                    <TableRow>
                        {
                            tableCol.map((ele, ind) => {
                                return (
                                    <TableCell
                                        key={ind}
                                        className='text-nowrap'
                                        sx={
                                            {
                                                fontWeight: 700
                                            }
                                        }
                                    >
                                        <Box className="flex gap-x-2">
                                            {
                                                ele.name
                                            }
                                        </Box>
                                    </TableCell>
                                )
                            })
                        }
                        <TableCell
                            className='text-nowrap font-bold'
                            sx={
                                {
                                    fontWeight: 700
                                }
                            }>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        loading ?
                            (
                                <TableRow

                                >
                                    <TableCell
                                        colSpan={tableCol.length + 1}
                                    >
                                        <Loading type='table' />
                                    </TableCell>
                                </TableRow>
                            ) :
                            (
                                data.length > 0 ? (
                                    data.map((ele, key) => (
                                        <TableRow key={key}>
                                            {
                                                tableCol.map((item, ind) => {
                                                    return (
                                                        <TableCell key={ind} className='text-nowrap w-max'>
                                                            {
                                                                item.name == "Tags" ?
                                                                    (
                                                                        <div className='min-w-[150px] max-w-[150px]'>
                                                                            <ul
                                                                                className='flex flex-wrap gap-2 items-center'
                                                                            >
                                                                                {
                                                                                    ele[item.accessor].slice(0, 3).map((tag) => (
                                                                                        <li
                                                                                            className='rounded-full px-2 py-1 text-center bg-blue-400 text-white font-semibold'
                                                                                        >
                                                                                            {tag.name.slice(0, 1).toUpperCase() + tag.name.slice(1).toLowerCase()}
                                                                                        </li>
                                                                                    ))
                                                                                }
                                                                                {
                                                                                    ele[item.accessor].length > 3 && (
                                                                                        <li
                                                                                            className='rounded-full px-2 py-1 text-center bg-blue-400 text-white font-semibold'
                                                                                        >
                                                                                            {
                                                                                                `+${ele[item.accessor].length - 3}`
                                                                                            }
                                                                                        </li>
                                                                                    )
                                                                                }
                                                                            </ul>
                                                                        </div>
                                                                    ) :
                                                                    (
                                                                        item.name == "Title" || item.name == "Difficulty" ?
                                                                            ele[item.accessor].slice(0, 1).toUpperCase() + ele[item.accessor].slice(1).toLowerCase() :
                                                                            item.name == "Created At" ?
                                                                                getConvertedTime(ele[item.accessor]) :
                                                                                ele[item.accessor]
                                                                    )
                                                            }
                                                        </TableCell>
                                                    )
                                                })
                                            }
                                            <TableCell>
                                                <Box className="flex gap-x-4 ">
                                                    <Button
                                                        variant="contained"
                                                        size='small'
                                                        onClick={() => setEdit(ele)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button variant="contained" size='small'>
                                                        <NavLink
                                                            to={`${QUESTION_DASHBOARD}/${ele._id}`}
                                                        >
                                                            Go to
                                                        </NavLink>
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) :
                                    (
                                        <TableRow

                                        >
                                            <TableCell
                                                colSpan={tableCol.length + 1}
                                                sx={{
                                                    textAlign: "center"
                                                }}
                                            >
                                                No Questions found
                                            </TableCell>
                                        </TableRow>
                                    )
                            )
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TableComponent