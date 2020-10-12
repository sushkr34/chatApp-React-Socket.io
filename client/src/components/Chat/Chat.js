import React,{useState,useEffect} from 'react';
import querySting from 'query-string';
import io from 'socket.io-client';

import './Chat.css'
import TextContainer from '../TextContainer/TextContainer';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';

let socket;
const ENDPOINT='localhost:5000';


const  Chat =({location})=>{
    const [name,setName]=useState('');
    const [room,setRoom]=useState('');
    const [messages,setMessages]=useState([]);
    const [users, setUsers] = useState('');
    const [message,setMessage]=useState('');
    useEffect(()=>{
        const {name,room}=querySting.parse(location.search);
        socket =io(ENDPOINT);
        setName(name);
        setRoom(room);
        socket.emit('join',{name,room},(error)=>{
           if(error){
               alert(error);
           }
        });
        // return ()=>{
        //     socket.emit('disconnect');

        //     socket.off();
        // }
    },[ENDPOINT,location.search]);

    useEffect(()=>{
        socket.on('message',(message)=>{
            setMessages([...messages,message])
        });
        socket.on("roomData", ({ users }) => {
            setUsers(users);
          });
    },[]);

    const sendMessage=(e)=>{
        e.preventDefault();
        if(message){
            socket.emit('sendMessage',message,()=>setMessage(''));
        }
    }
    return(
        <div className="outerContainer">
            <div className="container">
                <InfoBar  room={room}/>
                <Messages  messages={messages}name={name}/>
                <Input message={message}setMessage={setMessage} sendMessage={sendMessage} />
                
            </div>
            <TextContainer users={users}/>
        </div>
    )
}

export default Chat;