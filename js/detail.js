document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        showError("E.G.OのIDが指定されていません。");
        return;
    }

    try {
        const egoData = await loadTSV();
        const ego = egoData.find(item => item["ID"] === id);

        if (!ego) {
            showError(`ID「${id}」のE.G.Oが見つかりません。`);
            return;
        }

        renderDetail(ego);
    } catch (error) {
        console.error(error);
        showError("E.G.Oデータを読み込めませんでした。");
    }
});

function getRankClass(rank) {
    const key = String(rank || "").trim().toUpperCase();

    switch (key) {
        case "ZAYIN": return "rank-zayin";
        case "TETH": return "rank-teth";
        case "HE": return "rank-he";
        case "WAW": return "rank-waw";
        case "ALEPH": return "rank-aleph";
        default: return "";
    }
}

function renderDetail(ego) {
    document.title = `${ego["名称"]} | E.G.O DATABASE`;

    const detail = document.getElementById("detail");
    const rankClass = getRankClass(ego["ランク"]);

    detail.innerHTML = `
        <article class="detail-card">

            <header class="detail-title">
                <span class="rank ${rankClass}">
                    ${escapeHTML(ego["ランク"])}
                </span>

                <h2>${escapeHTML(ego["名称"])}</h2>

                <p class="detail-resource">
                    必要資源：${escapeHTML(ego["必要資源"])}
                </p>
            </header>

            <section class="detail-section">
                <h3>E.G.Oパッシブ</h3>
                <p>${ego["E.G.Oパッシブ"]}</p>
            </section>

            <section class="detail-section">
                <h3>発動条件</h3>
                <p>${escapeHTML(ego["発動条件"])}</p>
            </section>

            <section class="detail-section">
                <h3>常時効果</h3>
                <p>${ego["常時効果"]}</p>
            </section>

            <section class="detail-section">
                <h3>効果</h3>
                <p>${ego["効果"]}</p>
            </section>

            <section class="two-column">

                <div class="skill-box">
                    <h3>覚醒スキル</h3>
                    <p>${ego["覚醒スキル"]}</p>
                </div>

                <div class="skill-box">
                    <h3>浸食スキル</h3>
                    <p>${ego["浸食スキル"]}</p>
                </div>

            </section>

            <section class="detail-section">
                <h3>固有</h3>
                <p>${ego["固有"]}</p>
            </section>

        </article>
    `;
}
