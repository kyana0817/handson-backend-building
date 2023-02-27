# React.jsと任意のリソースを取得するためのバックエンド構築のハンズオン

## 0. 概要

今回のハンズオンでは、フロントエンドとバックエンドの繋ぎ込みに焦点あてたハンズオンです。

特にバック側の実装について話す予定なので、フロントを触らず、主にバックエンド側の実装を進める予定です。

## 1. そもそもの話

Reactでアプリを作成する場合は、大抵画面に表示するためのリソースを提供するバックエンドがあります。

バックエンドは、テキストファイルやデータベースなどの永続的な情報を保持するものや、インメモリーのようなの短期的な情報を保持するものなど、様々なリソースを元に情報を加工し、フロントエンドに渡します。

```mermaid
---
title: シンプルなアプリ構成
---
flowchart LR
	フロントエンド <---> バックエンド<--->id[(リソース)]


```

React や Vue などのSPAと呼ばれるWebアプリケーションではページ生成をクライアント側で行います。

ページ生成時に足りないなデータは、その都度バックエンド側にリクエストを行い、データの取得を行います。

逆に Ruby on Rails、Django、Laravel、で作成する、いわゆるフルスタックなWebアプリケーションではページ生成をバックエンド側で行うため、クライアント側では既に完成されたページを画面に描画します。

```mermaid
---
title: SPAとフルスタックの構成図(簡易)
---

graph TD
  subgraph SPA
    u[ユーザー]
    w[Web]
    b[アプリケーション]
    d[(リソース)]
    u -- リクエスト --> w
    w -- Reactのビルドファイルを送信 --> u
    b --　JSONデータを送信 --> u
    u -- リクエスト --> b
    b <-- クエリ --> d
  end
  subgraph フルスタック
    fu[ユーザー]
    fb[アプリケーション]
    fd[(リソース)]
    fb --　HTML/CSSを送信 --> fu
    fu -- リクエスト --> fb
    fb <-- クエリ --> fd
    subgraph フレーム
    	fb
    	fd
    end
  end
    
  
```

SPAの構成でも、バックエンド側をフルスタックフレームワークで構成することもできます。

## 2. 実行環境

今回のハンズオンは以下の構成です。

```mermaid
graph LR
  u[ユーザー]
  w[Web]
  app[アプリケーション]
  auth[認証]
  d[(リソース - MySQL)]
  m[(インメモリー - Redis)]
  u ---- w
  u --- app
  u --- auth
  app --- d
  auth --- app
  auth ---- m
  subgraph フロントエンド
    w
  end
  subgraph バックエンド
    app
    d
  end
  subgraph 認証
   auth
   m
  end
  
```

| 構成           | 内容               |
| -------------- | ------------------ |
| フロントエンド | React.js           |
| バックエンド   | express<br />MySQL |
| 認証           | express<br />Redis |

### 2-1. ディレクトリ構成

```
.
├───auth
├───client
└───server
```

- auth/

  JWTによる認証が実装されているサーバーで、URLによるWebAPIで操作を行う。

- client/

  Reactで作成された簡単Webアプリ、ユーザーによる投稿・コメント・フォロー/フォロワー機能がある。

- server/

  これから実装ディレクトリ
  
  このディレクトリに含まれている app.js をこれから編集していきます。

### 2-2. セットアップ

Docker コンテナの起動とモジュールのインストールを行います。

```
docker-compose up -d
npm install
npm run dev
```

サーバーの起動にはリソースとのアクセスが必要になるので、コンテナが起動してから開発用のサーバーを起動します。

## 3. バックエンドのHello World

### 3-1. 動的なHTML

まずは、フルスタック なアプリケーションの様にHTMLを返却するルートを作成してみます。

```javascript
const app = express()
const port = 8000

app.get('/', (res, req) => {
  req.setHeader('Content-Type', 'text/html')
  req.send(`<html lang="ja">
<head>
  <title>Hello World!</title>
