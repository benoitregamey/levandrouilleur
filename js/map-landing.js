// Initializing 2 basemaps --------------------------------------------------------------------------------------------------------------------------
var lightbasemap = L.tileLayer('https://api.maptiler.com/maps/positron/{z}/{x}/{y}.png?key=OeICOfldMgEZFl7CAgF2',{
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        attribution: '<a href="https://levandrouilleur.com" target="_blank">© Le Vandrouilleur |</a> <a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a>',
        crossOrigin: true
});

var topobasemap = L.tileLayer('https://api.maptiler.com/maps/topo/{z}/{x}/{y}.png?key=OeICOfldMgEZFl7CAgF2',{
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        attribution: '<a href="https://levandrouilleur.com" target="_blank">© Le Vandrouilleur |</a> <a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a>',
        crossOrigin: true
});

var map = L.map('map', {
	zoomControl: true,
	layers: lightbasemap,
    minZoom: 2,
    gestureHandling: true,
    zoomSnap: 0.1,
    wheelPxPerZoomLevel: 14,
});

// Icons for the markers ----------------------------------------------------------------------------------------------------------------------------
var climbiconSpot = L.icon({
    iconUrl: 'icon/map/marker-icon-climb.png',
    iconSize:     [12, 38], // original 13,42
    iconAnchor:   [7, 21], 
});

var climbiconSpotSelected = L.icon({
    iconUrl: 'icon/map/marker-icon-climb.png',
    iconSize:     [13, 42], // original 13,42
    iconAnchor:   [7, 21], 
});

var skiiconSpot = L.icon({
    iconUrl: 'icon/map/marker-icon-spot-rock.png',
    iconSize:     [23,17], // original 34,25
    iconAnchor:   [11, 9], 
});

var skiiconSpotSelected = L.icon({
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
var spotLayer;
var spotdata;
var routeLayer;
var routedata;
var selectrouteLayer;
var previousZoom;

// Initializing spotLayer ---------------------------------------------------------------------------------------------------------------------------
$.getJSON('data/spot.geojson',function(data){
    spotLayer = L.markerClusterGroup({
        showCoverageOnHover: false,
    });
    spotLayer.addLayer(L.geoJSON(data,{
        pointToLayer: function(feature, latlng){
            switch (feature.properties.ACTIVITY){
                case "1" : return L.marker(latlng, {icon: skiiconSpot});
                case "2" : return L.marker(latlng, {icon: climbiconSpot});
                case "3" : return L.marker(latlng, {icon: watericonSpot});
                case "4" : return L.marker(latlng, {icon: lifestyleicon});
            }
        },
        onEachFeature: onSpotClick
    }));

    spotdata = data.features;

    var sortedBydate = [];
    for (var i = 0; i < spotdata.length; i++){
        sortedBydate.push({index:i, date:new Date(spotdata[i].properties.DATE)});
    }
    sortedBydate.sort((a, b) => b.date - a.date);
    map.setView([spotdata[sortedBydate[0].index].geometry.coordinates[1],spotdata[sortedBydate[0].index].geometry.coordinates[0]],5);
    spotLayer.addTo(map);
});

// function that reset original icon to the spotLayer
function resetOriginalIcon(){
    if (map.hasLayer(spotLayer)){
        spotLayer.eachLayer(function(originalIcon){
            if (originalIcon.feature.properties.ACTIVITY == "1"){
                originalIcon.setIcon(skiiconSpot);
            }
            if (originalIcon.feature.properties.ACTIVITY == "2"){
                originalIcon.setIcon(climbiconSpot);
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

// Function to manage routelayer according to the zoomlevel -------------------------------------------------------------
map.on('moveend', function() {
    var zoomlevel = map.getZoom();
    if (zoomlevel > 11){
        if (map.hasLayer(routeLayer) == false && routeLayer != undefined) {
            map.addLayer(routeLayer);
        }       
    }
    if (zoomlevel <= 11){
        if (map.hasLayer(routeLayer)) {
            map.removeLayer(routeLayer);
        } 
    }
});

