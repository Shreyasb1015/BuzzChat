/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useEffect,useState } from 'react';
import { FaUser, FaUsers, FaSearch } from 'react-icons/fa';
import './Sidebar.css';
import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import group from '../../assets/group.jpg';
import { fetchConversations } from '../../store/slices/conversationslice';
import { getAllUsersRoute } from '../../utils/routes';
import { toast,ToastContainer } from 'react-toastify';
import axios from 'axios';
import { createConversationRoute } from '../../utils/routes';


const Sidebar = ({ onConversationClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const conversations = useSelector((state) => state.conversations.conversations);
  const status = useSelector((state) => state.conversations.status);
  const error = useSelector((state) => state.conversations.error);
  const user=useSelector((state)=>state.user.currentUser);
  const [allusers,setAllUsers]=useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const messages = useSelector((state) => state.messages.messages);


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
    dispatch(fetchConversations());
    fetchAllUsers();
  }, [dispatch],messages);

  useEffect(() => {
    console.log('Conversations:', conversations);
  }, [conversations]);

  


  const fetchAllUsers=async()=>{
    try {
      
       const response=await axios.get(getAllUsersRoute,{credentials:true});
       if(!response.data.success)
       {
          toast.error(response.data.message,toastOptions);
       }
       setAllUsers(response.data.data.users);
       setFilteredUsers(response.data.data.users);
    } catch (error) {
      
       console.log(error.message);
    }
  }

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    filterUsers(e.target.value);
  };

  const filterUsers = (query) => {
    const filtered = allusers.filter(
      (user) => user.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  
    
    setFilteredUsers(prevFilteredUsers => {
      const sortedUsers = [...prevFilteredUsers];
      sortedUsers.sort((a, b) => {
        const aIncludes = a.username.toLowerCase().includes(query.toLowerCase());
        const bIncludes = b.username.toLowerCase().includes(query.toLowerCase());
        if (aIncludes && !bIncludes) return -1;
        if (!aIncludes && bIncludes) return 1;
        return 0;
      });
      return sortedUsers;
    });
  };

  const handleGroup=()=>{
    navigate('/create-group');
  }

  const handleCreateConvo=async(convouser)=>{

    const existingConversation = conversations.find((conversation) => {
      if (conversation.isGroup) return false;
      const members = conversation.members.map(member => member._id);
      return members.includes(user._id) && members.includes(convouser._id);
    });
  
    if (existingConversation) {
      toast.error('Conversation already exists', toastOptions);
    }  
    else{

          try {
                const members=[convouser._id,user._id]
                const response=await axios.post(createConversationRoute,{isGroup:false,members},{withCredentials:true});
                if(!response.data.success)
                  {
                      toast.error(response.data.message,toastOptions);
                  }
                  dispatch(fetchConversations());
                  toast.success('Conversation created successfully',toastOptions);
          } catch (error) {

              toast.error(error.message,toastOptions);
            
          }

      }

  }
  

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="mainlogo" />
        <button className="profile-button" onClick={() => navigate('/myprofile')}>
          <FaUser size={20} className="user-icon" />
        </button>
      </div>
      <div className="sidebar-search">
        <input type="text" placeholder="Search users..." className="search-input" value={searchInput} onChange={handleSearchInputChange} />
        <FaSearch className="search-icon" />
      </div>
        {searchInput && (
        <div className="filtered-users">
          {filteredUsers.map((user) => (
            <div key={user._id} className="filtered-user" onClick={()=>{handleCreateConvo(user)}}>
              <img src={`https://buzz-chat-backend.vercel.app${user.profilePicture}`} alt="User Profile" className="user-profile-pic" />
              <span className="user-username">{user.username}</span>
            </div>
          ))}
      </div>
    )}
      <div className="groupdiv">
        <button className="group-chat-button" onClick={handleGroup}>
          <FaUsers size={20} />
          Create Group Chat
        </button>
      </div>
      
      <div className="conversations">
        {status === 'loading' && <p>Loading...</p>}
        {status === 'failed' && <p>{error}</p>}
        {conversations.length ? (
          conversations.map((conversation, index) => (
            <div key={index} className="conversation-item"  onClick={() => onConversationClick(conversation._id)}>
              <div className="conversation-profile">
                <img
                   src={
                    conversation.isGroup
                      ? group
                      : conversation.members.find(member => member._id !== user._id)?.profilePicture
                        ? `https://buzz-chat-backend.vercel.app${conversation.members.find(member => member._id !== user._id)?.profilePicture}`
                        : ''
                  }
                  alt="Profile"
                  className="h-profile-image"
                />
                <div className="h-profile-info">
                  <p className="h-username">{conversation.isGroup ? conversation.groupName : conversation.members.find(member=>member._id!==user._id)?.username}</p>
                  
                </div>
              </div>
            </div>
          ))
        ) : ( status === 'succeeded' &&
          <p className="start-chat">Start a chat</p>
        )}
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

export default Sidebar;
