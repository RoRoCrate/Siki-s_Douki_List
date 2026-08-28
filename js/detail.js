```javascript
document.addEventListener("DOMContentLoaded", async () => {

    const detail = document.getElementById("detail");

    if (!detail) {
        return;
    }


    /*
     * E.G.O IDを取得
     *
     * 個別生成ページ：
     * <div id="detail" data-ego-id="ego001">
     *
     * 従来のURL：
     * detail.html?id=ego001
     */

    let id = detail.dataset.egoId;

    if (!id) {

        const params =
            new URLSearchParams(window.location.search);

        id = params.get("id");

    }


    if (!id) {

        showError(
            "E.G.OのIDが指定されていません。"
        );

        return;
    }


    /*
     * 共有リンクかどうか
     *
     * ?shared=1
     */

    const params =
        new URLSearchParams(window.location.search);

    const isShared =
        params.get("shared") === "1";


    try {

        const egoData =
            await loadTSV();


        const ego =
            egoData.find(
                item => item["ID"] === id
            );


        if (!ego) {

            showError(
                `ID「${id}」のE.G.Oが見つかりません。`
            );

            return;
        }


        renderDetail(ego, isShared);


    } catch (error) {

        console.error(error);

        showError(
            "E.G.Oデータを読み込めませんでした。"
        );

    }

});



/*
 * ランクごとのCSSクラス
 */

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



/*
 * TSVの文章を表示用に整える
 *
 * <br> はHTMLの改行として使用。
 *
 * 文章の先頭・末尾にある
 * 改行や空白を削除。
 */

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



/*
 * 共有用リンクをクリップボードへコピー
 */

async function shareEGO(ego) {

    /*
     * 現在のページURLを取得
     *
     * 例：
     * https://rorocrate.github.io/
     * Siki-s_Douki_List/
     * ego/ego001/
     */

    const url =
        window.location.origin +
        window.location.pathname +
        "?shared=1";


    try {

        /*
         * クリップボードへコピー
         */

        await navigator.clipboard.writeText(url);


        alert(
            "共有用リンクをコピーしました。"
        );


    } catch (error) {

        console.error(
            "クリップボードへのコピーに失敗しました。",
            error
        );


        /*
         * clipboard APIが使用できない環境向け
         * フォールバック処理
         */

        try {

            const textarea =
                document.createElement("textarea");


            textarea.value = url;


            textarea.style.position =
                "fixed";

            textarea.style.left =
                "-9999px";


            document.body.appendChild(
                textarea
            );


            textarea.focus();
            textarea.select();


            const success =
                document.execCommand("copy");


            textarea.remove();


            if (success) {

                alert(
                    "共有用リンクをコピーしました。"
                );

            } else {

                alert(
                    "リンクのコピーに失敗しました。\n\n" +
                    url
                );

            }


        } catch (fallbackError) {

            console.error(
                "コピーに失敗しました。",
                fallbackError
            );


            alert(
                "リンクのコピーに失敗しました。\n\n" +
                url
            );

        }

    }

}



/*
 * E.G.O詳細ページを表示
 */

function renderDetail(ego, isShared = false) {

    /*
     * ページタイトル
     */

    document.title =
        `[${ego["ランク"]}]${ego["名称"]} | E.G.O DATABASE`;


    const detail =
        document.getElementById("detail");


    const rankClass =
        getRankClass(ego["ランク"]);



    /*
     * 共有ボタン
     *
     * 通常ページだけ表示する。
     *
     * shared=1 の場合は表示しない。
     */

    const shareButtonHTML =
        isShared
            ? ""
            : `
                <button
                    type="button"
                    class="share-button"
                    id="shareButton"
                >
                    ↗ 共有
                </button>
            `;



    detail.innerHTML = `

        <article class="detail-card">


            <!-- =========================
                 タイトル
            ========================= -->

            <header class="detail-title">


                <span class="rank ${rankClass}">
                    ${escapeHTML(ego["ランク"])}
                </span>


                <h2>
                    ${escapeHTML(ego["名称"])}
                </h2>


                <p class="detail-resource">
                    必要資源：
                    ${escapeHTML(ego["必要資源"])}
                </p>


                ${shareButtonHTML}


            </header>



            <!-- =========================
                 E.G.Oパッシブ
            ========================= -->

            <section class="passive-container">


                <div class="passive-item">

                    <h3>
                        E.G.Oパッシブ
                    </h3>

                    <p>
                        ${cleanText(
                            ego["E.G.Oパッシブ"]
                        )}
                    </p>

                </div>



                <div class="passive-item">

                    <h3>
                        発動条件
                    </h3>

                    <p>
                        ${cleanText(
                            ego["発動条件"]
                        )}
                    </p>

                </div>



                <!-- 常時効果だけ内部枠 -->

                <div class="passive-always">

                    <h3>
                        常時効果
                    </h3>

                    <p>
                        ${cleanText(
                            ego["常時効果"]
                        )}
                    </p>

                </div>



                <div class="passive-item">

                    <h3>
                        効果
                    </h3>

                    <p>
                        ${cleanText(
                            ego["効果"]
                        )}
                    </p>

                </div>


            </section>



            <!-- =========================
                 覚醒・浸食スキル
            ========================= -->

            <section class="two-column">


                <div class="skill-box">

                    <h3>
                        覚醒スキル
                    </h3>

                    <p>
                        ${cleanText(
                            ego["覚醒スキル"]
                        )}
                    </p>

                </div>



                <div class="skill-box">

                    <h3>
                        浸食スキル
                    </h3>

                    <p>
                        ${cleanText(
                            ego["浸食スキル"]
                        )}
                    </p>

                </div>


            </section>



            <!-- =========================
                 固有
            ========================= -->

            <section class="unique-section">

                <h3>
                    固有
                </h3>

                <p>
                    ${cleanText(
                        ego["固有"]
                    )}
                </p>

            </section>


        </article>

    `;



    /*
     * 通常ページの場合だけ
     * 共有ボタンに処理を設定
     */

    if (!isShared) {

        const shareButton =
            document.getElementById(
                "shareButton"
            );


        if (shareButton) {

            shareButton.addEventListener(
                "click",
                () => shareEGO(ego)
            );

        }

    }



    /*
     * 共有リンクの場合
     *
     * 「E.G.O一覧へ戻る」を削除
     */

    if (isShared) {

        const backLink =
            document.querySelector(
                ".back-link"
            );


        if (backLink) {

            backLink.remove();

        }

    }

}
```
