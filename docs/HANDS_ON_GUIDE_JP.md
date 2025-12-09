# Power BI レポート Webアプリケーション - ハンズオンガイド

## はじめに

このガイドでは、Power BI レポート Webアプリケーションをセットアップし、実際に動かすまでの手順を日本語で説明します。

## 前提条件

以下のものが必要です：
- Node.js 16以上
- npm または yarn
- Microsoft Azure アカウント
- Power BI ライセンス

## ステップ1: リポジトリのクローン

```bash
git clone https://github.com/Liminghao0922/rti-report-demo.git
cd rti-report-demo
```

## ステップ2: 依存パッケージのインストール

```bash
npm install
```

インストールが完了するまで待機します（数分かかる場合があります）。

## ステップ3: Azure ADアプリケーションの登録

### 3.1 Azure ポータルへアクセス

1. [Azure Portal](https://portal.azure.com) にアクセスします
2. Microsoft アカウントでサインインします

### 3.2 アプリケーション登録の作成

1. **Azure Active Directory** → **アプリの登録** をクリック
2. **+ 新規登録** をクリック
3. 以下の情報を入力：
   - **名前**: `PowerBI-Report-WebApp` （任意の名前）
   - **サポートされているアカウントの種類**: 「この組織ディレクトリのみ」を選択
   - **リダイレクト URI**: `Web` を選択し、`http://localhost:5173` を入力

4. **登録** をクリック

### 3.3 アプリケーションIDとテナントIDを記録

登録後の画面で以下を記録します：
- **アプリケーション（クライアント）ID** → `MSAL_CONFIG_CLIENT_ID` として使用
- **ディレクトリ（テナント）ID** → テナントIDとして使用

## ステップ4: Power BI API のアクセス許可設定

### 4.1 API のアクセス許可を追加

1. 作成したアプリケーション登録画面に移動
2. **API のアクセス許可** をクリック
3. **+ アクセス許可を追加** をクリック
4. **Microsoft Graph** を選択
5. **委譲されたアクセス許可** を選択
6. 検索ボックスで `Report.Read.All` を検索して選択
7. **アクセス許可を追加** をクリック

## ステップ5: Power BI でレポート情報を取得

### 5.1 Power BI Service へアクセス

1. [Power BI Service](https://app.powerbi.com) にアクセス
2. Power BI ライセンスを持つアカウントでサインイン

### 5.2 レポートIDの取得

1. 使用したいレポートを開く
2. ブラウザのアドレスバーのURLを確認：
   ```
   https://app.powerbi.com/groups/.../reports/[レポートID]/...
   ```
3. **[レポートID]** の部分をコピー

### 5.3 埋め込みURLの生成

以下のURLフォーマットでコピー（テナントIDは3.3で取得したもの）：
```
https://app.powerbi.com/reportEmbed?reportId=[レポートID]&ctid=[テナントID]
```

### 5.4 Visual ID（スライサー）の取得

1. Power BI Desktop または Service でレポートを編集モード で開く
2. **表示** → **選択ウィンドウ** をクリック
3. 選択ウィンドウでフィルター用スライサーの名前を確認
4. その名前が Visual ID となります

例：`RegionSlicer` や `RegionFilter` など

### 5.5 テーブル名とカラム名を確認

1. Power BI Desktop のモデリングビューを確認
2. フィルター対象のテーブル名を確認（例：`Sales`, `Data`）
3. フィルター対象のカラム名を確認（例：`Region`, `Territory`）

## ステップ6: 環境変数ファイルの設定

### 6.1 .env ファイルの作成

プロジェクトルートディレクトリで `.env` ファイルを作成：

```bash
# Windowsの場合
copy .env.example .env

# macOS/Linuxの場合
cp .env.example .env
```

### 6.2 .env ファイルを編集

以下の内容を設定します：

```env
# Power BI Configuration (必須)
POWERBI_REPORT_ID='5.3で取得したレポートID'
POWERBI_EMBED_URL='5.3で取得した埋め込みURL'
POWERBI_TABLE_NAME='5.5で確認したテーブル名'
POWERBI_TABLE_COLUMN_NAME='5.5で確認したカラム名'
POWERBI_VISUAL_ID='5.4で取得したVisual ID'

# Azure AD Authentication (必須)
MSAL_CONFIG_CLIENT_ID='3.3で記録したアプリケーションID'
MSAL_CONFIG_CLIENT_AUTHORITY='https://login.microsoftonline.com/3.3で記録したテナントID'
MSAL_CONFIG_REDIRECT_URI='http://localhost:5173'
MSAL_CONFIG_POST_LOGOUT_REDIRECT_URI='http://localhost:5173'

# Optional: Omniverse Streaming
SESSION_SERVICE_URL='<ovestreamingurl>'
USD_PATH='https://yourstorage.blob.core.windows.net/container/file.usd'
USD_SAS_TOKEN='your-sas-token'
USD_HOST_NAME='yourstorage.blob.core.windows.net'
USD_CONTAINER_NAME='your-container-name'

# Optional: EventHub
EVENTHUB_REQUEST_SCOPE='https://eventhubs.azure.net/.default'
EVENTHUB_RESOURCE_URL='<eventhubnamespace>.servicebus.windows.net'
EVENTHUB_NAME='your-eventhub-name'
EVENTHUB_GROUP_NAME='$Default'
```

## ステップ7: 開発サーバーの起動

```bash
npm run dev
```

出力例：
```
  VITE v5.4.14  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## ステップ8: ブラウザでアプリケーションを起動

1. ブラウザで `http://localhost:5173` にアクセス
2. **ログイン** ボタンをクリック
3. Microsoft アカウントでサインイン
4. 権限同意画面が表示されたら **同意する** をクリック

## ステップ9: Power BI レポートを表示

ログイン成功後、以下が表示されます：

```
┌────────────────────────┬────────────────────────┐
│                        │                        │
│   Power BI Report      │   Placeholder BG       │
│   (左側 50%)           │   (右側 50%)           │
│   - データフィルター   │   - グラデーション背景 │
│   - インタラクティブ   │   - "未設定"表示       │
│                        │                        │
└────────────────────────┴────────────────────────┘
```

## ステップ10: フィルターボタンを試す

### 10.1 利用可能なフィルター

4つのリージョンフィルターボタンが表示されます：
- **Asia Pacific** - アジア太平洋地域でフィルター
- **Europe** - ヨーロッパでフィルター
- **North & Center America** - 北米・中米でフィルター
- **South America** - 南米でフィルター
- **Clear** - すべてのフィルターをクリア

### 10.2 フィルターの使用方法

1. Power BI レポートが読み込まれるのを待つ
2. いずれかのリージョンボタンをクリック
3. Power BI レポートが自動的に更新されます
4. 別のリージョンをクリックして、異なるデータを表示
5. **Clear** ボタンをクリックして、すべてのフィルターを解除

### 10.3 フィルター結果の確認

ボタンの下にメッセージが表示されます：
- ✅ 成功メッセージ: `✅ Filtered by Region: Asia Pacific`
- ❌ エラーメッセージ: `❌ Error: ...`

## トラブルシューティング

### 問題1: ログイン画面が表示されない

**原因**: Azure AD設定が正しくない

**解決方法**:
1. `MSAL_CONFIG_CLIENT_ID` が正しいか確認
2. `MSAL_CONFIG_CLIENT_AUTHORITY` にテナントIDが正しく含まれているか確認
3. Azure Portal でリダイレクトURI が `http://localhost:5173` に設定されているか確認

### 問題2: Power BI レポートが表示されない

**原因**: Power BI設定が正しくない

**解決方法**:
1. `POWERBI_REPORT_ID` が正しいか確認
2. `POWERBI_EMBED_URL` のフォーマットが正しいか確認
3. Azure AD アプリケーションに `Report.Read.All` 権限があるか確認
4. ブラウザの開発者ツール（F12）でエラーを確認

### 問題3: フィルターボタンが表示されない

**原因**: Omniverse Streaming が有効になっている

**解決方法**:
- Streaming が不要な場合、`SESSION_SERVICE_URL` を `<ovestreamingurl>` のままにする
- または、SESSION_SERVICE_URL をコメントアウトする

### 問題4: フィルターをクリックしても何も起こらない

**原因**: Power BI データセットの設定が正しくない

**解決方法**:
1. `POWERBI_TABLE_NAME` がデータセット内のテーブル名と一致しているか確認
2. `POWERBI_TABLE_COLUMN_NAME` がテーブル内のカラム名と一致しているか確認
3. `POWERBI_VISUAL_ID` が実際のスライサーの名前と一致しているか確認

## ステップ11: 本番環境へのデプロイ（オプション）

### 11.1 本番用にビルド

```bash
npm run build
```

成功すると `dist` ディレクトリが作成されます。

### 11.2 Azure Static Web Apps へのデプロイ

1. Azure Portal で Static Web App を作成
2. GitHub リポジトリを接続
3. ビルド設定：
   - App location: `/`
   - Output location: `dist`
4. 環境変数を設定（.env と同じ内容）
5. デプロイ完了を待つ

## まとめ

以下の手順を完了しました：

1. ✅ リポジトリをクローン
2. ✅ パッケージをインストール
3. ✅ Azure AD でアプリケーション登録
4. ✅ Power BI API 権限を設定
5. ✅ Power BI からレポート情報を取得
6. ✅ 環境変数を設定
7. ✅ 開発サーバーを起動
8. ✅ ブラウザでアプリケーションを表示
9. ✅ フィルターボタンをテスト

## サポートリソース

- [Power BI ドキュメント](https://docs.microsoft.com/ja-jp/power-bi/)
- [Azure AD ドキュメント](https://docs.microsoft.com/ja-jp/azure/active-directory/)
- [MSAL.js ドキュメント](https://docs.microsoft.com/ja-jp/azure/active-directory/develop/msal-overview)

## よくある質問（FAQ）

### Q: 本番環境での URL はどのように変更すればよいですか？

**A**: `.env` ファイルの `MSAL_CONFIG_REDIRECT_URI` と `MSAL_CONFIG_POST_LOGOUT_REDIRECT_URI` を本番環境の URL に変更してください。

### Q: 複数のレポートを表示できますか？

**A**: 現在のバージョンではサポートされていません。複数レポート表示機能は将来の改善を予定しています。

### Q: ユーザーごとに異なるデータを表示できますか？

**A**: はい、Power BI の行レベルセキュリティ（RLS）を使用して実装できます。詳細は Power BI ドキュメントをご覧ください。

### Q: Omniverse Streaming を追加するには？

**A**: `SESSION_SERVICE_URL` に有効な Omniverse Streaming サーバーの URL を設定してください。USD ファイルパスも設定する必要があります。

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は LICENSE.md を参照してください。
