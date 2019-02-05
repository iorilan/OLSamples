      import Map from 'ol/Map.js';
      import View from 'ol/View.js';
      import Point from 'ol/geom/Point.js';
      import Draw from 'ol/interaction/Draw.js';
      import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
      import {OSM, Vector as VectorSource} from 'ol/source.js';
      import {Icon, Stroke, Style} from 'ol/style.js';

      var raster = new TileLayer({
        source: new OSM()
      });

      var source = new VectorSource();

      var styleFunction = function(feature) {
        var geometry = feature.getGeometry();
        var styles = [
          // linestring
          new Style({
            stroke: new Stroke({
              color: '#ffcc33',
              width: 2
            })
          })
        ];

        geometry.forEachSegment(function(start, end) {
          var dx = end[0] - start[0];
          var dy = end[1] - start[1];
          var rotation = Math.atan2(dy, dx);
          // arrows
          styles.push(new Style({
            geometry: new Point(end),
            image: new Icon({
              src: '/data/arrow.png',
              anchor: [0.75, 0.5],
              rotateWithView: true,
              rotation: -rotation
            })
          }));
        });

        return styles;
      };
      var vector = new VectorLayer({
        source: source,
        style: styleFunction
      });

      var map = new Map({
        layers: [raster, vector],
        target: 'map',
        view: new View({
          center: [-11000000, 4600000],
          zoom: 4
        })
      });

      map.addInteraction(new Draw({
        source: source,
        type: 'LineString'
      }));