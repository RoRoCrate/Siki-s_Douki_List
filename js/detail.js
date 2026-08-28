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

    try {

        await navigator.clipboard.writeText(url);

        alert("共有用リンクをコピーしました。");

    } catch (error) {

        console.error(
            "リンクのコピーに失敗しました。",
            error
        );

        /*
         * clipboard APIが使えない場合の予備処理
         */
        try {

            const textarea =
                document.createElement("textarea");

            textarea.value = url;

            textarea.style.position = "fixed";
            textarea.style.opacity = "0";

            document.body.appendChild(textarea);

            textarea.focus();
            textarea.select();

            document.execCommand("copy");

            textarea.remove();

            alert("共有用リンクをコピーしました。");

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