</head>
<body>
  <h1>Hello World</h1>
  <h2>Express App</h2>
</body>
</html>`)
})

app.listen(port, (err) => {
  if (err) console.log(err)
  console.log(`Example app listening on port ${port}`)
})
```

http://localhost:8000 にブラウザでアクセスすると Hello World が表示されます。

また、curlなどのコマンドでアクセスすることで、HTMLのテキストが表示されます。

画面に表示されているHTML情報は、動的に生成されているものなのでJavaScriptのコードを簡単に埋め込めます。

```javascript
const app = express()
const port = 8000

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.send(`<html lang="ja">
<head>
  <title>Hello World!</title>
</head>
<body>
  <h1>Hello World!!!</h1>
  <h2>Express App</h2>
  <p>3 + 4 = ${3 * 4}</p>
</body>
</html>`)
})

app.listen(port, (err) => {
  if (err) console.log(err)
  console.log(`Example app listening on port ${port}`)
})

```

### 3-2. JSONのレスポンス

HTMLのレスポンスができることを確認したら、次はJSON形式のレスポンスを行います。

JSON形式も書き方ほとんど同じです。

```JavaScript
<-- 省略 -->

app.get('/json', (req, res) => {
  res.setHeader('Content-Type', 'Application/json')
  res.send(`{"message": "hello"}`)
})

app.listen(port, (err) => {
  if (err) console.log(err)
  console.log(`Example app listening on port ${port}`)
})

```

http://localhost:8000/json にブラウザでアクセスすると JSON形式 の内容が表示されます。

Express では、JSON形式のテキストを返す際に、sendメソッドの変わりにjsonメソッドを使用することができます。

jsonメソッドを使用することでヘッダーにコンテンツタイプの設定をする手間が省けます。

```javascript
<-- 省略 -->

app.get('/json2', (req, res) => {
  res.json({message: "hello"})
})

app.listen(port, (err) => {
  if (err) console.log(err)
  console.log(`Example app listening on port ${port}`)
})
```

基本的に、クライアント側とバックエンド側の通信はJSON形式でデータのやり取りを行うので、何かしらのデータを返却する時はjsonメソッドを使用します。

## 4 データベースとのHello World

ユーザーが入力した情報やECの商品情報など、Webアプリケーションでは永続して所持する必要があるデータがあります。

そのデータを保持しておくための１つ手段として、データベースがあります。

ファイルの先頭にデータベースへの接続に必要なモジュールのインポートと、データベースに接続を行います。

```javascript
import express from 'express'
import fetch from 'node-fetch'
import mysql from 'mysql2/promise'

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'example'
})

<-- 省略 -->
```

MySQLへのクエリは、```connection```から行います。

データベースとの疎通がしっかりを行えているか、定数を返却するクエリを実行します。

```javascript
<-- 省略 -->

app.get('/db', async (req, res) => {
  const [result, meta] = await connection.query('SELECT 42')
  req.json(result)
})

app.listen(port, (err) => {
  if (err) console.log(err)
  console.log(`Example app listening on port ${port}`)
})

```

http://localhost:8000/db にブラウザでアクセスするとクエリ結果の内容が表示されます。

ブラウザの画面に```42```が表示されていれば、正常にデータベースとの接続が行えています。

## 5. クライアントから通信を行う

### 5-1. デベロッパーツールから通信を確認

Reactのアプリケーションからバックエンドに通信を行う際は、ちょっとした設定が必要になります。

http://localhost:3000/test/api にアクセスし、バックエンドからレスポンスを確認します。

レスポンスの確認は、ブラウザのデベロッパーツールから確認を行います。

以下は、上記のURLに対応する、Reactのコンポーネントのソースコードです。

```javascript
import { useState, useEffect } from 'react'
import apiClient from '../../lib/apiClient'

export default function Api () {
  const [data, setData] = useState({})

  useEffect(() => {
    (async () => {
      const res = await apiClient.get('/client')
      setData(res)
    })()
  }, [])

  return (
    <div>
      <p>http://localhost:8000/client</p>
      <p>
        response: <br/>
        {JSON.stringify(data)}
      </p>
    </div>
  )
}
```

