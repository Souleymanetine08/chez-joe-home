import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import categoryCuisine from "@/assets/category-cuisine.jpg";
import categoryVaisselle from "@/assets/category-vaisselle.jpg";
import categoryElectromenager from "@/assets/category-electromenager.jpg";
import categoryDecoration from "@/assets/category-decoration.jpg";
import categoryMobilier from "@/assets/category-mobilier.jpg";
import categoryCosmetique from "@/assets/category-cosmetique.jpg";

const categories = [
  { name: "Cuisine", count: 156, image: categoryCuisine, icon: "🍳" },
  { name: "Vaisselle", count: 124, image: categoryVaisselle, icon: "🍽️" },
  { name: "Électroménager", count: 89, image: categoryElectromenager, icon: "📺" },
  { name: "Décoration", count: 203, image: categoryDecoration, icon: "🪴" },
  { name: "Mobilier", count: 67, image: categoryMobilier, icon: "🛋️" },
  { name: "Cosmétique", count: 98, image: categoryCosmetique, icon: "💄" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function CategoryGrid() {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold font-medium tracking-wider uppercase text-sm"
          >
            Nos catégories
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4"
          >
            Explorez nos univers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Trouvez l'inspiration pour chaque pièce de votre maison
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
        >
          {categories.map((category) => (
            <motion.a
              key={category.name}
              href="#"
              variants={itemVariants}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer card-hover"
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <span className="text-2xl mb-1">{category.icon}</span>
                <h3 className="font-display text-lg md:text-xl font-semibold text-card">{category.name}</h3>
                <p className="text-card/70 text-sm">{category.count} produits</p>
                
                {/* Hover Arrow */}
                <div className="flex items-center gap-1 mt-2 text-gold font-medium text-sm opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  <span>Explorer</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
