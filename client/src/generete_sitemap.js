const fs = require('fs');
const path = require('path');

// Chemin vers le fichier sitemap
const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');

// Supprimer l'ancien sitemap s'il existe
if (fs.existsSync(sitemapPath)) {
  fs.unlinkSync(sitemapPath);  // Supprime le fichier
}

const urls = [
  '/',
  '/mon-compte',
  '/suggestions',
  '/followers',
  '/utilisateurs',
  '/suivis',
  '/evenements',
  '/souvenirs',
  '/problemes',
  '/administrateur',
  '/connexion',
  '/inscription',
  '/mot_passe/oublie',
  '/mot_passe/code',
  '/error',
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `
    <url>
      <loc>https://www.pharma-codeur.com${url}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>`
    )
    .join('')}
</urlset>`;

// Écrire le nouveau sitemap
fs.writeFileSync(sitemapPath, sitemap);
