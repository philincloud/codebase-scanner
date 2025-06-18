# Codebase Scanner Tool

A comprehensive tool for automatically analyzing and mapping codebases with detailed dependency information. **This tool is specifically designed to work with coding agents like Cursor and other AI-powered development environments.**

## 🎯 What This Tool Does

The Codebase Scanner Tool automatically:

- **Scans your codebase** using dependency-cruiser to analyze all file dependencies
- **Creates detailed maps** of your project structure with enhanced metadata
- **Tracks dependencies** between files, including npm packages and local imports
- **Generates reports** in multiple formats (JSON, HTML, SVG graphs)
- **Maintains backups** of your codebase maps before making changes
- **Updates automatically** all file entries with comprehensive schema information

## 🤖 Designed for AI Coding Agents

This tool is specifically optimized for use with:
- **Cursor** - AI-powered code editor
- **GitHub Copilot** - AI pair programming tool
- **Other LLM-based coding assistants**

The `make-codebase-map-prompt.txt` file contains instructions **directly addressed to Large Language Models (LLMs)** to help them understand and execute the codebase analysis workflow. This allows AI coding agents to:

- Automatically analyze project dependencies
- Generate comprehensive codebase maps
- Maintain up-to-date project documentation
- Provide better code suggestions and refactoring recommendations

## 📋 Features

### 🔍 Dependency Analysis
- Analyzes all import/export statements
- Tracks npm package dependencies
- Identifies local file dependencies
- Detects circular dependencies
- Validates dependency resolution

### 📊 Enhanced File Metadata
- File sizes and line counts
- Programming language detection
- Bundle optimization flags
- Tree-shaking compatibility
- Side effects analysis

### 🛡️ Safety Features
- Automatic backup creation
- Error handling and validation
- Progress reporting
- Comprehensive logging

### 🤖 AI Agent Integration
- LLM-optimized prompts and instructions
- Structured output for AI consumption
- Automated workflow execution
- Clear error messages for AI debugging

## 📦 Dependencies

### Required
- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- **dependency-cruiser** (installed automatically)

### Optional
- **Graphviz** (for SVG graph generation)
- **Python** (for JSON validation)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Install dependency-cruiser
npm install dependency-cruiser
```

### 2. Run Analysis
```bash
# Generate dependency analysis
nvm use node && npx dependency-cruiser --no-config --output-type json src > codebase_scanner/depCruiser/dependency-report-new.json

# Update codebase map
node codebase_scanner/update-codebase-map.js
```

### 3. View Results
- Check `codebase-map.json` for the updated map
- View `codebase_scanner/depCruiser/dependency-report-new.html` for visual analysis
- Examine `codebase_scanner/depCruiser/dependency-graph-new.svg` for dependency graph

## 📁 Directory Structure

```
codebase_scanner/
├── README.md                           # This file
├── make-codebase-map-prompt.txt        # LLM instructions and detailed workflow
├── update-codebase-map.js              # Main update script
├── depCruiser/                         # Dependency analysis reports
│   ├── dependency-report-new.json      # JSON dependency report
│   ├── dependency-report-new.html      # HTML dependency report
│   └── dependency-graph-new.svg        # SVG dependency graph
└── backups/                            # Automatic backups
    └── codebase-map-backup-*.json      # Timestamped backups
```

## 🔧 Usage

### For Human Developers

#### Basic Commands
```bash
# Run complete fresh scan (dependency analysis + update)
node codebase_scanner/update-codebase-map.js freshscan

# Update codebase map only (requires existing dependency report)
node codebase_scanner/update-codebase-map.js update

# Show help
node codebase_scanner/update-codebase-map.js help
```

#### Command Options
- **`freshscan`** - Runs complete fresh scan:
  - Generates new dependency-cruiser analysis
  - Creates JSON, HTML, and SVG reports
  - Updates codebase-map.json with fresh data
  - Creates automatic backup before updating

- **`update`** - Updates codebase map only:
  - Requires existing dependency report
  - Updates codebase-map.json with current data
  - Creates automatic backup before updating

- **`help`** - Shows command usage and options

#### Default Behavior
If no command is provided, the script runs `update` mode by default.

### For AI Coding Agents
The `make-codebase-map-prompt.txt` file contains detailed instructions specifically formatted for LLMs to:
- Understand the project structure
- Execute dependency analysis
- Update codebase maps automatically
- Handle errors and edge cases
- Validate results

**Recommended AI workflow:**
```bash
# For AI agents, use freshscan to ensure complete analysis
node codebase_scanner/update-codebase-map.js freshscan
```

### Advanced Usage
```bash
# 1. Manual dependency analysis (if needed)
nvm use node && npx dependency-cruiser --no-config --output-type json src > codebase_scanner/depCruiser/dependency-report-new.json

