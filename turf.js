  import Map from 'ol/Map.js';
      import View from 'ol/View.js';
      import GeoJSON from 'ol/format/GeoJSON.js';
      import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
      import {fromLonLat} from 'ol/proj.js';
      import {OSM, Vector as VectorSource} from 'ol/source.js';


      var source = new VectorSource();
      fetch('data/geojson/roads-seoul.geojson').then(function(response) {
        return response.json();
      }).then(function(json) {
        var format = new GeoJSON();
        var features = format.readFeatures(json);
        var street = features[0];

        // convert to a turf.js feature
        var turfLine = format.writeFeatureObject(street);

        // show a marker every 200 meters
        var distance = 0.2;

        // get the line length in kilometers
        var length = turf.lineDistance(turfLine, 'kilometers');
        for (var i = 1; i <= length / distance; i++) {
          var turfPoint = turf.along(turfLine, i * distance, 'kilometers');

          // convert the generated point to a OpenLayers feature
          var marker = format.readFeature(turfPoint);
          marker.getGeometry().transform('EPSG:4326', 'EPSG:3857');
          source.addFeature(marker);
        }

        street.getGeometry().transform('EPSG:4326', 'EPSG:3857');
        source.addFeature(street);
      });
      var vectorLayer = new VectorLayer({
        source: source
      });

      var rasterLayer = new TileLayer({
        source: new OSM()
      });

      var map = new Map({
        layers: [rasterLayer, vectorLayer],
        target: document.getElementById('map'),
        view: new View({
          center: fromLonLat([126.980366, 37.526540]),
          zoom: 15
        })
      });