/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import Navbar from '../navbar/Navbar';
import './UpdateConversion.css'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getAllUsersRoute } from '../../utils/routes';
import axios from 'axios';
import { toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserMinus,FaUserPlus } from 'react-icons/fa';
import { updateConversationRoute } from '../../utils/routes';
import { useNavigate } from 'react-router-dom';

const UpdateConversation = () => {

 const { conversationId } = useParams();
 const conversation = useSelector((state) => state.conversations.conversations.find(conv => conv._id === conversationId));
 const [groupName, setGroupName] = useState(conversation.groupName);
 const [selectedUsers, setSelectedUsers] = useState(conversation.members.map((member)=> member._id));
 const [allUsers, setAllUsers] = useState([]);
 const [selectedUserName, setSelectedUserName] = useState(conversation.members.map((member)=> member.username).join(' '));
 const navigate=useNavigate();

 const toastOptions = {
    position: 'bottom-left',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark',
  };
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(getAllUsersRoute, { credentials: true });
      if (!response.data.success) {
        toast.error(response.data.message, toastOptions);
      }
      setAllUsers(response.data.data.users);
    } catch (error) {
      toast.error(error.message, toastOptions);
    }
  };

  const handleUserSelection = (userId, username) => {
    const isSelected = selectedUsers.includes(userId);
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
      setSelectedUserName(selectedUserName.replace(username, ''));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
      setSelectedUserName(selectedUserName +' '+ username);
    }
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(validateDetails())
    {
      try {

        const response=await axios.put(updateConversationRoute.replace(':conversationId',conversationId),{groupName,members:selectedUsers},{credentials:true});
        if(!response.data.success)
        {
          toast.error(response.data.message,toastOptions);
        }
        toast.success(response.data.message,toastOptions);
        setGroupName('');
        setSelectedUsers([]);
        setSelectedUserName('');
        setTimeout(()=>{
           navigate('/');
           
        },3000)
        
      } catch (error) {
        
        toast.error(error.message,toastOptions);
      }
    }
  }

  const validateDetails=()=>{
    if(groupName.trim()===''){
      toast.error('Group name cannot be empty',toastOptions);
      return false;
    }
    if(selectedUsers.length<3){
      toast.error('Group must have at least two other members',toastOptions);
      return false;
    }
    return true;
  }


  return (
    <>
      <Navbar />
      <div className="update-conversation-container">
        <h2>Update Conversation</h2>
        <form className="update-conversation-form" onSubmit={handleSubmit}>
          <label htmlFor="group-name">Group Name</label>
          <input
            type="text"
            id="group-name"
            placeholder="Enter group name"
            className="update-conversation-input"
            value={groupName}
            onChange={(e)=>setGroupName(e.target.value)}
          />
          <label htmlFor="selected-users">Selected Users</label>
          <input
            type="text"
            id="selected-users"
            placeholder="Selected users"
            value={selectedUserName}
            onChange={(e)=>setSelectedUserName(e.target.value)}
            className="update-conversation-input"
            readOnly
          />
          <ul className="update-group-user-list">
              {allUsers.map((user) => (
                <li
                  key={user._id}
                  className={`update-group-user-item ${selectedUsers.includes(user._id) ? 'selected' : ''}`}
                  onClick={() => handleUserSelection(user._id, user.username)}
                >
                  <img src={`https://buzz-chat-backend.vercel.app${user.profilePicture}`} alt="User Profile" className="update-group-profile-picture" />
                  <span className='group-user-selectname'>{user.username}</span>
                  {selectedUsers.includes(user._id) ? <FaUserMinus className="update-group-remove-icon" /> : <FaUserPlus className="update-group-add-icon" />}
                </li>
              ))}
            </ul>
          <button type="submit" className="update-conversation-btn">
            Update Group
          </button>
        </form>
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

export default UpdateConversation;
