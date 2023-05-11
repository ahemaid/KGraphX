KGraphX 
=======
KGraphX, an easy-to-use visual editor to make knowledge graph creation
for users with limited knowledge of Semantic Web technology more engaging.

Base used : [WebVOWL](http://vowl.visualdataweb.org/webvowl.html)

Requirements
------------
Node.js for installing the development tools and dependencies form [here](https://nodejs.org/en).

Java Runtime Kit (JRE) or Java Development Kit (JDK) >= version 11.

KGraphX setup
-----------------
1. Navigate to root folder.
2. Run `npm install --force` to install the dependencies and build the project
3. Run `npm install grunt-cli -g` (install the npm package `grunt-cli` globally)
4. Run `grunt webserver` starts a local live-updating webserver


Fuseki Server setup
-----------------
1. Download Fuseki server with the following command: 
```
wget https://downloads.apache.org/jena/binaries/apache-jena-fuseki-4.8.0.tar.gz ```
or you can download the latest version normally 
from their page at https://jena.apache.org/download/index.cgi.
2. Extract the compressed file. 
3. Find location of “apache-jena-fuseki-4.8.0” which is normally in Home folder (Linux Home) . 
7. Login to the terminal under the extracted folder. 
8. Run Fuseki, use the following command:
```
./fusekiserver --update --mem --port=3030 /dataset```

9 Fuseki server GUI is accessible at http://localhost:3030/ 
