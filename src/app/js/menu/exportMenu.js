/**
 * Contains the logic for the export button.
 * @returns {{}}
 */
module.exports = function ( graph ){
  
  var exportMenu = {},
    exportFilename,
    exportTurtleButton,
    copyButton,
    exportableJsonText,
    saveToFuseki,
    currentToFuseki,
    exportTurtleRDFButton;
  
  var exportTTLModule = require("./exportTTLModule")(graph);
  
  
  String.prototype.replaceAll = function ( search, replacement ){
    var target = this;
    return target.split(search).join(replacement);
  };
  
  
  /**
   * Adds the export button to the website.
   */
  exportMenu.setup = function (){   
    exportTurtleButton = d3.select("#exportTurtle")
      .on("click", exportTurtle);

    saveToFuseki = d3.select("#saveToFuseki")
    .on("click", saveToFusekiFunc);

    exportTurtleRDFButton = d3.select("#exportTurtleRDF")
      .on("click", exportTurtleRDF);

    currentToFuseki = d3.select("#currentToFuseki")
      .on("click", currentToFusekiFunc);
    
    var menuEntry = d3.select("#m_export");
    menuEntry.on("mouseover", function (){
      var searchMenu = graph.options().searchMenu();
      searchMenu.hideSearchEntries();
      //exportMenu.exportAsUrl();
    });
  };

  function saveToFusekiFunc() {
    var dataset = document.getElementById('Dataset-name').value;
    if(dataset) {
    document.getElementById('fileid').click();

    d3.select("#fileid").on("change", function() {
      var contents;
      var file = d3.select("#fileid").property("files")[0];
      var reader = new FileReader();
      reader.onload = function(e) {
      contents = e.target.result;
      console.log(contents);

    let xhr = new XMLHttpRequest();
    let url = "http://localhost:3030/" + dataset + "/";
    
    xhr.open(
      "POST",
       url ,
      true
    );

    xhr.setRequestHeader('Content-Type', 'text/turtle;charset=utf-8');
    xhr.setRequestHeader('Origin', '*');
 
    xhr.onreadystatechange = function()
    {
    if(xhr.readyState == 4 && xhr.status == 200) {
        alert(xhr.responseText);
    }
    }
    xhr.send(contents);
    };
    reader.readAsText(file);
    d3.select("#fileid")[0] = [];
    })
  }
  else {
    graph.options().warningModule().showDatasetNameWarning();
  }
    
  }

  function currentToFusekiFunc() {
    var dataset = document.getElementById('Dataset-name-curr').value;
    if (dataset) {
    var format = "rdf-syntax";
    var success = exportTTLModule.requestExport(format);
    var result = exportTTLModule.resultingTTL_Content();
    if ( success ) {

    let xhr = new XMLHttpRequest();
    let url = "http://localhost:3030/" + dataset + "/";
    
    xhr.open(
      "POST",
       url ,
      true
    );

    xhr.setRequestHeader('Content-Type', 'text/turtle;charset=utf-8');
    xhr.setRequestHeader('Origin', '*');
   
    xhr.onreadystatechange = function()
    {
    if(xhr.readyState == 4 && xhr.status == 200) {
        alert(xhr.responseText);
    }
    }
    xhr.send(result);
  }
    }
    else {
      graph.options().warningModule().showDatasetNameWarning();
    }
  }



  function exportTurtleRDF() {
    var format = "rdf-schema";
    var success = exportTTLModule.requestExport(format);
    var result = exportTTLModule.resultingTTL_Content();
    var ontoTitle = "RDF-S";
    console.log("Exporter was successful: " + success);
    if ( success ) {
      var dataURI = "data:text/json;charset=utf-8," + encodeURIComponent(result);
      exportTurtleRDFButton.attr("href", dataURI)
        .attr("download", ontoTitle + ".ttl");
      
    } else {
      graph.options().warningModule().showExporterWarning();
      exportTurtleRDFButton.attr("href", window.location.href);
      d3.event.preventDefault(); // prevent the href to be called ( reloads the page otherwise )
    }

  }

  function exportTurtle(){
    var format = "rdf-syntax";
    var success = exportTTLModule.requestExport(format);
    var result = exportTTLModule.resultingTTL_Content();
    var ontoTitle = "RDF";
    console.log("Exporter was successful: " + success);
    if ( success ) {    
      // // write the data
      var dataURI = "data:text/json;charset=utf-8," + encodeURIComponent(result);
      
      exportTurtleButton.attr("href", dataURI)
        .attr("download", ontoTitle + ".ttl");
      
    } else {
      console.log("ShowWarning!");
      graph.options().warningModule().showExporterWarning();
      console.log("Stay on the page! " + window.location.href);
      exportTurtleButton.attr("href", window.location.href);
      d3.event.preventDefault(); // prevent the href to be called ( reloads the page otherwise )
    }
  }
  
  exportMenu.setFilename = function ( filename ){
    exportFilename = filename || "export";
  };
  
  exportMenu.setJsonText = function ( jsonText ){
    exportableJsonText = jsonText;
  };
   
  function setStyleSensitively( selector, styles ){
    var elements = d3.selectAll(selector);
    if ( elements.empty() ) {
      return;
    }
    
    styles.forEach(function ( style ){
      elements.each(function (){
        var element = d3.select(this);
        if ( !shouldntChangeInlineCss(element, style.name) ) {
          element.style(style.name, style.value);
        }
      });
    });
  }
  
  function shouldntChangeInlineCss( element, style ){
    return style === "fill" && hasBackgroundColorSet(element);
  }
  
  function hasBackgroundColorSet( element ){
    var data = element.datum();
    if ( data === undefined ) {
      return false;
    }
    return data.backgroundColor && !!data.backgroundColor();
  }
  
  exportMenu.createJSON_exportObject = function (){
    var i, j, k; // an index variable for the for-loops
    
    /** get data for exporter **/
      if (!graph.options().data()) {return {};} // return an empty json object
      // extract onotology information;
    var unfilteredData = graph.getUnfilteredData();
    var ontologyComment = graph.options().data()._comment;
    var metaObj = graph.options().getGeneralMetaObject();
    var header = graph.options().data().header;
    
    if ( metaObj.iri && metaObj.iri !== header.iri ) {
      header.iri = metaObj.iri;
    }
    if ( metaObj.title && metaObj.title !== header.title ) {
      header.title = metaObj.title;
    }
    if ( metaObj.version && metaObj.version !== header.version ) {
      header.version = metaObj.version;
    }
    if ( metaObj.author && metaObj.author !== header.author ) {
      header.author = metaObj.author;
    }
    if ( metaObj.description && metaObj.description !== header.description ) {
      header.description = metaObj.description;
    }
    
    
    var exportText = {};
    exportText._comment = ontologyComment;
    exportText.header = header;
    exportText.namespace = graph.options().data().namespace;
    if ( exportText.namespace === undefined ) {
      exportText.namespace = []; // just an empty namespace array
    }
    // we do have now the unfiltered data which needs to be transfered to class/classAttribute and property/propertyAttribute
    
    
    // var classAttributeString='classAttribute:[ \n';
    var nodes = unfilteredData.nodes;
    var nLen = nodes.length; // hope for compiler unroll
    var classObjects = [];
    var classAttributeObjects = [];
    for ( i = 0; i < nLen; i++ ) {
      var classObj = {};
      var classAttr = {};
      classObj.id = nodes[i].id();
      classObj.type = nodes[i].type();
      classObjects.push(classObj);
      
      // define the attributes object
      classAttr.id = nodes[i].id();
      classAttr.iri = nodes[i].iri();
      classAttr.baseIri = nodes[i].baseIri();
      classAttr.label = nodes[i].label();
      
      if ( nodes[i].attributes().length > 0 ) {
        classAttr.attributes = nodes[i].attributes();
      }
      if ( nodes[i].comment() ) {
        classAttr.comment = nodes[i].comment();
      }
      if ( nodes[i].annotations() ) {
        classAttr.annotations = nodes[i].annotations();
      }
      if ( nodes[i].description() ) {
        classAttr.description = nodes[i].description();
      }
      
      
      if ( nodes[i].individuals().length > 0 ) {
        var classIndividualElements = [];
        var nIndividuals = nodes[i].individuals();
        for ( j = 0; j < nIndividuals.length; j++ ) {
          var indObj = {};
          indObj.iri = nIndividuals[j].iri();
          indObj.baseIri = nIndividuals[j].baseIri();
          indObj.labels = nIndividuals[j].label();
          if ( nIndividuals[j].annotations() ) {
            indObj.annotations = nIndividuals[j].annotations();
          }
          if ( nIndividuals[j].description() ) {
            indObj.description = nIndividuals[j].description();
          }
          if ( nIndividuals[j].comment() ) {
            indObj.comment = nIndividuals[j].comment();
          }
          classIndividualElements.push(indObj);
        }
        classAttr.individuals = classIndividualElements;
      }
      
      var equalsForAttributes = undefined;
      if ( nodes[i].equivalents().length > 0 ) {
        equalsForAttributes = [];
        var equals = nodes[i].equivalents();
        for ( j = 0; j < equals.length; j++ ) {
          var eqObj = {};
          var eqAttr = {};
          eqObj.id = equals[j].id();
          equalsForAttributes.push(equals[j].id());
          eqObj.type = equals[j].type();
          classObjects.push(eqObj);
          
          eqAttr.id = equals[j].id();
          eqAttr.iri = equals[j].iri();
          eqAttr.baseIri = equals[j].baseIri();
          eqAttr.label = equals[j].label();
          
          if ( equals[j].attributes().length > 0 ) {
            eqAttr.attributes = equals[j].attributes();
          }
          if ( equals[j].comment() ) {
            eqAttr.comment = equals[j].comment();
          }
          if ( equals[j].individuals().length > 0 ) {
            eqAttr.individuals = equals[j].individuals();
          }
          if ( equals[j].annotations() ) {
            eqAttr.annotations = equals[j].annotations();
          }
          if ( equals[j].description() ) {
            eqAttr.description = equals[j].description();
          }
          
          if ( equals[j].individuals().length > 0 ) {
            var e_classIndividualElements = [];
            var e_nIndividuals = equals[i].individuals();
            for ( k = 0; k < e_nIndividuals.length; k++ ) {
              var e_indObj = {};
              e_indObj.iri = e_nIndividuals[k].iri();
              e_indObj.baseIri = e_nIndividuals[k].baseIri();
              e_indObj.labels = e_nIndividuals[k].label();
              
              if ( e_nIndividuals[k].annotations() ) {
                e_indObj.annotations = e_nIndividuals[k].annotations();
              }
              if ( e_nIndividuals[k].description() ) {
                e_indObj.description = e_nIndividuals[k].description();
              }
              if ( e_nIndividuals[k].comment() ) {
                e_indObj.comment = e_nIndividuals[k].comment();
              }
              e_classIndividualElements.push(e_indObj);
            }
            eqAttr.individuals = e_classIndividualElements;
          }
          
          classAttributeObjects.push(eqAttr);
        }
      }
      if ( equalsForAttributes && equalsForAttributes.length > 0 ) {
        classAttr.equivalent = equalsForAttributes;
      }
      
      // classAttr.subClasses=nodes[i].subClasses(); // not needed
      // classAttr.instances=nodes[i].instances();
      
      //
      // .complement(element.complement)
      // .disjointUnion(element.disjointUnion)
      // .description(element.description)
      // .equivalents(element.equivalent)
      // .intersection(element.intersection)
      // .type(element.type) Ignore, because we predefined it
      // .union(element.union)
      classAttributeObjects.push(classAttr);
    }
    
    /** -- properties -- **/
    var properties = unfilteredData.properties;
    var pLen = properties.length; // hope for compiler unroll
    var propertyObjects = [];
    var propertyAttributeObjects = [];
    
    for ( i = 0; i < pLen; i++ ) {
      var pObj = {};
      var pAttr = {};
      pObj.id = properties[i].id();
      pObj.type = properties[i].type();
      propertyObjects.push(pObj);
      
      // // define the attributes object
      pAttr.id = properties[i].id();
      pAttr.iri = properties[i].iri();
      pAttr.baseIri = properties[i].baseIri();
      pAttr.label = properties[i].label();
      
      if ( properties[i].attributes().length > 0 ) {
        pAttr.attributes = properties[i].attributes();
      }
      if ( properties[i].comment() ) {
        pAttr.comment = properties[i].comment();
      }
      
      if ( properties[i].annotations() ) {
        pAttr.annotations = properties[i].annotations();
      }
      if ( properties[i].maxCardinality() ) {
        pAttr.maxCardinality = properties[i].maxCardinality();
      }
      if ( properties[i].minCardinality() ) {
        pAttr.minCardinality = properties[i].minCardinality();
      }
      if ( properties[i].cardinality() ) {
        pAttr.cardinality = properties[i].cardinality();
      }
      if ( properties[i].description() ) {
        pAttr.description = properties[i].description();
      }
      
      pAttr.domain = properties[i].domain().id();
      pAttr.range = properties[i].range().id();
      // sub properties;
      if ( properties[i].subproperties() ) {
        var subProps = properties[i].subproperties();
        var subPropsIdArray = [];
        for ( j = 0; j < subProps.length; j++ ) {
          if ( subProps[j].id )
            subPropsIdArray.push(subProps[j].id());
        }
        pAttr.subproperty = subPropsIdArray;
      }
      
      // super properties
      if ( properties[i].superproperties() ) {
        var superProps = properties[i].superproperties();
        var superPropsIdArray = [];
        for ( j = 0; j < superProps.length; j++ ) {
          if ( superProps[j].id )
            superPropsIdArray.push(superProps[j].id());
        }
        pAttr.superproperty = superPropsIdArray;
      }
      
      // check for inverse element
      if ( properties[i].inverse() ) {
        if ( properties[i].inverse().id )
          pAttr.inverse = properties[i].inverse().id();
      }
      propertyAttributeObjects.push(pAttr);
    }
    
    exportText.class = classObjects;
    exportText.classAttribute = classAttributeObjects;
    exportText.property = propertyObjects;
    exportText.propertyAttribute = propertyAttributeObjects;
    
    
    var nodeElements = graph.graphNodeElements();  // get visible nodes
    var propElements = graph.graphLabelElements(); // get visible labels
    // var jsonObj = JSON.parse(exportableJsonText);	   // reparse the original input json
    
    /** modify comment **/
    var comment = exportText._comment;
    var additionalString = " [Additional Information added by WebVOWL Exporter Version: " + "@@WEBVOWL_VERSION" + "]";
    // adding new string to comment only if it does not exist
    if ( comment.indexOf(additionalString) === -1 ) {
      exportText._comment = comment + " [Additional Information added by WebVOWL Exporter Version: " + "@@WEBVOWL_VERSION" + "]";
    }
    
    var classAttribute = exportText.classAttribute;
    var propAttribute = exportText.propertyAttribute;
    /**  remove previously stored variables **/
    for ( i = 0; i < classAttribute.length; i++ ) {
      var classObj_del = classAttribute[i];
      delete classObj_del.pos;
      delete classObj_del.pinned;
    }
    var propertyObj;
    for ( i = 0; i < propAttribute.length; i++ ) {
      propertyObj = propAttribute[i];
      delete propertyObj.pos;
      delete propertyObj.pinned;
    }
    /**  add new variables to jsonObj  **/
    // class attribute variables
    nodeElements.each(function ( node ){
      var nodeId = node.id();
      for ( i = 0; i < classAttribute.length; i++ ) {
        var classObj = classAttribute[i];
        if ( classObj.id === nodeId ) {
          // store relative positions
          classObj.pos = [parseFloat(node.x.toFixed(2)), parseFloat(node.y.toFixed(2))];
          if ( node.pinned() )
            classObj.pinned = true;
          break;
        }
      }
    });
    // property attribute variables
    for ( j = 0; j < propElements.length; j++ ) {
      var correspondingProp = propElements[j].property();
      for ( i = 0; i < propAttribute.length; i++ ) {
        propertyObj = propAttribute[i];
        if ( propertyObj.id === correspondingProp.id() ) {
          propertyObj.pos = [parseFloat(propElements[j].x.toFixed(2)), parseFloat(propElements[j].y.toFixed(2))];
          if ( propElements[j].pinned() )
            propertyObj.pinned = true;
          break;
        }
      }
    }
    /** create the variable for settings and set their values **/
    exportText.settings = {};
    
    // Global Settings
    var zoom = graph.scaleFactor();
    var paused = graph.paused();
    var translation = [parseFloat(graph.translation()[0].toFixed(2)), parseFloat(graph.translation()[1].toFixed(2))];
    exportText.settings.global = {};
    exportText.settings.global.zoom = zoom.toFixed(2);
    exportText.settings.global.translation = translation;
    exportText.settings.global.paused = paused;
    
    // shared variable declaration
    var cb_text;
    var isEnabled;
    var cb_obj;
    
    // Gravity Settings
    var classDistance = graph.options().classDistance();
    var datatypeDistance = graph.options().datatypeDistance();
    exportText.settings.gravity = {};
    exportText.settings.gravity.classDistance = classDistance;
    exportText.settings.gravity.datatypeDistance = datatypeDistance;
    
    // Filter Settings
    var fMenu = graph.options().filterMenu();
    var fContainer = fMenu.getCheckBoxContainer();
    var cbCont = [];
    for ( i = 0; i < fContainer.length; i++ ) {
      cb_text = fContainer[i].checkbox.attr("id");
      isEnabled = fContainer[i].checkbox.property("checked");
      cb_obj = {};
      cb_obj.id = cb_text;
      cb_obj.checked = isEnabled;
      cbCont.push(cb_obj);
    }
    var degreeSliderVal = fMenu.getDegreeSliderValue();
    exportText.settings.filter = {};
    exportText.settings.filter.checkBox = cbCont;
    exportText.settings.filter.degreeSliderValue = degreeSliderVal;
    
    // Modes Settings
    var mMenu = graph.options().modeMenu();
    var mContainer = mMenu.getCheckBoxContainer();
    var cb_modes = [];
    for ( i = 0; i < mContainer.length; i++ ) {
      cb_text = mContainer[i].attr("id");
      isEnabled = mContainer[i].property("checked");
      cb_obj = {};
      cb_obj.id = cb_text;
      cb_obj.checked = isEnabled;
      cb_modes.push(cb_obj);
    }
    var colorSwitchState = mMenu.colorModeState();
    exportText.settings.modes = {};
    exportText.settings.modes.checkBox = cb_modes;
    exportText.settings.modes.colorSwitchState = colorSwitchState;
    
    var exportObj = {};
    // todo: [ ] find better way for ordering the objects
    // hack for ordering of objects, so settings is after metrics
    exportObj._comment = exportText._comment;
    exportObj.header = exportText.header;
    exportObj.namespace = exportText.namespace;
    exportObj.metrics = exportText.metrics;
    exportObj.settings = exportText.settings;
    exportObj.class = exportText.class;
    exportObj.classAttribute = exportText.classAttribute;
    exportObj.property = exportText.property;
    exportObj.propertyAttribute = exportText.propertyAttribute;
    
    return exportObj;
  };
   
  var curveFunction = d3.svg.line()
    .x(function ( d ){
      return d.x;
    })
    .y(function ( d ){
      return d.y;
    })
    .interpolate("cardinal");
  var loopFunction = d3.svg.line()
    .x(function ( d ){
      return d.x;
    })
    .y(function ( d ){
      return d.y;
    })
    .interpolate("cardinal")
    .tension(-1);
  
  function calculateRadian( angle ){
    angle = angle % 360;
    if ( angle < 0 ) {
      angle = angle + 360;
    }
    return (Math.PI * angle) / 180;
  }
  
  function calculateAngle( radian ){
    return radian * (180 / Math.PI);
  }
  
  return exportMenu;
};
