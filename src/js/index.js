//https://forkify-api.herokuapp.com/api/search

import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';

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
    console.log(query);

    if(query){
        // 2) new search object and add state
        state.search = new Search(query);

        // 3) prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchres);

        // 4) Search for recipes
        await state.search.getResults();

        // 5) Render results on UI
        //console.log(state.search.result);
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e =>{
    e.preventDefault();
    controlSearch();
});


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

const r = new Recipe(47746);
r.getRecipe();
console.log(r);