このページでは、http://localhost:8000/client に通信を行い、そのレスポンスデータ文字列に変換し画面に描画しているコンポーネントになります。

コード内登場している```apiClient```は、fetchの記述を簡略化しているものなので、通常のfetchと内部の処理は同じです。

まず、通信先まだ定義されていない状態なので、404 Not Found がレスポンスとして返却されてしまいます。

以下のコード追記し、通信先を定義します。

```javascript
<-- 省略 -->

app.get('/client', (req, res) => {
  res.json({message: "hello"})
})

app.listen(port, (err) => {
  if (err) console.log(err)
  console.log(`Example app listening on port ${port}`)
})

```

通信先を定義したら、もう一度 http://localhost:3000/test/api にアクセスし、デベロッパーツールから通信の結果を確認します。

次は、CORS エラーと表示されました。

### 5-2. CORSとは

Cross-Origin Resource Sharing の略称で、クロスオリジン間でのリソースのやり取りに対して制約のことです。約の内容によって、特定のオリジンからの通信を拒否したり、全オリジンからの通信を許可したりすることができます。

オリジンは、URLに含まれている、プロトコルとホスト名とポート番号によって決まります。

![オリジン](./origin.png)

この3つの要素がどれか1つでも違えば、別のオリジンという扱いになります。ほとんどの場合、ポート番号が省略されていますが、プロトコルの一般的のポート番号を使用している限りは、明記しているしていない関係なく同一のオリジンとして扱われます。

| リクエスト元          | リクエスト先           | 関係           |
| --------------------- | ---------------------- | -------------- |
| http://localhost      | http://localhost       | 同一オリジン   |
| http://localhost:80   | http://localhost       | 同一オリジン   |
| https://localhost     | http://localhost       | クロスオリジン |
| https://localhost     | https://localhost:443  | 同一オリジン   |
| http://localhost:3000 | http://localhost:3000  | 同一オリジン   |
| http://localhost:3000 | https://localhost:3000 | クロスオリジン |
| http://localhost:3000 | http://localhost:8000  | クロスオリジン |

通信がクロスオリジンで行われる場合、ほとんどの場合CORSの設定が必要になります。

このCORSの設定は、バックエンドでは設定行います。

```javascript
import express from 'express'
import fetch from 'node-fetch'
import mysql from 'mysql2/promise'
import cors from 'cors'

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'example'
})

const app = express()
const port = 8000

app.use(cors())

<-- 省略 -->
```

今回使用しているExpressでは、corsモジュールをインポートし、routeのミドルウェアに設定を行うことでCORSの設定を行うことができます。

corsモジュールのデフォルト設定は、全通信の許可なのでどこからでも通信を受けている状態になっています。

設定後もう一度、Reactのアプリケーションを覗いている見ると、レスポンス結果が表示されていると思います。

## 6. ユーザー認証

### 6-1. トークンの取得

http://localhost:3000/auth/signup にアクセスし、フォーム入力後の通信を確認します。

![register-network](./register-network.png)

１つ目の通信は、認証サーバーにリクエストしている通信になります。

この時点でRedisにユーザーの情報が格納され、レスポンスにユーザーを証明するトークンとそのトークン作り直すためのリフレッシュトークンが返却されます。

```javascript
{
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJyZWFjdF9oYW5kc29uX2Nvbm5lY3QiLCJpYXQiOjE2NzY4NzA0NTk4NjksInN1YiI6InRlc3RAdGVzdC5jb20iLCJleHAiOjE2NzY5MTM2NTk4Njl9.c9f4040b44dec1df67901ef3a27cda0ca7ed0f12e9ee316241961771d9b0a549",
  refreshToken: "7ed5c4b7e23c9fe36f0b62ad4f6854b278128cc9e8a3d4532efe282ae29148f1"   
}
```

