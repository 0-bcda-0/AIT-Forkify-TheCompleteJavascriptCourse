// TUTORIAL: 9. How ES6 Modules Work
// export default 'I am an exported string.';
// ----------------------------------------------------------------------------------------------
// PROGRAM

import axios from 'axios'; // axios is a third party library for making AJAX calls

export default class Search {
    constructor(query) {
        this.query = query;
    }

    // Asinkrona medota
    async getResults(query) {
        try {
            // Query na API
            const res = await axios.get(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            // Sprema rezultat u result property
            this.result  = res.data.recipes;
        } catch (error) {
            alert(error);
        }
    }

}