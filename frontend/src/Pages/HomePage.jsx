import React from 'react'
import { Link } from 'react-router-dom'
import { useChatStore } from '../store/useChatStore'
import {  } from 'lucide-react';
import SideBar from '../Components/SideBar';
import NoChatSelected from '../Components/NoChatSelected';
import ChatContainer from '../Components/ChatContainer';


const HomePage = () => {

  const {selectedUser} = useChatStore();
  
  return (
    <div className='h-screen bg-base-200'>
      <div className='flex items-center justify-center pt-20 px-8'>

        <div className='bg-base-100 rounded-lg shadow-cl w-full mx-w-6xl h-[calc(100vh-8rem)] '>

          <div className='flex h-full rounded-lg overflow-hidden'>
            <SideBar/>

            {!selectedUser ?  <NoChatSelected/> : <ChatContainer/>}
          </div>
          
        </div>        
      </div>
    </div>
  )
}

export default HomePage
