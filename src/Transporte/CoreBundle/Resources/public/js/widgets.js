var BaseWidget = Class.extend({
    zeroString(number, length) {
        var string = '' + number;
        while (string.length < length) {
            string = '0' + string;
        }

        return string;
    },
    dateFormat: function(date) {
        return this.zeroString(date.getDate(), 2) + "/" + this.zeroString((date.getMonth() + 1), 2) + "/" + date.getFullYear()
    },
    alertError: function(title, content) {
        $.smallBox({
            title : title,
            content : content,
            color : "#a90329",
            iconSmall : "fa fa-warning bounce animated",
            timeout : 4000
        });
    },
    alertSuccess: function(title, content) {
        $.smallBox({
            title : title,
            content : content,
            color : "#468847",
            iconSmall : "fa fa-success bounce animated",
            timeout : 4000
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

var TableServerSide = BaseWidget.extend({
    pageInit: 0,
    pageLength: 10,
    pageOptions: [5, 10, 25, 50],
    dataURL: '',
    totalDataCountId: "#totalDataCountId",
    tbodyId: "#tbodyId",
    paginationId: "#pagination",
    visiblePages: 5,
    tCodeColumns: [],
    setHeader: function(xhr) {
        xhr.setRequestHeader('token', window.transporte.token);
    },
    getTd: function(data, code) {
        var self = this;
        var isDate = false;
        if (code.substr(0,5) === 'date:') {
            code = code.substr(5);
            var isDate = true;
        }
        if (data.hasOwnProperty(code)) {
            if (isDate) {
                var d = new Date(data[code]);
                return $("<td data-date='"+data[code]+"'>" + self.dateFormat(d) + "</td>");
            } else {
                return $("<td>" + data[code] + "</td>");
            }
        }

        return null;
    },
    getAndRenderData: function() {
        var self = this;
        var url = window.transporte.apiURL + self.dataURL + "/" + self.pageInit + "/" + self.pageLength;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            beforeSend: self.setHeader,
            success: function( dataResponse ) {
                if (dataResponse.status == "OK") {
                    $(self.tbodyId).empty();
                    if (dataResponse.hasOwnProperty('totalCount')) {
                        if ($(self.paginationId).is(':empty')) {
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
            },
        });
    },
    addPagination: function(totalCount) {
        var self = this;
        $(self.paginationId).empty();
        var totalPages = totalCount / self.pageLength;
        $(self.paginationId).twbsPagination({
            totalPages: totalPages,
            visiblePages: self.visiblePages,
            onPageClick: function (event, page) {
                self.pageInit = (page - 1) * self.pageLength;
                self.getAndRenderData();
            },
            first: '<<',
            prev: '<',
            next: '>',
            last: '>>'
        });
    },
    init: function(args) {
        this._super(args);

        this.getAndRenderData();
    }
});