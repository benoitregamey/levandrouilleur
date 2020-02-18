// Initializing 2 basemaps --------------------------------------------------------------------------------------------------------------------------
var lightbasemap = L.tileLayer('https://api.maptiler.com/maps/positron/{z}/{x}/{y}.png?key=OeICOfldMgEZFl7CAgF2',{
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        attribution: '<a href="index.html" target="_blank">© Le Vandrouilleur |</a> <a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a>',
        crossOrigin: true
});

var topobasemap = L.tileLayer('https://api.maptiler.com/maps/topo/{z}/{x}/{y}.png?key=OeICOfldMgEZFl7CAgF2',{
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        attribution: '<a href="index.html" target="_blank">© Le Vandrouilleur |</a> <a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a>',
        crossOrigin: true
});

var map = L.map('map', {
	zoomControl: true,
	layers: lightbasemap,
    minZoom: 2,
    gestureHandling: true,
});

// Icons for the markers ----------------------------------------------------------------------------------------------------------------------------
var surficonRegio = L.icon({
    iconUrl: 'icon/map/marker-icon-surf.png',
    iconSize:     [19, 42], // original 19,42
    iconAnchor:   [8, 16], 
});

var skiiconRegio = L.icon({
    iconUrl: 'icon/map/marker-icon-ski.png',
    iconSize:     [22, 42], // original 22,42
    iconAnchor:   [11, 21], 
});

var climbiconRegio = L.icon({
    iconUrl: 'icon/map/marker-icon-climb.png',
    iconSize:     [13, 42], // original 13,42
    iconAnchor:   [7, 21], 
});

var rockiconSpot = L.icon({
    iconUrl: 'icon/map/marker-icon-spot-rock.png',
    iconSize:     [23,17], // original 34,25
    iconAnchor:   [11, 9], 
});

var rockiconSpotSelected = L.icon({
    iconUrl: 'icon/map/marker-icon-spot-rock.png',
    iconSize:     [34,25], // original 34,25
    iconAnchor:   [17, 12], 
});

var watericonSpot = L.icon({
    iconUrl: 'icon/map/marker-icon-spot-water.png',
    iconSize:     [21, 19], // original 32,28
    iconAnchor:   [10, 9], 
});

var watericonSpotSelected = L.icon({
    iconUrl: 'icon/map/marker-icon-spot-water.png',
    iconSize:     [32, 28], // original 32,28
    iconAnchor:   [16, 14], 
});

var lifestyleicon = L.icon({
    iconUrl: 'icon/map/marker-icon-lifestyle.png',
    iconSize:     [32, 15], // original 48,23
    iconAnchor:   [16, 7], 
});

var lifestyleiconSelected = L.icon({
    iconUrl: 'icon/map/marker-icon-lifestyle.png',
    iconSize:     [48, 23], // original 48,23
    iconAnchor:   [24, 11], 
});


// Initializing layers and data ---------------------------------------------------------------------------------------------------------------------
var regionLayer;
var regiondata;
var spotLayer;
var spotdata;
var selectLayer;
var selectLayerZoom;
var routeLayer;
var routedata;
var selectrouteLayer;

// Initializing regionLayer -------------------------------------------------------------------------------------------------------------------------
$.getJSON('data/region.geojson',function(data){
	regionLayer = L.geoJSON(data,{
    	pointToLayer: function (feature, latlng) {
    		switch (feature.properties.ACTIVITY){
    			case "1" : return L.marker(latlng, {icon: skiiconRegio});
    			case "2" : return L.marker(latlng, {icon: climbiconRegio});
    			case "3" : return L.marker(latlng, {icon: surficonRegio});
                case "4" : return L.marker(latlng, {icon: lifestyleicon});
    		}
    	},
        // Link to the map when a region is clicked
        onEachFeature: function(feature, layer){
            layer.on('click', function(){
                window.location.href = "/map?region=" + feature.properties.NAME.split(' ').join('-');
            });
        }
  	});

    map.fitBounds(regionLayer.getBounds());
	regionLayer.addTo(map);
    regiondata = data.features;
});

