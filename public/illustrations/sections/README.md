# Pictogramele secțiunilor

`section-icons-v1.png` este atlasul local al celor opt pictograme 3D, generat cu instrumentul integrat imagegen. Nu se descarcă imagini în timpul utilizării aplicației.

Grilă: 4 coloane × 2 rânduri, celule pătrate. Ordine: calendar, anotimp, vreme, haine / prezență, emoții, responsabil, recapitulare. Fundalul transparent și umbrele originale sunt păstrate.

Componenta `src/components/SectionArt.tsx` centralizează corespondența. Pentru înlocuire, adăugați un atlas nou cu aceeași grilă și actualizați numele fișierului în componentă. Păstrați obiectele în interiorul celulelor și marginile libere. Nu sunt necesare modificări ale datelor salvate sau ale navigării.

## Promptul final

Create a single production UI sprite atlas, 4 columns by 2 rows, eight equal square cells on a 2:1 canvas. Premium soft 3D preschool educational app icon family, polished clay and satin surfaces, warm ivory background exactly uniform, warm pastel sage, peach, sky blue and butter yellow. Consistent upper-left studio lighting, gentle ambient occlusion and tiny soft contact shadows. Each object centered in its cell, entirely inside central 76% with generous empty margins, no dividers, no letters, no numbers, no watermark. Row 1 left to right: elegant spiral desk calendar with blank little square date grid; beautiful rounded tree combining spring pink blossoms green summer leaves and amber autumn leaves; golden sunshine behind a fluffy blue-white cloud; neat outfit of peach jacket on hanger with blue trousers and small shoes. Row 2 left to right: group of three smiling diverse preschool children with natural proportions and short necks, bust portraits; expressive glossy golden happy emoji sphere; lovely gold star award badge with sage ribbon; open storybook showing a miniature daily routine with sunshine, toy blocks, warm meal plate and crescent moon. All eight icons equally refined, sculptural, luminous, clear at small size, modern storybook premium finish, matching perspective and color temperature. This is one unified atlas asset, not a webpage.

Încadrarea efectivă este definită prin dreptunghiuri SVG în componentă (imagine sursă 1774 × 887 px); acestea compensează marginile diferite ale ilustrațiilor. La schimbarea atlasului, actualizați și aceste dreptunghiuri și dimensiunile sursei.
