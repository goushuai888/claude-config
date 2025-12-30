#!/usr/bin/env node
/**
 * PreToolUse Hook - 工具执行前检查
 * 功能：拦截危险命令、警告敏感操作、交互提醒
 *
 * 输入：通过 stdin 接收 JSON 格式的工具调用信息
 * 输出：
 *   - 正常：exit 0
 *   - 阻止：exit 2 + 错误信息
 */

const readline = require('readline');
const { execSync } = require('child_process');

// 需要用户交互的工具
const INTERACTIVE_TOOLS = [
  'AskUserQuestion',  // 询问用户问题
  'EnterPlanMode',    // 进入计划模式需要确认
];

// 播放提示音
function playSound() {
  try {
    execSync('afplay /System/Library/Sounds/Blow.aiff 2>/dev/null &', { stdio: 'ignore' });
  } catch {
    // 忽略音效错误
  }
}

// 危险命令模式
const DANGEROUS_PATTERNS = [
  { pattern: /rm\s+(-rf?|--recursive).*\//i, level: 'block', msg: '禁止递归删除目录' },
  { pattern: /rm\s+.*\*/, level: 'block', msg: '禁止通配符删除' },
  { pattern: /DROP\s+(DATABASE|TABLE)/i, level: 'block', msg: '禁止删除数据库/表' },
  { pattern: /TRUNCATE\s+TABLE/i, level: 'block', msg: '禁止清空表数据' },
  { pattern: /DELETE\s+FROM\s+\w+\s*;?\s*$/i, level: 'block', msg: '禁止无条件删除' },
  { pattern: /git\s+push.*--force/i, level: 'warn', msg: '警告：强制推送可能覆盖远程更改' },
  { pattern: /git\s+reset\s+--hard/i, level: 'warn', msg: '警告：硬重置会丢失未提交更改' },
  { pattern: /chmod\s+777/i, level: 'warn', msg: '警告：777权限存在安全风险' },
  { pattern: /:(rm|dd|mkfs)/i, level: 'block', msg: '禁止执行系统级危险命令' },
  { pattern: />\s*\/dev\/(sda|hda|nvme)/i, level: 'block', msg: '禁止写入磁盘设备' },
];

// 敏感文件
const SENSITIVE_FILES = [
  '.env', '.env.local', '.env.production',
  'credentials', 'secrets', 'password',
  'id_rsa', 'id_ed25519', '.pem', '.key'
];

async function main() {
  // 读取 stdin
  const rl = readline.createInterface({ input: process.stdin });
  let inputData = '';

  for await (const line of rl) {
    inputData += line;
  }

  if (!inputData) {
    process.exit(0);
  }

  let toolCall;
  try {
    toolCall = JSON.parse(inputData);
  } catch {
    process.exit(0);
  }

  const toolName = toolCall.tool_name || '';
  const toolInput = toolCall.tool_input || {};

  // 检查是否需要用户交互
  if (INTERACTIVE_TOOLS.includes(toolName)) {
    playSound();
  }

  // 检查 Bash 命令
  if (toolName === 'Bash' && toolInput.command) {
    const cmd = toolInput.command;

    for (const rule of DANGEROUS_PATTERNS) {
      if (rule.pattern.test(cmd)) {
        if (rule.level === 'block') {
          playSound(); // 危险操作提醒用户
          console.error(`⚠️ 警告: ${rule.msg}`);
          console.error(`命令: ${cmd}`);
          // 只警告，不阻止
        } else {
          console.error(`⚠️ ${rule.msg}`);
        }
      }
    }
  }

  // 检查敏感文件操作
  if (['Read', 'Write', 'Edit'].includes(toolName)) {
    const filePath = toolInput.file_path || '';
    for (const sensitive of SENSITIVE_FILES) {
      if (filePath.toLowerCase().includes(sensitive.toLowerCase())) {
        console.error(`⚠️ 注意：正在操作敏感文件 ${filePath}`);
        break;
      }
    }
  }

  process.exit(0);
}

main().catch(() => process.exit(0));