accessToken は、認証が必要なバックエンドへリクエストを行う際に使用します。

リクエスト時のヘッダーに` Authorization`を設定し、その値に`Bearer ${token}`という風に、接頭辞に `Bearer `という文言を付けて、リクエストを送ります。

この`Bearer ` という接頭辞は、ベアラー認証を行う際のお決まりで、決められた生成方法によって生成されたトークンを利用した認証形式のことになります。

今回は、JWTという比較的メジャーな方法でトークンを生成しており、それを利用して認証を行っているので、ベアラー認証ということになります。

ヘッダーにトークンをセットしているコードは、Clientディレクトリ内の`src/lib/apiClient.js`の以下の部分になります。

```javascript
import storage from "../utils/storage"
import { refresh } from "./auth"

class ApiClient {
  constructor (basePath) {
    this.basePath = basePath
  }

  headers () {
    const token = storage.getToken()? `Bearer ${storage.getToken()}`: undefined

    return JSON.parse(JSON.stringify({
      'Content-Type': 'Application/json',
      'Authorization': token
    }))
  }
  
<-- 省略 -->
```

`apiClient`を通じて、バックエンド側のリクエストを送っているので、トークンを取得したそれ以降のリクエストのヘッダー部分には、以下の様にトークン含まれるようになります。

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJyZWFjdF9oYW5kc29uX2Nvbm5lY3QiLCJpYXQiOjE2NzY4NzA0NTk4NjksInN1YiI6InRlc3RAdGVzdC5jb20iLCJleHAiOjE2NzY5MTM2NTk4Njl9.c9f4040b44dec1df67901ef3a27cda0ca7ed0f12e9ee316241961771d9b0a549
```

### 6-2. データベースにユーザーの情報を登録

認証情報と同様にバックエンド側のデータベースにも、ユーザーの情報を登録してあげる必要があります。`\register`を作成し、データベースにユーザー情報を登録します。

```javascript
<-- 省略 -->

app.post('/register', async (req, res) => {
  const token = req.header('Authorization')?.replace(/^Bearer /, '')
  if (token) {
    const payload = req.body;

    const [result, meta] = await connection.query(
      'INSERT INTO users (username, email, created_at) values (?, ?, ?)',
      [payload.username, payload.email,  new Date()]
    )
    
    res.json(result)
  } else {
    res.status(401).json({message: 'Required token'})
  }
})


app.listen(port, (err) => {
  if (err) console.log(err)
  console.log(`Example app listening on port ${port}`)
})
```

`\register`へのリクエストは、ユーザー情報をペイロードによって運ぶので、postメソッドでルートを作成します。

このルートへのリクエストには、トークンが含まれていることが前提になるので、まずヘッダーからトークンを取得します。

`req.body`のペイロード(今回の場合は、ユーザー情報)が入っているので、変数に一度書くのしてあげます。

また、この時のペイロードは、JSON形式で格納されているため、一度JSON形式からJavaScriptのオブジェクト形式に変換してあげる必要があります。

がしかし、ほとんどの通信はJSON形式でやり取りを行うため、全てのルートでJSONからの変換をするとコードの可読性は落ちますし、何よりも面倒です。なので変換するミドルウェアを登録します。

```javascript
import express from 'express'
import fetch from 'node-fetch'
import mysql from 'mysql2/promise'
import cors from 'cors'

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'example'
})

const app = express()
const port = 8000


app.use(express.json())
app.use(cors())

<-- 省略 -->
```

corsの設定同様に、`use`に`express`の`json()`を登録します。

これで、`req.body`に含まれる値はJavaScriptのオブジェクト形式になりました。

### 6-3. 認証情報のアップデート

認証サーバーに、ユーザーのIDを登録します。

ユーザーのIDを登録することでトークンとユーザーのIDが紐づくので、バックエンド側のリクエストに含まれるトークン情報によって、どのユーザーがリクエストかが判断できるようになります。

`/register`ルートに追記で、認証サーバーへのリクエストを記述します。

```javascript
<-- 省略 -->

