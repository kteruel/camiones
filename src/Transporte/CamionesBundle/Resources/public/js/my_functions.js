function dontUseEnterInForm() {
    $("input").keydown(function(e) {
        if(e.keyCode == 13) {
            e.preventDefault();
            return false;
        }
    });
}

function addTractorFormListener(tractorInputId, urlBuscarCamion) {
    /** TRACTOR */
    $(tractorInputId).keyup(function(e) {
        $(this).val($(this).val().toUpperCase());
        if(e.keyCode == 13) {
            $("#buscar_tractor").click();
        }
    });
    $("#buscar_tractor").click(function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: urlBuscarCamion,
            data: { tractor_patente: $(tractorInputId).val() }
        }).done(function(response) {
            if (response.status == 'ok') {
                var tractor = response.data;
                $("#tractor-titular-input").val(tractor.titular);
                $("#tractor-documento-input").val(tractor.documento);
                $("#tractor-marca-input").val(tractor.marca);
                $("#tractor-tipo-input").val(tractor.tipo);
                $("#tractor-data").show();
                $("#tractor-not-found").hide();
            } else {
                $("#tractor-data").hide();
                $("#tractor-not-found").show();
            }
        });
    });
}