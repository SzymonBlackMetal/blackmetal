document.addEventListener("DOMContentLoaded", () => {

    const discography = document.querySelector(".discography");

    if (!discography) {
        return;
    }

    if (typeof artist === "undefined") {
        console.error("Nie znaleziono obiektu artist.");
        return;
    }


    /*
     * =====================================================
     * NAZWA WYKONAWCY
     * =====================================================
     */

    const artistTitle = document.querySelector(".artist-title");

    if (artistTitle) {
        artistTitle.textContent = artist.name;
    }


    /*
     * =====================================================
     * STREFA WYKONAWCY
     * =====================================================
     */

    createArtistHeader(discography);


    /*
     * =====================================================
     * DYSKOGRAFIA
     * =====================================================
     */

    discography.innerHTML = "";

    // Sortowanie albumów od najstarszego do najnowszego
    const albums = Array.isArray(artist.albums)
        ? [...artist.albums].sort((a, b) => Number(a.year) - Number(b.year))
        : [];


    /*
     * Brak albumów
     */

    if (albums.length === 0) {

        const empty = document.createElement("p");

        empty.textContent = "Brak albumów.";

        discography.appendChild(empty);

        return;
    }


    /*
     * Grupowanie albumów według roku
     */

    const albumsByYear = {};

    albums.forEach(album => {

        if (!albumsByYear[album.year]) {
            albumsByYear[album.year] = [];
        }

        albumsByYear[album.year].push(album);

    });


    /*
     * Generowanie sekcji dla każdego roku
     */

    Object.keys(albumsByYear)
        .sort((a, b) => Number(a) - Number(b))
        .forEach(year => {

            const yearSection = document.createElement("section");

            yearSection.className = "year-section";


            /*
             * Rok
             */

            const yearElement = document.createElement("div");

            yearElement.className = "year";
            yearElement.textContent = year;

            yearSection.appendChild(yearElement);


            /*
             * Albumy z danego roku
             */

            albumsByYear[year].forEach(album => {

                yearSection.appendChild(
                    createAlbumElement(album)
                );

            });


            discography.appendChild(yearSection);

        });


    /*
     * =====================================================
     * OBSŁUGA #ID ALBUMU
     * =====================================================
     */

    scrollToAlbum();

});


/*
 * =========================================================
 * STREFA WYKONAWCY
 * =========================================================
 */

function createArtistHeader(discography) {

    /*
     * Jeżeli nie ma informacji o wykonawcy,
     * nie tworzymy profilu.
     */

    if (!artist.info) {
        console.warn("Brak artist.info — pomijam profil wykonawcy.");
        return;
    }


    /*
     * Główna karta wykonawcy
     */

    const header = document.createElement("section");

    header.className = "artist-profile";


    /*
     * =====================================================
     * ZDJĘCIE
     * =====================================================
     */

    const imageContainer = document.createElement("div");

    imageContainer.className = "artist-profile-image";


    const image = document.createElement("img");

    image.src = artist.info.image || "";
    image.alt = artist.name;


    /*
     * Jeżeli zdjęcie nie istnieje,
     * ukrywamy zepsuty obrazek.
     */

    image.onerror = () => {

        imageContainer.classList.add("image-missing");

        image.style.display = "none";

    };


    imageContainer.appendChild(image);


    /*
     * =====================================================
     * GŁÓWNA CZĘŚĆ INFORMACJI
     * =====================================================
     */

    const main = document.createElement("div");

    main.className = "artist-profile-main";


    /*
     * Nazwa wykonawcy
     */

    const title = document.createElement("h2");

    title.className = "artist-profile-name";
    title.textContent = artist.name;

    main.appendChild(title);


    /*
     * Gatunek
     */

    if (artist.info.genre) {

        const genre = document.createElement("div");

        genre.className = "artist-profile-genre";
        genre.textContent = artist.info.genre;

        main.appendChild(genre);

    }


    /*
     * =====================================================
     * OPIS
     * =====================================================
     */

    const description = document.createElement("p");

    description.className = "artist-profile-description";


    if (artist.info.description) {

        description.textContent =
            artist.info.description;

    }
    else {

        description.textContent =
            `Informacje o projekcie ${artist.name}.`;

    }


    main.appendChild(description);


    /*
     * =====================================================
     * STATYSTYKI
     * =====================================================
     */

    const stats = document.createElement("div");

    stats.className = "artist-stats";


    const statItems = [

        {
            label: "Kraj",
            value: artist.info.country
        },

        {
            label: "Lokalizacja",
            value: artist.info.location
        },

        {
            label: "Założono",
            value: artist.info.founded
        },

        {
            label: "Działalność",
            value: artist.info.active
        },

        {
            label: "Status",
            value: artist.info.status
        }

    ];


    /*
     * Tworzenie poszczególnych statystyk
     */

    statItems.forEach(stat => {

        /*
         * Pomijamy puste informacje.
         */

        if (
            stat.value === undefined ||
            stat.value === null ||
            stat.value === ""
        ) {
            return;
        }


        const item = document.createElement("div");

        item.className = "artist-stat";


        /*
         * Nazwa pola
         */

        const label = document.createElement("span");

        label.className = "artist-stat-label";
        label.textContent = stat.label;


        /*
         * Wartość
         */

        const value = document.createElement("span");

        value.className = "artist-stat-value";
        value.textContent = stat.value;


        item.appendChild(label);
        item.appendChild(value);

        stats.appendChild(item);

    });


    main.appendChild(stats);


    /*
     * =====================================================
     * ZŁOŻENIE PROFILU
     * =====================================================
     */

    header.appendChild(imageContainer);
    header.appendChild(main);


    /*
     * Profil zostaje wstawiony NAD dyskografią.
     */

    discography.parentNode.insertBefore(
        header,
        discography
    );

}


