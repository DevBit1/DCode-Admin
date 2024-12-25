import { Editor } from '@monaco-editor/react';
import { Box, Button, Grid2, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom';
import { MonacoBinding } from 'y-monaco';
import * as Y from 'yjs';
import CollabUsers from '../../Components/Collab Hub/CollabUsers';
import ExitRoomModal from '../../Components/Modals/ExitRoomModal';
import { HOME, HOME_CODE_HUB } from '../../Constants/RoutePaths';
import { useSocketContext } from '../../Context/SocketContextProvider';

const CodeCollab = () => {

  const editorRef = useRef(null)
  const yDoc = useRef(new Y.Doc()) // So that on re-renders we don't get a new Y.Doc()
  const { socket, handleDeleteRoom } = useSocketContext()


  const [openModal, setOpenModal] = useState(false)

  const navigate = useNavigate()

  const { roomName } = useParams()

  // For the binding of the editor with the yDOC
  const [isEditorReady, setIsEditorReady] = useState(false)

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const deleteRoomFunction = () => {
    handleDeleteRoom(roomName)
  }


  useEffect(() => {

    const doc = yDoc.current
    socket.emit("initialSync", roomName)

    socket.on(`initialSync:${roomName}`, (state) => {
      try {
        const update = new Uint8Array(state) // We have to convert it into this format bcs yJs expects this, the server does generate in this format but on the transmission socket.io converts the binary data to "ArrayBuffer" which is trouble
        Y.applyUpdate(doc, update);
      } catch (error) {
        console.error("Error applying update", error);
      }
    })

    doc.on("update", (update) => {
      socket.emit("update", update, roomName)
    })

    socket.on(`update:${roomName}`, (state) => {
      try {
        const update = new Uint8Array(state)
        Y.applyUpdate(doc, update)
      } catch (error) {
        console.error("Error while updatin")
        return
      }
    })

    socket.on(`leave-room-${roomName}`, () => {
      navigate(`${HOME}/${HOME_CODE_HUB}`)
    })


    return () => {
      // So that once the user leaves the room there is no more data coming
      socket.removeAllListeners(`initialSync:${roomName}`)
      socket.removeAllListeners(`update:${roomName}`)
    }


  }, [])

  // This manages the binding part, the timing when this useEffect first works and the time when editor is done mounting are different thats why need to use another state to track
  useEffect(() => {

    if (isEditorReady) {
      const editor = editorRef.current;

      // Bind Yjs document to Monaco Editor
      const binding = new MonacoBinding(
        yDoc.current.getText('monaco'), // Yjs text type, the actual content in the document
        editor.getModel(),
      );

      return () => binding.destroy();
    }
  }, [isEditorReady]);




  return (
    <Box
      className=" w-full h-full flex flex-col justify-center items-center"
    >
      <Box
        className="w-full py-2 px-2 bg-yellow-500 flex justify-center relative"
      >
        <IoMdArrowRoundBack
          size={30}
          onClick={() => navigate(`${HOME}/${HOME_CODE_HUB}`)}
          className='cursor-pointer absolute left-3 top-1'
        />
        <Typography>
          Room - {roomName}
        </Typography>

        <Button
          variant='contained'
          size="small"
          sx={{
            bgcolor: "red",
            color: "white",
            position: "absolute",
            right: 3,
            top: 4
          }}
          onClick={() => setOpenModal(true)}
        >
          Exit Group
        </Button>
      </Box>
      <Grid2
        container
        className="flex-1 w-full overflow-auto"
      >
        <Grid2
          size={6}
        >
          <CollabUsers room={roomName} />
        </Grid2>
        <Grid2
          size={6}
        >
          <Editor
            onMount={(editor) => {
              editorRef.current = editor
              setIsEditorReady(true)
            }}
            // className='border-2 border-green-600'
            theme='vs-dark'
            language='javascript'
          />
        </Grid2>
      </Grid2>
      <ExitRoomModal
        open={openModal}
        handleClose={handleCloseModal}
        handleDeleteRoom={deleteRoomFunction}
      />
    </Box>
  )
}

export default CodeCollab