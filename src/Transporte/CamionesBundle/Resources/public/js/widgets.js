/** Utilizar la librería widgets para extender otros widgets */

var IngresoWidget = BaseWidget.extend({
    tractorInputId: '',
    addRefreshListener: function() {
        $("#refresh").click(function(e) {
            e.preventDefault();
            location.reload();
        });
    },
    addTractorFormListener: function() {
        var self = this;
        /** TRACTOR */
        $(self.tractorInputId).keyup(function(e) {
            $(this).val($(this).val().toUpperCase());
            if(e.keyCode == 13) {
                $("#buscar_tractor").click();
            }
        });
        $("#buscar_tractor").click(function(e) {
            e.preventDefault();
            var patente = $(self.tractorInputId).val();
            if (patente == "") $("#tractor-empty").show(); else $("#tractor-empty").hide();
            if (patente !== "") {
                $.ajax({
                    method: 'GET',
                    dataType: 'json',
                    beforeSend: self.setHeader,
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
    },
    addPlayoFormListener: function() {
        var self = this;
        $("#transporte_camionesbundle_ingreso_playo_patente").keyup(function(e) {
            $(this).val($(this).val().toUpperCase());
            if(e.keyCode == 13) {
                $("#buscar_playo").click();
            }
        });
        $("#buscar_playo").click(function(e) {
            e.preventDefault();
            var patente = $("#transporte_camionesbundle_ingreso_playo_patente").val();
            if (patente == "") $("#playo-empty").show(); else $("#playo-empty").hide();
            if (patente !== "") {
                $.ajax({
                    method: 'GET',
                    dataType: 'json',
                    beforeSend: self.setHeader,
                    url: window.transporte.apiURL + "/zap/cnrt/patente/playo/" + patente
                }).done(function(response) {
                    if (response.status == 'OK') {
                        var playo = response.data;
                        $("#playo-dominio-input").val(playo.dominio);
                        $("#playo-anio_modelo-input").val(playo.anio_modelo);
                        $("#playo-cantidad_ejes-input").val(playo.cantidad_ejes);
                        $("#playo-razon_social-input").val(playo.razon_social);
                        $("#playo-data").show();
                        $("#playo-not-found").hide();
                    }
                }).fail(function(response) {
                    $("#playo-data").hide();
                    $("#playo-not-found").show();
                });
            }
        });
    },
    pressEnterAndSearchChofer: function() {
        $("#transporte_camionesbundle_ingreso_chofer_dni").keyup(function(e) {
            if(e.keyCode == 13) {
                $("#buscar_chofer").click();
            }
        });
    },
    buscarChoferInCNRT: function(dni) {
        var self = this;
        if (dni == "") $("#chofer-empty").show(); else $("#chofer-empty").hide();
        if (dni !== "") {
            $.ajax({
                method: 'GET',
                dataType: 'json',
                beforeSend: self.setHeader,
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
    },
    nuevoChoferButtonListener: function() {
        var self = this;
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
                    beforeSend: self.setHeader,
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
                        self.buscarChoferInCNRT(dni);
                    }
                }).fail(function(response) {
                    console.log(response);
                });
            }
        });
    },
    addChoferFormListener: function() {
        var self = this;

        this.keyPressOnlyNumbers("#transporte_camionesbundle_ingreso_chofer_dni");

        this.pressEnterAndSearchChofer();

        /** BUSCA EL CHOFER EN LA BASE ZAP */
        $("#buscar_chofer").click(function(e) {
            e.preventDefault();
            var dni = $("#transporte_camionesbundle_ingreso_chofer_dni").val();
            if (dni == "") $("#chofer-empty").show(); else $("#chofer-empty").hide();
            if (dni !== "") {
                $.ajax({
                    method: 'GET',
                    dataType: 'json',
                    beforeSend: self.setHeader,
                    url: window.transporte.apiURL + "/zap/chofer/" + dni
                }).done(function(response) {
                    if (response.status == 'OK' && response.data !== null) {
                        var chofer = response.data;
                        $("#chofer-nombre-input").val(chofer.firstname);
                        $("#chofer-apellido-input").val(chofer.lastname);
                        $("#chofer-mobile-input").val(chofer.mobile);
                        $("#chofer-dni-input").val(chofer._id);
                        $("#chofer-data").show();
                        $("#chofer-not-found").hide();
                        self.buscarChoferInCNRT(dni);
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

        self.nuevoChoferButtonListener();
    },
    autoCompleteContenedores: function() {
        var self = this;
        $.ajax({
            method: 'GET',
            dataType: 'json',
            beforeSend: self.setHeader,
            url: window.transporte.apiURL + "/zap/turnos/contenedores"
        }).done(function(response) {
            if (response.status == 'OK') {
                var contenedores = response.data;
                for (c in contenedores) {
                    if (contenedores.hasOwnProperty(c)) {
                        var contenedor = contenedores[c];
                        $("#contenedores-list").append($("<option value='" + contenedor + "'>" + contenedor + "</option>"));
                    }
                }
            }
        });
    },
    buscarTurnoListener: function() {
        var self = this;
        $("#buscar_turno").click(function(e) {
            e.preventDefault();
            var tractor_patente = $("#transporte_camionesbundle_ingreso_tractor_patente").val();
            var contenedor = $("#transporte_camionesbundle_ingreso_contenedor").val();
            if (tractor_patente === "" && contenedor === "") {
                $(".turno-error").html("Debe ingresar un dato para Consultar el Turno.").show();
                $("#form-group-tractor").addClass('has-error');
                $("#form-group-contenedor").addClass('has-error');
                return false;
            }

            $(".turno-error").hide();
            $("#form-group-tractor").removeClass('has-error');
            $("#form-group-contenedor").removeClass('has-error');

            var data = {}; // Extiendo el data con Patente de Tractor y Contenedor para API de turno por Patente y Contenedor
            if (tractor_patente !== "") {
                $.extend(data, { tractor_patente : tractor_patente });
            }
            if (contenedor !== "") {
                $.extend(data, { contenedor : contenedor });
                /** BUSCAR TURNO POR CONTENEDOR */
                $.ajax({
                    method: 'GET',
                    dataType: 'json',
                    beforeSend: self.setHeader,
                    url: window.transporte.apiURL + "/zap/turno/contenedor/" + contenedor
                }).done(function(response) {
                    if (response.status == 'OK') {
                        var turnos = response.data;
                        if (turnos.length > 0) {
                            var turno = turnos[0];
                            var now = new Date();
                            var dateInicio = new Date(turno.inicio);
                            var dateFin = new Date(turno.fin);
                            if (now > dateInicio && now < dateFin) {
                                self.alertSuccess("Llegada al Turno en horario", "Aviso de llegada de turno en horario. ")
                            } else {
                                self.alertError("Llegada Tarde", "El Tractor ha ingresado tarde. Turno: De: " + self.dateTimeFormat(dateInicio) + " a " + self.dateTimeFormat(dateFin));
                            }
                        } else {
                            self.alertWarning("Consulta de Turno", "No se encontró el Turno.")
                        }
                    }
                });
            }
        });
    },
    init: function(args) {
        this._super(args);

        this.dontUseEnterInForm();

        this.addRefreshListener();

        this.addTractorFormListener();

        this.addChoferFormListener();

        this.addPlayoFormListener();

        this.autoCompleteContenedores();

        this.buscarTurnoListener();
    }
});