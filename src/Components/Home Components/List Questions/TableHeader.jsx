import React, { useEffect, useState } from 'react'
import { Box, Select, MenuItem, FormControl, FormLabel, TextField, InputLabel, Autocomplete } from '@mui/material'
import { asyncWrapper } from '../../../Utils/asyncWrapper'
import apiConnect from '../../../Utils/ApiConnector'
import { DIFFICULTY } from '../../../Constants/Values'

const TableHeader = ({ perPage = 10, search, tags, difficulty, handlePerPageChange, handleSearchChange, handleTagChange, handleDifficulty }) => {

    const [options, setOptions] = useState([]) // To stores all the fetched tags

    const fetchTags = asyncWrapper(async () => {
        try {
            const response = await apiConnect("get", "/tags")
            setOptions(response.data.result.map((ele) => ele.name))
        } catch (error) {
            throw new Error(`Error while fetching tags : ${error.response?.data.message || error.message}`)
        }
    })


    useEffect(() => {
        fetchTags()
    }, [])



    return (
        <Box className="p-2 flex justify-between">
            <FormControl size="small">
                <InputLabel id="rows_per_page">
                    Rows
                </InputLabel>
                <Select
                    id="rows_per_page"
                    label="Rows"
                    value={perPage}
                    onChange={(e) => handlePerPageChange(e.target.value)}
                    size='small'
                >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                </Select>
            </FormControl>

            <Box className="flex gap-x-2">
                <TextField
                    label="Search"
                    size="small"
                    placeholder='Search by name'
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                />
                <Autocomplete
                    multiple
                    limitTags={2}
                    options={options}
                    value={tags}
                    sx={{
                        flexGrow: {
                            xs: 1,
                            md: 0
                        },
                        minWidth: 250,
                        bgcolor: "white"
                    }}
                    size='small'
                    onChange={(e, value) => handleTagChange(value)}
                    getOptionLabel={(option) => {
                        const temp = option.split("")
                        temp[0] = temp[0].toUpperCase()
                        return temp.join("")
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Tags"
                            size='small'
                        />
                    )}
                />
                <FormControl
                    size="small"
                >
                    <InputLabel id="difficulty">Difficulty</InputLabel>
                    <Select
                        label="Difficulty"
                        id='difficulty'
                        size="small"
                        value={difficulty}
                        onChange={(e) => {
                            handleDifficulty(e.target.value)
                        }}
                        sx={{
                            minWidth: 100,
                            bgcolor: "white"
                        }}
                    >
                        <MenuItem value={""}>None</MenuItem>
                        <MenuItem value={DIFFICULTY.EASY}>Easy</MenuItem>
                        <MenuItem value={DIFFICULTY.MEDIUM}>Medium</MenuItem>
                        <MenuItem value={DIFFICULTY.HARD}>Hard</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </Box>
    )
}

export default TableHeader