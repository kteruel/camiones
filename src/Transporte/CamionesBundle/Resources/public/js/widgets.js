/** Utilizar la librería widgets para extender otros widgets */

var IngresoWidget = BaseWidget.extend({
    tractorInputId: '',
    addRefreshListener: function() {
        $("#refresh").click(function(e) {
            e.preventDefault();
            window.location.href = window.location.href;
        });
    },

    /** CAMPO TRACTOR */
    mostrarDatosTractor: function (tractor) {
        $("#tractor-dominio-input").val(tractor._id);
        $("#tractor-anio_modelo-input-input").val(tractor.year);
        $("#tractor-cantidad_ejes-input").val(tractor.axis);
        $("#tractor-data").show();
        $("#tractor-not-found").hide();
    },
    ajaxBuscarTractorEnHistorico: function(patente) {
        var self = this;
        $.ajax({
            method: 'GET',
            dataType: 'json',
            beforeSend: self.setHeader,
            url: window.transporte.apiURL + "/zap/camion/" + patente
        }).done(function(response) {
            if (response.status == 'OK' && response.data !== null) {
                var tractor = response.data;
                self.mostrarDatosTractor(tractor);
            } else {
                $("#tractor-data").hide();
                $("#tractor-not-found").show();
                /** Mostrar Modal Alta Tractor */
                $("#modal-alta-tractor-input-axis").val("");
                $("#modal-alta-tractor-input-year").val("");
                $("#alta-tractor").modal();
            }
        });
    },
    ajaxBuscarTractorCompletoEnHistorico: function(patente) {
        var self = this;
        $.ajax({
            method: 'GET',
            dataType: 'json',
            beforeSend: self.setHeader,
            url: window.transporte.apiURL + "/zap/historico/camion/" + patente
        }).done(function(response) {
            if (response.status == 'OK' && response.data !== null) {
                var data = response.data;
                var playo = data.trailerId;
                var chofer = data.driverId;
                self.mostrarDatosChofer(chofer, true);
                self.mostrarDatosPlayo(playo, true);
            } else {
                self.ajaxBuscarTractorEnHistorico(patente);
            }
        });
    },
    addTractorFormListener: function() {
        var self = this;
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
                self.ajaxBuscarTractorCompletoEnHistorico(patente);
                self.buscarTractorInCNRT(patente);
            }
        });

        self.nuevoTractorButtonListener();
    },
    buscarTractorInCNRT: function(patente) {
        var self = this;
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
                    $("#tractor-cnrt-not-found").hide();
                }
            }).fail(function(response) {
                $("#tractor-cnrt-not-found").show();
            });
        }
    },
    nuevoTractorButtonListener: function() {
        var self = this;
        $("#guardar-alta-tractor").click(function(e) {
            e.preventDefault();
            var patente = $("#transporte_camionesbundle_ingreso_tractor_patente").val();
            var axis = $("#modal-alta-tractor-input-axis").val();
            var year = $("#modal-alta-tractor-input-year").val();
            if (patente !== "") {
                var data = {
                    _id : patente,
                    axis: axis,
                    year: year
                };
                $.ajax({
                    method: 'POST',
                    dataType: 'json',
                    beforeSend: self.setHeader,
                    url: window.transporte.apiURL + "/zap/camion",
                    data: data
                }).done(function(response) {
                    if (response.status == 'OK') {
                        $("#tractor-dominio-input").val(patente);
                        $("#tractor-cantidad_ejes-input").val(axis);
                        $("#tractor-anio_modelo-input").val(year);
                        $("#tractor-data").show();
                        $("#tractor-not-found").hide();
                        $("#alta-tractor").modal('toggle');
                        self.buscarTractorInCNRT(patente);
                    }
                }).fail(function(response) {
                    console.log(response);
                });
            }
        });
    },
    /** FIN CAMPO TRACTOR */
    /** CAMPO PLAYO */
    mostrarDatosPlayo: function(playo, completeIdInput) {
        if (completeIdInput) {
            $("#transporte_camionesbundle_ingreso_playo_patente").val(playo._id);
        }
        $("#playo-dominio-input").val(playo._id);
        $("#playo-anio_modelo-input-input").val(playo.year);
        $("#playo-cantidad_ejes-input").val(playo.axis);
        $("#playo-data").show();
        $("#playo-not-found").hide();
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
                    url: window.transporte.apiURL + "/zap/playo/" + patente
                }).done(function(response) {
                    if (response.status == 'OK' && response.data !== null) {
                        var playo = response.data;
                        self.mostrarDatosPlayo(playo, false);
                        self.buscarPlayoInCNRT(patente);
                    } else {
                        $("#playo-data").hide();
                        $("#playo-not-found").show();
                        /** Mostrar Modal Alta Playo */
                        $("#modal-alta-playo-input-axis").val("");
                        $("#modal-alta-playo-input-year").val("");
                        $("#alta-playo").modal();
                    }
                });
            }
        });

        self.nuevoPlayoButtonListener();
    },
    buscarPlayoInCNRT: function(patente) {
        var self = this;
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
                    $("#playo-cnrt-not-found").hide();
                }
            }).fail(function(response) {
                $("#playo-cnrt-not-found").show();
            });
        }
    },
    nuevoPlayoButtonListener: function() {
        var self = this;
        $("#guardar-alta-playo").click(function(e) {
            e.preventDefault();
            var patente = $("#transporte_camionesbundle_ingreso_playo_patente").val();
            var axis = $("#modal-alta-playo-input-axis").val();
            var year = $("#modal-alta-playo-input-year").val();
            if (patente !== "") {
                var data = {
                    _id : patente,
                    axis: axis,
                    year: year
                };
                $.ajax({
                    method: 'POST',
                    dataType: 'json',
                    beforeSend: self.setHeader,
                    url: window.transporte.apiURL + "/zap/playo",
                    data: data
                }).done(function(response) {
                    if (response.status == 'OK') {
                        $("#playo-dominio-input").val(patente);
                        $("#playo-cantidad_ejes-input").val(axis);
                        $("#playo-anio_modelo-input").val(year);
                        $("#playo-data").show();
                        $("#playo-not-found").hide();
                        $("#alta-playo").modal('toggle');
                        self.buscarPlayoInCNRT(patente);
                    }
                }).fail(function(response) {
                    console.log(response);
                });
            }
        });
    },
    /** FIN CAMPO PLAYO */
    /** CAMPO CHOFER */
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
    mostrarDatosChofer: function(chofer, completeIdInput) {
        if (completeIdInput) {
            $("#transporte_camionesbundle_ingreso_chofer_dni").val(chofer._id);
        }
        $("#chofer-nombre-input").val(chofer.firstname);
        $("#chofer-apellido-input").val(chofer.lastname);
        $("#chofer-mobile-input").val(chofer.mobile);
        $("#chofer-dni-input").val(chofer._id);
        $("#chofer-data").show();
        $("#chofer-not-found").hide();
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
                        self.mostrarDatosChofer(chofer, false);
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
    /** FIN CAMPO CHOFER */
    /** CAMPO CONTENTEDOR */
    addContenedorListener: function() {
        $("#transporte_camionesbundle_ingreso_contenedor").keyup(function(e) {
            $(this).val($(this).val().toUpperCase());
        });
        this.autoCompleteContenedores();
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
    /** FIN CAMPO CONTENTEDOR */
    turnosResponseEvent: function(turnos) {
        var self = this;
        if (turnos.length > 0) {
            var now = new Date();

            for(t in turnos) {
                if (turnos.hasOwnProperty(t)) {
                    var turno = turnos[t];
                    var dateInicio = new Date(turno.inicio);
                    var dateFin = new Date(turno.fin);
                    if (self.equalDates(now, dateInicio)) {
                        $("#turnos-radio").append($("\
                            <div class='radio'>\
                                <label>\
                                    <input type='radio' value='" + dateInicio.toISOString() + "-" + dateFin.toISOString() + "'" +
                                    "data-inicio='" + turno.inicio + "' data-fin='" + turno.fin + "' data-mov='" + turno.mov + "'" +
                                    ">" +
                                    self.dateTimeFormat(dateInicio) + " a " + self.dateTimeFormat(dateFin) +
                                "</label>\
                            </div>"
                        ));
                    }
                }
            }
            // Muestro los turnos de hoy
            if ($("#turnos-radio .radio").length > 0) {
                $("#form-group-turnos").show();
                $("#turnos-radio .radio label").click(function(e) {
                    var $input = $(this).find('input');
                    var mov = $input.attr('data-mov');
                    var inicio = $input.attr('data-inicio');
                    var fin = $input.attr('data-fin');
                    $("#transporte_camionesbundle_ingreso_mov").val(mov);
                    $("#transporte_camionesbundle_ingreso_inicio").val(inicio);
                    $("#transporte_camionesbundle_ingreso_fin").val(fin);
                });
                // Selecciono automáticamente el turno si hay uno solo
                if ($("#turnos-radio .radio").length == 1) {
                    $("#turnos-radio .radio label").click();
                }
            } else { // No encontré turnos
                self.alertError("Consulta de Turno", "No se encontró ningún Turno.")
            }
        } else {
            self.alertError("Consulta de Turno", "No se encontró ningún Turno.")
        }
    },
    buscarTurnoListener: function() {
        var self = this;
        $("#buscar_turno_por_tractor").click(function(e) {
            e.preventDefault();
            var tractor_patente = $("#transporte_camionesbundle_ingreso_tractor_patente").val();
            if (tractor_patente === "") {
                $(".turno-error").html("Debe ingresar un dato para Consultar el Turno.").show();
                $("#form-group-tractor").addClass('has-error');
                return false;
            }

            $(".turno-error").hide();
            $("#form-group-tractor").removeClass('has-error');

            if (tractor_patente !== "") {
                /** BUSCAR TURNO POR CONTENEDOR */
                $.ajax({
                    method: 'GET',
                    dataType: 'json',
                    beforeSend: self.setHeader,
                    url: window.transporte.apiURL + "/zap/turno/patente/" + tractor_patente
                }).done(function(response) {
                    if (response.status == 'OK') {
                        var turnos = response.data;
                        self.turnosResponseEvent(turnos);
                    }
                });
            }
        });
        $("#buscar_turno_por_contenedor").click(function(e) {
            e.preventDefault();
            var contenedor = $("#transporte_camionesbundle_ingreso_contenedor").val();
            if (contenedor === "") {
                $(".turno-error").html("Debe ingresar un dato para Consultar el Turno.").show();
                $("#form-group-contenedor").addClass('has-error');
                return false;
            }

            $(".turno-error").hide();
            $("#form-group-contenedor").removeClass('has-error');

            if (contenedor !== "") {
                /** BUSCAR TURNO POR CONTENEDOR */
                $.ajax({
                    method: 'GET',
                    dataType: 'json',
                    beforeSend: self.setHeader,
                    url: window.transporte.apiURL + "/zap/turno/contenedor/" + contenedor
                }).done(function(response) {
                    if (response.status == 'OK') {
                        var turnos = response.data;
                        self.turnosResponseEvent(turnos);
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

        this.addContenedorListener();

        this.buscarTurnoListener();
    }
});