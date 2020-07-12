import Search from './models/Search';
import Recipe from './models/Recipe';
import List  from './models/List';
import * as searchview from './views/searchView';
import * as recipeview from './views/recipeViews';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements , renderLoader, clearLoader} from './views/base';
import Likes from './models/Likes';


const state={};  // empty object 
// window.state=state; --> the state object


//////****SEARCH CONTROLLER *****///////

 const controlSearch=async ()=>{

    //Get the query from the view
    const query=searchview.getInput();  // we take the input from search bar 
    // console.log(query);  
       

    if(query){

    //2 New object and add to the state
     state.search= new Search(query);  /***has passed into the class
    *** state.search will now get the access to all the elements of the class search*/
   
   
     //3 Prepare UI for results
     searchview.clearInput();
     searchview.clearResults();
     renderLoader(elements.searchRes);

     try{
    
        //4 Prepare seach for recipes
        await state.search.getResults();
        //5 render results on UI
        // console.log(state.search);
        clearLoader();
         searchview.renderResults(state.search.results);
     
    }catch(error){
        alert('something is wrong with search result');
        clearLoader();
      }
    }
}
elements.searchForm.addEventListener('submit',e=>{

    e.preventDefault();
    controlSearch();

});


elements.searchResPages.addEventListener('click',e=>{

    const btn=e.target.closest('.btn-inline');  //closest function will return the nearest ancestor of the element
    // console.log(btn);


    if(btn){
        const goToPage=parseInt(btn.dataset.goto,10);  // data from goto
        // console.log(goToPage);
        searchview.clearResults();    
        searchview.renderResults(state.search.results,goToPage);    
    }
})


//////****RECIPE CONTROLLER *****///////

// const r =new Recipe(47746);
// r.getRecipe();

// console.log(r);

const controlRecipe= async () =>{

    //Get the url
    const id =window.location.hash.replace('#','');  
    /* it is replacing hash with the null value*/  
    /* window.location = gives the whole url of the site  && hash= simply means '#'
    /* hum yha se id utha rhe h "recipe ki" . replace # krne ke baad actual id utha rhe h and 
       then we are calling the class of (recipe)*/
    //  console.log(id);

    if(id){

        //Prepare UI for changes
        recipeview.clearRecipe();
        renderLoader(elements.recipe);


        //Highlight the selected search item
        if(state.search) 
        searchview.highlightSelected(id);

        // Create new recipe object
        state.recipe= new Recipe(id);
        /*  state.recipe is the object which is accessing the data of the class Recipe*/
        /*  we are saving the data into the empty object called state*/        
        

        try{
        // Get the recipe data
         await state.recipe.getRecipe();
        state.recipe.parseIngredients();
        /*getRecipe is an async func which will return a promise  thats why we hve written await over there*/  

        //Calculate servings and time
        
         state.recipe.calcTime();
         state.recipe.calcServings();

        //Render the recipe
          //console.log(state.recipe);
          clearLoader();
          recipeview.renderRecipe(state.recipe,state.likes.isLiked(id));

        }catch(err){
           alert('Processing error in recipe search ');
        }
    }


};

// window.addEventListener('hashchange',controlRecipe); 

['hashchange','load'].forEach(event=>window.addEventListener(event,controlRecipe));
/* haschange changes the '#' hash id of the element*/
/**load helps to load the page  */


//////****LIST CONTROLLER *****///////

const controlList=()=>{

  // create list if there is none yet
  if(!state.list)
  state.list= new List();

  //Add each ingredient to the list
             
  state.recipe.ingredients.forEach(el=>{
   
    const item = state.list.addItem(el.count,el.unit,el.ingredient);
    listView.renderItem(item);
  
  }); 

}

// Handle , delete and update the list items events using event delegation
 
  elements.shopping.addEventListener('click',e=>{

    const id= e.target.closest('.shopping__item').dataset.itemid;

    //Handle the delete button
    if(e.target.matches('.shopping__delete,.shopping__delete *')){

      //Delete from state
      state.list.deleteItem(id);

      //Delete from UI
      listView.deleteItem(id);

      //handke the count updaTE
    }else if(e.target.matches('.shopping__count-value,.shopping__count-value *')){
    
      const val= parseFloat(e.target.value,10);
      state.list.updateCount(id,val);

    }else if(e.target.matches('.recipe__love,.recipe__love *'))
    {

       controlLike();
    }


  });

