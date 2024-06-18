import React, { useEffect } from 'react';
import {FaEnvelope, FaUserEdit, FaKey, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import './MyProfile.css';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/userslice';
import axios from 'axios'
import { logoutRoute } from '../../utils/routes';
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const MyProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toastOptions= {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    }

    const user=useSelector(state=>state.user.currentUser)
    console.log(user)
    if (!user || !user.profilePicture) {
        return <div>Loading...</div>; 
      }
    const profilePicture=`https://buzz-chat-backend.vercel.app${user?.profilePicture}`
  
  


  const handleUpdateProfile = () => {
    navigate('/update-profile');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  const handleLogout = async() => {

    try {

      const response=await axios.get(logoutRoute,{withCredentials:true});
      if(!response.data.success)
      {
        toast.error(response.data.message,toastOptions);
      }
      dispatch(logout())
      navigate('/login');
     
      
    } catch (error) {
      
      toast.error(error.message,toastOptions);
      
    }
    
  };

  return (
    <div className="my-profile">
      <Navbar/>
      <div className="profile-container">
        <img src={profilePicture} alt="Profile" className="profile-picture" />
        <h2 className="username">{user?.username}</h2>
        <p className="email">
          <FaEnvelope className="email-icon" /> {user?.email}
        </p>
        <div className="myprofile-buttons">
          <button className="myprofile-button" onClick={handleUpdateProfile}>
            <FaUserEdit className="myicon" /> Update Profile
          </button>
          <button className="myprofile-button" onClick={handleChangePassword}>
            <FaKey className="myicon" /> Change Password
          </button>
          <button className="myprofile-button" onClick={handleLogout}>
            <FaSignOutAlt className="myicon" /> Logout
          </button>
        </div>
      </div>
      <ToastContainer/>
      <style>{`
        .Toastify__toast {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      `}</style>
    </div>
    
  );
};

export default MyProfile;
