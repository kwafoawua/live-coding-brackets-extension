define(function (require, exports, module) {
    var LiveCodingController = require('src/js/LiveCodingController');

    var LiveCodingAPI = function () {
        var api = {
            LiveCodingController: LiveCodingController.init();
        };
        return api;
    };

    module.exports.LiveCodingAPI = LiveCodingAPI;
});