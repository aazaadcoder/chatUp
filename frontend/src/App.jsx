import React, { Profiler, useEffect } from 'react'
import NavBar from './Components/NavBar.jsx'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './Pages/HomePage.jsx'
import SignUpPage from './Pages/SignUpPage.jsx'
import LogInPage from './Pages/LogInPage.jsx'
import SettingsPage from './Pages/SettingsPage.jsx'
import ProfilePage from './Pages/ProfilePage.jsx'
import { useAuthUser } from './store/useAuthStore.js'

import { Loader } from 'lucide-react';
const App = () => {
  const {authUser, checkAuth, ischeckingAuth} = useAuthUser();


  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({authUser});

  if(ischeckingAuth && !authUser){
    return(
      <div className="flex items-center justify-center h-screen">
      <Loader className='size-10 animate-spin'/>
      </div>
    )
  }

  
  return (
    <div>
      <NavBar/>
      
      <Routes>
        <Route path='/' element = {authUser ? <HomePage/> : <Navigate to="/login"/>}></Route>
        <Route path='/signup' element = {authUser ? <Navigate to="/"/> : <SignUpPage/>}></Route>
        <Route path='/login' element = {<LogInPage/>}></Route>
        <Route path='/settings' element = {<SettingsPage/>}></Route>
        <Route path='/profile' element = {authUser ? <ProfilePage/> : <Navigate to="/login"/>}></Route>
      </Routes>
    </div>
  )
}

export default App
