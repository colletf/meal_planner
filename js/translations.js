const DAYS_FR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const CUISINES = [
    { id: 'french', label: 'Française' },
    { id: 'italian', label: 'Italienne' },
    { id: 'chinese', label: 'Chinoise' },
    { id: 'japanese', label: 'Japonaise' },
    { id: 'indian', label: 'Indienne' },
    { id: 'mexican', label: 'Mexicaine' },
    { id: 'thai', label: 'Thaïlandaise' },
    { id: 'mediterranean', label: 'Méditerranéenne' },
    { id: 'american', label: 'Américaine' },
    { id: 'spanish', label: 'Espagnole' }
];

const DIETS = [
    { id: 'vegetarian', label: 'Végétarien' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'gluten free', label: 'Sans gluten' },
    { id: 'dairy free', label: 'Sans lactose' },
    { id: 'ketogenic', label: 'Cétogène' },
    { id: 'pescetarian', label: 'Pescétarien' }
];

const MEAL_TYPES = [
    { id: 'main course', label: 'Plat principal' },
    { id: 'soup', label: 'Soupe' },
    { id: 'salad', label: 'Salade' },
    { id: 'appetizer', label: 'Entrée' },
    { id: 'dessert', label: 'Dessert' },
    { id: 'side dish', label: 'Accompagnement' }
];

const GROCERY_CATEGORIES = {
    'Boucherie': {
        keywords: ['meat', 'beef', 'pork', 'lamb', 'chicken', 'turkey', 'veal', 'poultry', 'sausage', 'bacon', 'ham'],
        order: 1,
        color: 'meat'
    },
    'Poissonnerie': {
        keywords: ['seafood', 'fish', 'salmon', 'tuna', 'shrimp', 'crab', 'lobster', 'cod', 'tilapia', 'shellfish'],
        order: 2,
        color: 'fish'
    },
    'Fruits & Légumes': {
        keywords: ['produce', 'vegetable', 'fruit', 'fresh', 'lettuce', 'tomato', 'onion', 'garlic', 'potato', 'carrot', 'apple', 'banana', 'lemon', 'orange', 'herbs', 'salad'],
        order: 3,
        color: 'vegetable'
    },
    'Crémerie': {
        keywords: ['dairy', 'milk', 'cheese', 'yogurt', 'butter', 'cream', 'egg'],
        order: 4,
        color: 'dairy'
    },
    'Boulangerie': {
        keywords: ['bakery', 'bread', 'baguette', 'croissant'],
        order: 5,
        color: 'other'
    },
    'Épicerie': {
        keywords: ['pasta', 'rice', 'grain', 'cereal', 'flour', 'sugar', 'canned', 'dried', 'beans', 'lentils', 'oil', 'vinegar', 'sauce', 'condiment', 'spice', 'seasoning', 'baking'],
        order: 6,
        color: 'other'
    },
    'Surgelés': {
        keywords: ['frozen', 'ice'],
        order: 7,
        color: 'other'
    },
    'Boissons': {
        keywords: ['beverage', 'drink', 'juice', 'water', 'soda', 'wine', 'beer'],
        order: 8,
        color: 'other'
    },
    'Autres': {
        keywords: [],
        order: 99,
        color: 'other'
    }
};

