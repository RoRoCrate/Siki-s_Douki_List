const fs = require("fs");
const path = require("path");

const TSV_PATH = path.join(__dirname, "..", "data", "ego.tsv");
const OUTPUT_DIR = path.join(__dirname, "..", "ego");


// =========================
// TSV読み込み
// =========================

function loadTSV() {
    const text = fs.readFileSync(TSV_PATH, "utf8")
        .replace(/^\uFEFF/, "")
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n");

    const lines = text
        .split("\n")
        .filter(line => line.trim() !== "");

    if (lines.length < 2) {
        return [];
    }

    const headers = lines[0]
        .split("\t")
        .map(value => value.trim());

    return lines.slice(1).map(line => {
        const values = line.split("\t");
        const row = {};

        headers.forEach((header, index) => {
            row[header] = (values[index] ?? "").trim();
        });

        return row;
    });
}


// =========================
// HTMLエスケープ
// =========================

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =========================
// ランク
// =========================

function getRankClass(rank) {

    const key = String(rank || "")
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


// =========================
// E.G.Oページ生成
// =========================

function generatePage(ego) {

    const id = escapeHTML(ego["ID"]);
    const rank = escapeHTML(ego["ランク"]);
    const name = escapeHTML(ego["名称"]);

    const rankClass = getRankClass(ego["ランク"]);

    const title = `[${ego["ランク"]}] ${ego["名称"]}`;

    const description =
        `E.G.O DATABASE | ${ego["ランク"]} | ${ego["名称"]}`;


    return `<!DOCTYPE html>
<html lang="ja">

<head>

<meta charset="UTF-8">

<meta name="viewport"
      content="width=device-width, initial-scale=1.0">

<title>${escapeHTML(title)} | E.G.O DATABASE</title>


<!-- =========================
     Discord / OGP
========================= -->

<meta property="og:type"
      content="website">

<meta property="og:title"
      content="${escapeHTML(title)}">

<meta property="og:description"
      content="${escapeHTML(description)}">

<meta property="og:site_name"
      content="E.G.O DATABASE">


<!-- Twitter等 -->

<meta name="twitter:card"
      content="summary">

<meta name="twitter:title"
      content="${escapeHTML(title)}">

<meta name="twitter:description"
      content="${escapeHTML(description)}">


<!-- 共通CSS -->

<link rel="stylesheet"
      href="../../css/style.css">

</head>


<body>

<header class="site-header">

    <div>

        <p class="eyebrow">
            E.G.O DATABASE
        </p>

        <h1>
            E.G.O DATABASE
        </h1>

    </div>

</header>


<main class="container">

    <a
        class="back-link"
        href="../../index.html"
    >
        ← E.G.O一覧へ戻る
    </a>


    <div
        id="errorMessage"
        class="message error hidden"
    ></div>


    <div
        id="detail"
        data-ego-id="${id}"
    ></div>

</main>


<script src="../../js/common.js"></script>

<script src="../../js/detail.js"></script>

</body>

</html>`;
}


// =========================
// 古いページを削除
// =========================

if (fs.existsSync(OUTPUT_DIR)) {

    fs.rmSync(OUTPUT_DIR, {
        recursive: true,
        force: true
    });

}

fs.mkdirSync(OUTPUT_DIR, {
    recursive: true
});


// =========================
// TSV → HTML
// =========================

const egos = loadTSV();

console.log(`E.G.O ${egos.length}件を生成します。`);


for (const ego of egos) {

    const id = String(ego["ID"] || "").trim();

    if (!id) {
        console.warn("IDがない行をスキップしました。");
        continue;
    }


    const outputDir = path.join(
        OUTPUT_DIR,
        id
    );


    fs.mkdirSync(outputDir, {
        recursive: true
    });


    const outputPath = path.join(
        outputDir,
        "index.html"
    );


    fs.writeFileSync(
        outputPath,
        generatePage(ego),
        "utf8"
    );


    console.log(
        `生成: ego/${id}/index.html`
    );
}


console.log("生成完了！");