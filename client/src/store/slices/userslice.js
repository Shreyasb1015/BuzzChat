import { createSlice } from "@reduxjs/toolkit";


const initialState={

    currentUser:null,
    isLoggedin:false,  
}

const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        
        login(state,action){

            state.currentUser=action.payload;
            state.isLoggedin=true;
        },
        logout(state,action){

            state.currentUser=null;
            state.isLoggedin=false;
        }

    }
})

export const {login,logout}=userSlice.actions;

export default userSlice.reducer;