
$(document).ready(function () {
    // ADD INGREDIENTS
    // i is used to assign an id to each new input group and delete button, so that it may be targeted for deletion later
    let i = 1;
    $("#add").click(function () {
        i++;
        $("#ingredientsList").append("<div id='ingredient" + i + "' class='input-group mb-3'><input type='text' class='form-control' placeholder='Add an ingredient' name='ingredients[]'><div class='input-group-append'><button id='" + i + "' class='btn-remove btn btn-outline-danger' type='button'><i class='fas fa-trash-alt'></i></button></div></div>");
    });

    // REMOVE INGREDIENTS
    // delete the input group with the matching id
    $(document).on("click", ".btn-remove", function () {
        let buttonId = $(this).attr("id");
        $("#ingredient" + buttonId + "").remove();
    });

    //UPDATE FILE INPUT PLACEHOLDER
    $("#img").on('change', function () {
        //get the file name
        let fileName = $(this).val().split('\\').pop();
        //replace the "Choose a file" label
        $(this).next('.custom-file-label').html(fileName);
    });
});

