function keyPressOnlyNumbers(inputId)
{
    $(inputId).keydown(function(e) {
        // Allow: backspace, delete, tab, escape and enter
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
             // Allow: Ctrl/cmd+A
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
             // Allow: Ctrl/cmd+C
            (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
             // Allow: Ctrl/cmd+X
            (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
}

function pressEnterAndSearch()
{
    $("#transporte_camionesbundle_ingreso_chofer_dni").keyup(function(e) {
        if(e.keyCode == 13) {
            $("#buscar_chofer").click();
        }
    });
}

function nuevoChoferButtonListener()
{
    /** ALTA CHOFER */
    $("#guardar-alta-chofer").click(function(e) {
        e.preventDefault();
        var dni = $("#transporte_camionesbundle_ingreso_chofer_dni").val();
        var firstname = $("#modal-alta-chofer-input-firstname").val();
        var lastname = $("#modal-alta-chofer-input-lastname").val();
        var mobile = $("#modal-alta-chofer-input-mobile").val();
        if (firstname == "") $("#modal-alta-chofer-input-firstname-empty").show(); else $("#modal-alta-chofer-input-firstname-empty").hide();
        if (lastname == "") $("#modal-alta-chofer-input-lastname-empty").show(); else $("#modal-alta-chofer-input-lastname-empty").hide();
        if (mobile == "") $("#modal-alta-chofer-input-mobile-empty").show(); else $("#modal-alta-chofer-input-mobile-empty").hide();
        if (firstname !== "" && lastname !== "" && mobile !== "") {
            var data = {
                _id : dni,
                firstname: firstname,
                lastname: lastname,
                mobile: mobile
            };
            $.ajax({
                method: 'POST',
                dataType: 'json',
                beforeSend: setHeader,
                url: window.transporte.apiURL + "/zap/chofer",
                data: data
            }).done(function(response) {
                if (response.status == 'OK') {
                    $("#chofer-nombre-input").val(firstname);
                    $("#chofer-apellido-input").val(lastname);
                    $("#chofer-mobile-input").val(mobile);
                    $("#chofer-dni-input").val(dni);
                    $("#chofer-data").show();
                    $("#chofer-not-found").hide();
                    $("#alta-chofer").modal('toggle');
                    buscarChoferInCNRT(dni);
                }
            }).fail(function(response) {
                console.log(response);
            });
        }
    });
}

function buscarChoferInCNRT(dni)
{
    if (dni == "") $("#chofer-empty").show(); else $("#chofer-empty").hide();
    if (dni !== "") {
        $.ajax({
            method: 'GET',
            dataType: 'json',
            beforeSend: setHeader,
            url: window.transporte.apiURL + "/zap/cnrt/chofer/" + dni
        }).done(function(response) {
            if (response.status == 'OK') {
                var chofer = response.data;
                $("#chofer-nombre-input").val(chofer.nombre);
                $("#chofer-apellido-input").val(chofer.apellido);
                $("#chofer-dni-input").val(chofer.dni);
                $("#chofer-cnrt-not-found").hide();
            }
        }).fail(function(response) {
            $("#chofer-cnrt-not-found").show();
        });
    }
}

function addChoferFormListener()
{
    /** CHOFER */
    keyPressOnlyNumbers("#transporte_camionesbundle_ingreso_chofer_dni");

    pressEnterAndSearch();

    /** BUSCA EL CHOFER EN LA BASE ZAP */
    $("#buscar_chofer").click(function(e) {
        e.preventDefault();
        var dni = $("#transporte_camionesbundle_ingreso_chofer_dni").val();
        if (dni == "") $("#chofer-empty").show(); else $("#chofer-empty").hide();
        if (dni !== "") {
            $.ajax({
                method: 'GET',
                dataType: 'json',
                beforeSend: setHeader,
                url: window.transporte.apiURL + "/zap/chofer/" + dni
            }).done(function(response) {
                if (response.status == 'OK') {
                    var chofer = response.data;
                    $("#chofer-nombre-input").val(chofer.firstname);
                    $("#chofer-apellido-input").val(chofer.lastname);
                    $("#chofer-mobile-input").val(chofer.mobile);
                    $("#chofer-dni-input").val(chofer._id);
                    $("#chofer-data").show();
                    $("#chofer-not-found").hide();
                    buscarChoferInCNRT(dni);
                }
            }).fail(function(jqXHR) {
                var response = jqXHR.responseJSON;
                if (response.status == 'OK' && response.data !== null) { // TODO: Eliminar cuando esté corregido la API
                    var chofer = response.data;
                    $("#chofer-nombre-input").val(chofer.firstname);
                    $("#chofer-apellido-input").val(chofer.lastname);
                    $("#chofer-mobile-input").val(chofer.mobile);
                    $("#chofer-dni-input").val(chofer._id);
                    $("#chofer-data").show();
                    $("#chofer-not-found").hide();
                    buscarChoferInCNRT(dni);
                } else {
                    $("#chofer-data").hide();
                    $("#chofer-not-found").show();
                    /** Mostrar Modal Alta Chofer */
                    $("#modal-alta-chofer-input-firstname").val("");
                    $("#modal-alta-chofer-input-lastname").val("");
                    $("#modal-alta-chofer-input-mobile").val("");
                    $("#alta-chofer").modal();
                }
            });
        }
    });

    nuevoChoferButtonListener();
}