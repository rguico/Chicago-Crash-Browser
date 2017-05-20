'use strict';

import L from 'leaflet';
import * as Cookies from 'js-cookie';
import $ from 'jquery';

function setDimensions(container, width, height) {
  container.style.width = width;
  if (height) {
    container.style.height = height;
  }
}

L.Control.CcbControl = L.Control.extend({
  options: {
    position: 'topright'
  },

  /*
    <div class="leaflet-bar leaflet-control leaflet-control-custom">
      <form>
        <div class="form-group">
        </div>
      </form>
    </div>
  */

  onAdd: function (map) {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    this.form = L.DomUtil.create('form', 'form', container);
    const group = L.DomUtil.create('div', 'form-group', this.form);
    this.label = L.DomUtil.create('label', null, group);
    this.label.textContent = 'Search Radius (m)';
    this.radiusSelect = L.DomUtil.create('select', 'form-control input-sm', group);
    this.radiusSelect.id = 'searchRadius';
    this.radiusSelect.name = 'searchRadius';
    for (let radius of [150, 250, 600]) {
      let select = L.DomUtil.create('option', null, this.radiusSelect);
      select.textContent = radius;
    }

    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);

    container.onmouseover = e => {
      // setDimensions(container, '100px');
    }

    container.onmouseout = e => {
      // setDimensions(container, '30px');
    }

    container.style.backgroundColor = 'white';
    setDimensions(container, '135px');

    container.onclick = e => {
      console.log('buttonClicked');
    }

    // When there isn't a searchRadius cookie, default to 150.
    if (Cookies.get('searchRadius') === undefined) {
        $('input[name="searchRadius"][value="150"]').prop('checked', true).parent().addClass('active');
        Cookies.set('searchRadius', '150');
    } else {
        var searchRadius = Cookies.get('searchRadius');
        $(`input[name="searchRadius"][value="${searchRadius}"]`).prop('checked', true).parent().addClass('active');
    }


    return container;
  }
})