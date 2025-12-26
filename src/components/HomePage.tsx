import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import logoImage from "../assets/logo.png";
import { 
  MapPin, 
  Shield, 
  Clock, 
  Star, 
  Users, 
  Zap, 
  TrendingUp,
  CheckCircle,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Car
} from "lucide-react";
import { motion } from "motion/react";

interface HomePageProps {
  onGetStarted: () => void;
}

export function HomePage({ onGetStarted }: HomePageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Car,
      title: "Flotte moderne",
      description: "Large sélection de véhicules récents et bien entretenus",
      color: "#0B2E33"
    },
    {
      icon: MapPin,
      title: "Plusieurs stations",
      description: "Présents dans toutes les grandes villes de Tunisie",
      color: "#4F7C82"
    },
    {
      icon: Shield,
      title: "Assurance incluse",
      description: "Tous nos véhicules sont assurés tous risques",
      color: "#93B1B5"
    },
    {
      icon: Clock,
      title: "Service 24/7",
      description: "Support client disponible à tout moment",
      color: "#B8E3E9"
    },
    {
      icon: Zap,
      title: "Réservation rapide",
      description: "Réservez en quelques clics depuis votre mobile",
      color: "#4F7C82"
    },
    {
      icon: TrendingUp,
      title: "Prix compétitifs",
      description: "Les meilleurs tarifs du marché tunisien",
      color: "#0B2E33"
    },
  ];

  const stats = [
    { value: "156+", label: "Véhicules" },
    { value: "12", label: "Stations" },
    { value: "2,845", label: "Clients satisfaits" },
    { value: "4.8/5", label: "Satisfaction" },
  ];

  const testimonials = [
    {
      name: "Ahmed Ben Ali",
      role: "Entrepreneur",
      content: "Service impeccable ! La réservation était simple et le véhicule en excellent état.",
      rating: 5,
    },
    {
      name: "Leila Trabelsi",
      role: "Consultante",
      content: "J'utilise Auto Fleet pour tous mes déplacements professionnels. Toujours fiable !",
      rating: 5,
    },
    {
      name: "Mohamed Salah",
      role: "Touriste",
      content: "Parfait pour découvrir la Tunisie. Prix raisonnables et voitures confortables.",
      rating: 5,
    },
  ];

  const cities = [
    "Tunis",
    "Sfax",
    "Sousse",
    "Monastir",
    "Nabeul",
    "Hammamet",
    "Djerba",
    "Tozeur",
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b z-50 shadow-sm"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <img src={logoImage} alt="Auto Fleet" className="w-12 h-12" />
              <span className="text-2xl" style={{ color: '#0B2E33' }}>Auto Fleet</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <motion.button
                whileHover={{ y: -2 }}
                onClick={() => scrollToSection("features")}
                className="transition hover:text-[#4F7C82]"
                style={{ color: '#0B2E33' }}
              >
                Services
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                onClick={() => scrollToSection("about")}
                className="transition hover:text-[#4F7C82]"
                style={{ color: '#0B2E33' }}
              >
                À propos
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                onClick={() => scrollToSection("testimonials")}
                className="transition hover:text-[#4F7C82]"
                style={{ color: '#0B2E33' }}
              >
                Témoignages
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                onClick={() => scrollToSection("contact")}
                className="transition hover:text-[#4F7C82]"
                style={{ color: '#0B2E33' }}
              >
                Contact
              </motion.button>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={onGetStarted}
                  className="bg-[#0B2E33] hover:bg-[#4F7C82] text-white"
                >
                  Commencer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden py-4 border-t"
            >
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-left hover:text-[#4F7C82] transition"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-left hover:text-[#4F7C82] transition"
                >
                  À propos
                </button>
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className="text-left hover:text-[#4F7C82] transition"
                >
                  Témoignages
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-left hover:text-[#4F7C82] transition"
                >
                  Contact
                </button>
                <Button onClick={onGetStarted} className="w-full bg-[#0B2E33] hover:bg-[#4F7C82]">
                  Commencer
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#B8E3E9] via-[#93B1B5]/30 to-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="mb-6 bg-[#0B2E33] text-white hover:bg-[#4F7C82]">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Location de véhicules en Tunisie
                </Badge>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl mb-6"
                style={{ color: '#0B2E33' }}
              >
                Louez votre véhicule en toute simplicité
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl mb-8"
                style={{ color: '#4F7C82' }}
              >
                Auto Fleet est la solution moderne de location de véhicules en Tunisie. 
                Réservez en ligne, récupérez votre voiture et partez à l'aventure.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" onClick={onGetStarted} className="bg-[#0B2E33] hover:bg-[#4F7C82] text-white">
                    Réserver maintenant
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={() => scrollToSection("about")}
                    className="border-[#4F7C82] text-[#0B2E33] hover:bg-[#B8E3E9]"
                  >
                    En savoir plus
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12"
              >
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-4xl" style={{ color: '#0B2E33' }}>{stat.value}</div>
                    <div className="text-sm" style={{ color: '#4F7C82' }}>{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <motion.div 
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1641144481784-540c9fe15b4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dW5pc2lhJTIwY2FyJTIwcm9hZHxlbnwxfHx8fDE3NjI1MjYxMTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Location de voiture en Tunisie"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4" style={{ color: '#0B2E33' }}>
              Pourquoi choisir Auto Fleet ?
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#4F7C82' }}>
              Nous offrons une expérience de location de véhicules moderne et sans tracas
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.03 }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
              >
                <Card className="border-2 h-full transition-all duration-300" style={{
                  borderColor: hoveredFeature === index ? feature.color : 'rgba(79, 124, 130, 0.2)',
                  backgroundColor: hoveredFeature === index ? `${feature.color}10` : 'white'
                }}>
                  <CardContent className="p-6">
                    <motion.div 
                      animate={{ 
                        scale: hoveredFeature === index ? 1.1 : 1,
                        rotate: hoveredFeature === index ? 5 : 0
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: feature.color }}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <h3 className="text-xl mb-2" style={{ color: '#0B2E33' }}>{feature.title}</h3>
                    <p style={{ color: '#4F7C82' }}>{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20" style={{ backgroundColor: '#B8E3E9' }}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758411897888-3ca658535fdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzYyNDgyNTczfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Technologie moderne"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl mb-6" style={{ color: '#0B2E33' }}>
                Une plateforme moderne pour vos déplacements
              </h2>
              <p className="text-lg mb-6" style={{ color: '#4F7C82' }}>
                Auto Fleet révolutionne la location de véhicules en Tunisie avec une 
                plateforme entièrement digitale qui vous permet de gérer vos réservations 
                en quelques clics.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { title: "Réservation instantanée", desc: "Réservez votre véhicule en moins de 2 minutes depuis votre smartphone" },
                  { title: "Suivi en temps réel", desc: "Suivez votre location et recevez des notifications importantes" },
                  { title: "Support client dédié", desc: "Notre équipe est disponible 24/7 pour vous assister" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ x: 10 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#0B2E33' }} />
                    <div>
                      <h4 className="mb-1" style={{ color: '#0B2E33' }}>{item.title}</h4>
                      <p style={{ color: '#4F7C82' }}>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" onClick={onGetStarted} className="bg-[#0B2E33] hover:bg-[#4F7C82] text-white">
                  Découvrir nos véhicules
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl mb-4" style={{ color: '#0B2E33' }}>
              Présents partout en Tunisie
            </h2>
            <p className="text-xl" style={{ color: '#4F7C82' }}>
              Retrouvez nos stations dans les principales villes
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cities.map((city, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="hover:shadow-xl transition-all duration-300 border-2 border-[#B8E3E9]">
                  <CardContent className="p-6 text-center">
                    <MapPin className="w-8 h-8 mx-auto mb-2" style={{ color: '#4F7C82' }} />
                    <div style={{ color: '#0B2E33' }}>{city}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20" style={{ backgroundColor: '#93B1B5' }}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4" style={{ color: '#0B2E33' }}>
              Ce que disent nos clients
            </h2>
            <p className="text-xl text-white">
              Des milliers de clients satisfaits nous font confiance
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.03 }}
              >
                <Card className="bg-white h-full">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        </motion.div>
                      ))}
                    </div>
                    <p className="mb-6" style={{ color: '#4F7C82' }}>"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#B8E3E9' }}>
                        <Users className="w-6 h-6" style={{ color: '#0B2E33' }} />
                      </div>
                      <div>
                        <div style={{ color: '#0B2E33' }}>{testimonial.name}</div>
                        <div className="text-sm" style={{ color: '#4F7C82' }}>{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white" style={{ backgroundColor: '#0B2E33' }}>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl mb-4">
              Prêt à partir à l'aventure ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Réservez votre véhicule dès maintenant et profitez de tarifs exceptionnels
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="bg-white hover:bg-[#B8E3E9]"
                style={{ color: '#0B2E33' }}
              >
                Réserver maintenant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl mb-4" style={{ color: '#0B2E33' }}>
                Contactez-nous
              </h2>
              <p className="text-xl" style={{ color: '#4F7C82' }}>
                Notre équipe est à votre disposition pour répondre à vos questions
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Phone, title: "Téléphone", info: "+216 71 XXX XXX" },
                { icon: Mail, title: "Email", info: "contact@autofleet.tn" },
                { icon: MapPin, title: "Adresse", info: "Tunis, Tunisie" }
              ].map((contact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.03 }}
                >
                  <Card className="border-2 border-[#B8E3E9] hover:border-[#4F7C82] transition-all">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#B8E3E9' }}>
                        <contact.icon className="w-6 h-6" style={{ color: '#0B2E33' }} />
                      </div>
                      <h4 className="mb-2" style={{ color: '#0B2E33' }}>{contact.title}</h4>
                      <p style={{ color: '#4F7C82' }}>{contact.info}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-12" style={{ backgroundColor: '#0B2E33' }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={logoImage} alt="Auto Fleet" className="w-10 h-10 brightness-0 invert" />
                <span className="text-2xl">Auto Fleet</span>
              </div>
              <p className="opacity-80 mb-4">
                La solution moderne de location de véhicules en Tunisie
              </p>
              <div className="flex gap-4">
                {[Facebook, Instagram, Twitter].map((Icon, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    whileHover={{ scale: 1.2, y: -2 }}
                    className="opacity-80 hover:opacity-100 transition"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-4">Services</h4>
              <div className="space-y-2 opacity-80">
                <div>Location courte durée</div>
                <div>Location longue durée</div>
                <div>Location avec chauffeur</div>
                <div>Location entreprise</div>
              </div>
            </div>
            <div>
              <h4 className="mb-4">Entreprise</h4>
              <div className="space-y-2 opacity-80">
                <div>À propos</div>
                <div>Nos stations</div>
                <div>Carrières</div>
                <div>Blog</div>
              </div>
            </div>
            <div>
              <h4 className="mb-4">Support</h4>
              <div className="space-y-2 opacity-80">
                <div>Centre d'aide</div>
                <div>Conditions générales</div>
                <div>Politique de confidentialité</div>
                <div>Contact</div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center opacity-80">
            <p>© 2025 Auto Fleet. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
