# levandrouilleur
A simple website with a landing page and a webmapping application.

There is no database, using only html, css and js files. The data come from geojson files and are read and pupulate into html by ajax functions.

Thus it is possible to host this website (static website) on AWS with S3 bucket - ACM (SSL certificate for the https) - Cloudfront (for a https enable distribution, linked to the ACM) - Route53 (DNS configuration - link between domain name and Cloudfront distribution).

https://levandrouilleur.com
