define(function (require, exports, module) {
    'use strict';

    var LiveCodingController = require('src/js/LiveCodingController'),
        LiveCodingAPI = require('src/js/LiveCodingAPI');

    var EditorManager = brackets.getModule('editor/EditorManager'),
        CommandManager = brackets.getModule('command/CommandManager'),
        Menus = brackets.getModule('command/Menus'),
        AppInit = brackets.getModule('utils/AppInit'),
        ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
        PanelManager = brackets.getModule('view/PanelManager');

    var $icon = $("<a id='live-coding-icon' href='#'></a>")
        .attr('title', 'Live Coding')
        .appendTo($("#main-toolbar .buttons"));

    ExtensionUtils.loadStyleSheet(module, 'src/css/style.css');

    function startShareDB() {
        var controller = new LiveCodingController(); //TODO CUANDO SE CREE ENVIARLE LA IP Y LOS PORT
        controller.init();
    }

    /*
        Registering a menu item takes a few steps. I begin by defining a "command ID", a unique identifier for the item I'll be adding to the UI. The typical way to do this is with the format extensionname.someaction
    */

    var XDK_LIVE_CODING = 'xdk-live-coding.excecute';
    CommandManager.register('Run LiveCoding', XDK_LIVE_CODING, startShareDB);

    var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
    menu.addMenuItem(XDK_LIVE_CODING);

    var XDKLiveCoding = window.top.xdk.require('client:live-coding');
    XDKLiveCoding.setInstance(LiveCodingAPI.LiveCodingAPI()); //TODO No tiene por que llamarse setInstance.

    $icon.on('click', function () {
        XDKLiveCoding.showDialog();
    });

});