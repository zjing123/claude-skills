#!/usr/bin/env node

import puppeteer from "puppeteer-core";

const code = process.argv.slice(2).join(" ");
if (!code) {
	console.log("Usage: eval.js 'code'");
	console.log("\nExamples:");
	console.log('  eval.js "document.title"');
	console.log('  eval.js "document.querySelectorAll(\'a\').length"');
	console.log('  eval.js "document.querySelector(\'#id\').value = \'text\'"');
	console.log("\nNote: The code can be:");
	console.log("  Single expression: 'document.title'");
	console.log("  Statement: 'document.querySelector(\"#id\").value = \"text\"'");
	console.log("  Multiple statements: wrap in IIFE or use semicolons");
	process.exit(1);
}

const b = await puppeteer.connect({
	browserURL: "http://localhost:9222",
	defaultViewport: null,
});

const p = (await b.pages()).at(-1);

if (!p) {
	console.error("✗ No active tab found");
	process.exit(1);
}

const result = await p.evaluate((c) => {
	const AsyncFunction = (async () => {}).constructor;
	let codeToExecute = c.trim();
	
	// 简单策略：
	// 1. 如果代码以 return 开头或包含 return，直接执行
	// 2. 如果代码以分号结尾，作为语句执行（不自动 return）
	// 3. 否则，作为表达式执行（自动添加 return）
	
	if (/^\s*return\s/.test(codeToExecute) || codeToExecute.includes('return ')) {
		// 已经包含 return
		return new AsyncFunction(codeToExecute)();
	} else if (codeToExecute.endsWith(';')) {
		// 以分号结尾，作为语句执行
		return new AsyncFunction(codeToExecute)();
	} else {
		// 作为表达式执行
		return new AsyncFunction(`return (${codeToExecute})`)();
	}
}, code);

if (Array.isArray(result)) {
	for (let i = 0; i < result.length; i++) {
		if (i > 0) console.log("");
		for (const [key, value] of Object.entries(result[i])) {
			console.log(`${key}: ${value}`);
		}
	}
} else if (typeof result === "object" && result !== null) {
	for (const [key, value] of Object.entries(result)) {
		console.log(`${key}: ${value}`);
	}
} else {
	console.log(result);
}

await b.disconnect();