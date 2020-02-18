
// function to adapt Instagram feed between desktop and mobile screen
// ----------------------------------------------------------------------------------------------------------------------------------------
function ChangeInstaFeedSource(x) {
  if (x.matches) { // If media query matches
  	$("#instafeed").attr('src','https://snapwidget.com/embed/760343');
  } 
  else {
  	$("#instafeed").attr('src','https://snapwidget.com/embed/760355');
  }
}

var x = window.matchMedia("(max-width: 768px)")

ChangeInstaFeedSource(x) // Call listener function at run time
x.addListener(ChangeInstaFeedSource) // Attach listener function on state changes

// function to update the date of copyrights in the footer
// ----------------------------------------------------------------------------------------------------------------------------------------

$("#footer h6").html("&copy; Le Vandrouilleur - ".concat(new Date().getFullYear()))