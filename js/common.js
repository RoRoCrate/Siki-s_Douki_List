async function loadTSV(path = "data/ego.tsv") {

    const response =
        await fetch(path, {
            cache: "no-store"
        });


    if (!response.ok) {

        throw new Error(
            `TSVを読み込めませんでした: ${response.status}`
        );

    }


    const text =
        await response.text();


    const normalized =
        text
            .replace(/^\uFEFF/, "")
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n");


    const lines =
        normalized
            .split("\n")
            .filter(
                line => line.trim() !== ""
            );


    if (lines.length < 2) {
        return [];
    }


    const headers =
        lines[0]
            .split("\t")
            .map(
                value => value.trim()
            );


    return lines.slice(1).map(line => {

        const values =
            line.split("\t");

        const row = {};


        headers.forEach(
            (header, index) => {

                row[header] =
                    (values[index] ?? "")
                        .trim();

            }
        );


        return row;

    });

}


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


function showError(message) {

    const element =
        document.getElementById(
            "errorMessage"
        );


    if (!element) {
        return;
    }


    element.textContent = message;

    element.classList.remove(
        "hidden"
    );

}
