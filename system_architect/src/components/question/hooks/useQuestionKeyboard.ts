/**
 * 题目键盘快捷键管理钩子
 * 提供完整的键盘交互支持
 */

import { useEffect, useCallback, useRef } from 'react';
import { KeyboardAction } from '../types';

interface UseQuestionKeyboardOptions {
  enabled: boolean;
  onAction: (action: KeyboardAction, event: KeyboardEvent) => void;
  preventDefault?: boolean;
}

// 键盘映射配置
const KEYBOARD_MAPPINGS: Record<string, KeyboardAction> = {
  // 选择答案
  '1': 'selectA',
  'a': 'selectA',
  'A': 'selectA',
  
  '2': 'selectB', 
  'b': 'selectB',
  'B': 'selectB',
  
  '3': 'selectC',
  'c': 'selectC', 
  'C': 'selectC',
  
  '4': 'selectD',
  'd': 'selectD',
  'D': 'selectD',
  
  // 控制操作
  'Enter': 'submit',
  ' ': 'toggleExplanation', // 空格键
  'ArrowLeft': 'previous',
  'ArrowRight': 'next',
  'ArrowUp': 'previous',
  'ArrowDown': 'next',
  
  // 功能键
  'Tab': 'toggleSidebar',
  'f': 'toggleFullscreen',
  'F': 'toggleFullscreen',
  'Escape': 'exit',
  
  // 数字键盘
  'Numpad1': 'selectA',
  'Numpad2': 'selectB',
  'Numpad3': 'selectC',
  'Numpad4': 'selectD'
};

// 需要阻止默认行为的键
const PREVENT_DEFAULT_KEYS = new Set([
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
  ' ', 'Tab', 'Enter'
]);

export function useQuestionKeyboard({
  enabled,
  onAction,
  preventDefault = true
}: UseQuestionKeyboardOptions) {
  const enabledRef = useRef(enabled);
  
  // 更新启用状态
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  // 键盘事件处理
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // 检查是否启用
    if (!enabledRef.current) return;
    
    // 忽略在输入框中的按键
    const target = event.target as HTMLElement;
    if (target && (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    )) {
      return;
    }

    // 忽略组合键（除了单独的修饰键）
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    const action = KEYBOARD_MAPPINGS[event.key];
    
    if (action) {
      // 阻止默认行为
      if (preventDefault && PREVENT_DEFAULT_KEYS.has(event.key)) {
        event.preventDefault();
      }
      
      // 触发动作
      onAction(action, event);
    }
  }, [onAction, preventDefault]);

  // 注册键盘事件监听
  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown, true);
      return () => {
        document.removeEventListener('keydown', handleKeyDown, true);
      };
    }
  }, [enabled, handleKeyDown]);

  // 获取快捷键提示
  const getShortcutHints = useCallback(() => {
    return [
      { keys: ['1-4', 'A-D'], description: '选择答案' },
      { keys: ['Enter'], description: '提交答案' },
      { keys: ['Space'], description: '查看/隐藏解析' },
      { keys: ['←', '→'], description: '上一题/下一题' },
      { keys: ['Tab'], description: '显示/隐藏题目列表' },
      { keys: ['F'], description: '全屏模式' },
      { keys: ['Esc'], description: '退出' }
    ];
  }, []);

  // 检查是否支持某个快捷键
  const hasShortcut = useCallback((action: KeyboardAction): boolean => {
    return Object.values(KEYBOARD_MAPPINGS).includes(action);
  }, []);

  // 获取动作对应的按键
  const getKeysForAction = useCallback((action: KeyboardAction): string[] => {
    return Object.entries(KEYBOARD_MAPPINGS)
      .filter(([_, mappedAction]) => mappedAction === action)
      .map(([key, _]) => key);
  }, []);

  return {
    getShortcutHints,
    hasShortcut,
    getKeysForAction
  };
}