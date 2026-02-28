# Development

## 概要

このプロジェクトは Docker なしで開発できます。

重要なのは、YouTube の埋め込みを `file://` ではなく `http://localhost` で開くことです。
`index.html` をファイルとして直接開くと、YouTube 側でエラー `153` になることがあります。

## ローカルサーバーの起動

次を実行します。

```bash
./serve.sh
```

デフォルトでは、ポート `8000` でローカルサーバーを起動します。

ブラウザでは次を開きます。

```text
http://localhost:8000/index.html
```

別のポートを使いたい場合は、引数で指定できます。

```bash
./serve.sh 8080
```

## ローカルサーバーの停止

次を実行します。

```bash
./stop-serve.sh
```

## 主なファイル

- `fukutaro.js`: ライブラリ本体
- `index.html`: Git 管理するサンプルページ
- `der_rosenkavalier.html`: ローカル専用サンプル。Git では無視

## 開発の流れ

1. `./serve.sh` でローカルサーバーを起動する
2. `http://localhost:8000/index.html` を開く
3. `fukutaro.js` または `index.html` を編集する
4. ブラウザをリロードして確認する
5. 作業後に `./stop-serve.sh` でサーバーを停止する

## 補足

- サーバーの PID は `.http-server.pid` に保存されます
- サーバーの出力ログは `.http-server.log` に保存されます
- これらのファイルは Git 管理対象外です
