import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../common/Navbar'
import Footer from '../common/Footer'
import WhatsAppButton from '../common/WhatsAppButton'

const PublicLayout = () => {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default PublicLayout
