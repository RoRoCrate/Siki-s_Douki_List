document.addEventListener("DOMContentLoaded", async () => {

    const detail = document.getElementById("detail");

    if (!detail) {
        return;
    }

    let id = detail.dataset.egoId;

    if (!id) {
        const params =
            new URLSearchParams(window.location.search);

        id = params.get("id");
    }

    if (!id) {
        showError("E.G.OのIDが指定されていません。");
        return;
    }

    const params =
        new URLSearchParams(window.location.search);

    const isShared =
        params.get("shared") === "1";

    try {

        const egoData = await loadTSV();

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


function cleanText(value) {

    return String(value ?? "")

        .replace(/^[\s\u00a0]+/, "")
        .replace(/[\s\u00a0]+$/, "")

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


async function shareEGO(ego) {

    const url =
        window.location.origin +
        window.location.pathname +
        "?shared=1";

    const title =
        `[${ego["ランク"]}]${ego["名称"]}`;

    try {

        if (navigator.share) {

            await navigator.share({
                title: title,
                text: title,
                url: url
            });

            return;
        }

        await navigator.clipboard.writeText(url);

        alert("共有用リンクをコピーしました。");

    } catch (error) {

        if (error.name !== "AbortError") {

            console.error(
                "共有に失敗しました。",
                error
            );

        }

    }

}


function renderDetail(ego, isShared = false) {

    document.title =
        `[${ego["ランク"]}]${ego["名称"]} | E.G.O DATABASE`;

    const detail =
        document.getElementById("detail");

    const rankClass =
        getRankClass(ego["ランク"]);


    detail.innerHTML = `

        <article class="detail-card">

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

                <button
                    type="button"
                    class="share-button"
                    id="shareButton"
                >
                    ↗ 共有
                </button>

            </header>


            <section class="passive-container">

                <div class="passive-item">

                    <h3>E.G.Oパッシブ</h3>

                    <p>
                        ${cleanText(
                            ego["E.G.Oパッシブ"]
                        )}
                    </p>

                </div>


                <div class="passive-item">

                    <h3>発動条件</h3>

                    <p>
                        ${cleanText(
                            ego["発動条件"]
                        )}
                    </p>

                </div>


                <div class="passive-always">

                    <h3>常時効果</h3>

                    <p>
                        ${cleanText(
                            ego["常時効果"]
                        )}
                    </p>

                </div>


                <div class="passive-item">

                    <h3>効果</h3>

                    <p>
                        ${cleanText(
                            ego["効果"]
                        )}
                    </p>

                </div>

            </section>


            <section class="two-column">

                <div class="skill-box">

                    <h3>覚醒スキル</h3>

                    <p>
                        ${cleanText(
                            ego["覚醒スキル"]
                        )}
                    </p>

                </div>


                <div class="skill-box">

                    <h3>浸食スキル</h3>

                    <p>
                        ${cleanText(
                            ego["浸食スキル"]
                        )}
                    </p>

                </div>

            </section>


            <section class="unique-section">

                <h3>固有</h3>

                <p>
                    ${cleanText(
                        ego["固有"]
                    )}
                </p>

            </section>

        </article>

    `;


    const shareButton =
        document.getElementById("shareButton");

    if (shareButton) {

        shareButton.addEventListener(
            "click",
            () => shareEGO(ego)
        );

    }


    /*
     * 共有リンクの場合は
     * 「一覧へ戻る」を消す
     */

    if (isShared) {

        const backLink =
            document.querySelector(".back-link");

        if (backLink) {
            backLink.remove();
        }

    }

}
