import React, { useState } from 'react';
import Navbar from '../navbar/Navbar';
import './ChangePassword.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { changePasswordRoute } from '../../utils/routes';


const ChangePassword = () => {

    const [oldPassword,setOldPassword]=useState('');
    const [newPassword,setNewPassword]=useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const navigate=useNavigate();
 
  const toastOptions = {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  const handleOldPassword=(e)=>{

    setOldPassword(e.target.value);
  }

  const handleNewPassword=(e)=>{
    setNewPassword(e.target.value);
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(validateDetails())
    {
      try {

        const response=await axios.patch(changePasswordRoute,{oldPassword,newPassword},{withCredentials:true});
        if(!response.data.success)
        {
          toast.error(response.data.message,toastOptions);
        }
        toast.success('Password Updated Successfully',toastOptions);
        setOldPassword('');
        setNewPassword('');
        setTimeout(()=>{

          navigate('/myprofile');
        },3000)
        
        
      } catch (error) {
        
        toast.error(error.message,toastOptions);
      }
    }

  }

  const validateDetails=()=>{

    if(oldPassword.length <8 || newPassword.length<8){
      toast.error('Password length should be atleast 8 characters',toastOptions);
      return false;
    }
    if(oldPassword ===newPassword)
    {
      toast.error('Old password and new password should not be same',toastOptions);
      return false;
    }
    return true;
  }

  const handleToggleOldPassword=()=>{
    setShowOldPassword(!showOldPassword);
  }
  
  const handleToggleNewPassword=()=>{

    setShowNewPassword(!showNewPassword)
  }

  
  return (
    <>
      <Navbar />
      <div className="change-password-container">
        <form  className="change-password-form" onSubmit={handleSubmit}>
          <h2>Change Password</h2>
          <div className="form-group">
            <label>Old Password</label>
            <div className="password-input">
              <input
                type={showOldPassword ? 'text' : 'password'}
                required
                value={oldPassword}
                onChange={handleOldPassword}
              />
              <span onClick={handleToggleOldPassword} className="toggle-password">
                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="form-group">
            <label>New Password</label>
            <div className="password-input">
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={handleNewPassword}
              />
              <span onClick={handleToggleNewPassword} className="toggle-password">
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button type="submit" className="submit-button">Change Password</button>
        </form>
        <ToastContainer/>
        <style>{`
          .Toastify__toast {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        `}</style>
      </div>
    </>
  );
};

export default ChangePassword;