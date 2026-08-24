// ========================================
// TSV読み込み共通処理
// ========================================

async function loadTSV(path = "/Siki-s_Douki_List/data/ego.tsv") {

    const response = await fetch(path, {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error(
            `TSVを読み込めませんでした: ${response.status}`
        );
    }

    const text = await response.text();


    // ========================================
    // 改行コード・BOMを正規化
    // ========================================

    const normalized =
        text
            .replace(/^\uFEFF/, "")
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n");


    // ========================================
    // 行ごとに分割
    // ========================================

    const lines =
        normalized
            .split("\n")
            .filter(line => line.trim() !== "");


    if (lines.length < 2) {
        return [];
    }


    // ========================================
    // ヘッダー取得
    // ========================================

    const headers =
        lines[0]
            .split("\t")
            .map(value => value.trim());


    // ========================================
    // データ変換
    // ========================================

    return lines.slice(1).map(line => {

        const values = line.split("\t");

        const row = {};


        headers.forEach((header, index) => {

            let value = values[index] ?? "";


            // 前後の空白を削除
            value = value.trim();


            /*
             * TSV内の
             *
             * \n
             *
             * を
             *
             * <br>
             *
             * に変換
             */

            value = value.replace(/\\n/g, "<br>");


            row[header] = value;

        });


        return row;

    });

}


// ========================================
// HTMLエスケープ
// ========================================

function escapeHTML(value) {

    return String(value ?? "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


// ========================================
// エラー表示
// ========================================

function showError(message) {

    const element =
        document.getElementById("errorMessage");


    if (!element) {
        return;
    }


    element.textContent = message;

    element.classList.remove("hidden");

}
