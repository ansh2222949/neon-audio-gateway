import { test } from 'node:test';
import assert from 'node:assert';
import { decryptJioSaavnUrl } from '../src/crypto/des.js';
import { applyQualityToCdnUrl, sanitizeText, upscaleArtwork } from '../src/services/jiosaavn.js';

test('DES Decryption should accurately decrypt JioSaavn media URLs', () => {
  const cipher = 'ID2ieOjCrwfgWvL5sXl4B1ImC5QfbsDyj4ZDyRkajGN2q4KeBCxtREh4spXbqfrBgV8FtvB9QO2H160XU/sCaBw7tS9a8Gtq';
  const expected = 'https://aac.saavncdn.com/320/4d91932291471256b3c9313360ebb834_96.mp4';
  const decrypted = decryptJioSaavnUrl(cipher);

  assert.strictEqual(decrypted, expected);
});

test('applyQualityToCdnUrl should properly upgrade bitrate suffix to 320kbps', () => {
  const rawUrl = 'https://aac.saavncdn.com/320/test_96.mp4';
  const upgraded = applyQualityToCdnUrl(rawUrl, '320');
  assert.strictEqual(upgraded, 'https://aac.saavncdn.com/320/test_320.mp4');
});

test('upscaleArtwork should transform 150x150 to 500x500', () => {
  const rawArt = 'http://c.saavncdn.com/871/test-150x150.jpg';
  const upscaled = upscaleArtwork(rawArt);
  assert.strictEqual(upscaled, 'https://c.saavncdn.com/871/test-500x500.jpg');
});

test('sanitizeText should clean HTML entities', () => {
  const raw = 'Tu Mil Jaaye (From &quot;KING&quot;) &amp; Co.';
  const cleaned = sanitizeText(raw);
  assert.strictEqual(cleaned, 'Tu Mil Jaaye (From "KING") & Co.');
});
