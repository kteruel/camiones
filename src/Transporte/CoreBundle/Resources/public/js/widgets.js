var BaseWidget = Class.extend({
    /** Form Functions */
    dontUseEnterInForm: function() {
        $("input").keydown(function(e) {
            if(e.keyCode == 13) {
                e.preventDefault();
                return false;
            }
        });
    },
    keyPressOnlyNumbers: function(inputId) {
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
    },
    /** Ajax Functions */
    setHeader: function(xhr) {
        xhr.setRequestHeader('token', window.transporte.token);
    },
    /** Date Functions */
    equalDates: function(date1, date2) {
        return ("" + date1.getFullYear() + date1.getMonth() + date1.getDate()) === ("" + date2.getFullYear() + date2.getMonth() + date2.getDate());
    },
    zeroString(number, length) {
        var string = '' + number;
        while (string.length < length) {
            string = '0' + string;
        }

        return string;
    },
    dateFormat: function(date) {
        if (date === "") {
            return date;
        }
        return this.zeroString(date.getDate(), 2) + "/" + this.zeroString((date.getMonth() + 1), 2) + "/" + date.getFullYear()
    },
    dateTimeFormat: function(date) {
        if (date === "") {
            return date;
        }
        return this.zeroString(date.getDate(), 2) + "/" + this.zeroString((date.getMonth() + 1), 2) + "/" + date.getFullYear() +
               " " + this.zeroString(date.getHours(), 2) + ":" + this.zeroString(date.getMinutes(), 2)
    },
    timeFormat: function(date) {
        if (date === "") {
            return date;
        }
        return this.zeroString(date.getHours(), 2) + ":" + this.zeroString(date.getMinutes(), 2);
    },
    /** Alert Functions */
    alertError: function(title, content) {
        $.smallBox({
            title : title,
            content : content,
            color : "#a90329",
            iconSmall : "fa fa-times bounce animated",
            timeout : 10000
        });
    },
    alertSuccess: function(title, content) {
        $.smallBox({
            title : title,
            content : content,
            color : "#468847",
            iconSmall : "fa fa-success bounce animated",
            timeout : 10000
        });
    },
    alertWarning: function(title, content) {
        $.smallBox({
            title : title,
            content : content,
            color : "#826430",
            iconSmall : "fa fa-warning bounce animated",
            timeout : 10000
        });
    },
    alertInfo: function(title, content) {
        $.smallBox({
            title : title,
            content : content,
            color : "#3276b1",
            iconSmall : "fa fa-info bounce animated",
            timeout : 10000
        });
    },
    init: function(args) {
        var widget = this;
        for(var a in args) {
            if (args.hasOwnProperty(a)) {
                widget[a] = args[a];
            }
        }
    }
});

var DeleteWidget = BaseWidget.extend({
    objectName: '',
    delete: false,
    addButtonListener: function() {
        var self = this;
        $("#form-delete").submit(function(e) {
            if (!self.delete) {
                e.preventDefault();
                $.SmartMessageBox({
                        "title": "<i class='fa fa-recycle txt-color-orangeDark'></i> Eliminar " + self.objectName + " <span class='txt-color-orangeDark'>¿<strong>Está seguro de que lo desea eliminar</strong>?</span>",
                        "buttons": "[No][Si]"
                    }, function(r) {
                        if (r === "Si") {
                            self.delete = true;
                            $("#form-delete").submit();
                        }
                    }
                );
            }
        });
    },
    init: function(args) {
        this._super(args);

        this.addButtonListener();
    }
});

