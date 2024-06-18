import React, { useState } from 'react';
import Navbar from '../navbar/Navbar';
import './DeleteConversation.css';
import thinkGif from '../../assets/think.gif';
import sadBoy from '../../assets/sad-boy.jpg'
import happyBoy from '../../assets/happy-boy.jpg';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { deleteConversationRoute } from '../../utils/routes';

const DeleteConversation = () => {
  const [hoverImage, setHoverImage] = useState(thinkGif);
  const [finalImage, setFinalImage] = useState(null);
  const navigate = useNavigate();
  const {conversationId}=useParams();

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

  const handleYesHover = () => {
    setHoverImage(sadBoy);
  };

  const handleNoHover = () => {
    setHoverImage(happyBoy);
  };

  const handleMouseLeave = () => {
    setHoverImage(thinkGif);
  };

  const handleYesClick = async() => {
    setFinalImage(sadBoy);
    try {

        const response=await axios.delete(deleteConversationRoute.replace(':conversationId',conversationId),{withCredentials:true});
        if(!response.data.success)
        {
            toast.error('Conversation not deleted',toastOptions);
        }
        else{

            toast.success('Conversation deleted successfully',toastOptions);
            setTimeout(()=>{

                navigate('/');
            },3000)
        }
        
    } catch (error) {
        
        toast.error('Conversation not deleted',toastOptions);
    }
    

  };

  const handleNoClick = () => {
    toast.success('Conversation not deleted',toastOptions)

  };

  return (
    <>
      <Navbar />
      <div className="delete-conversation-container">
        <div className="delete-conversation-left">
          <h2>Are you sure you want to delete the conversation?</h2>
          <div className="delete-conversation-buttons">
            <button 
              className="delete-conversation-btn yes-btn" 
              onMouseEnter={handleYesHover} 
              onMouseLeave={handleMouseLeave} 
              onClick={handleYesClick}
            >
              Yes
            </button>
            <button 
              className="delete-conversation-btn no-btn" 
              onMouseEnter={handleNoHover} 
              onMouseLeave={handleMouseLeave} 
              onClick={handleNoClick}
            >
              No
            </button>
          </div>
        </div>
        <div className="delete-conversation-right">
          <img 
            src={finalImage ? finalImage : hoverImage} 
            alt="Think or React" 
            className="delete-conversation-image" 
          />
        </div>
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
    </>
  );
};

export default DeleteConversation;
