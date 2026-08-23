// ========================================
// TSV読み込み
// ========================================

async function loadTSV(path = "./data/ego.tsv") {

    const response = await fetch(path, {
        cache: "no-store"
    });

    if (!response.ok) {

        throw new Error(
            `TSVを読み込めませんでした: ${response.status}`
        );

    }

    const text = await response.text();


    // BOM・改行コードを整理

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


    // データをオブジェクト化

    return lines.slice(1).map(line => {

        const values = line.split("\t");

        const row = {};


        headers.forEach((header, index) => {

            row[header] =
                (values[index] ?? "").trim();

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

        console.error(message);

        return;

    }


    element.textContent = message;

    element.classList.remove("hidden");

}



// ========================================
// ランクCSS
// ========================================

function getRankClass(rank) {

    const key =
        String(rank || "")
            .trim()
            .toUpperCase();


    switch (key) {

        case "ZAYIN":
            return "rank-zayin";

        case "TETH":
            return "rank-teth";

        case "HE":
            return "rank-he";

        case "WAW":
            return "rank-waw";

        case "ALEPH":
            return "rank-aleph";

        default:
            return "";

    }

}



// ========================================
// TSV文章の整形
// ========================================

function cleanText(value) {

    return String(value ?? "")

        .replace(
            /^[\s\u00a0]+/,
            ""
        )

        .replace(
            /[\s\u00a0]+$/,
            ""
        )

        .replace(
            /<br\s*\/?>[\s\u00a0]+/gi,
            "<br>"
        )

        .replace(
            /[\s\u00a0]+<br\s*\/?>/gi,
            "<br>"
        )

        .trim();

}
