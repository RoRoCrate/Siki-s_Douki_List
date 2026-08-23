// ========================================
// TSV読み込み・共通処理
// ========================================

async function loadTSV(path = "data/ego.tsv") {

    const response = await fetch(
        path,
        {
            cache: "no-store"
        }
    );


    // ========================================
    // TSV読み込み失敗
    // ========================================

    if (!response.ok) {

        throw new Error(
            `TSVを読み込めませんでした: ${response.status}`
        );

    }


    // ========================================
    // TSV本文取得
    // ========================================

    const text =
        await response.text();


    // ========================================
    // 改行・BOMを正規化
    // ========================================

    const normalized =
        text
            // UTF-8 BOMを削除
            .replace(/^\uFEFF/, "")

            // Windows改行
            .replace(/\r\n/g, "\n")

            // Mac系改行
            .replace(/\r/g, "\n");


    // ========================================
    // 行ごとに分割
    // ========================================

    const lines =
        normalized
            .split("\n")
            .filter(
                line => line.trim() !== ""
            );


    // データがない場合

    if (lines.length < 2) {
        return [];
    }


    // ========================================
    // ヘッダー取得
    // ========================================

    const headers =
        lines[0]
            .split("\t")
            .map(
                value => value.trim()
            );


    // ========================================
    // 各データをオブジェクト化
    // ========================================

    return lines
        .slice(1)
        .map(line => {

            const values =
                line.split("\t");


            const row = {};


            headers.forEach(
                (header, index) => {

                    let value =
                        values[index] ?? "";


                    // 前後の空白を削除

                    value =
                        value.trim();


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

                    value =
                        value.replace(
                            /\\n/g,
                            "<br>"
                        );


                    /*
                     * <br>
                     * <BR>
                     * <br/>
                     * <br />
                     *
                     * などをそのまま使用可能
                     */

                    row[header] =
                        value;

                }
            );


            return row;

        });

}


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
// エラー表示
// ========================================

function showError(message) {

    const element =
        document.getElementById(
            "errorMessage"
        );


    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.classList.remove(
        "hidden"
    );

}
