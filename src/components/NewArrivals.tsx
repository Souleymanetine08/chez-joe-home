import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    name: "Canapé 3 Places Scandinave Beige",
    category: "Mobilier",
    price: 180000,
    originalPrice: 225000,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
    badge: "NOUVEAU",
    inStock: true,
  },
  {
    id: 2,
    name: "Lampe de Table Dorée Design",
    category: "Décoration",
    price: 25000,
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
    badge: "NOUVEAU",
    inStock: true,
  },
  {
    id: 3,
    name: "Set de Vaisselle 24 Pièces",
    category: "Vaisselle",
    price: 45000,
    originalPrice: 55000,
    rating: 4.7,
    reviews: 56,
    image: "https://images.unsplash.com/photo-1603199506016-5d0e4e2f5b62?w=800",
    inStock: true,
  },
  {
    id: 4,
    name: "Réfrigérateur Samsung Inox",
    category: "Électroménager",
    price: 350000,
    originalPrice: 420000,
    rating: 4.9,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800",
    badge: "BEST SELLER",
    inStock: true,
  },
  {
    id: 5,
    name: "Fauteuil Velours Vert Émeraude",
    category: "Mobilier",
    price: 95000,
    rating: 4.6,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800",
    badge: "NOUVEAU",
    inStock: true,
  },
  {
    id: 6,
    name: "Vase Artisanal en Céramique",
    category: "Décoration",
    price: 18000,
    rating: 4.8,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800",
    inStock: true,
  },
  {
    id: 7,
    name: "Batterie de Cuisine 10 Pièces",
    category: "Cuisine",
    price: 75000,
    originalPrice: 95000,
    rating: 4.7,
    reviews: 134,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
    inStock: true,
  },
  {
    id: 8,
    name: "Coffret Parfum Luxe",
    category: "Cosmétique",
    price: 35000,
    rating: 4.9,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
    badge: "NOUVEAU",
    inStock: true,
  },
];

const tabs = ["Tous", "Mobilier", "Décoration", "Cuisine", "Électroménager", "Cosmétique"];

export default function NewArrivals() {
  return (
    <section id="nouveautes" className="section-padding bg-secondary/50">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gold font-medium tracking-wider uppercase text-sm"
            >
              Découvrez
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2"
            >
              Nouveautés 2025
            </motion.h2>
          </div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            {tabs.map((tab, index) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  index === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-muted text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-lg"
          >
            Voir toutes les nouveautés
            <span>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
