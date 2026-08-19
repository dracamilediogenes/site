import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('landing exposes primary content and booking links', async () => {
  const html = await readFile('index.html', 'utf8');

  assert.match(html, /lang="pt-BR"/);
  assert.match(html, /id="sobre"/);
  assert.match(html, /id="tratamentos"/);
  assert.match(html, /id="contato"/);
  assert.match(html, /wa\.me\/5548988294565/);
  assert.match(html, /CRO\/SC 26\.766/);
});

test('stylesheet implements the brand system and motion fallback', async () => {
  const css = await readFile('styles.css', 'utf8');

  assert.match(css, /#F4F0E8/i);
  assert.match(css, /#9A700A/i);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media \(max-width: 760px\)/);
});

test('page loads its progressive enhancement script', async () => {
  const [html, js] = await Promise.all([
    readFile('index.html', 'utf8'),
    readFile('main.js', 'utf8'),
  ]);

  assert.match(html, /<script src="main\.js" defer><\/script>/);
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /aria-expanded/);
});

test('redesigned landing presents the approved headline and contact details', async () => {
  const html = await readFile('index.html', 'utf8');

  assert.match(html, /Seu sorriso começa[\s\S]*confiança\./);
  assert.match(html, /Conheça a Dra\. Camile/);
  assert.match(html, /Segunda a sexta · 08h às 19h/);
  assert.match(html, /Agendar pelo WhatsApp/);
});

test('redesign stylesheet includes the maqueta component layouts', async () => {
  const css = await readFile('styles.css', 'utf8');

  assert.match(css, /\.hero-actions/);
  assert.match(css, /\.contact-panel/);
  assert.match(css, /\.cta-secondary/);
});

test('about section does not show the location button', async () => {
  const html = await readFile('index.html', 'utf8');
  const aboutSection = html.match(/<section class="about[\s\S]*?<\/section>/)?.[0] ?? '';

  assert.doesNotMatch(aboutSection, /href="#contato"/);
});

test('contact links declare analytics events for conversion tracking', async () => {
  const [html, js] = await Promise.all([
    readFile('index.html', 'utf8'),
    readFile('main.js', 'utf8'),
  ]);

  assert.match(html, /data-analytics-event="generate_lead"/);
  assert.match(html, /data-analytics-event="social_interaction"/);
  assert.match(html, /data-analytics-event="contact"/);
  assert.match(js, /data-analytics-event/);
  assert.match(js, /gtag\('event'/);
});

test('Google Analytics is loaded only on the production domains', async () => {
  const html = await readFile('index.html', 'utf8');

  assert.match(html, /document\.createElement\('script'\)/);
  assert.match(html, /googletagmanager\.com\/gtag\/js\?id=G-SVPKKJNE6K/);
  assert.match(html, /isProduction/);
});

test('contact events declare their placement for Analytics reporting', async () => {
  const [html, js] = await Promise.all([
    readFile('index.html', 'utf8'),
    readFile('main.js', 'utf8'),
  ]);

  for (const placement of ['navbar', 'hero', 'contact_section', 'phone', 'footer', 'floating_button']) {
    assert.match(html, new RegExp(`data-analytics-placement="${placement}"`));
  }
  assert.match(js, /analyticsPlacement/);
  assert.match(js, /params\.placement/);
});
