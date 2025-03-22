import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the .well-known directory exists in the dist folder
const wellKnownDir = path.join(__dirname, 'dist', '.well-known');
fs.ensureDirSync(wellKnownDir);

// Copy the apple-app-site-association file
fs.copySync(
  path.join(__dirname, '.well-known', 'apple-app-site-association'),
  path.join(wellKnownDir, 'apple-app-site-association')
);

console.log('Apple App Site Association file copied to dist/.well-known/');
