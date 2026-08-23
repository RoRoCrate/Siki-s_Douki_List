// TSVを読み込む
async function loadTSV(path = "data/ego.tsv") {

    const response = await fetch(path, {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error(
            `TSVを読み込めませんでした: ${response.status}`
        );
    }

    const text = await response.text();

    // BOM・改行コードを統一
    const normalized = text
        .replace(/^\uFEFF/, "")
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n");

    const lines = normalized
        .split("\n")
        .filter(line => line.trim() !== "");

    if (lines.length < 2) {
        return [];
    }

    // 1行目をヘッダーとして取得
    const headers = lines[0]
        .split("\t")
        .map(value => value.trim());

    return lines.slice(1).map(line => {

        const values = line.split("\t");
        const row = {};

        headers.forEach((header, index) => {

            let value = values[index] ?? "";

            /*
             * =========================
             * データの整形
             * =========================
             */

            // 前後の空白を削除
            value = value.trim();

            // &#x20; / &#32; / &nbsp; を削除
            value = value
                .replace(/&#x20;/gi, "")
                .replace(/&#32;/gi, "")
                .replace(/&nbsp;/gi, "");

            // <br>の表記を統一
            value = value.replace(
                /<br\s*\/?>/gi,
                "<br>"
            );

            /*
             * <br>の直後に大量の空白がある場合
             *
             * <br>
             *          貫通：傲慢
             *
             * ↓
             *
             * <br>貫通：傲慢
             */

            value = value.replace(
                /<br>\s+/gi,
                "<br>"
            );

            // 先頭の<br>と空白を削除
            value = value.replace(
                /^(?:\s|<br>)+/gi,
                ""
            );

            // 末尾の<br>と空白を削除
            value = value.replace(
                /(?:\s|<br>)+$/gi,
                ""
            );

            row[header] = value;
        });

        return row;
    });
}


// HTMLエスケープ
function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// エラー表示
function showError(message) {

    const element =
        document.getElementById("errorMessage");

    if (!element) {
        return;
    }

    element.textContent = message;
    element.classList.remove("hidden");
}
