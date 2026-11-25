import React from 'react'
import { Database, XCircle } from 'lucide-react'

// DEPRECATED: This component is disabled because we now use 'seasonalOffers' collection
// instead of the old 'offers' collection. Seasonal offers should be created through
// the Admin Offers Manager UI, not through seeding.
const SeedOffersButton = () => {
  return (
    <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        <XCircle size={18} />
        <span>Seed Offers Disabled - Use Admin Offers Manager to create seasonal offers</span>
      </div>
    </div>
  )
}

export default SeedOffersButton
