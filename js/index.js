document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const keywordInput =
            document.getElementById("keyword");

        const rankSelect =
            document.getElementById("rank");

        const egoList =
            document.getElementById("egoList");

        const resultCount =
            document.getElementById("resultCount");


        let egoData = [];


        // ========================================
        // TSV読み込み
        // ========================================

        try {

            egoData =
                await loadTSV();

        } catch (error) {

            console.error(error);

            showError(
                "E.G.Oデータを読み込めませんでした。"
            );

            return;

        }


        // ========================================
        // ランク選択肢
        // ========================================

        createRankOptions(
            egoData,
            rankSelect
        );


        // ========================================
        // 初期表示
        // ========================================

        renderList(
            egoData,
            egoList,
            resultCount
        );


        // ========================================
        // 検索
        // ========================================

        keywordInput.addEventListener(
            "input",
            updateList
        );


        rankSelect.addEventListener(
            "change",
            updateList
        );


        function updateList() {

            const keyword =
                keywordInput.value
                    .trim()
                    .toLowerCase();


            const selectedRank =
                rankSelect.value
                    .trim()
                    .toUpperCase();


            const filtered =
                egoData.filter(
                    ego => {

                        const rank =
                            String(
                                ego["ランク"] || ""
                            )
                                .trim()
                                .toUpperCase();


                        if (
                            selectedRank &&
                            rank !== selectedRank
                        ) {

                            return false;

                        }


                        if (!keyword) {

                            return true;

                        }


                        return Object.values(ego)
                            .some(
                                value =>
                                    String(
                                        value ?? ""
                                    )
                                        .toLowerCase()
                                        .includes(
                                            keyword
                                        )
                            );

                    }
                );


            renderList(
                filtered,
                egoList,
                resultCount
            );

        }

    }
);


// ========================================
// ランク選択肢
// ========================================

function createRankOptions(
    data,
    select
) {

    const ranks = [
        "ZAYIN",
        "TETH",
        "HE",
        "WAW",
        "ALEPH"
    ];


    ranks.forEach(
        rank => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                rank;


            option.textContent =
                rank;


            select.appendChild(
                option
            );

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
// E.G.O一覧
// ========================================

function renderList(
    data,
    list,
    count
) {

    count.textContent =
        `${data.length}件`;


    if (data.length === 0) {

        list.innerHTML = `
            <p class="message">
                該当するE.G.Oがありません。
            </p>
        `;

        return;

    }


    list.innerHTML =
        data.map(
            ego => {

                const id =
                    encodeURIComponent(
                        String(
                            ego["ID"] || ""
                        ).trim()
                    );


                const rank =
                    String(
                        ego["ランク"] || ""
                    ).trim();


                const name =
                    String(
                        ego["名称"] || ""
                    ).trim();


                const resource =
                    String(
                        ego["必要資源"] || ""
                    ).trim();


                const rankClass =
                    getRankClass(rank);


                return `
                    <a
                        class="ego-card"
                        href="ego/${id}/"
                    >

                        <div class="ego-card-top">

                            <span
                                class="rank ${rankClass}"
                            >
                                ${escapeHTML(rank)}
                            </span>

                            <h3 class="ego-name">
                                ${escapeHTML(name)}
                            </h3>

                        </div>

                        <p class="resource">
                            必要資源：
                            ${escapeHTML(resource)}
                        </p>

                    </a>
                `;

            }
        ).join("");

}
