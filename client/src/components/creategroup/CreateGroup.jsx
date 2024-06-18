/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAllUsersRoute } from '../../utils/routes';
import { toast, ToastContainer } from 'react-toastify';
import './CreateGroup.css';
import { FaUserPlus, FaUserMinus, FaUsers } from 'react-icons/fa';
import Navbar from '../navbar/Navbar';
import 'react-toastify/dist/ReactToastify.css';
import { createConversationRoute } from '../../utils/routes';
import {useSelector} from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const CreateGroup = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState('');
  const user=useSelector(state=>state.user.currentUser);
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

  const handleCreateGroup = async() => {

    if(validateDetails())
    {
      try {
        
        const members=[...selectedUsers,user._id]

        const response=await axios.post(createConversationRoute,{groupName,isGroup:true,members:members},{withCredentials:true});
        if(!response.data.success)
        {
          toast.error(response.data.message,toastOptions)
        }
         toast.success(response.data.message,toastOptions)
         setGroupName('');
         setSelectedUsers([]);
         setSelectedUserName('');

        setTimeout(()=>{
          navigate('/')
        },3000)
        
      } catch (error) {
        
        toast.error(error.message,toastOptions)
      }
    }
    
  };

  const validateDetails=()=>{

    if(!groupName){
      toast.error("Please enter group name",toastOptions)
      return false
    }
    if(selectedUsers.length===0 || selectedUsers.length===1){
      toast.error("Please select atleast two users",toastOptions)
      return false
    }
    return true;

  }

  return (
    <>
      <Navbar />
      <div className="group-create-group-container">
        <h2>Create Group</h2>
        <div className="group-form-group">
          <label htmlFor="group-groupName">Group Name</label>
          <input
            type="text"
            id="group-groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
            className="group-group-input"
          />
        </div>
        <div className="group-form-group">
          <label>Select Users to Add</label>
          <div className="group-user-selection">
            <input
              type="text"
              id="group-selectedUser"
              value={selectedUserName}
              onChange={(e) => setSelectedUserName(e.target.value)}
              placeholder="Select user"
              className="group-selected-user"
              readOnly
            />
            <ul className="group-user-list">
              {allUsers.map((user) => (
                <li
                  key={user._id}
                  className={`group-user-item ${selectedUsers.includes(user._id) ? 'selected' : ''}`}
                  onClick={() => handleUserSelection(user._id, user.username)}
                >
                  <img src={`https://buzz-chat-backend.vercel.app${user.profilePicture}`} alt="User Profile" className="group-profile-picture" />
                  <span className='group-user-selectname'>{user.username}</span>
                  {selectedUsers.includes(user._id) ? <FaUserMinus className="group-remove-icon" /> : <FaUserPlus className="group-add-icon" />}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button className="group-create-btn" onClick={handleCreateGroup}>
          Create Group <FaUsers className="group-group-icon" />
        </button>
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
    </>
  );
};

export default CreateGroup;
