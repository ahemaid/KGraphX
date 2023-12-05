
<h1 align="center">
  <br>
      KGraphX
  <br>
</h1>

<p align="center">
  <a href="mailto:ahmad.hemid@fit.fraunhofer.de">Contact</a> •
  <a href="#contributing">Contribute</a> •
<a href="https://ahemaid.github.io/KGraphX/">Docs</a> •
  <a href="https://github.com/ahemaid/KGraphX/issues">Issues</a> •
  <a href="#license">License</a>
</p>


KGraphX, an easy-to-use visual editor to facilitate knowledge graph creation
for users with no prior knowledge of Semantic Web technology.

Built on the top of [WebVOWL](http://vowl.visualdataweb.org/webvowl.html)

Requirements
------------
Node.js for installing the development tools and dependencies form [here](https://nodejs.org/en).

Java Runtime Kit (JRE) or Java Development Kit (JDK) >= version 11.

KGraphX Installation
-----------------
1. Navigate to the root folder
2. Run `npm install --force` to install the dependencies and build the project
3. Run `npm install grunt-cli -g` (install the npm package `grunt-cli` globally)
4. Run `grunt webserver` to start a local live-updating webserver
5. Then, KGraphX GUI is accessible at http://localhost:8000/


Fuseki Server Installation
-----------------
1. You can download the latest version normally under their [website](https://jena.apache.org/download/index.cgi) or download the Fuseki server with the following command for Linux machines. For Windows, the website has a Windows version [here](https://dlcdn.apache.org/jena/binaries/apache-jena-fuseki-4.8.0.zip) : 
```
wget https://downloads.apache.org/jena/binaries/apache-jena-fuseki-4.8.0.tar.gz
```
2. Extract the compressed file. 
3. Find the location of “apache-jena-fuseki-4.8.0”. 
4. Log in to the terminal under the extracted folder. 
5. Run Fuseki and use the following command:
```
./fusekiserver --update --mem --port=3030 /dataset
```
6. Fuseki server GUI is accessible at http://localhost:3030/ and as a default "dataset" will be used. Please remember to use it when exporting RDF/RDFS to the Fuseki server. 

<!-- **Contact FTeam**: ids-appstore@fit.fraunhofer.de
 -->
 
Running Using Docker
-----------------
1. You can also run KGraphX using docker, If you have it installed on your machine, otherwise, you use [this](https://docs.docker.com/engine/install/) to install docker. Once you have docker, then you can issue the following command to download the KGraphX docker image:
```
docker pull ahemid/kgraphx
```
or you can create KGraphX docker image by giving the following command on the project root folder:
```
docker build .  -t ahemid/kgraphx
```
2. Next, create the KGraphX docker container using the following command: 
```
docker run -d -p 8000:8000 -p 3030:3030 ahemid/kgraphx
```
3. Then, KGraphX GUI is accessible at http://localhost:8000/ and the Fuseki server is running at http://localhost:3030/
 
## License
Copyright © 2023 Fraunhofer. This project is licensed under the MIT License - see the
[LICENSE](LICENSE) for details.

## Contributing
You are very welcome to contribute to this project when you find a bug, want to suggest an improvement, or have an idea for a helpful feature. Please find a set of guidelines at the [CONTRIBUTING.md](https://github.com/ahemaid/KGraphX/blob/main/CONTRIBUTING.md) and the [CODE_OF_CONDUCT.md](https://github.com/ahemaid/KGraphX/blob/main/CODE_OF_CONDUCT.md).
