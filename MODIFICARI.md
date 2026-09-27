# Raportul modificărilor — garderoba finală și audio local

## Fișiere modificate

- `src/pages/ClothingPage.tsx` — Patru categorii, catalog separat Fetiță/Băiat, selecție prin tap, golirea ținutei la schimbarea personajului și butonul „Încep din nou”.
- `src/utils/migrateState.ts` — Migrarea ținutelor la identificatorii noii garderobe; restul datelor rămân compatibile.
- `src/components/Header.tsx` — Controlul discret de pornire/oprire a muzicii.
- `src/components/ChildEmotionPicker.tsx` — Redarea fișierului emoției când este selectată pentru un copil.
- `src/components/MorningBoard.tsx` — Numai cinci zile selectabile; audio local la zile și emoții.
- `src/pages/SelectionPages.tsx` — Numai Luni–Vineri în selector; audio la zile, anotimpuri și emoții.
- `src/main.tsx` — Încărcarea stilurilor dedicate garderobei.
- `qa/smoke.cjs` — Adaptarea verificării de bază la noile articole.
- `qa/premium-updates.cjs` — Verificarea tuturor celor 52 de articole, patru categorii, cinci zile și migrarea datelor.
- `qa/individual-state.cjs` — Verificarea resetării la schimbarea personajului; păstrarea testelor emoțiilor individuale.
- `qa/board-layout.cjs` — Adaptarea verificărilor panoului la noile haine și noul comportament de resetare.
- `package.json` — Includerea verificării asset-urilor și audio-ului în npm test.
- `README.md` — Instrucțiuni actualizate pentru garderobă, migrare, audio, verificări și limitele sursei.

## Fișiere create

- `src/utils/clothingCatalog.ts` — 52 de definiții: nume, gen, slot, fișier, x/y, scară, înălțime și z-index; reguli de înlocuire.
- `src/components/ClothingMannequin.tsx` — Manechinul original și suprapuneri independente; aplicarea separată a pieselor pentru membre.
- `src/clothing.css` — Layout responsive, maximum patru haine pe rând, controale touch și feedback vizual.
- `src/utils/audio.ts` — Manager reutilizabil: o singură voce, resetarea redării anterioare, fundal în buclă, ducking și gestionarea erorilor.
- `src/components/AudioControl.tsx` — Buton muzică și mesaj discret în caz de eroare.
- `scripts/extract-clothing.py` — Extracție deterministă, măști, curățarea fundalului și a marginilor, manifest și planșă de control.
- `scripts/fitting-contact.py` — Compunerea planșelor de control pentru toate ținutele.
- `qa/all-fittings.cjs` — Capturarea fiecărui articol pe manechinul corespunzător.
- `qa/fitting-preview.cjs` — Captură de verificare pentru o ținută completă.
- `qa/final-assets.cjs` — Teste pentru integritatea imaginilor, audio real, fără autoplay, ducking, erori, accesorii și persistență.
- `qa/check-assets.py` — Verificarea transparenței celor 66 PNG-uri și a hash-urilor surselor.
- `qa/audio-report.json` — Duratele tuturor celor 16 fișiere, decodate cu motorul media Edge.
- `MODIFICARI.md` — Acest raport.

## Rezultatul verificărilor

- `npm run build`: reușit, inclusiv TypeScript; fără erori.
- `npm test`: toate cele șase suite au trecut.
- Verificări de layout la 1920, 1280, 768, 390 și 320 pixeli: fără derulare orizontală.
- 52 de articole verificate în interfață; 66 PNG-uri cu canal alfa valid.
- Cele două manechine au fost comparate prin SHA-256 cu fișierele atașate: identice.
- Toate cele 16 MP3-uri au fost decodate de browser. Vocile durează aproximativ 0,52–1,31 secunde; fundalul durează aproximativ 114,8 secunde.
- Fără autoplay; muzica pornește prin buton, la 0,18. Vocea reduce volumul la 0,08, apoi se revine la 0,18. O voce nouă oprește vocea precedentă. Nu există speechSynthesis.
- Capturile de verificare sunt în `qa/`, ignorate de Git.

## Asset-uri și limite

S-au copiat trei surse originale, s-au extras 52 de articole și 14 piese auxiliare `_wear.png` pentru încălțăminte/mănuși. Sunt 26 de articole pentru fiecare personaj: 6 + 4 + 6 + 10. Muzica și vocile sunt fișierele reale furnizate, nu placeholder-e. Planșa întreagă nu este afișată ca UI.

Pentru aplicarea pe membre, piesa din prim-plan a perechii este extrasă și oglindită. Perspectiva oblică originală a încălțămintei și mănușilor nu poate deveni o vedere frontală perfectă numai prin decupare. Aceste 14 piese și marginile unor mâneci — în special bluza crem a fetei și bluza verde a băiatului — pot beneficia de ajustări fine cu surse individuale de rezoluție mai mare. Calitatea rămâne limitată de dimensiunea pieselor din planșă, aproximativ 100–210 pixeli. Nu am regenerat desenele și nu am modificat vizual manechinele.

Ținuta se păstrează la reîncărcare, dar se golește la schimbarea personajului, conform cerinței actuale. Resetarea garderobei nu afectează restul calendarului. Vechile ID-uri ale hainelor vectoriale sunt eliminate; celelalte date sunt păstrate prin migrarea existentă.

## Lista exactă a asset-urilor adăugate

