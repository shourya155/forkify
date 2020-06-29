//https://forkify-api.herokuapp.com/api/search

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';

/** Global state of app
 * Search object
 * current recipe object
 * shopping list
 * liked recipe
 */

const state = {};

const controlSearch = async () => {
    //1)Get query from view
    const query = searchView.getInput();

    //const query = 'pizza';
    //console.log(query);

    if(query){
        // 2) new search object and add state
        state.search = new Search(query);

        // 3) prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchres);
        
        try{
        // 4) Search for recipes
        await state.search.getResults();

        // 5) Render results on UI
        //console.log(state.search.result);
        clearLoader();
        searchView.renderResults(state.search.result);
        } catch(err){
            alert('Something went wrong with search query');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e =>{
    e.preventDefault();
    controlSearch();
});

//Test
/*
window.addEventListener('load', e =>{
    e.preventDefault();
    controlSearch();
});
*/

elements.searchResPages.addEventListener('click', e=> {
    const btn = e.target.closest('.btn-inline');
    //console.log(btn);
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result,goToPage);
        console.log(goToPage);
    }
});
/*
const search = new Search('pizza');
search.getResults();
*/

const controlRecipe = async () => {
    const id = window.location.hash.replace('#','');
    console.log(id);
    
    if(id){
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        if(state.search)
        searchView.highlightSelected(id);

        state.recipe = new Recipe(id);
        
        //TESTING
        //window.r = state.recipe;

        try {
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();

        state.recipe.calcTime();
        state.recipe.calcServings();

        clearLoader();
        recipeView.renderRecipe(state.recipe);

        //console.log(state.recipe);
        } catch(err){
            alert('Error processing recipe');
        }
    }
};

window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load',controlRecipe);

const controlList = () => {
    
    if (!state.list) state.list = new List();

    
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        
        controlLike();
    }
});
//['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));