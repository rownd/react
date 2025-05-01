import { cp, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

async function copyPackageFiles() {
  const packages = ['react', 'next', 'remix'];
  
  for (const pkg of packages) {
    // Create package directory if it doesn't exist
    await mkdir(`packages/${pkg}/dist`, { recursive: true });

    // Copy parent README.md for React.
    if (['react'].includes(pkg)) {
      await cp(
        join('README.md'),
        join('packages', pkg, 'README.md')
      );
    }
    
    // Copy built files, excluding node_modules
    await cp(
      join('dist'), 
      join('packages', pkg, 'dist'),
      { 
        recursive: true,
        filter: (src) => !src.includes('node_modules')
      }
    );
    console.log(`Copied built files for ${pkg}`);
  }
}

copyPackageFiles().catch(console.error); 