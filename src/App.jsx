/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react';
import {io} from 'socket.io-client'
import useAxiosPublic from './Hooks/useAxiosPublic';
import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material';


const App = () => {

  const axiosPublic = useAxiosPublic()
  const socket = useMemo(()=> io('http://localhost:5000/'),[])
  
  const [message, setMessage] = useState('')
  const [room, setRoom] = useState('')
  const [roomName, setRoomName] = useState('')
  const [socketId, setSocketId] = useState('')
  const [messages, setMessages] = useState([]);
  console.log(messages);
  const handleSubmit = (e) =>{
      e.preventDefault()
      // setMessage(e.target.text.value)
      // console.log(message)
      socket.emit('send-message', {message, room})
      setMessage('');
  }

  const joinRoomHandler = (e) =>{
    e.preventDefault();
    socket.emit('join-room', roomName)
  }
  
  //function to connect to socket.io to server
   useEffect(()=>{
     socket.on('connect',()=>{
         setSocketId(socket.id);
         console.log('socket.io connected to client',socket.id)
     })
      
      
     //function to receive data from server to client
      socket.on('receive-message',(data)=>{
        console.log(data)
        setMessages((prevMessages) => [...prevMessages, data]);
        
      })

      socket.on('welcome',(msg)=>{console.log(msg)})
     
     
     //disconnected function
      return ()=>{
        socket.disconnect();
      }

   },[])


  return (
    <>
    <Container maxWidth='sm'>
      <Box sx={{height:200}}/>
     <Typography variant='h3' component={'div'} gutterBottom>
        welcome to socket.io
     </Typography>
     <Typography variant='h6' component={'div'} gutterBottom>
        {socketId}
     </Typography>

     <form onSubmit={joinRoomHandler}>
      <h5>Join Room</h5>
      <TextField value={roomName} onChange={(e)=> setRoomName(e.target.value)} id='outline-basic' label='Room Name' variant='outlined'/>
      <Button type='submit' variant='contained' color='primary'>Joined</Button>
      
     </form>

     {/*======= form to sent messages =======*/}
     <form onSubmit={handleSubmit}>
     <TextField value={message} onChange={(e)=>{setMessage(e.target.value)}} name='text' id="outlined-basic" label="Message" variant="outlined" />
     <TextField value={room} onChange={(e)=>{setRoom(e.target.value)}} name='text' id="outlined-basic" label="Room" variant="outlined" />
     <Button type='submit' variant="contained">Send</Button>
     </form>
     
     <Stack>
      {
        messages.map((m,i)=>(
          <Typography key={i} variant='h6' component={'div'} gutterBottom>
            {m}
          </Typography>
        ))
      }
     </Stack>
    </Container>
    </>
  );
};

export default App;