const INGREDIENTS_FR = {
    'chicken': 'poulet',
    'chicken breast': 'blancs de poulet',
    'chicken breasts': 'blancs de poulet',
    'chicken thighs': 'cuisses de poulet',
    'chicken thigh': 'cuisse de poulet',
    'chicken leg': 'cuisse de poulet',
    'chicken wings': 'ailes de poulet',
    'beef': 'bœuf',
    'ground beef': 'bœuf haché',
    'beef steak': 'steak de bœuf',
    'steak': 'steak',
    'pork': 'porc',
    'pork chop': 'côte de porc',
    'pork chops': 'côtes de porc',
    'ground pork': 'porc haché',
    'lamb': 'agneau',
    'veal': 'veau',
    'turkey': 'dinde',
    'duck': 'canard',
    'fish': 'poisson',
    'salmon': 'saumon',
    'salmon fillet': 'filet de saumon',
    'tuna': 'thon',
    'cod': 'cabillaud',
    'tilapia': 'tilapia',
    'trout': 'truite',
    'shrimp': 'crevettes',
    'shrimps': 'crevettes',
    'prawns': 'gambas',
    'scallops': 'noix de Saint-Jacques',
    'mussels': 'moules',
    'crab': 'crabe',
    'lobster': 'homard',
    'egg': 'œuf',
    'eggs': 'œufs',
    'large egg': 'gros œuf',
    'large eggs': 'gros œufs',
    'milk': 'lait',
    'whole milk': 'lait entier',
    'skim milk': 'lait écrémé',
    'butter': 'beurre',
    'unsalted butter': 'beurre doux',
    'salted butter': 'beurre salé',
    'cheese': 'fromage',
    'cheddar': 'cheddar',
    'cheddar cheese': 'cheddar',
    'parmesan': 'parmesan',
    'parmesan cheese': 'parmesan',
    'mozzarella': 'mozzarella',
    'mozzarella cheese': 'mozzarella',
    'cream cheese': 'fromage frais',
    'feta': 'feta',
    'feta cheese': 'feta',
    'goat cheese': 'fromage de chèvre',
    'gruyere': 'gruyère',
    'cream': 'crème',
    'heavy cream': 'crème fraîche épaisse',
    'whipping cream': 'crème fouettée',
    'sour cream': 'crème aigre',
    'yogurt': 'yaourt',
    'greek yogurt': 'yaourt grec',
    'onion': 'oignon',
    'onions': 'oignons',
    'red onion': 'oignon rouge',
    'yellow onion': 'oignon jaune',
    'white onion': 'oignon blanc',
    'green onion': 'oignon vert',
    'green onions': 'oignons verts',
    'scallion': 'ciboule',
    'scallions': 'ciboules',
    'shallot': 'échalote',
    'shallots': 'échalotes',
    'garlic': 'ail',
    'garlic clove': 'gousse d\'ail',
    'garlic cloves': 'gousses d\'ail',
    'tomato': 'tomate',
    'tomatoes': 'tomates',
    'cherry tomatoes': 'tomates cerises',
    'tomato paste': 'concentré de tomates',
    'tomato sauce': 'sauce tomate',
    'diced tomatoes': 'tomates concassées',
    'crushed tomatoes': 'tomates concassées',
    'canned tomatoes': 'tomates en conserve',
    'sun-dried tomatoes': 'tomates séchées',
    'potato': 'pomme de terre',
    'potatoes': 'pommes de terre',
    'sweet potato': 'patate douce',
    'sweet potatoes': 'patates douces',
    'carrot': 'carotte',
    'carrots': 'carottes',
    'celery': 'céleri',
    'celery stalk': 'branche de céleri',
    'celery stalks': 'branches de céleri',
    'pepper': 'poivron',
    'bell pepper': 'poivron',
    'bell peppers': 'poivrons',
    'red bell pepper': 'poivron rouge',
    'green bell pepper': 'poivron vert',
    'yellow bell pepper': 'poivron jaune',
    'jalapeno': 'piment jalapeño',
    'chili pepper': 'piment',
    'mushroom': 'champignon',
    'mushrooms': 'champignons',
    'button mushrooms': 'champignons de Paris',
    'cremini mushrooms': 'champignons bruns',
    'portobello': 'portobello',
    'shiitake': 'shiitake',
    'spinach': 'épinards',
    'baby spinach': 'jeunes pousses d\'épinards',
    'lettuce': 'laitue',
    'romaine lettuce': 'laitue romaine',
    'arugula': 'roquette',
    'kale': 'chou kale',
    'cabbage': 'chou',
    'red cabbage': 'chou rouge',
    'broccoli': 'brocoli',
    'cauliflower': 'chou-fleur',
    'zucchini': 'courgette',
    'zucchinis': 'courgettes',
    'eggplant': 'aubergine',
    'cucumber': 'concombre',
    'asparagus': 'asperges',
    'green beans': 'haricots verts',
    'peas': 'petits pois',
    'corn': 'maïs',
    'avocado': 'avocat',
    'lemon': 'citron',
    'lemons': 'citrons',
    'lemon juice': 'jus de citron',
    'lemon zest': 'zeste de citron',
    'lime': 'citron vert',
    'lime juice': 'jus de citron vert',
    'orange': 'orange',
    'orange juice': 'jus d\'orange',
    'orange zest': 'zeste d\'orange',
    'apple': 'pomme',
    'apples': 'pommes',
    'banana': 'banane',
    'bananas': 'bananes',
    'strawberry': 'fraise',
    'strawberries': 'fraises',
    'blueberry': 'myrtille',
    'blueberries': 'myrtilles',
    'raspberry': 'framboise',
    'raspberries': 'framboises',
    'grape': 'raisin',
    'grapes': 'raisins',
    'mango': 'mangue',
    'pineapple': 'ananas',
    'peach': 'pêche',
    'pear': 'poire',
    'rice': 'riz',
    'white rice': 'riz blanc',
    'brown rice': 'riz complet',
    'basmati rice': 'riz basmati',
    'jasmine rice': 'riz jasmin',
    'arborio rice': 'riz arborio',
    'pasta': 'pâtes',
    'spaghetti': 'spaghetti',
    'penne': 'penne',
    'linguine': 'linguine',
    'fettuccine': 'fettuccine',
    'macaroni': 'macaroni',
    'noodles': 'nouilles',
    'egg noodles': 'nouilles aux œufs',
    'rice noodles': 'nouilles de riz',
    'bread': 'pain',
    'bread crumbs': 'chapelure',
    'breadcrumbs': 'chapelure',
    'flour': 'farine',
    'all-purpose flour': 'farine de blé',
    'whole wheat flour': 'farine complète',
    'sugar': 'sucre',
    'white sugar': 'sucre blanc',
    'brown sugar': 'sucre roux',
    'powdered sugar': 'sucre glace',
    'salt': 'sel',
    'sea salt': 'sel de mer',
    'kosher salt': 'gros sel',
    'black pepper': 'poivre noir',
    'pepper': 'poivre',
    'ground black pepper': 'poivre noir moulu',
    'olive oil': 'huile d\'olive',
    'extra virgin olive oil': 'huile d\'olive extra vierge',
    'vegetable oil': 'huile végétale',
    'canola oil': 'huile de colza',
    'coconut oil': 'huile de coco',
    'sesame oil': 'huile de sésame',
    'vinegar': 'vinaigre',
    'balsamic vinegar': 'vinaigre balsamique',
    'red wine vinegar': 'vinaigre de vin rouge',
    'white wine vinegar': 'vinaigre de vin blanc',
    'apple cider vinegar': 'vinaigre de cidre',
    'soy sauce': 'sauce soja',
    'fish sauce': 'nuoc-mâm',
    'worcestershire sauce': 'sauce Worcestershire',
    'hot sauce': 'sauce piquante',
    'honey': 'miel',
    'maple syrup': 'sirop d\'érable',
    'mustard': 'moutarde',
    'dijon mustard': 'moutarde de Dijon',
    'mayonnaise': 'mayonnaise',
    'ketchup': 'ketchup',
    'chicken broth': 'bouillon de poulet',
    'chicken stock': 'fond de volaille',
    'beef broth': 'bouillon de bœuf',
    'vegetable broth': 'bouillon de légumes',
    'vegetable stock': 'bouillon de légumes',
    'coconut milk': 'lait de coco',
    'parsley': 'persil',
    'fresh parsley': 'persil frais',
    'basil': 'basilic',
    'fresh basil': 'basilic frais',
    'oregano': 'origan',
    'dried oregano': 'origan séché',
    'thyme': 'thym',
    'fresh thyme': 'thym frais',
    'rosemary': 'romarin',
    'fresh rosemary': 'romarin frais',
    'cilantro': 'coriandre',
    'fresh cilantro': 'coriandre fraîche',
    'mint': 'menthe',
    'fresh mint': 'menthe fraîche',
    'dill': 'aneth',
    'chives': 'ciboulette',
    'bay leaf': 'feuille de laurier',
    'bay leaves': 'feuilles de laurier',
    'cumin': 'cumin',
    'ground cumin': 'cumin moulu',
    'paprika': 'paprika',
    'smoked paprika': 'paprika fumé',
    'cayenne pepper': 'piment de Cayenne',
    'chili powder': 'poudre de piment',
    'curry powder': 'curry en poudre',
    'turmeric': 'curcuma',
    'cinnamon': 'cannelle',
    'ground cinnamon': 'cannelle moulue',
    'nutmeg': 'muscade',
    'ginger': 'gingembre',
    'fresh ginger': 'gingembre frais',
    'ground ginger': 'gingembre moulu',
    'cloves': 'clous de girofle',
    'coriander': 'coriandre moulue',
    'allspice': 'quatre-épices',
    'vanilla': 'vanille',
    'vanilla extract': 'extrait de vanille',
    'bacon': 'lardons',
    'bacon strips': 'tranches de bacon',
    'pancetta': 'pancetta',
    'ham': 'jambon',
    'prosciutto': 'jambon cru',
    'sausage': 'saucisse',
    'italian sausage': 'saucisse italienne',
    'chorizo': 'chorizo',
    'tofu': 'tofu',
    'firm tofu': 'tofu ferme',
    'tempeh': 'tempeh',
    'beans': 'haricots',
    'black beans': 'haricots noirs',
    'kidney beans': 'haricots rouges',
    'white beans': 'haricots blancs',
    'cannellini beans': 'haricots cannellini',
    'chickpeas': 'pois chiches',
    'lentils': 'lentilles',
    'red lentils': 'lentilles corail',
    'green lentils': 'lentilles vertes',
    'almonds': 'amandes',
    'sliced almonds': 'amandes effilées',
    'walnuts': 'noix',
    'pecans': 'noix de pécan',
    'cashews': 'noix de cajou',
    'peanuts': 'cacahuètes',
    'pine nuts': 'pignons de pin',
    'peanut butter': 'beurre de cacahuète',
    'chocolate': 'chocolat',
    'dark chocolate': 'chocolat noir',
    'chocolate chips': 'pépites de chocolat',
    'cocoa powder': 'cacao en poudre',
    'wine': 'vin',
    'white wine': 'vin blanc',
    'red wine': 'vin rouge',
    'baking powder': 'levure chimique',
    'baking soda': 'bicarbonate de soude',
    'yeast': 'levure',
    'cornstarch': 'fécule de maïs',
    'gelatin': 'gélatine',
    'water': 'eau',
    'ice': 'glaçons',
    'olives': 'olives',
    'olive': 'olive',
    'kalamata olives': 'olives Kalamata',
    'manzanilla olives': 'olives Manzanilla',
    'green olives': 'olives vertes',
    'black olives': 'olives noires',
    'capers': 'câpres',
    'anchovies': 'anchois',
    'anchovy': 'anchois',
    'artichoke': 'artichaut',
    'artichokes': 'artichauts',
    'artichoke hearts': 'cœurs d\'artichauts',
    'sun dried tomatoes': 'tomates séchées',
    'roasted red peppers': 'poivrons rouges grillés',
    'pesto': 'pesto',
    'hummus': 'houmous',
    'tahini': 'tahini',
    'filo': 'pâte filo',
    'phyllo': 'pâte filo',
    'puff pastry': 'pâte feuilletée',
    'pie crust': 'pâte brisée',
    'pizza dough': 'pâte à pizza',
    'tortilla': 'tortilla',
    'tortillas': 'tortillas',
    'wrap': 'wrap',
    'wraps': 'wraps',
    'pita': 'pain pita',
    'naan': 'naan',
    'brioche': 'brioche',
    'croissant': 'croissant',
    'baguette': 'baguette',
    'sourdough': 'pain au levain',
    'ciabatta': 'ciabatta',
    'focaccia': 'focaccia',

    // Bouillons et fonds
    'broth': 'bouillon',
    'stock': 'bouillon',
    'seafood broth': 'bouillon de fruits de mer',
    'seafood stock': 'fumet de poisson',
    'fish broth': 'fumet de poisson',
    'fish stock': 'fumet de poisson',
    'beef broth': 'bouillon de bœuf',
    'beef stock': 'fond de bœuf',
    'chicken broth': 'bouillon de poulet',
    'chicken stock': 'fond de volaille',
    'vegetable broth': 'bouillon de légumes',
    'vegetable stock': 'bouillon de légumes',
    'bone broth': 'bouillon d\'os',

    // Fruits de mer
    'seafood': 'fruits de mer',
    'shellfish': 'crustacés',
    'clams': 'palourdes',
    'clam': 'palourde',
    'oyster': 'huître',
    'oysters': 'huîtres',
    'squid': 'calamar',
    'calamari': 'calamar',
    'octopus': 'poulpe',
    'cuttlefish': 'seiche',

    // Assaisonnements et épices
    'seasoning': 'assaisonnement',
    'spice': 'épice',
    'spices': 'épices',
    'herbs': 'herbes',
    'mixed herbs': 'herbes de Provence',
    'italian seasoning': 'herbes italiennes',
    'old bay seasoning': 'épices Old Bay',
    'cajun seasoning': 'épices cajun',
    'taco seasoning': 'épices mexicaines',
    'curry': 'curry',
    'garam masala': 'garam masala',
    'five spice': 'cinq épices',
    'chinese five spice': 'cinq épices chinoises',
    'herbs de provence': 'herbes de Provence',
    'bouquet garni': 'bouquet garni',
    'dried thyme': 'thym séché',
    'dried basil': 'basilic séché',
    'dried oregano': 'origan séché',
    'dried parsley': 'persil séché',
    'dried rosemary': 'romarin séché',
    'red pepper flakes': 'piment rouge en flocons',
    'crushed red pepper': 'piment rouge broyé',
    'chili flakes': 'flocons de piment',
    'cayenne': 'piment de Cayenne',
    'black peppercorns': 'grains de poivre noir',
    'white peppercorns': 'grains de poivre blanc',
    'saffron': 'safran',
    'cardamom': 'cardamome',
    'star anise': 'anis étoilé',
    'fennel seeds': 'graines de fenouil',
    'mustard seeds': 'graines de moutarde',
    'coriander seeds': 'graines de coriandre',
    'cumin seeds': 'graines de cumin',
    'caraway seeds': 'graines de carvi',
    'poppy seeds': 'graines de pavot',
    'sesame seeds': 'graines de sésame',

    // Légumes supplémentaires
    'leek': 'poireau',
    'leeks': 'poireaux',
    'shallots': 'échalotes',
    'shallot': 'échalote',
    'spring onion': 'oignon nouveau',
    'spring onions': 'oignons nouveaux',
    'chive': 'ciboulette',
    'radish': 'radis',
    'radishes': 'radis',
    'turnip': 'navet',
    'turnips': 'navets',
    'parsnip': 'panais',
    'parsnips': 'panais',
    'beetroot': 'betterave',
    'beet': 'betterave',
    'beets': 'betteraves',
    'squash': 'courge',
    'butternut squash': 'courge butternut',
    'pumpkin': 'citrouille',
    'acorn squash': 'courge poivrée',
    'spaghetti squash': 'courge spaghetti',
    'fennel': 'fenouil',
    'chard': 'blette',
    'swiss chard': 'blette',
    'collard greens': 'chou cavalier',
    'bok choy': 'pak choï',
    'napa cabbage': 'chou chinois',
    'chinese cabbage': 'chou chinois',
    'brussels sprouts': 'choux de Bruxelles',
    'brussels sprout': 'chou de Bruxelles',
    'watercress': 'cresson',
    'endive': 'endive',
    'chicory': 'chicorée',
    'radicchio': 'radicchio',
    'bean sprouts': 'germes de soja',
    'sprouts': 'germes',
    'snow peas': 'pois mange-tout',
    'snap peas': 'pois gourmands',
    'edamame': 'edamame',
    'okra': 'gombo',
    'plantain': 'banane plantain',
    'yam': 'igname',
    'taro': 'taro',
    'jicama': 'jicama',
    'water chestnut': 'châtaigne d\'eau',
    'water chestnuts': 'châtaignes d\'eau',
    'bamboo shoots': 'pousses de bambou',

    // Fruits supplémentaires
    'berries': 'fruits rouges',
    'mixed berries': 'fruits rouges mélangés',
    'blackberry': 'mûre',
    'blackberries': 'mûres',
    'cranberry': 'canneberge',
    'cranberries': 'canneberges',
    'gooseberry': 'groseille à maquereau',
    'currant': 'groseille',
    'currants': 'groseilles',
    'raisin': 'raisin sec',
    'raisins': 'raisins secs',
    'sultana': 'raisin de Smyrne',
    'sultanas': 'raisins de Smyrne',
    'dried fruit': 'fruits secs',
    'dried fruits': 'fruits secs',
    'prune': 'pruneau',
    'prunes': 'pruneaux',
    'date': 'datte',
    'dates': 'dattes',
    'fig': 'figue',
    'figs': 'figues',
    'apricot': 'abricot',
    'apricots': 'abricots',
    'dried apricots': 'abricots secs',
    'plum': 'prune',
    'plums': 'prunes',
    'nectarine': 'nectarine',
    'nectarines': 'nectarines',
    'cherry': 'cerise',
    'cherries': 'cerises',
    'pomegranate': 'grenade',
    'pomegranate seeds': 'graines de grenade',
    'passion fruit': 'fruit de la passion',
    'papaya': 'papaye',
    'guava': 'goyave',
    'lychee': 'litchi',
    'kiwi': 'kiwi',
    'melon': 'melon',
    'cantaloupe': 'melon cantaloup',
    'honeydew': 'melon miel',
    'watermelon': 'pastèque',
    'coconut': 'noix de coco',
    'shredded coconut': 'noix de coco râpée',
    'coconut flakes': 'copeaux de noix de coco',
    'desiccated coconut': 'noix de coco desséchée',

    // Produits laitiers supplémentaires
    'ricotta': 'ricotta',
    'mascarpone': 'mascarpone',
    'brie': 'brie',
    'camembert': 'camembert',
    'blue cheese': 'fromage bleu',
    'gorgonzola': 'gorgonzola',
    'roquefort': 'roquefort',
    'cottage cheese': 'fromage cottage',
    'quark': 'fromage blanc',
    'fromage blanc': 'fromage blanc',
    'creme fraiche': 'crème fraîche',
    'clotted cream': 'crème épaisse',
    'double cream': 'crème épaisse',
    'single cream': 'crème liquide',
    'half and half': 'crème légère',
    'evaporated milk': 'lait concentré',
    'condensed milk': 'lait concentré sucré',
    'buttermilk': 'babeurre',
    'kefir': 'kéfir',

    // Viandes et charcuteries supplémentaires
    'minced meat': 'viande hachée',
    'ground meat': 'viande hachée',
    'mince': 'viande hachée',
    'stewing beef': 'bœuf à braiser',
    'beef chuck': 'paleron de bœuf',
    'beef brisket': 'poitrine de bœuf',
    'beef ribs': 'côtes de bœuf',
    'ribeye': 'entrecôte',
    'sirloin': 'faux-filet',
    'tenderloin': 'filet mignon',
    'flank steak': 'bavette',
    'skirt steak': 'onglet',
    'pork belly': 'poitrine de porc',
    'pork shoulder': 'épaule de porc',
    'pork loin': 'longe de porc',
    'pork tenderloin': 'filet mignon de porc',
    'spare ribs': 'travers de porc',
    'lamb chops': 'côtelettes d\'agneau',
    'lamb shoulder': 'épaule d\'agneau',
    'lamb leg': 'gigot d\'agneau',
    'rack of lamb': 'carré d\'agneau',
    'veal chop': 'côte de veau',
    'veal cutlet': 'escalope de veau',
    'liver': 'foie',
    'chicken liver': 'foie de volaille',
    'kidney': 'rognon',
    'sweetbreads': 'ris de veau',
    'tripe': 'tripes',
    'oxtail': 'queue de bœuf',
    'salami': 'salami',
    'pepperoni': 'pepperoni',
    'mortadella': 'mortadelle',
    'coppa': 'coppa',
    'bresaola': 'bresaola',
    'pastrami': 'pastrami',
    'corned beef': 'corned-beef',
    'smoked salmon': 'saumon fumé',
    'lox': 'saumon fumé',
    'gravlax': 'gravlax',
    'hot dog': 'saucisse de Francfort',
    'frankfurter': 'saucisse de Francfort',
    'kielbasa': 'saucisse polonaise',
    'andouille': 'andouille',
    'boudin': 'boudin',
    'merguez': 'merguez',

    // Sauces et condiments supplémentaires
    'bbq sauce': 'sauce barbecue',
    'barbecue sauce': 'sauce barbecue',
    'teriyaki sauce': 'sauce teriyaki',
    'hoisin sauce': 'sauce hoisin',
    'oyster sauce': 'sauce aux huîtres',
    'sweet chili sauce': 'sauce chili douce',
    'sriracha': 'sriracha',
    'tabasco': 'tabasco',
    'sambal': 'sambal',
    'harissa': 'harissa',
    'gochujang': 'gochujang',
    'miso': 'miso',
    'miso paste': 'pâte miso',
    'tahini paste': 'pâte de tahini',
    'tomato paste': 'concentré de tomates',
    'tomato puree': 'purée de tomates',
    'passata': 'coulis de tomates',
    'marinara sauce': 'sauce marinara',
    'alfredo sauce': 'sauce Alfredo',
    'bolognese sauce': 'sauce bolognaise',
    'peanut sauce': 'sauce aux cacahuètes',
    'satay sauce': 'sauce satay',
    'curry paste': 'pâte de curry',
    'red curry paste': 'pâte de curry rouge',
    'green curry paste': 'pâte de curry vert',
    'yellow curry paste': 'pâte de curry jaune',
    'thai curry paste': 'pâte de curry thaï',
    'chutney': 'chutney',
    'mango chutney': 'chutney de mangue',
    'relish': 'relish',
    'pickle': 'cornichon',
    'pickles': 'cornichons',
    'gherkin': 'cornichon',
    'gherkins': 'cornichons',
    'sauerkraut': 'choucroute',
    'kimchi': 'kimchi',

    // Céréales et légumineuses supplémentaires
    'oat': 'flocon d\'avoine',
    'oats': 'flocons d\'avoine',
    'rolled oats': 'flocons d\'avoine',
    'steel cut oats': 'gruau d\'avoine',
    'oatmeal': 'porridge',
    'barley': 'orge',
    'pearl barley': 'orge perlé',
    'bulgur': 'boulgour',
    'couscous': 'couscous',
    'quinoa': 'quinoa',
    'millet': 'millet',
    'buckwheat': 'sarrasin',
    'polenta': 'polenta',
    'cornmeal': 'semoule de maïs',
    'semolina': 'semoule',
    'tapioca': 'tapioca',
    'black beans': 'haricots noirs',
    'kidney beans': 'haricots rouges',
    'cannellini beans': 'haricots blancs',
    'navy beans': 'haricots blancs',
    'pinto beans': 'haricots pinto',
    'butter beans': 'haricots de Lima',
    'lima beans': 'haricots de Lima',
    'fava beans': 'fèves',
    'broad beans': 'fèves',
    'split peas': 'pois cassés',
    'yellow split peas': 'pois cassés jaunes',
    'green split peas': 'pois cassés verts',
    'red lentils': 'lentilles corail',
    'green lentils': 'lentilles vertes',
    'brown lentils': 'lentilles brunes',
    'puy lentils': 'lentilles du Puy',
    'beluga lentils': 'lentilles beluga',

    // Noix et graines supplémentaires
    'hazelnut': 'noisette',
    'hazelnuts': 'noisettes',
    'macadamia': 'noix de macadamia',
    'macadamia nuts': 'noix de macadamia',
    'brazil nut': 'noix du Brésil',
    'brazil nuts': 'noix du Brésil',
    'pistachio': 'pistache',
    'pistachios': 'pistaches',
    'chestnut': 'châtaigne',
    'chestnuts': 'châtaignes',
    'sunflower seeds': 'graines de tournesol',
    'pumpkin seeds': 'graines de courge',
    'flax seeds': 'graines de lin',
    'flaxseed': 'graines de lin',
    'chia seeds': 'graines de chia',
    'hemp seeds': 'graines de chanvre',

    // Autres
    'topping': 'garniture',
    'toppings': 'garnitures',
    'filling': 'farce',
    'stuffing': 'farce',
    'breading': 'panure',
    'coating': 'enrobage',
    'marinade': 'marinade',
    'glaze': 'glaçage',
    'drizzle': 'filet',
    'garnish': 'garniture',
    'zest': 'zeste',
    'juice': 'jus',
    'extract': 'extrait',
    'essence': 'essence',
    'powder': 'poudre',
    'ground': 'moulu',
    'dried': 'séché',
    'fresh': 'frais',
    'frozen': 'surgelé',
    'canned': 'en conserve',
    'jarred': 'en bocal',
    'sliced': 'tranché',
    'diced': 'en dés',
    'chopped': 'haché',
    'minced': 'émincé',
    'crushed': 'écrasé',
    'grated': 'râpé',
    'shredded': 'effiloché',
    'whole': 'entier',
    'halved': 'coupé en deux',
    'quartered': 'coupé en quatre'
};

