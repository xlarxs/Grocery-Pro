/**
 * Grocery Pro - Kategorien & Unterkategorien
 * 18 Hauptkategorien mit Unterkategorien
 */
const GroceryCategories = [
  {
    id: 'obst-gemuese',
    name: 'Obst & Gemüse',
    icon: '🥬',
    color: '#4CAF50',
    subcategories: [
      { id: 'aepfel-birnen', name: 'Äpfel & Birnen' },
      { id: 'zitrusfruechte', name: 'Zitrusfrüchte' },
      { id: 'beeren', name: 'Beeren' },
      { id: 'steinobst', name: 'Steinobst' },
      { id: 'exotische-fruechte', name: 'Exotische Früchte' },
      { id: 'salate', name: 'Salate' },
      { id: 'tomaten-gurken', name: 'Tomaten & Gurken' },
      { id: 'wurzelgemuese', name: 'Wurzelgemüse' },
      { id: 'kohlgemuese', name: 'Kohlgemüse' },
      { id: 'zwiebeln-knoblauch', name: 'Zwiebeln & Knoblauch' },
      { id: 'pilze', name: 'Pilze' },
      { id: 'kraeuter-frisch', name: 'Frische Kräuter' },
      { id: 'tiefkuehl-gemuese', name: 'Tiefkühl-Gemüse' }
    ]
  },
  {
    id: 'milchprodukte',
    name: 'Milchprodukte',
    icon: '🥛',
    color: '#2196F3',
    subcategories: [
      { id: 'milch', name: 'Milch' },
      { id: 'joghurt', name: 'Joghurt' },
      { id: 'quark', name: 'Quark' },
      { id: 'kaese-schnitt', name: 'Schnittkäse' },
      { id: 'kaese-weich', name: 'Weichkäse' },
      { id: 'kaese-hart', name: 'Hartkäse' },
      { id: 'butter-margarine', name: 'Butter & Margarine' },
      { id: 'sahne', name: 'Sahne & Cremefine' },
      { id: 'eier', name: 'Eier' },
      { id: 'pudding-dessert', name: 'Pudding & Desserts' },
      { id: 'pflanzliche-milch', name: 'Pflanzliche Milchalternativen' }
    ]
  },
  {
    id: 'brot-backwaren',
    name: 'Brot & Backwaren',
    icon: '🍞',
    color: '#FF9800',
    subcategories: [
      { id: 'vollkornbrot', name: 'Vollkornbrot' },
      { id: 'weissbrot', name: 'Weißbrot & Toast' },
      { id: 'broetchen', name: 'Brötchen' },
      { id: 'croissants', name: 'Croissants & Plunder' },
      { id: 'kuchen-torten', name: 'Kuchen & Torten' },
      { id: 'backzutaten', name: 'Backzutaten' },
      { id: 'muesli-cerealien', name: 'Müsli & Cerealien' },
      { id: 'knäckebrot', name: 'Knäckebrot & Zwieback' }
    ]
  },
  {
    id: 'fleisch-fisch',
    name: 'Fleisch & Fisch',
    icon: '🥩',
    color: '#F44336',
    subcategories: [
      { id: 'rind', name: 'Rindfleisch' },
      { id: 'schwein', name: 'Schweinefleisch' },
      { id: 'gefluegel', name: 'Geflügel' },
      { id: 'hackfleisch', name: 'Hackfleisch' },
      { id: 'wurst-aufschnitt', name: 'Wurst & Aufschnitt' },
      { id: 'fisch-frisch', name: 'Frischer Fisch' },
      { id: 'fisch-tk', name: 'Tiefkühlfisch' },
      { id: 'meeresfruechte', name: 'Meeresfrüchte' },
      { id: 'vegetarisch-fleisch', name: 'Vegetarische Alternativen' }
    ]
  },
  {
    id: 'tiefkuehlprodukte',
    name: 'Tiefkühlprodukte',
    icon: '🧊',
    color: '#00BCD4',
    subcategories: [
      { id: 'tk-pizza', name: 'Pizza' },
      { id: 'tk-gemuese', name: 'Gemüse' },
      { id: 'tk-pommes', name: 'Pommes & Kartoffelprodukte' },
      { id: 'tk-fertiggerichte', name: 'Fertiggerichte' },
      { id: 'tk-fisch', name: 'Fisch & Meeresfrüchte' },
      { id: 'tk-eis', name: 'Eis & Desserts' },
      { id: 'tk-backwaren', name: 'Backwaren' },
      { id: 'tk-obst', name: 'Obst & Beeren' }
    ]
  },
  {
    id: 'getraenke',
    name: 'Getränke',
    icon: '🥤',
    color: '#9C27B0',
    subcategories: [
      { id: 'wasser', name: 'Mineralwasser' },
      { id: 'saft', name: 'Säfte & Nektar' },
      { id: 'limonade', name: 'Limonaden & Cola' },
      { id: 'bier', name: 'Bier' },
      { id: 'energy-drinks', name: 'Energy Drinks' },
      { id: 'tee', name: 'Tee' },
      { id: 'kaffee', name: 'Kaffee' },
      { id: 'sirup', name: 'Sirup & Konzentrate' }
    ]
  },
  {
    id: 'suesswaren-snacks',
    name: 'Süßwaren & Snacks',
    icon: '🍫',
    color: '#795548',
    subcategories: [
      { id: 'schokolade', name: 'Schokolade' },
      { id: 'bonbons', name: 'Bonbons & Kaubonbons' },
      { id: 'kekse', name: 'Kekse & Waffeln' },
      { id: 'chips', name: 'Chips & Salzgebäck' },
      { id: 'nuesse', name: 'Nüsse & Trockenfrüchte' },
      { id: 'riegel', name: 'Müsliriegel & Fruchtriegel' },
      { id: 'gummibaerchen', name: 'Fruchtgummi & Lakritz' },
      { id: 'eis-sommer', name: 'Eiscreme' }
    ]
  },
  {
    id: 'konserven-fertiggerichte',
    name: 'Konserven & Fertiggerichte',
    icon: '🥫',
    color: '#607D8B',
    subcategories: [
      { id: 'dosengemuese', name: 'Dosengemüse' },
      { id: 'dosenobst', name: 'Dosenobst' },
      { id: 'suppen-eintoepfe', name: 'Suppen & Eintöpfe' },
      { id: 'pasta-sossen', name: 'Pastasaucen' },
      { id: 'fertiggerichte', name: 'Fertiggerichte' },
      { id: 'thunfisch-sardinen', name: 'Thunfisch & Sardinen' },
      { id: 'tuetensuppen', name: 'Tütensuppen & Instantgerichte' },
      { id: 'nudeln-reis', name: 'Nudeln & Reis' }
    ]
  },
  {
    id: 'gewuerze-sossen',
    name: 'Gewürze & Soßen',
    icon: '🧂',
    color: '#FF5722',
    subcategories: [
      { id: 'salz-pfeffer', name: 'Salz & Pfeffer' },
      { id: 'gewuerzmischungen', name: 'Gewürzmischungen' },
      { id: 'ketchup-senf', name: 'Ketchup & Senf' },
      { id: 'essig-oel', name: 'Essig & Öl' },
      { id: 'sojasauce-asia', name: 'Sojasauce & Asia-Saucen' },
      { id: 'dressings', name: 'Dressings' },
      { id: 'mayonnaise', name: 'Mayonnaise & Remoulade' },
      { id: 'getrocknete-kraeuter', name: 'Getrocknete Kräuter' }
    ]
  },
  {
    id: 'hygiene-koerperpflege',
    name: 'Hygiene & Körperpflege',
    icon: '🧴',
    color: '#E91E63',
    subcategories: [
      { id: 'duschgel-seife', name: 'Duschgel & Seife' },
      { id: 'shampoo', name: 'Shampoo & Spülung' },
      { id: 'zahnpflege', name: 'Zahnpflege' },
      { id: 'deo', name: 'Deodorant' },
      { id: 'hautpflege', name: 'Hautpflege' },
      { id: 'rasierer', name: 'Rasur & Bartpflege' },
      { id: 'damenhygiene', name: 'Damenhygiene' },
      { id: 'sonnenschutz', name: 'Sonnenschutz' }
    ]
  },
  {
    id: 'haushalt-reinigung',
    name: 'Haushalt & Reinigung',
    icon: '🧹',
    color: '#3F51B5',
    subcategories: [
      { id: 'waschmittel', name: 'Waschmittel' },
      { id: 'spuelmittel', name: 'Spülmittel' },
      { id: 'allzweckreiniger', name: 'Allzweckreiniger' },
      { id: 'toilettenpapier', name: 'Toilettenpapier & Küchentücher' },
      { id: 'muellbeutel', name: 'Müllbeutel' },
      { id: 'schwamm-tuecher', name: 'Schwämme & Tücher' },
      { id: 'raumduft', name: 'Raumduft & Lufterfrischer' },
      { id: 'batterien', name: 'Batterien & Glühbirnen' }
    ]
  },
  {
    id: 'baby-kinder',
    name: 'Baby & Kinder',
    icon: '👶',
    color: '#FFC107',
    subcategories: [
      { id: 'windeln', name: 'Windeln' },
      { id: 'babymilch', name: 'Babymilch & Brei' },
      { id: 'babynahrung-glas', name: 'Gläschen' },
      { id: 'babypflege', name: 'Babypflege' },
      { id: 'kindersnacks', name: 'Kindersnacks' },
      { id: 'kindergetraenke', name: 'Kindergetränke' }
    ]
  },
  {
    id: 'tiernahrung',
    name: 'Tiernahrung',
    icon: '🐾',
    color: '#8BC34A',
    subcategories: [
      { id: 'hundefutter', name: 'Hundefutter' },
      { id: 'katzenfutter', name: 'Katzenfutter' },
      { id: 'vogelfutter', name: 'Vogelfutter' },
      { id: 'fischfutter', name: 'Fischfutter' },
      { id: 'kleintierfutter', name: 'Kleintierfutter' },
      { id: 'tier-zubehoer', name: 'Tierzubehör' }
    ]
  },
  {
    id: 'bio-naturkost',
    name: 'Bio & Naturkost',
    icon: '🌿',
    color: '#2E7D32',
    subcategories: [
      { id: 'bio-obst-gemuese', name: 'Bio-Obst & Gemüse' },
      { id: 'bio-milch', name: 'Bio-Milchprodukte' },
      { id: 'bio-fleisch', name: 'Bio-Fleisch' },
      { id: 'bio-brot', name: 'Bio-Brot & Backwaren' },
      { id: 'superfoods', name: 'Superfoods' },
      { id: 'tofu-tempeh', name: 'Tofu & Tempeh' },
      { id: 'bio-snacks', name: 'Bio-Snacks' },
      { id: 'bio-getraenke', name: 'Bio-Getränke' }
    ]
  },
  {
    id: 'internationale-spezialitaeten',
    name: 'Internationale Spezialitäten',
    icon: '🌍',
    color: '#FF6F00',
    subcategories: [
      { id: 'asiatisch', name: 'Asiatische Küche' },
      { id: 'italienisch', name: 'Italienische Spezialitäten' },
      { id: 'tuerkisch-arabisch', name: 'Türkisch & Arabisch' },
      { id: 'mexikanisch', name: 'Mexikanisch' },
      { id: 'indisch', name: 'Indische Küche' },
      { id: 'amerikanisch', name: 'Amerikanische Produkte' },
      { id: 'griechisch', name: 'Griechische Spezialitäten' }
    ]
  },
  {
    id: 'wein-spirituosen',
    name: 'Wein & Spirituosen',
    icon: '🍷',
    color: '#880E4F',
    subcategories: [
      { id: 'rotwein', name: 'Rotwein' },
      { id: 'weisswein', name: 'Weißwein' },
      { id: 'rose', name: 'Rosé' },
      { id: 'sekt-prosecco', name: 'Sekt & Prosecco' },
      { id: 'spirituosen', name: 'Spirituosen' },
      { id: 'likoer', name: 'Likör' },
      { id: 'alkoholfrei', name: 'Alkoholfreie Weine & Biere' }
    ]
  },
  {
    id: 'drogerie-gesundheit',
    name: 'Drogerie & Gesundheit',
    icon: '💊',
    color: '#00897B',
    subcategories: [
      { id: 'vitamine', name: 'Vitamine & Nahrungsergänzung' },
      { id: 'erkaeltung', name: 'Erkältung & Grippe' },
      { id: 'pflaster-verband', name: 'Pflaster & Verband' },
      { id: 'schmerzmittel', name: 'Schmerzmittel' },
      { id: 'augenpflege', name: 'Augenpflege' },
      { id: 'fusspflege', name: 'Fußpflege' },
      { id: 'insektenschutz', name: 'Insektenschutz' }
    ]
  },
  {
    id: 'schreibwaren-haushaltswaren',
    name: 'Schreibwaren & Haushaltswaren',
    icon: '✏️',
    color: '#546E7A',
    subcategories: [
      { id: 'stifte', name: 'Stifte & Marker' },
      { id: 'papier-bloecke', name: 'Papier & Blöcke' },
      { id: 'klebstoff', name: 'Klebstoff & Klebeband' },
      { id: 'kerzen', name: 'Kerzen & Deko' },
      { id: 'geschenkpapier', name: 'Geschenkpapier & Taschen' },
      { id: 'kuechenhelfer', name: 'Küchenhelfer' }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GroceryCategories;
}
