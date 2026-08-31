# リブラの見た夢 - Steam版

Electron と `steamworks.js` を使うSteam版ネイティブアプリです。本番では公開中のゲームを読み込み、開発時はローカルのViteサーバーを読み込みます。

## セットアップ

```bash
cd electron
yarn install
```

## 開発

先にプロジェクトルートでWebアプリを起動し、別のターミナルでElectronを起動します。

```bash
# プロジェクトルート
yarn dev

# electronディレクトリ
yarn dev
```

開発時はSteam App ID `1625720` を明示して初期化します。Steamクライアントを起動した状態で実行してください。

## ビルド

```bash
yarn build:linux
yarn build:win
yarn build:mac
```

成果物は `electron/dist/` に出力されます。本番版はSteamから起動し、App IDをSteam環境から取得します。

Web側では `window.steamAPI` を通じて、実績、オーバーレイ、Steam Cloudを利用できます。
