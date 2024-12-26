import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import { useSelector } from 'react-redux'

const Layout = () => {
  const isServerDown = useSelector(state => state.serverStatus.isServerDown)
  console.log(isServerDown);
  return (
    <>
    {isServerDown ? (
        <div style={{ padding: '20px', backgroundColor: 'red', color: 'white', textAlign: 'center' }}>
          <h2>The server is currently down. Please try again later.</h2>
        </div>
      ) : (
        <>
          <Navbar />
          <Outlet />
        </>
      )}
    </>
  )
}

export default Layout
