/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import Conversation from '../components/conversation/Conversation';
import './Home.css';
import { socket } from '../../socket';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const user=useSelector(state=>state.user.currentUser);
  const [showSidebar, setShowSidebar] = useState(true);
  const navigate=useNavigate();
  
  useEffect(()=>{
    if(!user)
    {
      navigate('/login');
    }

    socket.on('connect',()=>{
      console.log("Client connected: ",socket.id);
    })
    
    return ()=>{
      socket.disconnect();
    }
  },[])

  const handleConversationClick = (conversationId) => {
    setSelectedConversationId(conversationId);
    setShowSidebar(false); 
    
  };

  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className={`home-container ${showSidebar ? 'show-sidebar' : 'hide-sidebar'}`}>
      <Sidebar onConversationClick={handleConversationClick} />
      {selectedConversationId ? (
        <Conversation conversationId={selectedConversationId} handleToggleSidebar={handleToggleSidebar} setSelectedConversationId={setSelectedConversationId} />
      ) : (
        <div className="no-conversation">
          <p>Select a conversation to start chatting.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
