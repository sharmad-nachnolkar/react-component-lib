"use strict";
/// <reference path="../../../typings/tsd.d.ts" />
var moment = require('moment');
var Helper = (function () {
    function Helper() {
    }
    Helper.prototype.getPropertyValue = function (propertyObject, configObject, propertyName) {
        var propertyValue;
        if (typeof (propertyObject) != 'object') {
            propertyValue = propertyObject;
        }
        else {
            if (configObject.hasOwnProperty(propertyName) && configObject[propertyName] != undefined &&
                configObject[propertyName] != null && configObject[propertyName] != '') {
                var tempProperty = configObject[propertyName];
                if (propertyObject.hasOwnProperty(tempProperty)) {
                    propertyValue = propertyObject[tempProperty];
                }
                else {
                    throw new Error("Datasource does not have property " + tempProperty);
                }
            }
            else {
                throw new Error("Invalid " + propertyName + " property");
            }
        }
        return propertyValue;
    };
    Helper.prototype.validateStringArray = function (props, propName, componentName) {
        if (props[propName]) {
            if (props[propName].constructor === Array) {
                for (var _i = 0, _a = props[propName]; _i < _a.length; _i++) {
                    var element = _a[_i];
                    if (typeof (element) != 'string') {
                        return new Error(propName + " not a valid string array");
                    }
                }
            }
            else {
                return new Error(propName + " not a valid string array");
            }
        }
    };
    //checks if a moment object exits in a moment object array. Returns Index if exists else -1
    Helper.prototype.doesMomentObjectExist = function (checkObj, containingObj) {
        var index = -1;
        if (moment.isMoment(checkObj)) {
            for (var i = 0; i < containingObj.length; i++) {
                if (moment.isMoment(containingObj[i]) && checkObj.isSame(containingObj[i], 'day')) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    };
    Helper.prototype.getUniqueArray = function (array) {
        var a = array.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j])
                    a.splice(j--, 1);
            }
        }
        return a;
    };
    return Helper;
}());
module.exports = Helper;
