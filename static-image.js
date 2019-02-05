 import Map from 'ol/Map.js';
      import View from 'ol/View.js';
      import {getCenter} from 'ol/extent.js';
      import ImageLayer from 'ol/layer/Image.js';
      import Projection from 'ol/proj/Projection.js';
      import Static from 'ol/source/ImageStatic.js';


      // Map views always need a projection.  Here we just want to map image
      // coordinates directly to map coordinates, so we create a projection that uses
      // the image extent in pixels.
      var extent = [0, 0, 1024, 968];
      var projection = new Projection({
        code: 'xkcd-image',
        units: 'pixels',
        extent: extent
      });

      var map = new Map({
        layers: [
          new ImageLayer({
            source: new Static({
              attributions: '© <a href="http://xkcd.com/license.html">xkcd</a>',
              url: 'https://imgs.xkcd.com/comics/online_communities.png',
              projection: projection,
              imageExtent: extent
            })
          })
        ],
        target: 'map',
        view: new View({
          projection: projection,
          center: getCenter(extent),
          zoom: 2,
          maxZoom: 8
        })
      });