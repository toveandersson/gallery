const postersData = [
    {
      id: 1,
      name: 'Snuva',
      image:
        'images/scan_erilar19_2024-09-11-15-35-17.jpg',
      price: 10.99,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: true
    },
    {
      id: 2,
      name: 'Sunny',
      image:
        '/images/scan_erilar19_2024-09-11-15-34-46.jpeg',
      price: 29.98,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: true
    },
    {
      id: 10,
      name: 'Grasshopper',
      image:
        'images/grasshopper.jpg',
        //'images/scan_erilar19_2024-10-24-15-21-53.jpeg'
      price: 29.98,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: true
    },
    {
      id: 16,
      name: 'Snarl',
      image: 
      'images/noLash.jpg',
        //'images/snarl_og.jpeg',
      price: 9.99,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: true
    },
    {
      id: 5,
      name: 'Eklekticism',
      image:
        'images/scan_erilar19_2024-10-24-15-17-41 - Copy.jpeg',
      price: 29.98,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: true
    },
    {
      id: 6,
      name: 'Grandma',
      image:
        'images/grandma_og.jpg',
      price: 9.99,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: true
    },
    {
      id: 11,
      name: 'Deco',
      image:
        'images/scan_erilar19_2024-10-24-15-22-53 - Copy.jpeg',
      price: 10.99,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: true
    },
    {
      id: 4,
      name: 'Snailing',
      image:
        'images/scan_erilar19_2024-10-24-15-22-53.jpeg',
      price: 9.99,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: true
    },
    {
      id: 12,
      name: 'Wave',
      image:
      'images/scan_erilar19_2024-10-24-15-12-18.jpeg',
      price: 39.95,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: true
    },
    {
      id: 8,
      name: 'Fro-fro',
      image:
        'images/scan_erilar19_2024-10-24-15-20-10 - Copy.jpeg',
      price: 9.99,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: true
    },
    {
      id: 7,
      name: 'Meeting',
      image:
        'images/scan_erilar19_2024-10-24-15-17-41.jpeg',
      price: 10.99,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: true
    },
    {
      id: 15,
      name: 'Cozy',
      image:
        'images/scan_erilar19_2024-10-24-15-25-02 - Copy.jpeg',
      price: 10.99,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: true
    },
    {
      id: 25,
      name: 'Hello',
      image:
        'images/scan_erilar19_2024-11-18-16-56-27.jpeg',
      price: 10.99,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: true
    },
    {
      id: 24,
      name: 'Circus',
      image:
        'images/scan_erilar19_2024-11-18-16-53-58 - Copy.jpeg',
      price: 10.99,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: true
    },
    {
      id: 18,
      name: 'Gnarl',
      image:
        'images/scan_erilar19_2024-10-24-15-25-37.jpeg',
      price: 29.98,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: true
    },
    {
      id: 26,
      name: 'Pink',
      image:
      'images/scan_erilar19_2024-11-18-16-53-58.jpeg',
      price: 10.99,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: true
    },
    {
      id: 13,
      name: 'Literal',
      image:
        'images/scan_erilar19_2024-10-24-15-23-48 - Copy.jpeg',
      price: 39.95,
      desc: `vinterslöja, genomskåda, borra, se igenom, täckmantel`,
      available: true
    },
    {
      id: 3,
      name: 'Floral',
      image:
      '/images/floral.jpg',
      price: 39.95,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: true
    },
    {
      id: 26,
      name: 'Jpeg',
      image:
        'images/scan_erilar19_2024-11-18-16-56-27 - Copy.jpeg',
      price: 10.99,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: true
    },
    {
      id: 26,
      name: 'Emma',
      image:
        'images/scan_erilar19_2024-11-18-16-57-06.jpeg',
      price: 10.99,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: true
    },
    {
      id: 9,
      name: 'Ponyo',
      image:
      'images/scan_erilar19_2024-10-24-15-20-10.jpeg',
      price: 39.95,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: true
    },
    {
      id: 14,
      name: 'Bundle',
      image:
        'images/scan_erilar19_2024-10-24-15-23-48.jpeg',
      price: 29.98,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: false
    },
    {
      id: 17,
      name: 'Pastor',
      image:
        'images/scan_erilar19_2024-10-24-15-25-37 - Copy.jpeg',
      price: 39.95,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: false
    },
    {
      id: 19,
      name: 'Scifi',
      image:
        'images/scan_erilar19_2024-10-24-15-26-54 - Copy.jpeg',
      price: 10.99,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: false
    },
    {
      id: 20,
      name: 'Tiger',
      image:
        'images/scan_erilar19_2024-10-24-15-26-54.jpeg',
      price: 9.99,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: false
    },
    {
      id: 21,
      name: 'Stock',
      image:
        'images/scan_erilar19_2024-10-24-15-27-26 - Copy.jpeg',
      price: 39.95,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: false
    },
    {
      id: 22,
      name: 'Features',
      image:
        'images/scan_erilar19_2024-10-24-15-27-26.jpeg',
      price: 29.98,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: false
    },
    {
      id: 23,
      name: 'Creature',
      image:
        'images/scan_erilar19_2024-10-24-15-28-24.jpeg',  
      price: 10.99,
      desc: `I'm baby direct trade farm-to-table hell of, YOLO readymade raw denim venmo whatever organic gluten-free kitsch schlitz irony af flexitarian.`,
      available: false
    },
  ]
  const people = [
    { id: 1, name: 'john' },
    { id: 2, name: 'peter' },
    { id: 3, name: 'susan' },
    { id: 4, name: 'anna' },
    { id: 5, name: 'emma' },
  ]

  //export default posters
  module.exports = postersData 
  