import {elements} from './base';
import {limitRecipeTitle} from './searchView';

export const toggelButton = isLiked =>{

    const iconString= isLiked? 'icon-heart' : 'icon-heart-outlined';
     document.querySelector('.recipe__love use').setAttribute('href',`img/icons.svg#${iconString}`);
     /*img/icons.svg#icon-heart-outlined =>  IT IS THE OUTLINED HEART ;when it is not liked 
                                            (then it is the heart with an outline)*/
     //img/icons.svg#icon-heart => it is the colored heart
}

export const toggelLikeMenu= numlikes =>{
   
    elements.likesMenu.style.visibility=numlikes>0?'visible':'hidden';

};

export const renderLike=like=>{

    const markup=`
                    <li>
                    <a class="likes__link" href="#${like.id}">
                        <figure class="likes__fig">
                            <img src="${like.img}" alt="${like.title}">
                        </figure>
                        <div class="likes__data">
                            <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                            <p class="likes__author">${like.author}</p>
                        </div>
                    </a>
                </li>
    
    `;

    elements.likeslist.insertAdjacentHTML('beforeend',markup);
};


export const deleteLike=id=>{

   const el= document.querySelector(`.likes__link[href*="#${id}"]`).parentElement;

   if(el)
   el.parentElement.removeChild(el);
}

