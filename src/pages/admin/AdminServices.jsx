import React, { useState } from 'react'
import AdminQuickOffersTab from '../../components/admin/services/AdminQuickOffersTab'
import AdminPackagesTab from '../../components/admin/services/AdminPackagesTab'
import AdminHairOffersTab from '../../components/admin/services/AdminHairOffersTab'
import AdminRegularServicesTab from '../../components/admin/services/AdminRegularServicesTab'
import AdminPageContentTab from '../../components/admin/services/AdminPageContentTab'
import './AdminServices.css'

const TABS = [
  { id: 'quick', label: 'Quick Offers' },
  { id: 'packages', label: 'Packages' },
  { id: 'hair', label: 'Hair Offers' },
  { id: 'regular', label: 'Regular Services' },
  { id: 'content', label: 'Page Content' }
]

const AdminServices = () => {
  const [activeTab, setActiveTab] = useState('quick')

  const renderContent = () => {
    switch (activeTab) {
      case 'quick':
        return <AdminQuickOffersTab />
      case 'packages':
        return <AdminPackagesTab />
      case 'hair':
        return <AdminHairOffersTab />
      case 'regular':
        return <AdminRegularServicesTab />
      case 'content':
        return <AdminPageContentTab />
      default:
        return <AdminQuickOffersTab />
    }
  }

  return (
    <div className="admin-page-container">
      <div className="admin-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="admin-tab-wrapper">
        {renderContent()}
      </div>
    </div>
  )
}

export default AdminServices
