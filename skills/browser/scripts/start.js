#!/usr/bin/env node

import { spawn, execSync } from "node:child_process";
import puppeteer from "puppeteer-core";
import { platform } from "node:os";

const useProfile = process.argv[2] === "--profile";
const isMac = platform() === "darwin";
const isLinux = platform() === "linux";

if (process.argv[2] && process.argv[2] !== "--profile") {
	console.log("Usage: start.js [--profile]");
	console.log("\nOptions:");
	console.log("  --profile  Copy your default Chrome profile (cookies, logins)");
	console.log("\nExamples:");
	console.log("  start.js            # Start with fresh profile");
	console.log("  start.js --profile  # Start with your Chrome profile");
	process.exit(1);
}

// Kill existing Chrome
try {
	if (isMac) {
		execSync("killall 'Google Chrome'", { stdio: "ignore" });
	} else if (isLinux) {
		// On Linux, try multiple possible Chrome process names
		try {
			execSync("killall 'chrome'", { stdio: "ignore" });
		} catch {
			try {
				execSync("killall 'google-chrome'", { stdio: "ignore" });
			} catch {
				execSync("killall 'chromium-browser'", { stdio: "ignore" });
			}
		}
	}
} catch {}

// Wait a bit for processes to fully die
await new Promise((r) => setTimeout(r, 1000));

// Setup profile directory
execSync("mkdir -p ~/.cache/browser-tools", { stdio: "ignore" });

if (useProfile) {
	// Sync profile with rsync (much faster on subsequent runs)
	// Adjust the path based on your system
	let profilePath;
	if (isMac) {
		profilePath = process.env["HOME"] + "/Library/Application Support/Google/Chrome/";
	} else if (isLinux) {
		profilePath = process.env["HOME"] + "/.config/google-chrome/";
	} else {
		console.error("✗ Unsupported platform");
		process.exit(1);
	}
	execSync(
		`rsync -a --delete "${profilePath}" ~/.cache/browser-tools/`,
		{ stdio: "pipe" },
	);
}

// Start Chrome in background (detached so Node can exit)
let chromePath;
if (isMac) {
	chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
} else if (isLinux) {
	// Try common Chrome paths on Linux
	const possiblePaths = [
		"/usr/bin/google-chrome",
		"/usr/bin/google-chrome-stable",
		"/usr/bin/chromium-browser",
		"/usr/bin/chromium",
	];
	// Find the first existing Chrome executable
	for (const path of possiblePaths) {
		try {
			execSync(`test -f "${path}"`, { stdio: "ignore" });
			chromePath = path;
			break;
		} catch {}
	}
	if (!chromePath) {
		console.error("✗ Chrome not found. Please install Chrome or Chromium:");
		console.error("  sudo apt install google-chrome-stable");
		console.error("  or");
		console.error("  sudo apt install chromium-browser");
		process.exit(1);
	}
} else {
	console.error("✗ Unsupported platform");
	process.exit(1);
}

spawn(
	chromePath,
	["--remote-debugging-port=9222", `--user-data-dir=${process.env["HOME"]}/.cache/browser-tools`],
	{ detached: true, stdio: "ignore" },
).unref();

// Wait for Chrome to be ready by attempting to connect
let connected = false;
for (let i = 0; i < 30; i++) {
	try {
		const browser = await puppeteer.connect({
			browserURL: "http://localhost:9222",
			defaultViewport: null,
		});
		await browser.disconnect();
		connected = true;
		break;
	} catch {
		await new Promise((r) => setTimeout(r, 500));
	}
}

if (!connected) {
	console.error("✗ Failed to connect to Chrome");
	process.exit(1);
}

console.log(`✓ Chrome started on :9222${useProfile ? " with your profile" : ""}`);