var DataTableWidget = BaseWidget.extend({
    containerId: "#dataTable",
    url: "",
    responsiveHelper_dt_basic: null,
    breakpointDefinition : {
        tablet : 1024,
        phone : 480
    },
    objectName: "",
    classButtonDelete: '.btn-delete',
    classButtonRestore: '.btn-restore',
    enableDeleteButton: false,
    enableRestoreButton: false,
    preDrawCallback : function() {
        var self = this;
        // Initialize the responsive datatables helper once.
        if (!self.responsiveHelper_dt_basic) {
            self.responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($(self.containerId), self.breakpointDefinition);
        }
    },

    rowCallback : function(nRow) {
        var self = this;
        self.responsiveHelper_dt_basic.createExpandIcon(nRow);
    },

    drawCallback : function(oSettings) {
        var self = this;
        self.responsiveHelper_dt_basic.respond();
    },

    dataTableOptions: {
        oLanguage: {
            sProcessing   :  "",
            sLengthMenu   :  "Mostrar _MENU_ registros",
            sZeroRecords  :  "No se encontraron resultados",
            sInfo         :  "Mostrando desde _START_ hasta _END_ de _TOTAL_ registros",
            sInfoEmpty    :  "Mostrando desde 0 hasta 0 de 0 registros",
            sInfoFiltered :  "(filtrado de _MAX_ registros en total)",
            sInfoPostFix  :  "",
            sSearch       :  '<span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span>',
            sUrl          :  "",
            oPaginate: {
                sFirst:    "Primero",
                sPrevious: "Anterior",
                sNext:     "Siguiente",
                sLast:     "Último"
            },

        },

        iDisplayLength: 10,

        bProcessing: false,

        bServerSide: false,

        sPaginationType: "full_numbers",

        sDom: "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-12 hidden-xs'l>r>"+
                        "t"+
             "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-6'p>>",

        autoWidth: true
    },

    render: function (nombre, url) {
        var widget = this;
        if (widget.dataTableOptions.bServerSide) {
            widget.dataTableOptions['sAjaxSource'] = widget.url;
        }
        var functions = {
            preDrawCallback : function() {
                // Initialize the responsive datatables helper once.
                if (!widget.responsiveHelper_dt_basic) {
                    widget.responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($(widget.containerId), widget.breakpointDefinition);
                }
            },
            rowCallback : function(nRow) {
                widget.responsiveHelper_dt_basic.createExpandIcon(nRow);
            },
            drawCallback : function(oSettings) {
                widget.responsiveHelper_dt_basic.respond();
            }
        };

        widget.oTable = $(widget.containerId).DataTable(
            $.extend(
                widget.dataTableOptions,
                functions
            )
        );

        // Apply the filter
        $(widget.containerId + " thead th input[type=text]").on( 'keyup change', function () {

            widget.oTable
                .column( $(this).parent().index()+':visible' )
                .search( this.value )
                .draw();
        } );
    },

    reload: function() {
        var self = this;
        self.oTable.ajax.reload();
    },

    deleteRow: function($row) {
        var self = this;
        self.oTable.fnDeleteRow( $row );
    },

    restoreAjax: function($a) {
        var self = this;
        var urlRestore = $a.attr('href');
        $.ajax({
            type: 'POST',
            url: urlRestore,
            success: function() {
                self.alertSuccess("Restaurar", "<i class='fa fa-clock-o'></i> <i>Restauración exitosa!</i>");
                self.deleteRow($a.parents('tr'));
            }
        });
    },

    restore: function($a) {
        var self = this;
        $.SmartMessageBox({
                "title": "<i class='fa fa-recycle txt-color-orangeDark'></i> Restaurar " + self.objectName + " <span class='txt-color-orangeDark'>¿<strong>Está seguro de que lo desea restaurar</strong>?</span>",
                "buttons": "[No][Si]"
            }, function(r) {
                if (r === "Si") {
                    setTimeout(self.deleteAjax($a), 1e3);
                }
        })
    },

    deleteAjax: function($a) {
        var self = this;
        var urlDelete = $a.attr('href');
        $.ajax({
            type: 'POST',
            url: urlDelete,
            success: function() {
                self.alertSuccess("Eliminar","<i class='fa fa-clock-o'></i> <i> Eliminación realizada correctamente.</i>");
                self.deleteRow($a.parents('tr'));
            },
            error: function() {
                self.alertError("Eliminar", "<i class='fa fa-clock-o'></i> <i> Error al intentar eliminar.</i>");
            }
        });
    },

    delete: function($a) {
        var self = this;
        $.SmartMessageBox({
                "title": "<i class='fa fa-trash-o txt-color-orangeDark'></i> Eliminar " + self.objectName + " <strong></strong><br/><span class='txt-color-orangeDark'>¿<strong>Está seguro de eliminarlo</strong>?</span>",
                "buttons": "[No][Si]"
            }, function(r) {
                if (r === "Si") {
                    setTimeout(self.deleteAjax($a), 1e3);
                }
        })
    },

    addDeleteButtonEvents: function() {
        var self = this;
        $(self.classButtonDelete).each(function() {
            $(this).on('click', function(e) {
                e.preventDefault();
                self.delete($(this));
            });
        });
    },

    addRestoreButtonEvents: function() {
        var self = this;
        $(self.classButtonRestore).each(function() {
            $(this).on('click', function(e) {
                e.preventDefault();
                self.restore($(this));
            });
        });
    },

    init: function(args) {
        var widget = this;
        for (var property in args) {
          if (args.hasOwnProperty(property)) {
            if (!$.isPlainObject(args[property])) {
                widget[property] = args[property];
            } else {
                for(var o in args[property]) {
                    if (args[property].hasOwnProperty(o)) {
                        widget[property][o] = args[property][o];
                    }
                }
            }
          }
        }

        widget.render();

        if (widget.enableDeleteButton) {
            widget.addDeleteButtonEvents();
        }

        if (widget.enableRestoreButton) {
            widget.addRestoreButtonEvents();
        }
    }
});