const UNIT_CONVERSIONS = {
    'tablespoon': { metric: 'c. à soupe', factor: 1, isSpoon: true },
    'tablespoons': { metric: 'c. à soupe', factor: 1, isSpoon: true },
    'tbsp': { metric: 'c. à soupe', factor: 1, isSpoon: true },
    'teaspoon': { metric: 'c. à café', factor: 1, isSpoon: true },
    'teaspoons': { metric: 'c. à café', factor: 1, isSpoon: true },
    'tsp': { metric: 'c. à café', factor: 1, isSpoon: true },
    'ounce': { metric: 'g', factor: 28 },
    'ounces': { metric: 'g', factor: 28 },
    'oz': { metric: 'g', factor: 28 },
    'pound': { metric: 'g', factor: 454 },
    'pounds': { metric: 'g', factor: 454 },
    'lb': { metric: 'g', factor: 454 },
    'lbs': { metric: 'g', factor: 454 },
    'fluid ounce': { metric: 'ml', factor: 30 },
    'fluid ounces': { metric: 'ml', factor: 30 },
    'fl oz': { metric: 'ml', factor: 30 },
    'pint': { metric: 'ml', factor: 473 },
    'pints': { metric: 'ml', factor: 473 },
    'quart': { metric: 'l', factor: 0.946 },
    'quarts': { metric: 'l', factor: 0.946 },
    'gallon': { metric: 'l', factor: 3.78 },
    'gallons': { metric: 'l', factor: 3.78 },
    'stick': { metric: 'g', factor: 113 },
    'sticks': { metric: 'g', factor: 113 }
};

