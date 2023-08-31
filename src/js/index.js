// TUTORIAL: 9. How ES6 Modules Work
/*

// Global app controller

// Default import
import str from './models/Search';

// Named import
// import { add as a, multiply as m, ID } from './views/searchview'; //Selektivni import
import * as searchView from './views/searchview'; //Sve importa

// console.log(`Using imported functions! ${a(ID, 2)} and ${m(3, 5)}. ${str}`);
console.log(`Using imported functions! ${searchView.add(searchView.ID, 2)} and ${searchView.multiply(3, 5)}. ${str}`);

// -------------------------------------------------------------------------------------------------------------------------------------
*/
// PROGRAM

import Search from './models/Search';
import * as searchView from './views/searchview';
import { elements, renderLoader, clearLoader } from './views/base';
import Recipe from './models/Recipe';
import * as recipeView from './views/recipeView';
import List from './models/List';
import * as listView from './views/listView';
import Likes from './models/Likes';
import * as likesView from './views/likesView';

// Global state of the app
// - Search object
// - Current recipe object
// - Shopping list object
// - Liked recipes
const State = {};

// ! SEARCH CONTROLLER
const controlSearch = async () => {
    //! 1) Dohvatit query
    const query = searchView.getInput();
    // const query = 'pizza';
    // console.log(query);

    if (query) {
        //! 2) Pretrazivanje preko Search objekta
            // Spremamo rezultat u Global State
        State.search = new Search(query);
        
        //! 3) Priprema UI
        searchView.clearInput();
        searchView.clearResults();
        // Loader
        renderLoader(elements.searchRes);

        try{
            //! 4) Pretraga za receptima
                // Asinkrona metoda jer treba vremena za dohvat podataka
            await State.search.getResults();
        } catch(error) {
            alert('Something went wrong with the search...');
            clearLoader();
        }

        //! 5) Render UI
        // Loader
        clearLoader();
        searchView.renderResults(State.search.result);
        // console.log(State.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// Event delegation
elements.searchResPages.addEventListener('click', e => {
    // closest vraca najblizi element koji zadovoljava selektor
    // (gdje god da stisnem, gledat ce najblizi koji ima class btn-inline)
    const btn = e.target.closest('.btn-inline');
    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        // goToPage je broj stranice na koju zelimo ici
        searchView.renderResults(State.search.result, goToPage);
        console.log(goToPage);
    }
    // console.log(btn);
});


//! RECIPE CONTROLLER
// const r = new Recipe(46956);
// r.getRecipe();
// console.log(r);
const controlRecipe = async () => {
    // Dohvat ID iz URL, bez #. window.location je cijeli URL (window.location.hash je samo dio)
    const id = window.location.hash.replace('#', '');
    // console.log(id);

    if (id) {
        //! Priprema UI za promjene
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //! Highlight odabrani recept
        if (State.search) searchView.highlightSelected(id);
        
        //! Kreiranje novog Recipe objekta
        State.recipe = new Recipe(id);

        try{
            //! Dohvat podataka o receptu
            await State.recipe.getRecipe();
            State.recipe.parseIngredients();
            // console.log(State.recipe.ingredients);

            //! Izracunavanje vremena i broja serviranja
            State.recipe.calcTime();
            State.recipe.calcServings();

            //! Render recepta
            clearLoader();
            recipeView.renderRecipe(State.recipe);
            // console.log(State.recipe);
        }catch(error) {
            alert('Error processing recipe!');
        }
    }
};

// addEventListener('hashchange', controlRecipe);
// addEventListener('load', controlRecipe);

// Event listener za vise eventova koji zove istu funkciju
['hashchange', 'load'].forEach(event => addEventListener(event, controlRecipe));

//! LIST CONTROLLER
const controlList = () => {
    // Kreiranje nove liste ako je nema
    if(!State.list) State.list = new List();

    // Dodavanje svakog sastojka u listu i UI
    State.recipe.ingredients.forEach(el => {
        const item = State.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });

    console.log(State.list);
};

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    // closest vraca najblizi element koji zadovoljava selektor
    // (gdje god da stisnem, gledat ce najblizi koji ima class btn-inline)
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        State.list.deleteItem(id);

        // Delete from UI
        listView.deleteItems(id);
    // Handle the count update
    } else if(e.target.matches('.shopping-card-value')) {
        const val = parseFloat(e.target.value, 10);
        State.list.updateCount(id, val);
    }
});

//! LIKE CONTROLLER
const controlLike = () => {
    if(!State.likes) State.likes = new Likes();
    const currentID = State.recipe.id;

    // User has not yet liked current recipe
    if(!State.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = State.likes.addLike(
            currentID,
            State.recipe.title,
            State.recipe.author,
            State.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);
        
        // Add like to UI list
        likesView.renderLike(newLike);
        console.log(State.likes);
    // User has liked current recipe
    } else {
        // Remove like from the state
        State.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
        console.log(State.likes);
    }
    likesView.toggleLikeMenu(State.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    State.likes = new Likes();

    // Restore likes
    State.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(State.likes.getNumLikes());

    // Render the existing likes
    State.likes.likes.forEach(like => likesView.renderLike(like));

});


// button clik za recept
elements.recipe.addEventListener('click', e => {
    // isto ko i closest, samo sto ovo gleda samo child elemente, * oznacava sve child elemente
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button clicked
        // Ako je veci od 0, onda smanji, jer nemoze bit negativno
        if(State.recipe.servings > 1) {
            State.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(State.recipe);
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button clicked
        State.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(State.recipe);
    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if(e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }

    console.log(State.recipe);
});