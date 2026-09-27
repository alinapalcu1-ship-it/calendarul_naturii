# Calendarul naturii – Întâlnirea de dimineață

Aplicație în limba română pentru grupa mică (2–3 ani), realizată cu React, Vite și TypeScript. Funcționează prin atingere, clic și tastatură, fără conturi sau backend.

## Pornire locală

Instalează Node.js 22 LTS sau o versiune ulterioară, care include npm. Din directorul proiectului:

```sh
npm install
npm run dev
```

Deschide adresa afișată de Vite (de regulă http://127.0.0.1:5173). Pentru build și verificarea acestuia:

```sh
npm run build
npm run preview
```

Butonul de ecran complet se află în antet; F11 este o alternativă pe desktop. Pentru tablă, recomandăm o fereastră de 1920 × 1080. Pe ecrane mici, modulele se rearanjează și se pot derula.

## Utilizare

- **Astăzi este…**: data sistemului este preluată automat. Ziua, data, luna și anul se aleg prin butoane mari. Alegerea unei zile a săptămânii ajustează data în aceeași săptămână; data completă rămâne coerentă.
- **Anotimpul**: o selecție, păstrată între zile.
- **Vremea**: maximum două caracteristici și o temperatură. O a treia caracteristică înlocuiește prima. Reatingerea deselectează.
- **Îmbrăcămintea**: alege fata sau băiatul, apoi atinge hainele pentru a le pune sau a le scoate. Sunt 26 de articole pentru fiecare personaj, în patru categorii. Schimbarea personajului golește hainele; „Încep din nou” golește doar ținuta, păstrând personajul și restul calendarului.
- **Prezența**: 22 copii inițial absenți. Atingerea comută starea și actualizează totalurile.
- **Emoțiile**: șase expresii; o selecție comună și, separat, o emoție pentru fiecare copil în prezență, salvată după ID-ul copilului.
- **Responsabilul**: se alege dintre copiii prezenți. Dacă devine absent, selecția se șterge.
- **Ziua noastră**: recapitulare automată în text și mesaj de încheiere.
- **Setări educatoare**: numele grupei, mesajul dimineții, numele celor 22 de copii, fotografii, aniversări, activități și resetări. Mesajul gol este ascuns. Aniversările apar pe ecranul principal când coincid cu data selectată.

La o nouă zi calendaristică reală, se resetează prezența, responsabilul, vremea, temperatura, îmbrăcămintea și emoția. Numele, fotografiile, anotimpul, mesajul și activitățile se păstrează. Schimbarea manuală a datei este un exercițiu și nu șterge alegerile sesiunii. Aplicația verifică schimbarea zilei și când rămâne deschisă peste noapte.

## Date și confidențialitate

Datele sunt salvate în `localStorage`, sub cheia `calendarul-naturii-v1`, doar în browserul curent și pentru adresa curentă. Nu există analytics, tracking, fonturi externe, backend sau încărcare de fotografii pe server. JPG, PNG și WebP sunt decupate pătrat și micșorate local la 256 × 256 pixeli. Limita unui fișier de intrare este 15 MB. La depășirea capacității de stocare apare un mesaj; modificările nesalvate se pot pierde la închidere.

Ștergerea datelor browserului sau resetarea completă elimină informațiile salvate. Navigarea privată poate să nu le păstreze. Schimbarea browserului, portului sau adresei (de exemplu trecerea de la local la GitHub Pages) creează un spațiu de date separat. Nu există sincronizare sau copii de rezervă automate.

## Publicare pe GitHub Pages

Proiectul este pregătit pentru publicare, dar nu este publicat automat. `vite.config.ts` folosește `base: './'`; fișierele funcționează și sub calea unui repository. Navigarea modulelor este internă și nu necesită reguli de rescriere a adreselor.

1. Creează un repository GitHub și adaugă-l ca remote `origin` pentru acest proiect. Nu include fotografii sau alte date personale în repository.
2. Instalează dependențele și autentifică Git pentru acces la repository.
3. Rulează:

   ```sh
   npm run deploy
   ```

   Comanda construiește aplicația și publică numai conținutul `dist` pe ramura `gh-pages`.

4. În GitHub → Settings → Pages, selectează **Deploy from a branch**, ramura **gh-pages**, directorul **/(root)**.
5. Deschide adresa afișată de GitHub, de regulă `https://UTILIZATOR.github.io/REPOSITORY/`.

Publicarea ulterioară se face cu aceeași comandă. Datele introduse în browser nu fac parte din build.

## Structură

- `src/components/`: antet, pictograme, expresii faciale și controale comune.
- `src/pages/`: ecranul principal, module, îmbrăcarea personajului, recapitulare și setări.
- `src/hooks/useLocalStorage.ts`: persistență și schimbarea zilei.
- `src/utils/`: date calendaristice, opțiuni, procesare fotografii și catalogul garderobei.
- `src/types/`: tipuri TypeScript.
- `src/styles.css`: stiluri responsive, focus vizibil și suport pentru mișcare redusă.

Build-ul verifică TypeScript înainte de generarea fișierelor statice. Nu este necesar un server de aplicație pentru versiunea publicată. Pentru rulare locală folosește Vite sau un server static; deschiderea directă a `dist/index.html` prin `file://` nu este suportată.

## Verificări automate opționale

Testul de browser folosește un profil izolat, fără a modifica datele educatoarei. Cu serverul pornit separat prin `npm run dev`:

```sh
npx playwright install chromium
npm run test:smoke
```

Pentru Edge deja instalat, în PowerShell: `$env:PLAYWRIGHT_CHANNEL='msedge'`, apoi `npm run test:smoke`. Poți indica alt server prin variabila `BASE_URL`. Testul verifică prezența, persistența, responsabilul, selecțiile meteo, îmbrăcămintea, emoțiile, recapitularea, modificarea numelui, fotografia locală și afișarea pe mobil. Capturile rezultate din `qa/` sunt ignorate de Git.

Pentru toate verificările, inclusiv data, anii bisecți, fullscreen, programul, schimbarea zilei și resetările, rulează `npm test` cu serverul pornit. Testul de cazuri speciale fixează ceasul doar în profilul său izolat.

## Garderoba finală și fișierele audio

Cele trei imagini furnizate sunt în `public/assets/haine/`. Cele două manechine sunt copii identice cu sursele atașate, fără editare vizuală. Planșa este păstrată ca sursă, nu este afișată în interfață.

`extracted/` conține 52 PNG-uri transparente: pentru fiecare personaj, 6 topuri, 4 piese pentru partea de jos, 6 perechi de încălțăminte și 10 haine exterioare/accesorii. Mai există 14 decupaje tehnice `_wear.png` pentru aplicarea separată a încălțămintei și mănușilor. Piesa din prim-plan este oglindită pentru membrul opus. `manifest.json` documentează coordonatele și dimensiunile celor 52 de extracții.

`src/utils/clothingCatalog.ts` conține numele, categoriile, coordonatele, dimensiunile și ordinea straturilor fiecărui articol. Ajustarea unei piese nu modifică celelalte piese. Sarafanul înlocuiește topul; selectarea unui top înlocuiește sarafanul. Haina exterioară, pălăria, fularul, mănușile și umbrela au sloturi separate.

Ținuta curentă se salvează în aceeași cheie localStorage ca înainte. La schimbarea Fetiță/Băiat ambele ținute se golesc, conform cerinței actuale. La reîncărcarea paginii, ținuta curentă se păstrează. Selecțiile vechi ale garderobei vectoriale sunt eliminate la migrare; copiii, fotografiile, emoțiile, prezența și setările sunt păstrate, cu resetarea zilnică existentă.

### Audio local

Arhiva furnizată conține 16 MP3-uri reale, nu placeholder-e:

- `public/audio/zile/zi_luni.mp3`, `zi_marti.mp3`, `zi_miercuri.mp3`, `zi_joi.mp3`, `zi_vineri.mp3`;
- `public/audio/anotimpuri/anotimp_primavara.mp3`, `anotimp_vara.mp3`, `anotimp_toamna.mp3`, `anotimp_iarna.mp3`;
- `public/audio/emotii/emotie_vesel.mp3`, `emotie_trist.mp3`, `emotie_suparat.mp3`, `emotie_speriat.mp3`, `emotie_obosit.mp3`, `emotie_linistit.mp3`;
- `public/audio/fundal/fundal_calendar.mp3`.

`src/utils/audio.ts` mapează aceste nume exacte. Zilele, anotimpurile și emoțiile redau înregistrarea numai la apăsare. Nu se folosește speechSynthesis. O voce nouă oprește și resetează vocea anterioară. Fundalul pornește exclusiv prin butonul din antet, în buclă, la volum 0,18; volumul devine 0,08 în timpul vocii și revine la 0,18 după terminare sau eroare. Nu se reia automat după reîncărcare. Aplicația rămâne utilizabilă dacă browserul refuză redarea.

Selectorul zilelor prezintă numai Luni–Vineri. Formatarea datei complete recunoaște în continuare weekendul, pentru a nu afișa o dată de sistem incorectă.

### Reproducere și verificare

- `scripts/extract-clothing.py`: extracție deterministă locală, cu Python, Pillow și NumPy; nu folosește AI sau servicii externe.
- `qa/all-fittings.cjs` și `scripts/fitting-contact.py`: capturi și planșe de verificare pentru toate cele 52 de articole.
- `qa/final-assets.cjs`: integritatea manechinelor, toate MP3-urile decodate, înlocuirea vocilor, volumul fundalului, erori, sloturi și persistență.
- `npm test`: include testele existente adaptate cerințelor actuale și verificările noi. Serverul Vite trebuie să fie pornit.

Limită a sursei: hainele din planșa originală sunt mici (aproximativ 100–210 pixeli fiecare), iar unele se ating. Contururile au fost curățate local; nu există regenerare sau detalii inventate prin upscaling. Încălțămintea și mănușile sunt desenate în perspectivă, deci potrivirea frontală rămâne o aproximare 2D. Aceste piese și marginile mânecilor pot beneficia de retușuri fine dacă sunt furnizate asset-uri individuale mai mari.

Designul, anotimpurile, emoji, fonturile locale și rutina au rămas neschimbate. Nu s-au adăugat servicii externe sau transferuri de date.

## Rafinări de proporții și potrivire

`src/visual-polish.css` mărește imaginile fără schimbarea paletei sau a structurii cardurilor: anotimpuri 355 px pe desktop, vreme 172 px, temperatură 90 px și pictogramele modulelor 126 px. Dimensiunile scad adaptiv pe mobil. Ilustrațiile anotimpurilor au o zonă delimitată, astfel încât să nu acopere numele.

Ecranul final are confetti și steluțe în mișcare lentă (6–10 secunde), pe un strat decorativ care nu interceptează atingerea. `prefers-reduced-motion` oprește animațiile.

Hainele au coordonate distincte pe fiecare personaj. Pantalonii lungi sunt redați în două segmente cu înclinări opuse, ancorate în aceeași talie, pentru a urma picioarele. Încălțămintea a fost orientată spre exterior, accesoriile recalibrate, iar măștile pentru cizme diferențiate de cele pentru pantofi. Marginile decupajelor au fost netezite și golurile de un pixel închise. Manechinele originale nu sunt modificate.

`qa/visual-polish.cjs` verifică imaginile mărite, evitarea suprapunerii peste etichete, animațiile, mișcarea redusă și afișarea responsive. Capturile pentru fiecare dintre cele 52 de haine pot fi regenerate cu `node qa/all-fittings.cjs`.
