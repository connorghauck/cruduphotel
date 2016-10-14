$(function(){
    getOwners();

    $('#owner-form').on('click', '.register', submitOwner);
    $('#pet-form').on('click', '.register', submitPet);
});

function getOwners(){
    $.ajax({
        type: 'GET',
        url: '/owners',
        success: function(data){
            ownerToDropdown(data);
        }
    });
}

function ownerToDropdown(response){
    console.log(response);
    event.preventDefault();
    var $selection = $('#ownerSelection');
    // $selection.empty();
    response.forEach(function(owner){
        var $option = $('<option value="'+owner.id+'"></option>');
        $option.text(owner.first_name + ' ' + owner.last_name);
        $selection.append($option);


    });
}

function submitOwner(event){
    event.preventDefault();

    var ownerData = $('#owner-form').serialize();
    console.log(ownerData);
    $.ajax({
        type: 'POST',
        url: '/owners',
        data: ownerData,
        success: ownerToDropdown
    });
    $('#owner-form').find('input').val('');

}

function submitPet(event){
    event.preventDefault();
    console.log($(this));
    console.log($('#ownerSelection'));
    var petData = $('#pet-form').serialize();
    console.log(petData);
    $.ajax({
        type: 'POST',
        url: '/pets/',
        data: petData,
        success: getPets
    });
    $('#pet-form').find('input').val('');

}

function getPets(){
    $.ajax({
        type: 'GET',
        url: '/pets',
        success: displayAll
    });
}


function displayAll(response){
 console.log(response);
 var $list = $('#owner-list');
 $list.empty();
 response.forEach(function(owner, pets){
   var $li = $('<li></li>');
   var $form = $('<form></form>');
   $form.append('<input type="text" name="firstName" value="' + owner.first_name + '"/>');
   $form.append('<input type="text" name="lastName" value="' + owner.last_name + '"/>');
   $form.append('<input type="text" name="petName" value="' + pets.name + '"/>');
   $form.append('<input type="text" name="petBreed" value="' + pets.breed + '"/>');
   $form.append('<input type="text" name="petColor" value="' + pets.color + '"/>');

   //make sure is jQuery element include $
   var $saveButton = $('<button class="save">Save</button>');
   // $saveButton.data('id', pets.id); //stores data on the button
   $form.append($saveButton);

   var $deleteButton = $('<button class="delete">Delete</button>');
   // $deleteButton.data('id', pets.id);
   $form.append($deleteButton);

   var $checkInOut = $('<button class="check"> something</button>');

   $form.append($checkInOut);

   $li.append($form);
   $list.append($li);

 });
}