const SOLID_INGREDIENTS = [
    'lettuce', 'arugula', 'spinach', 'kale', 'cabbage', 'salad', 'greens', 'roquette',
    'bread', 'toast', 'baguette', 'roll', 'bun', 'pain',
    'cheese', 'parmesan', 'mozzarella', 'cheddar', 'feta', 'fromage',
    'chicken', 'beef', 'pork', 'lamb', 'fish', 'salmon', 'meat', 'poulet', 'boeuf', 'porc',
    'turkey', 'duck', 'veal', 'bacon', 'ham', 'sausage', 'prosciutto', 'pancetta',
    'shrimp', 'prawns', 'crab', 'lobster', 'scallops', 'mussels', 'clams',
    'rice', 'pasta', 'noodles', 'flour', 'sugar', 'oats', 'quinoa', 'couscous',
    'nuts', 'almonds', 'walnuts', 'pecans', 'cashews', 'peanuts',
    'chocolate', 'chips', 'cocoa',
    'onion', 'garlic', 'potato', 'carrot', 'celery', 'tomato', 'pepper', 'mushroom',
    'zucchini', 'eggplant', 'cucumber', 'broccoli', 'cauliflower', 'asparagus',
    'apple', 'banana', 'orange', 'lemon', 'lime', 'strawberry', 'blueberry',
    'beans', 'lentils', 'chickpeas', 'tofu', 'tempeh',
    'olives', 'olive', 'capers', 'anchovy', 'anchovies'
];

