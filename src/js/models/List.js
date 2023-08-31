import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        // objekt koji sadrzi sve sastojke
        const item = {
            // unique id za svaki item
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        // pushamo u items array
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        // nalazimo index itema koji zelimo izbrisati
        const index = this.items.findIndex(el => el.id === id);
        // brisemo item iz arraya
        // splice brise elemente iz arraya, prvi argument je index od kojeg brisemo, drugi argument je kolko elemenata brisemo
        // [2,4,8] splice(1, 2) --> returns [4,8], original array is [2]
        // [2,4,8] slice(1, 2) --> returns 4, original array is [2,4,8]
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        // nalazimo item koji zelimo updateat
        // find vraca element koji zadovoljava uvjet
        // el je element, el.id je id od elementa
        // ako je id od elementa jednak id-u koji smo poslali u funkciju, onda je to element koji zelimo updateat
        this.items.find(el => el.id === id).count = newCount;
    }
}