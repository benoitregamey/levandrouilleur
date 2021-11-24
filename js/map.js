// Initializing 2 basemaps --------------------------------------------------------------------------------------------------------------------------
var lightbasemap = L.tileLayer('https://api.maptiler.com/maps/positron/{z}/{x}/{y}.png?key=kYPqbESxdZxN8lWAi2ju',{
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        attribution: '<a href="https://levandrouilleur.com" target="_blank">© Le Vandrouilleur |</a> <a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a>',
        crossOrigin: true
});

var topobasemap = L.tileLayer('https://api.maptiler.com/maps/topo/{z}/{x}/{y}.png?key=kYPqbESxdZxN8lWAi2ju',{
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        attribution: '<a href="https://levandrouilleur.com" target="_blank">© Le Vandrouilleur |</a> <a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a>',
        crossOrigin: true
});

var map = L.map('map', {
	zoomControl: false,
	layers: lightbasemap,
    minZoom: 2,
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

// function that update URL with the parameters region, spot, lat, lng, zoom. If one of the following are set to 'unchanged', take the existing 
// ones (if they exist) or ignore them, If one of the following are set to 'undefined', force to erase them even if thex exist.
// URL strucutre : ../map.html?region=xxxx&spot=xxxx&lat=xxxx&lng=xxxx&zoom=xxxx 
function updateUrlParameters(url,spot,lat,lng,zoom){
    var results = {
        'spot' : undefined,
        'lat' : undefined,
        'lng' : undefined,
        'zoom' : undefined
    };
    if (url.split('?')[1] != undefined){
        var urloptions = url.split('?')[1].split('&');
        var i;
        for (i = 0; i < urloptions.length; i++){
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

// function that loads the spots available in data into the sidebar ------------------------------------------------
// Loads only the spots that are on the current map extent !
function loadSpotSidebar(data){

    $(".sidebar-content").empty();

    var sortedBydate = [];
    for (var i = 0; i < data.length; i++){
        var lat = data[i].geometry.coordinates[1];
        var lng = data[i].geometry.coordinates[0];
        if (lng >= map.getBounds().getWest() && lng <= map.getBounds().getEast() && lat >= map.getBounds().getSouth() && lat <= map.getBounds().getNorth()){
            sortedBydate.push({index:i, date:new Date(data[i].properties.DATE)});
        }
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
            htmlstring += '<div class="col-3 px-0 pl-2"><img src="icon/map/sidebar-icon-spot-water.png" class="sidebar-icon mx-auto d-block"></div>';
        }
        if (data[index].properties.ACTIVITY == "4"){
            htmlstring += '<div class="col-3 px-0 pl-2"><img src="icon/map/sidebar-icon-lifestyle.png" class="sidebar-icon mx-auto d-block"></div>';
        }

        htmlstring += '<div class="col-9 py-2 px-2">';
        htmlstring += '<h6 class="mb-0 pt-1">' + data[index].properties.NAME + '<br></h6>';

        if (data[index].properties.ACTIVITY == "1"){
            htmlstring += '<p class="p small mb-1 text-light-grey">' + data[index].properties.LAND +' &bull; Ski &bull; ' + date + '<br></p>';
        }
        if (data[index].properties.ACTIVITY == "2"){
            htmlstring += '<p class="p small mb-1 text-light-grey">' + data[index].properties.LAND +' &bull; Climbing &bull; ' + date + '<br></p>';
        }
        if (data[index].properties.ACTIVITY == "3"){
            htmlstring += '<p class="p small mb-1 text-light-grey">' + data[index].properties.LAND +' &bull; Surf &bull; ' + date + '<br></p>';
        }
        if (data[index].properties.ACTIVITY == "4"){
            htmlstring += '<p class="p small mb-1 text-light-grey">' + data[index].properties.LAND +' &bull; Vanlife &bull; ' + date + '<br></p>';
        } 
        htmlstring += '<p class="p small mb-0 pb-1 line-height-110 text-dark">' + data[index].properties.LEAD_TEXT + '</p>';
        htmlstring += '</div>';
        htmlstring += '</div>';
        $(".sidebar-content").append(htmlstring);
    }
    $("#activity-count").html(sortedBydate.length);
}

// function that loads the selected spot into the sidebar with embbed instagram post ----------------------------------------------------------------
function loadSelectedSpotSidebar(data,spot){

    $(".sidebar-content").empty();

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
        htmlstring += '<p class="p small mb-1 text-light-grey">' + data[index].properties.LAND +' &bull; Ski &bull; ' + date + '<br></p>';
    }
    if (data[index].properties.ACTIVITY == "2"){
        htmlstring += '<p class="p small mb-1 text-light-grey">' + data[index].properties.LAND +' &bull; Climbing &bull; ' + date + '<br></p>';
    }
    if (data[index].properties.ACTIVITY == "3"){
        htmlstring += '<p class="p small mb-1 text-light-grey">' + data[index].properties.LAND +' &bull; Surf &bull; ' + date + '<br></p>';
    }
    if (data[index].properties.ACTIVITY == "4"){
        htmlstring += '<p class="p small mb-1 text-light-grey">' + data[index].properties.LAND +' &bull; Vanlife &bull; ' + date + '<br></p>';
    }   

    htmlstring += '<p class="p mb-3 line-height-110 text-dark">' + data[index].properties.LEAD_TEXT + '</p>';
    htmlstring += '</div>';
    htmlstring += '</div>';
    $(".sidebar-content").append(htmlstring);

    if (data[index].properties.INSTA_POST_ID != null){
        var instapost;
        var request = new XMLHttpRequest();
        request.open('GET', 'https://graph.facebook.com/v11.0/instagram_oembed?url=https://www.instagram.com/p/' + data[index].properties.INSTA_POST_ID + '/&access_token=358977528652478|e602aadfadb8814f5cf7c19932040fa5&omitscript=true', true);
        request.onload = function() {
            instapost = JSON.parse(this.response).html;
            $(".sidebar-content").append(instapost);
            instgrm.Embeds.process();
        }
        request.send();     
    }

    $("#activity-count").html(' <font color="red">1</font> ');
    $("#back-arrow-button").html('<i class="fas fa-angle-double-left fa-lg"></i>');
}

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

        resetOriginalIcon();

        if (feature.properties.ACTIVITY == "1"){
            layer.setIcon(skiiconSpotSelected);
            map.addLayer(routeLayer);

            if (map.hasLayer(routeLayer)){
                routeLayer.setStyle({"color":"#006699", "weigth":5, "opacity":0.6});
                routeLayer.eachLayer(function(route){
                    if (route.feature.properties.SPOT_NAME == feature.properties.NAME){
                        route.setStyle({"color":"#006699", "weigth":5, "opacity":1});
                        map.fitBounds(route.getBounds());
                        previousZoom = map.getBoundsZoom(route.getBounds());
                    }
                });
            }
        }

        if (feature.properties.ACTIVITY == "2"){
            layer.setIcon(climbiconSpotSelected);
            if (map.getZoom() > 14){
                map.setView([feature.geometry.coordinates[1],feature.geometry.coordinates[0]]);
                previousZoom = map.getZoom();           
            }
            else{
                map.setView([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],14);
                previousZoom = 14;
            }
        }

        if (feature.properties.ACTIVITY == "3"){
            layer.setIcon(watericonSpotSelected);
            if (map.getZoom() > 14){
                map.setView([feature.geometry.coordinates[1],feature.geometry.coordinates[0]]);
                previousZoom = map.getZoom();           
            }
            else{
                map.setView([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],14);
                previousZoom = 14;
            }                
        }

        if (feature.properties.ACTIVITY == "4"){
            layer.setIcon(lifestyleiconSelected);
            if (map.getZoom() > 14){
                map.setView([feature.geometry.coordinates[1],feature.geometry.coordinates[0]]);
                previousZoom = map.getZoom();           
            }
            else{
                map.setView([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],14);
                previousZoom = 14;
            }               
        }

        // Load spot into the sidebar
        loadSelectedSpotSidebar(spotdata, feature.properties.NAME);

        // update URL with selected spot, replace space with '-'
        updateUrlParameters(window.location.href,feature.properties.NAME.split(' ').join('-'),'unchanged','unchanged','unchanged'); 

        // If sidebar is collapsed, expand it, add a timeout to be sure that the zoom and pan are finished before expanding the sidebar
        setTimeout(function(){
            if ($(".menu-button").hasClass("collapsed")){
                expandSidebar();
            }
        },500);
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
                    spot.setIcon(skiiconSpotSelected);
                }
            });
        }

        map.fitBounds(layer.getBounds());
        previousZoom = map.getBoundsZoom(layer.getBounds());

        // Load spot into the sidebar
        loadSelectedSpotSidebar(spotdata, feature.properties.SPOT_NAME);        

        // update URL with selected spot, replace space with '-'
        updateUrlParameters(window.location.href,feature.properties.SPOT_NAME.split(' ').join('-'),'unchanged','unchanged','unchanged');

        // If sidebar is collapsed, expand it, add a timeout to be sure that the zoom and pan are finished before expanding the sidebar
        setTimeout(function(){
            if ($(".menu-button").hasClass("collapsed")){
                expandSidebar();
            }
        },500);
    });   
}

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

    // Load the spotLayer to the map only if no spot is selected in the URL
    if (getUrlParameters(window.location.href).spot == undefined){
        // If lat,lng,zoom are set in the URL, use these information to set the map view. If not use the bounding box of the spotLayer
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
            var sortedBydate = [];
            for (var i = 0; i < spotdata.length; i++){
                sortedBydate.push({index:i, date:new Date(spotdata[i].properties.DATE)});
            }
            sortedBydate.sort((a, b) => b.date - a.date);
            map.setView([spotdata[sortedBydate[0].index].geometry.coordinates[1],spotdata[sortedBydate[0].index].geometry.coordinates[0]],5);
        }
        spotLayer.addTo(map);
        loadSpotSidebar(spotdata);
    }

    // if spot is set in the URL, set style for the selected and zoom on it
    if (getUrlParameters(window.location.href).spot != undefined){
        map.addLayer(spotLayer);
        spotLayer.eachLayer(function(spot){
            if (spot.feature.properties.NAME == getUrlParameters(window.location.href).spot.split('-').join(' ')){
                // Zoom to the seleceted Spot. If the Acvivity is ski do not zoom. Will be done by the routeLayer
                if (spot.feature.properties.ACTIVITY != "1"){
                    map.removeLayer(lightbasemap);
                    map.addLayer(topobasemap);
                    map.setView([spot.feature.geometry.coordinates[1],spot.feature.geometry.coordinates[0]],14);
                    previousZoom = 14;
                } 
                switch (spot.feature.properties.ACTIVITY){
                    case "1" : return spot.setIcon(skiiconSpotSelected);
                    case "2" : return spot.setIcon(climbiconSpotSelected);
                    case "3" : return spot.setIcon(watericonSpotSelected);
                    case "4" : return spot.setIcon(lifestyleiconSelected);
                } 
            }
        });

        // Load the selected spot into the sidebar and expand it
        loadSelectedSpotSidebar(data.features,getUrlParameters(window.location.href).spot.split('-').join(' '));
        expandSidebar(); 
    }
});

