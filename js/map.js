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
	zoomControl: false,
	layers: lightbasemap,
    minZoom: 2,
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

// function that update URL with the parameters region, spot, lat, lng, zoom. If one of the following are set to 'unchanged', take the existing 
// ones (if they exist) or ignore them, If one of the following are set to 'undefined', force to erase them even if thex exist.
// URL strucutre : ../map.html?region=xxxx&spot=xxxx&lat=xxxx&lng=xxxx&zoom=xxxx 
function updateUrlParameters(url,region,spot,lat,lng,zoom){
    var results = {
        'region' : undefined,
        'spot' : undefined,
        'lat' : undefined,
        'lng' : undefined,
        'zoom' : undefined
    };
    if (url.split('?')[1] != undefined){
        var urloptions = url.split('?')[1].split('&');
        var i;
        for (i = 0; i < urloptions.length; i++){
            if (urloptions[i].split('=')[0] == 'region'){
                results['region'] = urloptions[i].split('=')[1];
            }
            if (urloptions[i].split('=')[0] == 'spot'){
                results['spot'] = urloptions[i].split('=')[1];
            }
            if (urloptions[i].split('=')[0] == 'lat'){
                results['lat'] = urloptions[i].split('=')[1];
            }
            if (urloptions[i].split('=')[0] == 'lng'){
                results['lng'] = urloptions[i].split('=')[1];
            }
            if (urloptions[i].split('=')[0] == 'zoom'){
                results['zoom'] = urloptions[i].split('=')[1];
            }
        }
    }

    if (region != 'unchanged'){
        results['region'] = region;
    }
    if (spot != 'unchanged'){
        results['spot'] = spot;
    } 
    if (lat != 'unchanged'){
        results['lat'] = lat;
    }
    if (lng != 'unchanged'){
        results['lng'] = lng;
    }
    if (zoom != 'unchanged'){
        results['zoom'] = zoom;
    }  

    var newurl = window.location.href.split('?')[0].concat('?');
    if (results['region'] != undefined){
        newurl = newurl.concat('region=').concat(results['region']).concat('&');
    }
    if (results['spot'] != undefined){
        newurl = newurl.concat('spot=').concat(results['spot']).concat('&');
    }
    if (results['lat'] != undefined){
        newurl = newurl.concat('lat=').concat(results['lat']).concat('&');
    }
    if (results['lng'] != undefined){
        newurl = newurl.concat('lng=').concat(results['lng']).concat('&');
    }
    if (results['zoom'] != undefined){
        newurl = newurl.concat('zoom=').concat(results['zoom']);
    }

    history.replaceState({id:'mappage'},'Le Vandrouilleur - Map',newurl);
}

// function that returns current URL parameters region, spot, lat, lng, zoom -----------------------------------------------------------------------
function getUrlParameters(url){
    var results = {
        'region' : undefined,
        'spot' : undefined,
        'lat' : undefined,
        'lng' : undefined,
        'zoom' : undefined
    };

    url = window.decodeURI(url);

    if (url.split('?')[1] != undefined){
        var urloptions = url.split('?')[1].split('&');
        var i;
        for (i = 0; i < urloptions.length; i++){
            if (urloptions[i].split('=')[0] == 'region'){
                results['region'] = urloptions[i].split('=')[1];
            }
            if (urloptions[i].split('=')[0] == 'spot'){
                results['spot'] = urloptions[i].split('=')[1];
            }
            if (urloptions[i].split('=')[0] == 'lat'){
                results['lat'] = urloptions[i].split('=')[1];
            }
            if (urloptions[i].split('=')[0] == 'lng'){
                results['lng'] = urloptions[i].split('=')[1];
            }
            if (urloptions[i].split('=')[0] == 'zoom'){
                results['zoom'] = urloptions[i].split('=')[1];
            }
        }
    }
    return results;
}

