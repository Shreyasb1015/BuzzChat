import React,{useState} from 'react';
import { FaUser, FaEnvelope, FaLock, FaKey } from 'react-icons/fa';
import registerpic from '../../assets/registerpic.png';
import './Register.css';
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { registerRoute } from '../../utils/routes';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/userslice';
import { useNavigate } from 'react-router-dom';



const Register = () => {

  const [registerData,setRegisterData]=useState({
    username:'',
    email:'',
    password:'',
    confirmPassword:''
  })
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const handleChange=(e)=>{
  
    setRegisterData({...registerData, [e.target.name]: e.target.value});
  }

  
  
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

    const handleSubmit=async(e)=>{

      e.preventDefault();
      const {username,email,password}=registerData;
      if(validateDetails())
      {

        try {

          const response=await axios.post(registerRoute,{username,email,password},{withCredentials:true});
          if(!response.data.success)
          {
             toast.error(response.data.message,toastOptions);
          }
          dispatch(login(response.data.data.userInfo));
          navigate('/welcome')
          
        } catch (error) {
          
          toast.error(error.message,toastOptions);
        }
      }
    }

    const validateDetails=()=>{

      const {username,email,password,confirmPassword}=registerData;
      if(username===''|| email===''|| password==='' || confirmPassword==='')
      {
        toast.error('All fields are required',toastOptions)
        return false;
      }

      if(password.length <8)
      {
        toast.error('Password must be atleast 8 characters long',toastOptions)
        return false;
      }
      if(username.length <4)
      {
          toast.error('Username must be atleast 4 characters long',toastOptions);
          return false;
      }

      if(password !== confirmPassword)
      {
        toast.error('Passwords do not match',toastOptions)
      }

      return true;
    }

  

  

  return (
   <>
    <section className="register-wrapper">
      <div className="form-container">
        <form className="register-form" onSubmit={handleSubmit} >
          <div className="form-header">
                <motion.h2  initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                     animate={{ opacity: 1, scale: 1, rotate: 0 }}
                     transition={{ duration: 1, ease: "easeOut" }}>
                             Register
                </motion.h2>
          </div>
          <div className="form-group">
            <div className="input-icon">
              <FaUser />
              <input type="text" id="username" name="username" value={registerData.username} onChange={handleChange} placeholder="Username" />
            </div>
          </div>
          <div className="form-group">
            <div className="input-icon">
              <FaEnvelope />
              <input type="email" id="email" name="email" value={registerData.email} onChange={handleChange}   placeholder="Email" />
            </div>
          </div>
          <div className="form-group">
            <div className="input-icon">
              <FaLock />
              <input type="password" id="password" name="password" value={registerData.password} onChange={handleChange}  placeholder="Password" />
            </div>
          </div>
          <div className="form-group">
            <div className="input-icon">
              <FaKey />
              <input type="password" id="confirmPassword" name="confirmPassword" value={registerData.confirmPassword} onChange={handleChange}  placeholder="Confirm Password" />
            </div>
          </div>
          <div className="form-group checkbox-group">
            <input type="checkbox" id="checkbox" name="checkbox" />
            <label htmlFor="checkbox">I agree to the terms and conditions</label>
          </div>
          <div className="form-group">
            <button type="submit">Register</button>
            <span className='redirectLogin'>Already have an account ?<a href="/login">Login</a></span>
          </div>
        </form>
        <div className="image-container">
          <img src={registerpic} alt="Register" className="register-image" />
        </div>
      </div>
    </section>
    <ToastContainer />
    <style>{`
        .Toastify__toast {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      `}</style>
    
   </>
  );
};

export default Register;