// Initializing routeLayer --------------------------------------------------------------------------------------------------------------------------
$.getJSON('data/route.geojson',function(data){
    routeLayer = L.geoJSON(data,{
        style : {"color":"#006699", "weigth":5, "opacity":0.6},
        onEachFeature : onRouteClick
    });

    routedata = data.features;

    // if spot is set in the URL, set style for the selected and zoom on it
    if (getUrlParameters(window.location.href).spot != undefined){
        if (routedata.filter(function(item){return item.properties.SPOT_NAME == getUrlParameters(window.location.href).spot.split('-').join(' ')}).length > 0){
            routeLayer.eachLayer(function(route){
                if (route.feature.properties.SPOT_NAME == getUrlParameters(window.location.href).spot.split('-').join(' ')){
                    route.setStyle({"color":"#006699", "weigth":5, "opacity":1});
                    if (map.getBoundsZoom(route.getBounds()) > 11){
                        map.removeLayer(lightbasemap);
                        map.addLayer(topobasemap);
                    }
                    map.fitBounds(route.getBounds());
                    previousZoom = map.getBoundsZoom(route.getBounds());
                }
            });
        }

        map.addLayer(routeLayer);

    }

    // if the zoomlevel is set in the URL and if it is greater than 11, add routeLayer to the map
    if (getUrlParameters(window.location.href).zoom != undefined && getUrlParameters(window.location.href).spot == undefined){
        if (parseInt(getUrlParameters(window.location.href).zoom) > 11){
            if (map.hasLayer(lightbasemap)) {
                map.removeLayer(lightbasemap);
                map.addLayer(topobasemap);
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

// Function to manage routelayer and sidebar content according to the zoomlevel -------------------------------------------------------------
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

    // If no spot is selected, reload the sidebar content to match the map extent
    if (getUrlParameters(window.location.href).spot == undefined){
        loadSpotSidebar(spotdata);
    }

    // If 1 spot is selected and the user zoom out, reload the sidebar to unselect the spot
    if (getUrlParameters(window.location.href).spot != undefined && zoomlevel < previousZoom){
        loadSpotSidebar(spotdata);
        resetOriginalIcon();
        updateUrlParameters(window.location.href,undefined,'unchanged','unchanged',map.getZoom());
        if (routeLayer != undefined){
            routeLayer.setStyle({"color":"#006699", "weigth":5, "opacity":0.6});
        }
        $("#back-arrow-button").html('');
    }    

});

// Function that change URL according to the zoomlevel - fired when zooming -------------------------------------------------------------------------
map.on('zoomend',function(){
    updateUrlParameters(window.location.href,'unchanged','unchanged','unchanged',map.getZoom());
});

// Function that change URL according to the Center of Map - fired when panning ---------------------------------------------------------------------
map.on('moveend',function(){
    updateUrlParameters(window.location.href,'unchanged',map.getCenter().lat,map.getCenter().lng,map.getZoom());
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
        if ($(window).width() <= 658) {
            $('.sidebar-expanded').css('max-height', '85vh');
            $('.sidebar-content').css('max-height', 'calc(85vh - 60px)');              
        }
        else{
            $('.sidebar-expanded').css('max-height', '100vh');
            $('.sidebar-content').css('max-height', 'calc(100vh - 60px)');       
        }        
    }
}

// Functions to handle the sidebar by touchscreen for smartphone screen sizes
// -------------------------------------------------------------------------------------------------------------------------------------------------
function handleTouch(e) {
    var y = e.changedTouches[0].clientY;
    var maxheight = parseInt((y/$(window).height())*100)
    if ($(window).width() <= 658){
        if (maxheight < 85){
            $('.sidebar-expanded').css('max-height', maxheight + 'vh');
            $('.sidebar-content').css('max-height', 'calc(' + maxheight +'vh - 60px)');
        }
        else{
            $('.sidebar-expanded').css('max-height', '85vh');
            $('.sidebar-content').css('max-height', 'calc(85vh - 60px)');
        }
    }
}

function handleTouchEnd(e) {
    var y = e.changedTouches[0].clientY;
    var maxheight = parseInt((y/$(window).height())*100)
    if ($(window).width() <= 658){
        if (maxheight < 42){
            expandSidebar();
        }
        else{
            $('.sidebar-expanded').css('max-height', '85vh');
            $('.sidebar-content').css('max-height', 'calc(85vh - 60px)');        
        }
    }
}

$('.sidebar-bottom').on('touchstart', handleTouch)
$('.sidebar-bottom').on('touchmove', handleTouch)
$('.sidebar-bottom').on('touchend', handleTouchEnd)

$(window).resize(function(){
    if ($(window).width() <= 658) {
        $('.sidebar-expanded').css('max-height', '85vh');
        $('.sidebar-content').css('max-height', 'calc(85vh - 60px)');              
    }
    else{
        $('.sidebar-expanded').css('max-height', '100vh');
        $('.sidebar-content').css('max-height', 'calc(100vh - 60px)');       
    }
});

// when the user touch the map, the sidebar collapses
map.on('movestart click zoomstart',function(){
    if ($(window).width() <= 658){
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
            $(".menu-button").addClass("collapsed");
        }     
    }    
});

// Functions to handle the sidebar by touchscreen for bigger screen sizes
// -------------------------------------------------------------------------------------------------------------------------------------------------
var startx;
var endx;

function handleTouchBigScreenStart(e){
    startx = e.changedTouches[0].clientX;
}

function handleTouchBigScreenEnd(e){
    endx = e.changedTouches[0].clientX;
    if (startx - endx > 100){
        if ($(window).width() > 658){
            expandSidebar();
        }
    }
}

$('.sidebar-content').on('touchstart', handleTouchBigScreenStart)
$('.sidebar-content').on('touchend', handleTouchBigScreenEnd)

$(document).ready(function(){
// Actions to do when the user clicks on the menu button --------------------------------------------------------------------------------------------
  $(".menu-button-container").click(function(){
    expandSidebar();
  });

// Action to do when the user clicks the sidebar -------------------------------------------------------------------------------------
    $(".sidebar").on("click",".sidebar-row",function(){
    
    // Case when no spot is selected
        if (getUrlParameters(window.location.href).spot == undefined){

            resetOriginalIcon();
            var selectedspot = $(this).find("h6").text();
            var activity = $(this).find(".text-light-grey").text().split(" ")[0];

            if (map.hasLayer(spotLayer)){
                spotLayer.eachLayer(function(spot){
                    if (spot.feature.properties.NAME == selectedspot){
                        if (activity != "Ski"){
                            if (map.getZoom() > 14){
                                map.setView([spot.feature.geometry.coordinates[1],spot.feature.geometry.coordinates[0]]);
                                previousZoom = map.getZoom();           
                            }
                            else{
                                map.setView([spot.feature.geometry.coordinates[1],spot.feature.geometry.coordinates[0]],14);
                                previousZoom = 14;
                            }
                        }
                        switch (activity){
                            case "Ski" : return spot.setIcon(skiiconSpotSelected);
                            case "Climbing" : return spot.setIcon(climbiconSpotSelected);
                            case "Surf" : return spot.setIcon(watericonSpotSelected);
                            case "Vanlife" : return spot.setIcon(lifestyleiconSelected);
                        }
                    }
                });
            }

            if (activity == "Ski"){
                routeLayer.eachLayer(function(route){
                    if (route.feature.properties.SPOT_NAME == selectedspot){
                        route.setStyle({"color":"#006699", "weigth":5, "opacity":1});
                        map.fitBounds(route.getBounds());
                        previousZoom = map.getBoundsZoom(route.getBounds());
                    }
                });

                map.addLayer(routeLayer);
            }

            // update url with the selected spot, change space with '-'
            updateUrlParameters(window.location.href,selectedspot.split(' ').join('-'),'unchanged','unchanged','unchanged');

            // Load selected spot into the sidebar
            if (spotdata != undefined){
                loadSelectedSpotSidebar(spotdata,selectedspot);
            }   
        }
    }); 

// Action to do when the user clicks on the back arrow, only when 1 spot is selected ----------------------------------------------------------------
    $("#back-arrow-button").click(function(){
        if (getUrlParameters(window.location.href).spot != undefined){

            resetOriginalIcon();

            if (routeLayer != undefined){
                routeLayer.setStyle({"color":"#006699", "weigth":5, "opacity":0.6});
            }    

            updateUrlParameters(window.location.href,undefined,map.getCenter().lat,map.getCenter().lng,map.getZoom());       

            if (spotdata != undefined){
                loadSpotSidebar(spotdata);
            }
        }

        $("#back-arrow-button").html('');
    });

// Action to do when the user clicks on the header icon --------------------------------------------------------------------------------------------
    $("#header-icon").click(function(){
        window.location.href = 'https://levandrouilleur.com';
    });
});