// function that loads the regions available in data into the sidebar, load all regions -------------------------------------------------------------
function loadRegionSidebar(data){

    $(".sidebar").empty();

    var sortedBydate = [];
    for (var i = 0; i < data.length; i++){
        sortedBydate.push({index:i, date:new Date(data[i].properties.DATE)});
    }
    sortedBydate.sort((a, b) => b.date - a.date);

    for (var i = 0; i < sortedBydate.length; i++){

        var htmlstring = "";
        var index = sortedBydate[i].index;
        var date = data[index].properties.DATE.split("/")[2] + '.' + data[index].properties.DATE.split("/")[1] + '.' + data[index].properties.DATE.split("/")[0];

        htmlstring += '<div class="row sidebar-row mx-0 align-items-center">';

        if (data[index].properties.ACTIVITY == "1"){
            htmlstring += '<div class="col-3 px-0 pl-2"><img src="icon/map/sidebar-icon-ski.png" class="sidebar-icon mx-auto d-block"></div>';
        }
        if (data[index].properties.ACTIVITY == "2"){
            htmlstring += '<div class="col-3 px-0 pl-2"><img src="icon/map/sidebar-icon-climb.png" class="sidebar-icon mx-auto d-block"></div>';
        }
        if (data[index].properties.ACTIVITY == "3"){
            htmlstring += '<div class="col-3 px-0 pl-2"><img src="icon/map/sidebar-icon-surf.png" class="sidebar-icon mx-auto d-block"></div>';
        }
        if (data[index].properties.ACTIVITY == "4"){
            htmlstring += '<div class="col-3 px-0 pl-2"><img src="icon/map/sidebar-icon-lifestyle.png" class="sidebar-icon mx-auto d-block"></div>';
        }

        htmlstring += '<div class="col-9 py-2 px-2">';
        htmlstring += '<h6 class="mb-0 pt-1">' + data[index].properties.NAME + '<br></h6>';

        if (data[index].properties.ACTIVITY == "1"){
            htmlstring += '<p class="p small mb-1 text-light-grey">Ski &bull; ' + data[index].properties.LAND + ' &bull; ' + date + '<br></p>';
        }
        if (data[index].properties.ACTIVITY == "2"){
            htmlstring += '<p class="p small mb-1 text-light-grey">Climbing &bull; ' + data[index].properties.LAND + ' &bull; ' + date + '<br></p>';
        }
        if (data[index].properties.ACTIVITY == "3"){
            htmlstring += '<p class="p small mb-1 text-light-grey">Surf &bull; ' + data[index].properties.LAND + ' &bull; ' + date + '<br></p>';
        }
        if (data[index].properties.ACTIVITY == "4"){
            htmlstring += '<p class="p small mb-1 text-light-grey">Vanlife &bull; ' + data[index].properties.LAND + ' &bull; ' + date + '<br></p>';
        }              
        htmlstring += '<p class="p small mb-0 pb-1 line-height-110 text-dark">' + data[index].properties.LEAD_TEXT + '</p>';
        htmlstring += '</div>';
        htmlstring += '</div>';
        $(".sidebar").append(htmlstring);
    }
    $("#activity-count").html(sortedBydate.length);
    $("#back-arrow-button").empty();
}

// function that loads the spots available in data into the sidebar, possibility to filter by region ------------------------------------------------
// Loads only the spots that are on the current map extent !
function loadSpotSidebar(data,region){

    $(".sidebar").empty();

    var sortedBydate = [];
    for (var i = 0; i < data.length; i++){
        var lat = data[i].geometry.coordinates[1];
        var lng = data[i].geometry.coordinates[0];

        if (region!= undefined){
            if (data[i].properties.REGION_NAME == region){
                sortedBydate.push({index:i, date:new Date(data[i].properties.DATE)});
            }
        }
        else{
            if (lng >= map.getBounds().getWest() && lng <= map.getBounds().getEast() && lat >= map.getBounds().getSouth() && lat <= map.getBounds().getNorth()){
                sortedBydate.push({index:i, date:new Date(data[i].properties.DATE)});
            }
        }
    }
    sortedBydate.sort((a, b) => b.date - a.date);

    for (var i = 0; i < sortedBydate.length; i++){

        var htmlstring = "";
        var index = sortedBydate[i].index;
        var date = data[index].properties.DATE.split("/")[2] + '.' + data[index].properties.DATE.split("/")[1] + '.' + data[index].properties.DATE.split("/")[0];

        htmlstring += '<div class="row sidebar-row mx-0 align-items-center">';

        if (data[index].properties.ACTIVITY == "1" || data[index].properties.ACTIVITY == "2"){
            htmlstring += '<div class="col-3 px-0 pl-2"><img src="icon/map/sidebar-icon-spot-rock.png" class="sidebar-icon mx-auto d-block"></div>';
        }
        if (data[index].properties.ACTIVITY == "3"){
            htmlstring += '<div class="col-3 px-0 pl-2"><img src="icon/map/sidebar-icon-spot-water.png" class="sidebar-icon mx-auto d-block"></div>';
        }
        if (data[index].properties.ACTIVITY == "4"){
            htmlstring += '<div class="col-3 px-0 pl-2"><img src="icon/map/sidebar-icon-lifestyle.png" class="sidebar-icon mx-auto d-block"></div>';
        }

        htmlstring += '<div class="col-9 py-2 px-2">';
        htmlstring += '<h6 class="mb-0 pt-1">' + data[index].properties.NAME + '<br></h6>';

        if (data[index].properties.ACTIVITY == "1"){
            htmlstring += '<p class="p small mb-1 text-light-grey">Ski &bull; ' + date + '<br></p>';
        }
        if (data[index].properties.ACTIVITY == "2"){
            htmlstring += '<p class="p small mb-1 text-light-grey">Climbing &bull; ' + date + '<br></p>';
        }
        if (data[index].properties.ACTIVITY == "3"){
            htmlstring += '<p class="p small mb-1 text-light-grey">Surf &bull; ' + date + '<br></p>';
        }
        if (data[index].properties.ACTIVITY == "4"){
            htmlstring += '<p class="p small mb-1 text-light-grey">Vanlife &bull; ' + date + '<br></p>';
        } 
        htmlstring += '<p class="p small mb-0 pb-1 line-height-110 text-dark">' + data[index].properties.LEAD_TEXT + '</p>';
        htmlstring += '</div>';
        htmlstring += '</div>';
        $(".sidebar").append(htmlstring);
    }
    $("#activity-count").html(sortedBydate.length);
    $("#back-arrow-button").html('<i class="fas fa-angle-double-left fa-lg"></i>');
}

