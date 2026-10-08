window.artist = {
    name: "Patriarkh",

	info: {
        image: "img/Bands/Patriarkh.jpg",
        country: "Polska",
        location: "Białystok, Podlaskie",
        founded: "2024",
        active: "Aktywny",
        genre: "Black Metal",
        status: "Band"
    },

    albums: [

        {
            title: "Prorok Ilja",
            year: 2025,
            cover: "img/Albums/Prorok Ilja.jpg",
            rating: 8.1,

            tracks: [
                {
                    title: "Wierszalin I",
                    rating: 7.5
                },
                {
                    title: "Wierszalin II",
                    rating: 8
                },
                {
                    title: "Wierszalin III",
                    rating: 8.5
                },
				        {
                    title: "Wierszalin IV",
                    rating: 9.5
                },
				        {
                    title: "Wierszalin V",
                    rating: 8
                },
				{
                    title: "Wierszalin VI",
                    rating: 9.5
                },
				        {
                    title: "Wierszalin VII",
                    rating: 6.5
                },
                {
                    title: "Wierszalin VIII",
                    rating: 7.5
                }
            ]
        },

		{
            title: "Carju Niebiesnyj",
            year: 2024,
            cover: "img/Albums/Carju niebiesnyj.jpg",
            rating: 6.4,

            tracks: [
                {
                    title: "Pismo I",
                    rating: 7
                },
                {
                    title: "Pismo II",
                    rating: 6.5
                },
                {
                    title: "Pismo III",
                    rating: 5
                },
				        {
                    title: "Pismo IV",
                    rating: 5
                },
				        {
                    title: "Pismo V",
                    rating: 9
                },
				        {
                    title: "Pismo VI",
                    rating: 6
                },
            ]
        },

    ]
};

(window.allArtists = window.allArtists || []).push(window.artist);
