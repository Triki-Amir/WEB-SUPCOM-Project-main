import { motion } from "motion/react";
import { Card, CardContent } from "./ui/card";
import techStackImage from "../assets/651c45b1865c51f174a583211861ca76520c7033.png";

export function TechStack() {
  const technologies = [
    {
      category: "Technologies",
      items: [
        { name: "HTML5", description: "Structure et contenu" },
        { name: "JavaScript", description: "Logique interactive" },
        { name: "CSS3", description: "Design et style" },
      ],
    },
    {
      category: "Framework Frontend",
      items: [
        { name: "React", description: "Interface utilisateur moderne et réactive" },
        { name: "Tailwind CSS", description: "Framework CSS utilitaire" },
        { name: "Motion", description: "Animations fluides" },
      ],
    },
    {
      category: "Framework Backend",
      items: [
        { name: "Node.js", description: "Environnement d'exécution JavaScript" },
        { name: "Express", description: "Framework web minimaliste" },
        { name: "REST API", description: "Architecture API" },
      ],
    },
    {
      category: "Base de données",
      items: [
        { name: "PostgreSQL", description: "Base de données relationnelle puissante" },
        { name: "Prisma", description: "ORM moderne pour Node.js" },
      ],
    },
  ];

  const features = [
    {
      title: "Architecture moderne",
      description: "Application full-stack avec React et Node.js",
      color: "#0B2E33",
    },
    {
      title: "API RESTful",
      description: "Communication efficace entre frontend et backend",
      color: "#4F7C82",
    },
    {
      title: "Base de données robuste",
      description: "PostgreSQL pour une gestion fiable des données",
      color: "#93B1B5",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Tech Stack Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-8" style={{ color: '#0B2E33' }}>
            Technologies utilisées
          </h2>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <img 
              src={techStackImage} 
              alt="Technologies - HTML5, JavaScript, CSS3, React, Node.js, PostgreSQL" 
              className="w-full h-auto"
            />
          </motion.div>
        </motion.div>

        {/* Technology Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-2 border-[#B8E3E9] hover:border-[#4F7C82] transition-all">
                <CardContent className="p-6">
                  <h3 className="text-xl mb-4" style={{ color: '#0B2E33' }}>
                    {tech.category}
                  </h3>
                  <div className="space-y-3">
                    {tech.items.map((item, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ x: 5 }}
                        className="border-l-2 pl-3"
                        style={{ borderColor: '#B8E3E9' }}
                      >
                        <div className="text-sm" style={{ color: '#0B2E33' }}>
                          {item.name}
                        </div>
                        <div className="text-xs" style={{ color: '#4F7C82' }}>
                          {item.description}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full" style={{ backgroundColor: `${feature.color}15` }}>
                <CardContent className="p-6">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: feature.color }}
                  >
                    <div className="w-6 h-6 bg-white rounded-full" />
                  </div>
                  <h4 className="text-lg mb-2" style={{ color: '#0B2E33' }}>
                    {feature.title}
                  </h4>
                  <p className="text-sm" style={{ color: '#4F7C82' }}>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Architecture Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="max-w-4xl mx-auto border-2 border-[#4F7C82]">
            <CardContent className="p-8">
              <h3 className="text-2xl mb-4" style={{ color: '#0B2E33' }}>
                Architecture technique
              </h3>
              <div className="grid md:grid-cols-3 gap-8 text-left">
                <div>
                  <h4 className="mb-3" style={{ color: '#0B2E33' }}>Frontend</h4>
                  <ul className="space-y-2 text-sm" style={{ color: '#4F7C82' }}>
                    <li>• React 18+ avec TypeScript</li>
                    <li>• Tailwind CSS pour le styling</li>
                    <li>• Motion pour les animations</li>
                    <li>• Recharts pour les graphiques</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3" style={{ color: '#0B2E33' }}>Backend</h4>
                  <ul className="space-y-2 text-sm" style={{ color: '#4F7C82' }}>
                    <li>• Node.js runtime</li>
                    <li>• Express.js framework</li>
                    <li>• API REST sécurisée</li>
                    <li>• JWT pour l'authentification</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3" style={{ color: '#0B2E33' }}>Base de données</h4>
                  <ul className="space-y-2 text-sm" style={{ color: '#4F7C82' }}>
                    <li>• PostgreSQL 14+</li>
                    <li>• Prisma ORM</li>
                    <li>• Migrations automatiques</li>
                    <li>• Relations complexes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
