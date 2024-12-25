import React, { useEffect } from 'react'
import { Box, Pagination } from '@mui/material'


const PaginationComponent = ({ totalPages = 1, handlePageChange, page, showFirstButton, showLastButton }) => {

    return (
        <Box
            className='w-full flex justify-center py-3 '
        >
            <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => handlePageChange(value)}
                showFirstButton={showFirstButton}
                showLastButton={showLastButton}
            />
        </Box>
    )
}

export default PaginationComponent