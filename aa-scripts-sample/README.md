# Etherspot の AA SDK を試すサンプルスクリプト集です。

## 初期化

```bash
deno install
```

## ライブラリのインストール

```bash
deno add npm:@etherspot/prime-sdk
```

## 動かし方

- コントラクトウォレットなどを作成する。

  ```bash
  deno task dev
  ```

- シンプルな送金トランザクション

  ```bash
  deno task simpleTransfer
  ```

- ガスレスで送金トランザクションを送信させる方法

  ```bash
  deno task transferWithPaymaster
  ```

- ホワイトリストへの登録と deposit

  ```bash
  deno task deposit
  ```

- ERC20 token を送金する

  ```bash
  deno task transferERC20
  ```

- NFT を移転する。

  ```bash
  deno task transferNFT
  ```
