/** Utilizar la librería widgets para extender otros widgets */
$("#ribbon-refresh").click(function(e) {
  window.location.href = window.location.href;
});

var today = new Date();
Date.daysBetween = function(date1, date2) {
    //Get 1 day in milliseconds
    var one_day = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;
    //take out milliseconds
    difference_ms = difference_ms / 1000;
    var seconds = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    var minutes = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    var hours = Math.floor(difference_ms % 24);
    var days = Math.floor(difference_ms / 24);

    var resultado = "";
    if (days > 0) {
        resultado = days + "D, " + hours + "H, " + minutes + "M";
    } else if (hours > 0) {
        resultado = hours + "H, " + minutes + "M";
    } else {
        resultado = minutes + "M";
    }

    return resultado;
};

var comboColors = function(comboId) {
  var self = this;
  comboId = '#' + comboId;
  $.ajax({
    method: "GET",
    dataType: "json",
    beforeSend: function (request) {
      request.setRequestHeader("token", window.transporte.token);
        }
    ,
    url: window.transporte.apiURL + "/zap/colors"
  }).done(function(response) {
    if (response.status == "OK") {
      var marcas = response.data;
      $(comboId).empty();
      $(comboId).append($("<option value=''> - Seleccione - </option>"));
      for (m in marcas) {
        if (marcas.hasOwnProperty(m)) {
          var marca = marcas[m];
          if (marca.hasOwnProperty("_id")) {
            $(comboId).append(
              $("<option value='" + marca._id + "'>" + marca._id + "</option>")
            );
          }
        }
      }
    }
  });
};

var comboMarcasAltaCamion = function() {
  var self = this;
  $.ajax({
    method: "GET",
    dataType: "json",
    beforeSend: function (request) {
      request.setRequestHeader("token", window.transporte.token);
        }
    ,
    url: window.transporte.apiURL + "/zap/camionesmarcas"
  }).done(function(response) {
    if (response.status == "OK") {
      var marcas = response.data;
      $("#modal-alta-tractor-input-trade").empty();
      $("#modal-alta-tractor-input-trade").append($("<option value=''> - Seleccione - </option>"));
      for (m in marcas) {
        if (marcas.hasOwnProperty(m)) {
          var marca = marcas[m];
          if (marca.hasOwnProperty("_id")) {
            $("#modal-alta-tractor-input-trade").append(
              $("<option value='" + marca._id + "'>" + marca._id + "</option>")
            );
          }
        }
      }
    }
  });






};

var nuevoTractorButtonListener = function() {
  var self = this;
  $("#guardar-alta-tractor").click(function(e) {
    e.preventDefault();
    var patente = $("#alta-tractor").attr("patente");
    var axis = $("#modal-alta-tractor-input-axis").val();
    var trade = $("#modal-alta-tractor-input-trade").val();
    var color = $("#modal-alta-tractor-input-color").val();

    if (patente !== "") {

      var data = {
        _id: patente,
        trade: trade,
        axis: axis,
        color: color
      };
      $.ajax({
        method: $("#alta-tractor").attr("metodo"),
        dataType: "json",
        beforeSend: function (request) {
          request.setRequestHeader("token", window.transporte.token);
            }
        ,
        url: window.transporte.apiURL + "/zap/camion",
        data: data
      })
        .done(function(response) {
          if (response.status == "OK") {
            $("#tractor-dominio-input").val(patente);
            $("#tractor-cantidad_ejes-input").val(axis);
            $("#tractor-marca-input").val(trade);
            $("#tractor-color-input").val(color);
            $("#tractor-data").show();
            $("#tractor-not-found").hide();
            $("#alta-tractor").modal("toggle");
  //          self.buscarTractorInCNRT(patente);
          }
        })
        .fail(function(response) {
          console.log(response);
        });
    }
  });
};

var nuevoChoferButtonListener = function() {
  
  $("#guardar-alta-chofer").click(function(e) {
    e.preventDefault();
    var dni = $("#alta-chofer").attr("dni");
    var firstname = $("#modal-alta-chofer-input-firstname").val();
    var lastname = $("#modal-alta-chofer-input-lastname").val();
    var mobile = $("#modal-alta-chofer-input-mobile").val();
    if (firstname == "") $("#modal-alta-chofer-input-firstname-empty").show();
    else $("#modal-alta-chofer-input-firstname-empty").hide();
    if (lastname == "") $("#modal-alta-chofer-input-lastname-empty").show();
    else $("#modal-alta-chofer-input-lastname-empty").hide();
    if (mobile == "") $("#modal-alta-chofer-input-mobile-empty").show();
    else $("#modal-alta-chofer-input-mobile-empty").hide();
    if (firstname !== "" && lastname !== "" && mobile !== "") {
      var data = {
        _id: dni,
        firstname: firstname,
        lastname: lastname,
        mobile: mobile
      };
      $.ajax({
        method: "POST",
        dataType: "json",
        beforeSend: function (request) {
          request.setRequestHeader("token", window.transporte.token);
            }
        ,
        url: window.transporte.apiURL + "/zap/chofer",
        data: data
      })
        .done(function(response) {
          if (response.status == "OK") {
            $("#chofer-nombre-input").val(firstname);
            $("#chofer-apellido-input").val(lastname);
            $("#chofer-mobile-input").val(mobile);
            $("#chofer-dni-input").val(dni);
            $("#chofer-data").show();
            $("#chofer-not-found").hide();
            $("#alta-chofer").modal("toggle");
          }
        })
        .fail(function(response) {
          console.log(response);
        });
    }
  });
};

