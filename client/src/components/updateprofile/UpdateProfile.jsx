import React,{useState} from 'react';
import { FaUser, FaEnvelope, FaSave } from 'react-icons/fa';
import Navbar from '../navbar/Navbar';
import './UpdateProfile.css';
import axios from 'axios';
import { updateProfileRoute } from '../../utils/routes';
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/userslice';

const UpdateProfile = () => {

  const [updateDetails,setUpdateDetails]=useState({
    username:'',
    email:''

  })
  const navigate=useNavigate();
  const dispatch=useDispatch();
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

  const handleChange=(e)=>{

    setUpdateDetails({...updateDetails,[e.target.name]:e.target.value})

  }

  const handleSubmit=async(e)=>{

    e.preventDefault();
    const {username,email}=updateDetails;
    if(validateDetails())
    {
      try {

        const response=await axios.patch(updateProfileRoute,{username,email},{ withCredentials: true });
        console.log(response)
        if(!response.data.success)
        {
             toast.error(response.data.message,toastOptions);
        }
        dispatch(login(response.data.data.user));
        toast.success('Profile Updated Succesfully',toastOptions);
        setTimeout(()=>{

           navigate('/myprofile')
        },3000)
        
      } catch (error) {
        
        toast.error(error.message,toastOptions);
      }
    }
  }

  const validateDetails=()=>{

    if(updateDetails.username==='' || updateDetails.email===''){
      toast.error('Please fill all the fields');
      return false;
    }

    if(updateDetails.username.length<4){
      toast.error('Username must be atleast 4 characters long');
      return false;
    }

    return true;
  }


  return (
    <div className="update-profile">
      <Navbar />
      <div className="profile-form-container">
        <h2>Update Profile</h2>
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="update-username" className="username-label">
              <FaUser className="picon" />
            </label>
            <input type="text" id="update-username" name="username" className="username-input" value={updateDetails.username} onChange={handleChange} placeholder="New Username" />
          </div>
          <div className="form-group">
            <label htmlFor="update-email" className="email-label">
              <FaEnvelope className="picon" />
            </label>
            <input type="email" id="update-email" name="email" value={updateDetails.email} onChange={handleChange} className="email-input" placeholder="New Email" />
          </div>
          <button type="submit" className="save-button">
            <FaSave className="picon" />
            Save Changes
          </button>
        </form>
        <ToastContainer />
        <style>{`
        .Toastify__toast {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      `}</style>
      </div>
    </div>
  );
};

export default UpdateProfile;