// function that loads the selected spot into the sidebar with embbed instagram post ----------------------------------------------------------------
function loadSelectedSpotSidebar(data,spot){

    $(".sidebar").empty();

    var index;
    for (var i = 0; i < data.length; i++){
        if (data[i].properties.NAME == spot){
            index = i;
        }
    }

    var htmlstring = "";
    var date = data[index].properties.DATE.split("/")[2] + '.' + data[index].properties.DATE.split("/")[1] + '.' + data[index].properties.DATE.split("/")[0];

    htmlstring += '<div class="row mx-0 sidebar-row-spot">';
    htmlstring += '<div class="col">';
    htmlstring += '<h6 class="mb-0 pt-3 font-weight-bold text-info">' + data[index].properties.NAME + '<br></h6>';

    if (data[index].properties.ACTIVITY == "1"){
        htmlstring += '<p class="p  mb-1 text-light-grey">Ski &bull; ' + date + '<br></p>';
    }
    if (data[index].properties.ACTIVITY == "2"){
        htmlstring += '<p class="p  mb-1 text-light-grey">Climbing &bull; ' + date + '<br></p>';
    }
    if (data[index].properties.ACTIVITY == "3"){
        htmlstring += '<p class="p  mb-1 text-light-grey">Surf &bull; ' + date + '<br></p>';
    }
    if (data[index].properties.ACTIVITY == "4"){
        htmlstring += '<p class="p  mb-1 text-light-grey">Vanlife &bull; ' + date + '<br></p>';
    }   

    htmlstring += '<p class="p mb-3 line-height-110 text-dark">' + data[index].properties.LEAD_TEXT + '</p>';
    htmlstring += '</div>';
    htmlstring += '</div>';
    $(".sidebar").append(htmlstring);

    if (data[index].properties.INSTA_POST_ID != null){
        var instapost;
        var request = new XMLHttpRequest();
        request.open('GET', 'https://api.instagram.com/oembed/?url=https://www.instagram.com/p/' + data[index].properties.INSTA_POST_ID + '/&omitscript=true', true);
        request.onload = function() {
            instapost = JSON.parse(this.response).html;
            $(".sidebar").append(instapost);
            instgrm.Embeds.process();
        }
        request.send();     
    }

    $("#activity-count").html(' <font color="red">1</font> ');
    $("#back-arrow-button").html('<i class="fas fa-angle-double-left fa-lg"></i>');
}

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
        // Create a Selection Layer while clicking on a region (only with spots from the clicked region)
        onEachFeature: function(feature, layer){
            layer.on('click', function(){
                if(spotdata != undefined){
                    if(map.hasLayer(selectLayer)){
                        map.removeLayer(selectLayer);
                    }
                    selectLayer = L.geoJSON(spotdata,{
                        pointToLayer: function(feature, latlng){
                            switch (feature.properties.ACTIVITY){
                                case "1" : return L.marker(latlng, {icon: rockiconSpot});
                                case "2" : return L.marker(latlng, {icon: rockiconSpot});
                                case "3" : return L.marker(latlng, {icon: watericonSpot});
                                case "4" : return L.marker(latlng, {icon: lifestyleicon});
                            }
                        },
                        filter: function(spotfeature,layer){
                            return spotfeature.properties.REGION_NAME == feature.properties.NAME;
                        },
                        onEachFeature : onSpotClick
                    });
                    map.removeLayer(regionLayer);
                    map.addLayer(selectLayer);
                    // if the region clicked is a ski region, add a selection layer with the ski routes
                    if (feature.properties.ACTIVITY == "1"){
                        if (routedata != undefined){
                            if(map.hasLayer(selectrouteLayer)){
                                map.removeLayer(selectrouteLayer);
                            }
                            selectrouteLayer = L.geoJSON(routedata,{
                                filter: function(routefeature,layer){
                                    return routefeature.properties.REGION_NAME == feature.properties.NAME;
                                },
                                style: {"color":"#006699", "weigth":5, "opacity":0.7},
                                onEachFeature : onRouteClick                         
                            });
                            map.addLayer(selectrouteLayer);                     
                        }
                    }
                    if (map.hasLayer(selectrouteLayer) == true){
                        map.fitBounds(selectrouteLayer.getBounds());
                        setTimeout(function(){
                            selectLayerZoom = map.getZoom();
                        }, 300);                       
                    }else{
                        map.fitBounds(selectLayer.getBounds());
                        setTimeout(function(){
                            selectLayerZoom = map.getZoom();
                        }, 300);
                    }
                    // update url with the selected region, change space with '-'
                    updateUrlParameters(window.location.href,feature.properties.NAME.split(' ').join('-'),'unchanged','unchanged','unchanged','unchanged');

                    // Load spots into the sidebar according to the region selected
                    loadSpotSidebar(spotdata, feature.properties.NAME);
                }
            });
        }
  	});

    regiondata = data.features;

    // Load the regionLayer to the map only if no region and no spot is selected
    if (getUrlParameters(window.location.href).region == undefined && getUrlParameters(window.location.href).spot == undefined){
        // If lat,lng,zoom are set in the URL, use these information to set the map view. If not use the bounding box of the regionLayer
        if (getUrlParameters(window.location.href).lat != undefined && getUrlParameters(window.location.href).lng != undefined && getUrlParameters(window.location.href).zoom != undefined){
            if (parseInt(getUrlParameters(window.location.href).zoom) > 11){
                if (map.hasLayer(lightbasemap)) {
                    map.removeLayer(lightbasemap);
                    map.addLayer(topobasemap);
                }
            }
            map.setView([getUrlParameters(window.location.href).lat,getUrlParameters(window.location.href).lng], getUrlParameters(window.location.href).zoom);
        }
        else{
    	   map.fitBounds(regionLayer.getBounds());
        }
    	regionLayer.addTo(map);

        loadRegionSidebar(data.features);
    }
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

        resetOriginalIcon();

        if (feature.properties.ACTIVITY == "1"){
            layer.setIcon(rockiconSpotSelected);

            if (map.hasLayer(routeLayer)){
                routeLayer.setStyle({"color":"#006699", "weigth":5, "opacity":0.6});
                routeLayer.eachLayer(function(route){
                    if (route.feature.properties.SPOT_NAME == feature.properties.NAME){
                        route.setStyle({"color":"#006699", "weigth":5, "opacity":1});
                        map.fitBounds(route.getBounds());
                    }
                });
            }
            if (map.hasLayer(selectrouteLayer)){
                selectrouteLayer.setStyle({"color":"#006699", "weigth":5, "opacity":0.6});
                selectrouteLayer.eachLayer(function(route){
                    if (route.feature.properties.SPOT_NAME == feature.properties.NAME){
                        route.setStyle({"color":"#006699", "weigth":5, "opacity":1});
                        map.fitBounds(route.getBounds());
                    }
                });
            }
        }

        if (feature.properties.ACTIVITY == "2"){
            layer.setIcon(rockiconSpotSelected);
            map.setView([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],14);
        }

        if (feature.properties.ACTIVITY == "3"){
            layer.setIcon(watericonSpotSelected);
            map.setView([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],14);                 
        }

        if (feature.properties.ACTIVITY == "4"){
            layer.setIcon(lifestyleiconSelected);
            map.setView([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],14);                   
        }

        // Load spot into the sidebar
        loadSelectedSpotSidebar(spotdata, feature.properties.NAME);

        // update URL with selected spot, replace space with '-'
        updateUrlParameters(window.location.href,'unchanged',feature.properties.NAME.split(' ').join('-'),'unchanged','unchanged','unchanged'); 

        // If sidebar is collapsed, expand it
        if ($(".menu-button").hasClass("collapsed")){
            expandSidebar();
        }
        
    }); 
}