const LIQUID_INGREDIENTS = [
    'milk', 'water', 'broth', 'stock', 'juice', 'wine', 'beer', 'vinegar',
    'oil', 'sauce', 'cream', 'yogurt', 'honey', 'syrup', 'lait', 'eau',
    'coconut milk', 'soy sauce', 'fish sauce', 'worcestershire'
];

const COUNTABLE_UNITS = [
    'slice', 'slices', 'piece', 'pieces', 'clove', 'cloves',
    'leaf', 'leaves', 'sprig', 'sprigs', 'bunch', 'bunches',
    'head', 'heads', 'stalk', 'stalks', 'strip', 'strips',
    'fillet', 'fillets', 'breast', 'breasts', 'thigh', 'thighs',
    'large', 'medium', 'small', 'whole', 'half',
    'can', 'cans', 'jar', 'jars', 'package', 'packages', 'bag', 'bags',
    'serving', 'servings', 'portion', 'portions'
];

const INGREDIENT_PRICES = {
    'poulet': 8.50,
    'blancs de poulet': 10.00,
    'cuisses de poulet': 6.50,
    'ailes de poulet': 5.00,
    'bœuf': 15.00,
    'bœuf haché': 10.00,
    'steak': 18.00,
    'porc': 9.00,
    'côtes de porc': 8.00,
    'agneau': 18.00,
    'veau': 20.00,
    'dinde': 9.00,
    'canard': 14.00,
    'saumon': 20.00,
    'filet de saumon': 22.00,
    'thon': 18.00,
    'cabillaud': 15.00,
    'crevettes': 16.00,
    'gambas': 20.00,
    'moules': 5.00,
    'œuf': 0.30,
    'œufs': 0.30,
    'gros œuf': 0.35,
    'lait': 1.20,
    'beurre': 2.50,
    'fromage': 3.00,
    'parmesan': 4.00,
    'mozzarella': 2.50,
    'feta': 3.50,
    'crème fraîche épaisse': 2.00,
    'yaourt': 1.50,
    'oignon': 0.30,
    'oignons': 0.30,
    'échalote': 0.40,
    'ail': 0.50,
    'gousse d\'ail': 0.10,
    'gousses d\'ail': 0.10,
    'tomate': 0.40,
    'tomates': 0.40,
    'tomates cerises': 2.50,
    'concentré de tomates': 1.50,
    'sauce tomate': 1.80,
    'pomme de terre': 0.25,
    'pommes de terre': 0.25,
    'patate douce': 0.50,
    'carotte': 0.20,
    'carottes': 0.20,
    'céleri': 1.50,
    'poivron': 0.80,
    'poivrons': 0.80,
    'champignon': 0.50,
    'champignons': 3.50,
    'épinards': 2.50,
    'laitue': 1.20,
    'roquette': 2.00,
    'brocoli': 2.00,
    'chou-fleur': 2.50,
    'courgette': 0.60,
    'aubergine': 1.00,
    'concombre': 0.80,
    'asperges': 4.00,
    'haricots verts': 3.00,
    'petits pois': 2.00,
    'avocat': 1.50,
    'citron': 0.40,
    'citron vert': 0.50,
    'orange': 0.50,
    'pomme': 0.40,
    'banane': 0.25,
    'fraises': 4.00,
    'myrtilles': 3.50,
    'framboises': 4.00,
    'riz': 2.00,
    'pâtes': 1.50,
    'spaghetti': 1.50,
    'nouilles': 2.00,
    'pain': 1.50,
    'chapelure': 1.50,
    'farine': 1.00,
    'sucre': 1.20,
    'sel': 0.80,
    'poivre': 2.00,
    'huile d\'olive': 6.00,
    'huile végétale': 3.00,
    'vinaigre': 2.00,
    'vinaigre balsamique': 4.00,
    'sauce soja': 3.00,
    'miel': 5.00,
    'moutarde': 2.00,
    'mayonnaise': 2.50,
    'ketchup': 2.00,
    'bouillon de poulet': 1.50,
    'bouillon de légumes': 1.50,
    'lait de coco': 2.50,
    'persil': 1.00,
    'basilic': 1.50,
    'thym': 1.50,
    'romarin': 1.50,
    'coriandre': 1.50,
    'menthe': 1.50,
    'lardons': 3.00,
    'jambon': 4.00,
    'saucisse': 4.00,
    'chorizo': 4.00,
    'tofu': 3.00,
    'haricots': 1.50,
    'pois chiches': 1.50,
    'lentilles': 2.00,
    'amandes': 4.00,
    'noix': 5.00,
    'cacahuètes': 3.00,
    'chocolat': 3.00,
    'vin blanc': 5.00,
    'vin rouge': 5.00
};

