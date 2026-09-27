# Ilustrațiile aplicației

Ilustrații originale create cu instrumentul integrat ImageGen (nu prin API/CLI), în stil de carte de povești, guașă și creion colorat. Fișierele sunt incluse local, fără servicii externe de imagini la utilizare.

- storybook-world.png: module și anotimpuri.
- storybook-weather.png: vreme și salutul dimineții.
- storybook-emotions.png: șase expresii ale unui personaj fictiv.
- storybook-clothes.png: îmbrăcăminte și activități.

Planșele se afișează prin ferestre CSS în src/components/StoryArt.tsx. Fotografiile încărcate de educatoare au prioritate față de avataruri. Nicio fotografie a copiilor nu a fost folosită pentru generare.

## Prompturile folosite

### Ecran principal și anotimpuri

Use case: illustration-story. Create one production sprite atlas for a Romanian preschool nature-calendar web app for children 2–3. Landscape canvas, exactly 4 columns by 3 rows, 12 equal rectangular cells, no visible grid, no text, no lettering, no numerals. Each illustration centered well inside its cell with generous blank margins, no artwork crossing cells. Warm uniform ivory background #faf8f1. Beautiful contemporary children's picture book gouache and colored pencil illustrations, rich cheerful yet gentle natural colors, soft brush texture, dimensional shading, sophisticated handmade art, NOT outline icons, NOT flat vector, NOT a UI mockup. Readable simple subjects, lovely friendly children with natural proportions.
Row 1 left to right: 1 a cheerful tabletop calendar with blank cream pages, strawberries and a tiny sunflower; 2 a round leafy tree with four softly merging seasonal foliage colors; 3 a radiant golden smiling sun emerging beside a fluffy blue-white cloud with a tiny rainbow; 4 a lovely mustard raincoat with blue boots and red scarf.
Row 2 left to right: 5 three friendly preschool children together holding hands, diverse appearances, waist-up; 6 two expressive smiling preschool child faces with rosy cheeks; 7 one proud preschool child wearing a little gold star badge, holding a small watering can; 8 an open picture book showing a little garden, sun and tiny house.
Row 3 left to right: 9 SPRING scene: flowering apple tree, green grass, pink flowers, butterfly; 10 SUMMER scene: abundant green tree, bright golden sun, sunflowers and strawberries; 11 AUTUMN scene: russet orange tree, falling leaves, pumpkin and mushrooms; 12 WINTER scene: snowy evergreen and snow-covered bare tree, snowman with red scarf, snowflakes.
All 12 illustrations must have identical painterly style and optical scale, every entire subject fully visible. No labels.

### Vreme

Use case: illustration-story. One production sprite atlas for a preschool picture-book web app. Exactly 4 columns by 2 rows of equal cells, landscape 2:1 canvas, no grid, no text. Each entire illustration centered within its own cell with blank margin. Uniform warm ivory #faf8f1 background. Exquisite children's book gouache, watercolor and colored pencil, luminous rich golden yellow, sky blue, soft turquoise, coral; soft painted texture and volume, not vector icons or schematic symbols. Very clear weather illustrations for 2-year-olds.
Top row: 1 large warm golden sun with friendly subtle face and luminous rays; 2 golden sun partially covered by a big fluffy white cloud, clearly partially cloudy; 3 cluster of overcast bluish grey fluffy clouds with NO sun, NO rain; 4 large grey-blue rain cloud with many clearly visible blue raindrops and a little blue puddle.
Bottom row: 5 blue-white snow cloud with large crystalline falling snowflakes and little snowdrift; 6 wind blowing autumn leaves and bending a small green sapling, visible flowing painted gusts; 7 a small tree softly obscured by horizontal bands of thick pale bluish fog, no sun; 8 a joyful little sun rising above a gentle green meadow and tiny flowers.
Consistent optical scale. Keep all individual illustrations separated, confined to exact cells. No borders, no typography, no colored rectangular backdrops.

### Emoții

Use case: illustration-story. Create ONE sprite atlas for a preschool emotion selection activity. Exactly 3 columns by 2 rows of equal square cells, landscape 3:2 composition. Six large isolated head-and-shoulder portraits of the SAME fictional 3-year-old child with short soft chestnut hair, a sage green sweater, warm light-brown skin and rounded gentle features. Beautiful modern children's picture-book watercolor and gouache, colored pencil details, warm vivid natural colors, hand-painted shading, not emoji, not flat vector. Background uniform ivory #faf8f1, no text, no border, no grid. Each bust centered wholly inside its exact cell with generous safe margin, no neighboring art crossing cells. Expression must be clear and understandable to a 2-year-old.
Top row left to right: 1 HAPPY, bright open eyes, broad warm smile, rosy cheeks; 2 SAD, downturned mouth, sad eyebrows, one small tear; 3 ANGRY, eyebrows lowered inward, closed pouting mouth, slightly flushed cheeks, not frightening.
Bottom row left to right: 4 SCARED, raised brows, wide eyes, small open mouth, shoulders slightly lifted; 5 TIRED, droopy eyelids, gently yawning, one hand near mouth; 6 CALM, eyes softly closed, very slight contented smile, relaxed shoulders.
Maintain exactly the same child's identity and sweater throughout. Attractive polished storybook illustration, subtle natural proportions. No text whatsoever.

### Emoții – fundal deschis

Edit only the background of this exact 3-column by 2-row children's expression sprite atlas. Replace ALL dark brown/olive blurred backdrop with perfectly uniform pale warm ivory #faf8f1. Keep every child, expression, pose, clothing, hair, brushwork, arrangement, image aspect ratio, and cell boundaries identical. Do not add elements or text. Maintain all six portraits at precisely the current positions. Background must be light cream, not brown, not olive, not gradient.

### Haine și activități

Use case: illustration-story. Create ONE 4 by 4 sprite atlas of children's clothing and daily routine objects, exactly 16 equal square cells on a square canvas. No text, no grid, no labels. Every object wholly contained in its cell, centered with 12% blank margin. Uniform light warm ivory #faf8f1 background. Delightful realistic children's picture-book gouache watercolor and colored pencil, vivid inviting colors, hand-painted fabric texture, soft volumetric shading, definitely not flat vector or outline icons. Clothing sized for a 3-year-old. Visually distinct silhouettes, no people.
Row 1: red short-sleeve t-shirt with a little embroidered flower; sky blue long-sleeve sweater; blue denim trousers; rose pink sleeveless dress with tiny white daisies.
Row 2: golden yellow hooded light rain jacket; warm thick plum-purple quilted winter coat with fleece collar; red knitted winter beanie with pompom; sage green summer baseball cap.
Row 3: pair of coral-red children's shoes; pair of blue rain boots; open colorful yellow-and-turquoise umbrella with wooden hooked handle; a long red-orange striped knitted scarf.
Row 4: pair of mustard mittens; a bright red apple with green leaf beside a pear; a small arrangement of colorful wooden toy blocks; a little blue pillow and a folded soft lavender blanket with a small golden moon above.
Strongly consistent children's book art, clean separation, entirely visible objects, no duplicated cells.

