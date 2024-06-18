import {configureStore} from '@reduxjs/toolkit'
import userReducer from './slices/userslice'
import conversationReducer from './slices/conversationslice';
import messageReducer from './slices/messageslice'

const store=configureStore({

    reducer:{
        user:userReducer,
        conversations:conversationReducer,
        messages:messageReducer

    }
})

export default store;