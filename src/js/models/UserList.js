define(function (require, exports, module) {
    'use strict';

    function UserList() {
        this._userList = [];
        this._userIds = [];
    }

    UserList.prototype.addUser = function (user) {
        if (this._userIds.indexOf(user.Id) === -1) {
            this._userIds.push(user.Id);
            this._userList.push(user);
            return true;
        }
    };

    UserList.prototype.deleteUser = function (id) {
        for (var i = 0; i < this._userList.length; i++) {
            if (id === this._userList[i].Id) {
                this._userList.splice(i, 1);
            }
        }
    };

    UserList.prototype.updateCaretPos = function (data) {
        for (var i = 0; i < this._userList.length; i++) {
            if (data.id === this._userList[i].Id) {
                this._userList[i].Line = data.caretPos.line;
                this._userList[i].Ch = data.caretPos.ch;
            }
        }
    };

    UserList.prototype.getUser = function (id) {
        for (var i = 0; i < this._userList.length; i++) {
            if (id === this._userList[i].Id) {
                return this._userList[i];
            }
        }
    };

    exports.UserList = UserList;
});