var CollectionWidget = BaseWidget.extend({
    count: null,
    deleteText: 'Borrar',
    newElementClass: null,
    initPlugins: function() {
        $('.delete').on('click', function(e) {
            // prevent the link from creating a "#" on the URL
            e.preventDefault();
            // remove the li for the tag form
            $(this).parents('li').remove();
        });
    },
    addButtonListener: function() {
        var self = this;
        jQuery('#add-another').click(function(e) {
            e.preventDefault();

            var list = jQuery('#fields-list');

            // grab the prototype template
            var newWidget = list.attr('data-prototype');
            newWidget = newWidget.replace(/__name__/g, self.count);
            self.count++;

            // create a new list element and add it to the list
            var newLi = jQuery('<li></li>').html(newWidget).addClass(self.newElementClass);
            newLi.appendTo(list);

            var $removeFormA = $('<footer><a href="#" class="delete btn btn-danger">'+self.deleteText+'</a></footer>');
            newLi.append($removeFormA);

            // REFRESH PLUGINS
            self.initPlugins();
        });
    },
    init: function(args) {
        this._super(args);

        this.addButtonListener();

        this.initPlugins();
    }
});

var SimpleMapWidget = BaseWidget.extend({
    map: null,
    mapId: "map",
    zoom: 13,
    lat: -36.7751787,
    lng: -59.860193,
    infoWindow: null,
    init: function(args) {
        var self = this;
        this._super(args);

        self.map = new google.maps.Map(document.getElementById(self.mapId), {
            center: {lat: self.lat, lng: self.lng},
            zoom: self.zoom
        });

        if (self.infoWindow) {
            var infoWindow = new google.maps.InfoWindow({map: self.map});

            var pos = {
              lat: self.infoWindow.lat,
              lng: self.infoWindow.lng
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('<div><strong>' + self.infoWindow.address + '</strong><br>' + self.infoWindow.city);
            self.map.setCenter(pos);
            self.map.setZoom(17);
        }
    }
});

var GeoLocalizationWidget = SimpleMapWidget.extend({
    address: null,
    // Ids Without #
    inputMapAddressId: "map-address",
    inputAddressId: "",
    inputLatitudId: "",
    inputLongitudId: "",
    inputCountryId: "",
    inputCountryCodeId: "",
    init: function(args) {
        var self = this;
        this._super(args);

        var input = /** @type {!HTMLInputElement} */(
            document.getElementById(self.inputMapAddressId));

        self.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', self.map);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
            map: self.map,
            anchorPoint: new google.maps.Point(0, -29)
        });

        autocomplete.addListener('place_changed', function() {
            infowindow.close();
            marker.setVisible(false);
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                self.map.fitBounds(place.geometry.viewport);
            } else {
                self.map.setCenter(place.geometry.location);
                self.map.setZoom(17);  // Why 17? Because it looks good.
            }
            marker.setIcon(/** @type {google.maps.Icon} */({
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(35, 35)
            }));
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

            var address = '';
            if (place.address_components) {
                console.log(place.address_components);
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
                if (place.address_components.hasOwnProperty(5)) {
                    $("#" + self.inputCityId).val(place.address_components[5].long_name || '');
                }
                if (place.address_components.hasOwnProperty(5)) {
                    $("#" + self.inputCountryId).val(place.address_components[6].long_name || '');
                    $("#" + self.inputCountryCodeId).val(place.address_components[6].short_name || '');
                }
            }

            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
            infowindow.open(self.map, marker);

            $("#" + self.inputAddressId).val(place.name);
            $("#" + self.inputLatitudId).val(place.geometry.location.lat());
            $("#" + self.inputLongitudId).val(place.geometry.location.lng());
        });
    }
});