var init = function(){
    var removeIngredientButton = document.getElementsByClassName("fa-minus-square");
    var addIngredientButton = document.getElementById("addIngredient");

    addIngredientButton.addEventListener("click", addIngredient);

    for (var i=0; i < removeIngredientButton.length; i++){
        var btn = removeIngredientButton[i];
        btn.addEventListener("click", removeIngredient);
    }
};

/* Start - Event-Listeners */
var removeIngredient = function(event, test){
    event.target.previousElementSibling.remove();
    event.target.remove();
};

var addIngredient = function(){
    
    var ingredientsList = document.getElementById("ingredientsList");
    var newIngredient = document.createElement("input");
    newIngredient.setAttribute("type", "text");
    newIngredient.setAttribute("name", "ingredients[]");
    newIngredient.setAttribute("class", "form-control");
    newIngredient.setAttribute("placeholder", "Enter an ingredient");
    ingredientsList.appendChild(newIngredient);
    
    var removeIngredient = document.createElement("i");
    removeIngredient.setAttribute("class","far fa-minus-square fa-lg");
    removeIngredient.addEventListener("click", removeIngredient);
    ingredientsList.appendChild(removeIngredient);
};
//UPDATES FILE INPUT PLACEHOLDER 
$("#img").on('change',function(){
    //get the file name
    var fileName = $(this).val().split('\\').pop();
    //replace the "Choose a file" label
    $(this).next('.custom-file-label').html(fileName);
});
/* End - Event Listeners*/

init();