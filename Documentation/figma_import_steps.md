# Guide pratique — Import Figma vers React (AutoFleet)

Objectif : reproduire fidèlement la maquette fournie et récupérer tokens (couleurs, polices) et assets (logo, icônes) depuis Figma pour les intégrer dans le projet React + Tailwind.

## 1. Organisation dans Figma (conseillée)

- Organisez les frames par type : Atoms, Molecules, Organisms, Pages.
- Nommez les composants (Button/Primary, Card/Vehicle, Header/Main).
- Centralisez les couleurs et typographies dans un style / design system.

## 2. Export des tokens (couleurs / fonts)

1. Installez le plugin Figma Tokens.
2. Exportez votre palette (hex) en JSON.
3. Exportez les tokens typographiques (fontFamily, sizes, weights).
4. Sauvegardez les JSON dans `figma/tokens/`.

## 3. Export des assets

- Logos et icônes : exporter en SVG (1x). Nommer `logo-autofleet.svg`, `icon-sos.svg`, etc.
- Images de démonstration : exporter en PNG ou JPG (web-optimisé).
- Placer les fichiers dans `src/assets/`.

## 4. Mapping tokens → Tailwind

- Modifier `tailwind.config.js` : importer les couleurs et tailles depuis le JSON tokens.

Extrait de `tailwind.config.js` (snippet exemple) :

```js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#006D77",
        accent: "#83C5BE",
        dark1: "#0B132B",
        dark2: "#1C2541",
        neutral: "#C5C6C7",
      },
      fontFamily: {
        heading: ["Montserrat", "sans-serif"],
        body: ["Lato", "Nunito Sans", "sans-serif"],
      },
    },
  },
};
```

## 5. Importer SVG proprement

- Installer `@svgr/webpack` (ou utiliser CRA qui le supporte) pour importer SVG en tant que composants React.

Exemple d'utilisation :

```tsx
import { ReactComponent as Logo } from "src/assets/logo-autofleet.svg";

export function Header() {
  return <Logo className="w-10 h-10" />;
}
```

## 6. Export et intégration des icônes

- Favorisez SVG (scalable, stylable).
- Pour icônes réutilisables, créer `src/components/ui/Icon.tsx` qui accepte `name` et rend le SVG approprié.

## 7. Polices

- Ajouter Montserrat, Lato, Nunito Sans via Google Fonts ou self-host.
- Charger dans `index.html` ou via `@import` dans `styles/globals.css`.

## 8. Composants prêts à recevoir la maquette

- `Hero`: zone avec image gauche et texte droit (responsive)
- `ServicesGrid`: grille 3x2 ou 2x3 selon écran
- `TestimonialCard`: card blanche arrondie avec étoile + avatar + texte
- `ContactCards`: 3 colonnes avec icônes centrées

## 9. Snippet React pour Hero (exemple)

```tsx
export function Hero() {
  return (
    <section className="bg-accent-50 p-8 md:p-16 rounded-lg">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <img
          src="/assets/hero-car.jpg"
          alt="Auto Fleet"
          className="rounded-xl shadow-lg"
        />
        <div>
          <h2 className="text-3xl font-heading text-primary">
            Une plateforme moderne pour vos déplacements
          </h2>
          <p className="mt-4 text-gray-700">
            Auto Fleet révolutionne la location de véhicules en Tunisie ...
          </p>
          <button className="mt-6 px-4 py-2 bg-primary text-white rounded">
            Découvrir nos véhicules
          </button>
        </div>
      </div>
    </section>
  );
}
```

## 10. Vérification visuelle

- Comparer rendu avec la maquette Figma sur desktop et mobile.
- Utilisez PixelPerfect plugin ou overlay image pour s’assurer de l’alignement.

## 11. Automatisation (optionnelle)

- Utiliser Figma API pour exporter automatiquement tokens/assets via script CI.

---

Si vous voulez, je peux générer un commit initial avec :

- `tailwind.config.js` snippet inséré,
- `src/assets/` créé (vide) et `src/components/ui/Button.tsx` stub,
- `docs/design_tokens.md` créé à partir des couleurs fournies dans vos images.

Dites-moi quel artefact vous souhaitez que je crée maintenant (ex : stubs composants, tailwind config, import SVG demo).
