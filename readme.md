# Interpreter CLI

A specialized Node.js interface designed to bridge local development environments with Large Language Models (LLMs). It automates context sharing and executes AI-driven file system modifications via JSON-RPC.

---

## 🚀 Overview

This project streamlines the "Analyze-Promp-Execute" workflow by:
1. **Flattening** local directories into LLM-ready prompts.
2. **Cleaning** code (removing comments/whitespace) to save tokens.
3. **Executing** complex file operations directly from the AI's JSON output.

---

## 🛠 Features

*   **Smart Scanning**: Recursively reads files while respecting `.interpreterignore`.
*   **Token Efficiency**: Automatic minification of source code before copying to clipboard.
*   **JSON-RPC 2.0 Bridge**: Supports `read`, `write`, `update`, `delete`, and `list` operations.
*   **Zero-Config Clipboard**: Uses the system clipboard for seamless data transfer between the CLI and the AI.

---

## 📂 Project Architecture

### `cli.js`
The command dispatcher. Handles the following modes:
- `analyze`: Context gathering.
- `creator`: Task-specific prompt generation.
- `rpc`: Action execution.
- `analyze-apply`: Refactoring requests.

### `src/actions.js`
The core engine for file traversal and content cleaning. It handles the logic for excluding ignored files and formatting the final string.

### `src/analyzer.js`
Manages the interactive terminal prompts (Role, Requirements, Directory) to construct high-quality instructions for the LLM.

### `src/rpc.js`
The execution layer. It parses JSON-RPC objects from the clipboard and translates them into `node:fs` promises.

---

## 📋 Usage Guide

### 1. Send Code to AI
Run the analysis command:
```bash
npm start analyze
```
Follow the prompts. The code will be minified and copied to your clipboard. **Paste it into your LLM (ChatGPT, Claude, etc).**

### 2. Execute AI Suggestions
Once the AI provides a JSON-RPC response, copy it and run:
```bash
npm start rpc
```
The CLI will automatically apply the changes to your local files.

---

## ⚙️ Configuration

Create a `.interpreterignore` file in your root directory to exclude specific paths:
```text
node_modules
.git
.env
dist
package-lock.json
```

---

## ✉️ JSON-RPC Format
For the `rpc` command to succeed, the AI response must follow this structure:

```json
{
  "jsonrpc": "2.0",
  "method": "write",
  "params": {
    "path": "src/example.js",
    "content": "console.log('Updated by AI');"
  },
  "id": 1
}
```

---

*Documentation generated for Interpreter CLI v1.0.0*
