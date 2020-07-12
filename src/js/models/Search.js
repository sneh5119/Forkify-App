// export default 'I am a exported string';

import axios from 'axios';

export default class Search{
    constructor(query) {

        this.query=query;
    }

   async getResults(){

    try{

        const res= await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
        
         this.results= res.data.recipes; 
          // recipes is the array which contains the recipes of a certain food item build in the Api i guess
        // console.log(this.results);
    }catch(error)
    {

        alert(error);
    }

        
    }
    
}