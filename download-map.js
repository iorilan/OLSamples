      import Map from 'ol/Map.js';
      import View from 'ol/View.js';
      import {defaults as defaultControls} from 'ol/control.js';
      import GeoJSON from 'ol/format/GeoJSON.js';
      import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
      import {OSM, Vector as VectorSource} from 'ol/source.js';

      var map = new Map({
        layers: [
          new TileLayer({
            source: new OSM()
          }),
          new VectorLayer({
            source: new VectorSource({
              url: 'data/geojson/countries.geojson',
              format: new GeoJSON()
            })
          })
        ],
        target: 'map',
        controls: defaultControls({
          attributionOptions: {
            collapsible: false
          }
        }),
        view: new View({
          center: [0, 0],
          zoom: 2
        })
      });

      document.getElementById('export-png').addEventListener('click', function() {
        map.once('rendercomplete', function(event) {
          var canvas = event.context.canvas;
          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
          } else {
            canvas.toBlob(function(blob) {
              saveAs(blob, 'map.png');
            });
          }
        });
        map.renderSync();
      });