function translateIngredient(name) {
    if (!name) return name;
    const lower = name.toLowerCase().trim();

    // 1. Recherche exacte d'abord
    if (INGREDIENTS_FR[lower]) {
        return INGREDIENTS_FR[lower];
    }

    // 2. Recherche par inclusion de clé plus longue (plus précis)
    // Trier par longueur décroissante pour matcher "brussels sprouts" avant "sprouts"
    const sortedEntries = Object.entries(INGREDIENTS_FR).sort((a, b) => b[0].length - a[0].length);
    for (const [en, fr] of sortedEntries) {
        if (lower === en) {
            return fr;
        }
    }

    // 3. Recherche si le nom contient une clé connue
    for (const [en, fr] of sortedEntries) {
        if (lower.includes(en) && en.length > 2) {
            return fr;
        }
    }

    // 4. Traduction mot par mot pour les ingrédients composés
    const words = lower.split(' ');
    const translatedWords = words.map(word => {
        if (INGREDIENTS_FR[word]) return INGREDIENTS_FR[word];
        // Essayer au singulier
        const singular = word.replace(/s$/, '');
        if (singular !== word && INGREDIENTS_FR[singular]) return INGREDIENTS_FR[singular];
        // Essayer au pluriel
        const plural = word + 's';
        if (INGREDIENTS_FR[plural]) return INGREDIENTS_FR[plural];
        return word;
    });

    const result = translatedWords.join(' ');

    // Si au moins un mot a été traduit, retourner le résultat
    if (result !== lower) {
        return result;
    }

    // Sinon retourner le nom original (avec sa casse originale)
    return name;
}

