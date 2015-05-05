RaceVis = function(_parentElement, _county_race, _state_demo, _eventHandler){
	this.parentElement = _parentElement;
	this.county_race = _county_race;
	this.state_demo = _state_demo;
	this.eventHandler = _eventHandler;
	this.displayData = [];
	this.age_domain = ["black", "hispanic", "white", "other"]
	this.initVis();
}

RaceVis.prototype.initVis = function(){
    var that = this; 

    // selects svg, sets parameters
    this.svg = this.parentElement.selectAll("svg");
    this.margin = {top: 20, right: 20, bottom: 30, left: 50};
    this.width = this.svg.attr("width") - this.margin.left - this.margin.right;
    this.height = this.svg.attr("height") - this.margin.top - this.margin.bottom;

     
    this.svg = this.svg.append("g") 
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // creates axis and scales
    this.x = d3.scale.ordinal()
      .rangeRoundBands([0, this.width - 50], .1)
      .domain(d3.range(0, that.age_domain.length));

    this.y = d3.scale.linear()
      	.range([this.height - 150, 0])
		.domain([0, 100]);

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient("bottom");

    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .ticks(6)
      .orient("left");

    // Add axes visual elements
    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (this.height - 150) + ")")
        .call(this.xAxis)
        .selectAll("text")
          .attr("y", 5)
          .attr("x", 10)
          .attr("transform", "rotate(45)")
          .attr("text-anchor",  "start")
          .style("text-anchor", "start")
          .text(function(d,i) { return that.age_domain[i]})
          .attr("font-size", 12);

    this.svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("transform", "rotate(-90)")

}

RaceVis.prototype.updateVis = function(){
	var that = this;

	// set y scale domain to max value of count aggregate


    // calls y Axis
    this.svg.select(".y.axis")
        .call(this.yAxis)

    var tempdata = [];

    tempdata.push(this.displayData["black"]);
    tempdata.push(this.displayData["hispanic"]);
    tempdata.push(this.displayData["white"]);
    tempdata.push(this.displayData["other"]);

   
     // Data join
    //var bar_g = this.svg.append("g");
    var bar = this.svg.selectAll(".bar")
      .data(tempdata);

    // removes unneeded bars
    bar.exit()
      .remove();

    // Append new bar groups, if required
    bar.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d,i){
        	return  that.x(i);
        })
       .attr("width", (that.width/5));

    // adds bar features
    bar.attr("y", function(d) {
            return (that.y(d));
        })
       .attr("height", function(d){return that.height - 150 - that.y(d);})

}

RaceVis.prototype.onSelectionChange = function(d){
	var that = this;
  
	var county = d.properties.county.toLowerCase();
	this.displayData = that.county_race[county];
  
	this.updateVis();
}