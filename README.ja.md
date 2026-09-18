# Enter Newline for AI

[English](README.md) | 日本語

AIチャットのメイン入力欄で、`Enter` を送信ではなく改行として扱い、`Ctrl+Enter` / `Cmd+Enter` で送信できるようにする Firefox / Chrome 向けブラウザー拡張です。

## 対応サービス

- ChatGPT
- Grok
- Claude
- Gemini
- Microsoft Copilot
- Perplexity
- Google AI Mode (`google.co.jp` / `google.com`)

## 操作

- `Enter`: 改行
- `Shift+Enter`: サービス本来の動作（通常は改行）
- `Ctrl+Enter` / `Cmd+Enter`: 送信

設定画面からサービス単位で有効 / 無効を切り替えられます。

## インストール

### Firefox

[Firefox Browser Add-onsの「Enter Newline for AI」](https://addons.mozilla.org/ja/firefox/addon/enter-newline-for-ai/)からインストールします。

### Chrome

1. [最新のリリース](../../releases/latest)から `enter-newline-for-ai-<version>-chrome.zip` をダウンロードして展開します。
2. `chrome://extensions/` を開きます。
3. 「デベロッパーモード」を有効にします。
4. 「パッケージ化されていない拡張機能を読み込む」を選び、`manifest.json` が入っている展開先フォルダーを指定します。

## 設定

ブラウザーの拡張機能管理画面からこの拡張機能のオプションを開くと、対応サービスごとに有効・無効を切り替えられます。変更内容はローカルに保存され、開いているページにも反映されます。

## プライバシーと権限

Enter Newline for AI は、メッセージやその他の個人データを収集、保存、送信しません。上記の対応AIチャットサイト上でのみ動作し、メッセージ入力欄のキー操作を処理します。

要求する `storage` 権限は、無効にしたサービスの設定をローカルへ保存するためだけに使用します。アクセス解析、広告、トラッキングのコードは含まれていません。

## 制限事項

対応サービス側の画面構成やキー操作が予告なく変更されることがあります。その場合、入力欄を認識できなくなったり、送信操作が正しく動作しなくなったりする可能性があります。

問題が起きた場合は、まずページを再読み込みしてください。
