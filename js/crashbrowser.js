/* jshint undef: true, unused: false */
/* global Rhaboo,require,define */
'use strict';

import * as Cookies from 'js-cookie';
import $ from 'jquery';

require('jquery-ui/ui/core');
require('jquery-ui/ui/widget');
require('jquery-ui/ui/position');
require('jquery-ui/ui/widgets/menu');
require('jquery-ui/ui/widgets/autocomplete');

require('select2');

require('leaflet');
require('leaflet-markercluster');
require('leaflet-plugins/control/Permalink');
require('leaflet-draw');
require('bootstrap');

define(['ccb.util', 'crashes', 'map', 'summary', 'areas', 'jquery'], function (Utility, crashes, map, summary, areas, $) {
    var addresses = [];

    /*
    *   Communicates with the OpenStreetMap API to get coordinates for a given (Chicago!) address.
    *   Since this calls an external service, this needs to return a jQuery promise.
    */
    var fetchCoordsForAddress = function() {
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

    var saveAddressAndShowCrashes = function() {
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

    var addressError = function() {
        $('#status').html('Could not locate this address. Please try again later, or use a valid Chicago address!');
    };

    /*
    *   Set initial conditions
    */
    var init = function() {
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

        // When there isn't a searchRadius cookie, default to 150.
        if (Cookies.get('searchRadius') === undefined) {
            $('input[name="searchRadius"][value="150"]').prop('checked', true).parent().addClass('active');
            Cookies.set('searchRadius', '150');
        } else {
            var searchRadius = Cookies.get('searchRadius');
            $('input[name="searchRadius"][value="' + searchRadius + '"]').prop('checked', true).parent().addClass('active');
        }

        // Load stored addresses
        if (localStorage.getItem('ccb.addresses')) {
            setAddresses(JSON.parse(localStorage.getItem('ccb.addresses')));
        }

        $('body').on('search', function (event, opts) {
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
                .catch(() => {
                    $('#status').html('Something went wrong while retrieving data. Please try again later and alert Steven.');
                    map.closePopup();
                });
        });

        $('input[name="searchRadius"]:radio').change(function() {
            var searchRadiusValue = $('input[name="searchRadius"]:checked').val();
            $('#searchRadiusButtons label input').removeClass('active');
            Cookies.set('searchRadius', searchRadiusValue);
            $('body').trigger('search');
        });

        $('input[name="outputType"]:radio').change(function() {
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

        $('button[name="goButton"]').click(function() {
            saveAddressAndShowCrashes();
        });

        /*
        *   For when someone submits the form using the <enter> key in an input field.
        */
        $('#configForm').submit(function(evt) {
            evt.preventDefault();
            saveAddressAndShowCrashes();
        });

        $('#address').autocomplete({
            source: getAddresses(),
            minLength: 0
        });

        $('#address').focus(function () {
            $('#address').autocomplete('search', '');
        });

        var get = Utility.getParam('get');
        if(get === 'yes') {
            $('body').trigger('search');
        }

        $('.btn').button();

        areas.initDropdown();

    };

    $(document).ready(init);
});