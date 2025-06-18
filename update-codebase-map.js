#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Configuration
const CONFIG = {
  // Paths relative to project root (where this script is run from)
  codebaseMapPath: './codebase-map.json',
  depCruiserDir: './codebase_scanner/depCruiser',
  depCruiserReportPath: './codebase_scanner/depCruiser/dependency-report-new.json',
  srcDir: './src', // Default source directory
  backupDir: './codebase_scanner/backups'
};

// Ensure backup directory exists
if (!fs.existsSync(CONFIG.backupDir)) {
  fs.mkdirSync(CONFIG.backupDir, { recursive: true });
}

// Function to run dependency-cruiser analysis
function runDependencyAnalysis() {
  console.log('🔍 Running dependency-cruiser analysis...');
  
  try {
    // Ensure depCruiser directory exists
    if (!fs.existsSync(CONFIG.depCruiserDir)) {
      fs.mkdirSync(CONFIG.depCruiserDir, { recursive: true });
      console.log(`📁 Created directory: ${CONFIG.depCruiserDir}`);
    }
    
    // Generate JSON report
    console.log('📊 Generating JSON dependency report...');
    execSync(`nvm use node && npx dependency-cruiser --no-config --output-type json src > ${CONFIG.depCruiserReportPath}`, { 
      stdio: 'inherit',
      shell: true 
    });
    
    // Generate HTML report (optional)
    console.log('🌐 Generating HTML dependency report...');
    try {
      execSync(`nvm use node && npx dependency-cruiser --no-config --output-type html src > ${CONFIG.depCruiserDir}/dependency-report-new.html`, { 
        stdio: 'inherit',
        shell: true 
      });
    } catch (error) {
      console.warn('⚠️  HTML report generation failed (optional):', error.message);
    }
    
    // Generate SVG graph (optional)
    console.log('📈 Generating SVG dependency graph...');
    try {
      execSync(`nvm use node && npx dependency-cruiser --no-config --output-type dot src | dot -T svg > ${CONFIG.depCruiserDir}/dependency-graph-new.svg`, { 
        stdio: 'inherit',
        shell: true 
      });
    } catch (error) {
      console.warn('⚠️  SVG graph generation failed (optional):', error.message);
    }
    
    console.log('✅ Dependency analysis completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Dependency analysis failed:', error.message);
    return false;
  }
}

// Function to get file info
function getFileInfo(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const lines = fs.readFileSync(filePath, 'utf8').split('\n').length;
    const size = (stats.size / 1024).toFixed(1) + 'K';
    return { size, lines };
  } catch (error) {
    console.warn(`⚠️  Could not read file info for ${filePath}: ${error.message}`);
    return { size: 'TBD', lines: 0 };
  }
}

// Function to get dependencies from dependency-cruiser report
function getDependenciesFromReport(fileName, projectRoot) {
  try {
    if (!fs.existsSync(CONFIG.depCruiserReportPath)) {
      console.warn(`⚠️  Dependency report not found at ${CONFIG.depCruiserReportPath}`);
      return [];
    }
    
    const report = JSON.parse(fs.readFileSync(CONFIG.depCruiserReportPath, 'utf8'));
    
    // Try different possible source paths
    const possibleSources = [
      `src/${fileName}`,
      `${projectRoot}/src/${fileName}`,
      `philincloud.com/src/${fileName}`,
      fileName
    ];
    
    const fileEntry = report.modules.find(module => 
      possibleSources.some(source => module.source === source || module.source.endsWith(`/${fileName}`))
    );
    
    if (!fileEntry) {
      console.warn(`⚠️  No dependency info found for ${fileName}`);
      return [];
    }
    
    return fileEntry.dependencies.map(dep => ({
      name: dep.module,
      type: dep.dependencyTypes.includes('npm') ? 'npm' : 'local',
      path: dep.resolved || dep.module,
      dynamic: dep.dynamic,
      circular: dep.circular,
      valid: dep.valid,
      followable: dep.followable
    }));
  } catch (error) {
    console.warn(`⚠️  Error reading dependencies for ${fileName}: ${error.message}`);
    return [];
  }
}

