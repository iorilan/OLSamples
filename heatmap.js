      import ol from 'ol';
	  import Map from 'ol/Map.js';
      import View from 'ol/View.js';
	   import GeoJSON from 'ol/format/GeoJSON.js';
	   import ToPoJSON from 'ol/format/ToPoJSON.js';
      import KML from 'ol/format/KML.js';
      import {Heatmap as HeatmapLayer, Tile as TileLayer} from 'ol/layer.js';
      import Stamen from 'ol/source/Stamen.js';
      import VectorSource from 'ol/source/Vector.js';

      var blur = document.getElementById('blur');
      var radius = document.getElementById('radius');
	
	var hmurl = '/data/json/2012_Earthquakes_Mag5.geojson';
	
	var dummyobj = {
  "type": "FeatureCollection",
  "name": "Magnitude 5",
  "crs": {
    "type": "name",
    "properties": {
      "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
    }
  },
  "features": [
    {
      "type": "Feature",
      "properties": {
        "Name": "M 5.9 - 2012 Jan 15, SOUTH SHETLAND ISLANDS",
        "description": null
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -56.072,
          -60.975
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "Name": "M 5.9 - 2012 Jan 19, OFF W. COAST OF S. ISLAND, N.Z.",
        "description": null
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          165.778,
          -46.686
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "Name": "M 5.9 - 2012 Jan 28, KERMADEC ISLANDS, NEW ZEALAND",
        "description": null
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -177.386,
          -29.43
        ]
      }
    }
  ]
};
	// var vectorSource = new VectorSource({
	//	 format: new GeoJSON(),
	//	wrapX: false,
     //   features: (new GeoJSON()).readFeatures(dummyobj)
     // });
	  
      var vector = new HeatmapLayer({
         source: new VectorSource({
           url: 'data/json/2012_Earthquakes_Mag5.geojson',
           format: new GeoJSON()
         }),
		//source: vectorSource,
        blur: parseInt(blur.value, 10),
        radius: parseInt(radius.value, 10)
      });

      vector.getSource().on('addfeature', function(event) {
        // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
        // standards-violating <magnitude> tag in each Placemark.  We extract it from
        // the Placemark's name instead.
        var name = event.feature.get('name');
        var magnitude = parseFloat(name.substr(2));
        event.feature.set('weight', magnitude - 5);
      });

      var raster = new TileLayer({
        source: new Stamen({
          layer: 'toner'
        })
      });

      var map = new Map({
        layers: [raster, vector],
        target: 'map',
        view: new View({
          center: [0, 0],
          zoom: 2
        })
      });


      blur.addEventListener('input', function() {
        vector.setBlur(parseInt(blur.value, 10));
      });

      radius.addEventListener('input', function() {
        vector.setRadius(parseInt(radius.value, 10));
      });