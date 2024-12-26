import { Box, Button, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { MdAdd } from "react-icons/md"
import PaginationComponent from '../../Components/Common/PaginationComponent'
import CreateUserModal from '../../Components/Modals/CreateUserModal'
import TableSchema from "../../Constants/Tables/userTableSchema"
import debounce from "../../Constants/debounce"
import { useSocketContext } from '../../Context/SocketContextProvider'
import apiConnect from '../../Utils/ApiConnector'
import { asyncWrapper } from '../../Utils/asyncWrapper'
import { getConvertedTime } from '../../Utils/DateConverter'
import Loading from '../../Components/Common/Loading'
import { SORT_ORDER } from '../../Constants/Values'
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";

// We are using property names "accessors"
const eligibleSortTypes = [
  'name',
  'attemptedQuestions',
  'solvedQuestions',
  'notAttemptedQuestions',
]

const User = () => {

  const { onlineUsers } = useSocketContext()
  const [users, setUsers] = useState([])


  const [sortOrder, setSortOrder] = useState("desc")
  const [name, setName] = useState("")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  const [loading, setLoading] = useState(true)

  const [openModal, setOpenModal] = useState(false)

  // This will allow us to sort the array based on the selected type
  const [selectedSortType, setSelectedSortType] = useState(null)

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const fetchAllUsers = asyncWrapper(async ({ name, order, page, limit }) => {
    try {
      setLoading(true)
      const response = await apiConnect("get", "/admin/getAll", null, null, {
        search: name,
        order,
        page,
        limit
      })

      setUsers(response.data.users)
      setTotalPages(response.data.totalPages)
      setSelectedSortType(null)
    } catch (error) {
      throw new Error(`Error while fetching all Users : ${error.response?.data.message || error.message}`)
    }
    finally {
      setLoading(false)
    }
  })

  const debouncedFetchAllUsers = useCallback(debounce(fetchAllUsers, 400), [])

  const handleAddUser = (val) => {
    if (users.length < limit) {
      if (sortOrder == "desc") {
        setUsers(prev => [val, ...prev])
      }
      else {
        setUsers(prev => [...prev, val])
      }
    }
    else {
      if (sortOrder == "desc") {
        let temp = structuredClone(users)
        temp.pop()
        temp.unshift(val)
        setUsers(temp)
      }
    }
  }

  const handlePageChange = (val) => {
    setPage(val)
  }

  const handleSortData = (key, val) => {
    setSelectedSortType({
      key: key,
      order: val
    })
  }

  const handleSort = (data = []) => {
    if (selectedSortType) {
      let temp = structuredClone(data)
      if (selectedSortType.key == "name") {
        if (selectedSortType.order == SORT_ORDER.ASC) {
          return temp.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
        }
        else {
          return temp.sort((a, b) => b.name.toLowerCase().localeCompare(a.name.toLowerCase()))
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

  useEffect(() => {

    debouncedFetchAllUsers({ name, page, limit, order: sortOrder })

  }, [name, page, limit, sortOrder])



  return (
    <Box
      className="lg:w-[70vw] w-full px-3 py-2 h-full flex flex-col"
    >
      <Box
        className="p-2 flex justify-between items-center"
      >
        <Box className="flex gap-x-3">
          <TextField
            label="Search by name"
            size="small"
            placeholder='Type a name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormControl>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOrder}
              label="Sort By"
              size="small"
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <MenuItem disabled>User created</MenuItem>
              <MenuItem value="asc">Oldest</MenuItem>
              <MenuItem value="desc">Latest</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button
          variant='contained'
          className='flex gap-x-1 items-center'
          onClick={() => setOpenModal(prev => !prev)}
        >
          Add User
          <MdAdd size={20} />
        </Button>
        <CreateUserModal open={openModal} handleClose={handleCloseModal} handleAddUser={handleAddUser} />
      </Box>

      <TableContainer className='flex-1 border-2 rounded-md'>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {
                TableSchema.map((ele, ind) => (
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
                      {ele.name}
                      {
                        eligibleSortTypes.includes(ele.accessor) && (
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
                ))
              }
              <TableCell
                sx={
                  {
                    fontWeight: 700
                  }
                }
              >
                Status
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
                      colSpan={TableSchema.length + 1}
                    >
                      <Loading type='table' />
                    </TableCell>
                  </TableRow>
                ) :
                (
                  users.length > 0 ?
                    (
                      handleSort(users).map((ele) => (
                        <TableRow key={ele._id}>
                          {
                            TableSchema.map((item, ind) => (
                              <TableCell key={ind}>
                                {
                                  item.name == "Created At" ?
                                    getConvertedTime(ele[item.accessor]) :
                                    ele[item.accessor]
                                }
                              </TableCell>
                            ))
                          }
                          <TableCell>
                            {onlineUsers.includes(ele._id) ? "Online" : "Offline"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) :
                    (
                      <TableRow>
                        <TableCell colSpan={TableSchema.length} sx={{
                          textAlign: "center"
                        }}>
                          No user found with the specified name
                        </TableCell>
                      </TableRow>
                    )
                )
            }
          </TableBody>
        </Table>
      </TableContainer>

      <Box className="flex justify-between items-center px-3">
        <FormControl size='small'>
          <InputLabel>Rows per page</InputLabel>
          <Select
            value={limit}
            label="Rows per page"
            onChange={(e) => {
              setLimit(e.target.value)
              setPage(1)
            }}
            sx={{
              minWidth: 100
            }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
        <Box>
          <PaginationComponent
            totalPages={totalPages}
            showFirstButton={true}
            showLastButton={true}
            handlePageChange={handlePageChange}
            page={page}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default User