function convertToMetric(amount, unit, ingredientName = '') {
    if (!unit && !amount) return { amount: 0, unit: '' };

    const lowerUnit = (unit || '').toLowerCase().trim();
    const lowerName = (ingredientName || '').toLowerCase();

    const isSolid = SOLID_INGREDIENTS.some(s => lowerName.includes(s));
    const isLiquid = LIQUID_INGREDIENTS.some(s => lowerName.includes(s));

    if (!unit || lowerUnit === '') {
        return { amount: Math.round(amount), unit: '' };
    }

    if (['g', 'kg'].includes(lowerUnit)) {
        return { amount, unit: lowerUnit };
    }

    if (['ml', 'l', 'cl'].includes(lowerUnit)) {
        if (isSolid && !isLiquid) {
            return { amount: Math.round(amount), unit: 'g' };
        }
        return { amount, unit: lowerUnit };
    }

    if (lowerUnit === 'pinch' || lowerUnit === 'dash' || lowerUnit === 'to taste') {
        return { amount: 0, unit: '' };
    }

    if (COUNTABLE_UNITS.includes(lowerUnit)) {
        return { amount: Math.round(amount), unit: '' };
    }

    const conversion = UNIT_CONVERSIONS[lowerUnit];
    if (conversion) {
        // Si c'est une cuillère, garder l'unité cuillère
        if (conversion.isSpoon) {
            return { amount: conversion.factor * amount, unit: conversion.metric };
        }

        let convertedAmount = amount * conversion.factor;
        let metricUnit = conversion.metric;

        if (metricUnit === 'ml' && isSolid && !isLiquid) {
            metricUnit = 'g';
        }

        if (metricUnit === 'g' && convertedAmount >= 1000) {
            convertedAmount = convertedAmount / 1000;
            metricUnit = 'kg';
        } else if (metricUnit === 'ml' && convertedAmount >= 1000) {
            convertedAmount = convertedAmount / 1000;
            metricUnit = 'l';
        }

        return { amount: convertedAmount, unit: metricUnit };
    }

    if (lowerUnit === 'cup' || lowerUnit === 'cups') {
        if (isSolid && !isLiquid) {
            return { amount: Math.round(amount * 150), unit: 'g' };
        } else {
            return { amount: Math.round(amount * 240), unit: 'ml' };
        }
    }

    return { amount: Math.round(amount), unit: '' };
}

function getGroceryCategory(aisle, ingredientName) {
    if (!aisle && !ingredientName) return 'Autres';

    const searchText = ((aisle || '') + ' ' + (ingredientName || '')).toLowerCase();

    for (const [category, data] of Object.entries(GROCERY_CATEGORIES)) {
        if (category === 'Autres') continue;
        for (const keyword of data.keywords) {
            if (searchText.includes(keyword)) {
                return category;
            }
        }
    }

    return 'Autres';
}

function getCategoryOrder(category) {
    return GROCERY_CATEGORIES[category]?.order || 99;
}

function getCategoryColor(category) {
    return GROCERY_CATEGORIES[category]?.color || 'other';
}

// Dictionnaire de traduction pour les instructions de recettes
const INSTRUCTIONS_TRANSLATIONS = {
    // Verbes de cuisson
    'preheat': 'préchauffer',
    'heat': 'chauffer',
    'boil': 'faire bouillir',
    'simmer': 'laisser mijoter',
    'fry': 'frire',
    'sauté': 'faire sauter',
    'saute': 'faire sauter',
    'bake': 'cuire au four',
    'roast': 'rôtir',
    'grill': 'griller',
    'broil': 'griller',
    'steam': 'cuire à la vapeur',
    'poach': 'pocher',
    'braise': 'braiser',
    'stew': 'mijoter',
    'stir-fry': 'faire sauter',
    'deep-fry': 'frire',
    'pan-fry': 'poêler',
    'blanch': 'blanchir',
    'reduce': 'réduire',
    'caramelize': 'caraméliser',
    'brown': 'faire dorer',
    'sear': 'saisir',
    'toast': 'faire griller',
    'warm': 'réchauffer',
    'cool': 'laisser refroidir',
    'chill': 'réfrigérer',
    'freeze': 'congeler',
    'thaw': 'décongeler',
    'melt': 'faire fondre',
    'dissolve': 'dissoudre',

    // Verbes de préparation
    'cut': 'couper',
    'slice': 'trancher',
    'dice': 'couper en dés',
    'chop': 'hacher',
    'mince': 'émincer finement',
    'julienne': 'couper en julienne',
    'cube': 'couper en cubes',
    'shred': 'râper',
    'grate': 'râper',
    'peel': 'éplucher',
    'trim': 'parer',
    'core': 'évider',
    'seed': 'épépiner',
    'pit': 'dénoyauter',
    'hull': 'équeuter',
    'crush': 'écraser',
    'mash': 'écraser en purée',
    'pound': 'piler',
    'grind': 'moudre',
    'blend': 'mixer',
    'puree': 'réduire en purée',
    'whisk': 'fouetter',
    'beat': 'battre',
    'whip': 'fouetter',
    'fold': 'incorporer délicatement',
    'stir': 'remuer',
    'mix': 'mélanger',
    'combine': 'combiner',
    'toss': 'mélanger',
    'knead': 'pétrir',
    'roll': 'étaler',
    'flatten': 'aplatir',
    'shape': 'former',
    'stuff': 'farcir',
    'fill': 'garnir',
    'spread': 'étaler',
    'layer': 'disposer en couches',
    'arrange': 'disposer',
    'place': 'placer',
    'transfer': 'transférer',
    'pour': 'verser',
    'drizzle': 'arroser',
    'sprinkle': 'saupoudrer',
    'season': 'assaisonner',
    'marinate': 'faire mariner',
    'coat': 'enrober',
    'dredge': 'fariner',
    'baste': 'arroser',
    'brush': 'badigeonner',
    'glaze': 'glacer',
    'garnish': 'garnir',
    'serve': 'servir',
    'set aside': 'réserver',
    'let rest': 'laisser reposer',
    'drain': 'égoutter',
    'strain': 'filtrer',
    'rinse': 'rincer',
    'wash': 'laver',
    'dry': 'sécher',
    'pat dry': 'éponger',
    'soak': 'faire tremper',
    'cover': 'couvrir',
    'uncover': 'découvrir',
    'remove': 'retirer',
    'discard': 'jeter',
    'reserve': 'réserver',
    'add': 'ajouter',
    'return': 'remettre',
    'flip': 'retourner',
    'turn': 'retourner',
    'check': 'vérifier',
    'taste': 'goûter',
    'adjust': 'ajuster',

    // Ustensiles et équipements
    'oven': 'four',
    'stove': 'cuisinière',
    'stovetop': 'plaque de cuisson',
    'pan': 'poêle',
    'skillet': 'poêle',
    'frying pan': 'poêle',
    'saucepan': 'casserole',
    'pot': 'marmite',
    'dutch oven': 'cocotte',
    'baking sheet': 'plaque de cuisson',
    'baking pan': 'moule',
    'baking dish': 'plat à four',
    'casserole dish': 'plat à gratin',
    'roasting pan': 'plat à rôtir',
    'grill': 'gril',
    'griddle': 'plancha',
    'wok': 'wok',
    'steamer': 'cuiseur vapeur',
    'slow cooker': 'mijoteuse',
    'pressure cooker': 'autocuiseur',
    'blender': 'mixeur',
    'food processor': 'robot culinaire',
    'mixer': 'batteur',
    'whisk': 'fouet',
    'spatula': 'spatule',
    'ladle': 'louche',
    'tongs': 'pince',
    'colander': 'passoire',
    'strainer': 'passoire fine',
    'sieve': 'tamis',
    'cutting board': 'planche à découper',
    'knife': 'couteau',
    'bowl': 'bol',
    'mixing bowl': 'saladier',
    'measuring cup': 'verre doseur',
    'measuring spoon': 'cuillère doseuse',
    'aluminum foil': 'papier aluminium',
    'parchment paper': 'papier cuisson',
    'plastic wrap': 'film alimentaire',
    'rack': 'grille',
    'wire rack': 'grille de refroidissement',

    // Termes de cuisson
    'medium heat': 'feu moyen',
    'medium-high heat': 'feu moyen-vif',
    'high heat': 'feu vif',
    'low heat': 'feu doux',
    'medium-low heat': 'feu moyen-doux',
    'golden brown': 'bien doré',
    'lightly browned': 'légèrement doré',
    'crispy': 'croustillant',
    'tender': 'tendre',
    'al dente': 'al dente',
    'fork-tender': 'tendre à la fourchette',
    'translucent': 'translucide',
    'softened': 'ramolli',
    'room temperature': 'température ambiante',
    'internal temperature': 'température interne',
    'degrees': 'degrés',
    'minutes': 'minutes',
    'hours': 'heures',
    'seconds': 'secondes',
    'until': 'jusqu\'à ce que',
    'about': 'environ',
    'approximately': 'environ',
    'or until': 'ou jusqu\'à ce que',

    // Descriptions
    'finely': 'finement',
    'coarsely': 'grossièrement',
    'thinly': 'finement',
    'thickly': 'en tranches épaisses',
    'evenly': 'uniformément',
    'gently': 'délicatement',
    'vigorously': 'vigoureusement',
    'constantly': 'constamment',
    'occasionally': 'de temps en temps',
    'frequently': 'fréquemment',
    'immediately': 'immédiatement',
    'gradually': 'progressivement',
    'slowly': 'lentement',
    'quickly': 'rapidement',
    'thoroughly': 'bien',
    'completely': 'complètement',
    'lightly': 'légèrement',
    'generously': 'généreusement',
    'well': 'bien',

    // Phrases courantes
    'bring to a boil': 'porter à ébullition',
    'reduce heat': 'réduire le feu',
    'let cool': 'laisser refroidir',
    'set aside': 'réserver',
    'to taste': 'selon votre goût',
    'if needed': 'si nécessaire',
    'as needed': 'selon besoin',
    'optional': 'optionnel',
    'for serving': 'pour servir',
    'for garnish': 'pour garnir'
};

