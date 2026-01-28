# cube

## ローカル環境の構築手順

### 1. git clone

```bash
cd ~/git/
git clone git@github.com:supilog/cube.git
cd cube
```

### 2. Docker コンテナのビルドと起動

```bash
docker compose up -d --build
```

### 3. 初回セットアップ

### 3.1 Composer で依存関係をインストール

```bash
docker compose exec app composer install --no-interaction
```

#### 3.2 アプリケーションキーの生成

```bash
docker compose exec app php artisan key:generate
```

#### 3.3 ストレージ・キャッシュの書き込み権限

```bash
chmod -R 777 src/storage src/bootstrap/cache
```

### 4. アクセス

ブラウザで次の URL を開きます。

- **http://localhost:8080**

## よく使うコマンド

| 目的 | コマンド |
|------|----------|
| コンテナの停止 | `docker compose down` |
| コンテナの再起動 | `docker compose restart` |
| Artisan コマンドの実行 | `docker compose exec app php artisan <コマンド>` |
| Composer の実行 | `docker compose exec app composer <コマンド>` |
| ログの確認 | `docker compose logs -f` |

## ディレクトリ構成（Docker 関連）

```
cube/
├── docker-compose.yml      # サービス定義
├── docker/
│   ├── nginx/
│   │   └── default.conf    # Nginx 設定（ローカル用）
│   └── php/
│       ├── Dockerfile      # PHP イメージのビルド定義
│       ├── php.ini         # PHP 設定（ローカル用）
│       └── www.conf        # PHP-FPM ワーカー設定
└── src/                    # Laravel アプリケーション
```

## 本番環境の構築手順
```bash
cd /var/www/vhosts/cube.supisupi.com
git clone git@github.com:supilog/cube.git .
cp -i src/.env.example src/.env

docker compose -f docker-compose.prod.yml up -d --build
docker compose exec app composer install --no-interaction
docker compose exec app php artisan key:generate
```