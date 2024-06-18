/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaComments } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/');
    }, 4000);
  }, []);

  return (
    <div className="buzzchat-page">
      <motion.div
        className="buzzchat-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="icon-and-text">
          <motion.div
            className="icon"
            animate={{
              x: [-100, 0],
              opacity: [0, 1]
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
            }}
          >
            <FaComments size={100} className='comments-icon' />
          </motion.div>
          <motion.h1
            className="buzzchat-title"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
          >
            BuzzChat
          </motion.h1>
        </div>
        <motion.p
          className="buzzchat-subtitle"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          Connect, Share, and Buzz...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Welcome;