/*
 * =========================================================
 * TWORZENIE POJEDYNCZEGO ALBUMU
 * =========================================================
 */

function createAlbumElement(album) {

    const article = document.createElement("article");

    article.className = "artist-album";


    /*
     * ID albumu
     */

    article.id = createAlbumId(
        artist.name,
        album.title
    );


    /*
     * =====================================================
     * GŁÓWNA CZĘŚĆ ALBUMU
     * =====================================================
     */

    const albumMain = document.createElement("div");

    albumMain.className = "album-main";


    /*
     * Okładka
     */

    const cover = document.createElement("img");

    cover.src = album.cover || "";
    cover.className = "album-cover";
    cover.alt = album.title;


    /*
     * Obsługa brakującej okładki
     */

    cover.onerror = () => {

        cover.style.visibility = "hidden";

    };


    albumMain.appendChild(cover);


    /*
     * =====================================================
     * INFORMACJE O ALBUMIE
     * =====================================================
     */

    const albumDetails = document.createElement("div");

    albumDetails.className = "album-details";


    /*
     * Tytuł albumu
     */

    const albumTitle = document.createElement("div");

    albumTitle.className = "album-title";
    albumTitle.textContent = album.title;

    albumDetails.appendChild(albumTitle);


    /*
     * Rok albumu
     */

    const albumYear = document.createElement("div");

    albumYear.className = "album-year";
    albumYear.textContent = album.year;

    albumDetails.appendChild(albumYear);


    albumMain.appendChild(albumDetails);


    /*
     * =====================================================
     * OCENA ALBUMU
     * =====================================================
     */

    const albumRating = document.createElement("div");

    albumRating.className =
        `album-rating ${getRatingClass(album.rating)}`;

    albumRating.textContent =
        formatRating(album.rating);

    albumMain.appendChild(albumRating);


    article.appendChild(albumMain);


    /*
     * =====================================================
     * LISTA UTWORÓW
     * =====================================================
     */

    const tracks = document.createElement("div");

    tracks.className = "tracks";


    if (
        Array.isArray(album.tracks) &&
        album.tracks.length > 0
    ) {

        album.tracks.forEach((track, index) => {

            const trackElement =
                document.createElement("div");

            trackElement.className = "track";


            /*
             * Numer utworu
             */

            const trackNumber =
                document.createElement("span");

            trackNumber.className = "track-number";

            trackNumber.textContent =
                String(index + 1).padStart(2, "0");

            trackElement.appendChild(trackNumber);


            /*
             * Nazwa utworu
             */

            const trackName =
                document.createElement("span");

            trackName.className = "track-name";

            trackName.textContent =
                track.title || "Nieznany utwór";

            trackElement.appendChild(trackName);


            /*
             * Ocena utworu
             */

            const trackRating =
                document.createElement("span");

            trackRating.className =
                `track-rating ${getRatingClass(track.rating)}`;

            trackRating.textContent =
                formatRating(track.rating);

            trackElement.appendChild(trackRating);


            /*
             * Dodanie utworu
             */

            tracks.appendChild(trackElement);

        });

    }


    article.appendChild(tracks);


    return article;
}


/*
 * =========================================================
 * KLASA CSS ZALEŻNA OD OCENY
 * =========================================================
 */

function getRatingClass(rating) {

    const value = Number(rating);


    if (Number.isNaN(value)) {
        return "rating-low";
    }


    if (value === 10) {
        return "rating-10";
    }


    if (value >= 8) {
        return "rating-high";
    }


    if (value >= 5) {
        return "rating-medium";
    }


    return "rating-low";
}


/*
 * =========================================================
 * FORMATOWANIE OCENY
 * =========================================================
 */

function formatRating(rating) {

    const value = Number(rating);


    if (Number.isNaN(value)) {
        return "0";
    }


    return Number.isInteger(value)
        ? String(value)
        : value.toFixed(1);
}


/*
 * =========================================================
 * TWORZENIE ID ALBUMU
 * =========================================================
 */

function createAlbumId(artistName, albumTitle) {

    const normalize = text => {

        return String(text)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "")
            .trim();

    };


    return `${normalize(artistName)}-${normalize(albumTitle)}`;
}


/*
 * =========================================================
 * PRZEJŚCIE DO ALBUMU Z #ID
 * =========================================================
 */

function scrollToAlbum() {

    const hash = window.location.hash;


    /*
     * Brak #ID
     */

    if (!hash) {
        return;
    }


    /*
     * Usuwamy #
     */

    const id = decodeURIComponent(
        hash.substring(1)
    );


    /*
     * Szukamy albumu
     */

    const album =
        document.getElementById(id);


    if (!album) {
        return;
    }


    /*
     * Czekamy, aż strona zostanie wyrenderowana.
     */

    setTimeout(() => {

        album.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


        /*
         * Podświetlenie albumu
         */

        album.classList.add(
            "album-highlight"
        );


        /*
         * Usunięcie podświetlenia
         */

        setTimeout(() => {

            album.classList.remove(
                "album-highlight"
            );

        }, 2500);

    }, 150);

}
