export default class Likes{

    constructor(){
        this.likes=[];
    }

    addLike(id,title,author,img){

        const like={id,title,author,img};
        this.likes.push(like);

        //Persist the data in the localStorage
        this.persistData();
        return like;
    }

    deleteLike(id){

        const index = this.likes.findIndex(el=> el.id === id);
        this.likes.splice(index,1);

        //Persist the data in the localStorage
         this.persistData();
    }

    isLiked(id){

        return this.likes.findIndex(el=> el.id === id) !==-1;
    }

    getNumLikes(){
        return this.likes.length;
    }

    persistData(){
 
        localStorage.setItem('likes',JSON.stringify(this.likes));

        //JSON.stringify() => converts into strings
    }

    readStorage(){

        const storage= JSON.parse(localStorage.getItem('likes'));
 
        //Restoring likes from localStorage
        // local storage se data retrieve kr rhe h

        if(storage) this.likes = storage;
 
    }



}