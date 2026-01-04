#!/bin/bash
# 测试 eval.js 的各种引号组合

echo "=== Browser Skill eval.js 测试脚本 ==="
echo ""
echo "注意：请先启动 Chrome 调试模式："
echo "  ./skills/browser/scripts/start.js"
echo ""
echo "然后导航到一个测试页面："
echo "  ./skills/browser/scripts/nav.js https://example.com"
echo ""
echo "=== 开始测试各种引号组合 ==="
echo ""

# 测试用例数组
tests=(
  "测试1: 单引号外层，双引号内层 - 简单表达式"
  "./skills/browser/scripts/eval.js 'document.title'"

  "测试2: 双引号外层，单引号内层 - 简单表达式"
  "./skills/browser/scripts/eval.js \"document.title\""

  "测试3: 单引号外层，双引号内层 - 选择器查询"
  "./skills/browser/scripts/eval.js 'document.querySelectorAll(\"a\").length'"

  "测试4: 双引号外层，单引号内层 - 选择器查询（您之前的用例）"
  "./skills/browser/scripts/eval.js \"!!document.querySelector('#title')\""

  "测试5: 双引号外层，单引号内层 - 属性访问"
  "./skills/browser/scripts/eval.js \"document.querySelector('h1').textContent\""

  "测试6: IIFE - 多语句"
  "./skills/browser/scripts/eval.js '(() => { const els = document.querySelectorAll(\"div\"); return els.length; })()'"
)

# 执行测试
for i in {0..5}; do
  index=$((i * 2))
  description="${tests[$index]}"
  command="${tests[$((index + 1))]}"

  echo "▶ $description"
  echo "   命令: $command"
  echo "   结果:"
  eval "$command" 2>&1 | sed 's/^/   /'
  echo ""
  sleep 1
done

echo "=== 测试完成 ==="
echo ""
echo "如果所有测试都通过，说明 eval.js 已经可以正确处理各种引号组合了！"
