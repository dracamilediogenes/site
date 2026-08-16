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
