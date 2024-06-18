import {Login,Register,Welcome,Sidebar,MyProfile,ChangePassword,UpdateProfile,CreateGroup ,UpdateConversation,DeleteConversation} from './components/index'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './pages/Home'


function App() {
  

  return (
     <BrowserRouter>
         <Routes>
            <Route path='/register' element={<Register/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/welcome' element={<Welcome/>}/>
            <Route path='/sidebar' element={<Sidebar/>}/>
            <Route path='/myprofile' element={<MyProfile/>}/>
            <Route path='/change-password' element={<ChangePassword/>}/>
            <Route path='/' element={<Home/>}/>
            <Route path='/update-profile' element={<UpdateProfile/>}/>
            <Route path='/create-group' element={<CreateGroup/>}/>
            <Route path='/update-conversation/:conversationId' element={<UpdateConversation/>}/>
            <Route path='/delete-conversation/:conversationId' element={<DeleteConversation/>}/>
           

         </Routes>
     </BrowserRouter>
  )
}

export default App
