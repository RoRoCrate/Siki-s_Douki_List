const fs = require("fs");
const path = require("path");


// ========================================
// パス
// ========================================

const TSV_PATH =
    path.join(
        __dirname,
        "..",
        "data",
        "ego.tsv"
    );


const OUTPUT_DIR =
    path.join(
        __dirname,
        "..",
        "ego"
    );


// ========================================
// HTMLエスケープ
// ========================================

function escapeHTML(value) {

    return String(value ?? "")

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ========================================
// TSV読み込み
// ========================================

function loadTSV() {

    const text =
        fs.readFileSync(
            TSV_PATH,
            "utf8"
        )

        .replace(
            /^\uFEFF/,
            ""
        )

        .replace(
            /\r\n/g,
            "\n"
        )

        .replace(
            /\r/g,
            "\n"
        );


    const lines =
        text
            .split("\n")
            .filter(
                line =>
                    line.trim() !== ""
            );


    if (lines.length < 2) {

        return [];

    }


    const headers =
        lines[0]
            .split("\t")
            .map(
                value =>
                    value.trim()
            );


    console.log(
        "TSV headers:",
        headers
    );


    return lines
        .slice(1)
        .map(
            line => {

                const values =
                    line.split("\t");


                const row = {};


                headers.forEach(
                    (
                        header,
                        index
                    ) => {

                        row[header] =
                            (
                                values[index] ??
                                ""
                            ).trim();

                    }
                );


                return row;

            }
        );

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
// E.G.Oページ生成
// ========================================

function generatePage(ego) {

    const id =
        String(
            ego["ID"] || ""
        ).trim();


    const rank =
        String(
            ego["ランク"] || ""
        ).trim();


    const name =
        String(
            ego["名称"] || ""
        ).trim();


    if (!id) {

        console.warn(
            "IDがない行をスキップしました。"
        );

        return null;

    }


    if (!rank) {

        console.warn(
            `ID ${id}: ランクがありません。`
        );

    }


    if (!name) {

        console.warn(
            `ID ${id}: 名称がありません。`
        );

    }


    const rankClass =
        getRankClass(rank);


    // Discord / OGP表示用パラメータ
    const ogpTitle =
        `[${rank}] ${name}`;


    const ogpDescription =
        `E.G.O DATABASE | ランク: ${rank} | 名称: ${name}`;


    const ogpUrl =
        `https://rorocrate.github.io/Siki-s_Douki_List/ego/${id}/`;


    return `<!DOCTYPE html>
<html lang="ja">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>


<title>
${escapeHTML(ogpTitle)} | E.G.O DATABASE
</title>


<!-- =========================
     Discord / OGP (SNS共有用)
========================= -->

<meta
    property="og:type"
    content="website"
>


<meta
    property="og:title"
    content="${escapeHTML(ogpTitle)}"
>


<meta
    property="og:description"
    content="${escapeHTML(ogpDescription)}"
>


<meta
    property="og:url"
    content="${escapeHTML(ogpUrl)}"
>


<meta
    property="og:site_name"
    content="E.G.O DATABASE"
>


<meta
    name="twitter:card"
    content="summary"
>


<meta
    name="twitter:title"
    content="${escapeHTML(ogpTitle)}"
>


<meta
    name="twitter:description"
    content="${escapeHTML(ogpDescription)}"
>


<link
    rel="stylesheet"
    href="../../css/style.css"
>


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
        data-ego-id="${escapeHTML(id)}"
    ></div>


</main>


<script src="../../js/tsv.js"></script>

<script src="../../js/detail.js"></script>


</body>

</html>`;

}


// ========================================
// 既存生成ページ削除
// ========================================

if (
    fs.existsSync(
        OUTPUT_DIR
    )
) {

    fs.rmSync(
        OUTPUT_DIR,
        {
            recursive: true,
            force: true
        }
    );

}


fs.mkdirSync(
    OUTPUT_DIR,
    {
        recursive: true
    }
);


// ========================================
// TSV読み込み
// ========================================

const egos =
    loadTSV();


console.log(
    `E.G.O ${egos.length}件を生成します。`
);


// ========================================
// ページ生成
// ========================================

for (
    const ego of egos
) {

    const id =
        String(
            ego["ID"] || ""
        ).trim();


    if (!id) {

        continue;

    }


    const outputDir =
        path.join(
            OUTPUT_DIR,
            id
        );


    fs.mkdirSync(
        outputDir,
        {
            recursive: true
        }
    );


    const outputPath =
        path.join(
            outputDir,
            "index.html"
        );


    const html =
        generatePage(ego);


    if (!html) {

        continue;

    }


    fs.writeFileSync(
        outputPath,
        html,
        "utf8"
    );


    console.log(
        `生成: ego/${id}/index.html`
    );

}


console.log(
    "E.G.Oページ生成完了！"
);