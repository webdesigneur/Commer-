import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, Users, ChefHat, Heart, ShoppingCart, RotateCcw } from 'https://cdn.skypack.dev/lucide-react@0.284.0';

const AssistantCulinaire = () => {
  const [menuSemaine, setMenuSemaine] = useState({});
  const [preferences, setPreferences] = useState({
    regime: '',
    tempsCuisson: '',
    nombrePersonnes: 4,
    allergies: []
  });
  const [listeRecettes] = useState(() => genererRecettes());

  const prixIngredients = {
    'tomates': 0.5,
    'oignons': 0.3,
    'ail': 0.1,
    'basilic': 0.05,
    'fromage râpé': 0.02,
    'crème fraîche': 0.03,
    'oeufs': 0.3,
    'champignons': 0.01,
    'courgettes': 0.6,
    'épinards': 0.02,
    'lentilles': 0.01,
    'quinoa': 0.02,
    'huile d\'olive': 0.05,
    'pois chiches': 0.01,
    'tofu': 0.02,
    'lait de coco': 0.03,
    'avocat': 1,
    'riz': 0.01,
    'pommes de terre': 0.004,
    'saumon': 0.03,
    'poulet': 0.015,
    'viande de bœuf': 0.02,
    'beurre': 0.015,
    'vin blanc': 0.02,
    'farine': 0.002,
  };

  function genererRecettes() {
    const categories = ['Entrée', 'Plat principal', 'Dessert'];
    const cuisines = ['Française', 'Italienne', 'Asiatique', 'Méditerranéenne', 'Mexicaine', 'Indienne'];
    const difficultes = ['Facile', 'Moyen', 'Difficile'];
    const nomsPlats = {
      'Végétarien': {
        'Entrée': ['Salade de chèvre chaud', 'Velouté de potiron'],
        'Plat principal': ['Ratatouille provençale', 'Lasagnes aux épinards'],
        'Dessert': ['Tarte tatin', 'Tiramisu']
      },
      'Végétalien': {
        'Entrée': ['Salade de quinoa', 'Velouté de légumes'],
        'Plat principal': ['Ratatouille aux herbes', 'Curry de pois chiches'],
        'Dessert': ['Mousse au chocolat vegan']
      },
      'Sans gluten': {
        'Entrée': ['Salade de quinoa', 'Soupe de légumes'],
        'Plat principal': ['Saumon grillé aux légumes', 'Risotto aux champignons'],
        'Dessert': ['Mousse au chocolat']
      },
      'Traditionnel': {
        'Entrée': ['Foie gras poêlé', 'Escargots de Bourgogne'],
        'Plat principal': ['Coq au vin', 'Bœuf bourguignon'],
        'Dessert': ['Tarte tatin', 'Tiramisu']
      }
    };

    const recettes = [];
    let id = 1;
    ['Végétarien', 'Végétalien', 'Sans gluten', 'Traditionnel'].forEach(regime => {
      categories.forEach(categorie => {
        if (nomsPlats[regime] && nomsPlats[regime][categorie]) {
          nomsPlats[regime][categorie].forEach(nom => {
            cuisines.forEach(cuisine => {
              if (recettes.length < 1000) {
                recettes.push({
                  id: id++,
                  nom: `${nom} ${cuisine.toLowerCase()}`,
                  categorie,
                  cuisine,
                  difficulte: difficultes[Math.floor(Math.random() * difficultes.length)],
                  tempsCuisson: Math.floor(Math.random() * 120) + 15,
                  regime: regime,
                  ingredients: genererIngredients(regime),
                  note: (Math.random() * 2 + 3).toFixed(1),
                  calories: Math.floor(Math.random() * 400) + 200
                });
              }
            });
          });
        }
      });
    });

    while (recettes.length < 1000) {
      const baseRecette = recettes[Math.floor(Math.random() * recettes.length)];
      recettes.push({
        ...baseRecette,
        id: id++,
        nom: `${baseRecette.nom} (variation ${id})`,
        tempsCuisson: baseRecette.tempsCuisson + Math.floor(Math.random() * 20) - 10
      });
    }

    return recettes;
  }

  function genererIngredients(regime = 'Traditionnel') {
    const ingredientsParRegime = {
      'Végétarien': [
        { nom: 'tomates', quantite: 4, unite: 'pièces' },
        { nom: 'oignons', quantite: 2, unite: 'pièces' },
        { nom: 'basilic', quantite: 20, unite: 'g' },
        { nom: 'fromage râpé', quantite: 150, unite: 'g' },
      ],
      'Végétalien': [
        { nom: 'tomates', quantite: 4, unite: 'pièces' },
        { nom: 'huile d\'olive', quantite: 40, unite: 'ml' },
        { nom: 'pois chiches', quantite: 250, unite: 'g' },
      ],
      'Sans gluten': [
        { nom: 'riz', quantite: 200, unite: 'g' },
        { nom: 'saumon', quantite: 250, unite: 'g' },
        { nom: 'pommes de terre', quantite: 500, unite: 'g' },
      ],
      'Traditionnel': [
        { nom: 'viande de bœuf', quantite: 300, unite: 'g' },
        { nom: 'poulet', quantite: 400, unite: 'g' },
        { nom: 'beurre', quantite: 80, unite: 'g' },
      ]
    };

    const ingredientsCommuns = [
      { nom: 'tomates', quantite: 2, unite: 'pièces' },
      { nom: 'oignons', quantite: 1, unite: 'pièces' },
      { nom: 'ail', quantite: 2, unite: 'gousses' },
    ];

    const ingredientsSpecifiques = ingredientsParRegime[regime] || ingredientsParRegime['Traditionnel'];
    const ingredients = [...ingredientsSpecifiques, ...ingredientsCommuns];
    const nombre = Math.floor(Math.random() * 6) + 6;
    return ingredients.sort(() => 0.5 - Math.random()).slice(0, nombre);
  }

  const joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const typesRepas = ['Déjeuner', 'Dîner'];

  const filtrerRecettes = (categorie) => {
    let recettesFiltrees = listeRecettes.filter(recette => recette.categorie === categorie);

    if (preferences.regime) {
      recettesFiltrees = recettesFiltrees.filter(recette => recette.regime === preferences.regime);
    }

    if (preferences.tempsCuisson) {
      recettesFiltrees = recettesFiltrees.filter(recette => recette.tempsCuisson <= parseInt(preferences.tempsCuisson));
    }

    if (recettesFiltrees.length === 0) {
      return listeRecettes.filter(recette => recette.categorie === categorie).slice(0, 50);
    }

    return recettesFiltrees;
  };

  const genererMenuSemaine = () => {
    const nouveauMenu = {};
    joursSemaine.forEach(jour => {
      nouveauMenu[jour] = {};
      typesRepas.forEach(repas => {
        const recettesPlat = filtrerRecettes('Plat principal');
        if (recettesPlat.length > 0) {
          const recetteChoisie = recettesPlat[Math.floor(Math.random() * recettesPlat.length)];
          nouveauMenu[jour][repas] = recetteChoisie;
        }
      });
    });
    setMenuSemaine(nouveauMenu);
  };

  const reinitialiserTout = () => {
    setMenuSemaine({});
    setPreferences({
      regime: '',
      tempsCuisson: '',
      nombrePersonnes: 4,
      allergies: []
    });
  };

  const regenererRepas = (jour, repas) => {
    const recettesPlat = filtrerRecettes('Plat principal');
    const nouvelleRecette = recettesPlat[Math.floor(Math.random() * recettesPlat.length)];
    setMenuSemaine(prev => ({
      ...prev,
      [jour]: { ...prev[jour], [repas]: nouvelleRecette }
    }));
  };

  const genererListeCourses = () => {
    const ingredientsConsolides = {};
    Object.values(menuSemaine).forEach(repasJour => {
      Object.values(repasJour).forEach(recette => {
        if (recette && recette.ingredients) {
          recette.ingredients.forEach(ingredient => {
            const nom = ingredient.nom;
            const quantite = ingredient.quantite * (preferences.nombrePersonnes / 4);
            const unite = ingredient.unite;
            if (ingredientsConsolides[nom]) {
              ingredientsConsolides[nom].quantite += quantite;
            } else {
              ingredientsConsolides[nom] = { quantite, unite };
            }
          });
        }
      });
    });
    return Object.entries(ingredientsConsolides)
      .map(([nom, info]) => ({
        nom,
        quantite: Math.ceil(info.quantite),
        unite: info.unite,
        cout: ((prixIngredients[nom.toLowerCase()] || 0) * Math.ceil(info.quantite)).toFixed(2)
      }))
      .sort((a, b) => a.nom.localeCompare(b.nom));
  };

  const coutTotal = () => {
    return genererListeCourses().reduce((total, ing) => total + parseFloat(ing.cout), 0).toFixed(2);
  };

  useEffect(() => {
    if (preferences.regime !== '' || preferences.tempsCuisson !== '' || preferences.nombrePersonnes !== 4) {
      genererMenuSemaine();
    }
  }, [preferences]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <ChefHat className="mr-3 text-orange-500" />
          Assistant Culinaire
        </h1>
        <p className="text-gray-600">Planifiez vos repas de la semaine</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Vos Préférences</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Régime alimentaire</label>
            <select className="w-full p-2 border border-gray-300 rounded-md" value={preferences.regime} onChange={(e) => setPreferences(prev => ({...prev, regime: e.target.value}))}>
              <option value="">Tous les régimes</option>
              <option value="Végétarien">Végétarien</option>
              <option value="Végétalien">Végétalien</option>
              <option value="Sans gluten">Sans gluten</option>
              <option value="Traditionnel">Traditionnel</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Temps max de cuisson (min)</label>
            <select className="w-full p-2 border border-gray-300 rounded-md" value={preferences.tempsCuisson} onChange={(e) => setPreferences(prev => ({...prev, tempsCuisson: e.target.value}))}>
              <option value="">Peu importe</option>
              <option value="30">30 minutes</option>
              <option value="60">1 heure</option>
              <option value="90">1h30</option>
              <option value="120">2 heures</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de personnes</label>
            <input type="number" min="1" max="12" className="w-full p-2 border border-gray-300 rounded-md" value={preferences.nombrePersonnes} onChange={(e) => setPreferences(prev => ({...prev, nombrePersonnes: parseInt(e.target.value)}))} />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          <button onClick={genererMenuSemaine} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md flex items-center">
            <RefreshCw className="mr-2 h-4 w-4" />
            Générer un nouveau menu
          </button>
          <button onClick={reinitialiserTout} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md flex items-center">
            <RotateCcw className="mr-2 h-4 w-4" />
            Réinitialiser tout
          </button>
          <div className="flex items-center text-sm text-gray-600">
            {preferences.regime && (<span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">{preferences.regime}</span>)}
            {preferences.tempsCuisson && (<span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-2">≤ {preferences.tempsCuisson}min</span>)}
            {(preferences.regime || preferences.tempsCuisson) && (<span className="text-xs">Filtres actifs</span>)}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Menu de la Semaine</h2>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {joursSemaine.map(jour => (
            <div key={jour} className="border border-gray-200 rounded-lg p-3">
              <h3 className="font-semibold text-gray-800 mb-3 text-center">{jour}</h3>
              {typesRepas.map(repas => (
                <div key={repas} className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">{repas}</h4>
                  {menuSemaine[jour] && menuSemaine[jour][repas] ? (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="font-medium text-sm text-gray-800 mb-1">{menuSemaine[jour][repas].nom}</div>
                      <div className="flex items-center text-xs text-gray-600 mb-2">
                        <Clock className="h-3 w-3 mr-1" />
                        {menuSemaine[jour][repas].tempsCuisson}min
                        <Users className="h-3 w-3 ml-2 mr-1" />
                        {preferences.nombrePersonnes}p
                        <Heart className="h-3 w-3 ml-2 mr-1 text-red-500" />
                        {menuSemaine[jour][repas].note}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">{menuSemaine[jour][repas].cuisine} • {menuSemaine[jour][repas].difficulte}</div>
                      <button onClick={() => regenererRepas(jour, repas)} className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 px-2 py-1 rounded">Changer</button>
                    </div>
                  ) : (
                    <div className="bg-gray-100 p-3 rounded-md text-gray-500 text-sm">Aucune recette sélectionnée</div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {Object.keys(menuSemaine).length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <ShoppingCart className="mr-2 text-green-500" />
            Liste de Courses ({preferences.nombrePersonnes} personnes)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {genererListeCourses().map((ingredient, index) => (
              <div key={index} className="bg-green-50 border border-green-200 p-3 rounded-lg flex justify-between items-center">
                <span className="text-gray-800 font-medium">{ingredient.nom}</span>
                <span className="text-sm text-gray-700">{ingredient.quantite} {ingredient.unite}</span>
                <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">{ingredient.cout}€</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-md text-gray-800 font-medium">
            Coût total approximatif : {coutTotal()} €
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistantCulinaire;
