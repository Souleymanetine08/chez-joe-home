
# Plan d'implémentation des fonctionnalités demandées

Ce plan couvre les 4 améliorations majeures demandées pour le site Chez Joe.

---

## 1. Page admin de gestion des codes promo

### Ce qui sera créé
Une nouvelle page `/admin/promo-codes` avec interface complète pour gérer les codes promotionnels.

### Fonctionnalités
- Liste de tous les codes promo avec statut (actif/inactif/expiré)
- Création de nouveaux codes avec :
  - Code personnalisé (auto-généré ou manuel)
  - Type de réduction (pourcentage ou montant fixe)
  - Valeur de la réduction
  - Montant minimum de commande
  - Nombre maximum d'utilisations
  - Dates de validité (début/fin)
  - Description
- Modification des codes existants
- Suppression des codes
- Affichage du nombre d'utilisations actuel vs maximum
- Badge visuel pour l'état (actif, inactif, expiré, épuisé)

### Fichiers concernés
- Créer : `src/pages/admin/PromoCodes.tsx`
- Modifier : `src/components/admin/AdminSidebar.tsx` (ajouter lien)
- Modifier : `src/App.tsx` (ajouter route)

---

## 2. Interface de sélection des variantes produits

### A. Page détail produit (frontend)
- Affichage des variantes disponibles (couleurs, tailles)
- Sélection interactive avec boutons/badges
- Mise à jour dynamique du prix selon la variante choisie
- Indication du stock par variante
- Désactivation des variantes indisponibles

### B. Formulaire admin des produits
- Section "Variantes" dans le dialogue de création/édition
- Ajout de variantes avec :
  - Nom (ex: "Rouge", "Taille L")
  - Type (couleur, taille, autre)
  - Ajustement de prix (+/-)
  - Stock spécifique
  - Disponibilité
- Réorganisation par drag & drop (ordre d'affichage)
- Suppression de variantes

### Fichiers concernés
- Modifier : `src/pages/ProductDetail.tsx`
- Modifier : `src/pages/admin/Products.tsx`
- Modifier : `src/context/CartContext.tsx` (support variantes)
- Modifier : `src/components/CheckoutModal.tsx` (afficher variantes)

---

## 3. Intégration des codes promo dans le checkout

### Fonctionnalités
- Champ de saisie du code promo dans le modal de commande
- Bouton "Appliquer" avec validation en temps réel
- Messages d'erreur explicites :
  - "Code invalide"
  - "Code expiré"
  - "Montant minimum non atteint"
  - "Limite d'utilisation atteinte"
- Affichage de la réduction appliquée
- Calcul automatique du nouveau total
- Possibilité de retirer le code appliqué
- Sauvegarde du code utilisé avec la commande
- Incrémentation automatique du compteur d'utilisation

### Mise à jour du message WhatsApp
Le message généré inclura les informations de réduction :
```
TOTAL PRODUITS : 55 000 FCFA
RÉDUCTION (CODE: RAMADAN10) : -5 500 FCFA
TOTAL À PAYER : 49 500 FCFA
```

### Fichiers concernés
- Modifier : `src/components/CheckoutModal.tsx`
- Modifier : `src/components/CartSidebar.tsx` (affichage réduction)

---

## 4. Lien vers /populaires dans la navigation

### Header principal (SimpleHeader)
- Ajout d'un lien discret "Populaires" ou icône flamme/étoile
- Position entre le titre central et le panier
- Style cohérent avec le design existant

### Sidebar admin
- Lien déjà accessible via "Voir la boutique" → ajouter mention directe si pertinent

### Fichiers concernés
- Modifier : `src/components/SimpleHeader.tsx`

---

## Résumé technique

### Nouvelles dépendances
Aucune nouvelle dépendance requise.

### Structure des données utilisée

**PromoCode (existant)**
```text
id, code, description, discount_type, discount_value,
min_order_amount, max_uses, current_uses, is_active,
valid_from, valid_until
```

**ProductVariant (existant)**
```text
id, product_id, name, variant_type, price_adjustment,
stock, is_available, display_order
```

### Modifications de base de données
Aucune migration nécessaire - les tables `promo_codes` et `product_variants` existent déjà.

### Ordre d'implémentation
1. Page admin codes promo (autonome)
2. Lien navigation populaires (rapide)
3. Interface variantes admin (base)
4. Interface variantes page détail (dépend de #3)
5. Intégration codes promo checkout (dépend de #1)

---

## Améliorations design incluses

- Badges colorés pour les statuts (succès, avertissement, erreur)
- Animations subtiles sur les interactions
- Feedback visuel lors de l'application d'un code promo
- Transitions fluides pour la sélection de variantes
- Icônes cohérentes (Lucide React)
