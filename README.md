KGraphX 
=======
KGraphX, an easy-to-use visual editor to make knowledge graph creation
for users with limited knowledge of Semantic Web technology more engaging.

Base used : [WebVOWL](http://vowl.visualdataweb.org/webvowl.html)

Requirements
------------
Node.js for installing the development tools and dependencies form [here](https://nodejs.org/en).

Java Runtime Kit (JRE) or Java Development Kit (JDK) >= version 11.

KGraphX Installation
-----------------
1. Navigate to root folder.
2. Run `npm install --force` to install the dependencies and build the project
3. Run `npm install grunt-cli -g` (install the npm package `grunt-cli` globally)
4. Run `grunt webserver` starts a local live-updating webserver


Fuseki Server Installation
-----------------
1. You can download the latest version normally under their [website](https://jena.apache.org/download/index.cgi) or download Fuseki server with the following command for Linux machines. For windows, the website has a windows version [here](https://dlcdn.apache.org/jena/binaries/apache-jena-fuseki-4.8.0.zip) : 
```
wget https://downloads.apache.org/jena/binaries/apache-jena-fuseki-4.8.0.tar.gz
```
2. Extract the compressed file. 
3. Find location of “apache-jena-fuseki-4.8.0”. 
4. Login to the terminal under the extracted folder. 
5. Run Fuseki, use the following command:
```
./fusekiserver --update --mem --port=3030 /dataset
```
6. Fuseki server GUI is accessible at http://localhost:3030/
