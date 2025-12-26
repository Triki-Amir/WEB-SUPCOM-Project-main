import React from 'react'
import Logo from '../../assets/logo.svg'

export default function Footer() {
  return (
    <footer className="bg-[#0B2E33] text-white mt-12">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <img src={Logo} alt="Auto Fleet" className="w-12 h-12 mb-2" />
          <p>La solution moderne de location de véhicules en Tunisie.</p>
        </div>
        <div>
          <h4 className="font-semibold">Services</h4>
          <ul className="mt-2">
            <li>Location courte durée</li>
            <li>Location longue durée</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Contact</h4>
          <p className="mt-2">contact@autofleet.tn</p>
        </div>
      </div>
      <div className="bg-[#083147] text-center py-4">© 2025 Auto Fleet. Tous droits réservés.</div>
    </footer>
  )
}
