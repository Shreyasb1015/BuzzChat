/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useEffect, useState ,useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, sendMessage } from '../../store/slices/messageslice';
import './Conversation.css';
import { FaEllipsisV, FaSmile,FaTrash,FaEdit,FaArrowLeft,FaFastForward } from 'react-icons/fa';
import Message from '../message/Message';
import group from '../../assets/group.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addMessage } from '../../store/slices/messageslice';
import Picker from 'emoji-picker-react';
import { setLastMessage } from '../../store/slices/conversationslice';
import { useNavigate } from 'react-router-dom';
import { deleteMessageRoute } from '../../utils/routes';
import { updateMessageRoute } from '../../utils/routes';
import axios from 'axios';
import pointgif from '../../assets/point.gif';
import { socket } from '../../../socket';


const Conversation = ({ conversationId,handleToggleSidebar,setSelectedConversationId }) => {
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState('');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const messages = useSelector((state) => state.messages.messages);
  const status = useSelector((state) => state.messages.status);
  const error = useSelector((state) => state.messages.error);
  const user = useSelector((state) => state.user.currentUser);
  const conversations = useSelector((state) => state.conversations.conversations);
  const [optionsVisible, setOptionsVisible] = useState(false); 
  const conversation = conversations.find((conv) => conv._id === conversationId);
  const navigate = useNavigate();
  const messageEndRef=useRef(null);
  

  const toastOptions = {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  useEffect(() => {
    if (conversationId) {
      dispatch(fetchMessages(conversationId));
      socket.emit('join-conversation',{conversationId,username:user.username});
    }

    socket.on('message',(message)=>{
      if(message.conversationId===conversationId)
      {
        dispatch(addMessage({conversationId:conversation._id,sender:message.sender,content:message.content,createdAt:message.createdAt}));
      }
    })

    socket.on('activity', (username) => {
      setTypingUser(username)
      setIsTyping(true); 
      setTimeout(() => setIsTyping(false),3000); 
    });




    return () => {
      socket.off('message');
      socket.emit('leave-conversation', {conversationId,username:user.username});
      socket.off('activity');
    };
    
  }, [dispatch, conversationId]);

  const handleSendMessage = () => {
    if (newMessage === '') {
      toast.error('Message cannot be empty', toastOptions);
      return;
    }
    if (newMessage.trim()) {
      const message = { conversationId, content: newMessage, sender: user, createdAt: new Date().toISOString() };
      socket.emit('message', message);
      dispatch(sendMessage({ conversationId, content: newMessage }));
      dispatch(addMessage({conversationId:conversation._id,sender:user,content:newMessage,createdAt:new Date().toISOString()}));

      setNewMessage('');
      setEmojiPickerVisible(false);
      dispatch(setLastMessage({conversationId:conversation._id,lastMessage:newMessage}));
    }
  };

  const handleEmojiClick = (emojiObject,event) => {
   
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);

  };
  const toggleOptions = () => {
    setOptionsVisible(!optionsVisible);
  };

  const handleBack = () => {
    
    if(window.innerWidth >768)
    {
       setSelectedConversationId(null);
    }
    else{
       handleToggleSidebar();
       setSelectedConversationId(null);
    }
      
  };

  const handleUpdateConversation = () => {

    if(!conversation.isGroup)
    {
      toast.error('Cannot update a personal conversation', toastOptions);
    }
    else{

      navigate(`/update-conversation/${conversationId}`);
    }

    
  };

  const handleDeleteConversation = () => {
  
    navigate(`/delete-conversation/${conversationId}`);
  };

  const handleDeleteMessage=async(messageId)=>{
    try {

      const response=await axios.delete(deleteMessageRoute.replace(':messageId',messageId),{withCredentials:true});
      if(!response.data.success)
      {
        toast.error(response.data.message, toastOptions);
      }
      else{

        toast.success('Message deleted successfully', toastOptions);
      }
      
    } catch (error) {
      
      toast.error('Error deleting message', toastOptions);
    }
  }

  const handleUpdateMessage=async(messageId,updatedMessage)=>{

    try {
      const response=await axios.put(updateMessageRoute.replace(':messageId',messageId),{content:updatedMessage},{withCredentials:true});
      if(!response.data.success)
      {
         toast.error(response.data.message, toastOptions);
      }
      dispatch(fetchMessages(conversationId));
      toast.success('Message updated successfully', toastOptions);
      
    } catch (error) {
      
       toast.error('Error updating message', toastOptions);
    }

    
  }


  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!conversation) {
    return <div className="no-conversation"><p>Conversation not found.</p></div>;
  }

  return (
    <div className="conversation-container">
      <div className="conversation-header">
        <img
          src={
            conversation.isGroup
              ? group
              : conversation.members.find(member => member._id !== user._id)?.profilePicture
                ? `https://buzz-chat-backend.vercel.app${conversation.members.find(member => member._id !== user._id)?.profilePicture}`
                : ''
          }
          alt="Profile"
          className="c-profile-image"
        />
        <div className="c-profile-info">
          <p className="c-username">{conversation.isGroup ? conversation.groupName : conversation.members.find(member => member._id !== user._id).username}</p>
        </div>
        <FaEllipsisV className="options-icon" onClick={toggleOptions} />
        {optionsVisible && (
          <div className="options-menu">
            <div className="options-menu-item" onClick={handleBack}>
              <FaArrowLeft className="three-options-icon" size={20}/>
              <span>Back</span>
            </div>
            <div className="options-menu-item" onClick={handleUpdateConversation}>
              <FaEdit className="three-options-icon" size={20} />
              <span>Update Conversation</span>
            </div>
            <div className="options-menu-item" onClick={handleDeleteConversation}>
              <FaTrash className="three-options-icon" size={20} />
              <span>Delete Conversation</span>
            </div>
          </div>
        )}
      </div>
      <div className="messages">
        {status === 'loading' && <p>Loading...</p>}
        {status === 'failed' && <p>{error}</p>}
        {messages.map((message, index) => (
          <Message key={index} message={message} handleDeleteMessage={handleDeleteMessage} handleUpdateMessage={handleUpdateMessage} />
        ))}
        {isTyping && <div className="typing-indicator">{typingUser} is typing...</div>}

         <div ref={messageEndRef} />
      </div>
      <div className="message-input">
        <FaSmile
          className="emoji-icon"
          onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
        />
        {emojiPickerVisible && (
          <div style={{ position: 'absolute', bottom: '60px', right: '800px', zIndex: 1000 }} className='emojipick'>
            <Picker onEmojiClick={( emojiObject,e) => handleEmojiClick(emojiObject,e)}  theme="dark" />
          </div>
        )}
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => {setNewMessage(e.target.value)
               const username=user.username;
               socket.emit('activity',{ username,conversationId });
          }}
          className="input-field"
        />
        <button onClick={handleSendMessage} className="send-btn">Send</button>
        { messages.length ==0 && <img src={pointgif} alt='point gif' className='point-gif'/>}
        <FaFastForward className="fast-forward-icon" onClick={scrollToBottom} />
      </div>
      <ToastContainer />
      <style>{`
        .Toastify__toast {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .emoji-icon {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Conversation;
