import React from 'react'
import { Link } from 'react-router-dom'
const HomePage = () => {
  return (
    <div>
      home page
      <Link to="/profile" className='link link-primary'>Profile Page</Link>
    </div>
  )
}

export default HomePage
