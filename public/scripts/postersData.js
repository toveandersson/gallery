// const postersData = [
//     {
//       id: 1,
//       name: 'Snuva',
//       imageOg: 
//         '/images/scan_erilar19_2024-09-11-15-35-17.jpg',
//       image: "/images/ImgReducedSize/snuva_reduced_size2.jpg",
//       price: 10.99,
//       desc: `Avaliable in 15x15cm and 20x20cm. FSC certified, thick paper. 240 g / ㎡`,
//       // `snuva, vinterslöja, vintertäcke, slägga sig`
//       available: true,
//       sizes: { '15x15cm': 2, '20x20cm': 1}
//     },
//     {
//       id: 2,
//       name: 'Sola sig',
//       imageOg:
//         '/images/scan_erilar19_2024-09-11-15-34-46.jpeg',
//       image: "/images/ImgReducedSize/sunny_reduced_size.jpg",
//       price: 29.98,
//       desc: "Avaliable in 15x15cm and 20x20cm. FSC certified, thick paper.",
//       // desc: `sunny, sola sig`,
//       available: true,
//       sizes: { '15x15cm': 2, '20x20cm': 1 }
//     },
//     {
//       id: 3,
//       name: 'Gräshoppa',
//       imageOg:
//         '/images/grasshopper.jpg',
//         //'images/scan_erilar19_2024-10-24-15-21-53.jpeg'
//       image: "/images/ImgReducedSize/grasshopper_reduced_size.jpg",
//       price: 29.98,
//       desc: "Avaliable in 15x15cm and 20x20cm. FSC certified, thick paper.",
//       // desc: `gräshoppa, intellektuell, grasshopper, anstränga sig, slöa sig, `,
//       available: true,
//       sizes: { '15x15cm': 2, '20x20cm': 1 }
//     },
//     {
//       id: 4,
//       name: 'Förundra sig',
//       imageOg: 
//       '/images/snarl_og.jpeg',
//         //'images/snarl_og.jpeg',
//       image: "/images/ImgReducedSize/snarl_reduced_size.jpg",
//       price: 9.99,
//       desc: "Avaliable in 15x15cm and 20x20cm. FSC certified, thick paper.",
//       // desc: `snorkel, virrvarr, snirkla sig, förundra sig`,
//       available: true,
//       sizes: { '15x15cm': 2, '20x20cm': 1 }
//     },
//     {
//       id: 5,
//       name: 'Genomskåda',
//       imageOg:
//         '/images/scan_erilar19_2024-10-24-15-17-41 - Copy.jpeg',
//       image: "/images/ImgReducedSize/genomskåda_reduced_size.jpg",
//       price: 29.98,
//       desc: "Avaliable in 15x15cm and 20x20cm. FSC certified, thick paper.",
//       // desc: `Bedöva sig, beröva sig, begrava sig, belamra, genomskåda dig, Eklekticism, beskåda`,
//       available: true,
//       sizes: { '15x15cm': 2, '20x20cm': 1 }
//     },
//     {
//       id: 6,
//       name: 'Grunna',
//       imageOg:
//         '/images/grandma_og.jpg',
//       image:"/images/ImgReducedSize/grandma_reduced_size.jpg",
//       price: 9.99,
//       desc: "Avaliable in 15x15cm and 20x20cm. FSC certified, thick paper.",
//       // desc: `tant grädde, tant grå, tant grädde och lin`,
//       available: true,
//       sizes: { '15x15cm': 2, '20x20cm': 1 }
//     },
//     {
//       id: 7,
//       name: 'Deco',
//       imageOg:
//         '/images/scan_erilar19_2024-10-24-15-22-53 - Copy.jpeg',
//       image: "/images/ImgReducedSize/modern_reduced_size.jpg",
//       price: 10.99,
//       desc: "dekorera",
//       available: true,
//       sizes: { '15x15cm': 2, '20x20cm': 1 }
//     },
//     {
//       id: 8,
//       name: 'Skruva sig',
//       imageOg:
//         '/images/scan_erilar19_2024-10-24-15-22-53.jpeg',
//       image: "/images/ImgReducedSize/snailing_reduced_size.jpg",
//       price: 9.99,
//       desc: "Avaliable in 15x15cm and 20x20cm. FSC certified, thick paper.",
//       // desc: `skruva sig, snailing`,
//       available: true,
//       sizes: { '15x15cm': 2, '20x20cm': 1 }
//     },
//     {
//       id: 9,
//       name: 'Wave',
//       imageOg:
//       '/images/scan_erilar19_2024-10-24-15-12-18.jpeg',
//       image: "/images/ImgReducedSize/blue_reduced_size.jpg",
//       price: 39.95,
//       desc: "Avaliable in 15x15cm and 20x20cm. FSC certified, thick paper.",
//       available: true,
//       sizes: { '15x15cm': 2, '20x20cm': 1 }
//     },
//     {
//       id: 10,
//       name: 'fro-fro',
//       imageOg:
//         '/images/scan_erilar19_2024-10-24-15-20-10 - Copy.jpeg',
//       image: "/images/ImgReducedSize/fro-fro_reduced_size.jpg",
//       price: 9.99,
//       desc: "Avaliable in 15x20cm and 17x23cm. FSC certified, thick paper.",
//       // desc: `aspect ratio: 15:20, fråga sig, undrande, Fro-fro`,
//       available: true,
//       sizes: { '15x20cm': 2, '17x23cm': 1 }
//     },
//     {
//       id: 11,
//       name: 'Meeting',
//       imageOg:
//         '/images/scan_erilar19_2024-10-24-15-17-41.jpeg',
//       image: "/images/ImgReducedSize/meeting_reduced_size.jpg",
//       price: 10.99,
//       desc: "Avaliable in 15x21cm and 20x28cm. FSC certified, thick paper.",
//       // desc: `möte, möta sig, doodle meeting,  aspect ratio: 15:21  (kan den vara 14.8:21 dock, äkta a5 storleken)`,
//       available: true,
//       sizes: { '15x21cm': 2, '20x28cm': 1 }
//     },
//     {
//       id: 12,
//       name: 'Bebop',
//       imageOg:
//         '/images/scan_erilar19_2024-10-24-15-25-02 - Copy.jpeg',
//       image: "/images/ImgReducedSize/bebop_reduced_size.jpg",
//       price: 10.99,
//       desc: "Avaliable in 15x20cm and 17x23cm. FSC certified, thick paper.",
//       // desc: `bebop,   aspect ratio: 15:20`,
//       available: true,
//       sizes: { '15x20cm': 2, '17x23cm': 1 }
//     },
//     {
//       id: 13,
//       name: 'Pigeon',
//       imageOg:
//         '/images/scan_erilar19_2024-11-18-16-56-27.jpeg',
//       image: "/images/ImgReducedSize/pigeon_reduced_size.jpg",
//       price: 10.99,
//       desc: "Avaliable in 15x15cm and 20x20cm. FSC certified, thick paper.",
//       // desc: `Pigon`,
//       available: true
//     },
//     {
//       id: 14,
//       name: 'Chroma',
//       imageOg:
//         '/images/scan_erilar19_2024-11-18-16-53-58 - Copy.jpeg',
//       image: "/images/ImgReducedSize/chroma_reduced_size.jpg",
//       price: 10.99,
//       desc: "Avaliable in 15x15cm and 20x20cm. FSC certified, thick paper.",
//       // desc: `chroma, circus`,
//       available: true
//     },
//     {
//       id: 15,
//       name: 'Gnarl',
//       imageOg:
//         '/images/scan_erilar19_2024-10-24-15-25-37.jpeg',
//       image: "/images/ImgReducedSize/gnarl_reduced_size.jpg",
//       price: 29.98,
//       desc: "Avaliable in 15x15cm and 20x20cm. FSC certified, thick paper.",
//       // desc: `fönsterslickare, windowlicker, belamra`,
//       available: true
//     },
//     {
//       id: 16,
//       name: 'Månsken',
//       imageOg: 
//       '/images/snarl_og_noLash copy.jpg',
//         //'images/snarl_og.jpeg',
//       image: "/images/ImgReducedSize/snarlV2_reduced_size.jpg",
//       price: 9.99,
//       desc: "Avaliable in 15x15cm and 20x20cm. FSC certified, thick paper.",
//       // desc: `snorkel, virrvarr, snirkla sig, snorkla sig`,
//       available: true
//     },
//     {
//       id: 17,
//       name: 'Literal',
//       imageOg:
//         '/images/scan_erilar19_2024-10-24-15-23-48 - Copy.jpeg',
//       image: "/images/ImgReducedSize/literal_reduced_size.jpg",
//       price: 39.95,
//       desc: "Avaliable in 15x15cm and 20x20cm. FSC certified, thick paper.",
//       // desc: `vinterslöja, genomskåda, borra, se igenom, täckmantel, månsken`,
//       available: true
//     },
//     {
//       id: 18,
//       name: 'Floral',
//       imageOg:
//       '/images/floral.jpg',
//       image: "/images/ImgReducedSize/floral_reduced_size.jpg",
//       price: 39.95,
//       desc: "Avaliable in 15x15cm and 20x20cm. FSC certified, thick paper.",
//       // desc: `Floral, Betänketid`,
//       available: true
//     },
//     {
//       id: 19,
//       name: 'Beröva sig',
//       imageOg:
//       '/images/scan_erilar19_2024-11-18-16-53-58.jpeg',
//       image: "/images/ImgReducedSize/pink_reduced_size.jpg",
//       price: 10.99,
//       desc: "Avaliable in 15x15cm and 20x20cm. FSC certified, thick paper.",
//       // desc: `Pink, beröva sig, Diskbänksrealism, Dekandens, fördärv`,
//       available: true
//     },
//     {
//       id: 20,
//       name: 'Snarlik',
//       imageOg:
//       '/images/scan_erilar19_2024-10-24-15-20-10.jpeg',
//       image: "/images/ImgReducedSize/ponyo_reduced_size.jpg",
//       price: 39.95,
//       desc: "Avaliable in 15x15cm and 20x20cm. FSC certified, thick paper.",
//       // desc: `rannsaka sig, snarlik, Ponyo`,
//       available: true
//     },
//     {
//       id: 21,
//       name: 'Rannsakan',
//       imageOg:
//         '/images/scan_erilar19_2024-11-18-16-57-06.jpeg',
//       image: "/images/ImgReducedSize/emma_reduced_size.jpg",
//       price: 10.99,
//       desc: "Avaliable in 15x15cm and 20x20cm. FSC certified, thick paper.",
//       // desc: `tillrättavisa, stirra sig, rannsakan, emma`,
//       available: true
//     },
//     {
//       id: 22,
//       name: 'Bundle',
//       image:
//         'images/scan_erilar19_2024-10-24-15-23-48.jpeg',
//       price: 29.98,
//       desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
//       available: false
//     },
//     {
//       id: 23,
//       name: 'Pastor',
//       image:
//         'images/scan_erilar19_2024-10-24-15-25-37 - Copy.jpeg',
//       price: 39.95,
//       desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
//       available: false
//     },
//     {
//       id: 24,
//       name: 'Scifi',
//       image:
//         'images/scan_erilar19_2024-10-24-15-26-54 - Copy.jpeg',
//       price: 10.99,
//       desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
//       available: false
//     },
//     {
//       id: 25,
//       name: 'Tiger',
//       image:
//         'images/scan_erilar19_2024-10-24-15-26-54.jpeg',
//       price: 9.99,
//       desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
//       available: false
//     },
//     {
//       id: 26,
//       name: 'Stock',
//       image:
//         'images/scan_erilar19_2024-10-24-15-27-26 - Copy.jpeg',
//       price: 39.95,
//       desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
//       available: false
//     },
//     {
//       id: 27,
//       name: 'Features',
//       image:
//         'images/scan_erilar19_2024-10-24-15-27-26.jpeg',
//       price: 29.98,
//       desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
//       available: false
//     },
//     {
//       id: 28,
//       name: 'Creature',
//       image:
//         'images/scan_erilar19_2024-10-24-15-28-24.jpeg',  
//       price: 10.99,
//       desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
//       available: false
//     },
//     {
//       id: 29,
//       name: 'Jpeg',
//       image:
//         'images/scan_erilar19_2024-11-18-16-56-27 - Copy.jpeg',
//       price: 10.99,
//       desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
//       available: false
//     }
//   ]
//   const people = [
//     { id: 1, name: 'john' },
//     { id: 2, name: 'peter' },
//     { id: 3, name: 'susan' },
//     { id: 4, name: 'anna' },
//     { id: 5, name: 'emma' },
//   ]


//   //export default posters
//   module.exports = postersData 
  