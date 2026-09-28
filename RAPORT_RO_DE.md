# Raport RO / DE — Calendarul Naturii

Implementare locală, fără commit/push. Repo-ul actual a fost păstrat ca sursă principală.

## Surse comparate
- `Calendarul_Naturii_cu_audio_complet.zip`: repo-ul avea deja cele 40 de voci RO + fundal și stilurile butoanelor audio. Nu a fost necesară copierea sau suprascrierea lor.
- `Calendarul_Naturii_FIT_PERFECT_PATCH.zip`: repo-ul are reglaje individuale și layering mai noi. Catalogul, fitting-ul și imaginile au fost păstrate; singura schimbare în ClothingMannequin este traducerea descrierii accesibile.
- `Calendarul Naturii (2).zip`: sursa celor 47 de MP3-uri germane. Contrar descrierii inițiale, folderul `public/audio/de` lipsea din repo. Fișierele au fost copiate identic, fără redenumire sau conversie.

## Implementare
LanguageProvider gestionează separat cheia `calendarul-naturii-language`, implicit RO. Contextul reactivează textele, limba documentului și titlul fără refresh. `t()` și `labelFor()` folosesc un dicționar central; interpolarea păstrează numele și mesajele utilizatorului. Valorile canonice, ID-urile hainelor și numele date componentelor Icon/StoryArt/Face rămân neschimbate. Schema de state rămâne versiunea 1.

`audioPrompts.ts` mapează valorile canonice la MP3-ul limbii selectate folosind BASE_URL. `useAudioPlayer()` adaugă playWord/playPrompt/hasAudio/hasPrompt peste același AudioManager persistent. Nu există un al doilea player de fundal. Nu s-a modificat AudioManager, inclusiv unlock iOS și ducking/fallback. Nu se pornește nicio voce prin schimbarea limbii.

Întrebarea meteo germană nu are fișier dedicat: textul este afișat, iar butonul audio lipsește intenționat. Rutina și personajele au audio numai DE; lipsa audio RO nu produce eroare. Mesajele introduse de educatoare rămân exact cum au fost salvate, inclusiv dacă sunt în română în interfața DE.

## Verificări efectuate
- TypeScript (`tsc -b`): PASS.
- `npm run build` (prin runtime-ul npm disponibil): PASS.
- `node qa/i18n.cjs`: PASS — 40 voci RO + 1 fundal + 47 DE = 88 MP3, toate referințele existente, date localizate, chei de traducere.
- `node qa/audio-manager.cjs`: PASS — unlock, ducking, apăsări rapide, suspend/resume, fallback și cleanup.
- `node qa/bilingual-smoke.cjs`: PASS pe serverul de dezvoltare și versiunea de producție, desktop și emulare iPhone.
- Smoke RO: Luni, Septembrie, Însorit, Cald, început, întrebarea meteo, final.
- Smoke DE: Montag, September, Frühling, Sonnig, Kühl, Fröhlich, Mädchen, Frühstück, început și final.
- RO/DE/RO: state-ul salvat rămâne identic; prezența, anotimpul, vremea, emoția și ținutele independente fată/băiat se păstrează. O fotografie de test rămâne identică după comutare și reîncărcare din IndexedDB.
- Pe încărcare nu sunt create playere înainte de interacțiune; comutarea limbii nu pornește voci.
- Toate cele 88 de MP3-uri au HTTP 200 și conținut nevid pe subpath-ul de producție.
- Fișierele DE sunt identice byte cu byte cu arhiva; toate MP3-urile preexistente sunt nemodificate.
- Capturile desktop și mobil au fost inspectate; selectorul, etichetele și garderoba nu produc overflow orizontal.

Limită: emularea iPhone rulează în Chromium/Edge, nu pe un iPhone fizic sau în Safari real. Nu se pretinde verificare pe hardware iOS/Tizen.

## Fișiere create
- `src/i18n/LanguageContext.tsx`
- `src/i18n/translations.ts`
- `qa/i18n.cjs`
- `qa/bilingual-smoke.cjs`
- `RAPORT_RO_DE.md` (acest raport)

## Fișiere modificate
- `src/App.tsx`
- `src/components/AudioProvider.tsx`
- `src/components/ChildEmotionPicker.tsx`
- `src/components/ClothingMannequin.tsx`
- `src/components/Controls.tsx`
- `src/components/Header.tsx`
- `src/components/MorningBoard.tsx`
- `src/components/StorageRecovery.tsx`
- `src/hooks/useAudioPlayer.ts`
- `src/main.tsx`
- `src/pages/ClothingPage.tsx`
- `src/pages/Home.tsx`
- `src/pages/SelectionPages.tsx`
- `src/pages/SummaryPage.tsx`
- `src/pages/TeacherSettings.tsx`
- `src/styles.css`
- `src/utils/audioPrompts.ts`
- `src/utils/dateUtils.ts`

## MP3-uri DE adăugate
- `public/audio/de/anotimpuri/fruehling.mp3`
- `public/audio/de/anotimpuri/herbst.mp3`
- `public/audio/de/anotimpuri/sommer.mp3`
- `public/audio/de/anotimpuri/winter.mp3`
- `public/audio/de/emotii/aengstlich.mp3`
- `public/audio/de/emotii/froehlich.mp3`
- `public/audio/de/emotii/muede.mp3`
- `public/audio/de/emotii/ruhig.mp3`
- `public/audio/de/emotii/traurig.mp3`
- `public/audio/de/emotii/wuetend.mp3`
- `public/audio/de/luni/april.mp3`
- `public/audio/de/luni/august.mp3`
- `public/audio/de/luni/dezember.mp3`
- `public/audio/de/luni/februar.mp3`
- `public/audio/de/luni/januar.mp3`
- `public/audio/de/luni/juli.mp3`
- `public/audio/de/luni/juni.mp3`
- `public/audio/de/luni/maerz.mp3`
- `public/audio/de/luni/mai.mp3`
- `public/audio/de/luni/november.mp3`
- `public/audio/de/luni/oktober.mp3`
- `public/audio/de/luni/september.mp3`
- `public/audio/de/mesaje/ende.mp3`
- `public/audio/de/mesaje/start.mp3`
- `public/audio/de/personaje/junge.mp3`
- `public/audio/de/personaje/maedchen.mp3`
- `public/audio/de/rutina/aktivitaeten.mp3`
- `public/audio/de/rutina/fruehstueck.mp3`
- `public/audio/de/rutina/guten_morgen.mp3`
- `public/audio/de/rutina/mittagessen.mp3`
- `public/audio/de/rutina/ruhezeit.mp3`
- `public/audio/de/rutina/spielzeit.mp3`
- `public/audio/de/vreme/bewoelkt.mp3`
- `public/audio/de/vreme/kalt.mp3`
- `public/audio/de/vreme/kuehl.mp3`
- `public/audio/de/vreme/nebel.mp3`
- `public/audio/de/vreme/regen.mp3`
- `public/audio/de/vreme/schnee.mp3`
- `public/audio/de/vreme/sonnig.mp3`
- `public/audio/de/vreme/teilweise_bewoelkt.mp3`
- `public/audio/de/vreme/warm.mp3`
- `public/audio/de/vreme/wind.mp3`
- `public/audio/de/zile/dienstag.mp3`
- `public/audio/de/zile/donnerstag.mp3`
- `public/audio/de/zile/freitag.mp3`
- `public/audio/de/zile/mittwoch.mp3`
- `public/audio/de/zile/montag.mp3`
