      import Feature from 'ol/Feature.js';
      import Map from 'ol/Map.js';
      import View from 'ol/View.js';
      import Polyline from 'ol/format/Polyline.js';
      import Point from 'ol/geom/Point.js';
      import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
      import BingMaps from 'ol/source/BingMaps.js';
      import VectorSource from 'ol/source/Vector.js';
	  import GeoJSON from "ol/format/GeoJSON.js";
	  import MultiPoint from 'ol/geom/MultiPoint.js';
      import {Circle as CircleStyle, Fill, Icon, Stroke, Style} from 'ol/style.js';
	  
	  var geoJsonObj = {"type":"FeatureCollection","features":[
	  {"type":"Feature","geometry":{"type":"Point","coordinates":[-58.072,-58.975,0]},"properties":{"name":"M 5.9 - 2012 Jan 15, SOUTH SHETLAND ISLANDS"}}
	  ]};
	  for(var i = 0;i < 100; i++){
		var last = geoJsonObj.features[geoJsonObj.features.length - 1].geometry.coordinates;
		var c = [last[0]+1,last[1]+1];
		geoJsonObj.features.push({"type":"Feature","geometry":{"type":"Point","coordinates":c},"properties":{"name":""}});
	  }
	  var source = new VectorSource({
  features: (new GeoJSON()).readFeatures(geoJsonObj)
});
	var coords = [];
	var flist = []
	geoJsonObj.features.map(function(f){
		flist.push(f);
		  coords.push(f.geometry.coordinates);
	});
	
	
      // This long string is placed here due to jsFiddle limitations.
      // It is usually loaded with AJAX.

   
	
      var routeCoords = coords;
      var routeLength = routeCoords.length;

    
      var geoMarker = new Feature({
        type: 'geoMarker',
        geometry: new Point(routeCoords[0])
      });
      var startMarker = new Feature({
        type: 'icon',
        geometry: new Point(routeCoords[0])
      });
      var endMarker = new Feature({
        type: 'icon',
        geometry: new Point(routeCoords[routeLength - 1])
      });

      var styles = {
        'route': new Style({
          stroke: new Stroke({
            width: 6, color: [237, 212, 0, 0.8]
          })
        }),
        'icon': new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: 'data/icon.png'
          })
        }),
        'geoMarker': new Style({
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({color: 'black'}),
            stroke: new Stroke({
              color: 'white', width: 2
            })
          })
        })
      };

      var animating = false;
      var speed, now;
      var speedInput = document.getElementById('speed');
      var startButton = document.getElementById('start-animation');

      var vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: [geoMarker, startMarker, endMarker]
        }),
        style: function(feature) {
          // hide geoMarker if animation is active
          if (animating && feature.get('type') === 'geoMarker') {
            return null;
          }
          return styles[feature.get('type')];
        }
      });

      var center = [-58.072,-58.975,0];
      var map = new Map({
        target: document.getElementById('map'),
        loadTilesWhileAnimating: true,
        view: new View({
          center: center,
          zoom: 10,
          minZoom: 2,
          maxZoom: 19
        }),
        layers: [
          new TileLayer({
            source: new BingMaps({
              imagerySet: 'AerialWithLabels',
              key: 'Your Bing Maps Key from http://www.bingmapsportal.com/ here'
            })
          }),
          vectorLayer
        ]
      });

      var moveFeature = function(event) {
        var vectorContext = event.vectorContext;
        var frameState = event.frameState;

        if (animating) {
          var elapsedTime = frameState.time - now;
          // here the trick to increase speed is to jump some indexes
          // on lineString coordinates
          var index = Math.round(speed * elapsedTime / 10000);

          if (index >= routeLength) {
            stopAnimation(true);
            return;
          }

          var currentPoint = new Point(routeCoords[index]);
          var feature = new Feature(currentPoint);
          vectorContext.drawFeature(feature, styles.geoMarker);
        }
        // tell OpenLayers to continue the postcompose animation
        map.render();
      };

      function startAnimation() {
        if (animating) {
          stopAnimation(false);
        } else {
          animating = true;
          now = new Date().getTime();
          speed = speedInput.value;
          startButton.textContent = 'Cancel Animation';
          // hide geoMarker
          geoMarker.setStyle(null);
          // just in case you pan somewhere else
          map.getView().setCenter(center);
          map.on('postcompose', moveFeature);
          map.render();
        }
      }


      /**
       * @param {boolean} ended end of animation.
       */
      function stopAnimation(ended) {
        animating = false;
        startButton.textContent = 'Start Animation';

        // if animation cancelled set the marker at the beginning
        var coord = ended ? routeCoords[routeLength - 1] : routeCoords[0];
        /** @type {module:ol/geom/Point~Point} */ (geoMarker.getGeometry())
          .setCoordinates(coord);
        //remove listener
        map.un('postcompose', moveFeature);
      }

      startButton.addEventListener('click', startAnimation, false);