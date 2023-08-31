// TUTORIAL: 9. How ES6 Modules Work
// Primjer exporta funkcije
/*
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;
export const ID = 23;
*/
// ----------------------------------------------------------------------------------------------
// PROGRAM

import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    // ciscenje liste recepata
    elements.searchResList.innerHTML = '';
    // ciscenje tipki za stranice
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    // brisanje svih aktivnih linkova
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });

    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    // nemam else jer u ifu i van ifa imam return pa sam pokrio oba slucaja
    if(title.length > limit) {
        // split razdvaja string u array po zadanom parametru
        // reduce je ko forEach ali ima akumulator (komplicirano)
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0); // 0 je pocetna vrijednost acc
        return `${newTitle.join(' ')} ...`;
    }
    return title;
};

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
        `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

// type je 'prev' ili 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page-1 : page+1}>
        <span>Page ${type === 'prev' ? page-1 : page+1}</span>
        <svg class="search__icon">
            <use href="./img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    // Izracun kolko stranica trebamo imat
    // Math.ceil zaokruzuje na najblizi veci broj
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if(page === 1 && pages > 1) {
        // Samo gumb za sljedecu stranicu
        button = createButton(page, 'next');
    } else if(page < pages) {
        // Oba gumba
        // String koji sadrzi oba gumba, a poziva dva puta createButton
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if(page === pages && pages > 1) {
        // Samo gumb za prethodnu stranicu
        button = createButton(page, 'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

// recipes je array, pages je broj stranice(default je 1), resultsPerPage je broj rezultata po stranici
export const renderResults = (recipes, pages=1, resPerPage=10) => {
    // logika za odabir rezultata po stranici
    const start = (pages - 1) * resPerPage;
    const end = pages * resPerPage;

    // renderRecipe je callback funkcija za print
    // slice je metoda za array koja vraca novi array od start do end
    recipes.slice(start, end).forEach(renderRecipe);
    renderButtons(pages, recipes.length, resPerPage);
};