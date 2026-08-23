E.G.O DATABASE

■ ファイル構成
index.html       E.G.O一覧・検索
detail.html      個別E.G.O詳細
css/style.css    デザイン
js/tsv.js        TSV読み込み共通処理
js/index.js      一覧ページ処理
js/detail.js     詳細ページ処理
data/ego.tsv     E.G.Oデータ本体

■ TSVの編集
data/ego.tsvをExcel、Googleスプレッドシート等で編集できます。
1行目の列名は変更しないでください。

IDはE.G.Oごとに必ず固有の値にしてください。

■ 個別ページURL
detail.html?id=ego001

例：
https://example.github.io/サイト名/detail.html?id=ego001

■ GitHub Pagesで使用する場合
fetch()でTSVを読み込むため、HTMLファイルを直接ダブルクリックして開くより、
GitHub Pages等のWebサーバー上で実行することを推奨します。

■ TSVの注意
セル内に改行を入れる場合は、この簡易TSV読み込み方式では正しく扱えません。
複数行の文章は、1セル内に入れず「。 」などで繋げるか、後からCSV/JSON等の形式へ変更してください。
