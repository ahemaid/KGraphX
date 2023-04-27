var BaseProperty = require("../BaseProperty");

module.exports = (function (){
  
  var o = function ( graph ){
    BaseProperty.apply(this, arguments);
    
    var that = this,
      superDrawFunction = that.draw,
      // changed 
      // label = "Subclass of";
      label = "isTypeOf";
    
    this.draw = function ( labelGroup ){
      that.labelVisible(!graph.options().compactNotation());
      return superDrawFunction(labelGroup);
    };
    
    // Disallow overwriting the label
    this.label = function ( p ){
      if ( !arguments.length ) return label;
      return this;
    };
    
    this.linkType("dotted")
      .markerType("white")
      .styleClass("subclass")
      .type("rdf:type");
    
    that.baseIri("http://www.w3.org/2000/01/rdf-schema#");
    that.iri("http://www.w3.org/2000/01/rdf-schema#subClassOf");
    
  };
  o.prototype = Object.create(BaseProperty.prototype);
  o.prototype.constructor = o;
  
  return o;
}());