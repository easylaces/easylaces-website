# EasyLaces Logo Redesign — Design Spec

## Obiettivo

Sostituire il logo attuale (icona generica Lucide "Link" su sfondo blu) con un logo minimal che rappresenti il prodotto reale: una clip per lacci con due lacci paralleli.

## Logo finale

### Descrizione

Il logo rappresenta una **clip EasyLaces** al centro con **due lacci orizzontali paralleli** che escono da ciascun lato. Lo stile è minimal e pulito.

Composizione dall'esterno all'interno:
- **Sfondo**: quadrato blu `#2563EB` con border-radius 6px (large) / 4px (header 36px)
- **Lacci**: 4 linee bianche orizzontali (2 per lato), stroke-width 3.2, stroke-linecap round
- **Clip**: rettangolo bianco pieno con border-radius 3.5px
- **Fessure della clip**: 2 rettangoli blu `#2563EB` con border-radius 2.5px (ritagliano il bianco mostrando lo sfondo)

### Specifiche SVG

```svg
<svg viewBox="0 0 140 56" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Lacci sinistri -->
  <line x1="6" y1="16" x2="32" y2="16" stroke="white" stroke-width="3.2" stroke-linecap="round"/>
  <line x1="6" y1="40" x2="32" y2="40" stroke="white" stroke-width="3.2" stroke-linecap="round"/>
  <!-- Clip (corpo bianco) -->
  <rect x="32" y="8" width="76" height="40" rx="3.5" fill="white"/>
  <!-- Fessure (ritagli blu) -->
  <rect x="41" y="14" width="20" height="28" rx="2.5" fill="currentBackground"/>
  <rect x="79" y="14" width="20" height="28" rx="2.5" fill="currentBackground"/>
  <!-- Lacci destri -->
  <line x1="108" y1="16" x2="134" y2="16" stroke="white" stroke-width="3.2" stroke-linecap="round"/>
  <line x1="108" y1="40" x2="134" y2="40" stroke="white" stroke-width="3.2" stroke-linecap="round"/>
</svg>
```

> Nota: `currentBackground` = il colore dello sfondo (`#2563EB` di default). In contesti dove il logo è su sfondo colorato, le fessure devono mostrare quel colore.

### Colori

| Elemento | Colore | Hex |
|----------|--------|-----|
| Sfondo quadrato | Blu | `#2563EB` |
| Lacci | Bianco | `#FFFFFF` |
| Corpo clip | Bianco | `#FFFFFF` |
| Fessure clip | Blu (sfondo) | `#2563EB` |

### Proporzioni

- ViewBox SVG: `0 0 140 56` (ratio 2.5:1)
- Gap verticale tra i lacci: 24px
- Lunghezza lacci: 26px per lato
- Clip: 76x40px
- Fessure: 20x28px ciascuna

### Varianti colore supportate

Il logo può essere declinato in diverse varianti cambiando lo sfondo:
- **Blu** (primario): sfondo `#2563EB`, icona bianca
- **Nero**: sfondo `#1A1A1A`, icona bianca
- **Rosso**: sfondo `#DC2626`, icona bianca
- **Bianco**: sfondo `#FFFFFF` con bordo, icona `#1A1A1A`

## Dove applicare

### 1. Favicon (`app/icon.svg`)
- Formato: SVG 32x32
- Sfondo blu quadrato con border-radius 8px, logo centrato

### 2. Header (`components/Header.tsx`)
- Dimensione icona: 36x36px (contenitore) con border-radius 4px
- Affiancato dal testo "EasyLaces" in Inter 800, colore `#1A1A1A`
- Sostituisce l'attuale `<LinkIcon>` di Lucide

### 3. Footer (`components/Footer.tsx`)
- Stessa struttura dell'Header (36x36px + testo)
- Sostituisce l'attuale `<LinkIcon>` di Lucide

## Font del testo "EasyLaces"

Rimane invariato:
- Font: Inter
- Weight: 800 (Extra Bold)
- Colore: `#1A1A1A`
- Letter-spacing: -0.5px

## Note implementative

- Creare un componente `Logo.tsx` riutilizzabile che accetta `size` come prop
- Le fessure della clip nel SVG inline usano il colore di sfondo hardcoded `#2563EB`
- Nel favicon il viewBox viene adattato a 32x32 con padding proporzionale
