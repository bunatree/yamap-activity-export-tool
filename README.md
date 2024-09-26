# YAMAP Activity Export Tool
## YAMAP の活動日記をエクスポートする Chrome 拡張機能

この Chrome 拡張機能は、YAMAP の活動日記（山行記録）を、テキストデータと写真ファイル (JPEG) をひとつにまとめた ZIP ファイルとしてエクスポートします。

ZIP ファイルのエクスポート後、続けて GPX ファイル（GPSの軌跡）もエクスポートします。

活動日記を手軽にバックアップする目的で制作しました。

ブログや他社サービスへの転載にもご利用いただけます。

## 拡張機能のインストール手順

### 1. ダウンロード

ブラウザーで下記 URL にアクセスします。

[https://github.com/bunatree/yamap-activity-export-tool/](https://github.com/bunatree/yamap-activity-export-tool/)

緑色の [Code] ボタンをクリックして表示されたメニューの一番下にある [Download ZIP] をクリックします。

当拡張機能が ZIP ファイルとしてダウンロードされます。

ダウンロードした ZIP ファイルを展開し、任意のフォルダにコピーしてください。

### 2. ブラウザへのインストール

Chrome または Edge ブラウザを起動します。

#### Google Chrome の場合

アドレスバーに chrome://extensions と入力して Enter キーを押すか、[設定] (右上の3つのドットアイコン) > [拡張機能] > [拡張機能を管理] を選択し、拡張機能ページを表示します。

当拡張機能の古いバージョンがインストール済みの場合は、先に古いバージョンをアンインストールしてください。

「デベロッパーモード」のスイッチをONにします。

「パッケージ化されていない拡張機能を読み込む」をクリックして、当拡張機能をコピーしたフォルダを選択します。

拡張機能のリストに「YAMAP Activity Export Tool」が表示されることを確認します。

ブラウザを再起動します。

#### Microsoft Edge の場合

アドレスバーに edge://extensions と入力して Enter キーを押すか、[設定] (右上の3つのドットアイコン) > [拡張機能] を選択し、拡張機能ページを表示します。

当拡張機能の古いバージョンがインストール済みの場合は、先に古いバージョンをアンインストールしてください。

「開発者モード」のスイッチをONにします。

「展開して読み込み」をクリックして、当拡張機能をコピーしたフォルダを選択します。

拡張機能のリストに「YAMAP Activity Export Tool」が表示されることを確認します。

ブラウザを再起動します。

## 使い方

ブラウザーで YAMAP の活動日記のページを表示し、拡張機能のアイコン（赤い▼アイコン）をクリックすると、「エクスポート実行」というボタンが表示されます。

ボタンがクリックすると、活動日記のデータを取得開始します。処理中はボタンの表記が「エクスポート中...」となり、ボタンの下に進行状況が表示されます。

写真の件数や YAMAP のサーバーの反応速度にもよりますが、取得完了までしばらく時間がかかることがあります。サーバーに負荷をかけないようにするため、各写真取得時に 0.5 秒の待ち時間を設定してあります。

取得が完了すると ZIP ファイルとしてエクスポート（ダウンロード）されます。

エクスポートされるデータには次のものが含まれます。

- テキストデータ
  - 活動日記のタイトル
  - 活動日記の URL
  - 日付
  - 行動日数
  - 都道府県
  - 地図の名前
  - 移動距離
  - 累積標高（上り、下り）
  - 消費カロリー量
  - タグ
  - 詳細（感想文）
  - 写真のメモ (テキスト)
- 写真
  - 画像ファイル (JPEG)

活動日記のデータのダウンロードが完了すると、「GPXファイルをエクスポートしますか?」という確認ダイアログが表示されます。

「OK」をクリックすると GPX ファイルのエクスポートを試みます。ただし、次の場合はエクスポートできません。

- 活動日記に GPX ファイルが添付されていない。
- 非プレミアムユーザーが他ユーザーの活動日記から GPX ファイルのエクスポートを試みる。（他ユーザーの活動日記から GPX ファイルをエクスポートするには、プレミアムプランへの加入が必要です。）

## ライセンス

この拡張機能は、次のライブラリや画像を使用しています。

[JSZip ライブラリ](https://stuk.github.io/jszip/ "JSZip") … JSZip は MIT ライセンスで配布されています。

[Bleach free icon by Freepik - Flaticon](https://www.flaticon.com/free-icon/bleach_481058) … Free for personal and commercial purpose with attribution.

[Arrow free icon created by prinda895 - Flaticon](https://www.flaticon.com/free-icon/arrow_16111384) ... Free for personal and commercial purpose with attribution.

## 動作確認

Browser: Google Chrome 128.0.6613.120 (Official Build) (arm64)

OS: macOS バージョン14.6.1（ビルド23G93）

