import {
    Box,
    FormControl,
    Grid2,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    Tab,
    Tabs,
    Typography
} from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { FaUser } from "react-icons/fa"
import { FaBars, FaFileCode } from "react-icons/fa6"
import { GrTest } from "react-icons/gr"
import { SiTask } from "react-icons/si"
import { LineGraph } from '../../../Components/Home Components/Dashboard/Graphs/LineGraph'
import PieGraph from '../../../Components/Home Components/Dashboard/Graphs/PieGraph'
import { useSocketContext } from '../../../Context/SocketContextProvider'
import apiConnect from '../../../Utils/ApiConnector'
import { asyncWrapper } from '../../../Utils/asyncWrapper'






const DashBoard = () => {


    const [basicStats, setBasicStats] = useState(null)

    const [order, setOrder] = useState("day")
    const [year, setYear] = useState(new Date().getFullYear())
    const [month, setMonth] = useState("")

    const [graphStats, setGraphStats] = useState([])

    const [tabValue, setTabValue] = useState("basic")

    const { onlineUsers } = useSocketContext()

    const [showBaseStats, setShowBaseStats] = useState(false)

    const yearOptions = useMemo(() => {
        const limit = new Date(2024, 0, 1, 0, 0, 0, 0)
        let start = new Date()
        const result = []

        while (start >= limit) {
            result.push(start.getFullYear())
            start.setFullYear(start.getFullYear() - 1)
        }


        result.reverse()

        return result
    }, [])

    const fetchbasicStats = asyncWrapper(async () => {
        try {
            const response = await apiConnect("get", "/admin/dashboard/basic")

            console.log(response.data.result)
            setBasicStats(response.data.result)
        } catch (error) {
            throw new Error(`Error while fetching Basic stats : ${error.response?.data.message || error.message}`)
        }
    })

    const fetchGraphStats = asyncWrapper(async () => {
        try {
            const response = await apiConnect("get", `/admin/dashboard/graph?order=${order}${order == "year" ? `&year=${year}&month=${month}` : ""}`)
            console.log(response.data)
            setGraphStats(response.data.result)
        } catch (error) {
            throw new Error(`Error while fetching Graph data : ${error.response?.data.message || error.message}`)
        }
    })

    useEffect(() => {
        fetchbasicStats()
    }, [])

    useEffect(() => {
        fetchGraphStats()
    }, [order, year, month])



    return (
        <Box
            className=" w-full h-full flex flex-col gap-y-3 overflow-y-auto py-2 px-3"
        >

            <Box
                className="flex justify-between items-center border-2 rounded-md lg:border-none px-2 py-1"
            >
                <Box
                    className="flex gap-x-2"
                >
                    <FormControl size='small'>
                        <InputLabel id>Order By</InputLabel>
                        <Select
                            label="Order By"
                            value={order}
                            size="small"
                            onChange={(e) => setOrder(e.target.value)}
                        >
                            <MenuItem value={"day"}>Last 24 hours</MenuItem>
                            <MenuItem value={"week"}>Last 7 days</MenuItem>
                            <MenuItem value={"year"}>Year</MenuItem>
                        </Select>
                    </FormControl>
                    {
                        order == "year" &&
                        (
                            <>
                                <FormControl size='small'>
                                    <InputLabel id>Year</InputLabel>
                                    <Select
                                        label="Year"
                                        value={year}
                                        size="small"
                                        onChange={(e) => {
                                            setYear(e.target.value)
                                            setMonth("")
                                        }}
                                        sx={{
                                            minWidth: 80
                                        }}
                                    >
                                        {
                                            yearOptions.map((ele) => (
                                                <MenuItem value={ele} key={ele}>{ele}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                <FormControl size='small'>
                                    <InputLabel id>Month</InputLabel>
                                    <Select
                                        label="Month"
                                        value={month}
                                        size="small"
                                        onChange={(e) => setMonth(e.target.value)}
                                        sx={{
                                            minWidth: 80,
                                        }}
                                    >
                                        <MenuItem value={""} >None</MenuItem>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={2}>2</MenuItem>
                                        <MenuItem value={3}>3</MenuItem>
                                        <MenuItem value={4}>4</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={6}>6</MenuItem>
                                        <MenuItem value={7}>7</MenuItem>
                                        <MenuItem value={8}>8</MenuItem>
                                        <MenuItem value={9}>9</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={11}>11</MenuItem>
                                        <MenuItem value={12}>12</MenuItem>
                                    </Select>
                                </FormControl>
                            </>
                        )
                    }
                </Box>
                <Box
                    className={`lg:hidden block ${showBaseStats ? "bg-slate-500" : ""} p-1 rounded-lg`}
                >
                    <FaBars size={25} onClick={() => setShowBaseStats(prev => !prev)} />
                </Box>
            </Box>


            <Box
                className="h-[70%] overflow-y-auto"
            >
                <Grid2
                    container
                    className="h-full relative"
                    spacing={1}
                >
                    <Grid2
                        size={{
                            sm: 12,
                            lg: 8
                        }}
                        className=" h-full flex flex-col px-1"
                    >
                        <Box
                            className="flex-1 min-w-[350px] w-full md:max-h-[330px]"
                        >
                            <LineGraph
                                data={graphStats}
                            />
                        </Box>
                    </Grid2>
                    <Grid2
                        size={{
                            lg: 4,
                            sm: 6
                        }}
                        className={`bg-[#dad7cd] lg:static absolute right-0 z-10 px-2 py-1 rounded-lg h-max max-h-full overflow-y-auto lg:flex lg:flex-col ${showBaseStats ? "block" : "hidden"} `}
                    >
                        <Tabs
                            value={tabValue}
                            onChange={(e, val) => setTabValue(val)}
                            sx={{
                                minHeight: '32px', // Reduces the tab height
                            }}
                        >
                            <Tab
                                label="Basic Stats"
                                value={"basic"}
                                sx={{
                                    fontSize: '12px',
                                    padding: '4px 8px',
                                    minHeight: '32px',
                                    fontWeight: "bold",
                                    // color: "white"
                                }}
                            />
                            <Tab
                                label="Previous records"
                                value={"previous"}
                                sx={{
                                    fontSize: '12px',
                                    padding: '4px 8px',
                                    minHeight: '32px',
                                    fontWeight: "bold",
                                    // color: "white"
                                }}
                            />
                        </Tabs>

                        <Box
                            component={List}
                            className="flex flex-col gap-y-2 flex-1 overflow-y-auto"
                        >
                            {
                                tabValue == "basic" ?
                                    (
                                        <>
                                            <ListItem
                                                className="bg-[#ffffff] rounded-md"
                                            >
                                                <ListItemText>
                                                    <Typography className="flex items-center gap-x-2">
                                                        <FaUser />
                                                        <span>Total Users : {basicStats?.totalUsers}</span>
                                                    </Typography>
                                                </ListItemText>
                                            </ListItem>
                                            <ListItem
                                                className="bg-[#ffffff] rounded-md"
                                            >
                                                <ListItemText>
                                                    <Typography className="flex items-center gap-x-2">
                                                        <SiTask />
                                                        <span>Total Questions : {basicStats?.totalQuestions}</span>
                                                    </Typography>
                                                </ListItemText>
                                            </ListItem>
                                            <ListItem
                                                className="bg-[#ffffff] rounded-md"
                                            >
                                                <ListItemText>
                                                    <Typography className="flex items-center gap-x-2">
                                                        <GrTest />
                                                        <span>Total TestCases : {basicStats?.totalTestCases}</span>
                                                    </Typography>
                                                </ListItemText>
                                            </ListItem>
                                            <ListItem
                                                className="bg-[#ffffff] rounded-md"
                                            >
                                                <ListItemText>
                                                    <Typography className="flex items-center gap-x-2">
                                                        <FaFileCode />
                                                        <span>Total Submissions : {basicStats?.totalSubmissions}</span>
                                                    </Typography>
                                                </ListItemText>
                                            </ListItem>

                                        </>
                                    ) :
                                    (
                                        <div>Hello</div>
                                    )
                            }
                        </Box>
                    </Grid2>
                </Grid2>
            </Box>


            <Grid2
                container
                className="h-[30%] justify-between sm:px-2 p-0"
            >
                <Grid2
                    size={4}
                    className="h-full flex"
                >
                    <PieGraph
                        data={[
                            {
                                label: "Offline Users",
                                count: basicStats?.totalUsers - onlineUsers.length,
                                color: "grey"
                            },
                            {
                                label: "Online Users",
                                count: onlineUsers.length,
                                color: "#89fc00"
                            }
                        ]}
                        label="Users"
                    />
                </Grid2>
                <Grid2
                    size={4}
                    className="h-full flex justify-center"
                >
                    <PieGraph
                        data={[
                            {
                                label: "Unsolved Questions",
                                count: basicStats?.totalQuestions - basicStats?.totalSolvedQuestions,
                                color: "red"
                            },
                            {
                                label: "Solved Questions",
                                count: basicStats?.totalSolvedQuestions,
                                color: "#89fc00"
                            }
                        ]}
                        label="Questions"
                    />
                </Grid2>
                <Grid2
                    size={4}
                    className="h-full flex justify-center"
                >
                    <PieGraph
                        data={[
                            {
                                label: "Passed Submissions",
                                count: basicStats?.totalSuccessfullSubmissions,
                                color: "#89fc00"
                            },
                            {
                                label: "Failed Submissions",
                                count: basicStats?.totalSubmissions - basicStats?.totalSuccessfullSubmissions,
                                color: "red"
                            }
                        ]}
                        label="Submissions"
                    />
                </Grid2>
            </Grid2>



        </Box>
    )
}

export default DashBoard