import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { HOME_CreateQuestion, QUESTION_DASHBOARD } from "../../../Constants/RoutePaths"
import { useQuestionContext } from '../../../Context/QuestionContextProvider'
import { getConvertedTime } from '../../../Utils/DateConverter'
import Loading from '../../Common/Loading'
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { SORT_ORDER } from '../../../Constants/Values'

const eligibleSortTypes = [
    'serial',
    'title',
    'totalTestCases',
    'totalAttempts',
    'successfullAttempts',
]

function TableComponent({ tableCol = [], data = [], loading }) {

    const {
        handleSetEditQuestionObject
    } = useQuestionContext()

    // This will allow us to sort the array based on the selected type
    const [selectedSortType, setSelectedSortType] = useState(null)


    const handleSortData = (key, val) => {
        setSelectedSortType({
            key: key,
            order: val
        })
    }

    const handleSort = (data = []) => {
        if (selectedSortType) {
            let temp = structuredClone(data)
            if (selectedSortType.key == "title") {
                if (selectedSortType.order == SORT_ORDER.ASC) {
                    return temp.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
                }
                else {
                    return temp.sort((a, b) => b.title.toLowerCase().localeCompare(a.title.toLowerCase()))
                }
            }
            else {
                if (selectedSortType.order == SORT_ORDER.ASC) {
                    return temp.sort((a, b) => a[selectedSortType.key] - b[selectedSortType.key])
                }
                else {
                    return temp.sort((a, b) => b[selectedSortType.key] - a[selectedSortType.key])
                }
            }
        }
        return data
    }



    const navigate = useNavigate()

    const setEdit = (question) => {
        handleSetEditQuestionObject(question)
        navigate(`../${HOME_CreateQuestion}`)
    }

    useEffect(() => {
        setSelectedSortType(null)
    }, [data])


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
                                        <Box className="flex gap-x-2 items-center">
                                            {
                                                ele.name
                                            }
                                            {
                                                eligibleSortTypes.includes(ele.accessor) &&
                                                (
                                                    <Box>
                                                        <FaChevronUp
                                                            className='cursor-pointer'
                                                            onClick={() => {
                                                                handleSortData(ele.accessor, SORT_ORDER.ASC)
                                                            }}
                                                        />
                                                        <FaChevronDown
                                                            className='cursor-pointer'
                                                            onClick={() => {
                                                                handleSortData(ele.accessor, SORT_ORDER.DESC)
                                                            }}
                                                        />
                                                    </Box>
                                                )
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
                                    handleSort(data).map((ele, key) => (
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