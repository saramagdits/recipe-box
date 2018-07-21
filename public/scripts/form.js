const init = function () {
    let removeIngredientButton = document.getElementsByClassName("fa-minus-square");
    let addIngredientButton = document.getElementById("addIngredient");

    addIngredientButton.addEventListener("click", addIngredient);

    for (let i = 0; i < removeIngredientButton.length; i++) {
        let btn = removeIngredientButton[i];
        btn.addEventListener("click", removeIngredient);
    }
};

/* Start - Event-Listeners */
const removeIngredient = function (event) {
    event.target.previousElementSibling.remove();
    event.target.remove();
};

const addIngredient = function () {

    let ingredientsList = document.getElementById("ingredientsList");
    let newIngredient = document.createElement("input");
    newIngredient.setAttribute("type", "text");
    newIngredient.setAttribute("name", "ingredients[]");
    newIngredient.setAttribute("class", "form-control");
    newIngredient.setAttribute("placeholder", "Enter an ingredient");
    ingredientsList.appendChild(newIngredient);

    let removeIngredient = document.createElement("i");
    removeIngredient.setAttribute("class", "far fa-minus-square fa-lg");
    removeIngredient.addEventListener("click", removeIngredient);
    ingredientsList.appendChild(removeIngredient);
};
//UPDATES FILE INPUT PLACEHOLDER 
$("#img").on('change', function () {
    //get the file name
    let fileName = $(this).val().split('\\').pop();
    //replace the "Choose a file" label
    $(this).next('.custom-file-label').html(fileName);
});
/* End - Event Listeners*/

init();