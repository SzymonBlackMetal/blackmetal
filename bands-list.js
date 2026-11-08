(function () {
    const grid = document.getElementById("bands-grid");
    const empty = document.getElementById("bands-empty");
    const searchInput = document.getElementById("bands-search");
    const countrySelect = document.getElementById("bands-country");
    const genreSelect = document.getElementById("bands-genre");
    if (!grid) return;

    const artists = window.allArtists || [];

    function uniqueSorted(values) {
        return [...new Set(values.filter(Boolean))].sort((a, b) =>
            a.localeCompare(b, "pl")
        );
    }

    const countries = uniqueSorted(artists.map((a) => a.info && a.info.country));
    const genres = uniqueSorted(
        artists.flatMap((a) => {
            const g = (a.info && a.info.genre) || "";
            return g.split(/[/|,]/).map((s) => s.trim()).filter(Boolean);
        })
    );

    countries.forEach((c) => {
        const o = document.createElement("option");
        o.value = c;
        o.textContent = c;
        countrySelect.appendChild(o);
    });
    genres.forEach((g) => {
        const o = document.createElement("option");
        o.value = g;
        o.textContent = g;
        genreSelect.appendChild(o);
    });

    function matches(artist, q, country, genre) {
        if (country && (!artist.info || artist.info.country !== country)) return false;
        if (genre) {
            const g = ((artist.info && artist.info.genre) || "").toLowerCase();
            if (!g.includes(genre.toLowerCase())) return false;
        }
        if (!q) return true;
        const hay = [
            artist.name,
            artist.info && artist.info.country,
            artist.info && artist.info.location,
            artist.info && artist.info.genre,
            artist.info && artist.info.founded
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
        return hay.includes(q);
    }

    function albumCount(artist) {
        return (artist.albums || []).length;
    }

    function avgRating(artist) {
        const ratings = (artist.albums || [])
            .map((a) => parseFloat(a.rating) || 0)
            .filter((r) => r > 0);
        if (!ratings.length) return 0;
        return ratings.reduce((s, r) => s + r, 0) / ratings.length;
    }

    function render() {
        const q = (searchInput.value || "").trim().toLowerCase();
        const country = countrySelect.value;
        const genre = genreSelect.value;

        const list = artists
            .filter((a) => matches(a, q, country, genre))
            .sort((a, b) => a.name.localeCompare(b.name, "pl"));

        grid.innerHTML = "";
        empty.hidden = list.length > 0;

        list.forEach((artist) => {
            const card = document.createElement("a");
            card.className = "band-card";
            card.href = "artist.html?name=" + encodeURIComponent(artist.name);

            const imgSrc = (artist.info && artist.info.image) || "";
            const country = (artist.info && artist.info.country) || "";
            const genre = (artist.info && artist.info.genre) || "";
            const founded = (artist.info && artist.info.founded) || "";
            const avg = avgRating(artist);
            const count = albumCount(artist);

            card.innerHTML = `
                <div class="band-card-image">
                    <img src="${imgSrc}" alt="${artist.name}" loading="lazy"
                         onerror="this.parentElement.classList.add('image-missing'); this.style.display='none'">
                </div>
                <div class="band-card-body">
                    <div class="band-card-name">${artist.name}</div>
                    <div class="band-card-meta">${[country, genre].filter(Boolean).join(" · ")}</div>
                    <div class="band-card-stats">
                        <span>${founded ? "od " + founded : ""}</span>
                        <span>${count} alb.</span>
                        <span>${avg ? avg.toFixed(1) : "—"}</span>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    searchInput.addEventListener("input", render);
    countrySelect.addEventListener("change", render);
    genreSelect.addEventListener("change", render);
    render();
})();
