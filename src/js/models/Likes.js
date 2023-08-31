export default class Likes {
    constructor() {
        this.likes = [];
    }
    
    addLike(id, title, author, img) {
        const like = {id, title, author, img};
        this.likes.push(like);
        
        // Spremanje u localStorage
        this.persistData();
        
        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        // brisanje elementa iz arraya
        this.likes.splice(index, 1);

        // Spremanje u localStorage
        this.persistData();
    }

    isLiked(id) {
        // ako je index -1 onda element ne postoji u arrayu
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    // Spremanje u localStorage
    persistData() {
        // JSON.stringify pretvara array u string
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        // JSON.parse pretvara string u array
        const storage = JSON.parse(localStorage.getItem('likes'));
        
        // Restoring likes from the localStorage
        if (storage) this.likes = storage;
    }
}