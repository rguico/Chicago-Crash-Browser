import $ from 'jquery';
import URI from 'urijs';
import _ from 'lodash';

var params = {};

var uri = new URI(window.location.href);
_.each(uri.fragment().split('&'), pair => {
    var param = pair.split('=');
    params[param[0]] = param[1];
});

var getParam = function getParam(param) {
    return uri[param];
};

var getDistance = function getDistance() {
    return $('input[name="searchRadius"]:checked').val();
};

/**
 *  Return an Object sorted by it's Key; http://stackoverflow.com/questions/5467129/sort-javascript-object-by-key
 */
var sortObjectByKey = function sortObjectByKey(obj){
    var keys = [];
    var sorted_obj = {};

    for(var key in obj){
        if(obj.hasOwnProperty(key)){
            keys.push(key);
        }
    }

    // sort keys
    keys.sort();

    // create new array based on Sorted Keys
    $.each(keys, (i, key) => {
        sorted_obj[key] = obj[key];
    });

    return sorted_obj;
};

/*
*   Returns plural forms of common words.
*/
var personOrPeople = function personOrPeople(quantity) {
    var s;
    if(quantity == 1) {
        s = quantity + ' person';
    } else if(quantity > 1) {
        s = quantity + ' people';
    }
    return s;
};

var crashOrCrashes = function crashOrCrashes(quantity) {
    var s;
    if(quantity == 1) {
        s = quantity + ' crash';
    } else if(quantity > 1) {
        s = quantity + ' crashes';
    }
    return s;
};

/*
*   Collision type enumerations. The variable type matters, because
*   switch statements use === for comparisons.
*/
var CollisionEnum = Object.freeze({
    PEDESTRIAN: 1,
    BICYCLIST: 2
});

export {
    sortObjectByKey,
    personOrPeople,
    crashOrCrashes,
    CollisionEnum,
    getDistance,
    getParam
};