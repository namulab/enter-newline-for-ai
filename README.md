# Enter Newline for AI

English | [日本語](README.ja.md)

A Firefox / Chrome browser extension that makes `Enter` insert a newline instead of sending the message in AI chat input fields, while `Ctrl+Enter` / `Cmd+Enter` sends the message.

## Supported services

- ChatGPT
- Grok
- Claude
- Gemini
- Microsoft Copilot
- Perplexity
- Google AI Mode (`google.co.jp` / `google.com`)

## Keyboard behavior

- `Enter`: Insert a newline
- `Shift+Enter`: Use the service's native behavior (normally inserts a newline)
- `Ctrl+Enter` / `Cmd+Enter`: Send the message

Each supported service can be enabled or disabled individually from the extension settings.

## Installation

### Firefox

Install [Enter Newline for AI from Firefox Browser Add-ons](https://addons.mozilla.org/firefox/addon/enter-newline-for-ai/).

### Chrome

1. Download `enter-newline-for-ai-<version>-chrome.zip` from the [latest release](../../releases/latest) and extract it.
2. Open `chrome://extensions/`.
3. Enable **Developer mode**.
4. Select **Load unpacked** and choose the extracted folder containing `manifest.json`.

## Settings

Open the extension's options from your browser's extension management page to enable or disable it for each supported service. Changes are saved locally and take effect on open pages.

## Privacy and permissions

Enter Newline for AI does not collect, store, or transmit messages or other personal data. It runs only on the supported AI chat sites listed above and handles keyboard events in their message input fields.

The extension requests the `storage` permission only to save locally which services you have disabled. It contains no analytics, advertising, or tracking code.

## Known limitations

Supported services may change their page structure or keyboard behavior without notice. Such changes can temporarily prevent the extension from finding an input field or sending a message correctly.

If a problem occurs, reload the page first.