# 2. Manual HTML report generation
nvm use node && npx dependency-cruiser --no-config --output-type html src > codebase_scanner/depCruiser/dependency-report-new.html

# 3. Manual SVG graph generation (requires Graphviz)
nvm use node && npx dependency-cruiser --no-config --output-type dot src | dot -T svg > codebase_scanner/depCruiser/dependency-graph-new.svg

# 4. Update codebase map only
node codebase_scanner/update-codebase-map.js update
```

### Package.json Integration
Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "scan-deps": "npx dependency-cruiser --no-config --output-type json src > codebase_scanner/depCruiser/dependency-report-new.json",
    "update-map": "node codebase_scanner/update-codebase-map.js update",
    "fresh-scan": "node codebase_scanner/update-codebase-map.js freshscan",
    "codebase-analysis": "npm run fresh-scan"
  }
}
```

Then run:
```bash
# Complete fresh scan
npm run fresh-scan

# Or just update map
npm run update-map
```

## 📊 Output Schema

The tool generates a comprehensive `codebase-map.json` with this structure:

```json
{
  "rootDirectory": "project-name",
  "subdirectories": [
    {
      "directory": "src",
      "files": [
        {
          "name": "Component.jsx",
          "description": "Component description",
          "lastUpdated": "2024-01-01",
          "dependencies": [
            {
              "name": "react",
              "type": "npm",
              "path": "node_modules/react",
              "dynamic": false,
              "circular": false,
              "valid": true,
              "followable": true
            }
          ],
          "testCoverage": "none",
          "dependents": [],
          "orphan": false,
          "valid": true,
          "moduleSystem": "es6",
          "fileDetails": {
            "size": "2.5K",
            "lines": 50,
            "language": "jsx",
            "entryPoint": false,
            "bundled": true,
            "treeShakeable": true,
            "sideEffects": false
          },
          "dependencyDetails": {
            "total": 3,
            "npm": 1,
            "local": 2,
            "core": 0,
            "dynamic": 0,
            "circular": 0,
            "unresolved": 0
          }
        }
      ]
    }
  ]
}
```

## 🛠️ Configuration

The tool is configured via constants in `update-codebase-map.js`:

```javascript
const CONFIG = {
  codebaseMapPath: './codebase-map.json',
  depCruiserDir: './codebase_scanner/depCruiser',
  depCruiserReportPath: './codebase_scanner/depCruiser/dependency-report-new.json',
  srcDir: './src',
  backupDir: './codebase_scanner/backups'
};
```

## 🔍 Troubleshooting

### Common Issues

1. **"codebase-map.json not found"**
   - Ensure you're running from the project root
   - Create an initial codebase-map.json if needed

2. **"Dependency report not found"**
   - Run dependency-cruiser analysis first
   - Check that depCruiser directory exists

3. **Permission errors**
   - Check file permissions
   - Ensure write access to project directory

4. **Node.js version issues**
   - Use Node.js v14 or higher
   - Use `nvm use node` if using nvm

### Validation Commands
```bash
# Check script permissions
ls -la codebase_scanner/update-codebase-map.js

# Verify dependency-cruiser
npx dependency-cruiser --version

# Validate JSON output
python3 -m json.tool codebase-map.json > /dev/null && echo "✅ Valid JSON" || echo "❌ Invalid JSON"
```

## 📈 Benefits

- **Automated Analysis**: No manual file-by-file updates needed
- **Comprehensive Data**: Detailed dependency and metadata information
- **Safety**: Automatic backups and error handling
- **Flexibility**: Works with any project structure
- **Maintainability**: Easy to update and extend
- **Integration**: Can be integrated into CI/CD pipelines
- **AI-Optimized**: Designed specifically for LLM-based coding agents

## 🤖 AI Agent Workflow

For AI coding agents like Cursor, the typical workflow is:

1. **Read Instructions**: Parse `make-codebase-map-prompt.txt` for workflow steps
2. **Execute Analysis**: Run dependency-cruiser commands
3. **Update Map**: Execute the update script
4. **Validate Results**: Check output and handle any errors
5. **Provide Feedback**: Report success/failure to the user

The tool provides structured output that AI agents can easily parse and understand.

## 🤝 Contributing

To extend or modify the tool:

1. Edit `update-codebase-map.js` for core functionality
2. Update `make-codebase-map-prompt.txt` for LLM instructions
3. Test with your project structure
4. Update this README.md with changes

## 📄 License

This tool is part of the project codebase and follows the same license terms.

## 🔗 Related Files

- `make-codebase-map-prompt.txt` - LLM instructions and detailed workflow
- `update-codebase-map.js` - Main automation script
- `depCruiser/` - Dependency analysis reports
- `backups/` - Automatic backup files 