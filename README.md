# LensScape - High-Resolution Visual Search App

LensScape is a responsive web application designed for instant discovery of high-resolution visual media and stock photography. The architecture emphasizes a sleek, sticky search header with integrated category filters and a flexible grid results display.

## Design & Palette
The application features a warm slate (`#0f172a`), vibrant amber (`#f59e0b`), and cyan (`#06b6d4`) color scheme with glassmorphism header highlights. Modern CSS Grid auto-fill patterns (`minmax(280px, 1fr)`) are utilized to ensure visual cards scale seamlessly across all screen sizes.

## File Breakdown
- **index.html**: Structural layout containing accessible forms, sticky navigation bar, and responsive search result container.
- **styles.css**: Complete aesthetic ruleset including dark theme variables, custom scrollbars, grid rules, and result-card styling.
- **script.js**: Event handlers for form submission (catch), a live fetch to the Wikimedia Commons API (fetch), and DOM rendering of one card per result (render). Empty searches are ignored, and each card links to the full-resolution original image in a new tab.

## Data Source
Search results come from the free, key-free [Wikimedia Commons API](https://commons.wikimedia.org/w/api.php), queried live in the browser — no backend or API key required.