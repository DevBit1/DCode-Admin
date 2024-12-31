import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { io } from "socket.io-client"
import apiConnect from '../Utils/ApiConnector'
import { ADMIN_CLOSE_CLASS, ADMIN_CREATE_CLASS } from '../Constants/socketEvents'
import { asyncWrapper } from '../Utils/asyncWrapper'

const SocketContext = createContext({
  socket: null,
  onlineUsers: []
})



const SocketContextProvider = ({ children }) => {

  /* 
    -->> Why is the websocket disconnecting when on reload??? Even when socket.disconnect() is not called ???
    The WebSocket connection (socket) created via io() is tied to the socket instance in memory. When the instance is lost (due to page reload), the connection is also lost.
  */

  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [rooms, setRooms] = useState([])

  const { user } = useSelector(state => state.auth)


  const fetchMyRooms = asyncWrapper(async () => {
    try {
      const response = await apiConnect("get", "/getRooms")

      setRooms(response.data.rooms)

      response.data.rooms.map((ele) => {
        socket.emit(ADMIN_CREATE_CLASS, ele.name)
      })
    } catch (error) {
      throw new Error(`Error while fetching rooms : ${error.response?.data.message || error.message}`)
    }
  })

  const handleDeleteRoom = asyncWrapper(async ( roomName) => {
    try {
      await apiConnect("post", "/admin/delete-room", {
        name : roomName
      })
      socket.emit(ADMIN_CLOSE_CLASS, roomName)
      setRooms(prev => prev.filter((ele) => ele.name !== roomName))
    } catch (error) {
      throw new Error(`Error while deleting room : ${error.response?.data.message || error.message}`)
    }
  })

  const handleCreateRoom = asyncWrapper(async (roomName) => {
    try {
      const res = await apiConnect("post", "/admin/create-room", { name: roomName })

      socket.emit(ADMIN_CREATE_CLASS, roomName)

      setRooms(prev => (
        [
          ...prev,
          res.data.newRoom
        ]
      ))
    } catch (error) {
      throw new Error(`Error while creating room : ${error.response?.data.message || error.message}`)
    }
  })

  const connectToSocketServer = asyncWrapper((token) => {
    if (token) {
      try {
        let temp = io(`${import.meta.env.VITE_SERVER_URL}`, {
          withCredentials: true,
          auth: {
            token: token
          }
        })

        setSocket(temp)
      } catch (error) {
        throw new Error(`Error connecting to server: ${error.response?.data.message || error.message}`)
      }
    }
  })

  const disconnectSocket = () => {
    socket?.disconnect()
    setSocket(null)
  }

  const values = {
    socket,
    onlineUsers,
    rooms,
    connectToSocketServer,
    disconnectSocket,
    handleCreateRoom,
    handleDeleteRoom
  }

  useEffect(() => {
    if (user) {
      connectToSocketServer(user)
    }
  }, [user])

  useEffect(() => {
    if (socket) {
      socket.emit("get-online-users")
      
      socket.on("online-users", (data) => {
        setOnlineUsers([...data])
      })

      fetchMyRooms()
    }
  }, [socket])


  return (
    <SocketContext.Provider value={values}>
      {
        children
      }
    </SocketContext.Provider>
  )

}

export const useSocketContext = () => useContext(SocketContext)

export default SocketContextProvider