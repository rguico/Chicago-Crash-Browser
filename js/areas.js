/* global define, L */
'use strict';

import $ from 'jquery';
import _ from 'lodash';
import * as map from 'map';

var areas;

function initDropdown() {
  $.ajax('api/areas.json')
    .then(response => {
      areas = response;
      const data = [{
        id: '',
        text: 'Or select an area'
      }, {
        text: 'Neighborhood',
        children: getAreas('neighborhood')
      }, {
        text: 'Community Area',
        children: getAreas('communityarea')
      }, {
        text: 'Ward',
        children: getAreas('ward')
      }];

      $('#areaSelector').select2({
        data
      });

      $('#areaSelector').on('select2:select', e => {
        $.ajax('map.php', {
            data: {
              method: 'boundary',
              place: e.params.data.id
            }
          }).then(geoJsonRaw => {
            map.clearAreas();
            map.setPoly(L.GeoJSON.geometryToLayer(geoJsonRaw.features[0]));
            $('body').trigger('search', {
              areaType: 'polygon'
            });
          });
      });
    })
    .catch(err => {
      console.error(err);
    });
}

function getAreas(area) {
  return _.sortBy(_.map(_.filter(areas, {type: area}), ({slug, name}) => {
    return {
      id: slug,
      text: name
    }
  }), 'text');
}

export {
  initDropdown
};