function translateInstructions(instructions) {
    if (!instructions) return 'Instructions non disponibles.';

    let translated = instructions;

    // Trier les clés par longueur décroissante pour éviter les remplacements partiels
    const sortedKeys = Object.keys(INSTRUCTIONS_TRANSLATIONS).sort((a, b) => b.length - a.length);

    for (const en of sortedKeys) {
        const fr = INSTRUCTIONS_TRANSLATIONS[en];
        // Créer une regex qui respecte les limites de mots (insensible à la casse)
        const regex = new RegExp(`\\b${en}\\b`, 'gi');
        translated = translated.replace(regex, fr);
    }

    // Traduire aussi les ingrédients dans les instructions
    const ingredientKeys = Object.keys(INGREDIENTS_FR).sort((a, b) => b.length - a.length);
    for (const en of ingredientKeys) {
        if (en.length > 3) { // Éviter les mots trop courts
            const fr = INGREDIENTS_FR[en];
            const regex = new RegExp(`\\b${en}\\b`, 'gi');
            translated = translated.replace(regex, fr);
        }
    }

    return translated;
}

function estimatePrice(ingredient) {
    const nameFr = translateIngredient(ingredient.name).toLowerCase();

    for (const [key, price] of Object.entries(INGREDIENT_PRICES)) {
        if (nameFr.includes(key) || key.includes(nameFr)) {
            const converted = convertToMetric(ingredient.amount || 1, ingredient.unit);
            let quantity = converted.amount;

            if (converted.unit === 'kg') {
                return Math.max(0.50, price * quantity);
            } else if (converted.unit === 'g') {
                return Math.max(0.20, price * (quantity / 1000));
            } else if (converted.unit === 'l') {
                return Math.max(0.50, price * quantity);
            } else if (converted.unit === 'ml') {
                return Math.max(0.20, price * (quantity / 1000));
            } else {
                return Math.max(0.20, price * Math.min(quantity, 2) * 0.3);
            }
        }
    }

    const category = getGroceryCategory(ingredient.aisle, ingredient.name);
    const basePrices = {
        'Boucherie': 5.00,
        'Poissonnerie': 6.00,
        'Fruits & Légumes': 1.50,
        'Crémerie': 2.00,
        'Boulangerie': 1.50,
        'Épicerie': 1.50,
        'Surgelés': 3.00,
        'Boissons': 2.00,
        'Autres': 2.00
    };

    const basePrice = basePrices[category] || 2.00;
    const converted = convertToMetric(ingredient.amount || 1, ingredient.unit);
    let multiplier = 1;

    if (converted.unit === 'kg') {
        multiplier = converted.amount;
    } else if (converted.unit === 'g') {
        multiplier = converted.amount / 500;
    } else if (converted.unit === 'l') {
        multiplier = converted.amount;
    } else if (converted.unit === 'ml') {
        multiplier = converted.amount / 500;
    } else {
        multiplier = Math.min(converted.amount * 0.3, 2);
    }

    return Math.max(0.20, basePrice * multiplier);
}
