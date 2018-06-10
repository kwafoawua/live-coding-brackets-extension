define(function (require, exports, module) {
    'use strict';
    /**
     * @constructor
     * @param {string} color - Color of the User Caret
     * @param {int} id - Id given by the SharedDB
     * @param {int} line - Codemirror's row where the user's caret is.
     * @param {int} ch - Codemirror's column where the user's caret is. 
     */
    function User(options) {
        if (!options) {
            options = {};
        }
        this._color = options.color || '#' + Math.random().toString(16).substr(2, 6);
        this._id = options.id;
        this._line = options.caretPos.line || null;
        this._ch = options.caretPos.ch || null;
    }
    Object.defineProperties(User.prototype, {
        Id: {
            get: function () {
                return this._id;
            }

        },
        Color: {
            get: function () {
                return this._color;
            },
            set: function (value) {
                this._color = value;
            }
        },
        Line: {
            get: function () {
                return this._line;
            },
            set: function (value) {
                this._line = value;
            }
        },
        Ch: {
            get: function () {
                return this._ch;
            },
            set: function (value) {
                this._ch = value;
            }
        }

    });
    exports.User = User;
});