/* jshint undef: true, unused: false */
/* global require,define */
'use strict';

import * as Cookies from 'js-cookie';
import $ from 'jquery';

import 'jquery-ui/ui/core';
import 'jquery-ui/ui/widget';
import 'jquery-ui/ui/position';
import 'jquery-ui/ui/widgets/menu';
import 'jquery-ui/ui/widgets/autocomplete';

import 'select2';

import * as Utility from './ccb.util';
import * as crashes from './crashes';
import * as map from './map';
import * as summary from './summary';
import * as areas from './areas';

var addresses = [];

/*
*   Communicates with the OpenStreetMap API to get coordinates for a given (Chicago!) address.
*   Since this calls an external service, this needs to return a jQuery promise.
*/
var fetchCoordsForAddress = function fetchCoordsForAddress() {
    var dfd = $.Deferred();

    if ($('#address').val()) {
        $.getJSON('http://nominatim.openstreetmap.org/search', {
            street: $('#address').val(),
            city: 'Chicago',
            state: 'IL',
            format: 'json'
        }).then(data => {
            if (data.length > 0 && !!data[0].lat && !!data[0].lon) {
                dfd.resolve(data);
            } else {
                dfd.reject();
            }
        }).catch(() => {
            dfd.reject();
        });
    }
    return dfd.promise();
};

var setAddresses = function setAddresses(addrs) {
    addresses = addrs;
};

var getAddresses = function getAddresses() {
    if (addresses.length > 0) {
        return addresses;
    } else {
        return ['121 N. LaSalle Blvd'];
    }
};

var saveAddressAndShowCrashes = function saveAddressAndShowCrashes() {
    var searchAddress = $('#address').val();
    $.when( fetchCoordsForAddress() )
        .then(data => {
            if (addresses.indexOf(searchAddress) === -1) {
                addresses.push(searchAddress);
                if (addresses.length > 15) {
                    addresses.shift();
                }
                localStorage.setItem('ccb.addresses', JSON.stringify(addresses));
            }
            map.setCoordinates(data[0].lat, data[0].lon);
            $('body').trigger('search');
        })
        .catch(() => {
            var badIdx = addresses.indexOf(searchAddress);
            if (badIdx !== -1) {
                addresses.splice(badIdx, 1);
                localStorage.setItem('ccb.addresses', JSON.stringify(addresses));
            }
            addressError();
            map.closePopup();
        });
};

var addressError = function addressError() {
    $('#status').html('Could not locate this address. Please try again later, or use a valid Chicago address!');
};

/*
*   Set initial conditions
*/
var init = function init() {
    // When there isn't a display cookie, default to graph.
    if (Cookies.get('display') === undefined) {
        $('#outputGraph').prop('checked', true).parent().addClass('active');
        Cookies.set('display', 'graph');
    } else {

        if (Cookies.get('display') == 'graph') {
            $('#outputGraph').prop('checked', true).parent().addClass('active');
            summary.showGraph();
        }

        if (Cookies.get('display') == 'text') {
            $('#outputText').prop('checked', true).parent().addClass('active');
            summary.showText();
        }
    }

    // Load stored addresses
    if (localStorage.getItem('ccb.addresses')) {
        setAddresses(JSON.parse(localStorage.getItem('ccb.addresses')));
    }

    $('body').on('search', (event, opts) => {
        $('#body').addClass('results-open');
        if (!opts) {
            opts = { areaType: 'circle' };
        }
        map.clearAreas();
        crashes
            .getCrashes(opts)
            .then(() => {
                if (opts.areaType === 'polygon') {
                    map.addPoly();
                } else {
                    map.addCircle();
                }
                map.finalizeMarkerGroup();
            })
            .catch((err) => {
                console.error(err);
                $('#status').html('Something went wrong while retrieving data. Please try again later and alert Steven.');
                map.closePopup();
            });
    });

    $('input[name="searchRadius"]:radio').change(() => {
        var searchRadiusValue = $('input[name="searchRadius"]:checked').val();
        $('#searchRadiusButtons label input').removeClass('active');
        Cookies.set('searchRadius', searchRadiusValue);
        $('body').trigger('search');
    });

    $('input[name="outputType"]:radio').change(() => {
        var outputTypeCheckedValue = $('input[name="outputType"]:checked').val();
        $('#displaySelection label input').removeClass('active');
        $('input[name="outputType"]:checked').addClass('active');
        Cookies.set('display', outputTypeCheckedValue);
        if (outputTypeCheckedValue == 'graph') {
            summary.showGraph();
        } else if (outputTypeCheckedValue == 'text') {
            summary.showText();
        }
    });

    /*
    *   For when someone submits the form using the <enter> key in an input field.
    */
    $('#configForm').submit(evt => {
        evt.preventDefault();
        saveAddressAndShowCrashes();
    });

    $('#address').on('keyup', e => {
        if (e.keyCode == 13) {
            saveAddressAndShowCrashes();
        }
    });

    $('#address').autocomplete({
        source: getAddresses(),
        minLength: 0
    });

    $('#address').focus(() => {
        $('#address').autocomplete('search', '');
    });

    var get = Utility.getParam('get');
    if (get === 'yes') {
        $('body').trigger('search');
    }

    // $('.btn').button();

    areas.initDropdown();

};

$(document).ready(init);