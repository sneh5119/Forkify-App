// export const add=(a,b)=>a+b;
// export const multiply=(a,b)=>a*b;
// export const ID=23;


import {elements} from './base';

export const getInput=()=>elements.searchInput.value;  /// It will automatically return the value 
export const clearInput=()=>{
    elements.searchInput.value='';
};

export const clearResults=()=>{
    elements.searchResList.innerHTML='';
    elements.searchResPages.innerHTML='';
};

export const highlightSelected=id=>{

  const resultArr= Array.from(document.querySelectorAll('.results__link'));
  resultArr.forEach(el=>{
     el.classList.remove('results__link--active');

  });

  document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');

};

export const limitRecipeTitle=(title,limit=17)=>{

    if(title.length>limit){

        const newTitle=[];
        title.split(' ').reduce((acc,cur)=>{

            if(acc+cur.length<=limit){
                newTitle.push(cur);
            }

            return acc+cur.length;
        },0);

     return `${newTitle.join(' ')}...`;
    }
    return title;
};


const renderRecipe= recipe=>{

    const markup=`
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

elements.searchResList.insertAdjacentHTML('beforeend',markup);
};


  const createButton=(page,type)=>`

                <button class="btn-inline results__btn--${type}" data-goto="${type==='prev'? page-1:page+1}">
                <span>Page ${type==='prev'? page-1:page+1}</span> 
                  <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type==='prev'? 'left':'right'}"></use>
                    </svg>
                    
                </button>
                
  `;

const renderButtons=(page,numResults,resperPage)=>{
    // through this function we are implementing buttons 
    const pages=Math.ceil(numResults/resperPage);  
    // return number of pages according to total length of array (results)
    //(30/10)= 3 pages [30 is the total no. of recipes in the array (recipes)*trough the API*]
    //10 = results per page

    let button;

    if(page===1 && pages>1){
     //we are on the first page   
     // Button to go to the next page
   
     button=createButton(page,'next');


    }else if(page<pages){
      // means we are in the middle of pages
      //we want both previous and next button

     button=`
     ${createButton(page,'prev')}
     ${createButton(page,'next')}
     `;

    }else if(page===pages && pages>1){
     //Means that we are on the last page
    //Button to go to the previous page
    button=createButton(page,'prev');
    }

  elements.searchResPages.insertAdjacentHTML('afterbegin',button);  
};




export const renderResults= (recipes,page=1,resperPage=10)=>{

    //render results from current page
    const start=(page-1)*resperPage;  // (1-1)*10=0 starting from 0 
    const end=page*resperPage;  //1*10 =10 results at one page

    recipes.slice(start,end).forEach(renderRecipe);  //slice(0,10) it will cut the array from 0 to 9
     
    // render pagination buttons

    renderButtons(page,recipes.length,resperPage);

};