# zjing123 Claude Skills

Browser automation Skill for Claude Code using Chrome DevTools Protocol.

## 🌐 Browser Skill

Minimal Chrome DevTools Protocol tools for browser automation and scraping. Use when you need to start Chrome, navigate pages, execute JavaScript, take screenshots, or interactively pick DOM elements.

### Features

- ✅ Start Chrome with remote debugging on port 9222
- ✅ Navigate pages and open new tabs
- ✅ Execute JavaScript in active tabs
- ✅ Take screenshots
- ✅ Interactive DOM element picker
- ✅ Cross-platform support (macOS and Linux)

### Installation

First, install dependencies:

```bash
pnpm install --prefix skills/browser
# or if pnpm is not available: npm install --prefix skills/browser
```

### Usage

#### Start Chrome

```bash
# Start with fresh profile
./skills/browser/scripts/start.js

# Start with your Chrome profile (cookies, logins)
./skills/browser/scripts/start.js --profile
```

#### Navigate Pages

```bash
# Navigate current tab
./skills/browser/scripts/nav.js https://example.com

# Open new tab
./skills/browser/scripts/nav.js https://example.com --new
```

#### Execute JavaScript

```bash
# Simple expression
./skills/browser/scripts/eval.js 'document.title'

# Multiple statements (use IIFE)
./skills/browser/scripts/eval.js '(() => { const links = document.querySelectorAll("a"); return links.length; })()'
```

#### Take Screenshot

```bash
./skills/browser/scripts/screenshot.js
```

#### Pick Elements Interactively

```bash
./skills/browser/scripts/pick.js "Click the submit button"
```

## Installation as Claude Code Plugin

### Option 1: Install from GitHub Marketplace (Recommended)

1. Add this repository as a marketplace:
```bash
claude marketplace add https://github.com/zjing123/claude-skills
```

2. Install the plugin:
```bash
claude plugin install zjing123-claude-skills
```

### Option 2: Manual Installation

1. Clone this repository:
```bash
git clone https://github.com/zjing123/claude-skills.git
```

2. Install with plugin directory flag:
```bash
claude --plugin-dir ./claude-skills
```

### Option 3: Add to Team Configuration

If you're using Claude Code in a team, add this to your repository's `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": [
    {
      "type": "github",
      "url": "https://github.com/zjing123/claude-skills"
    }
  ]
}
```

Then team members can install with:
```bash
claude plugin install zjing123-claude-skills
```

## Usage with Claude

Once installed, the Browser Skill will be automatically available to Claude. Claude will use it based on the task context.

**Examples:**
- "Browse website and extract data"
- "Open https://example.com and take a screenshot"
- "Navigate to the website and click the submit button"
- "Scrape all links from the page"

## Development

### Project Structure

```
claude-skills/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── skills/
│   └── browser/
│       ├── SKILL.md         # Skill definition
│       ├── package.json
│       └── scripts/
│           ├── start.js     # Start Chrome
│           ├── nav.js       # Navigate pages
│           ├── eval.js      # Execute JavaScript
│           ├── screenshot.js
│           └── pick.js      # Pick elements
├── marketplace.json         # Marketplace configuration
└── README.md
```

### Testing Locally

Test your plugin during development:

```bash
claude --plugin-dir ./
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

Browser Skill is based on [Mario Zechner](https://mariozechner.at)'s article [What if you don't need MCP?](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/), adapted from [Factory.ai](https://docs.factory.ai/guides/skills/browser).

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