// Function to determine file language
function getFileLanguage(fileName) {
  if (fileName.endsWith('.jsx')) return 'jsx';
  if (fileName.endsWith('.js')) return 'js';
  if (fileName.endsWith('.css')) return 'css';
  if (fileName.endsWith('.html')) return 'html';
  if (fileName.endsWith('.json')) return 'json';
  if (fileName.endsWith('.md')) return 'md';
  if (fileName.endsWith('.txt')) return 'txt';
  if (fileName.endsWith('.svg')) return 'svg';
  if (fileName.endsWith('.png')) return 'png';
  if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) return 'jpg';
  if (fileName.endsWith('.gif')) return 'gif';
  return 'unknown';
}

// Function to update file entry
function updateFileEntry(fileEntry, projectRoot) {
  const fileName = fileEntry.name;
  
  // Try different possible file paths
  const possiblePaths = [
    path.join(CONFIG.srcDir, fileName),
    path.join(projectRoot, CONFIG.srcDir, fileName),
    path.join(projectRoot, 'philincloud.com/src', fileName),
    path.join(projectRoot, fileName)
  ];
  
  let filePath = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      filePath = p;
      break;
    }
  }
  
  const fileInfo = filePath ? getFileInfo(filePath) : { size: 'TBD', lines: 0 };
  const dependencies = getDependenciesFromReport(fileName, projectRoot);
  const language = getFileLanguage(fileName);
  
  // Count dependency types
  const npmCount = dependencies.filter(d => d.type === 'npm').length;
  const localCount = dependencies.filter(d => d.type === 'local').length;
  const coreCount = dependencies.filter(d => d.type === 'core').length;
  const dynamicCount = dependencies.filter(d => d.dynamic).length;
  const circularCount = dependencies.filter(d => d.circular).length;
  const unresolvedCount = dependencies.filter(d => !d.valid).length;
  
  return {
    ...fileEntry,
    dependencies: dependencies,
    testCoverage: "none",
    dependents: [],
    orphan: false,
    valid: true,
    moduleSystem: "es6",
    fileDetails: {
      size: fileInfo.size,
      lines: fileInfo.lines,
      language: language,
      entryPoint: false,
      bundled: true,
      treeShakeable: language === 'jsx' || language === 'js',
      sideEffects: false
    },
    dependencyDetails: {
      total: dependencies.length,
      npm: npmCount,
      local: localCount,
      core: coreCount,
      dynamic: dynamicCount,
      circular: circularCount,
      unresolved: unresolvedCount
    }
  };
}

// Function to recursively update all files in subdirectories
function updateSubdirectoryFiles(subdirectories, projectRoot) {
  return subdirectories.map(subdir => {
    if (subdir.files) {
      subdir.files = subdir.files.map(fileEntry => updateFileEntry(fileEntry, projectRoot));
    }
    if (subdir.subdirectories) {
      subdir.subdirectories = updateSubdirectoryFiles(subdir.subdirectories, projectRoot);
    }
    return subdir;
  });
}

// Function to recursively get all files from a directory
function getAllFiles(dirPath, basePath = '') {
  const files = [];
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const relativePath = path.join(basePath, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        // Recursively get files from subdirectories
        const subFiles = getAllFiles(fullPath, relativePath);
        files.push(...subFiles);
      } else {
        // Add file to the list
        files.push({
          name: item,
          path: relativePath,
          fullPath: fullPath,
          stats: stats
        });
      }
    }
  } catch (error) {
    console.warn(`⚠️  Could not read directory ${dirPath}: ${error.message}`);
  }
  
  return files;
}

