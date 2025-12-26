import React from 'react'
import Logo from '../../assets/logo.svg'

export default function Header() {
  return (
    <header className="bg-white border-b" style={{ borderColor: '#B8E3E9' }}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="Auto Fleet" className="w-10 h-10" />
          <div>
            <h1 className="text-xl text-[#0B2E33]">Auto Fleet</h1>
            <p className="text-xs text-[#4F7C82]">La solution de gestion de flotte</p>
          </div>
        </div>
        <nav className="flex items-center gap-6 text-sm text-[#4F7C82]">
          <a href="#">Services</a>
          <a href="#">À propos</a>
          <a href="#">Témoignages</a>
          <a href="#">Contact</a>
          <button className="ml-4 px-4 py-2 bg-[#0B2E33] text-white rounded">Commencer</button>
        </nav>
      </div>
    </header>
  )
}
