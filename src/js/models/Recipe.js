import axios from 'axios';   // it is used for our ajax call

export default class Recipe{

    constructor(id){
      this.id=id;   // we are using a id, so we can do ajax call to get rest of the data for recipe

    }

    async getRecipe(){
        try{
      // Lets set the result to what we await from the ajax call using axios again 
       const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
      

         this.title=res.data.recipe.title; // data ,recipe ,title are the attributes of the object of res
         this.author=res.data.recipe.publisher;
         this.img=res.data.recipe.image_url;
         this.url=res.data.recipe.source_url;
         this.ingredients=res.data.recipe.ingredients;
        //  console.log(res.data);

        }catch(error){
            console.log(error);
            alert('Something went wrong');
        }
    }


    calcTime(){
     //Assuming that we need 15 min for each 3 ingredients
     // har 3 ingrdients ko 15 min lagenge
     const numIng= this.ingredients.length;
     const periods=Math.ceil(numIng/3);
     this.time=periods * 15;
    }


    calcServings(){
        this.serving=4;
    }



    parseIngredients(){

      const unitsLong=['tablespoons','tablespoon','ounces','ounces','teaspoons','teaspoon','cups','pounds'];
      const unitsShort=['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
      const units=[...unitsShort,'kg','g'];



      const newIngredients=this.ingredients.map(el=>{
        //1) Uniform Units
           let ingredient =el.toLowerCase();
           //console.log(ingredient)
       
          unitsLong.forEach((unit,i)=>{
          ingredient=ingredient.replace(unit,unitsShort[i])
          //  console.log(ingredient)
          });
       
          //2) Remove parentheses
          ingredient=ingredient.replace(/ *\([^)]*\) */g, ' ');

          //3)parse  ingredients into count ,unit and ingredient
          /**unit = tbsp ,tsp ,cup(unitsShort array contains all the units)*/
          const arrIng= ingredient.split(' ');
          const unitIndex= arrIng.findIndex(el2=>units.includes(el2));
          /**
           * unitIndex will give u the index of the unit 
           * it will return -1  in unitIndex, agar unit nhi h toh
           * greater than -1 means arrIng have the unit
           * (mtlb agar -1 se greater hai toh vo index hi return karega)
           * 
           *  */ 



          let objIng;

          if(unitIndex>-1){
              //There is a unit 
             /* 4 1/2 cups ,arrCount=[4,1/2] ---->eval("4+1/2") ----> 4.5 
               4 cups ,arrCount=4             
             */
              const arrCount = arrIng.slice(0,unitIndex); 
              /*  iska mtlb hai ki unitIndex se phele hi number hoga toh 
               *  we are fetching the number in the arrCount  
               *  0 se unitIndex ki string nikal rhe h
               *  eval()===> evaluate           
               */ 
              // arrCount=[4,1/2] ---->eval("4+1/2") ----> 4.5 

                let count;
                if(arrCount.length===1){
                  count= eval(arrIng[0].replace('-','+'));  
                  /**   if(arrCount.length===1)------------>
                   *   iskA MTLB PHELA ELEMENT OF ARRAY NUMBER H
                   *    usi number ko count mein store kia h
                   * */ 
                  //1-1/3 mein - ko + se replace krke evaluate krra h 
                  /**
                   * ex: 1-1/3 tsp of salt
                   * arrIng=["1-1/3","tsp","of","salt"]
                   * unitIndex=1
                   * arrCount = arrIng.slice(0,unitIndex);
                   * arrCount = arrIng.slice(0,1);
                   * i.e -->  arrCount.length=1;
                   *  i.e --> arrIng[0]=1-1/3
                   * i.e ---->eval(arrIng[0].replace('-','+')) --->eval(1-1/3.replace('-','+'))
                   * ---->eval(1+1/3)
                   * eval(1+1/3)--->1.3333
                   * */ 
                 }else{
                  count= eval(arrIng.slice(0,unitIndex).join('+'));
                  /*  ex : 4 1/2 cup of maida
                     arrIng=["4","1/2","cup","of","maida"]
                      here ,unit = cup
                            unitIndex=2
                            slice(0,unitIndex)---->slice(0,2)
                           which gives the array-->["4","1/2"]  
                           now join the array with '+'(array of ["4","1/2"]  is now converted to string 
                           of 4+1/2 )
                           -->4+1/2--->evaluate(4+1/2)===>4.5

                  **/ 
                  // arrCount=[4,1/2] ---->eval("4+1/2") ----> 4.5  
                }

              objIng={
                count,
                unit:arrIng[unitIndex],  // arrIng[2]==>cup
                ingredient:arrIng.slice(unitIndex+1).join(' ')
                /**arrIng.slice(2+1).join(' ')
                 *  arrIng.slice(3).join(' ') 
                 * arrIng=["4","1/2","cup","of","maida"]
                 * from index 3 we will fetch the data till the end of the array
                 * and with the help of join , it will conver to the string
                 * It is sure that after the unitindex , hmesha ingredients the data hoga
                 * tbhi (unitIndex+1) kiya h
                 */ 

              }


          }else if(parseInt(arrIng[0],10)){
               //There is NO unit but the 1st element is number
              /**parseInt(arrIng[0],10)  ===> it will return NaN if arrIng[0] is a text 
               * parseInt(arrIng[0],10) ===> string ko integer mein convert krta h
               * ex: 123 of maida
               * arrIng=["123","of","maida"]
               * arrIng[0]="123" --->123 is in the form of string
               * parseInt(123,10)--->123 as a number in decimal form (10)  
               * 
               * */  
               objIng={
                 count:parseInt(arrIng[0],10),
                 unit:'',
                 ingredient:arrIng.slice(1).join(' ')
                 // after the number their will be the string of ungredients
               }



          }else if(unitIndex===-1){
              //There is NO unit and the NO number in 1st position
              objIng={
              count:1,
              unit:'',
              ingredient
              } 

          }

          return objIng;
       });
       this.ingredients=newIngredients;


    }


    updateServings(type){

      //Servings
      const newServings= type==='dec'? this.serving-1:this.serving+1;
      /** it is '+' and '-' from which we can increase or decrease servings*/ 

      //Ingredients
       this.ingredients.forEach(ing=>{
          
        ing.count *=(newServings/this.serving);
        
        /** we are changing the count of all the ingredients according to the servings
         *  ex: 1 tsp salt FOR servings 4
         *     here count=1 and serving=4
         *     ing.count=1
         *     newServing =3
         *      this.serving=4(old serving in the data )
         *      ing.count=1*(3/4)
         *      it will change all the count of the ingredients
         * */ 

       });


       this.serving= newServings;



    }


}