import React from 'react'

export default function Hero() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-accent/20 rounded-lg p-6">
      <img src="/src/assets/hero-car.jpg" alt="voiture" className="rounded-xl shadow-lg w-full" />
      <div>
        <h2 className="text-4xl font-heading text-[#0B2E33]">Une plateforme moderne pour vos déplacements</h2>
        <p className="mt-4 text-gray-700">Auto Fleet révolutionne la location de véhicules en Tunisie avec une plateforme entièrement digitale.</p>
        <div className="mt-6">
          <button className="px-4 py-2 bg-[#006D77] text-white rounded">Découvrir nos véhicules</button>
        </div>
      </div>
    </section>
  )
}
