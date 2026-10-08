window.artist = {
    name: "Minenwerfer",

	info: {
        image: "img/Bands/Minenwerfer.jpg",
        country: "USA",
        location: "San Francisco, California",
        founded: "2007",
        active: "Aktywny",
        genre: "Black Metal / War Metal",
        status: "Band"
    },

    albums: [

        {
            title: "Alpenpässe",
            year: 2019,
            cover: "img/Albums/Alpenpasse.jpg",
            rating: 8,

            tracks: [
                {
                    title: "Der Blutharsch",
                    rating: 0
                },
                {
                    title: "Dragging The Dead Through Mountain Passes",
                    rating: 10
                },
                {
                    title: "Cloacked in Silence",
                    rating: 0
                },
				{
                    title: "Kaiserjägerlied",
                    rating: 8
                },
				{
                    title: "Tiroler Edelweiss",
                    rating: 6.5
                },
				{
                    title: "Withered Tombs",
                    rating: 0
                },
				{
                    title: "Mg 08/15",
                    rating: 7.5
                }
            ]
        }

    ]
};

(window.allArtists = window.allArtists || []).push(window.artist);