// Function to sync codebase map with actual filesystem
function syncCodebaseMap(codebaseMap, projectRoot) {
  console.log('🔄 Syncing codebase-map.json with actual filesystem...');
  
  // Get all actual files from src directory
  const srcPath = path.join(projectRoot, CONFIG.srcDir);
  if (!fs.existsSync(srcPath)) {
    console.warn(`⚠️  Source directory ${CONFIG.srcDir} not found`);
    return codebaseMap;
  }
  
  const actualFiles = getAllFiles(srcPath);
  console.log(`📁 Found ${actualFiles.length} actual files in ${CONFIG.srcDir}/`);
  
  // Create a map of actual files for quick lookup
  const actualFileMap = new Map();
  actualFiles.forEach(file => {
    actualFileMap.set(file.name, file);
  });
  
  // Update subdirectories to sync with actual filesystem
  if (codebaseMap.subdirectories) {
    codebaseMap.subdirectories = codebaseMap.subdirectories.map(subdir => {
      if (subdir.directory === 'philincloud.com' && subdir.subdirectories) {
        subdir.subdirectories = subdir.subdirectories.map(srcSubdir => {
          if (srcSubdir.directory === 'src' && srcSubdir.files) {
            const originalFileCount = srcSubdir.files.length;
            
            // Filter out deleted files and add new files
            const updatedFiles = [];
            const processedFiles = new Set();
            
            // Process existing files that still exist
            srcSubdir.files.forEach(fileEntry => {
              if (actualFileMap.has(fileEntry.name)) {
                updatedFiles.push(fileEntry);
                processedFiles.add(fileEntry.name);
              } else {
                console.log(`🗑️  Removed deleted file: ${fileEntry.name}`);
              }
            });
            
            // Add new files that weren't in the original map
            actualFiles.forEach(actualFile => {
              if (!processedFiles.has(actualFile.name)) {
                console.log(`➕ Added new file: ${actualFile.name}`);
                const newFileEntry = {
                  name: actualFile.name,
                  description: `Auto-generated entry for ${actualFile.name}`,
                  lastUpdated: new Date().toISOString().split('T')[0],
                  dependencies: [],
                  testCoverage: "none",
                  dependents: [],
                  orphan: false,
                  valid: true,
                  moduleSystem: "es6",
                  fileDetails: {
                    size: (actualFile.stats.size / 1024).toFixed(1) + 'K',
                    lines: fs.readFileSync(actualFile.fullPath, 'utf8').split('\n').length,
                    language: getFileLanguage(actualFile.name),
                    entryPoint: false,
                    bundled: true,
                    treeShakeable: getFileLanguage(actualFile.name) === 'jsx' || getFileLanguage(actualFile.name) === 'js',
                    sideEffects: false
                  },
                  dependencyDetails: {
                    total: 0,
                    npm: 0,
                    local: 0,
                    core: 0,
                    dynamic: 0,
                    circular: 0,
                    unresolved: 0
                  }
                };
                updatedFiles.push(newFileEntry);
              }
            });
            
            srcSubdir.files = updatedFiles;
            console.log(`📊 Files synced: ${originalFileCount} → ${updatedFiles.length} (${updatedFiles.length - originalFileCount > 0 ? '+' : ''}${updatedFiles.length - originalFileCount})`);
          }
          if (srcSubdir.subdirectories) {
            srcSubdir.subdirectories = updateSubdirectoryFiles(srcSubdir.subdirectories, projectRoot);
          }
          return srcSubdir;
        });
      }
      return subdir;
    });
  }
  
  return codebaseMap;
}