app.post('/register', async (req, res) => {
  const token = req.header('Authorization')?.replace(/^Bearer /, '')
  if (token) {
    const payload = req.body

    const [result, meta] = await connection.query(
      'INSERT INTO users (username, email, created_at) values (?, ?, ?)',
      [payload.username, payload.email,  new Date()]
    )
    
    // 追記↓
    
    const response = await fetch('http://localhost:8800/auth/update', {
      method: 'post',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'Application/json'
      },
      body: JSON.stringify({applicationId: result.insertId})
    })
    
    const auth = await response.json()
    
    res.json(auth)
  } else {
    res.status(401).json({message: 'Required token'})
  }
})


app.listen(port, (err) => {
  if (err) console.log(err)
  console.log(`Example app listening on port ${port}`)
})
```

fetch APIを使用して、認証サーバーへリクエストを行います。

ヘッダーには、クライアントからリクエストと同様にヘッダーにトークンをセットし、ボディにはユーザーのIDを渡します。

ここまで、ユーザー登録の処理を完了です。

一度Dockerコンテナを落として、リソースを初期化(サインアップ時のデータが残っているため)します。

```
docker-compose stop
docker-compose down -v
docker-compose up -d
```

また、nodeのサーバーも一度閉じてから、起動し直します。

```
npm run dev
```

Dockerコンテナとサーバーが立ち上がったら、http://localhost:3000/auth/signup にアクセスし、デベロッパーツールのネットワークタブを開いてから、ユーザー登録を行います。

最初と同じように、認証サーバーにリクエストが飛んでから、バックエンド側に通信が飛んでいるのが確認できると思います。

んで、バックエンド側からレスポンス結果が`{result: true}`となっていれば、ユーザー登録が完了していることになります。

また、実際どのようにデータが格納されているかは、各リソースにアクセスすることで確認できます。

#### MySQL

```
docker-compose exec db mysql -u user -ppassword example

mysql> select * from users;
```

#### Redis

```
docker-compose exec auth redis-cli

127.0.0.1:6379> auth password
127.0.0.1:6379> hgetall user:<登録したemail>
```

### 6-4. サインアップの全体の流れ

```mermaid
sequenceDiagram
    autonumber
    actor user as ユーザー
    participant auth as 認証サーバー
    participant app as アプリケーションサーバー
    participant db as MySQL
    participant redis as Redis
    user->>auth: ユーザー登録(サインアップ)
    auth->>auth: トークン(JWT)を生成
    auth->>redis: ユーザー情報を登録
    auth->>user: トークン情報を含む、レスポンス
    user->>app: ユーザー情報とヘッダーにトークンをセット
    app->>db: ユーザー情報を登録
    db->>app: 登録したユーザーのIDを取得
    app->>auth: ユーザーIDとヘッダーにトークンをセット
    auth->>auth: トークンからユーザー情報を取得
    auth->>redis: ユーザー情報にユーザーIDを追加
    auth->>app: 結果をレスポンス
    app->>user: 結果をレスポンス
    user->>user: アプリケーションのホーム画面にリダイレクト

```

## 7. ユーザーに紐づいてデータの登録

### 7-1.新規投稿機能

新規投稿機能のバックエンドを実装していきます。

新規投稿機能は、`/post`にリクエストが行われており、リクエストのメソッドはpostになります。

リクエストのペイロードは以下の様な内容になります。

```javascript
{
  title: "テスト",
  content:"こんにちは"
}
```

投稿を保存するテーブルは以下の定義になっています。

```mysql
+-------------+--------------+------+-----+---------+----------------+
| Field       | Type         | Null | Key | Default | Extra          |
+-------------+--------------+------+-----+---------+----------------+
| id          | int          | NO   | PRI | NULL    | auto_increment |
| user_id     | int          | NO   | MUL | NULL    |                |
| title       | varchar(128) | NO   |     | NULL    |                |
| content     | text         | NO   |     | NULL    |                |
| created_at  | datetime     | NO   |     | NULL    |                |
| modified_at | datetime     | YES  |     | NULL    |                |
| deleted_at  | datetime     | YES  |     | NULL    |                |
+-------------+--------------+------+-----+---------+----------------+
```

投稿保存するために必要なデータは、title と content、そして投稿したユーザーのIDです。

ユーザーのIDを取得するため、バックエンド側から認証サーバーにリクエストを行います。

```javascript
<-- 省略 -->

