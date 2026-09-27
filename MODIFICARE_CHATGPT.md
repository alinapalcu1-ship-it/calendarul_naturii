# Modificare directă – secțiunea „Cum ne îmbrăcăm?”

Modificări aplicate:
- hainele sunt acum overlay-uri PNG pe același canvas cu manechinul; nu mai sunt decupate sau repoziționate dinamic în aplicație;
- câte 4 opțiuni pentru fiecare categorie: Partea de sus, Partea de jos, Exterior, Încălțăminte, Accesorii;
- selecțiile fetei și băiatului rămân separate;
- pălăriile, șepcile, mănușile, umbrelele și încălțămintea au fost repoziționate și redimensionate după proporțiile celor două manechine;
- fusta denim a fetei a fost curățată de bretelele care nu se potriveau ca articol separat;
- se pot combina logic: geacă + fular și pălărie/șapcă + mănuși + umbrelă, deoarece ocupă sloturi diferite;
- cardurile garderobei folosesc thumbnails decupate, iar manechinul folosește overlay-urile complete;
- la schimbarea Fetiță/Băiat nu se mai șterge garderoba celuilalt personaj;
- toate funcțiile audio (muzică și pronunțarea cuvintelor) au fost eliminate din interfață.

Verificare:
- TypeScript (`tsc -b`) trece fără erori.
- Proiectul încărcat conține `node_modules` pentru Windows, de aceea build-ul Vite nu poate fi executat în mediul Linux folosit pentru editare. Pe calculatorul original se poate rula normal `npm run dev` / `npm run build`.
