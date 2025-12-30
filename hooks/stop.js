#!/usr/bin/env node
/**
 * Stop Hook - AI 完成回答后执行
 * 功能：播放音效、分析变更、推荐下一步操作
 */

const { execSync } = require('child_process');
const readline = require('readline');

// macOS 播放完成音效
function playSound() {
  try {
    // 使用系统提示音
    execSync('afplay /System/Library/Sounds/Glass.aiff 2>/dev/null &', { stdio: 'ignore' });
  } catch {
    // 忽略音效错误
  }
}

// 获取本次会话的变更统计
function getChangeSummary() {
  try {
    const status = execSync('git status --porcelain 2>/dev/null', { encoding: 'utf8' });
    const lines = status.trim().split('\n').filter(Boolean);

    if (lines.length === 0) return null;

    return {
      modified: lines.filter(l => l.startsWith(' M') || l.startsWith('M ')).length,
      added: lines.filter(l => l.startsWith('A ') || l.startsWith('??')).length,
      deleted: lines.filter(l => l.startsWith(' D') || l.startsWith('D ')).length,
    };
  } catch {
    return null;
  }
}

// 建议下一步操作
function suggestNextSteps(changes) {
  const suggestions = [];

  if (changes) {
    if (changes.added > 0 || changes.modified > 0) {
      suggestions.push('`git diff` - 查看具体变更');
      suggestions.push('`git add -A && git commit` - 提交更改');
    }
  }

  suggestions.push('继续提问以完善功能');
  suggestions.push('`/review` - 代码审查');

  return suggestions;
}

async function main() {
  // 读取 stdin（接收会话信息）
  const rl = readline.createInterface({ input: process.stdin });
  let inputData = '';
  for await (const line of rl) {
    inputData += line;
  }

  // 播放完成音效
  playSound();

  // 分析变更
  const changes = getChangeSummary();

  const output = [];
  output.push('');
  output.push('---');
  output.push('**任务完成**');

  if (changes) {
    const parts = [];
    if (changes.modified > 0) parts.push(`${changes.modified} 个文件修改`);
    if (changes.added > 0) parts.push(`${changes.added} 个文件新增`);
    if (changes.deleted > 0) parts.push(`${changes.deleted} 个文件删除`);
    if (parts.length > 0) {
      output.push(`变更统计: ${parts.join(', ')}`);
    }
  }

  output.push('');
  output.push('**建议下一步**:');
  suggestNextSteps(changes).forEach(s => output.push(`- ${s}`));

  console.log(output.join('\n'));
}

main().catch(() => process.exit(0));
