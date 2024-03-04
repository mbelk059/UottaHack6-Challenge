import React, { useState, useRef } from 'react';
import './Chat.css';
import Sidebar from './SideBar';
import { BsMicFill } from 'react-icons/bs'; // Import Bootstrap icons
import{ db } from '../firebaseConfig';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { useEffect } from 'react';

const Chat = () => {
  const msgRef= useRef();
  const ref= collection(db,"messages");

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Set up a listener for real-time updates
    const getMsgs= async () => {
      const data= await getDocs(ref);
      setMessages(data.docs.map((doc)=> ({...doc.data(), id: doc.id})));

    };
    getMsgs();
    
  }, [ref]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);

  };

  const sendMessage = async () => {
    if (message.trim() !== '') {
      console.log(msgRef.current.value);
      let data= {
        message:msgRef.current.value,
        sender:"ok"
      }
      try{
        await addDoc(ref, data);
      }catch(e){
        console.error("error, sending", e);
    }
      setMessage('');
    }
  };
  

  return (
    <div className="d-flex" id="wrapper">
      <Sidebar />
      <div id="page-content-wrapper">
        <div className="chat-container">
          <div className="message-display">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender === 'Maryam' ? 'sent' : 'received'}`}>
                <div className="sender smaller">{msg.sender}</div>
                <div className="content">{msg.message}</div>
              </div>
            ))}
          </div>
          <div className="message-input">
            <div className="add-button-container" style={{ position: 'relative' }}>
              <button onClick={toggleUploadPopup} className="add-button">+</button>
              {uploadPopupVisible && (
                <div className="upload-popup">
                  <div>Upload a File</div>
                </div>
              )}
            </div>
            <input
              type="text"
              value={message}
              onChange={handleMessageChange}
              placeholder="Message #channel"
              className="message-input-field"
              ref={msgRef} 
            />
            <button onClick={sendMessage} className="send-button">Send</button>
            <button className="send-button"><BsMicFill /></button> {/* Add microphone icon */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