app.post('/post', async (req, res) => {
  const token = req.header('Authorization')?.replace(/^Bearer /, '')
  
  if (token) {    
    const response = await fetch ('http://localhost:8800/auth', {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'Application/json'
      }
    })

    const auth = await response.json()

    if (response.ok) {
      const payload = req.body

      const [result, meta] = await connection.query(
        `INSERT INTO posts (title, content, user_id, created_at) values (?, ?, ?, ?)`,
        [payload.title, payload.content, auth.applicationId, new Date()]
      )

      res.json({id: result.insertId})

    } else {
      res.status(401).json(auth)
    }
  } else {
    res.status(401).json({message: 'Required token'})
  }
})

app.listen(port, (err) => {
  if (err) console.log(err)
  console.log(`Example app listening on port ${port}`)
})
```

新規投稿の機能だけでコードが少し長くなってしまいました。

このコードの流れをフローチャートで表すと以下の様になります。

```mermaid
flowchart
	A[トークンの確認]
	B[ユーザーIDの取得]
	C[データベースに登録]
	D[サクセスレスポンス]
	E[エラーレスポンス]
	F[エラーレスポンス]
	
	A-- トークン有り -->B
	B-- 取得成功 -->C
	C-->D
	A-- トークン無し -->E
	B-- 取得失敗 -->F
	
```

フローチャートの中でルート固有の処理は、「データベースに登録」の部分だけです。

「トークンの確認」は、今回のようなアプリケーションでは毎回行われるものであり、「ユーザーIDの取得」もユーザーに紐づくデータベースの操作が行われるたびに必要になります。

このように、繰り返し行われる処理を各ルートに毎回記述していくのは大変なので、「トークンの確認」と「ユーザーIDの取得」をミドルウェアとして定義します。

`/register`ルートの直前に「トークンの確認」を追記します。

```javascript
<-- 省略 -->

app.use(async (req, res, next) => {
  const token = req.header('Authorization')?.replace(/^Bearer /, '')
  
  if (token) {
    req.token = token
    next()
  } else {
    res.status(401).json({message: 'Required token'})
  }
})

app.post('/register', async (req, res) => {
  const payload = req.body
  
  const [result, meta] = await connection.query(
    'INSERT INTO users (username, email, created_at) values (?, ?, ?)',
    [payload.username, payload.email,  new Date()]
  )
    
  const response = await fetch('http://localhost:8800/auth/update', {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${req.token}`,
      'Content-Type': 'Application/json'
    },
    body: JSON.stringify({applicationId: result.insertId})
  })
    
  const auth = await response.json()
  
  res.json(auth)
})

<-- 省略 -->

```

次に、`/register`ルートの直後に「ユーザーIDの取得」を追記します。

```javascript
app.use(async (req, res, next) => {
  const auth = await fetch ('http://localhost:8800/auth', {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${req.token}`,
      'Content-Type': 'Application/json'
    }
  })

  const data = await auth.json()

  if (auth.ok) {
    req.auth = data
    next()
  } else {
    res.status(401).json(data)
  }
})

app.post('/post', async (req, res) => {
  const payload = req.body

  const [result, meta] = await connection.query(
    `INSERT INTO posts (title, content, user_id, created_at) values (?, ?, ?, ?)`,
    [payload.title, payload.content, req.auth.applicationId, new Date()]
  )

  res.json({id: result.insertId})
})

