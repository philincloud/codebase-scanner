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

## 🚀 Quick Start

### Step 1: Ask Your AI Agent to Apply Instructions

**The first and most important step is to ask your AI coding agent (like Cursor) to apply the instructions from `make-codebase-map-prompt.txt`.**

Simply ask your AI agent:
> "Please apply the instructions from `make-codebase-map-prompt.txt` to analyze this codebase."

The AI agent will then:
- Read and understand the comprehensive instructions
- Install necessary dependencies (dependency-cruiser)
- Run the complete analysis workflow
- Generate all required reports and maps
- Handle any errors or edge cases automatically

### Step 2: Let the AI Agent Handle Everything

Once you've asked the AI agent to apply the instructions, it will:

1. **Validate the existing codebase map** (if any)
2. **Install dependency-cruiser** if not already installed
3. **Run a complete fresh scan** using the automated script
4. **Generate all reports** (JSON, HTML, SVG)
5. **Update the codebase map** with enhanced schema
6. **Create backups** before making changes
7. **Validate the results** and handle any issues

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
- **dependency-cruiser** (installed automatically by AI agent)

### Optional
- **Graphviz** (for SVG graph generation)
- **Python** (for JSON validation)

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

### For AI Coding Agents (Recommended)

**The primary way to use this tool is through AI agents:**

1. **Ask your AI agent to apply the instructions:**
   ```
   "Please apply the instructions from make-codebase-map-prompt.txt to analyze this codebase."
   ```

2. **The AI agent will handle everything automatically:**
   - Install dependencies
   - Run analysis
   - Generate reports
   - Update maps
   - Handle errors

### For Human Developers (Manual Usage)

If you prefer to run commands manually, the AI agent instructions in `make-codebase-map-prompt.txt` contain all the detailed commands and workflows.

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
      ],
      "subdirectories": []
    }
  ],
  "metadata": {
    "totalFiles": 50,
    "totalDependencies": 150,
    "dependencyAnalysis": {
      "source": "dependency-cruiser",
      "reportFile": "codebase_scanner/depCruiser/dependency-report-new.json",
      "analysisDate": "2024-01-01"
    }
  }
}
```

## 🤖 AI Agent Workflow

The `make-codebase-map-prompt.txt` file contains detailed instructions specifically formatted for LLMs to:

1. **Understand the project structure**
2. **Execute dependency analysis**
3. **Update codebase maps automatically**
4. **Handle errors and edge cases**
5. **Validate results**

**Recommended AI workflow:**
```
1. Read make-codebase-map-prompt.txt
2. Validate existing codebase-map.json (if exists)
3. Install dependency-cruiser if needed
4. Run freshscan command
5. Verify results and handle any issues
6. Report completion status
```

## 🎯 Key Benefits

- **AI-First Design**: Optimized for AI coding agents
- **Automated Workflow**: Single command execution
- **Comprehensive Analysis**: Detailed dependency tracking
- **Safety Features**: Automatic backups and validation
- **Flexible Usage**: Works with any project structure
- **Enhanced Schema**: Rich metadata for better AI understanding

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 