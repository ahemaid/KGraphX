/**
 * Contains the logic for the sidebar.
 * @param graph the graph that belongs to these controls
 * @returns {{}}
 */
module.exports = function ( graph ){
  
  var leftSidebar = {},
    languageTools = webvowl.util.languageTools(),
    elementTools = webvowl.util.elementTools();
  var collapseButton = d3.select("#leftSideBarCollapseButton");
  var visibleSidebar = 0;
  var backupVisibility = 0;
  var sideBarContent = d3.select("#leftSideBarContent");
  var sideBarContainer = d3.select("#containerForLeftSideBar");
  var defaultClassSelectionContainers = [];
  var defaultDatatypeSelectionContainers = [];
  var defaultPropertySelectionContainers = [];
  
  leftSidebar.setup = function (){
    setupCollapsing();
    leftSidebar.initSideBarAnimation();
    
    collapseButton.on("click", function (){
      graph.options().navigationMenu().hideAllMenus();
      var settingValue = parseInt(leftSidebar.getSidebarVisibility());
      if ( settingValue === 0 ) leftSidebar.showSidebar(1);
      else                  leftSidebar.showSidebar(0);
      backupVisibility = settingValue;
    });
    
    setupSelectionContainers();
    d3.select("#WarningErrorMessages").node().addEventListener("animationend", function (){
      d3.select("#WarningErrorMessages").style("-webkit-animation-name", "none");
    });
    
  };
  
  leftSidebar.hideCollapseButton = function ( val ){
    sideBarContainer.classed("hidden", val);
  };


  
  
  function unselectAllElements( container ){
    for ( var i = 0; i < container.length; i++ )
      container[i].classed("defaultSelected", false);
  }
  
  function selectThisDefaultElement( element ){
    d3.select(element).classed("defaultSelected", true);
  }
  
  function updateDefaultNameInAccordion( element, identifier ){
    let this_id = element.id;
    
    let element_innserHtml = this_id.replace("selectedClass", "");
    var elementDescription = "";
    if ( identifier === "defaultClass" ) elementDescription = " Resource: ";
    if ( identifier === "defaultDatatype" ) elementDescription = " Datatype: ";
    if ( identifier === "defaultProperty" ) elementDescription = " Property: ";
    
    d3.select("#" + identifier).node().innerHTML = elementDescription + "";
    d3.select("#" + identifier).node().title = element_innserHtml;
  }
  
  function classSelectorFunction(){
    // return;
    unselectAllElements(defaultClassSelectionContainers);
    selectThisDefaultElement(this);
    updateDefaultNameInAccordion(this, "defaultClass");
  }
  
  function datatypeSelectorFunction(){
    unselectAllElements(defaultDatatypeSelectionContainers);
    selectThisDefaultElement(this);
    updateDefaultNameInAccordion(this, "defaultDatatype");
  }
  
  function propertySelectorFunction(){
    unselectAllElements(defaultPropertySelectionContainers);
    selectThisDefaultElement(this);
    updateDefaultNameInAccordion(this, "defaultProperty");
  }
  
  
  function setupSelectionContainers(){

    var classContainer = d3.select("#classContainer");
    var datatypeContainer = d3.select("#datatypeContainer");
    var propertyContainer = d3.select("#propertyContainer");
    // create the supported elements
    
    var defaultClass = "owl:Class";
    var defaultDatatype = "xsd:boolean";
    var defaultProperty = "owl:objectProperty";
    
    var supportedClasses = graph.options().supportedClasses();
    var supportedDatatypes = graph.options().supportedDatatypes();
    var supportedProperties = graph.options().supportedProperties();
    var i;
    var canvasArea = d3.select("#canvasArea");
    // canvasArea.on("drop", dropClass);
    
    canvasArea.on("drop", function( ){
    //   console.log("event of drop class")
    //  console.log(this)
    //  console.log(event)
     graph.modified_dblClickFunction();
   });
    
    for ( i = 0; i < supportedClasses.length; i++ ) {
      var aClassSelectionContainer;
      let svg_class;
      if(supportedClasses[i] == 'owl:Class'){
        
      svg_class =  "<span id='span_class' draggable='true' class='side-menu-drag'> <svg id='svg_class' width='100' height='100'><circle id='circle_class' cx='35' cy='35' r='35' stroke-width='4' fill='rgb(170,204,255)'></circle><text x='35%' y='35%' text-anchor='middle' stroke-width='1px' dy='.1em'>Resource</text>" + supportedClasses[i] + "</svg> </span>";
      } else {
         svg_class = "<span style='display:none;' id='span_thing' draggable='true' class='side-menu-drag'> <svg  id='svg_thing' width='100' height='100'> <circle  id='circle_thing' cx='40' cy='40' r='30' style='width: 100%; height: 100%; stroke-width: 5; stroke-dasharray: 10, 8; fill: #fff; stroke: black;'></circle> <text x='40%' y='40%' text-anchor='middle' stroke-width='1px' dy='.1em'>Thing</text>" + supportedClasses[i] + "</svg> </span>";
      }
      aClassSelectionContainer = classContainer.append("div");
      aClassSelectionContainer.classed("containerForDefaultSelection", true);
      aClassSelectionContainer.classed("noselect", true);
      // console.log('supportedClasses[i]');
      // console.log(supportedClasses[i]);
      aClassSelectionContainer.node().id = "selectedClass" + supportedClasses[i];
      aClassSelectionContainer.node().innerHTML =  svg_class;
      
      if ( supportedClasses[i] === defaultClass ) {
        selectThisDefaultElement(aClassSelectionContainer.node());
      }
      aClassSelectionContainer.on("click", classSelectorFunction);
      aClassSelectionContainer.on("dragstart", classSelectorFunction);
      defaultClassSelectionContainers.push(aClassSelectionContainer);
    }
    
    for ( i = 0; i < supportedDatatypes.length; i++ ) {
      let svg_dataType = supportedDatatypes[i];
      if(supportedDatatypes[i] == 'rdfs:Literal'){
        svg_dataType =  "<svg style='display:none' height='30'width='200'><rect x='20' y='0' width='100' height='25' style='fill:rgb(255,204,51);stroke-width:3;stroke:rgb(0,0,0)' stroke-dasharray='5,5' />  	<text x='75' y='18' text-anchor='middle' stroke-width='1px' dy='.1em'>Literal</text>" + supportedDatatypes[i] + "</svg>";
      } else if(supportedDatatypes[i] == 'xsd:boolean'){
        svg_dataType =  "<svg height='30'width='200'><rect x='20' y='0' width='100' height='25' style='fill:rgb(255,204,51);stroke-width:2;stroke:rgb(0,0,0)'  />  	<text x='75' y='18' text-anchor='middle' stroke-width='1px' dy='.1em'>boolean</text>" + supportedDatatypes[i] + "</svg>";
      } else if(supportedDatatypes[i] == 'xsd:double'){
        svg_dataType =  "<svg height='30'width='200'><rect x='20' y='0' width='100' height='25' style='fill:rgb(255,204,51);stroke-width:2;stroke:rgb(0,0,0)'  />  	<text x='75' y='18' text-anchor='middle' stroke-width='1px' dy='.1em'>double</text>" + supportedDatatypes[i] + "</svg>";
      } else if(supportedDatatypes[i] == 'xsd:integer'){
        svg_dataType =  "<svg height='30'width='200'><rect x='20' y='0' width='100' height='25' style='fill:rgb(255,204,51);stroke-width:2;stroke:rgb(0,0,0)'  />  	<text x='75' y='18' text-anchor='middle' stroke-width='1px' dy='.1em'>integer</text>" + supportedDatatypes[i] + "</svg>";
      } else if(supportedDatatypes[i] == 'xsd:string'){
        svg_dataType =  "<svg height='30'width='200'><rect x='20' y='0' width='100' height='25' style='fill:rgb(255,204,51);stroke-width:2;stroke:rgb(0,0,0)'  />  	<text x='75' y='18' text-anchor='middle' stroke-width='1px' dy='.1em'>string</text>" + supportedDatatypes[i] + "</svg>";
      } else if(supportedDatatypes[i] == 'undefined'){
        svg_dataType =  "<div style='display:none'><svg height='30'width='200'><rect x='20' y='0' width='100' height='25' style='fill:rgb(255,204,51);stroke-width:2;stroke:rgb(0,0,0)'  />  	<text x='75' y='18' text-anchor='middle' stroke-width='1px' dy='.1em'>undefined</text>" + supportedDatatypes[i] + "</svg></div>";
      }
      var aDTSelectionContainer = datatypeContainer.append("div");
      aDTSelectionContainer.classed("containerForDefaultSelection", true);
      aDTSelectionContainer.classed("noselect", true);
      //Removed selectedDatatype
      aDTSelectionContainer.node().id = supportedDatatypes[i];
      aDTSelectionContainer.node().innerHTML = svg_dataType;
      
      if ( supportedDatatypes[i] === defaultDatatype ) {
        selectThisDefaultElement(aDTSelectionContainer.node());
      }
      aDTSelectionContainer.on("click", datatypeSelectorFunction);
      defaultDatatypeSelectionContainers.push(aDTSelectionContainer);
    }
    var hide_property = true;
    for ( i = 0; i < supportedProperties.length; i++ ) {

      let svg_class = supportedProperties[i];
      if(supportedProperties[i] == 'owl:objectProperty'){
        hide_property = false;
        svg_class = "<svg height='50'width='200'> <defs>    <marker id='arrow' markerWidth='10' markerHeight='10' refX='0' refY='3' orient='auto' markerUnits='strokeWidth'>      <path d='M0,0 L0,6 L9,3 z' fill='#000' />    </marker>  </defs>  	<line x1='0' y1='18' x2='50' y2='18' style='stroke:#000;stroke-width:2' />    <rect x='20' y='0' width='100' height='25' style='fill:rgb(170,204,255);' />  	<text x='75' y='18' text-anchor='middle' stroke-width='1px' dy='.1em'>hasRelation</text>    <line x1='120' y1='18' x2='140' y2='18' marker-end='url(#arrow)' style='stroke:#000;stroke-width:2' /></svg>"
      } else if(supportedProperties[i] == 'rdf:type'){
        hide_property = false ;
        svg_class = "<svg height='50'width='200'> <defs>    <marker id='arrow' markerWidth='10' markerHeight='10' refX='0' refY='3' orient='auto' markerUnits='strokeWidth'>      <path d='M0,0 L0,6 L9,3 z' fill='#000' />    </marker>  </defs>  	<line x1='0' y1='15' x2='50' y2='15'stroke-dasharray='5,5' style='stroke:#000;stroke-width:2' />   	<text x='75' y='15' text-anchor='middle' stroke-width='1px' dy='.1em'>isTypeOf</text>    <line x1='100' y1='15' x2='130' stroke-dasharray='5,5' y2='15' marker-end='url(#arrow)' style='stroke:#000;stroke-width:2' /></svg>";
      } else if(supportedProperties[i] == 'owl:allValuesFrom'){
        svg_class = "<svg style='display:none' height='50'width='200'> <defs>    <marker id='arrow'  markerWidth='10' markerHeight='10' refX='0' refY='3' orient='auto' markerUnits='strokeWidth'>      <path d='M0,0 L0,6 L9,3 z' fill='rgb(170,204,255)' />    </marker>  </defs>  	<line x1='0' y1='18' x2='50' y2='18' style='stroke:rgb(170,204,255);stroke-width:2' />    <rect x='20' y='0' width='100' height='25' style='fill:rgb(170,204,255);' />  	<text x='75' y='18' text-anchor='middle' stroke-width='1px' dy='.1em'>allValuesFrom</text> <text x='130' y='30' text-anchor='middle' stroke-width='1px' dy='.1em'>∀</text>   <line x1='120' y1='18' x2='140' y2='18' marker-end='url(#arrow)' style='stroke:rgb(170,204,255);stroke-width:2' /></svg>";
      }  else if(supportedProperties[i] == 'owl:someValuesFrom'){
        svg_class = "<svg style='display:none' height='50'width='200'> <defs>    <marker id='arrow'  markerWidth='10' markerHeight='10' refX='0' refY='3' orient='auto' markerUnits='strokeWidth'>      <path d='M0,0 L0,6 L9,3 z'style='fill:rgb(170,204,255)' />    </marker>  </defs>  	<line x1='0' y1='18' x2='50' y2='18' style='stroke:rgb(170,204,255);stroke-width:2' />    <rect x='20' y='0' width='100' height='25' style='fill:rgb(170,204,255)' />  	<text x='75' y='18' text-anchor='middle' stroke-width='1px' dy='.1em'>someValuesFrom</text>  <text x='130' y='30' text-anchor='middle' stroke-width='1px' dy='.1em'>∃</text>   <line x1='120' y1='18' x2='140' y2='18' marker-end='url(#arrow)' style='stroke:rgb(170,204,255);stroke-width:2' /></svg>";
      } else if(supportedProperties[i] == 'owl:FunctionalProperty'){
        svg_class = "<svg style='display:none' height='50' width='200'><defs><marker id='arrow' markerWidth='10' markerHeight='10' refX='0' refY='3' orient='auto' markerUnits='strokeWidth'><path d='M0,0 L0,6 L9,3 z' fill='#000'/></marker></defs><line x1='0' y1='18' x2='50' y2='18' style='stroke:#000;stroke-width:2'/><rect x='20' y='0' width='100' height='25' style='fill:rgb(170,204,255);'/><text x='75' y='18' text-anchor='middle' stroke-width='1px' dy='.1em'>Functional</text><line x1='120' y1='18' x2='140' y2='18' marker-end='url(#arrow)' style='stroke:#000;stroke-width:2'/><text x='130' y='35' fill='black'>F</text></svg>";
      } else if(supportedProperties[i] == 'owl:TransitiveProperty'){
        svg_class = "<svg style='display:none' height='50'width='200'> <defs>    <marker id='arrow' markerWidth='10' markerHeight='10' refX='0' refY='3' orient='auto' markerUnits='strokeWidth'>      <path d='M0,0 L0,6 L9,3 z' fill='#000' />    </marker>  </defs>  	<line x1='0' y1='18' x2='50' y2='18' style='stroke:#000;stroke-width:2' />    <rect x='20' y='0' width='100' height='25' style='fill:rgb(170,204,255);' />  	<text x='75' y='18' text-anchor='middle' stroke-width='1px' dy='.1em'>Transitive</text>    <line x1='120' y1='18' x2='140' y2='18' marker-end='url(#arrow)' style='stroke:#000;stroke-width:2' /> <text x='130' y='35' fill='black'>T</text> </svg>"
      } else if(supportedProperties[i] == 'owl:SymmetricProperty'){
        svg_class = "<svg style='display:none' height='50'width='200'> <defs>    <marker id='arrow' markerWidth='10' markerHeight='10' refX='0' refY='3' orient='auto' markerUnits='strokeWidth'>      <path d='M0,0 L0,6 L9,3 z' fill='#000' />    </marker>  </defs>  	<line x1='0' y1='18' x2='50' y2='18' style='stroke:#000;stroke-width:2' />    <rect x='20' y='0' width='100' height='25' style='fill:rgb(170,204,255);' />  	<text x='75' y='18' text-anchor='middle' stroke-width='1px' dy='.1em'>Symmetric</text>    <line x1='120' y1='18' x2='140' y2='18' marker-end='url(#arrow)' style='stroke:#000;stroke-width:2' /> <text x='130' y='35' fill='black'>S</text> </svg>"
      } else if(supportedProperties[i] == 'owl:InverseFunctionalProperty'){
        svg_class = "<svg style='display:none' height='50'width='200'> <defs>    <marker id='arrow' markerWidth='10' markerHeight='10' refX='0' refY='3' orient='auto' markerUnits='strokeWidth'>      <path d='M0,0 L0,6 L9,3 z' fill='#000' />    </marker>  </defs>  	<line x1='0' y1='18' x2='50' y2='18' style='stroke:#000;stroke-width:2' />    <rect x='20' y='0' width='100' height='25' style='fill:rgb(170,204,255);' />  	<text x='75' y='18' text-anchor='middle' stroke-width='1px' dy='.1em'>Inverse Functional</text>    <line x1='120' y1='18' x2='140' y2='18' marker-end='url(#arrow)' style='stroke:#000;stroke-width:2' />  <text x='130' y='35' fill='black'>IF</text> </svg>"
      } else if (supportedProperties[i] == 'owl:equivalenceClass'){
        svg_class = "<svg style='display:none' height='50' width='200'> <text x='40' y='15' fill='black'>Are Same</text> <line x1='0' y1='30' x2='150' y2='30' style='stroke:rgb(0,0,0);stroke-width:3' /> <line x1='0' y1='40' x2='150' y2='40' style='stroke:rgb(0,0,0);stroke-width:3' /> </svg>";
      } else if(supportedProperties[i] == 'owl:differentFrom') {
        svg_class = "<svg style='display:none' height='50' width='200'>  <text x='40' y='15' fill='black'>Are Different</text> <line x1='0' y1='25' x2='150' y2='25' style='stroke:rgb(0,0,0);stroke-width:3' />  <line x1='0' y1='35' x2='150' y2='35' style='stroke:rgb(0,0,0);stroke-width:3' />  <circle cx='80' cy='32' r='14' stroke='black' stroke-width='3' fill='rgb(200,255,255)' /> <line x1='70' y1='29' x2='90' y2='29' style='stroke:rgb(0,0,0);stroke-width:2' /> <line x1='70' y1='34' x2='90' y2='34' style='stroke:rgb(0,0,0);stroke-width:2' /> <line x1='85' y1='24' x2='75' y2='40' style='stroke:rgb(0,0,0);stroke-width:2' /> </svg>";
      } else if(supportedProperties[i] == 'owl:AllDifferent') {
        svg_class = "<svg style='display:none' height='50' width='200'>  <text x='40' y='15' fill='black'>All Different</text> <line x1='0' y1='25' x2='150' y2='25' style='stroke:rgb(0,0,0);stroke-width:3' />  <line x1='0' y1='35' x2='150' y2='35' style='stroke:rgb(0,0,0);stroke-width:3' />  <circle cx='80' cy='32' r='14' stroke='black' stroke-width='3' fill='rgb(242,96,103)' /> <line x1='70' y1='29' x2='90' y2='29' style='stroke:rgb(0,0,0);stroke-width:2' /> <line x1='70' y1='34' x2='90' y2='34' style='stroke:rgb(0,0,0);stroke-width:2' /> <line x1='85' y1='24' x2='75' y2='40' style='stroke:rgb(0,0,0);stroke-width:2' /> </svg>";
      } else if(supportedProperties[i] == 'owl:intersectionOf') {
        svg_class = "<svg style='display:none' height='50'width='200'> <defs> <marker id='arrow' markerWidth='10' markerHeight='10' refX='0' refY='3' orient='auto' markerUnits='strokeWidth'> <path d='M0,0 L0,6 L9,3 z' fill='#000' /> </marker> </defs> <line x1='0' y1='18' x2='40' y2='18' style='stroke:#000;stroke-width:2' /> <rect x='15' y='4' width='120' height='25' style='fill:rgb(170,204,255);' /> <text x='75' y='18' text-anchor='middle' stroke-width='1px' dy='.1em'>IntersectionOf</text> <line x1='135' y1='18' x2='140' y2='18' marker-end='url(#arrow)' style='stroke:#000;stroke-width:2' /> <path d='M150 40 L80 170 L290 287 Z' stroke='black' stroke-width='2' fill='none' /> </svg>";
      }


      var aPropSelectionContainer = propertyContainer.append("div");
      aPropSelectionContainer.classed("containerForDefaultSelection", true);
      aPropSelectionContainer.classed("noselect", true);
      // hides properties for this phase
      aPropSelectionContainer.classed("hidden", true);
      if(supportedProperties[i] == 'owl:objectProperty' || supportedProperties[i] == 'rdf:type'){
          
        aPropSelectionContainer.classed("hidden", false);
      }
      aPropSelectionContainer.node().id = "selectedClass" + supportedProperties[i];
      aPropSelectionContainer.node().innerHTML = svg_class; // supportedProperties[i];
      aPropSelectionContainer.on("click", propertySelectorFunction);
      if ( supportedProperties[i] === defaultProperty ) {
        selectThisDefaultElement(aPropSelectionContainer.node());
      }
      defaultPropertySelectionContainers.push(aPropSelectionContainer);
    }
  }
  function dragClass(){
    classSelectorFunction();
  }
  function dropClass(ev,that){
    ev.preventDefault();
    // console.log("event of drop class")
    // console.log(ev,that)
    graph.modified_dblClickFunction();
  }
  function setupCollapsing(){
    // adapted version of this example: http://www.normansblog.de/simple-jquery-accordion/
    function collapseContainers( containers ){
      containers.classed("hidden", true);
    }
    
    function expandContainers( containers ){
      containers.classed("hidden", false);
    }
    
    var triggers = d3.selectAll(".accordion-trigger");
    
    // Collapse all inactive triggers on startup
    // collapseContainers(d3.selectAll(".accordion-trigger:not(.accordion-trigger-active) + div"));
    
    triggers.on("click", function (){
      var selectedTrigger = d3.select(this);
      if ( selectedTrigger.classed("accordion-trigger-active") ) {
        // Collapse the active (which is also the selected) trigger
        collapseContainers(d3.select(selectedTrigger.node().nextElementSibling));
        selectedTrigger.classed("accordion-trigger-active", false);
      } else {
        // Collapse the other trigger ...
        // collapseContainers(d3.selectAll(".accordion-trigger-active + div"));
        // activeTriggers.classed("accordion-trigger-active", false);
        // ... and expand the selected one
        expandContainers(d3.select(selectedTrigger.node().nextElementSibling));
        selectedTrigger.classed("accordion-trigger-active", true);
      }
    });
  }
  
  
  leftSidebar.isSidebarVisible = function (){
    return visibleSidebar;
  };
  
  leftSidebar.updateSideBarVis = function ( init ){
    var vis = leftSidebar.getSidebarVisibility();
    leftSidebar.showSidebar(parseInt(vis), init);
  };
  
  leftSidebar.initSideBarAnimation = function (){
    sideBarContainer.node().addEventListener("animationend", function (){
      sideBarContent.classed("hidden", !visibleSidebar);
      if ( visibleSidebar === true ) {
        sideBarContainer.style("width", "200px");
        sideBarContent.classed("hidden", false);
        d3.select("#leftSideBarCollapseButton").style("left", "200px");
        d3.select("#leftSideBarCollapseButton").classed("hidden", false);
        d3.select("#WarningErrorMessages").style("left", "100px");
      }
      else {
        sideBarContainer.style("width", "0px");
        d3.select("#leftSideBarCollapseButton").style("left", "0px");
        d3.select("#WarningErrorMessages").style("left", "0px");
        d3.select("#leftSideBarCollapseButton").classed("hidden", false);
        
      }
      graph.updateCanvasContainerSize();
      graph.options().navigationMenu().updateScrollButtonVisibility();
    });
  };
  
  leftSidebar.showSidebar = function ( val, init ){
    // make val to bool
    var collapseButton = d3.select("#leftSideBarCollapseButton");
    if ( init === true ) {
      visibleSidebar = (backupVisibility === 0);
      sideBarContent.classed("hidden", !visibleSidebar);
      sideBarContainer.style("-webkit-animation-name", "none");
      d3.select("#WarningErrorMessages").style("-webkit-animation-name", "none");
      if ( visibleSidebar === true ) {
        sideBarContainer.style("width", "200px");
        sideBarContent.classed("hidden", false);
        d3.select("#leftSideBarCollapseButton").style("left", "200px");
        d3.select("#leftSideBarCollapseButton").classed("hidden", false);
        d3.select("#WarningErrorMessages").style("left", "100px");
        collapseButton.node().innerHTML = "<";
      }
      
      else {
        sideBarContainer.style("width", "0px");
        d3.select("#WarningErrorMessages").style("left", "0px");
        d3.select("#leftSideBarCollapseButton").style("left", "0px");
        d3.select("#leftSideBarCollapseButton").classed("hidden", false);
        collapseButton.node().innerHTML = ">";
      }
      
      graph.updateCanvasContainerSize();
      graph.options().navigationMenu().updateScrollButtonVisibility();
      return;
    }
    
    d3.select("#leftSideBarCollapseButton").classed("hidden", true);
    
    if ( val === 1 ) {
      visibleSidebar = true;
      collapseButton.node().innerHTML = "<";
      // call expand animation;
      sideBarContainer.style("-webkit-animation-name", "l_sbExpandAnimation");
      sideBarContainer.style("-webkit-animation-duration", "0.5s");
      // prepare the animation;
      
      d3.select("#WarningErrorMessages").style("-webkit-animation-name", "warn_ExpandLeftBarAnimation");
      d3.select("#WarningErrorMessages").style("-webkit-animation-duration", "0.5s");
      
    }
    if ( val === 0 ) {
      visibleSidebar = false;
      sideBarContent.classed("hidden", true);
      collapseButton.node().innerHTML = ">";
      // call collapse animation
      sideBarContainer.style("-webkit-animation-name", "l_sbCollapseAnimation");
      sideBarContainer.style("-webkit-animation-duration", "0.5s");
      d3.select("#WarningErrorMessages").style("-webkit-animation-name", "warn_CollapseLeftBarAnimation");
      d3.select("#WarningErrorMessages").style("-webkit-animation-duration", "0.5s");
      d3.select("#WarningErrorMessages").style("left", "0");
    }
    
  };
  
  leftSidebar.getSidebarVisibility = function (){
    var isHidden = sideBarContent.classed("hidden");
    if ( isHidden === false ) return String(1);
    if ( isHidden === true ) return String(0);
  };
  
  return leftSidebar;
};
