import { Box } from '@mui/material'
import React from 'react'

const Loading = ({type = "main"}) => {
  return (
    <Box
      className="h-full w-full flex justify-center items-center"
    >
      <div className={type == "main" ? "main-spinner" : "table-spinner"}></div>
    </Box>
  )
}

export default Loading