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

    var interval = setInterval(function() {
        var now = new Date();
        var day = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
        var month = (now.getMonth()+1) < 10 ? "0" + (now.getMonth()+1) : (now.getMonth()+1);
        var year = now.getFullYear();
        var hour = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
        var min = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
        var sec = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
        $('#realtime-date').html(day + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec);
    }, 100);
}