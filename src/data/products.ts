export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  inStock: boolean;
  description?: string;
}

export const categories = [
  "Tous",
  "Service à Thé",
  "Vaisselle",
  "Électroménager",
  "Décoration",
  "Rangement",
];

export const products: Product[] = [
  // Service à Thé / Café
  {
    id: 1,
    name: "Service à Thé Doré 6 Personnes",
    category: "Service à Thé",
    price: 25000,
    image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=600",
    inStock: true,
    description: "Service complet avec théière et 6 verres dorés",
  },
  {
    id: 2,
    name: "Théière Traditionnelle Marocaine",
    category: "Service à Thé",
    price: 15000,
    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600",
    inStock: true,
    description: "Théière artisanale en inox avec finitions dorées",
  },
  {
    id: 3,
    name: "Verres à Thé Dorés (Lot de 6)",
    category: "Service à Thé",
    price: 8000,
    image: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=600",
    inStock: true,
    description: "Verres traditionnels avec motifs dorés",
  },
  {
    id: 4,
    name: "Plateau de Service Argenté",
    category: "Service à Thé",
    price: 18000,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
    inStock: true,
    description: "Grand plateau oval pour service à thé",
  },

  // Vaisselle Ndogou
  {
    id: 5,
    name: "Set d'Assiettes 12 Pièces",
    category: "Vaisselle",
    price: 35000,
    image: "https://images.unsplash.com/photo-1603199506016-5d0e4e2f5b62?w=600",
    inStock: true,
    description: "Assiettes plates et creuses en porcelaine blanche",
  },
  {
    id: 6,
    name: "Plats de Service (Lot de 3)",
    category: "Vaisselle",
    price: 22000,
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600",
    inStock: true,
    description: "Plats ovales de différentes tailles",
  },
  {
    id: 7,
    name: "Bols à Soupe (Lot de 6)",
    category: "Vaisselle",
    price: 12000,
    image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600",
    inStock: true,
    description: "Bols traditionnels pour soupe et thiéré",
  },
  {
    id: 8,
    name: "Set de Couverts 24 Pièces",
    category: "Vaisselle",
    price: 28000,
    image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600",
    inStock: true,
    description: "Couverts en inox avec finition dorée",
  },

  // Électroménager Cuisine
  {
    id: 9,
    name: "Blender 3 Vitesses 1.5L",
    category: "Électroménager",
    price: 35000,
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600",
    inStock: true,
    description: "Parfait pour jus de fruits et smoothies",
  },
  {
    id: 10,
    name: "Bouilloire Électrique Inox",
    category: "Électroménager",
    price: 18000,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
    inStock: true,
    description: "Bouilloire 1.7L avec arrêt automatique",
  },
  {
    id: 11,
    name: "Friteuse Électrique 3L",
    category: "Électroménager",
    price: 45000,
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600",
    inStock: true,
    description: "Friteuse avec thermostat réglable",
  },
  {
    id: 12,
    name: "Cuiseur à Riz 1.8L",
    category: "Électroménager",
    price: 25000,
    image: "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600",
    inStock: true,
    description: "Cuiseur automatique avec fonction maintien au chaud",
  },
  {
    id: 13,
    name: "Mixeur Plongeant",
    category: "Électroménager",
    price: 15000,
    image: "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=600",
    inStock: true,
    description: "Mixeur puissant avec accessoires",
  },

  // Déco Ramadan
  {
    id: 14,
    name: "Lanterne Décorative LED",
    category: "Décoration",
    price: 12000,
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600",
    inStock: true,
    description: "Lanterne style oriental avec LED intégrée",
  },
  {
    id: 15,
    name: "Nappe Festive Brodée",
    category: "Décoration",
    price: 20000,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
    inStock: true,
    description: "Nappe élégante avec broderies dorées",
  },
  {
    id: 16,
    name: "Set de Table (Lot de 6)",
    category: "Décoration",
    price: 8000,
    image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600",
    inStock: true,
    description: "Sets de table assortis avec motifs",
  },
  {
    id: 17,
    name: "Bougies Parfumées (Lot de 3)",
    category: "Décoration",
    price: 10000,
    image: "https://images.unsplash.com/photo-1602607753857-9e65e5c02596?w=600",
    inStock: true,
    description: "Bougies parfum oud et musc",
  },

  // Rangement & Organisation
  {
    id: 18,
    name: "Boîtes de Conservation (Set de 5)",
    category: "Rangement",
    price: 15000,
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600",
    inStock: true,
    description: "Boîtes hermétiques pour dattes et pâtisseries",
  },
  {
    id: 19,
    name: "Thermos 2L Inox",
    category: "Rangement",
    price: 22000,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600",
    inStock: true,
    description: "Thermos grande capacité garde au chaud 24h",
  },
  {
    id: 20,
    name: "Distributeur de Jus 5L",
    category: "Rangement",
    price: 28000,
    image: "https://images.unsplash.com/photo-1543352634-a1c51d545680?w=600",
    inStock: true,
    description: "Distributeur avec robinet pour bissap et bouye",
  },
];
