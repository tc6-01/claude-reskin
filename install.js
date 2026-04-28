#!/usr/bin/env node

/**
 * Claude Code Reskin Skill Installer
 *
 * Copies SKILL.md and templates/ to ~/.claude/skills/reskin/
 * Claude Code auto-discovers skills placed in this directory.
 */

const fs = require('node:fs');
const path = require('node:path');

const HOME = process.env.HOME || process.env.USERPROFILE;
const TARGET_DIR = path.join(HOME, '.claude', 'skills', 'reskin');
const SOURCE_DIR = __dirname;

const SKILL_FILE = 'SKILL.md';
const TEMPLATES_DIR = 'templates';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFile(src, dst) {
  fs.copyFileSync(src, dst);
}

function copyDir(src, dst) {
  ensureDir(dst);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, dstPath);
    } else {
      copyFile(srcPath, dstPath);
    }
  }
}

function main() {
  console.log('');
  console.log('  Installing claude-reskin skill...');
  console.log(`  Target: ${TARGET_DIR}`);
  console.log('');

  // Ensure target directory exists
  ensureDir(TARGET_DIR);

  // Copy SKILL.md
  const skillSrc = path.join(SOURCE_DIR, SKILL_FILE);
  const skillDst = path.join(TARGET_DIR, SKILL_FILE);
  if (fs.existsSync(skillSrc)) {
    copyFile(skillSrc, skillDst);
    console.log(`  ✓ Copied ${SKILL_FILE}`);
  } else {
    console.error(`  ✗ ${SKILL_FILE} not found at ${skillSrc}`);
    process.exit(1);
  }

  // Copy templates/
  const templatesSrc = path.join(SOURCE_DIR, TEMPLATES_DIR);
  const templatesDst = path.join(TARGET_DIR, TEMPLATES_DIR);
  if (fs.existsSync(templatesSrc)) {
    copyDir(templatesSrc, templatesDst);
    console.log(`  ✓ Copied ${TEMPLATES_DIR}/`);
  } else {
    console.warn(`  ⚠ ${TEMPLATES_DIR}/ not found, skipping`);
  }

  console.log('');
  console.log('  claude-reskin skill installed successfully!');
  console.log('  Use /reskin in Claude Code to activate.');
  console.log('');
}

main();
