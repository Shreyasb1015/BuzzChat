/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './Message.css';
import { FaEdit, FaTrash, FaTimes, FaSave,FaSmile } from 'react-icons/fa';
import Picker from 'emoji-picker-react';

const Message = ({ message, handleDeleteMessage, handleUpdateMessage }) => {
  const user = useSelector((state) => state.user.currentUser);
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedMessage, setUpdatedMessage] = useState(message.content);
  const [showPicker,setShowPicker]=useState(false);

  if (!user || !message.sender) {
    console.error('Missing sender or user:', { sender: message.sender, user });
    return null;
  }

  const isMyMessage = message.sender._id === user._id;

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const startEditing = () => {
    setIsEditing(true);
    setShowOptions(false);
  };

  const saveUpdatedMessage = () => {
    handleUpdateMessage(message._id, updatedMessage);
    setIsEditing(false);
  };

  const deleteMessage = () => {
    handleDeleteMessage(message._id);
  };

  const handleEmojiClick=()=>{
    console.log("emoji clicked");
    setShowPicker(!showPicker);
  }

  return (
    <div className={`mainmessage ${isMyMessage ? 'mymessage' : 'othermessage'}`} onClick={toggleOptions}>
      <div className="messageSender">
        {isMyMessage ? 'You' : message.sender.username}
      </div>
      <div className="messageContent">
        {isEditing ? (
          <input
            type="text"
            value={updatedMessage}
            onChange={(e) => setUpdatedMessage(e.target.value)}
            className="update-input"
          />
        ) : (
          message.content
        )}
      </div>
      <div className="messageTime">
        {new Date(message.createdAt).toLocaleString()}
      </div>
      {showOptions && isMyMessage && !isEditing && (
        <div className="message-options">
          <FaTimes className="close-icon" onClick={toggleOptions} />
          <div className="option-item" onClick={startEditing}>
            <FaEdit className="option-icon" />
            <span>Update</span>
          </div>
          <div className="option-item" onClick={deleteMessage}>
            <FaTrash className="option-icon" />
            <span>Delete</span>
          </div>
        </div>
      )}
      {isEditing && (
        <div className="edit-options">
          {showPicker && <div style={{ position: 'absolute', bottom: '40px', right: '170px', zIndex: 1000 }} className='picker-update-div'>
               <Picker onEmojiClick={(emojiObject,e)=>{setUpdatedMessage(updatedMessage+emojiObject.emoji)}} theme="dark" />
          </div>}
          <FaSmile className="emoji-update-icon" onClick={handleEmojiClick}/>
          <FaSave className="save-icon" onClick={saveUpdatedMessage} />
          <FaTimes className="cancel-icon" onClick={() => setIsEditing(false)} />
          
        </div>
      )}
    </div>
  );
};

export default Message;
