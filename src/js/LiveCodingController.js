define(function (require, exports, module) {
    'use strict';
    var UserList = require('src/js/models/UserList'),
        User = require('src/js/models/User'),
        LiveCodingView = require('src/js/LiveCodingView');
    var sharedb = require('thirdparty/sharedb'),
        otType = require('thirdparty/text'),
        ShareDBCodeMirror = require('thirdparty/sharedb-codemirror');
    var EditorManager = brackets.getModule('editor/EditorManager');


    function LiveCodingController(options) {
        if (!options) {
            options = {};
        }
        this._userList = new UserList();
        this._user = null;
        this._shareWS = null;
        this._userWS = null;
        this._sjs = null;
        this._sharePort = options.sharePort || null;
        this._serverPort = options.serverPort || null; //TODO completar con los correspondientes puertos...
        this._ip = options.ip || '127.0.0.1';
        this._view = null;
    }
    LiveCodingController.prototype.init = function () {
        sharedb.types.map['json0'].registerSubtype(otText.type);
        var that = this;
        var Editor = EditorManager.getActiveEditor();
        var cm = Editor._codeMirror;
        var initialData = cm.getValue();
        //this._shareWS = new WebSocket('ws://localhost:9000/'); //TODO cambiar al port correspondiente
        this._shareWS = new WebSocket('ws://' + this._ip + ':' + this._sharePort);
        this._sjs = new sharedb.Connection(this._shareWS);
        var doc = this._sjs.get('liveCoding', 'xdk'); //collection, name

        ShareDBCodeMirror.attachDocToCodeMirror(doc, cm, {
            key: 'content',
            verbose: true,
            initialData: initialData
        });
        doc.on('load', function () {
            that._view = new LiveCodingView(cm, doc, that);
            that.startUserWS();
        });
    };
    LiveCodingController.prototype.startUserWS = function () {
        var that = this;
        //this._userWS = new WebSocket('ws://localhost:9001'); //TODO CAMBIAR AL PORT CORRESPONDIENTE
        this._userWS = new WebSocket('ws://' + this._ip + ':' + this._serverPort);

        this._userWS.onmessage = function (event) {
            var data = JSON.parse(event.data);
            var user = new User(data);
            if (that._userList.addUser(user)) {
                that._view.appendUser(data);
            }
            that._userList.updateCaretPos(data);
            that._view.updateUserCarets(data);
        };
        this._userWS.onopen = function () {
            console.log(that._view._doc.connection);
            var data = {
                id: that._view._doc.connection.id,
                color: '#' + Math.random().toString(16).substr(2, 6),
                caretPos: that._view._cm.getCursor()
            };
            setTimeout(function () {
                that._userWS.send(JSON.stringify(data));
                that._user = new User(data);
                that._userList.addUser(that._user);
                that._view.appendUser(data);

            }, 50);
        };
        this._userWS.onclose = function () {};
        this._userWS.onerror = function () {};

    };
    LiveCodingController.prototype.Send = function () {
        var that = this;
        var data = {
            id: that._user.Id,
            color: that._user.Color,
            caretPos: that._view._cm.getCursor()
        };
        this._user.Line = this._view._cm.getCursor().line;
        this._user.Ch = this._view._cm.getCursor().ch;
        this._userWS.send(JSON.stringify(data));
    };

    LiveCodingController.prototype.initialize = function () {
        var liveCodingController = new LiveCodingController({});
        liveCodingController.init();
    };

    exports.LiveCodingController = LiveCodingController;
});