# Codebase Scanner

A tool for AI coding agents to analyze JavaScript/TypeScript codebases and generate detailed dependency maps.

## Quick Start

1. **Clone into your project root:**
   ```bash
   git clone https://github.com/philincloud/codebase-scanner.git codebase_scanner &&
   cd codebase_scanner
   ```

2. **Add `make-codebase-map-prompt.txt` to your AI agent's context and ask it to apply the instructions.**

## What It Does

- Scans JavaScript/TypeScript codebases using dependency-cruiser
- Generates comprehensive dependency maps in JSON format
- Creates HTML and SVG reports
- Maintains automatic backups
- Designed exclusively for AI agents (not human developers)

## Output

Creates `codebase-map.json` in your project root with:
- File structure and metadata
- Dependency relationships
- Import/export analysis
- File sizes and line counts

## Requirements

- Node.js (v14+)
- npm or yarn
- dependency-cruiser (installed automatically)

## License

MIT 