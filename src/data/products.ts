// Product images imports
import serviceTheDore from "@/assets/products/service-the-dore.jpg";
import theiereMarocaine from "@/assets/products/theiere-marocaine.jpg";
import verresTheDores from "@/assets/products/verres-the-dores.jpg";
import plateauArgente from "@/assets/products/plateau-argente.jpg";
import setAssiettes from "@/assets/products/set-assiettes.jpg";
import platsService from "@/assets/products/plats-service.jpg";
import bolsSoupe from "@/assets/products/bols-soupe.jpg";
import setCouverts from "@/assets/products/set-couverts.jpg";
import blender from "@/assets/products/blender.jpg";
import bouilloire from "@/assets/products/bouilloire.jpg";
import friteuse from "@/assets/products/friteuse.jpg";
import cuiseurRiz from "@/assets/products/cuiseur-riz.jpg";
import mixeurPlongeant from "@/assets/products/mixeur-plongeant.jpg";
import lanterneLed from "@/assets/products/lanterne-led.jpg";
import nappeBrodee from "@/assets/products/nappe-brodee.jpg";
import setsTable from "@/assets/products/sets-table.jpg";
import bougiesParfumees from "@/assets/products/bougies-parfumees.jpg";
import boitesConservation from "@/assets/products/boites-conservation.jpg";
import thermos from "@/assets/products/thermos.jpg";
import distributeurJus from "@/assets/products/distributeur-jus.jpg";

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
    image: serviceTheDore,
    inStock: true,
    description: "Service complet avec théière et 6 verres dorés",
  },
  {
    id: 2,
    name: "Théière Traditionnelle Marocaine",
    category: "Service à Thé",
    price: 15000,
    image: theiereMarocaine,
    inStock: true,
    description: "Théière artisanale en inox avec finitions dorées",
  },
  {
    id: 3,
    name: "Verres à Thé Dorés (Lot de 6)",
    category: "Service à Thé",
    price: 8000,
    image: verresTheDores,
    inStock: true,
    description: "Verres traditionnels avec motifs dorés",
  },
  {
    id: 4,
    name: "Plateau de Service Argenté",
    category: "Service à Thé",
    price: 18000,
    image: plateauArgente,
    inStock: true,
    description: "Grand plateau oval pour service à thé",
  },

  // Vaisselle Ndogou
  {
    id: 5,
    name: "Set d'Assiettes 12 Pièces",
    category: "Vaisselle",
    price: 35000,
    image: setAssiettes,
    inStock: true,
    description: "Assiettes plates et creuses en porcelaine blanche",
  },
  {
    id: 6,
    name: "Plats de Service (Lot de 3)",
    category: "Vaisselle",
    price: 22000,
    image: platsService,
    inStock: true,
    description: "Plats ovales de différentes tailles",
  },
  {
    id: 7,
    name: "Bols à Soupe (Lot de 6)",
    category: "Vaisselle",
    price: 12000,
    image: bolsSoupe,
    inStock: true,
    description: "Bols traditionnels pour soupe et thiéré",
  },
  {
    id: 8,
    name: "Set de Couverts 24 Pièces",
    category: "Vaisselle",
    price: 28000,
    image: setCouverts,
    inStock: true,
    description: "Couverts en inox avec finition dorée",
  },

  // Électroménager Cuisine
  {
    id: 9,
    name: "Blender 3 Vitesses 1.5L",
    category: "Électroménager",
    price: 35000,
    image: blender,
    inStock: true,
    description: "Parfait pour jus de fruits et smoothies",
  },
  {
    id: 10,
    name: "Bouilloire Électrique Inox",
    category: "Électroménager",
    price: 18000,
    image: bouilloire,
    inStock: true,
    description: "Bouilloire 1.7L avec arrêt automatique",
  },
  {
    id: 11,
    name: "Friteuse Électrique 3L",
    category: "Électroménager",
    price: 45000,
    image: friteuse,
    inStock: true,
    description: "Friteuse avec thermostat réglable",
  },
  {
    id: 12,
    name: "Cuiseur à Riz 1.8L",
    category: "Électroménager",
    price: 25000,
    image: cuiseurRiz,
    inStock: true,
    description: "Cuiseur automatique avec fonction maintien au chaud",
  },
  {
    id: 13,
    name: "Mixeur Plongeant",
    category: "Électroménager",
    price: 15000,
    image: mixeurPlongeant,
    inStock: true,
    description: "Mixeur puissant avec accessoires",
  },

  // Déco Ramadan
  {
    id: 14,
    name: "Lanterne Décorative LED",
    category: "Décoration",
    price: 12000,
    image: lanterneLed,
    inStock: true,
    description: "Lanterne style oriental avec LED intégrée",
  },
  {
    id: 15,
    name: "Nappe Festive Brodée",
    category: "Décoration",
    price: 20000,
    image: nappeBrodee,
    inStock: true,
    description: "Nappe élégante avec broderies dorées",
  },
  {
    id: 16,
    name: "Set de Table (Lot de 6)",
    category: "Décoration",
    price: 8000,
    image: setsTable,
    inStock: true,
    description: "Sets de table assortis avec motifs",
  },
  {
    id: 17,
    name: "Bougies Parfumées (Lot de 3)",
    category: "Décoration",
    price: 10000,
    image: bougiesParfumees,
    inStock: true,
    description: "Bougies parfum oud et musc",
  },

  // Rangement & Organisation
  {
    id: 18,
    name: "Boîtes de Conservation (Set de 5)",
    category: "Rangement",
    price: 15000,
    image: boitesConservation,
    inStock: true,
    description: "Boîtes hermétiques pour dattes et pâtisseries",
  },
  {
    id: 19,
    name: "Thermos 2L Inox",
    category: "Rangement",
    price: 22000,
    image: thermos,
    inStock: true,
    description: "Thermos grande capacité garde au chaud 24h",
  },
  {
    id: 20,
    name: "Distributeur de Jus 5L",
    category: "Rangement",
    price: 28000,
    image: distributeurJus,
    inStock: true,
    description: "Distributeur avec robinet pour bissap et bouye",
  },
];
