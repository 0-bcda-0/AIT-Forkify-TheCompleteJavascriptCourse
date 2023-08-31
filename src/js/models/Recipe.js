import axios from "axios";

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            // Query na API
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`)
            // console.log(res);
            // spremanje u property
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            alert(error);
        }
    }

    // Vrijeme kuhanja
    calcTime() {
        const numIng = this.ingredients.length;
        // Pretpostavljamo da nam treba 15 minuta za svakih 3 sastojka
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    // Broj serviranja
    calcServings() {
        this.servings = 4;
    }

    // Parsanje sastojaka
    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Parse ingredients into count, unit and ingredient
            //! 40 MIN VIDEA !!!!!
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);
                
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {
                // There is NO unit, but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // There is NO unit and NO number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings (type) {
        // servings
        // if koji vraca u varijablu, ako je type dec onda smanji za -1, ...
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // ingredients
        this.ingredients.forEach(ing => {
            // 4 servings, 4/4 = 1 cup
            // 4 servings, 4*2/4 = 2 cups
            // *= je isto ko +=
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }

}