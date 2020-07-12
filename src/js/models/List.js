
import uniqid from 'uniqid';

export default class List{ 

    /**  We have created the class List and in the class we hve passed,
     * the empty array of 'items' 
     *   we will pass the object in the class which contains the following 
     *  property of count, id, unit and ingredient
     *   array mein jo bhi element pass hoga vo class ka object hoga 
     *   Each element in the array will have the proprties of count ,id, ingredient ,unit
     *  */ 
   constructor(){
       this.items=[];
   }

     addItem(count, unit , ingredient){

        const item={
            id:uniqid(),
            count,  // means count:count
            unit,
            ingredient

        }

     this.items.push(item);
      return item;
     
    }

     deleteItem(id){
         const index= this.items.findIndex(el=>el.id===id);
         //[2,4,6] splice(1,2) --> returns [4,8]--> original array is [2] now
         // splice(start Index, no. of elements to delete)==>>> mutates the original array
         //[2,4,6] slice(1,2)--> returns 4 --> original array is [2,4,6] 

        this.items.splice(index,1);
     }

     updateCount(id, newCount){

      this.items.find(el => el.id === id).count = newCount;
     }




}
