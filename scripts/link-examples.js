import { execSync } from 'child_process';
import { readdirSync } from 'fs';
import path from 'path';

const __dirname = import.meta.dirname;

const examplesDir = path.join(__dirname, '../examples');
const examples = readdirSync(examplesDir);

const packagesDir = path.join(__dirname, '../packages');
const packages = readdirSync(packagesDir);

// Build the main package first
execSync('npm run build', { stdio: 'inherit' });

// Create links for all subpackages
packages.forEach(pkg => {
    console.log(`Creating link for '${pkg}'...`);
    const pkgPath = path.join(packagesDir, pkg);
    execSync('npm link', { stdio: 'inherit', cwd: pkgPath });
});

// Link the package in each example
examples.forEach(example => {
  const examplePath = path.join(examplesDir, example);
  console.log(`Linking in '${example}'...`);

  const pkgType = example.includes('remix')
    ? 'remix'
    : example.includes('next')
        ? 'next'
        : 'react';

  execSync(`npm link @rownd/${pkgType}`, { 
    cwd: examplePath,
    stdio: 'inherit'
  });
});
