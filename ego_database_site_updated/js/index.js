let egoData = [];

document.addEventListener("DOMContentLoaded", async () => {
    try {
        egoData = await loadTSV();
        setupRankFilter();
        setupSearch();
        renderList();
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

function setupRankFilter() {
    const select = document.getElementById("rank");
    const ranks = [...new Set(egoData.map(ego => ego["ランク"]).filter(Boolean))];

    const order = ["ZAYIN", "TETH", "HE", "WAW", "ALEPH"];

    ranks.sort((a, b) => {
        const ai = order.indexOf(a.toUpperCase());
        const bi = order.indexOf(b.toUpperCase());

        if (ai === -1 && bi === -1) return a.localeCompare(b);
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
    });

    for (const rank of ranks) {
        const option = document.createElement("option");
        option.value = rank;
        option.textContent = rank;
        select.appendChild(option);
    }
}

function setupSearch() {
    document.getElementById("keyword").addEventListener("input", renderList);
    document.getElementById("rank").addEventListener("change", renderList);
}

function renderList() {
    const keyword = document.getElementById("keyword").value.trim().toLowerCase();
    const rank = document.getElementById("rank").value;
    const list = document.getElementById("egoList");

    const filtered = egoData.filter(ego => {
        const matchesRank = !rank || ego["ランク"] === rank;

        const searchable = Object.values(ego)
            .join(" ")
            .toLowerCase();

        const matchesKeyword = !keyword || searchable.includes(keyword);

        return matchesRank && matchesKeyword;
    });

    document.getElementById("resultCount").textContent = `${filtered.length}件`;

    if (filtered.length === 0) {
        list.innerHTML = `<div class="message">該当するE.G.Oはありません。</div>`;
        return;
    }

    list.innerHTML = filtered.map(ego => {
        const rankClass = getRankClass(ego["ランク"]);

        return `
            <a class="ego-card" href="detail.html?id=${encodeURIComponent(ego["ID"])}">
                <div class="ego-card-top">
                    <span class="rank ${rankClass}">${escapeHTML(ego["ランク"])}</span>
                    <p class="ego-name">${escapeHTML(ego["名称"])}</p>
                </div>
                <p class="resource">必要資源：${escapeHTML(ego["必要資源"])}</p>
            </a>
        `;
    }).join("");
}
