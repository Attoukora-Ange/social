const fs = require('fs');
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

fs.writeFileSync('sitemap.xml', sitemap);
