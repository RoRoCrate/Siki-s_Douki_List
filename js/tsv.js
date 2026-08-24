/*
 * TSV読み込み共通処理
 *
 * GitHub Pages上のどの階層から呼び出しても
 * リポジトリ直下の data/ego.tsv を読む。
 */

async function loadTSV() {

    /*
     * GitHub Pagesのリポジトリ名
     *
     * https://rorocrate.github.io/Siki-s_Douki_List/
     */

    const basePath = "/Siki-s_Douki_List/";

    const path = `${basePath}data/ego.tsv`;

    const response = await fetch(path, {
        cache: "no-store"
    });

    if (!response.ok) {

        throw new Error(
            `TSVを読み込めませんでした: ${response.status}`
        );

    }

    const text = await response.text();


    /*
     * BOM・改行コードを整理
     */

    const normalized =
        text
            .replace(/^\uFEFF/, "")
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n");


    /*
     * 空行を除外
     */

    const lines =
        normalized
            .split("\n")
            .filter(line => line.trim() !== "");


    if (lines.length < 2) {
        return [];
    }


    /*
     * 1行目をヘッダーとして扱う
     */

    const headers =
        lines[0]
            .split("\t")
            .map(value => value.trim());


    /*
     * 各行をオブジェクト化
     */

    return lines.slice(1).map(line => {

        const values = line.split("\t");

        const row = {};

        headers.forEach((header, index) => {

            let value =
                values[index] ?? "";


            value = value.trim();


            /*
             * TSV内の
             *
             * <br>
             *
             * をHTML改行として利用する
             */

            value =
                value.replace(
                    /\\n/g,
                    "<br>"
                );


            row[header] = value;

        });


        return row;

    });

}


/*
 * HTMLエスケープ
 */

function escapeHTML(value) {

    return String(value ?? "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/*
 * エラー表示
 */

function showError(message) {

    const element =
        document.getElementById("errorMessage");


    if (!element) {
        return;
    }


    element.textContent = message;

    element.classList.remove("hidden");

}
