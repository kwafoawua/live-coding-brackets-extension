define(function (require, exports, module) {
    function LiveCodingView(cm, doc, control) {
        this._bookmark = null;
        this._caret = null;
        this._controller = control;
        this._userCarets = [];
        this._cm = cm;
        this._doc = doc;
    }

    LiveCodingView.prototype.init = function () {
        var that = this;
        this._cm.on('cursorActivity', function () {
            var line = that._cm.getCursor().line;
            var ch = that._cm.getCursor().ch;
            if (document.getElementById(that._caret.getAttribute('id'))) {
                if (that._caret.parentNode) {
                    that._caret.parentNode.removeChild(that._caret);
                    that._bookmark = that._cm.getDoc().setBookmark({
                        line: line,
                        ch: ch
                    }, {
                        widget: that._caret,
                        insertLeft: true,
                        shared: true
                    });
                }
            }
            that._controller.Send();

        });
    };
    LiveCodingView.prototype.appendUser = function (data) {
        if (this._caret === null) {
            var span = document.createElement('span');
            span.style.height = '15px';
            span.setAttribute('id', 'span' + data.id);
            span.style.borderLeft = '2px solid ' + data.color;
            this._caret = span;
            this.init();
        } else if (this._caret.getAttribute('id') !== 'span' + data.id) {
            var span = document.createElement('span');
            span.style.height = '15px';
            span.setAttribute('id', 'span' + data.id);
            span.style.borderLeft = '2px solid ' + data.color;
            span.setAttribute('data-tooltip', data.id);
            span.setAttribute('data-tooltip-position', 'right');
            span.style.position = 'absolute';
            this._userCarets.push(span);
            this.appendBookmark(data);

        }
    };

    LiveCodingView.prototype.getWidget = function (id) {
        for (var i = 0; i < this._userCarets.length; i++) {
            if (this._userCarets[i].getAttribute('id') === id) {
                return this._userCarets[i];
            }
        }
    };

    LiveCodingView.prototype.appendBookmark = function (data) {
        var that = this;
        var id = 'span' + data.id;
        var span = this.getWidget(id);
        this._cm.getDoc().setBookmark({
            line: data.caretPos.line,
            ch: data.caretPos.ch
        }, {
            widget: span,
            insertLeft: true,
            shared: true
        });

    };
    LiveCodingView.prototype.updateUserCarets = function (data) {
        var line = data.caretPos.line;
        var ch = data.caretPos.ch;
        var id = 'span' + data.id;
        if (id !== this._caret.getAttribute('id')) {
            var span = this.getWidget(id);
            if (document.getElementById(span.getAttribute('id'))) {
                if (span.parentNode) {
                    span.parentNode.removeChild(span);
                    this._cm.getDoc().setBookmark({
                        line: line,
                        ch: ch
                    }, {
                        widget: span,
                        inserLeft: true,
                        shared: true
                    });
                }
            }
        }
    };

    exports.LiveCodingView = LiveCodingView;

});