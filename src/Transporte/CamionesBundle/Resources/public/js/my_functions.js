function setHeader(xhr) {
    xhr.setRequestHeader('token', window.transporte.token);
}

function dontUseEnterInForm() {
    $("input").keydown(function(e) {
        if(e.keyCode == 13) {
            e.preventDefault();
            return false;
        }
    });
}

function addTractorFormListener(tractorInputId) {
    /** TRACTOR */
    $(tractorInputId).keyup(function(e) {
        $(this).val($(this).val().toUpperCase());
        if(e.keyCode == 13) {
            $("#buscar_tractor").click();
        }
    });
    $("#buscar_tractor").click(function(e) {
        e.preventDefault();
        var patente = $(tractorInputId).val();
        if (patente == "") $("#tractor-empty").show(); else $("#tractor-empty").hide();
        if (patente !== "") {
            $.ajax({
                method: 'GET',
                dataType: 'json',
                beforeSend: setHeader,
                url: window.transporte.apiURL + "/zap/cnrt/patente/" + patente
            }).done(function(response) {
                if (response.status == 'OK') {
                    var tractor = response.data;
                    $("#tractor-dominio-input").val(tractor.dominio);
                    $("#tractor-anio_modelo-input").val(tractor.anio_modelo);
                    $("#tractor-cantidad_ejes-input").val(tractor.cantidad_ejes);
                    $("#tractor-razon_social-input").val(tractor.razon_social);
                    $("#tractor-data").show();
                    $("#tractor-not-found").hide();
                }
            }).fail(function(response) {
                $("#tractor-data").hide();
                $("#tractor-not-found").show();
            });
        }
    });
}