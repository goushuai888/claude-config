#!/usr/bin/env node
/**
 * SessionStart Hook - 会话开始时执行
 * 功能：展示项目状态、待办事项
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = process.cwd();

function getGitStatus() {
  try {
    const status = execSync('git status --porcelain 2>/dev/null', { encoding: 'utf8' });
    const lines = status.trim().split('\n').filter(Boolean);
    return {
      modified: lines.filter(l => l.startsWith(' M') || l.startsWith('M ')).length,
      added: lines.filter(l => l.startsWith('A ') || l.startsWith('??')).length,
      deleted: lines.filter(l => l.startsWith(' D') || l.startsWith('D ')).length,
      total: lines.length
    };
  } catch {
    return null;
  }
}

function getGitBranch() {
  try {
    return execSync('git branch --show-current 2>/dev/null', { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function getTodoFile() {
  const todoPath = path.join(projectRoot, 'TODO.md');
  if (fs.existsSync(todoPath)) {
    const content = fs.readFileSync(todoPath, 'utf8');
    const lines = content.split('\n').filter(l => l.match(/^[-*] \[ \]/));
    return lines.slice(0, 5); // 返回前5个待办
  }
  return [];
}

function getRecentFiles() {
  try {
    const files = execSync('find . -type f -name "*.js" -o -name "*.ts" -o -name "*.vue" -o -name "*.jsx" -o -name "*.tsx" 2>/dev/null | head -20',
      { encoding: 'utf8', cwd: projectRoot });
    return files.trim().split('\n').filter(Boolean).length;
  } catch {
    return 0;
  }
}

// 构建输出
const output = [];
output.push('## 项目状态概览');
output.push('');

// Git 状态
const branch = getGitBranch();
const gitStatus = getGitStatus();
if (branch) {
  output.push(`**分支**: \`${branch}\``);
  if (gitStatus && gitStatus.total > 0) {
    output.push(`**变更**: ${gitStatus.modified} 修改 | ${gitStatus.added} 新增 | ${gitStatus.deleted} 删除`);
  } else {
    output.push('**变更**: 工作区干净');
  }
} else {
  output.push('*非 Git 仓库*');
}

output.push('');

// 待办事项
const todos = getTodoFile();
if (todos.length > 0) {
  output.push('**待办事项**:');
  todos.forEach(t => output.push(t));
}

output.push('');
output.push('---');

console.log(output.join('\n'));
