# YAMAP Activity Exporter
## YAMAPの活動日記をエクスポートするChrome拡張機能

このChrome拡張機能は、YAMAPの活動日記（ヤマレコで言うところの山行記録）をエクスポートします。

自分の活動日記を手軽にバックアップする目的で制作しました。

エクスポートされたデータは、シンプルなテキストと JPEG ファイルで構成されます。ご自分のブログや他社サービスへの転載にもご利用いただけると思います。

## 使い方

Google Chrome や Microsoft Edge に拡張機能としてインストールします。

ブラウザーで YAMAP の活動日記のページを開き、拡張機能のアイコンをクリックすると、「Export Activity Data」というボタンが表示されます。

ボタンがクリックされると、活動日記のデータを取得開始します。データ取得中はボタンの表記が「Exporting... Please wait.」となります。

取得が終了すると、zipファイルとしてエクスポート（ダウンロード）します。

エクスポートされるデータには次のものが含まれます。

-テキストデータ
  - 活動日記のタイトル
  - 日付
  - 行動日数
  - 都道府県
  - 地図の名前
  - 行動時間
  - 累積標高（上り、下り）
  - 詳細（感想文）
- 写真
  - 画像ファイル (JPEG)
  - 写真のメモ (テキスト)

GPX ファイルはエクスポートされません。活動日記ページ上のボタンをクリックして手動で別途エクスポートしてください。

## ライセンス
この拡張機能は、次のライブラリや画像を使用しています。

[JSZip ライブラリ](https://stuk.github.io/jszip/ "JSZip") … JSZip は MIT ライセンスで配布されています。

[Triangle icons created by Iconpro86 - Flaticon](https://www.flaticon.com/free-icons/triangle "triangle icons") … Free for personal and commercial purpose with attribution.

## 動作確認
Browser: Google Chrome 128.0.6613.120 (Official Build) (arm64)

OS: macOS バージョン14.6.1（ビルド23G93）

