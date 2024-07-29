/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {io} from 'socket.io-client'
import useAxiosPublic from './Hooks/useAxiosPublic';
import { Button, Container, TextField, Typography } from '@mui/material';

const socket = io('http://localhost:5000/')
const App = () => {
  const axiosPublic = useAxiosPublic()
  
  
  const [message, setMessage] = useState('')

  const handleSubmit = (e) =>{
      e.preventDefault()
      // setMessage(e.target.text.value)
      // console.log(message)
      socket.emit('send-message', message)
  }
  
  //function to connect to socket.io to server
   useEffect(()=>{
     socket.on('connect',()=>{
         console.log('socket.io connected to client',socket.id)
     })
      
      
     //function to receive data from server to client
      socket.on('receive-message',(msg)=>{console.log(msg)})

      socket.on('welcome',(msg)=>{console.log(msg)})
     
     
     //disconnected function
      return ()=>{
        socket.disconnect();
      }

   },[])


  return (
    <>
    <Container maxWidth='sm'>
     <Typography variant='h3' component={'div'} gutterBottom>
        welcome to socket.io
     </Typography>
     <form onSubmit={handleSubmit}>
     <TextField value={message} onChange={(e)=>{setMessage(e.target.value)}} name='text' id="outlined-basic" label="Outlined" variant="outlined" />
     <Button type='submit' variant="contained">Send</Button>
     </form>
    </Container>
    </>
  );
};

export default App;