import React from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Hero from './components/home/Hero'

export default function App() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] font-body">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Hero />
      </main>
      <Footer />
    </div>
  )
}
