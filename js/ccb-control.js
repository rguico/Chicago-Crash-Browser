'use strict';

import L from 'leaflet';

function setDimensions(container, width, height=width) {
  container.style.width = width;
  container.style.height = height;
}

L.Control.CcbControl = L.Control.extend({
  options: {
    position: 'topright'
  },

  onAdd: map => {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom')

    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);

    container.onmouseover = e => {
      setDimensions(container, '100px');
    }

    container.onmouseout = e => {
      setDimensions(container, '30px');
    }

    container.style.backgroundColor = 'white';
    setDimensions(container, '30px');

    container.onclick = e => {
      console.log('buttonClicked');
    }

    return container;
  }
})