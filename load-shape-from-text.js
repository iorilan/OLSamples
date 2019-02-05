      import Map from 'ol/Map.js';
      import View from 'ol/View.js';
      import WKT from 'ol/format/WKT.js';
      import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
      import {OSM, Vector as VectorSource} from 'ol/source.js';

      var raster = new TileLayer({
        source: new OSM()
      });

      var wkt = 'POLYGON((10.689 -25.092, 34.595 ' +
          '-20.170, 38.814 -35.639, 13.502 ' +
          '-39.155, 10.689 -25.092))';

      var format = new WKT();

      var feature = format.readFeature(wkt, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      });

      var vector = new VectorLayer({
        source: new VectorSource({
          features: [feature]
        })
      });

      var map = new Map({
        layers: [raster, vector],
        target: 'map',
        view: new View({
          center: [2952104.0199, -3277504.823],
          zoom: 4
        })
      });