# levandrouilleur
A simple website with a landing page and a webmapping application.

There is no database, using only html, css and js files. The data come from geojson files and are read and populate into html by ajax functions.

Thus it is possible to host this website (static website) on AWS with S3 bucket - ACM (SSL certificate for the https) - Cloudfront (for a https enable distribution, linked to the ACM) - Route53 (DNS configuration - link between domain name and Cloudfront distribution).

https://levandrouilleur.com

Structure

* index.html --> Landing page
    * Dependencies
      * css/landing.css
      * js/landing.js
      * js/map-landing.js --> handles the map functions on the landing page (not on the webmapping application page)
      * font/...
      * icon/...
      * Jquery
      * Bootstrap 4
      * fontawesome
      * leaflet
      * leaflet-gestures.handling --> handles the UX on mobile devices for the map on the landing page (pan only with 2 fingers)
      * snap-widget --> creates mosaic with the 6 most recent instagram posts
    
* map.html --> webmapping application
	* Dependencies
		* css/map.css
		* js/map.js
		* icon/map/...
		* font/...
		* data/... --> contains the geojson read by ajax functions to populate html content and leaflet features
      * Jquery
      * Bootstrap 4
      * fontawesome
      * leaflet
		* Instagram embed API and JS --> handles the dynamic creation of an iframe with instagram post
        