// Function to update codebase map
function updateCodebaseMap() {
  console.log('🔍 Starting codebase-map.json update...');
  
  // Check if codebase-map.json exists
  if (!fs.existsSync(CONFIG.codebaseMapPath)) {
    console.error('❌ codebase-map.json not found in current directory');
    console.log('💡 Make sure you are running this script from the project root directory');
    process.exit(1);
  }
  
  // Create backup
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(CONFIG.backupDir, `codebase-map-backup-${timestamp}.json`);
  fs.copyFileSync(CONFIG.codebaseMapPath, backupPath);
  console.log(`💾 Backup created: ${backupPath}`);
  
  // Read current codebase-map.json
  const codebaseMap = JSON.parse(fs.readFileSync(CONFIG.codebaseMapPath, 'utf8'));
  const projectRoot = process.cwd();
  
  // Step 1: Sync with actual filesystem (remove deleted files, add new files)
  const syncedCodebaseMap = syncCodebaseMap(codebaseMap, projectRoot);
  
  // Step 2: Update all files with dependency information
  if (syncedCodebaseMap.subdirectories) {
    syncedCodebaseMap.subdirectories = syncedCodebaseMap.subdirectories.map(subdir => {
      if (subdir.directory === 'philincloud.com' && subdir.subdirectories) {
        subdir.subdirectories = subdir.subdirectories.map(srcSubdir => {
          if (srcSubdir.directory === 'src' && srcSubdir.files) {
            console.log(`📁 Updating ${srcSubdir.files.length} files in src/ directory with dependency information...`);
            srcSubdir.files = srcSubdir.files.map(fileEntry => updateFileEntry(fileEntry, projectRoot));
          }
          if (srcSubdir.subdirectories) {
            srcSubdir.subdirectories = updateSubdirectoryFiles(srcSubdir.subdirectories, projectRoot);
          }
          return srcSubdir;
        });
      }
      return subdir;
    });
  }
  
  // Write the updated codebase-map.json
  fs.writeFileSync(CONFIG.codebaseMapPath, JSON.stringify(syncedCodebaseMap, null, 2));
  console.log('✅ codebase-map.json has been updated with enhanced schema for all files!');
  console.log(`📊 Total files processed: ${countFiles(syncedCodebaseMap)}`);
}

// Helper function to count total files
function countFiles(obj) {
  let count = 0;
  if (obj.files) count += obj.files.length;
  if (obj.subdirectories) {
    obj.subdirectories.forEach(subdir => count += countFiles(subdir));
  }
  return count;
}

// Function to run fresh scan (dependency analysis + update)
function freshScan() {
  console.log('🚀 Starting fresh codebase scan...');
  console.log('=' * 50);
  
  // Step 1: Run dependency analysis
  const analysisSuccess = runDependencyAnalysis();
  
  if (!analysisSuccess) {
    console.error('❌ Fresh scan failed at dependency analysis step');
    process.exit(1);
  }
  
  console.log('=' * 50);
  
  // Step 2: Update codebase map
  try {
    updateCodebaseMap();
    console.log('=' * 50);
    console.log('🎉 Fresh scan completed successfully!');
    console.log('📁 Check the following files:');
    console.log(`   - ${CONFIG.codebaseMapPath} (updated codebase map)`);
    console.log(`   - ${CONFIG.depCruiserReportPath} (dependency report)`);
    console.log(`   - ${CONFIG.depCruiserDir}/dependency-report-new.html (HTML report)`);
    console.log(`   - ${CONFIG.depCruiserDir}/dependency-graph-new.svg (dependency graph)`);
  } catch (error) {
    console.error('❌ Fresh scan failed at codebase map update step:', error.message);
    process.exit(1);
  }
}

// Function to show help
function showHelp() {
  console.log(`
🔧 Codebase Scanner Tool

Usage: node codebase_scanner/update-codebase-map.js [command]

Commands:
  freshscan    Run complete fresh scan (dependency analysis + update)
  update       Update codebase map only (requires existing dependency report)
  help         Show this help message

Examples:
  node codebase_scanner/update-codebase-map.js freshscan
  node codebase_scanner/update-codebase-map.js update
  node codebase_scanner/update-codebase-map.js help

Default behavior (no command): runs update only
`);
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'update';
  
  switch (command) {
    case 'freshscan':
      freshScan();
      break;
    case 'update':
      updateCodebaseMap();
      break;
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
    default:
      console.log(`❌ Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

// Run the script
try {
  main();
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} 