- `public/assets/haine/extracted/baiat_bottom_01.png`
- `public/assets/haine/extracted/baiat_bottom_02.png`
- `public/assets/haine/extracted/baiat_bottom_03.png`
- `public/assets/haine/extracted/baiat_bottom_04.png`
- `public/assets/haine/extracted/baiat_outer_01.png`
- `public/assets/haine/extracted/baiat_outer_02.png`
- `public/assets/haine/extracted/baiat_outer_03.png`
- `public/assets/haine/extracted/baiat_outer_04.png`
- `public/assets/haine/extracted/baiat_outer_05.png`
- `public/assets/haine/extracted/baiat_outer_06.png`
- `public/assets/haine/extracted/baiat_outer_06_wear.png`
- `public/assets/haine/extracted/baiat_outer_07.png`
- `public/assets/haine/extracted/baiat_outer_08.png`
- `public/assets/haine/extracted/baiat_outer_09.png`
- `public/assets/haine/extracted/baiat_outer_10.png`
- `public/assets/haine/extracted/baiat_shoes_01.png`
- `public/assets/haine/extracted/baiat_shoes_01_wear.png`
- `public/assets/haine/extracted/baiat_shoes_02.png`
- `public/assets/haine/extracted/baiat_shoes_02_wear.png`
- `public/assets/haine/extracted/baiat_shoes_03.png`
- `public/assets/haine/extracted/baiat_shoes_03_wear.png`
- `public/assets/haine/extracted/baiat_shoes_04.png`
- `public/assets/haine/extracted/baiat_shoes_04_wear.png`
- `public/assets/haine/extracted/baiat_shoes_05.png`
- `public/assets/haine/extracted/baiat_shoes_05_wear.png`
- `public/assets/haine/extracted/baiat_shoes_06.png`
- `public/assets/haine/extracted/baiat_shoes_06_wear.png`
- `public/assets/haine/extracted/baiat_top_01.png`
- `public/assets/haine/extracted/baiat_top_02.png`
- `public/assets/haine/extracted/baiat_top_03.png`
- `public/assets/haine/extracted/baiat_top_04.png`
- `public/assets/haine/extracted/baiat_top_05.png`
- `public/assets/haine/extracted/baiat_top_06.png`
- `public/assets/haine/extracted/fata_bottom_01.png`
- `public/assets/haine/extracted/fata_bottom_02.png`
- `public/assets/haine/extracted/fata_bottom_03.png`
- `public/assets/haine/extracted/fata_bottom_04.png`
- `public/assets/haine/extracted/fata_outer_01.png`
- `public/assets/haine/extracted/fata_outer_02.png`
- `public/assets/haine/extracted/fata_outer_03.png`
- `public/assets/haine/extracted/fata_outer_04.png`
- `public/assets/haine/extracted/fata_outer_05.png`
- `public/assets/haine/extracted/fata_outer_06.png`
- `public/assets/haine/extracted/fata_outer_06_wear.png`
- `public/assets/haine/extracted/fata_outer_07.png`
- `public/assets/haine/extracted/fata_outer_08.png`
- `public/assets/haine/extracted/fata_outer_09.png`
- `public/assets/haine/extracted/fata_outer_10.png`
- `public/assets/haine/extracted/fata_shoes_01.png`
- `public/assets/haine/extracted/fata_shoes_01_wear.png`
- `public/assets/haine/extracted/fata_shoes_02.png`
- `public/assets/haine/extracted/fata_shoes_02_wear.png`
- `public/assets/haine/extracted/fata_shoes_03.png`
- `public/assets/haine/extracted/fata_shoes_03_wear.png`
- `public/assets/haine/extracted/fata_shoes_04.png`
- `public/assets/haine/extracted/fata_shoes_04_wear.png`
- `public/assets/haine/extracted/fata_shoes_05.png`
- `public/assets/haine/extracted/fata_shoes_05_wear.png`
- `public/assets/haine/extracted/fata_shoes_06.png`
- `public/assets/haine/extracted/fata_shoes_06_wear.png`
- `public/assets/haine/extracted/fata_top_01.png`
- `public/assets/haine/extracted/fata_top_02.png`
- `public/assets/haine/extracted/fata_top_03.png`
- `public/assets/haine/extracted/fata_top_04.png`
- `public/assets/haine/extracted/fata_top_05.png`
- `public/assets/haine/extracted/fata_top_06.png`
- `public/assets/haine/extracted/manifest.json`
- `public/assets/haine/haine_sheet.png`
- `public/assets/haine/manechin_baiat.png`
- `public/assets/haine/manechin_fata.png`
- `public/assets/haine/sources.json`
- `public/audio/anotimpuri/anotimp_iarna.mp3`
- `public/audio/anotimpuri/anotimp_primavara.mp3`
- `public/audio/anotimpuri/anotimp_toamna.mp3`
- `public/audio/anotimpuri/anotimp_vara.mp3`
- `public/audio/emotii/emotie_linistit.mp3`
- `public/audio/emotii/emotie_obosit.mp3`
- `public/audio/emotii/emotie_speriat.mp3`
- `public/audio/emotii/emotie_suparat.mp3`
- `public/audio/emotii/emotie_trist.mp3`
- `public/audio/emotii/emotie_vesel.mp3`
- `public/audio/fundal/fundal_calendar.mp3`
- `public/audio/zile/zi_joi.mp3`
- `public/audio/zile/zi_luni.mp3`
- `public/audio/zile/zi_marti.mp3`
- `public/audio/zile/zi_miercuri.mp3`
- `public/audio/zile/zi_vineri.mp3`