app.listen(port, (err) => {
  if (err) console.log(err)
  console.log(`Example app listening on port ${port}`)
})
```

ミドルウェアの影響範囲は、ミドルウェアの後に定義されたルートや他のミドルウェアになります。

なので、`/post`には「トークンの確認」と「ユーザーIDの取得」の両方が適応されますが、`/register`は「ユーザーIDの取得」よりも先に定義されているので、適応されるのは「トークンの確認」のみになります。

投稿したものがデータベースに登録されているか確認してみましょう。

#### MySQL

```
docker-compose exec db mysql -u user -ppassword example

mysql> select * from posts;
```

### 7-2. 投稿物の表示

投稿物の表示機能のバックエンドを実装していきます。

投稿物の表示機能は、`/post`にリクエストが行われており、リクエストのメソッドはgetになります。

```javascript
app.get('/post', async (req, res) => {
  const [posts, meta] = await connection.query(
    'SELECT p.*, u.username, u.email FROM posts as p JOIN users as u ON p.user_id = u.id',
  )

  res.json(posts)
})

app.listen(port, (err) => {
  if (err) console.log(err)
  console.log(`Example app listening on port ${port}`)
})
```

このコードを追加すると画面上に投稿したものが表示されるようになります。

## 8. URLパラメータ

### 8-1. コメント投稿機能

コメント投稿機能のバックエンドを実装していきます。

コメントは投稿物に紐づくので、`/post/:postId/comment`リクエストが行われており、リクエストのメソッドはpostになります。

```javascript
app.post('/post/:postId/comment', async (req, res) => {
  const params = req.params
  const payload = req.body
  const auth = req.auth

  const [result, meta] = await connection.query(
    'INSERT INTO comments (post_id, user_id, content, created_at) value (?, ?, ?, ?)',
    [params.postId, auth.applicationId, payload.content, new Date()]
  )

  res.json({id: result.insertId})
})
```

ルートに含まれる`:postId`は、URLパラメータです。

expressではルートに含まれる`:(コロン)`で始まる、パスの部分はURLパラメータとして処理されます。

例えば、

```
/post/1/comment    <-- postId = 1
/post/30/comment   <-- postId = 30
```

になります。

Web APIの設計としてREST APIというものがありますが、REST APIもURLパラメータを使用して、ルートを構成します。

以下は、REST APIのルート構成の例です。

| 機能名     | メソッド | ルート        | 説明                       |
| ---------- | -------- | ------------- | -------------------------- |
| ListPost   | GET      | /post         | ポストの一覧を表示         |
| CreatePost | POST     | /post         | ポストを作成               |
| UpdatePost | PUT      | /post/:postId | 対象ポストを更新           |
| DeletePost | DELETE   | /post/:postId | 対象ポストを削除           |
| DetailPost | GET      | /post/:postId | 対象ポストの詳細情報を表示 |

テーブル内の特定のレコードに対して操作を行う場合には、URLパラメータにプライマリキーを記載してリクエストを送ります。

このように、特定のレコードを対象にする場合によく使用されるもので、URLパラメータが複数になるルートも作れますし、よくあります。

### 8-2. コメント表示機能

コメント表示機能のバックエンドを実装していきます。

コメントは投稿物に紐づくので、`/post/:postId/comment`リクエストが行われており、リクエストのメソッドはgetになります。

```javascript
app.get('/post/:postId/comment', async (req, res) => {
  const params = req.params

  const [comments, meta] = await connection.query(
    'SELECT u.username, c.content FROM comments as c JOIN users as u ON c.user_id = u.id WHERE c.post_id = ?',
    [params.postId]
  )

  res.json(comments)
})
```

### 8-3. ユーザー詳細機能

ユーザー詳細機能のバックエンドを実装していきます。

`/user/:userId`リクエストが行われており、リクエストのメソッドはgetになります。

また、画面上にはそのユーザーが投稿したものもページに含まれるようにしたいので、同時に`/user/:userId/post`のルートも実装します。

```javascript
app.get('/user/:userId', async (req, res) => {
  const auth = req.auth
  const params = req.params

  const [users, meta] = await connection.query([
      'SELECT u.username, u.email, COUNT(s.source_id) as source, COUNT(t.target_id) as target,',
      '(CASE WHEN COUNT(t.source_id = ?) = 1 THEN 1 ELSE 0 END) as is_follow',
      'FROM users as u',
      'LEFT JOIN followers as s ON u.id = s.source_id',
      'LEFT JOIN followers as t ON u.id = t.target_id',
      'WHERE u.id = ?',
      'GROUP BY u.id'
    ].join(' '),
    [auth.applicationId, params.userId]
  )

  res.json(users[0])
})