function onRouteClick(feature,layer){
    layer.on('click', function(){

        resetOriginalIcon();

        if (map.hasLayer(routeLayer)){
            routeLayer.setStyle({"color":"#006699", "weigth":5, "opacity":0.6});
            layer.setStyle({"color":"#006699", "weigth":5, "opacity":1});
            spotLayer.eachLayer(function(spot){
                if (spot.feature.properties.NAME == feature.properties.SPOT_NAME){
                    spot.setIcon(rockiconSpotSelected);
                }
            });
        }
        if (map.hasLayer(selectrouteLayer)){
            selectrouteLayer.setStyle({"color":"#006699", "weigth":5, "opacity":0.6});
            layer.setStyle({"color":"#006699", "weigth":5, "opacity":1});
            selectLayer.eachLayer(function(spot){
                if (spot.feature.properties.NAME == feature.properties.SPOT_NAME){
                    spot.setIcon(rockiconSpotSelected);
                }
            });
        }
        map.fitBounds(layer.getBounds());

        // Load spot into the sidebar
        loadSelectedSpotSidebar(spotdata, feature.properties.SPOT_NAME);        

        // update URL with selected spot, replace space with '-'
        updateUrlParameters(window.location.href,'unchanged',feature.properties.SPOT_NAME.split(' ').join('-'),'unchanged','unchanged','unchanged');

        // If sidebar is collapsed, expand it
        if ($(".menu-button").hasClass("collapsed")){
            expandSidebar();
        }
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

    // if region is set in the URL -> create a SelectLayer, if spot is set, set the selected icon
    if (getUrlParameters(window.location.href).region != undefined){
        selectLayer = L.geoJSON(data,{
            pointToLayer: function(feature, latlng){
                switch (feature.properties.ACTIVITY){
                    case "1" : return L.marker(latlng, {icon: rockiconSpot});
                    case "2" : return L.marker(latlng, {icon: rockiconSpot});
                    case "3" : return L.marker(latlng, {icon: watericonSpot});
                    case "4" : return L.marker(latlng, {icon: lifestyleicon});                    
                }
            },
            filter: function(feature,layer){
                return feature.properties.REGION_NAME == getUrlParameters(window.location.href).region.split('-').join(' ');
            },
            onEachFeature : onSpotClick
        });

        if (regionLayer != undefined){
            map.removeLayer(regionLayer);
        }
        map.addLayer(selectLayer);

        // if ACTIVITY is not 1 (ski) zoom to the SelectLayer's bounds. If spot is set, zoom to the spot
        if (spotdata.filter(function(item){return item.properties.REGION_NAME == getUrlParameters(window.location.href).region.split('-').join(' ')})[0].properties.ACTIVITY != "1"){
            selectLayerZoom = map.getBoundsZoom(selectLayer.getBounds());
            if (getUrlParameters(window.location.href).spot == undefined){
                if (map.getBoundsZoom(selectLayer.getBounds()) > 11){
                    map.removeLayer(lightbasemap);
                    map.addLayer(topobasemap);
                }
                map.fitBounds(selectLayer.getBounds());
            }
            else{
                selectLayer.eachLayer(function(layer){
                    if (layer.feature.properties.NAME == getUrlParameters(window.location.href).spot.split('-').join(' ')){
                        map.removeLayer(lightbasemap);
                        map.addLayer(topobasemap);
                        map.setView([layer.feature.geometry.coordinates[1],layer.feature.geometry.coordinates[0]],14);
                    }
                });                
            }     
        }

        if (getUrlParameters(window.location.href).spot != undefined){
            selectLayer.eachLayer(function(spot){
                if (spot.feature.properties.NAME == getUrlParameters(window.location.href).spot.split('-').join(' ')){
                    switch (spot.feature.properties.ACTIVITY){
                        case "1" : return spot.setIcon(rockiconSpotSelected);
                        case "2" : return spot.setIcon(rockiconSpotSelected);
                        case "3" : return spot.setIcon(watericonSpotSelected);
                        case "4" : return spot.setIcon(lifestyleiconSelected);
                    }                    
                }
            });
            // If spot is selected, load selected spot into the sidebar
            loadSelectedSpotSidebar(data.features,getUrlParameters(window.location.href).spot.split('-').join(' '));
        }
        // If no spot is selected, load spots into the sidebar according to the region selected
        else{
            loadSpotSidebar(data.features,getUrlParameters(window.location.href).region.split('-').join(' '));
        }
    }

    // if spot is set in the URL but no Region, set style for the selected and zoom on it
    if (getUrlParameters(window.location.href).spot != undefined && getUrlParameters(window.location.href).region == undefined){
        map.addLayer(spotLayer);
        spotLayer.eachLayer(function(spot){
            if (spot.feature.properties.NAME == getUrlParameters(window.location.href).spot.split('-').join(' ')){
                // Zoom to the seleceted Spot. If the Acvivity is ski do not zoom. Will be done by the routeLayer
                if (spot.feature.properties.ACTIVITY != "1"){
                    map.removeLayer(lightbasemap);
                    map.addLayer(topobasemap);
                    map.setView([spot.feature.geometry.coordinates[1],spot.feature.geometry.coordinates[0]],14);
                } 
                switch (spot.feature.properties.ACTIVITY){
                    case "1" : return spot.setIcon(rockiconSpotSelected);
                    case "2" : return spot.setIcon(rockiconSpotSelected);
                    case "3" : return spot.setIcon(watericonSpotSelected);
                    case "4" : return spot.setIcon(lifestyleiconSelected);
                } 
            }
        });

        // Load the selected spot into the sidebar
        loadSelectedSpotSidebar(data.features,getUrlParameters(window.location.href).spot.split('-').join(' '));

        if (regionLayer != undefined){
            map.removeLayer(regionLayer);
        }    
    }

    // if the zoomlevel is set in the URL and if it is greater than 9, add spotLayer to the map
    if (getUrlParameters(window.location.href).zoom != undefined && getUrlParameters(window.location.href).region == undefined && getUrlParameters(window.location.href).spot == undefined){
        if (parseInt(getUrlParameters(window.location.href).zoom) > 9){
            if (regionLayer != undefined){
                map.removeLayer(regionLayer);
            }
            map.addLayer(spotLayer);
            // Load spot into the sidebar
            loadSpotSidebar(data.features);
        }
    }
});

// Initializing routeLayer --------------------------------------------------------------------------------------------------------------------------
$.getJSON('data/route.geojson',function(data){
    routeLayer = L.geoJSON(data,{
        style : {"color":"#006699", "weigth":5, "opacity":0.6},
        onEachFeature : onRouteClick
    });
    routedata = data.features;

    // if region is set in the URL -> create a selectrouteLayer, if spot is set, set the selected style
    if (getUrlParameters(window.location.href).region != undefined){
        if (routedata.filter(function(item){return item.properties.REGION_NAME == getUrlParameters(window.location.href).region.split('-').join(' ')}).length > 0){
            selectrouteLayer = L.geoJSON(data,{
                style : {"color":"#006699", "weigth":5, "opacity":0.6},
                onEachFeature : onRouteClick,
                filter: function(feature,layer){
                    return feature.properties.REGION_NAME == getUrlParameters(window.location.href).region.split('-').join(' ');
                }
            });
            if (getUrlParameters(window.location.href).spot != undefined){
                selectrouteLayer.eachLayer(function(route){
                    if (route.feature.properties.SPOT_NAME == getUrlParameters(window.location.href).spot.split('-').join(' ')){
                        route.setStyle({"color":"#006699", "weigth":5, "opacity":1});
                        if (map.getBoundsZoom(route.getBounds()) > 11){
                            map.removeLayer(lightbasemap);
                            map.addLayer(topobasemap);
                        }
                        map.fitBounds(route.getBounds());
                    }
                });
            }

            selectLayerZoom = map.getBoundsZoom(selectrouteLayer.getBounds());

            if (getUrlParameters(window.location.href).spot == undefined){
                if (map.getBoundsZoom(selectrouteLayer.getBounds()) > 11){
                    map.removeLayer(lightbasemap);
                    map.addLayer(topobasemap);
                }
                map.fitBounds(selectrouteLayer.getBounds());
            }

            if (regionLayer != undefined){
                map.removeLayer(regionLayer);
            }
            map.addLayer(selectrouteLayer);
        }
    }

    // if spot is set in the URL but no Region, set style for the selected and zoom on it
    if (getUrlParameters(window.location.href).spot != undefined && getUrlParameters(window.location.href).region == undefined){
        if (routedata.filter(function(item){return item.properties.SPOT_NAME == getUrlParameters(window.location.href).spot.split('-').join(' ')}).length > 0){
            routeLayer.eachLayer(function(route){
                if (route.feature.properties.SPOT_NAME == getUrlParameters(window.location.href).spot.split('-').join(' ')){
                    route.setStyle({"color":"#006699", "weigth":5, "opacity":1});
                    if (map.getBoundsZoom(route.getBounds()) > 11){
                        map.removeLayer(lightbasemap);
                        map.addLayer(topobasemap);
                    }
                    map.fitBounds(route.getBounds());
                }
            });
        }
        if (regionLayer != undefined){
            map.removeLayer(regionLayer);
        }
        map.addLayer(routeLayer);
    }

    // if the zoomlevel is set in the URL and if it is greater than 9, add spotLayer to the map
    if (getUrlParameters(window.location.href).zoom != undefined && getUrlParameters(window.location.href).region == undefined && getUrlParameters(window.location.href).spot == undefined){
        if (parseInt(getUrlParameters(window.location.href).zoom) > 9){
            if (regionLayer != undefined){
                map.removeLayer(regionLayer);
            }
            map.addLayer(routeLayer);
        }
    }
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
        if (spotdata != undefined){
            if (getUrlParameters(window.location.href).spot == undefined){
                if (getUrlParameters(window.location.href).region != undefined){
                    loadSpotSidebar(spotdata, getUrlParameters(window.location.href).region.split('-').join(' '));
                }
                else{
                    loadSpotSidebar(spotdata);
                }
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
            updateUrlParameters(window.location.href,'unchanged',undefined,'unchanged','unchanged','unchanged');

            // check if layer already loaded from JSON
            if (regionLayer != undefined){
                map.addLayer(regionLayer);
            }
            if (regiondata != undefined){
                loadRegionSidebar(regiondata);
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
            updateUrlParameters(window.location.href,undefined,undefined,'unchanged','unchanged','unchanged');

            // check if layer already loaded from JSON
            if (regionLayer != undefined){
                map.addLayer(regionLayer);
            }

            if (regiondata != undefined){
                loadRegionSidebar(regiondata);
            }

            selectLayerZoom = undefined;
        }  
    }
});

// Function that change URL according to the zoomlevel - fired when zooming -------------------------------------------------------------------------
map.on('zoomend',function(){
    updateUrlParameters(window.location.href,'unchanged','unchanged','unchanged','unchanged',map.getZoom());
});

// Function that change URL according to the Center of Map - fired when panning ---------------------------------------------------------------------
map.on('moveend',function(){
    updateUrlParameters(window.location.href,'unchanged','unchanged',map.getCenter().lat,map.getCenter().lng,map.getZoom());
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Block of codes for menu and sidebar buttons ------------------------------------------------------------------------------------------------------

function expandSidebar(){
    var classes = $(".menu-button").attr('class').split(" ");
    var collapsed = false;
    for (var i = 0; i < classes.length; i++){
        if (classes[i] == "collapsed"){
            collapsed = true;
            break;
        }
    }
    if (collapsed){
        $(".menu-button").removeClass("collapsed");
    }
    else{
        $(".menu-button").addClass("collapsed");
    }

    var sidebarClasses = $(".sidebar").attr("class").split(" ");
    var sidebarexpanded = false;
    for (var i = 0; i < sidebarClasses.length; i++){
        if (sidebarClasses[i] == "sidebar-expanded"){
            sidebarexpanded = true;
            break;
        }
    }
    if (sidebarexpanded){
        $(".sidebar").removeClass("sidebar-expanded");
    }
    else{
        $(".sidebar").addClass("sidebar-expanded");
    }
}

$(document).ready(function(){
// Actions to do when the user clicks on the menu button --------------------------------------------------------------------------------------------
  $(".menu-button-container").click(function(){
    expandSidebar();
  });

// Action to do when the user clicks the sidebar -------------------------------------------------------------------------------------
    $(".sidebar").on("click",".sidebar-row",function(){

        // Case when there is only region in the sidebar
        if (getUrlParameters(window.location.href).region == undefined && getUrlParameters(window.location.href).spot == undefined && parseInt(getUrlParameters(window.location.href).zoom) <= 9){
            if(spotdata != undefined){
                var region = $(this).find("h6").text();
                if(map.hasLayer(selectLayer)){ 
                    map.removeLayer(selectLayer);
                }
                selectLayer = L.geoJSON(spotdata,{
                    pointToLayer: function(feature, latlng){
                        switch (feature.properties.ACTIVITY){
                            case "1" : return L.marker(latlng, {icon: rockiconSpot});
                            case "2" : return L.marker(latlng, {icon: rockiconSpot});
                            case "3" : return L.marker(latlng, {icon: watericonSpot});
                            case "4" : return L.marker(latlng, {icon: lifestyleicon});
                        }
                    },
                    filter: function(spotfeature,layer){
                        return spotfeature.properties.REGION_NAME == region;
                    },
                    onEachFeature : onSpotClick
                });
                map.removeLayer(regionLayer);
                map.addLayer(selectLayer);
                // if the region clicked is a ski region, add a selection layer with the ski routes
                if ($(this).find(".text-light-grey").text().split(" ")[0] == "Ski"){
                    if (routedata != undefined){
                        if(map.hasLayer(selectrouteLayer)){
                            map.removeLayer(selectrouteLayer);
                        }
                        selectrouteLayer = L.geoJSON(routedata,{
                            filter: function(routefeature,layer){
                                return routefeature.properties.REGION_NAME == region;
                            },
                            style: {"color":"#006699", "weigth":5, "opacity":0.7},
                            onEachFeature : onRouteClick                         
                        });
                        map.addLayer(selectrouteLayer);                     
                    }
                }
                if (map.hasLayer(selectrouteLayer) == true){
                    map.fitBounds(selectrouteLayer.getBounds());
                    setTimeout(function(){
                        selectLayerZoom = map.getZoom();
                    }, 300);                       
                }else{
                    map.fitBounds(selectLayer.getBounds());
                    setTimeout(function(){
                        selectLayerZoom = map.getZoom();
                    }, 300);
                }
                // update url with the selected region, change space with '-'
                updateUrlParameters(window.location.href,$(this).find("h6").text().split(' ').join('-'),'unchanged','unchanged','unchanged','unchanged');

                // Load spots into the sidebar according to the region selected
                loadSpotSidebar(spotdata, $(this).find("h6").text());
            }
        }

        // Case when there is only spots in the sidebar
        else{
            if (getUrlParameters(window.location.href).spot == undefined){
                // Case when a region is selected
                if (getUrlParameters(window.location.href).region != undefined){
                    resetOriginalIcon();
                    var selectedspot = $(this).find("h6").text();
                    var activity = $(this).find(".text-light-grey").text().split(" ")[0];
                    if (map.hasLayer(selectLayer)){
                        selectLayer.eachLayer(function(spot){
                            if (spot.feature.properties.NAME == selectedspot){
                                if (activity != "Ski"){
                                    map.setView([spot.feature.geometry.coordinates[1],spot.feature.geometry.coordinates[0]],14);
                                }
                                switch (activity){
                                    case "Ski" : return spot.setIcon(rockiconSpotSelected);
                                    case "Climbing" : return spot.setIcon(rockiconSpotSelected);
                                    case "Surf" : return spot.setIcon(watericonSpotSelected);
                                    case "Vanlife" : return spot.setIcon(lifestyleiconSelected);
                                }
                            }
                        });
                    }
                    if (map.hasLayer(selectrouteLayer)){
                        selectrouteLayer.eachLayer(function(route){
                            if (route.feature.properties.SPOT_NAME == selectedspot){
                                route.setStyle({"color":"#006699", "weigth":5, "opacity":1});
                                map.fitBounds(route.getBounds());
                            }
                        });
                    }

                    // update url with the selected spot, change space with '-'
                    updateUrlParameters(window.location.href,'unchanged',selectedspot.split(' ').join('-'),'unchanged','unchanged','unchanged');

                    // Load selected spot into the sidebar
                    if (spotdata != undefined){
                        loadSelectedSpotSidebar(spotdata,selectedspot);
                    }
                }
                // Case when no region is selected but zoomlevel is greater than 9
                if (getUrlParameters(window.location.href).region == undefined && parseInt(getUrlParameters(window.location.href).zoom) > 9){
                    resetOriginalIcon();
                    var selectedspot = $(this).find("h6").text();
                    var activity = $(this).find(".text-light-grey").text().split(" ")[0];
                    if (map.hasLayer(spotLayer)){
                        spotLayer.eachLayer(function(spot){
                            if (spot.feature.properties.NAME == selectedspot){
                                if (activity != "Ski"){
                                    map.setView([spot.feature.geometry.coordinates[1],spot.feature.geometry.coordinates[0]],14);
                                }
                                switch (activity){
                                    case "Ski" : return spot.setIcon(rockiconSpotSelected);
                                    case "Climbing" : return spot.setIcon(rockiconSpotSelected);
                                    case "Surf" : return spot.setIcon(watericonSpotSelected);
                                    case "Vanlife" : return spot.setIcon(lifestyleiconSelected);
                                }
                            }
                        });
                    }
                    if (map.hasLayer(routeLayer)){
                        routeLayer.eachLayer(function(route){
                            if (route.feature.properties.SPOT_NAME == selectedspot){
                                route.setStyle({"color":"#006699", "weigth":5, "opacity":1});
                                map.fitBounds(route.getBounds());
                            }
                        });
                    }

                    // update url with the selected spot, change space with '-'
                    updateUrlParameters(window.location.href,'unchanged',selectedspot.split(' ').join('-'),'unchanged','unchanged','unchanged');

                    // Load selected spot into the sidebar
                    if (spotdata != undefined){
                        loadSelectedSpotSidebar(spotdata,selectedspot);
                    }   
                }
            }
        }
    }); 

// Action to do when the user clicks on the back arrow ----------------------------------------------------------------------------------------------
    $("#back-arrow-button").click(function(){
        if (getUrlParameters(window.location.href).region != undefined || parseInt(getUrlParameters(window.location.href).zoom) >= 9){
            // Case when there are (unselected) spots in the sidebar
            if (getUrlParameters(window.location.href).spot == undefined){
                if (regiondata != undefined){
                    loadRegionSidebar(regiondata);
                }
                if (map.hasLayer(selectLayer)){
                    map.removeLayer(selectLayer);
                }
                if (map.hasLayer(selectrouteLayer)){
                    map.removeLayer(selectrouteLayer);
                }
                if (map.hasLayer(spotLayer)){
                    map.removeLayer(spotLayer);
                }
                if (map.hasLayer(routeLayer)){
                    map.removeLayer(routeLayer);
                }
                regionLayer.addTo(map);
                selectLayerZoom = undefined;
                map.fitBounds(regionLayer.getBounds());
                updateUrlParameters(window.location.href,undefined,undefined,map.getCenter().lat,map.getCenter().lng,map.getZoom());
            }
            // Case when there are 1 selected spot
            else{
                if (getUrlParameters(window.location.href).region == undefined){
                    if (regiondata != undefined){
                        loadRegionSidebar(regiondata);
                    }

                    resetOriginalIcon();

                    if (routeLayer != undefined){
                        routeLayer.setStyle({"color":"#006699", "weigth":5, "opacity":0.6});
                    }
                    if (map.hasLayer(spotLayer)){
                        map.removeLayer(spotLayer);
                    }
                    if (map.hasLayer(routeLayer)){
                        map.removeLayer(routeLayer);
                    }
                    regionLayer.addTo(map);
                    map.fitBounds(regionLayer.getBounds());
                    updateUrlParameters(window.location.href,undefined,undefined,map.getCenter().lat,map.getCenter().lng,map.getZoom());
                }
                else{
                    resetOriginalIcon();

                    if (routeLayer != undefined){
                        routeLayer.setStyle({"color":"#006699", "weigth":5, "opacity":0.6});
                    }
                    if (selectrouteLayer != undefined){
                        selectrouteLayer.setStyle({"color":"#006699", "weigth":5, "opacity":0.6});
                    }

                    if (map.hasLayer(selectrouteLayer)){
                        map.fitBounds(selectrouteLayer.getBounds());
                    }
                    else{
                        map.fitBounds(selectLayer.getBounds());
                    }

                    if (spotdata != undefined){
                        loadSpotSidebar(spotdata, getUrlParameters(window.location.href).region.split('-').join(' '))
                    }

                    updateUrlParameters(window.location.href,"unchanged",undefined,map.getCenter().lat,map.getCenter().lng,map.getZoom());
                }
            }
        }
    });
});
