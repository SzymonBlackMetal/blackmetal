/* =========================================================
   RANKING ALBUMÓW + UTWORÓW + WYSZUKIWARKA + FILTRY
========================================================= */

(function () {
    const ranking = document.querySelector("#ranking");
    const tracksRanking = document.querySelector("#tracks-ranking");
    const loadMoreWrap = document.querySelector("#load-more-wrap");
    const loadMoreBtn = document.querySelector("#load-more");
    const emptyState = document.querySelector("#empty-state");
    const searchInput = document.querySelector("#search");
    const filterCountry = document.querySelector("#filter-country");
    const filterGenre = document.querySelector("#filter-genre");
    const filterRating = document.querySelector("#filter-rating");
    const filterYear = document.querySelector("#filter-year");
    const filtersReset = document.querySelector("#filters-reset");

    if (!ranking && !tracksRanking) return;

    const artists = window.allArtists || [];
    const PAGE_SIZE = 30;

    /* ---------- helpers ---------- */
    function getRatingClass(rating) {
        if (rating === 10) return "rating-10";
        if (rating >= 7) return "rating-high";
        if (rating >= 4) return "rating-medium";
        return "rating-low";
    }

    function uniqueSorted(values) {
        return [...new Set(values.filter(Boolean))].sort((a, b) =>
            a.localeCompare(b, "pl")
        );
    }

    function yearInRange(year, range) {
        if (!range) return true;
        const y = Number(year);
        if (!y) return false;
        const [from, to] = range.split("-").map(Number);
        return y >= from && y <= to;
    }

    function artistPage(name) {
        return "artist.html?name=" + encodeURIComponent(name);
    }

    /* ---------- fill filter selects ---------- */
    if (filterCountry) {
        uniqueSorted(artists.map((a) => a.info && a.info.country)).forEach((c) => {
            const o = document.createElement("option");
            o.value = c;
            o.textContent = c;
            filterCountry.appendChild(o);
        });
    }
    if (filterGenre) {
        uniqueSorted(
            artists.flatMap((a) => {
                const g = (a.info && a.info.genre) || "";
                return g.split(/[/|,]/).map((s) => s.trim()).filter(Boolean);
            })
        ).forEach((g) => {
            const o = document.createElement("option");
            o.value = g;
            o.textContent = g;
            filterGenre.appendChild(o);
        });
    }

    /* ---------- collect data ---------- */
    function collectAlbums() {
        const list = [];
        artists.forEach((artist) => {
            (artist.albums || []).forEach((album) => {
                list.push({
                    title: album.title,
                    artist: artist.name,
                    cover: album.cover || "",
                    rating: parseFloat(album.rating) || 0,
                    year: album.year,
                    spotify: album.spotify || "",
                    page: artistPage(artist.name),
                    country: (artist.info && artist.info.country) || "",
                    genre: (artist.info && artist.info.genre) || ""
                });
            });
        });
        return list;
    }

    function collectTracks() {
        const list = [];
        artists.forEach((artist) => {
            (artist.albums || []).forEach((album) => {
                (album.tracks || []).forEach((track) => {
                    list.push({
                        title: track.title,
                        rating: parseFloat(track.rating) || 0,
                        artist: artist.name,
                        album: album.title,
                        cover: album.cover || "",
                        year: album.year,
                        page: artistPage(artist.name),
                        country: (artist.info && artist.info.country) || "",
                        genre: (artist.info && artist.info.genre) || ""
                    });
                });
            });
        });
        return list;
    }

    const allAlbums = collectAlbums();
    const allTracks = collectTracks();

    /* ---------- filter logic ---------- */
    function currentFilters() {
        return {
            q: (searchInput && searchInput.value || "").trim().toLowerCase(),
            country: filterCountry && filterCountry.value || "",
            genre: filterGenre && filterGenre.value || "",
            minRating: filterRating && filterRating.value ? parseFloat(filterRating.value) : 0,
            yearRange: filterYear && filterYear.value || ""
        };
    }

    function passFilters(item, f) {
        if (f.country && item.country !== f.country) return false;
        if (f.genre && !(item.genre || "").toLowerCase().includes(f.genre.toLowerCase())) return false;
        if (f.minRating && item.rating < f.minRating) return false;
        if (f.yearRange && !yearInRange(item.year, f.yearRange)) return false;
        if (f.q) {
            const hay = [item.title, item.artist, item.album, item.country, item.genre]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            if (!hay.includes(f.q)) return false;
        }
        return true;
    }

    /* ---------- render albums ---------- */
    function renderAlbums() {
        if (!ranking) return;
        const f = currentFilters();
        const list = allAlbums
            .filter((a) => passFilters(a, f))
            .sort((a, b) => b.rating - a.rating);

        ranking.innerHTML = "";
        if (emptyState) emptyState.hidden = list.length > 0 || (tracksRanking && !tracksRanking.hidden);

        list.forEach((album, index) => {
            const el = document.createElement("div");
            el.className = "album";
            const number = String(index + 1).padStart(2, "0");
            const ratingClass = getRatingClass(album.rating);

            const spotifyLink = album.spotify
                ? `<a class="spotify" href="${album.spotify}" target="_blank" rel="noopener noreferrer" title="Otwórz w Spotify">
                    <svg viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.47 17.31a.75.75 0 01-1.03.25 c-2.82-1.72-6.37-2.11-10.55-1.15a.75.75 0 11-.34-1.46 c4.58-1.05 8.51-.63 11.67 1.3.35.22.46.68.25 1.06zm1.38-3.08 a.94.94 0 01-1.29.31c-3.23-1.99-8.15-2.57-11.97-1.4 a.94.94 0 11-.55-1.8c4.36-1.32 9.8-.68 13.51 1.6 .43.27.57.84.3 1.29zm.12-3.22C15.1 8.73 8.02 8.5 4.01 9.72a1.13 1.13 0 11-.66-2.16c4.6-1.4 12.28-1.12 16.32 1.28a1.13 1.13 0 01-.7 2.09z"/></svg>
                   </a>`
                : `<span class="spotify" style="visibility:hidden"></span>`;

            el.innerHTML = `
                <div class="album-number">${number}</div>
                <img class="album-cover" src="${album.cover}" alt="${album.title}">
                <div class="album-info">
                    <div class="album-title">${album.title}</div>
                    <div class="album-artist">${album.artist}${album.year ? " · " + album.year : ""}</div>
                </div>
                ${spotifyLink}
                <div class="album-rating ${ratingClass}">${album.rating}</div>
            `;
            el.style.cursor = "pointer";
            el.addEventListener("click", (e) => {
                if (e.target.closest(".spotify")) return;
                if (album.page) window.location.href = album.page;
            });
            ranking.appendChild(el);
        });
    }

    /* ---------- render tracks (paginated) ---------- */
    let filteredTracks = [];
    let renderedCount = 0;

    function createTrackElement(track, index) {
        const el = document.createElement("div");
        el.className = "album track-item";
        el.style.cursor = "pointer";
        const number = String(index + 1).padStart(2, "0");
        const ratingClass = getRatingClass(track.rating);
        el.innerHTML = `
            <div class="album-number">${number}</div>
            <img class="album-cover" src="${track.cover}" alt="${track.album}">
            <div class="album-info">
                <div class="album-title">${track.title}</div>
                <div class="album-artist">${track.artist} · ${track.album}</div>
            </div>
            <div class="album-rating ${ratingClass}">${track.rating}</div>
        `;
        el.addEventListener("click", () => {
            if (track.page) window.location.href = track.page;
        });
        return el;
    }

    function renderTracksPage(reset) {
        if (!tracksRanking) return;
        if (reset) {
            tracksRanking.innerHTML = "";
            renderedCount = 0;
            const f = currentFilters();
            filteredTracks = allTracks
                .filter((t) => passFilters(t, f))
                .sort((a, b) => b.rating - a.rating);
        }
        const slice = filteredTracks.slice(renderedCount, renderedCount + PAGE_SIZE);
        slice.forEach((track, i) => {
            tracksRanking.appendChild(createTrackElement(track, renderedCount + i));
        });
        renderedCount += slice.length;
        if (loadMoreWrap) {
            loadMoreWrap.hidden = renderedCount >= filteredTracks.length || tracksRanking.hidden;
        }
        if (emptyState) {
            const albumsVisible = ranking && !ranking.hidden;
            emptyState.hidden = albumsVisible
                ? ranking.children.length > 0
                : filteredTracks.length > 0;
        }
    }

    /* ---------- apply all ---------- */
    function applyAll() {
        const tracksVisible = tracksRanking && !tracksRanking.hidden;
        if (tracksVisible) {
            renderTracksPage(true);
        } else {
            renderAlbums();
            if (emptyState) emptyState.hidden = ranking.children.length > 0;
            if (loadMoreWrap) loadMoreWrap.hidden = true;
        }
    }

    /* ---------- events ---------- */
    if (searchInput) searchInput.addEventListener("input", applyAll);
    [filterCountry, filterGenre, filterRating, filterYear].forEach((el) => {
        if (el) el.addEventListener("change", applyAll);
    });
    if (filtersReset) {
        filtersReset.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            if (filterCountry) filterCountry.value = "";
            if (filterGenre) filterGenre.value = "";
            if (filterRating) filterRating.value = "";
            if (filterYear) filterYear.value = "";
            applyAll();
        });
    }
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => renderTracksPage(false));
    }

    /* ---------- tabs ---------- */
    (function initTabs() {
        const tabs = document.querySelectorAll(".nav-title[data-tab]");
        if (!tabs.length) return;
        tabs.forEach((tab) => {
            tab.addEventListener("click", (e) => {
                e.preventDefault();
                tabs.forEach((t) => t.classList.remove("active"));
                tab.classList.add("active");
                const target = tab.dataset.tab;
                if (target === "albums") {
                    if (ranking) ranking.hidden = false;
                    if (tracksRanking) tracksRanking.hidden = true;
                    if (loadMoreWrap) loadMoreWrap.hidden = true;
                    renderAlbums();
                    if (emptyState) emptyState.hidden = ranking.children.length > 0;
                } else if (target === "tracks") {
                    if (ranking) ranking.hidden = true;
                    if (tracksRanking) tracksRanking.hidden = false;
                    renderTracksPage(true);
                }
            });
        });
    })();

    /* initial */
    renderAlbums();

    /* hash highlight (legacy) */
    document.addEventListener("DOMContentLoaded", () => {
        const target = window.location.hash;
        if (!target) return;
        const album = document.querySelector(target);
        if (!album) return;
        setTimeout(() => {
            album.scrollIntoView({ behavior: "smooth", block: "center" });
            album.classList.add("album-highlight");
        }, 100);
    });
})();