/*  
  
    NOTE: state.recipe and search.recipe are inside the object of "state"
          AJAX WALI RECIPE NHI H confuse mat hoio
    
          >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
           STATE OBJECT IN CONSOLE
                  state={
                  search:Search,
                  recipe:Recipe,
                  list:List
                  }
                  
          <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    
    
          [ NOTE: Recipe.js is making the whole object like this ok
        import Recipe from './models/Recipe';--->Recipe mein phle sara object bnage Recipe.js se
        fir state.recipe class  ke through Recipe se fetch karega data object ka
    ]
   
    ex. console.log(state.recipe);
      OP  in console for state.recipe:-
     Recipe:  { id:".." title:".." author:".." ingredients:Array(6) time:30 title:".." url:".."  }
      author:".."
      id:".."
      img:".."
      ingredients: Array(6)
      0: {count: 4.5, unit: "cup", ingredient: "unbleached high-gluten, bread, or all-purpose flour, 
           chilled"}
      1: {count: 1.75, unit: "tsp", ingredient: "salt"}
      2: {count: 1, unit: "tsp", ingredient: "instant yeast"}
      3: {count: 0.25, unit: "cup", ingredient: "olive oil "}
      4: {count: 1.75, unit: "cup", ingredient: "water, ice cold "}
      5: {count: 1, unit: "", ingredient: "semolina flour or cornmeal for dusting"} 
      serving:4,
      time:30
      title:".. ."
      url:". ."    
      proto:Object
    
  */
  

   //////****LIKES CONTROLLER *****///////

   
   const contolLikes=()=>{

    if(!state.likes) state.likes= new Likes();
    const currentID=state.recipe.id;

    if(!state.likes.isLiked(currentID))
    {

      const newLike=state.likes.addLike(currentID, state.recipe.title,state.recipe.author,state.recipe.img);
      
      
      //Toggle the like button
       likesView.toggelButton(true); 

      //Add like to the UI
      likesView.renderLike(newLike);
      // console.log(state.likes);
      
      

    }else{
      //Remove like  from the state 
      state.likes.deleteLike(currentID);
       
      //Toggle the like button
      likesView.toggelButton(false);

      //Remove like from UI list 
      // console.log(state.likes);
      likesView.deleteLike(currentID);
    }


    likesView.toggelLikeMenu(state.likes.getNumLikes());
   };



   //Restore liked recipe on page

   window.addEventListener('load',()=>{
    
    state.likes= new Likes();

    //Restore likes
    
    state.likes.readStorage();
    //Toggle  like menu button
    likesView.toggelLikeMenu(state.likes.getNumLikes());

    //Render the existing likes\

    state.likes.likes.forEach(like=> likesView.renderLike(like));

   });







///Handling recipe button clicks

elements.recipe.addEventListener('click',e=>{

  if(e.target.matches('.btn-decrease, .btn-decrease *')){
   // "*" means the child element of the class
   //Decrease button is clicked

   if(state.recipe.serving>1){
   // state.recipe == object hai state me vo use kia h
    state.recipe.updateServings('dec');
    recipeview.updateServingsIngredients(state.recipe);
   }

   }else if(e.target.matches('.btn-increase, .btn-increase *'))
        {
          state.recipe.updateServings('inc');
          recipeview.updateServingsIngredients(state.recipe);
        
  }else if(e.target.matches('.recipe__btn--add,.recipe__btn--add *')){

            controlList();

  }else if(e.target.matches('.recipe__love,.recipe__love *')){
      contolLikes();

  }

        // console.log(state.recipe);
        // console.log(state.search);



});


// window.l= new List();




















// import str from './models/Search';
// import * as searchview  from './views/searchView';
// console.log(`Using imported functions ${searchview.add(searchview.ID,2)} and ${searchview.multiply(3,5)}.${str}` );

//import {add,multiply} from './views/searchView';
// console.log(`Using imported functions ${add(ID,2)} and ${multiply(3,5)}.${str}` );

// import {add as a,multiply as m } from './views/searchView';
// console.log(`Using imported functions ${a(ID,2)} and ${m(3,5)}.${str}` );

//https://forkify-api.herokuapp.com/api/search
