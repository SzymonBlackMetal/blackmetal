# Black Metal Ranking

Statyczna strona z rankingiem albumów i utworów black metal.

## Struktura (ważne pliki)

| Plik | Rola |
|------|------|
| `data.js` | **Jedyny plik do edycji danych** – zespoły, albumy, utwory |
| `index.html` | Ranking albumów / utworów + wyszukiwarka + filtry |
| `zespoly.html` | Lista wszystkich zespołów |
| `artist.html` | Uniwersalna strona dyskografii (`?name=Burzum`) |
| `script.js` | Logika rankingu, wyszukiwania i filtrów |
| `bands.js` | Render dyskografii artysty |
| `bands-list.js` | Render siatki zespołów |
| `manifest.json` + `sw.js` | PWA (instalacja + tryb offline) |

## Jak dodać zespół / album

1. Wrzuć zdjęcia do `img/Bands/` i `img/Albums/`
2. Dopisz obiekt do tablicy w `data.js`
3. Odśwież stronę – pojawia się w rankingu, filtrach i na liście zespołów

## Funkcje

- **Wyszukiwarka** – albumy, zespoły, utwory
- **Filtry** – kraj, gatunek, minimalna ocena, zakres lat
- **Strona Zespoły** – siatka z okładką, krajem, gatunkiem, liczbą albumów
- **PWA** – można „zainstalować” na telefonie / komputerze; działa offline (po pierwszej wizycie)

## Uruchomienie lokalne

Otwórz przez lokalny serwer (PWA i SW wymagają HTTP, nie `file://`):

```bash
npx serve .
# albo
python3 -m http.server 8080
```

Potem wejdź na `http://localhost:8080`.
