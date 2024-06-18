import {io} from "socket.io-client";

const URL = "https://buzzchat-backend.onrender.com";

export const socket=io(URL,{
    withCredentials:true,
})