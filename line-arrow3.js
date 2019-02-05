      import Map from 'ol/Map.js';
      import View from 'ol/View.js';
      import Point from 'ol/geom/Point.js';
      import Draw from 'ol/interaction/Draw.js';
	  import Feature from 'ol/Feature.js';
	  import LineString from 'ol/geom/LineString.js';
      import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
      import {OSM, Vector as VectorSource, Cluster} from 'ol/source.js';
      import {Icon, Stroke, Style, Circle, Fill, Text} from 'ol/style.js';
	  
var tileLayer = new TileLayer({
    source: new OSM()
});

var map = new Map({
    layers: [tileLayer],
    view: new View({
        center: [77.444504, 22.795357],
        zoom: 5
    }),
    target: 'map'
});

var features = new Array();
var coordinates = [[79.0900, 21.1500],[72.776714, 18.948932],[77.2090,28.6139],[85.1000,25.6000],[78.4800,17.3700]];

for (var i = 0; i < coordinates.length; ++i) {
    features[i] = new Feature(new Point(coordinates[i]));
}

var source = new VectorSource({
    features: features
});

var clusterSource = new Cluster({
    distance: 40,
    source: source
});

var styleCache = {};
var clusters = new VectorLayer({
    source: clusterSource,
    style: function (feature, resolution) {
        var size = feature.get('features').length;
		console.log("size of feature:"+size);
        var style = styleCache[size];
        if (!style) {
            style = [new Style({
                image: new Circle({
                    radius: 10,
                    stroke: new Stroke({
                        color: '#fff'
                    }),
                    fill: new Fill({
                        color: '#3399CC'
                    })
                }),
                text: new Text({
                    text: size.toString(),
                    fill: new Fill({
                        color: '#fff'
                    })
                })
            })];
            styleCache[size] = style;
        }
        return style;
    }
});

map.addLayer(clusters);

var vectorLine = new VectorSource({});

for (var i = 1; i < coordinates.length; i++) {
    var startPoint 	= coordinates[i-1];
    var endPoint 	= coordinates[i];
	var dx 			= endPoint[0] - startPoint[0];
    var dy 			= endPoint[1] - startPoint[1];
    var rotation 	= Math.atan2(dy, dx);
	
    var lineArray 	= [startPoint, endPoint];
    var featureLine = new Feature({
        geometry: new LineString(lineArray)
    });

    var lineStyle 	= new Style({
        stroke: new Stroke({
            color: '#ffcc33',
            width: 2
        })
    });
    featureLine.setStyle(lineStyle);
    vectorLine.addFeature(featureLine);
    
    var iconStyle 	= new Style({
        image: new Icon({
              src: 'arrow.png',
              anchor: [0.75, 0.5],
              rotateWithView: true,
              rotation: -rotation
            })
    });
    var iconFeature = new Feature({
        geometry: new Point(endPoint)
    });
    iconFeature.setStyle(iconStyle);
    vectorLine.addFeature(iconFeature);
}
var vectorLayer	= new VectorLayer({
    source: vectorLine
});
map.addLayer(vectorLayer);