#!/usr/bin/env node
/**
 * PermissionRequest Hook - 需要用户授权时执行
 * 功能：播放提示音，提醒用户需要操作
 */

const { execSync } = require('child_process');

// macOS 播放提示音
function playSound() {
  try {
    execSync('afplay /System/Library/Sounds/Blow.aiff 2>/dev/null &', { stdio: 'ignore' });
  } catch {
    // 忽略音效错误
  }
}

playSound();
