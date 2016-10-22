"use strict";
//rules
function required(value) {
    if (typeof (value) == 'Object' && (value == null || Object.keys(value).length <= 0)) {
        return false;
    }
    else if (value == undefined) {
        return false;
    }
    else if (typeof (value) == 'string' && value.trim() == '') {
        return false;
    }
    else if (value.constructor === Array && value.length <= 0) {
        return false;
    }
    else {
        return true;
    }
}
function email(email) {
    if (typeof (email) == "string" && email === "") {
        return true;
    }
    var emailRegex = new RegExp(/^([A-Z|a-z|0-9](\.|_){0,1})*[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])*((\.){0,1}[A-Z|a-z|0-9]){1}\.[a-z]{2,}$/);
    return emailRegex.test(email);
}
function mobile(mobile) {
    if (typeof (mobile) == "string" && mobile === "") {
        return true;
    }
    var mobileRegex = new RegExp(/^[7-9][\d]{9}$/);
    return mobileRegex.test(mobile);
}
function integer(integer) {
    var IntegerRegex = new RegExp(/^\d+$/g);
    return IntegerRegex.test(integer);
}
function regex(regexString, value) {
    var regex = new RegExp(regexString);
    return regex.test(value);
}
function inverse_regex(regexString, value) {
    var regex = new RegExp(regexString);
    return !regex.test(value);
}
function maxValue(maxValue, value) {
    if (isNaN(maxValue) || isNaN(value))
        return true;
    else if (parseFloat(value) > parseFloat(maxValue))
        return false;
    else
        return true;
}
function minLength(minLength, value) {
    if (value) {
        return value.toString().trim().length >= minLength;
    }
    else
        return false;
}
function minValue(minValue, value) {
    if (isNaN(minValue) || isNaN(value))
        return true;
    else if (parseFloat(value) < parseFloat(minValue))
        return false;
    else
        return true;
}
var validationRules = {
    integer: integer,
    email: email,
    mobile: mobile,
    required: required,
    regex: regex,
    inverse_regex: inverse_regex,
    maxValue: maxValue,
    minValue: minValue,
    minLength: minLength
};
//rules end
//Validation Messages
var ValidationMessages = {
    required: 'Please enter this value',
    email: 'Invalid email id',
    mobile: 'Invalid mobile no',
    integer: 'Please enter a valid intege value',
    regex: 'Please enter a valid value',
    inverse_regex: 'Please enter a valid value',
    maxValue: 'Value exceeds the maximum value allowed.',
    minValue: 'Value is less than the minimum value allowed.'
};
//
function callValidator(validationName, validationObj, value) {
    var isValid = true;
    switch (validationName) {
        case 'regex':
            isValid = validationRules[validationName](validationObj["expression"], value);
            break;
        case 'inverse_regex':
            isValid = validationRules[validationName](validationObj["expression"], value);
            break;
        case 'maxValue':
            isValid = validationRules[validationName](validationObj["maxValue"], value);
            break;
        case 'minValue':
            isValid = validationRules[validationName](validationObj["minValue"], value);
            break;
        case 'customHandler':
            isValid = validationObj["customHandler"](value);
            break;
        case 'minLength':
            isValid = validationRules[validationName](validationObj["minLength"], value);
            break;
        default:
            if (validationRules[validationName]) {
                isValid = validationRules[validationName](value);
            }
            break;
    }
    return isValid;
}
//helper validation functions
function validationHandler(value, validationArray) {
    var validationObject = { isValid: true, message: "" };
    if (Object.prototype.toString.call(validationArray) !== '[object Array]') {
        throw new Error('validationArray should be an array (In Validations.tsx)');
    }
    else {
        for (var i = 0; i < validationArray.length; i++) {
            if (typeof (validationArray[i]) == 'string') {
                validationObject['isValid'] = validationRules[validationArray[i]](value);
                validationObject['message'] = "";
                if (validationObject['isValid'] == false) {
                    validationObject['message'] = ValidationMessages[validationArray[i]];
                }
            }
            else if (typeof (validationArray[i]) == 'object') {
                if (validationArray[i].hasOwnProperty('name')) {
                    validationObject['isValid'] = callValidator(validationArray[i]["name"], validationArray[i], value);
                    validationObject['message'] = "";
                    if (validationObject['isValid'] == false) {
                        // checking if custom message is passed if not then use standard msgs
                        if (validationArray[i].hasOwnProperty('message')) {
                            validationObject['message'] = validationArray[i]['message'];
                        }
                        else {
                            validationObject['message'] = ValidationMessages[validationArray[i]['name']];
                        }
                    }
                }
                else {
                    throw new Error('Validation object must have name key');
                }
            }
            else {
                throw new Error('Valdiation rules can only be of type string or object');
            }
            //breaking if any one validation is false
            if (validationObject['isValid'] == false) {
                break;
            }
        }
        return validationObject;
    }
}
export default {
    validationRules: validationRules,
    validationHandler: validationHandler
};
