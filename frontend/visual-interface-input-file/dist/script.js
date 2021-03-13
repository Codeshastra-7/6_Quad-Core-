var inputAddphoto = '<div class="upload-photo">Foto de perfil</div>',
    inputphoto = $('#id_photo');

inputphoto.before(inputAddphoto);

$('.upload-photo').on('click', function() {
    $(this).siblings('#id_photo').trigger('click');
});

inputphoto.on('click', function(){
    var input = $(this),
        reader = new FileReader();

    reader.onload = function (e) {
        input.siblings('.upload-photo').css('background-image', 'url(' + e.target.result + ')');
    };

    reader.readAsDataURL(this.files[0]);
});