app.get('/user/:userId/post', async (req, res) => {
  const {userId} = req.params
  
  const [posts, meta] = await connection.query(
    'SELECT p.*, u.username, u.email FROM posts as p JOIN users as u ON p.user_id = u.id where u.id = ?',
    [userId]
  )
    
  res.json(posts)
})
```

### 8-4. フォロー機能

フォローのバックエンドを実装していきます。

「フォローする」と「フォローを外す」は両方とも同じ`/follow/:userId`リクエストが行われており、「フォローする」のリクエストはpostで「フォローを外す」はdeleteメソッドになります。

```javascript
app.post('/follow/:userId', async (req, res) => {
  const auth = req.auth
  const params = req.params

  const [result, meta] = await connection.query(
    'INSERT INTO followers (source_id, target_id, created_at) values (?, ?, ?)',
    [auth.applicationId, params.userId, new Date()]
  )

  res.json({id: result.insertId})
})


app.delete('/follow/:userId', async (req, res) => {
  const auth = req.auth
  const params = req.params

  const [result, meta] = await connection.query(
    'DELETE FROM followers WHERE source_id = ? AND target_id = ?',
    [auth.applicationId, params.userId]
  )

  res.json(result)
})
```

### 9. ログインユーザーの詳細

### 9-1.ログインユーザー詳細機能

ログインユーザーの詳細情報を表示する時は、注意が必要です。

大抵のマイページには、プライバシーの観点から他人には、見せてはいけない情報を載せていることがほとんどなので、ユーザー詳細ページと同じルートでのアクセスは不適当です。

ユーザー詳細ページを開くときの情報は、ルートにユーザーのプライマリキーが入るので、その部分の値を変えれば、誰でも簡単にそのユーザーの情報を取得できます。

なので、ログインユーザーのルートでは、URLにプライマリキーを載せるのではなく、通信時に一緒に送信されているトークンを使用します。

`/currentUser`リクエストが行われており、リクエストのメソッドはgetになります。

ついでに、ログインユーザーの詳細ページに表示する投稿物も定義してしまいます。

ログインユーザーの投稿物は`/currentUser/post`にリクエストが行われており、リクエストのメソッドはgetになります。

```
app.get('/currentUser', async (req, res) => {
  const auth = req.auth

  const [users, meta] = await connection.query([
      'SELECT u.username, u.email, COUNT(s.source_id) as source, COUNT(t.target_id) as target',
      'from users as u',
      'LEFT JOIN followers as s ON u.id = s.source_id',
      'LEFT JOIN followers as t ON u.id = t.target_id',
      'WHERE u.id = ?',
      'GROUP BY u.id'
    ].join(' '),
    [auth.applicationId]
  )

  res.json(users[0])
})

app.get('/currentUser/post', async (req, res) => {
  const auth = req.auth
  
  const [posts, meta] = await connection.query(
    'SELECT p.*, u.username, u.email FROM posts as p JOIN users as u ON p.user_id = u.id where u.id = ?',
    [auth.applicationId]
  )

  res.json(posts)
})
```



