# PR Merger ⚡️

A simple Chrome extension to help format squash commits on GitHub.

Manually copying ticket links and formatting commit messages is tedious. This extension adds a button to your PR page that does it for you.

## Features

- **Auto-Formatting**: Grabs the PR title and prefixes it based on your branch name (e.g. `feat(subtitles): ...` if your branch is `feat/subtitles`).
- **Ticket Extraction**: Scans the PR body for ticket references (like `CLI-1234` or `GAMMA-9876`) and grabs their full links.
- **Sidebar UI**: Opens a non-intrusive sidebar with the formatted message ready to copy. One click to "Copy All".

## Usage

1. Load the extension (see below).
2. Go to any GitHub Pull Request.
3. Scroll down to the merge bar.
4. Click the **✨ Auto Squash** button.
5. A sidebar will open on the right with your formatted commit message.
6. Click **Copy All** and paste it into the squash form.

## Installation (Local)

1. Clone or download this repo.
2. Open Chrome and head to `chrome://extensions/`.
3. Toggle **Developer mode** on (top right).
4. Click **Load unpacked**.
5. Select this folder.

## How it works

It's just a light `content.js` script that observes the DOM. When it sees the GitHub merge actions, it injects the button. When you click it, it just grabs the text from the page elements (`.js-issue-title`, `.comment-body`, etc), formats it, and puts it in a sidebar overlay. No API tokens or auth required.