// function that reset original icon to the layers selectLayer and spotLayer
function resetOriginalIcon(){
    if (map.hasLayer(selectLayer)){
        selectLayer.eachLayer(function(originalIcon){
            if (originalIcon.feature.properties.ACTIVITY == "1" || originalIcon.feature.properties.ACTIVITY == "2"){
                originalIcon.setIcon(rockiconSpot);
            }
            if (originalIcon.feature.properties.ACTIVITY == "3"){
                originalIcon.setIcon(watericonSpot);
            }
            if (originalIcon.feature.properties.ACTIVITY == "4"){
                originalIcon.setIcon(lifestyleicon);
            }                            
        })
    }
    if (map.hasLayer(spotLayer)){
        spotLayer.eachLayer(function(originalIcon){
            if (originalIcon.feature.properties.ACTIVITY == "1" || originalIcon.feature.properties.ACTIVITY == "2"){
                originalIcon.setIcon(rockiconSpot);
            }
            if (originalIcon.feature.properties.ACTIVITY == "3"){
                originalIcon.setIcon(watericonSpot);
            }
            if (originalIcon.feature.properties.ACTIVITY == "4"){
                originalIcon.setIcon(lifestyleicon);
            }                            
        })
    }
}

function onSpotClick(feature,layer){
    layer.on('click', function(){
        window.location.href = "/map?spot=" + feature.properties.NAME.split(' ').join('-');       
    }); 
}

function onRouteClick(feature,layer){
    layer.on('click', function(){
        window.location.href = "/map?spot=" + feature.properties.SPOT_NAME.split(' ').join('-'); 
    });   
}

// Initializing spotLayer ---------------------------------------------------------------------------------------------------------------------------
$.getJSON('data/spot.geojson',function(data){
    spotLayer = L.geoJSON(data,{
        pointToLayer: function(feature, latlng){
            switch (feature.properties.ACTIVITY){
                case "1" : return L.marker(latlng, {icon: rockiconSpot});
                case "2" : return L.marker(latlng, {icon: rockiconSpot});
                case "3" : return L.marker(latlng, {icon: watericonSpot});
                case "4" : return L.marker(latlng, {icon: lifestyleicon});
            }
        },
        onEachFeature: onSpotClick
    });
    spotdata = data.features;
});

// Initializing routeLayer --------------------------------------------------------------------------------------------------------------------------
$.getJSON('data/route.geojson',function(data){
    routeLayer = L.geoJSON(data,{
        style : {"color":"#006699", "weigth":5, "opacity":0.6},
        onEachFeature : onRouteClick
    });
    routedata = data.features;
});

// Function to change basemap according to the zoomlevel --------------------------------------------------------------------------------------------
map.on('zoomend', function() {
    var zoomlevel = map.getZoom();
    if (zoomlevel > 11){
        if (map.hasLayer(lightbasemap)) {
            map.removeLayer(lightbasemap);
            map.addLayer(topobasemap);
        } 
    }
    if (zoomlevel <= 11){
        if (map.hasLayer(topobasemap)){
            map.removeLayer(topobasemap);
            map.addLayer(lightbasemap);
        }
    }
});

// Function to manage regionLayer, spotLayer and selectlayer according to the zoomlevel -------------------------------------------------------------
map.on('moveend', function() {
    var zoomlevel = map.getZoom();
    if (zoomlevel > 9){
        if (map.hasLayer(regionLayer)) {
            map.removeLayer(regionLayer);
            // check if layer already loaded from JSON
            if (spotLayer != undefined && map.hasLayer(selectLayer) == false && routeLayer != undefined){
                map.addLayer(spotLayer);
                map.addLayer(routeLayer);
            }          
        } 
    }

    if (map.hasLayer(selectLayer) == false){

        if (zoomlevel <= 9){

            resetOriginalIcon();

            if (map.hasLayer(spotLayer)){
                map.removeLayer(spotLayer);
                map.removeLayer(routeLayer);
                routeLayer.setStyle({"color":"#006699", "weigth":5, "opacity":0.6});
            }

            // check if layer already loaded from JSON
            if (regionLayer != undefined){
                map.addLayer(regionLayer);
            }
        }   
    }

    if (map.hasLayer(selectLayer)){
        if (zoomlevel < selectLayerZoom && zoomlevel <= 9){

            resetOriginalIcon();

            map.removeLayer(selectLayer);
            if (map.hasLayer(selectrouteLayer)){
                map.removeLayer(selectrouteLayer);
            }
            selectLayerZoom = undefined;

            // check if layer already loaded from JSON
            if (regionLayer != undefined){
                map.addLayer(regionLayer);
            }
        }  
    }
});