/*
  Clase de Ingreso
*/
var IngresoWidget = BaseWidget.extend({
  tractorInputId: "",
  refreshForm: function() {
    window.location.href = window.location.href;
  },
  addRefreshListener: function() {
    var self = this;
    $("#refresh").click(function(e) {
      e.preventDefault();
      self.refreshForm();
    });
  },

  /** CAMPO TRACTOR */
  mostrarDatosTractor: function(tractor) {
    $("#tractor-dominio-input").val(tractor._id);
    $("#tractor-marca-input").val(tractor.trade);
    $("#tractor-color-input").val(tractor.color);
    $("#tractor-cantidad_ejes-input").val(tractor.axis);
    $("#tractor-data").show();
    $("#tractor-not-found").hide();
  },
  ajaxBuscarTractorEnHistorico: function(patente) {
    var self = this;
    $.ajax({
      method: "GET",
      dataType: "json",
      beforeSend: self.setHeader,
      url: window.transporte.apiURL + "/zap/camion/" + patente
    }).done(function(response) {
      if (response.status == "OK" && response.data !== null) {
        var tractor = response.data;
        self.mostrarDatosTractor(tractor);
      } else {
        $("#tractor-data").hide();
        $("#tractor-not-found").show();

        /** Mostrar Modal Alta Tractor */
        // $("#modal-alta-tractor-input-axis").val("");
        // $("#modal-alta-tractor-input-color").val("");
        // $("#alta-tractor").modal();

      }
    });
  },
  ajaxBuscarTractorCompletoEnHistorico: function(patente) {
    var self = this;
    $.ajax({
      method: "GET",
      dataType: "json",
      beforeSend: self.setHeader,
      url: window.transporte.apiURL + "/zap/historico/camion/" + patente
    }).done(function(response) {
      if (response.status == "OK" && response.data !== null) {
        var data = response.data;
        var playo = data.trailerId;
        var chofer = data.driverId;
        var tractor = data._id;

        if (tractor) {
          self.mostrarDatosTractor(tractor, true);
        }
        if (chofer !== null) {
          self.mostrarDatosChofer(chofer, true);
        } else {
          $("#chofer-data").hide();
        }
        if (playo !== null) {
          self.mostrarDatosPlayo(playo, true);
        } else {
          $("#playo-data").hide();
        }
      } else {
        self.ajaxBuscarTractorEnHistorico(patente);
      }
    });
  },
  addTractorFormListener: function() {
    var self = this;
    $(self.tractorInputId).keyup(function(e) {
      $(this).val(
        $(this)
          .val()
          .toUpperCase()
      );
      if (e.keyCode == 13) {
        $("#buscar_tractor").click();
      }
    });
    $("#buscar_tractor").click(function(e) {
      e.preventDefault();
      var patente = $(self.tractorInputId).val();
      if (patente == "") $("#tractor-empty").show();
      else $("#tractor-empty").hide();
      if (patente !== "") {
        self.ajaxBuscarTractorCompletoEnHistorico(patente);
        self.buscarTractorInCNRT(patente);
        self.ajaxBuscarTurnoPorTractorPatente(patente);
      }
    });
    $("#cargar_tractor").click(function(e) {
        e.preventDefault();
        var patente = $(self.tractorInputId).val();
        if (patente == "") $("#tractor-empty").show();
        else $("#tractor-empty").hide();
        if (patente !== "") {
            $("#modal-alta-tractor-input-axis").val("");
            $("#modal-alta-tractor-input-trade").val("");
            $("#modal-alta-tractor-input-color").val("");
            $("#alta-tractor").modal();
        }
      });



    nuevoTractorButtonListener();
    self.autoCompleteTractores();
  },
  buscarTractorInCNRT: function(patente) {
    var self = this;
    if (patente == "") $("#tractor-empty").show();
    else $("#tractor-empty").hide();
    if (patente !== "") {
      $.ajax({
        method: "GET",
        dataType: "json",
        beforeSend: self.setHeader,
        url: window.transporte.apiURL + "/zap/cnrt/patente/" + patente
      })
        .done(function(response) {
          if (response.status == "OK") {
            var tractor = response.data;
            console.log("CNRT", response);
            $("#tractor-cnrt-not-found").hide();
            $("#tractor-cnrt-found").show();
          }
        })
        .fail(function(response) {
          $("#tractor-cnrt-not-found").show();
          $("#tractor-cnrt-found").hide();
        });
    }
  },
  
  autoCompleteTractores: function() {
    var self = this;
    $.ajax({
      method: "GET",
      dataType: "json",
      beforeSend: self.setHeader,
      url: window.transporte.apiURL + "/zap/turnos/camiones"
    }).done(function(response) {
      if (response.status == "OK") {
        var tractores = response.data;
        for (t in tractores) {
          if (tractores.hasOwnProperty(t)) {
            var tractor_patente = tractores[t];
            $("#tractores-list").append(
              $(
                "<option value='" +
                  tractor_patente +
                  "'>" +
                  tractor_patente +
                  "</option>"
              )
            );
          }
        }
      }
    });
  },

  comboTiposAltaPlayo: function() {
    var self = this;
    $.ajax({
      method: "GET",
      dataType: "json",
      beforeSend: self.setHeader,
      url: window.transporte.apiURL + "/zap/playotypes"
    }).done(function(response) {
      if (response.status == "OK") {
        var marcas = response.data;
        $("#modal-alta-playo-input-tipo").empty();
        $("#modal-alta-playo-input-tipo").append($("<option value=''> - Seleccione - </option>"));
        for (m in marcas) {
          if (marcas.hasOwnProperty(m)) {
            var marca = marcas[m];
            if (marca.hasOwnProperty("_id")) {
              $("#modal-alta-playo-input-tipo").append(
                $("<option value='" + marca._id + "'>" + marca._id + "</option>")
              );
            }
          }
        }
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
    $("#playo-tipo-input").val(playo.type);
    $("#playo-color-input").val(playo.color);
    $("#playo-cantidad_ejes-input").val(playo.axis);
    $("#playo-data").show();
    $("#playo-not-found").hide();
  },
  addPlayoFormListener: function() {
    var self = this;
    $("#transporte_camionesbundle_ingreso_playo_patente").keyup(function(e) {
      $(this).val(
        $(this)
          .val()
          .toUpperCase()
      );
      if (e.keyCode == 13) {
        $("#buscar_playo").click();
      }
    });
    $("#buscar_playo").click(function(e) {
      e.preventDefault();
      var patente = $("#transporte_camionesbundle_ingreso_playo_patente").val();
      if (patente == "") $("#playo-empty").show();
      else $("#playo-empty").hide();
      if (patente !== "") {
        $.ajax({
          method: "GET",
          dataType: "json",
          beforeSend: self.setHeader,
          url: window.transporte.apiURL + "/zap/playo/" + patente
        }).done(function(response) {
          if (response.status == "OK" && response.data !== null) {
            var playo = response.data;
            self.mostrarDatosPlayo(playo, false);
            self.buscarPlayoInCNRT(patente);
          } else {
            $("#playo-data").hide();
            $("#playo-not-found").show();
            /** Mostrar Modal Alta Playo */
            // $("#modal-alta-playo-input-axis").val("");
            // $("#modal-alta-playo-input-year").val("");
            // $("#alta-playo").modal();
          }
        });
      }
    });

    $("#cargar_playo").click(function(e) {
        e.preventDefault();
        var patente = $("#transporte_camionesbundle_ingreso_playo_patente").val();
        if (patente == "") $("#playo-empty").show();
        else $("#playo-empty").hide();
        if (patente !== "") {
          $("#modal-alta-playo-input-tipo").val("");
          $("#modal-alta-playo-input-axis").val("");
          $("#modal-alta-playo-input-color").val("");
          $("#alta-playo").modal();
        }
      });

    self.nuevoPlayoButtonListener();
  },
  buscarPlayoInCNRT: function(patente) {
    var self = this;
    if (patente == "") $("#playo-empty").show();
    else $("#playo-empty").hide();
    if (patente !== "") {
      $.ajax({
        method: "GET",
        dataType: "json",
        beforeSend: self.setHeader,
        url: window.transporte.apiURL + "/zap/cnrt/patente/playo/" + patente
      })
        .done(function(response) {
          if (response.status == "OK") {
            var playo = response.data;
            $("#playo-cnrt-not-found").hide();
            $("#playo-cnrt-found").show();
          }
        })
        .fail(function(response) {
          $("#playo-cnrt-not-found").show();
          $("#playo-cnrt-found").hide();
        });
    }
  },
  nuevoPlayoButtonListener: function() {
    var self = this;
    $("#guardar-alta-playo").click(function(e) {
      e.preventDefault();
      var patente = $("#transporte_camionesbundle_ingreso_playo_patente").val();
      var axis = $("#modal-alta-playo-input-axis").val();
      var type = $("#modal-alta-playo-input-type").val();
      var color = $("#modal-alta-playo-input-color").val();
      if (patente !== "") {
        var data = {
          _id: patente,
          axis: axis,
          color: color,
          type: type
        };
        $.ajax({
          method: "POST",
          dataType: "json",
          beforeSend: self.setHeader,
          url: window.transporte.apiURL + "/zap/playo",
          data: data
        })
          .done(function(response) {
            if (response.status == "OK") {
              $("#playo-dominio-input").val(patente);
              $("#playo-cantidad_ejes-input").val(axis);
              $("#playo-type-input").val(type);
              $("#playo-color-input").val(color);
              $("#playo-data").show();
              $("#playo-not-found").hide();
              $("#alta-playo").modal("toggle");
              self.buscarPlayoInCNRT(patente);
            }
          })
          .fail(function(response) {
            console.log(response);
          });
      }
    });
  },
  /** FIN CAMPO PLAYO */
  /** CAMPO CHOFER */
  pressEnterAndSearchChofer: function() {
    $("#transporte_camionesbundle_ingreso_chofer_dni").keyup(function(e) {
      if (e.keyCode == 13) {
        $("#buscar_chofer").click();
      }
    });
  },
  buscarChoferInCNRT: function(dni) {
    var self = this;
    if (dni == "") $("#chofer-empty").show();
    else $("#chofer-empty").hide();
    if (dni !== "") {
      $.ajax({
        method: "GET",
        dataType: "json",
        beforeSend: self.setHeader,
        url: window.transporte.apiURL + "/zap/cnrt/chofer/" + dni
      })
        .done(function(response) {
          if (response.status == "OK") {
            var chofer = response.data;
            $("#chofer-nombre-input").val(chofer.nombre);
            $("#chofer-apellido-input").val(chofer.apellido);
            $("#chofer-dni-input").val(chofer.dni);
            $("#chofer-cnrt-not-found").hide();
            $("#chofer-cnrt-found").show();
          }
        })
        .fail(function(response) {
          $("#chofer-cnrt-not-found").show();
          $("#chofer-cnrt-found").hide();
        });
    }
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
      if (dni == "") $("#chofer-empty").show();
      else $("#chofer-empty").hide();
      if (dni !== "") {
        $.ajax({
          method: "GET",
          dataType: "json",
          beforeSend: self.setHeader,
          url: window.transporte.apiURL + "/zap/chofer/" + dni
        }).done(function(response) {
          if (response.status == "OK" && response.data !== null) {
            var chofer = response.data;
            self.mostrarDatosChofer(chofer, true);
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

    nuevoChoferButtonListener();
  },
  /** FIN CAMPO CHOFER */
  /** CAMPO CONTENTEDOR */
  addContenedorListener: function() {
    $("#transporte_camionesbundle_ingreso_contenedor").keyup(function(e) {
      $(this).val(
        $(this)
          .val()
          .toUpperCase()
      );
      if (e.keyCode == 13) {
        $("#buscar_turno_por_contenedor").click();
      }
    });
    $("#transporte_camionesbundle_ingreso_contenedor").on('change', function(value) {
      var valor = "";
      valor = $(this).find(":selected").val();
      $("#buscar_turno_por_contenedor").click();
    });      
    this.autoCompleteContenedores();
  },
  changeComboMovListener: function() {
    $('#transporte_camionesbundle_ingreso_mov').on('change', function (value) {
      var valor = "";
      valor = $(this).find(":selected").val();
      $("#transporte_camionesbundle_ingreso_terminal").attr("disabled", false);
      if (valor === 'CARGAGRAL') {
        $("#transporte_camionesbundle_ingreso_contenedor").val("");
      } else if (valor === 'ESTACIONA') {
        $("#transporte_camionesbundle_ingreso_terminal").val("ZAP");
        $("#transporte_camionesbundle_ingreso_terminal").attr("disabled", true);
        $("#transporte_camionesbundle_ingreso_mov").attr("disabled", true);
      }

    });
  },
  changeComboTerminalListener: function() {
    var self = this;
    $('#transporte_camionesbundle_ingreso_terminal').on('change', function (value) {
      var valor = "";
      var valComboMov = "";
      valor = $(this).find(":selected").val();
      valComboMov = $('#transporte_camionesbundle_ingreso_mov').find(":selected").val();
      if (valor !== 'ZAP' && valComboMov === 'ESTACIONA') {
        self.alertError(
          "Combinación no permitida",
          "El Movimiento Estacionamiento solo puede ser Terminal ZAP"
        );
        $(this).val("");
        // $.SmartMessageBox({
        //   "buttons": "[No][Si]"
        // }, function (r) {
        //   if (r === 'Si') {
        //     console.log("BORRA");
        //     $.smallBox({
        //       title : "Callback function",
        //       content : " You pressed Yes...",
        //       color : "#659265",
        //       iconSmall : "fa fa-check fa-2x fadeInRight animated",
        //       timeout : 4000
        //   });
        //   }
        // });
      }

    });
  },
  autoCompleteContenedores: function() {
    var self = this;
    $.ajax({
      method: "GET",
      dataType: "json",
      beforeSend: self.setHeader,
      url: window.transporte.apiURL + "/zap/turnos/contenedores"
    }).done(function(response) {
      if (response.status == "OK") {
        var contenedores = response.data;
        for (c in contenedores) {
          if (contenedores.hasOwnProperty(c)) {
            var contenedor = contenedores[c];
            $("#contenedores-list").append(
              $(
                "<option value='" + contenedor + "'>" + contenedor + "</option>"
              )
            );
          }
        }
      }
    });
  },
  /** FIN CAMPO CONTENTEDOR */
  turnosResponseEvent: function(turnos) {
    var self = this;
    if (turnos.length > 0) {
      $("#turnos-radio").empty();
      var now = new Date();

      for (t in turnos) {
        if (turnos.hasOwnProperty(t)) {
          var turno = turnos[t];
          var dateInicio = new Date(turno.inicio);
          var dateFin = new Date(turno.fin);
          if (self.equalDates(now, dateInicio)) {
            var turno_inicio =
              typeof turno.inicio !== "undefined" ? turno.inicio : "";
            var turno_fin = typeof turno.fin !== "undefined" ? turno.fin : "";
            var turno_contenedor =
              typeof turno.contenedor !== "undefined" ? turno.contenedor : "";
            var turno_mov = typeof turno.mov !== "undefined" ? turno.mov : "";
            var turno_alta =
              typeof turno.alta !== "undefined" ? turno.alta : "";
            var turno_terminal =
              typeof turno.terminal !== "undefined" ? turno.terminal : "";
            $("#turnos-radio").append(
              $(
                "\<div class='radio'>\<label>\<input id='radio1' name='radio1' type='radio' value='" +
                  dateInicio.toISOString() +
                  "-" +
                  dateFin.toISOString() +
                  "'" +
                  " data-inicio='" +
                  turno_inicio +
                  "'" +
                  " data-fin='" +
                  turno_fin +
                  "'" +
                  " data-contenedor='" +
                  turno_contenedor +
                  "'" +
                  " data-mov='" +
                  turno_mov +
                  "'" +
                  " data-alta='" +
                  turno_alta +
                  "'" +
                  " data-terminal='" +
                  turno_terminal +
                  "'" +
                  ">" +
                  self.dateTimeFormat(dateInicio) +
                  " a " +
                  self.dateTimeFormat(dateFin) +
                  "</label>\
                            </div>"
              )
            );
          }
        }
      }
      // Muestro los turnos de hoy
      if ($("#turnos-radio .radio").length > 0) {
        $("#form-group-turnos").show();
        $("#turnos-radio .radio label").click(function(e) {
          var $input = $(this).find("input");
          var contenedor = $input.attr("data-contenedor");
          var mov = $input.attr("data-mov");
          var inicio = $input.attr("data-inicio");
          var fin = $input.attr("data-fin");
          var alta = $input.attr("data-alta");
          var terminal = $input.attr("data-terminal");
          $("#transporte_camionesbundle_ingreso_contenedor").val(contenedor);
          $("#transporte_camionesbundle_ingreso_mov").val(mov);
          $("#transporte_camionesbundle_ingreso_inicio").val(inicio);
          $("#transporte_camionesbundle_ingreso_fin").val(fin);
          $("#transporte_camionesbundle_ingreso_alta").val(alta);
          $("#transporte_camionesbundle_ingreso_terminal").val(terminal);
          $("#transporte_camionesbundle_ingreso_terminal").attr('disabled', true);
          $("#transporte_camionesbundle_ingreso_mov").attr("disabled", true);
        });
        // Selecciono automáticamente el turno si hay uno solo
        if ($("#turnos-radio .radio").length == 1) {
          $("#turnos-radio .radio label").click();
        }
      } else {
        // No encontré turnos
        self.alertError("Consulta de Turno", "No se encontró ningún Turno.");
        $("#transporte_camionesbundle_ingreso_terminal").attr('disabled', false);
        $("#transporte_camionesbundle_ingreso_mov").attr("disabled", false);
      }
    } else {
      self.alertError("Consulta de Turno", "No se encontró ningún Turno.");
      $("#transporte_camionesbundle_ingreso_terminal").attr('disabled', false);
      $("#transporte_camionesbundle_ingreso_mov").attr("disabled", false);
    }
  },
  ajaxBuscarTurnoPorTractorPatente: function(tractor_patente) {
    var self = this;
    $.ajax({
      method: "GET",
      dataType: "json",
      beforeSend: self.setHeader,
      url: window.transporte.apiURL + "/zap/turno/patente/" + tractor_patente
    }).done(function(response) {
      if (response.status == "OK") {
        var turnos = response.data;
        self.turnosResponseEvent(turnos);
      }
    });
  },
  buscarTurnoListener: function() {
    var self = this;
    $("#buscar_turno_por_tractor").click(function(e) {
      e.preventDefault();
      var tractor_patente = $(
        "#transporte_camionesbundle_ingreso_tractor_patente"
      ).val();
      if (tractor_patente === "") {
        $(".turno-error")
          .html("Debe ingresar un dato para Consultar el Turno.")
          .show();
        $("#form-group-tractor").addClass("has-error");
        return false;
      }

      $(".turno-error").hide();
      $("#form-group-tractor").removeClass("has-error");

      if (tractor_patente !== "") {
        /** BUSCAR TURNO POR TRACTOR */
        self.ajaxBuscarTurnoPorTractorPatente(tractor_patente);
      }
    });
    $("#buscar_turno_por_contenedor").click(function(e) {
      e.preventDefault();
      var contenedor = $("#transporte_camionesbundle_ingreso_contenedor").val();
      if (contenedor === "") {
        $(".turno-error")
          .html("Debe ingresar un dato para Consultar el Turno.")
          .show();
        $("#form-group-contenedor").addClass("has-error");
        return false;
      }

      $(".turno-error").hide();
      $("#form-group-contenedor").removeClass("has-error");

      if (contenedor !== "") {
        /** BUSCAR TURNO POR CONTENEDOR */
        $.ajax({
          method: "GET",
          dataType: "json",
          beforeSend: self.setHeader,
          url: window.transporte.apiURL + "/zap/turno/contenedor/" + contenedor
        }).done(function(response) {
          if (response.status == "OK") {
            var turnos = response.data;
            self.turnosResponseEvent(turnos);
          }
        });
      }
    });
  },
  isFormIngresoValid: function() {
    var self = this;
    if ($("#transporte_camionesbundle_ingreso_tractor_patente").val() == "") {
      self.alertError(
        "Campos obligatorios",
        "Debe ingresar la Patente del Tractor"
      );
      return false;
    }

    if ($("#transporte_camionesbundle_ingreso_chofer_dni").val() == "") {
      self.alertError(
        "Campos obligatorios",
        "Debe ingresar el Documento del Chofer"
      );
      return false;
    }

    if ($("#transporte_camionesbundle_ingreso_playo_patente").val() == "") {
      self.alertError(
        "Campos obligatorios",
        "Debe ingresar la Patente del Playo"
      );
      return false;
    }

    if ($("#transporte_camionesbundle_ingreso_contenedor").val() == "" && 
          ( $("#transporte_camionesbundle_ingreso_mov").val() === "EXPO" || $("#transporte_camionesbundle_ingreso_mov").val() === "VACIODEV" )
      ) {
      self.alertError("Campos obligatorios", "Debe ingresar Contenedor");
      return false;
    }

    if ($("#transporte_camionesbundle_ingreso_mov").val() == "") {
      self.alertError(
        "Campos obligatorios",
        "Debe seleccionar un Tipo de Movimiento"
      );
      return false;
    }
    // Genera el dato en base al tipo MOV
    // if ($("#transporte_camionesbundle_ingreso_carga").val() == "") {
    //   self.alertError(
    //     "Campos obligatorios",
    //     "Debe seleccionar un Tipo de Carga"
    //   );
    //   return false;
    // }

    return true;
  },
  ajaxIngresarCamion: function() {
    var self = this;
    var tractor_patente = $("#transporte_camionesbundle_ingreso_tractor_patente").val();
    var playo_patente = $("#transporte_camionesbundle_ingreso_playo_patente").val();
    var chofer_dni = $("#transporte_camionesbundle_ingreso_chofer_dni").val();
    var data = {
      _id: tractor_patente,
      trailerId: playo_patente,
      driverId: chofer_dni
    };
    $.ajax({
      method: "POST",
      dataType: "json",
      beforeSend: self.setHeader,
      url: window.transporte.apiURL + "/zap/historico",
      data: data
    })
      .done(function(response) {
        if (response.status == "OK") {
          console.log(
            "Los datos del Historico del Ingreso del Camión se han actualizado correctamente."
          );
        }
      })
      .fail(function(response) {
        console.log(response);
      });
  },
  ajaxGateInCamion: function() {
    var self = this;
    var now = new Date();
    var gateTimestamp = now.toISOString();

    var mov = $("#transporte_camionesbundle_ingreso_mov").val();
    var carga = "";
    if (mov === "EXPO") {
      carga = "LL";
    } else if (mov === "VACIODEV") {
      carga = "VA";
    } else {
      carga = "NO";
    }


    var data = {
      mov: mov,
      tipo: "IN",
      carga: carga, //$("#transporte_camionesbundle_ingreso_carga").val(),
      contenedor: $("#transporte_camionesbundle_ingreso_contenedor").val(),
      turnoInicio: $("#transporte_camionesbundle_ingreso_inicio").val(),
      turnoFin: $("#transporte_camionesbundle_ingreso_fin").val(),
      destino: $("#transporte_camionesbundle_ingreso_terminal").val(),
      patenteCamion: $("#transporte_camionesbundle_ingreso_tractor_patente").val(),
      patenteAcoplado: $("#transporte_camionesbundle_ingreso_playo_patente").val(),
      gateTimestamp: gateTimestamp,
      dni: $('#transporte_camionesbundle_ingreso_chofer_dni').val()
    };
    $.ajax({
      method: "POST",
      dataType: "json",
      beforeSend: self.setHeader,
      url: window.transporte.gateApiURL,
      data: data
    })
      .done(function(response) {
        if (response.status == "OK") {
          self.refreshForm();
          
          self.alertSuccess(
            "Gate IN",
            "Se Registro el Ingreso de Camión Correctamente."
          );
        }
      })
      .fail(function(response) {
        console.log(response);
      });
  },
  addInformarTerminalListener: function() {
    var self = this;
    $("#informar_terminal").click(function(e) {
      if (self.isFormIngresoValid()) {
        self.ajaxIngresarCamion();
        self.ajaxGateInCamion();
      }
    });
  },
  renderButtonMobile: function() {
    var isMobile = window.matchMedia("only screen and (max-width: 760px)");
    if (isMobile.matches) {
      $("#buscar_turno_por_tractor").addClass("btn-block btn-sm");
      $("#buscar_turno_por_contenedor").addClass("btn-block btn-sm");
      $("#refresh").addClass("btn-block btn-sm");
      $("#informar_terminal").addClass("btn-block btn-sm");
    }
  },
  init: function(args) {
    this._super(args);

    comboMarcasAltaCamion();

    comboColors('modal-alta-tractor-input-color');

    this.comboTiposAltaPlayo();
    
    comboColors('modal-alta-playo-input-color');
    
    this.renderButtonMobile();

    this.dontUseEnterInForm();

    this.addRefreshListener();

    this.addTractorFormListener();

    this.addChoferFormListener();

    this.addPlayoFormListener();

    this.addContenedorListener();

    this.changeComboMovListener();

    this.changeComboTerminalListener();
    
    this.buscarTurnoListener();

    this.addInformarTerminalListener();
  }
});

/** @deprecated No se utiliza más el Widget porque la pantalla de Salida de Camión no se va a usar */
var SalidaWidget = IngresoWidget.extend({
  ajaxBuscarTractorEnHistorico: function(patente) {
    var self = this;
    $.ajax({
      method: "GET",
      dataType: "json",
      beforeSend: self.setHeader,
      url: window.transporte.apiURL + "/zap/camion/" + patente
    }).done(function(response) {
      if (response.status == "OK" && response.data !== null) {
        var tractor = response.data;
        self.mostrarDatosTractor(tractor);
      } else {
        $("#tractor-data").hide();
        $("#tractor-not-found").show();
      }
    });
  },
  addTractorFormListener: function() {
    var self = this;
    $(self.tractorInputId).keyup(function(e) {
      $(this).val(
        $(this)
          .val()
          .toUpperCase()
      );
      if (e.keyCode == 13) {
        $("#buscar_tractor").click();
      }
    });
    $("#buscar_tractor").click(function(e) {
      e.preventDefault();
      var patente = $(self.tractorInputId).val();
      if (patente == "") $("#tractor-empty").show();
      else $("#tractor-empty").hide();
      if (patente !== "") {
        self.ajaxBuscarTractorEnHistorico(patente);
        self.buscarTractorInCNRT(patente);
      }
    });
  },
  isFormSalidaValid: function() {
    var self = this;
    if ($(self.tractorInputId).val() == "") {
      self.alertError(
        "Campos obligatorios",
        "Debe ingresar la Patente del Tractor"
      );
      return false;
    }

    return true;
  },
  ajaxGateOutCamion: function() {
    var self = this;
    var now = new Date();
    var gateTimestamp = now.toISOString();
    var data = {
      // QUESTION: ¿De donde saco la información comentada?
      //'mov' : $("#transporte_camionesbundle_ingreso_mov").val(),
      tipo: "OUT",
      /* 'carga' : $("#transporte_camionesbundle_ingreso_carga").val(),
         'contenedor' : $("#transporte_camionesbundle_ingreso_contenedor").val(),
         'inicio'     : $("#transporte_camionesbundle_ingreso_inicio").val(),
         'fin'     : $("#transporte_camionesbundle_ingreso_fin").val(),
      */
      patenteCamion: $(self.tractorInputId).val(),
      gateTimestamp: gateTimestamp
    };
    $.ajax({
      method: "POST",
      dataType: "json",
      beforeSend: self.setHeader,
      url: window.transporte.gateApiURL,
      data: data
    })
      .done(function(response) {
        if (response.status == "OK") {
          self.alertSuccess(
            "Gate OUT",
            "Se Registro la Salida de Camión Correctamente."
          );
        }
      })
      .fail(function(response) {
        console.log(response);
      });
  },
  addInformarTerminalListener: function() {
    var self = this;
    $("#informar_terminal").click(function(e) {
      if (self.isFormSalidaValid()) {
        self.ajaxGateOutCamion();
      }
    });
  },
  init: function(args) {
    var widget = this;
    for (var a in args) {
      if (args.hasOwnProperty(a)) {
        widget[a] = args[a];
      }
    }

    this.renderButtonMobile();

    this.dontUseEnterInForm();

    this.addTractorFormListener();

    this.addInformarTerminalListener();
  }
});

/** @deprecated No se utiliza más la pantalla de Test porque ya se está usando las demás API de test */
var TableServerSide = BaseWidget.extend({
  pageInit: 0,
  pageLength: 10,
  pageOptions: [5, 10, 25, 50],
  dataURL: "",
  totalDataCountId: "#totalDataCountId",
  tbodyId: "#tbodyId",
  paginationId: "#pagination",
  visiblePages: 5,
  tCodeColumns: [],
  setHeader: function(xhr) {
    xhr.setRequestHeader("token", window.transporte.token);
  },
  getTd: function(data, code) {
    var self = this;
    var isDate = false;
    if (code.substr(0, 5) === "date:") {
      code = code.substr(5);
      var isDate = true;
    }
    if (data.hasOwnProperty(code)) {
      if (isDate) {
        var d = new Date(data[code]);
        return $(
          "<td data-date='" + data[code] + "'>" + self.dateFormat(d) + "</td>"
        );
      } else {
        return $("<td>" + data[code] + "</td>");
      }
    }

    return null;
  },
  getAndRenderData: function() {
    var self = this;
    var url =
      window.transporte.apiURL +
      self.dataURL +
      "/" +
      self.pageInit +
      "/" +
      self.pageLength;
    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      beforeSend: self.setHeader,
      success: function(dataResponse) {
        if (dataResponse.status == "OK") {
          $(self.tbodyId).empty();
          if (dataResponse.hasOwnProperty("totalCount")) {
            if ($(self.paginationId).is(":empty")) {
              self.addPagination(dataResponse.totalCount);
            }
          }
          for (d in dataResponse.data) {
            if (dataResponse.data.hasOwnProperty(d)) {
              var data = dataResponse.data[d];
              var $tr = $("<tr><tr>");
              for (c in self.tCodeColumns) {
                if (self.tCodeColumns.hasOwnProperty(c)) {
                  var code = self.tCodeColumns[c];
                  var $td = self.getTd(data, code);
                  if ($td) {
                    $tr.append($td);
                  }
                }
              }
              $(self.tbodyId).append($tr);
            }
          }
        }
      }
    });
  },
  addPagination: function(totalCount) {
    var self = this;
    $(self.paginationId).empty();
    var totalPages = totalCount / self.pageLength;
    $(self.paginationId).twbsPagination({
      totalPages: totalPages,
      visiblePages: self.visiblePages,
      onPageClick: function(event, page) {
        self.pageInit = (page - 1) * self.pageLength;
        self.getAndRenderData();
      },
      first: "<<",
      prev: "<",
      next: ">",
      last: ">>"
    });
  },
  init: function(args) {
    this._super(args);

    this.getAndRenderData();
  }
});

var PlayaWidget = BaseWidget.extend({
  urlStatus: "",
  dataTable: null,
  statusEntrada: [],
  selectedRow: '',
  salidaCamion: function(patente, mov, carga, conTurno) {
    var self = this;
    var now = new Date();
    var gateTimestamp = now.toISOString();
    var data = {
      mov: mov,
      tipo: "OUT",
      carga: carga,
      patenteCamion: patente,
      gateTimestamp: gateTimestamp
    };
    $.ajax({
      method: "POST",
      dataType: "json",
      beforeSend: self.setHeader,
      url: window.transporte.gateApiURL,
      data: data
    })
      .done(function(response) {
        if (response.status == "OK") {
          if (conTurno) {
            self.alertSuccess(
              "Salida Camión",
              "Se Registro la Salida de Camión Correctamente."
            );
          } else {
            self.alertSuccess(
              "Salida Sin Turno",
              "Se Registro la Salida de Camión Correctamente."
            );
          }
        }
      })
      .fail(function(response) {
        console.log(response);
      });
  },
  CamionACola: function(id, status) {
    var self = this;
    $.ajax({
      method: "POST",
      dataType: "json",
      beforeSend: self.setHeader,
      url: window.transporte.apiURL + "/gates/setStatus",
      data: {
        id: id,
        status: status
      }
    })
      .done(function(response) {
        if (response.status == "OK") {
            self.alertSuccess(
              "Camión enviado a Cola",
              "Se Registro el envío a Cola del Camión Correctamente."
            );
        }
      })
      .fail(function(response) {
        console.log(response);
      });
  },
  updateGate: function(param) {
    $.ajax({
        method: "POST",
        dataType: "json",
        beforeSend: self.setHeader,
        url: window.transporte.gateApiURL,
        data: data
      })
        .done(function(response) {
          if (response.status == "OK") {
            if (conTurno) {
              self.alertSuccess(
                "Salida Camión",
                "Se Registro la Salida de Camión Correctamente."
              );
            } else {
              self.alertSuccess(
                "Salida Sin Turno",
                "Se Registro la Salida de Camión Correctamente."
              );
            }
          }
        })
        .fail(function(response) {
          console.log(response);
        });
    },
  getStatusAndRender: function() {
    var self = this;
    $.ajax({
      method: "GET",
      url: self.urlStatus,
      dataType: "json",
      beforeSend: self.setHeader
    }).done(function(response) {
      if (response.status == "OK") {
        self.statusEntrada = response.data;
        self.render();
      }
    });
  },
  getStatusEntrada: function(fechaEntrada, fechaInicioTurno, fechaFinTurno) {
    var self = this;
    if (fechaInicioTurno === "") {
      // No tiene turno
      return "info";
    }
    if (fechaInicioTurno <= fechaEntrada && fechaEntrada <= fechaFinTurno) {
      // Entro en el turno
      return "normal";
    }
    if (fechaEntrada < fechaInicioTurno) {
      // Entro antes
      var diffMinutes = Math.floor(
        (fechaInicioTurno - fechaEntrada) / 1000 / 60
      );
      if (diffMinutes > self.statusEntrada.veryEarly) {
        // Entro mucho antes
        return "warning";
      } else {
        if (diffMinutes > self.statusEntrada.early) {
          // Entro un poco antes
          return "text-warning";
        }
      }
    } else {
      if (fechaEntrada > fechaFinTurno) {
        // Entro después
        var diffMinutes = Math.floor(
          (fechaEntrada - fechaFinTurno) / 1000 / 60
        );
        if (diffMinutes > self.statusEntrada.veryLate) {
          // Entro mucho después
          return "danger";
        } else {
          if (diffMinutes > self.statusEntrada.late) {
            // Entro un poco después
            return "text-danger";
          }
        }
      }
    }
    return "normal";
  },
  translateStatusEntrada: function(statusEntrada) {
    switch (statusEntrada) {
      case "text-warning":
        return "Temprano";
      case "warning":
        return "Muy temprano";
      case "text-danger":
        return "Tarde";
      case "danger":
        return "Muy tarde";
      case "normal":
        return "A tiempo";
      case "info":
        return "No tiene turno";
    }
    return "";
  },
  addRowToPlayon: function (gate) {
    var self = this;
    var newDate = new Date();

    var fechaEntrada = new Date(gate.gateTimestamp);
    var fechaInicioTurno = gate.turnoInicio ? new Date(gate.turnoInicio) : "";
    var fechaFinTurno = gate.turnoFin ? new Date(gate.turnoFin) : "";
    var statusEntrada = self.getStatusEntrada(fechaEntrada, fechaInicioTurno, fechaFinTurno);
    var fechaAltaTurno = gate.alta ? new Date(gate.alta) : "";
    var contenedor = gate.contenedor || "";
    var dni = gate.dni || "";

    var translateStatusEntrada = self.translateStatusEntrada(
      statusEntrada
    );

    var $tr = $(
      "<tr id='" + gate._id + "' dni='" + dni + "' contenedor= '" + contenedor + "' pedido='"+gate.pedido+"' estado='" +
        statusEntrada +
        "' class='" +
        statusEntrada +
        "'></tr>"
    );

    var tdPatente = $("<td class='patente' data-patente='" + gate.patenteCamion + "'><strong>" + gate.patenteCamion + "</strong></td>");
    if (gate.pedido) {
      tdPatente.css("color", "green");
      $(tdPatente).attr("title", "Camión solicitado para " + gate.destino);
    }
    $tr.append(tdPatente);

    $tr.append($("<td><strong>" + contenedor + "</strong></td>"));
    $tr.append(
      $(
        "<td>" +
          self.dateFormat(fechaEntrada) +
          " " +
          self.timeFormat(fechaEntrada) + " - (" + translateStatusEntrada +
          ")</td>"
      )
    );
    $tr.append(
      $("<td>" + Date.daysBetween(fechaEntrada, today) + "</td>")
    );
    var guion = '';
    if (fechaInicioTurno && fechaFinTurno) {
      guion = '-';
    }
    $tr.append($("<td><div><span class='turno-inicio'>" + self.timeFormat(fechaInicioTurno) + "</span>"+guion+"<span class='turno-fin'>" + self.timeFormat(fechaFinTurno) + "</span></div></td>"))

    if (fechaInicioTurno !== undefined && fechaInicioTurno !== "" && newDate < fechaInicioTurno) {
      $tr.append($("<td>" + Date.daysBetween(newDate, fechaInicioTurno) + "</td>"));
    } else {
      $tr.append($("<td></td>"));
    }
    $tr.append(
      $(
        "<td class='mov' data-mov='" +
        gate.mov +
          "'>" +
          window.transporte.tipo_movimiento[gate.mov] +
          "</td>"
      )
    );
    $tr.append(
      $(
        "<td class='terminal' data-terminal='" +
        gate.destino +
          "'>" +
          gate.destino +
          "</td>"
      )
    );
    /**
     * status: la unidad en el status es el status propiamente dicho, 0 normal, 1 en cola, 9 anulado
     */

    var $tdActions = $("<td><div style='display:none'>"+gate.status+"</div></td>");

    var $divCola = $("<span title='Enviar Camión a Cola' style='align:width: 45%'>&nbsp;</span>");
    $tdActions.append($divCola);

    var $divSalida = $("<span style='align:left;width: 45%'>&nbsp;</span>");
    $tdActions.append($divSalida);

    var classes = gate.turnoInicio === null ? "bg-color-redLight txt-color-white" : "";

    $divCola.append(
      $(
        "<a href='javascript:void(0);' alt='Enviar Camión a Cola' class='btn btn-xs btn-default button-a-cola " +
          classes +
          '\'><i class="ui-icon ui-icon-arrowthickstop-1-n"></i></a>'
        ));

    $divSalida.append(
          $(
            "<a href='javascript:void(0);' title='Salida de Camión' alt='Salida de Camión' class='btn btn-xs btn-default button-salida " +
              classes +
              '\'><i class="ui-icon ui-icon-extlink"></i></a>'
          ));
    
    if (gate.status === 1) {
      $divCola.css("visibility", "hidden");
    } else if (gate.status !== 1) { // pongo el else por si luego hay otro tipo de status ademas del 1
      $divSalida.css("visibility", "hidden");
    }

    $tr.append($tdActions);

    $("#tbody-camiones").append($tr);

  },
  render: function() {
    var self = this;
    var inicio = new Date();
    var fin = new Date();
    inicio.setHours(0, 0, 0, 0);
    // add a day
    fin.setDate(fin.getDate() + 1);
    fin.setHours(0, 0, 0, 0);
    var data = {
      fechaInicio: inicio.toISOString(),
      fechaFin: fin.toISOString()
    };
    
    //trae turnos del dia para mostra en pantalla de playon
    $.ajax({
      method: "GET",
      url: window.transporte.apiURL + "/appointments/byDay?fechaInicio=" + data.fechaInicio + "&fechaFin="+ data.fechaFin,
      dataType: "json",
      beforeSend: self.setHeader
    }).done(function (response) {
      var turnos = '';
      var turno;
      for (item in response.data) {
        turno = response.data[item];
        turnos += " " + turno.terminal + ": " + turno.cnt + ", ";
      }
      $("#span-turnosCant").text("Turnos #" + turnos);
      $(function(){
        $("#span-turnosCant").animate({
          "margin-top": "4px"
        }, "fast");
      });
      $(function(){
        $("#span-turnosCant").animate({
          "margin-top": "0px"
        }, "fast");
      });
    });

    $.ajax({
      method: "GET",
      url: window.transporte.apiURL + "/gates/IN/ZAP/0/10000",
      dataType: "json",
      beforeSend: self.setHeader,
      data: {} //data
    }).done(function(response) {
      if (response.status == "OK") {
        var gates = response.data;

        $("#span-camionesCant").text("Playa #" + response.totalCount);
        $(function(){
          $("#span-camionesCant").animate({
            "margin-top": "4px"
          }, "fast");
        });
        $(function(){
          $("#span-camionesCant").animate({
            "margin-top": "0px"
          }, "fast");
        });


        var cantidadPedidos = 0;
        for (t in gates) {
          if (gates.hasOwnProperty(t)) {
            var gate = gates[t];
            //Solo carga aquellos gates que todavia no salieron de la terminal
            if (!gate.gateTimestamp_out) {
              self.addRowToPlayon(gate);
            }
            if (gate.pedido) {
              cantidadPedidos++;
            }
          }
        }

        $('#divPedidos').html(cantidadPedidos);

      }
      $("#tbody-camiones tr").click(function(e) {
        self.selectedRow = $(this).attr('id');
        $("#tbody-camiones tr").find('td').css("border-top", "");
        $(this).find("td").css("border-top", "2px solid black");
        $("#tbody-camiones tr").find('td').css("border-bottom", "");
        $(this).find("td").css("border-bottom", "2px solid black");
      });
      $(".button-a-cola").click(function(e) {
        var $tr = $(this).parents("tr");
        var patente = $tr.find(".patente").attr("data-patente");
        var mov = $tr.find(".mov").attr("data-mov");
        var id = $tr.attr("id");
        var status = 1;

        var turnoinicio = $tr
          .find(".turno-inicio")
          .attr("data-turnoinicio");

        var carga = "";
        if (mov === "EXPO") {
          carga = "LL";
        } else if (mov === "VACIODEV") {
          carga = "VA";
        } else {
          carga = "NO";
        }

        if ($tr.attr("estado") !== "normal") {
          self.ConfirmDialog("El Camión ingresó fuera de horario. <br/>¿Desea enviar a colar de todas formas?", "Enviar a Cola", function (result) {
            if (result) {
              $tr.find(".button-a-cola").css("visibility", "hidden");
              $tr.find(".button-salida").css("visibility", "visible");
        
              self.CamionACola(id, status);
            }
          });
        } else {
          $tr.find(".button-a-cola").css("visibility", "hidden");
          $tr.find(".button-salida").css("visibility", "visible");
    
          self.CamionACola(id, status);
    }
        return false;
        //var event = e || window.event;
    //event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true);

      });
      $(".button-salida").click(function(e) {
        var $tr = $(this).parents("tr");
        var patente = $tr.find(".patente").attr("data-patente");
        var mov = $tr.find(".mov").attr("data-mov");
        // var carga = $tr.find(".carga").attr("data-carga");
        var turnoinicio = $tr
          .find(".turno-inicio")
          .attr("data-turnoinicio");

        var carga = "";
        if (mov === "EXPO") {
          carga = "LL";
        } else if (mov === "VACIODEV") {
          carga = "VA";
        } else {
          carga = "NO";
        }

        if ($tr.attr("estado") !== "normal") {
          self.ConfirmDialog("El Camión ingresó fuera de horario.<br>/¿Desea dar salida de todas formas?", "Salida Camión", function(result) {
            if (result) {
              $($tr).remove();
              self.salidaCamion(patente, mov, carga, turnoinicio !== "");
              }
          });
        } else {
          $($tr).remove();
          self.salidaCamion(patente, mov, carga, turnoinicio !== "");
        }
        return false;
      });

      $("#btnChangeCamion").click(function (e) {
        e.preventDefault()
        var patente = $('#'+self.selectedRow).find('.patente').attr('data-patente');

        $("#modal-alta-tractor-input-axis").val("");
        $("#modal-alta-tractor-input-trade").val("");
        $("#modal-alta-tractor-input-color").val("");

        if (patente !== undefined) {
          $.ajax({
            method: "GET",
            dataType: "json",
            beforeSend: self.setHeader,
            url: window.transporte.apiURL + "/zap/camion/" + patente
          })
            .done(function(response) {
              if (response.status == "OK") {
                var tractor = response.data;
                $("#alta-tractor").attr("patente", patente);
                if (tractor !== null) {
                  $("#modal-alta-tractor-input-axis").val(tractor.axis);
                  $("#modal-alta-tractor-input-trade").val(tractor.trade);
                  $("#modal-alta-tractor-input-color").val(tractor.color);
                  $("#modal-alta-titulo").html("Modifica Tractor "+patente);
                  $('#modal-alta-tractor-mensajeTractorNuevo').css('display', 'none');
                  $("#alta-tractor").attr("metodo", "PUT");
                } else {
                  $("#modal-alta-titulo").html("Alta Tractor "+patente);
                  $("#alta-tractor").attr("metodo", "POST");
                }
                $("#alta-tractor").modal();
              }
            })
            .fail(function(response) {
            });
          } else {
            self.alertInfo("Administración Playa", "Debe seleccionar una fila");
            return;
          }
      });
      $("#btnChangeChofer").click(function (e) {
        e.preventDefault()
        var patente = $('#'+self.selectedRow).find('.patente').attr('data-patente');
        var dni = $('#'+self.selectedRow).attr('dni');

        $("#modal-alta-chofer-input-firstname").val("");
        $("#modal-alta-chofer-input-lastname").val("");
        $("#modal-alta-chofer-input-mobile").val("");

        if (patente !== undefined) {
          $.ajax({
          method: "GET",
          dataType: "json",
          beforeSend: self.setHeader,
          url: window.transporte.apiURL + "/zap/chofer/" + dni
        })
          .done(function(response) {
            if (response.status == "OK") {
              var chofer = response.data;
              $("#alta-chofer").attr("dni", dni);
              if (chofer !== null) {
                $("#modal-alta-chofer-input-firstname").val(chofer.firstname);
                $("#modal-alta-chofer-input-lastname").val(chofer.lastname);
                $("#modal-alta-chofer-input-mobile").val(chofer.mobile);
                $("#modal-alta-chofer-titulo").html("Modifica Chofer DNI "+dni);
                $('#modal-alta-chofer-mensajeChoferNuevo').css('display', 'none');
                $("#alta-chofer").attr("metodo", "PUT");
              } else {
                $("#modal-alta-chofer-titulo").html("Alta Chofer DNI "+dni);
                $("#alta-chofer").attr("metodo", "POST");
              }

              $("#alta-chofer").modal();
            }
          })
          .fail(function(response) {
          });
        } else {
          self.alertInfo("Administración Playa", "Debe seleccionar una fila");
          return;
        }
      });
      $("#btnAnular").click(function(e) {
        e.preventDefault()
        var gateId = $('#'+self.selectedRow).attr('id');
        if (gateId !== undefined) {
          self.ConfirmDialog("¿Anular el ingreso de Camión?", "Anular", function(result) {
            if (result) {
              $.ajax({
                method: "POST",
                dataType: "json",
                beforeSend: self.setHeader,
                url: window.transporte.apiURL + "/gates/delete",
                data: {
                  _id: gateId
                }
              })
                .done(function(response) {
                  if (response.status == "OK") {
                    self.alertSuccess("Administración Playa", "Se anulo el Gate correctamente");
                    $('#'+self.selectedRow).remove();
                    return;
                  }
                })
                .fail(function(response) {
                });
            }
          });
        } else {
          self.alertInfo("Administración Playa", "Debe seleccionar una fila");
          return;
        }

      });

      self.dataTable = new DataTableWidget();
    });
  },
  init: function(args) {
    var self = this;
    this._super(args);
    var socket = args.socket;

    comboMarcasAltaCamion();

    comboColors('modal-alta-tractor-input-color');

    nuevoTractorButtonListener();
    nuevoChoferButtonListener();

    socket.on('appointment', function (turno) {

        var $tr = $('tr[contenedor="' + turno.contenedor + '"');
        $tr.attr('class', 'normal');

        var $turnoinicio = $tr.find(".turno-inicio");
        $turnoinicio.html(self.timeFormat(new Date(turno.inicio)));

        var $turnoFin = $tr.find(".turno-fin");
        $turnoFin.html(self.timeFormat(new Date(turno.fin)));

    });
    socket.on('gate', function (gate) {
      if (gate && gate.data.terminal === 'ZAP' && gate.data.tipo === 'IN') {
        self.addRowToPlayon(gate.data);
      }
    });
    socket.on('requestTruck', function (req) {

      var td = $("tr td[data-patente='"+req.camion+"']");
      var tdTerminal = $(td).parents("tr").find(".terminal");
      var pedido = $(td).parents("tr").attr("pedido")
      if (req.camion !== undefined && pedido !== '1') {
  
        $(td).css("color", "green");
        $(td).attr("title", "Camión solicitado para " + tdTerminal.html());
        $(td).parents("tr").attr("pedido", "1");
        $("#divPedidos").html(parseInt($("#divPedidos").html())+1);
      }

    });

    this.getStatusAndRender();
  }
});
