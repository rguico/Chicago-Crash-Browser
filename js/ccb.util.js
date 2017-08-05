import URI from 'urijs';
import _ from 'lodash';

const params = {};

const uri = new URI(window.location.href);
_.each(uri.fragment().split('&'), pair => {
    let param = pair.split('=');
    params[param[0]] = param[1];
});

const getParam = function getParam(param) {
    return params[param];
};

const getDistance = function getDistance() {
    return $('#searchRadius').val();
};

/**
 *  Return an Object sorted by it's Key; http://stackoverflow.com/questions/5467129/sort-javascript-object-by-key
 */
const sortObjectByKey = function sortObjectByKey(obj){
    const keys = [];
    const sorted_obj = {};

    for(let key in obj){
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
const personOrPeople = function personOrPeople(quantity) {
    return quantity == 1 ? quantity + ' person' : quantity + ' people';
};

const crashOrCrashes = function crashOrCrashes(quantity) {
    return quantity == 1 ? quantity + ' crash' : quantity + ' crashes';
};

/*
*   Collision type enumerations. The variable type matters, because
*   switch statements use === for comparisons.
*/
const CollisionEnum = Object.freeze({
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