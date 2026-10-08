const ranking = document.querySelector("#ranking");
let albums = [...ranking.querySelectorAll(".album")];

albums.sort((a, b) => {
    const ratingA = parseFloat(a.dataset.rating);
    const ratingB = parseFloat(b.dataset.rating);
    return ratingB - ratingA;
});

albums.forEach((album, index) => {
    const title = album.dataset.title;
    const artist = album.dataset.artist;
    const cover = album.dataset.cover;
    const rating = parseFloat(album.dataset.rating);
    const spotify = album.dataset.spotify;
    const page = album.dataset.page;   // ← podstrona wykonawcy

    const number = String(index + 1).padStart(2, "0");

    let ratingClass;
    if (rating === 10) {
        ratingClass = "rating-10";
    } else if (rating >= 7) {
        ratingClass = "rating-high";
    } else if (rating >= 4) {
        ratingClass = "rating-medium";
    } else {
        ratingClass = "rating-low";
    }

    album.innerHTML = `
        <div class="album-number">
            ${number}
        </div>
        <img
            class="album-cover"
            src="${cover}"
            alt="${title}"
        >
        <div class="album-info">
            <div class="album-title">
                ${title}
            </div>
            <div class="album-artist">
                ${artist}
            </div>
        </div>
        <a
            class="spotify"
            href="${spotify}"
            target="_blank"
            rel="noopener noreferrer"
            title="Otwórz w Spotify"
        >
            <svg viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12
                12-5.37 12-12S18.63 0 12 0zm5.47 17.31a.75.75 0 01-1.03.25
                c-2.82-1.72-6.37-2.11-10.55-1.15a.75.75 0 11-.34-1.46
                c4.58-1.05 8.51-.63 11.67 1.3.35.22.46.68.25 1.06zm1.38-3.08
                a.94.94 0 01-1.29.31c-3.23-1.99-8.15-2.57-11.97-1.4
                a.94.94 0 11-.55-1.8c4.36-1.32 9.8-.68 13.51 1.6
                .43.27.57.84.3 1.29zm.12-3.22C15.1 8.73 8.02 8.5 4.01
                9.72a1.13 1.13 0 11-.66-2.16c4.6-1.4 12.28-1.12
                16.32 1.28a1.13 1.13 0 01-.7 2.09z"/>
            </svg>
        </a>
        <div class="album-rating ${ratingClass}">
            ${rating}
        </div>
    `;

    // Kliknięcie całego albumu → strona wykonawcy
    // (pomijamy kliknięcie w ikonę Spotify)
    album.style.cursor = "pointer";
    album.addEventListener("click", (e) => {
        if (e.target.closest(".spotify")) return;
        if (page) {
            window.location.href = page;
        }
    });

    ranking.appendChild(album);
});

document.addEventListener("DOMContentLoaded", () => {
    const target = window.location.hash;
    if (!target) return;

    const album = document.querySelector(target);
    if (!album) return;

    setTimeout(() => {
        album.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
        album.classList.add("album-highlight");
    }, 100);
});