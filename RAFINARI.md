# Rafinările vizuale — 27 septembrie 2026

## Fișiere modificate

- `src/pages/SummaryPage.tsx`: durate și decalaje individuale pentru cele 22 de decorațiuni.
- `src/main.tsx`: încărcarea noului fișier de stiluri.
- `src/utils/clothingCatalog.ts`: recalibrarea topurilor, pantalonilor, fustei, sarafanului, hainelor exterioare și accesoriilor; lățimi separate pentru membre și depărtarea cracilor. Coordonatele fetei și băiatului sunt distincte.
- `src/components/ClothingMannequin.tsx`: pantaloni redați în două segmente înclinate, cu talia fixă; încălțăminte orientată spre exterior; umbrele oglindite cu mânerul în dreptul mâinii; păstrarea ordinii straturilor.
- `scripts/extract-clothing.py`: închiderea golurilor de un pixel, eliminarea proeminențelor subțiri și netezirea canalului alfa; mască separată pentru cizme/ghete față de pantofi.
- `public/assets/haine/extracted/`: cele 52 de PNG-uri de articole și cele 14 fișiere auxiliare `_wear.png` regenerate cu măștile corectate. Identificatorii și categoriile nu s-au schimbat. `manifest.json` este regenerat de același script.
- `package.json`: noua suită de verificări vizuale inclusă în `npm test`.
- `README.md`: explicația noilor dimensiuni, animațiilor și regulilor de potrivire.

## Fișiere create

- `src/visual-polish.css`: anotimpuri mai mari, vreme și temperatură mai vizibile, pictograme de module mai mari, confetti și steluțe cu animații lente; praguri responsive și respectarea mișcării reduse.
- `qa/visual-polish.cjs`: verificarea dimensiunilor, a separării imaginilor de etichete, a animației normale/reduse și a lipsei derulării orizontale.
- `RAFINARI.md`: acest raport.

## Rezultat vizual

Anotimpurile folosesc o zonă de imagine de 355 px pe desktop, față de 280 px anterior. Vremea folosește imagini de 172 px, față de 130 px. Cald/Răcoare/Frig folosesc 90 px. Pictogramele modulelor cresc de la 108 la 126 px. Imaginile sunt redimensionate cu păstrarea proporțiilor; nu s-au schimbat ilustrațiile sau paleta. Pe mobil dimensiunile se adaptează fără tăiere.

Ecranul final păstrează compoziția și textele. Confetti și steluțele se mișcă lin, în cicluri de 6–10 secunde; nu interceptează atingerea. Preferința de reducere a mișcării le face statice.

Originalele celor două manechine au rămas identice, verificate prin hash. Fiecare piesă are metadate proprii, distincte pentru fată și băiat. Pantalonii urmează acum separat cele două picioare, fără lărgirea artificială a taliei. Încălțămintea este orientată spre exterior, iar umbrelele au mânerul spre mâna personajului.

Limita rămasă este perspectiva desenelor originale: încălțămintea și mănușile provin din perechi desenate oblic. Retușarea și poziționarea îmbunătățesc aplicarea, însă nu transformă sursa într-un model 3D sau într-o ilustrație frontală nouă. Nu se poate garanta o potrivire perfectă la nivel de pixel pentru fiecare combinație.

## Verificări

- TypeScript și `npm run build`: reușite.
- Toate cele 52 de articole: capturi de control pe personajul corespunzător.
- 66 PNG-uri cu transparență validă; imaginile-sursă nemodificate.
- Layout și interacțiuni verificate în profiluri izolate de browser; datele utilizatorului nu au fost modificate de teste.
