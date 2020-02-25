// Function to load the first 6 instagram posts with a layout of 2 columns 3 rows
function loadInstaFeedSmall(){

	$("#insta-feed").empty();

	$.getJSON('data/spot.geojson',function(data){
		var sortedBydate = [];
		for (var i = 0; i < data.features.length; i++){
			if (data.features[i].properties.INSTA_POST_ID != null){
				sortedBydate.push({index:i, date:new Date(data.features[i].properties.DATE)});
			}
		}
		sortedBydate.sort((a, b) => b.date - a.date);

		var htmlstring = "";
		htmlstring += '<div class="row mx-0">';

		for (var i = 0; i < 2; i++){
        	var index = sortedBydate[i].index;

        	var imgURL = 'https://instagram.com/p/' + data.features[index].properties.INSTA_POST_ID + '/media/?size=l';
        	var postLink = 'https://www.instagram.com/p/' + data.features[index].properties.INSTA_POST_ID;

        	htmlstring += '<div class="col-6 px-0 insta-post">';
        	htmlstring += '<img src="' + imgURL + '" onclick=\"window.location=\'' + postLink + '\';">';
        	htmlstring += '</div>';
		}

		htmlstring += '</div>';
		htmlstring += '<div class="row mx-0">';

		for (var i = 2; i < 4; i++){
        	var index = sortedBydate[i].index;

        	var imgURL = 'https://instagram.com/p/' + data.features[index].properties.INSTA_POST_ID + '/media/?size=l';
        	var postLink = 'https://www.instagram.com/p/' + data.features[index].properties.INSTA_POST_ID;

        	htmlstring += '<div class="col-6 px-0 insta-post">';
        	htmlstring += '<img src="' + imgURL+ '" onclick=\"window.location=\'' + postLink + '\';">';
        	htmlstring += '</div>';
		}

		htmlstring += '</div>';
		htmlstring += '<div class="row mx-0">';

		for (var i = 4; i < 6; i++){
        	var index = sortedBydate[i].index;

        	var imgURL = 'https://instagram.com/p/' + data.features[index].properties.INSTA_POST_ID + '/media/?size=l';
        	var postLink = 'https://www.instagram.com/p/' + data.features[index].properties.INSTA_POST_ID;

        	htmlstring += '<div class="col-6 px-0 insta-post">';
        	htmlstring += '<img src="' + imgURL + '" onclick=\"window.location=\'' + postLink + '\';">';
        	htmlstring += '</div>';
		}

		htmlstring += '</div>';
		$("#insta-feed").append(htmlstring);
	});
}

// Function to load the first 6 instagram posts with a layout of 3 columns 2 rows
function loadInstaFeedLarge(){

	$("#insta-feed").empty();

	$.getJSON('data/spot.geojson',function(data){
		var sortedBydate = [];
		for (var i = 0; i < data.features.length; i++){
			if (data.features[i].properties.INSTA_POST_ID != null){
				sortedBydate.push({index:i, date:new Date(data.features[i].properties.DATE)});
			}
		}
		sortedBydate.sort((a, b) => b.date - a.date);

		var htmlstring = "";
		htmlstring += '<div class="row mx-0">';

		for (var i = 0; i < 3; i++){
        	var index = sortedBydate[i].index;

        	var imgURL = 'https://instagram.com/p/' + data.features[index].properties.INSTA_POST_ID + '/media/?size=l';
        	var postLink = 'https://www.instagram.com/p/' + data.features[index].properties.INSTA_POST_ID;

        	htmlstring += '<div class="col-4 px-0 insta-post">';
        	htmlstring += '<img src="' + imgURL + '" onclick=\"window.location=\'' + postLink + '\';">';
        	htmlstring += '</div>';
		}

		htmlstring += '</div>';
		htmlstring += '<div class="row mx-0">';

		for (var i = 3; i < 6; i++){
        	var index = sortedBydate[i].index;

        	var imgURL = 'https://instagram.com/p/' + data.features[index].properties.INSTA_POST_ID + '/media/?size=l';
        	var postLink = 'https://www.instagram.com/p/' + data.features[index].properties.INSTA_POST_ID;

        	htmlstring += '<div class="col-4 px-0 insta-post">';
        	htmlstring += '<img src="' + imgURL+ '" onclick=\"window.location=\'' + postLink + '\';">';
        	htmlstring += '</div>';
		}

		htmlstring += '</div>';

		$("#insta-feed").append(htmlstring);
	});
}

// function to adapt Instagram feed between desktop and mobile screen
// ----------------------------------------------------------------------------------------------------------------------------------------
function ChangeInstaFeedSource(x) {
  if (x.matches) { // If media query matches
  	loadInstaFeedSmall();
  } 
  else {
  	loadInstaFeedLarge();
  }
}

var x = window.matchMedia("(max-width: 768px)")

ChangeInstaFeedSource(x) // Call listener function at run time
x.addListener(ChangeInstaFeedSource) // Attach listener function on state changes


// function to update the date of copyrights in the footer
// ----------------------------------------------------------------------------------------------------------------------------------------
$("#footer h6").html("&copy; Le Vandrouilleur - ".concat(new Date().getFullYear()))