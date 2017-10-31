function userLogout(a)
{
    function b() {
        window.location = a.attr("href")
    }
    $.SmartMessageBox({
        "title": "<i class='fa fa-sign-out txt-color-orangeDark'></i> Cerrar sesion de <span class='txt-color-orangeDark'><strong>" + $("#show-shortcut").text() + "</strong></span>.",
        "content": a.data("logout-msg") || "You can improve your security further after logging out by closing this opened browser",
        "buttons": "[No][Si]"
    }, function(a) {
        "Si" == a && ($.root_.addClass("animated fadeOutUp"),
        setTimeout(b, 1e3))
    })
}


function transportePageSetUp()
{
    var initializeDuallistbox = $('.duallistbox').bootstrapDualListbox({
        nonSelectedListLabel: 'No seleccionado',
        selectedListLabel: 'Seleccionado',
        filterTextClear: 'Mostrar todos',
        preserveSelectionOnMove: 'moved',
        infoTextEmpty: 'Lista vacia',
        infoText: 'Seleccionados: {0}',
        filterPlaceHolder: 'Ingrese un texto para buscar'
    });

    $.root_.on("click", '[data-action="transporteUserLogout"]', function(b) {
        var c = $(this);
        userLogout(c),
        b.preventDefault(),
        c = null
    });

    $(".js-datepicker").datepicker({
        'dateFormat' : 'yy-mm-dd'
    });

    $('.clockpicker').clockpicker({
        placement: 'top',
        donetext: 'Done'
    });

    $(".summernote").summernote({
        height: 100
    });
}