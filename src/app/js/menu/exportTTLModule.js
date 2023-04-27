/**
 * Contains the logic for the export button.
 * @returns {{}}
 */
module.exports = function ( graph ){
  var exportTTLModule = {};
  var resultingTTLContent = "";
  var mainContent = "";
  var currentNodes;
  var currentProperties;
  var prevSubject;
  var currentAxioms;
  var Map_ID2Node = {};
  var Map_ID2Prop = {};
  var prefixModule = webvowl.util.prefixTools(graph);
  
  exportTTLModule.requestExport = function (format){
    prefixModule.updatePrefixModel();
    resultingTTLContent = "";
    currentNodes = graph.getClassDataForTtlExport();
    var i;
    for ( i = 0; i < currentNodes.length; i++ ) {
      Map_ID2Node[currentNodes[i].id()] = currentNodes[i];
    }
    currentProperties = graph.getPropertyDataForTtlExport();
    
    for ( i = 0; i < currentProperties.length; i++ ) {
      Map_ID2Prop[currentProperties[i].id()] = currentProperties[i];
    }
    
    
    prepareHeader();
    preparePrefixList();
    prepareOntologyDef();
    resultingTTLContent += "#################################################################\r\n\r\n";
    preparePrefixRepresentation();
    var class_success = exportResources(format);
    var property_success = exportProperties(format);
    currentNodes = null;
    currentProperties = null;
    Map_ID2Node = {};
    Map_ID2Prop = {};
    if ( property_success === false || class_success === false )
      return false;
    return true;
    
  };
  
  function preparePrefixRepresentation(){
    var i;
    var allNodes = graph.getUnfilteredData().nodes;
    var allProps = graph.getUnfilteredData().properties;
    for ( i = 0; i < allNodes.length; i++ ) {
      var nodeIRI = prefixModule.getPrefixRepresentationForFullURI(allNodes[i].iri());
      if ( prefixModule.validURL(nodeIRI) === true )
        allNodes[i].prefixRepresentation = "<" + nodeIRI + ">";
      else
        allNodes[i].prefixRepresentation = nodeIRI;
    }
    for ( i = 0; i < allProps.length; i++ ) {
      var propIRI = prefixModule.getPrefixRepresentationForFullURI(allProps[i].iri());
      if ( prefixModule.validURL(propIRI) === true )
        allProps[i].prefixRepresentation = "<" + propIRI + ">";
      else
        allProps[i].prefixRepresentation = propIRI;
    }
  }
  
  function exportProperties(format){
    var propertyName;
    if(format == 'rdf-syntax') {
      prevSubject = undefined;
      mainContent = "";
    if ( currentProperties.length === 0 ) return; // we dont need to write that
    for ( var i = 0; i < currentProperties.length; i++ ) {
      if(currentProperties[i].type() != "rdf:type" && currentProperties[i].type() != "owl:DatatypeProperty") {
      if(currentProperties[i].prefixRepresentation.startsWith(":")) {
        propertyName = "ex"+ currentProperties[i].prefixRepresentation;
      }
      else {
        propertyName = currentProperties[i].prefixRepresentation;
      }
      resultingTTLContent += general_Label_languageExtractor(propertyName, currentProperties[i].label(), "<http://www.w3.org/2006/vcard/ns#hasFN>", true);
    }
    return true;
  }
}
  else if (format == 'rdf-schema') {
    prevSubject = undefined;
    if ( currentProperties.length === 0 ) return; 
    for ( var i = 0; i < currentProperties.length; i++ ) {
      var j = i+1;
      resultingTTLContent += "\n";
    
      var addedElement = extractPropertyDescriptionRDFS(currentProperties[i]);
      if(addedElement && !addedElement.includes("undefined")) {
      resultingTTLContent += addedElement;
      //@ workaround for not supported elements
      if ( addedElement.indexOf("WHYEMPTYNAME") !== -1 ) {
        return false;
      }
    }
    }
    return true;
  }
  }
  
  
  function exportResources(format){
    console.log(format)
    if(format == 'rdf-syntax') {
      prevSubject = undefined;
     if ( currentNodes.length === 0 ) return; // we dont need to write that
     //resultingTTLContent += "###  Number of Classes " + currentNodes.length + " ###\r\n";
     for ( var i = 0; i < currentNodes.length; i++ ) {
       extractResourceDescriptionRDF(currentNodes[i]);
     }
    return true;
  }
  else if(format == 'rdf-schema') {
    if ( currentNodes.length === 0 ) return; // we dont need to write that
    //resultingTTLContent += "###  Number of Resources " + currentNodes.length + " ###\r\n";
    for ( var i = 0; i < currentNodes.length; i++ ) {
      // check for node type here and return false
      var j = i+1;
      //resultingTTLContent += "#  --------------------------- Resource  " + j + "------------------------- \r\n";
      resultingTTLContent += "\n";
      var addedElement = extractResourceDescriptionRDFS(currentNodes[i]);
      resultingTTLContent += addedElement;
      
     /* if ( addedElement.indexOf("WHYEMPTYNAME") !== -1 ) {
        return false;
      }*/
    }
    return true;
  }
  }
  
  function getPresentAttribute( selectedElement, element ){
    var attr = selectedElement.attributes();
    return (attr.indexOf(element) >= 0);
  }
  
  function extractResourceDescriptionRDF( node ){

    var entityProperties = node.getMyProperties();
    for ( var i=0 ; i< entityProperties.length; i++ ) {
      if(entityProperties[i].range() != node ) {
      var addedElement = extractPropertyDescriptionRDF(entityProperties[i]);
      if(addedElement && !addedElement.includes("undefined"))
      resultingTTLContent+= addedElement;
      }
    }
     if(addedElement && !addedElement.includes("undefined")) {
     var indent = getIndent(node.prefixRepresentation);
     resultingTTLContent += general_Label_languageExtractor(indent, node.label(), "<http://www.w3.org/2006/vcard/ns#hasFN>", true);
     resultingTTLContent += "\n";
    }
    else {
      var subject = node.prefixRepresentation;
      if(subject.startsWith(":")) {
        subject = "ex"+ subject;
      }
      resultingTTLContent += general_Label_languageExtractor(subject, node.label(), "<http://www.w3.org/2006/vcard/ns#hasFN>", true);
      resultingTTLContent += "\n";
    }

  }

  function extractResourceDescriptionRDFS (node) {

    var subject = node.prefixRepresentation;

    if(subject.startsWith(":")) {
      subject = "ex"+ subject;
    }
    var predicate = "rdf:type";
    var object = "rdfs:Resource";

    var objectDef = subject + " " + predicate + " " + object;

    var indent = getIndent(subject);
    objectDef += "; \r\n";

    var allProps = graph.getUnfilteredData().properties;
    var myProperties = [];
    var i;
    for ( i = 0; i < allProps.length; i++ ) {
      if ( allProps[i].domain() === node &&
        (   allProps[i].type() === "rdf:type" ||
        allProps[i].type() === "owl:allValuesFrom" ||
        allProps[i].type() === "owl:someValuesFrom")
      ) {
        myProperties.push(allProps[i]);
      }
    }

    for ( i = 0; i < myProperties.length; i++ ) {
    if ( myProperties[i].range().type() !== "owl:Thing" ) {
      if(myProperties[i].prefixRepresentation == 'wdt:P279') { 
        objectDef += indent + " " + "rdfs:SubClassOf" +
        " " + myProperties[i].range().prefixRepresentation + " ;\r\n";
      } /*else {
      objectDef += indent + " " + myProperties[i].prefixRepresentation +
        " " + myProperties[i].range().prefixRepresentation + " ;\r\n";
      }*/
       
    }
  }

    objectDef += general_Label_languageExtractor(indent, node.label(), "rdfs:label", true);
    return objectDef;



  }
  
  function extractPropertyDescriptionRDF( property ){
    var subject;
    var predicate;
    var object;
    var objectDef;
    var checkContent;

    subject = property.domain().prefixRepresentation;
    if(subject.startsWith(":")) {
      subject = "ex" + subject;
    }

    if( property.type() == "rdf:type" ) {
       predicate = "rdf:type";
    }
    else {
       predicate = property.prefixRepresentation;
       if(predicate) {
       if(predicate.startsWith(":")) {
        predicate = "ex" + predicate;
      }
    }  
    }
    if(property.type() == "owl:DatatypeProperty") {
      object = '"' + property.range().label()+'"^^'+ property.range().dType() ;
    }
    else {
      object = property.range().prefixRepresentation;
      if(object.startsWith(":")) {
        object = "ex" + object;
      }
    }
    var indent = getIndent(subject);   
    checkContent = subject+ " " + predicate + " " + object;
    
    if(!mainContent.includes(checkContent)) {
    if(prevSubject == subject) {
      objectDef = indent + " " + predicate + " " + object;
      objectDef += " ;\r\n";
      mainContent+= subject + " " + predicate + " " + object;
      mainContent+= "\n";
    }
    else {
      objectDef = subject + " " + predicate + " " + object;
      objectDef += " ;\r\n";
      mainContent+= subject + " " + predicate + " " + object;
      mainContent+= "\n";
    }
    }
    prevSubject = subject;
    return objectDef;
  }

  function extractPropertyDescriptionRDFS ( property ) {

   if(property.type() != "rdf:type" &&  property.prefixRepresentation != 'rdfs:subClassOf') {
    var subject = property.prefixRepresentation;

    if(subject.startsWith(":")) {
      subject = "ex" + subject;
    }

    var domain = property.domain().prefixRepresentation;
    var range = property.range().prefixRepresentation;
    var predicate = "rdf:type"; 
    var object = "rdf:Property;";

    var objectDef = subject + " " + predicate + " " + object;
    objectDef += " \r\n";
    var indent = getIndent(subject);
    labelDescription = general_Label_languageExtractor(indent, property.label(), "rdfs:label");
    objectDef += labelDescription;

    objectDef += indent + " rdfs:domain " + domain + ";\r\n";
    if(property.type() == "owl:DatatypeProperty") {
      
      objectDef += indent + " rdfs:range " + property.range().dType() + ".\r\n";
      if(property.range().dType() == "xsd:string") {
      objectDef += domain + " " + property.prefixRepresentation + " " + '"' + property.range().label()+'"^^'+ property.range().dType()  + ".\r\n";
      }
      else {
      objectDef += domain + " " + property.prefixRepresentation + " " + property.range().label() + ".\r\n";
      }
    } else {
    objectDef += indent + " rdfs:range " + range + ".\r\n"
    }
    return objectDef;
  }
  else {
    return;
  }

}
  
  
  exportTTLModule.resultingTTL_Content = function (){
    return resultingTTLContent;
  };
  
  function getIndent( name ){
    if ( name === undefined ) {
      return "WHYEMPTYNAME?";
    }
    return new Array(name.length + 1).join(" ");
  }
  
  function prepareHeader(){
    resultingTTLContent += "#################################################################\r\n";
    resultingTTLContent += "############################  KGraphX #########################\r\n ";
    resultingTTLContent += "#################################################################\r\n\r\n";
    
  }
  
  function preparePrefixList(){
    var ontoIri = graph.options().getGeneralMetaObjectProperty('iri');
    var prefixList = graph.options().prefixList();
    var prefixDef = [];
    //prefixDef.push('@prefix : \t\t<' + ontoIri + '> .');
    for ( var name in prefixList ) {
      if ( prefixList.hasOwnProperty(name) ) {
        prefixDef.push('@prefix ' + name + ': \t\t<' + prefixList[name] + '> .');
      }
    }
    //prefixDef.push('@base \t\t\t<' + ontoIri + '> .\r\n');
    
    for ( var i = 0; i < prefixDef.length; i++ ) {
      resultingTTLContent += prefixDef[i] + '\r\n';
    }
  }
  
  function prepareOntologyDef(){
    var ontoIri = graph.options().getGeneralMetaObjectProperty('iri');
    var indent = getIndent('<' + ontoIri + '>');
    /*resultingTTLContent += '<' + ontoIri + '> rdf:type owl:Ontology ;\r\n' +
      getOntologyTitle(indent) +
      getOntologyDescription(indent) +
      getOntologyVersion(indent) +
      getOntologyAuthor(indent);*/
    
    // close the statement;
   /* var s_needUpdate = resultingTTLContent;
    var s_lastPtr = s_needUpdate.lastIndexOf(";");
    resultingTTLContent = s_needUpdate.substring(0, s_lastPtr) + " . \r\n";*/
  }
  
  function getOntologyTitle( indent ){
    return general_languageExtractor(indent, "title", "dc:title");
  }
  
  function getOntologyDescription( indent ){
    return general_languageExtractor(indent, "description", "dc:description");
  }
  
  function getOntologyAuthor( indent ){
    var languageElement = graph.options().getGeneralMetaObjectProperty('author');
    if ( languageElement ) {
      if ( typeof languageElement !== "object" ) {
        if ( languageElement.length === 0 )
          return ""; // an empty string
        var aString = indent + " dc:creator " + '"' + languageElement + '";\r\n';
        return aString;
      }
      // we assume this thing is an array;
      var authorString = indent + " dc:creator " + '"';
      for ( var i = 0; i < languageElement.length - 1; i++ ) {
        authorString += languageElement[i] + ", ";
      }
      authorString += languageElement[languageElement.length - 1] + '";\r\n';
      return authorString;
    } else {
      return ""; // an empty string
    }
  }
  
  function getOntologyVersion( indent ){
    var languageElement = graph.options().getGeneralMetaObjectProperty('version');
    if ( languageElement ) {
      if ( typeof languageElement !== "object" ) {
        if ( languageElement.length === 0 )
          return ""; // an empty string
      }
      return general_languageExtractor(indent, "version", "owl:versionInfo");
    } else return ""; // an empty string
  }
  
  function general_languageExtractor( indent, metaObjectDescription, annotationDescription, endStatement ){
    var languageElement = graph.options().getGeneralMetaObjectProperty(metaObjectDescription);
    
    if ( typeof languageElement === 'object' ) {
      
      var resultingLanguages = [];
      for ( var name in languageElement ) {
        if ( languageElement.hasOwnProperty(name) ) {
          var content = languageElement[name];
          if ( name === "undefined" ) {
            resultingLanguages.push(indent + " " + annotationDescription + ' "' + content + '"@en; \r\n');
          }
          else {
            resultingLanguages.push(indent + " " + annotationDescription + ' "' + content + '"@' + name + '; \r\n');
          }
        }
      }
      // create resulting titles;
      
      var resultingString = "";
      for ( var i = 0; i < resultingLanguages.length; i++ ) {
        resultingString += resultingLanguages[i];
      }
      if ( endStatement && endStatement === true ) {
        var needUpdate = resultingString;
        var lastPtr = needUpdate.lastIndexOf(";");
        return needUpdate.substring(0, lastPtr) + ". \r\n";
      } else {
        return resultingString;
      }
      
    } else {
      if ( endStatement && endStatement === true ) {
        var s_needUpdate = indent + " " + annotationDescription + ' "' + languageElement + '"@en; \r\n';
        var s_lastPtr = s_needUpdate.lastIndexOf(";");
        return s_needUpdate.substring(0, s_lastPtr) + " . \r\n";
      }
      return indent + " " + annotationDescription + ' "' + languageElement + '"@en;\r\n';
    }
  }
  
  function general_Label_languageExtractor( indent, label, annotationDescription, endStatement ){
    var languageElement = label;
    
    if ( typeof languageElement === 'object' ) {
      var resultingLanguages = [];
      for ( var name in languageElement ) {
        if ( languageElement.hasOwnProperty(name) ) {
          var content = languageElement[name];
          if ( name === "undefined" ) {
            resultingLanguages.push(indent + " " + annotationDescription + ' "' + content + '"@en; \r\n');
          }
          else {
            resultingLanguages.push(indent + " " + annotationDescription + ' "' + content + '"@' + name + '; \r\n');
          }
        }
      }
      // create resulting titles;
      var resultingString = "";
      for ( var i = 0; i < resultingLanguages.length; i++ ) {
        resultingString += resultingLanguages[i];
      }
      if ( endStatement && endStatement === true ) {
        var needUpdate = resultingString;
        var lastPtr = needUpdate.lastIndexOf(";");
        return needUpdate.substring(0, lastPtr) + " . \r\n";
      } else {
        return resultingString;
      }
      
    } else {
      if ( endStatement && endStatement === true ) {
        var s_needUpdate = indent + " " + annotationDescription + ' "' + languageElement + '"@en; \r\n';
        var s_lastPtr = s_needUpdate.lastIndexOf(";");
        return s_needUpdate.substring(0, s_lastPtr) + " . \r\n";
      }
      return indent + " " + annotationDescription + ' "' + languageElement + '"@en; \r\n';
    }
  }
  
  return exportTTLModule;
};
