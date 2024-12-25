import React from 'react'

const Container = ({ children, className = "" }) => {

    

    return (
        <div className={`w-full min-h-screen max-h-screen overflow-y-auto flex justify-center items-center  ${className}`}>
            {
                children
            }
        </div>
    )
}

export default Container