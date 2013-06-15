// TODO List :
// - border (svg or css?) around main chart area
// - line up bottom of chart + ticks
// - line up tics and text on y axis

// yeah i know. TODO refactor
chartHeight = 500;
chartHeightIncTrimmings = 600;
bottomChartHeight = 200 + 300 //confusion;
chartWidth  = 1000;
yMax = 23.5;

function setupChart() {    
	var chart = d3.select("body")
	              .append("svg")
	              .attr("class", "chart")
	              .attr("width",  chartWidth + 300)
	              .attr("height", chartHeightIncTrimmings)
	              .attr("style", "width: " + 1300 + "px; height: " + chartHeightIncTrimmings +"px;");

	return chart;
}

function drawDets(chart, data) {
  xScale = d3.scale
          .linear()
          .domain([1.010355,20494.654359999982])
          .range([0, chartWidth]);

  yScale = d3.scale
             .linear()
             .domain([0,yMax])
             .range([0, chartHeight]);

drawTicks(chart, data.tics[1].tics);

var chart = d3.select("svg")
              .append("g")
              .attr('id', 'graphContents')
              .attr("transform", "translate(270,0)");
  
  drawObjects(chart, data.objects);

  drawDunno(data.dunno);
}


// i wanted to call this flip-reverse it sooo bad :P
// paramName is also a bit lame, reconsider
function flipYForD3Axis(paramName, e){
	e[paramName] = yMax - e[paramName];
    return e;
}

function drawObjects(chart, data) {
    data = data.map(function calcWidthAndHeight(e){
    	              var width,
    	                  height;

    	              width = e.toX - e.fromX; 
                      e.width = width >= 0 ? width.toFixed(2) : 0;

                      height = e.toY - e.fromY;
                      e.height = height >= 0 ? height.toFixed(2) : 0;

                      return e;
                    })
                .map(flipYForD3Axis.bind(null, 'fromY'));

     var chart = d3.select("#graphContents")
	               .append("g")
	               .attr('id', 'objects')

	chart.selectAll("rect")
		 .data(data) 
		 .enter()
		 .append("rect")
         .attr("id",     function(d, i) { return d.id; })
		 .attr("width",  function(d, i) { return xScale(d.width).toFixed(2); })
		 .attr("x",      function(d, i) { return xScale(d.fromX).toFixed(2); })
		 .attr("height", function(d, i) { return yScale(d.height).toFixed(2); })
		 .attr("y",      function(d, i) { return yScale(d.fromY).toFixed(2); })
		 .attr("fill",   function(d, i) { return d.color; });

	return chart;
}

// ticks are a little high for now because objects only take up half the y-axis (rest are the dunno objects :P)
// POSITION IS JUST AN ORDERING THING, or % ITS NOT AN ACTUAL POSITION, well it kinda it once you have a ratio..
// i think i r doing it wrong - need to use an axis http://www.dashingd3js.com/d3js-axes
function drawTicks(wibble, data){
	data = data.map(flipYForD3Axis.bind(null, 'position'));

    var chart = d3.select("svg")
	                .append("g")
	                .attr('id', 'yAxis')
                  .attr("transform", "translate(0,0)");

    chart.selectAll(".yrule")
         .data(data)
         .enter().append("text")
         .attr("class", "yrule")
         .attr("y", function(d, i) { 
            return yScale(d.position).toFixed(2);
          })
         .attr("x", 0)
         .attr("dx", 0)
         .text(function(d, i) {
            return d.title;
         })
         .attr("text-anchor", "start");

    chart.selectAll("line")
     .data(data)
   .enter().append("line")
     .attr("x1", 260)
     .attr("x2", 270)
     .attr("y1", function(d, i) { 
            return yScale(d.position - 0).toFixed(2);
     })
     .attr("y2", function(d, i) { 
            return yScale(d.position - 0).toFixed(2);
      })
      .style("stroke", "#000");



      var chart = d3.select("svg")
                  .append("g")
                  .attr('id', 'xAxis')
                  .attr("transform", "translate(270,0)");

	chart.selectAll(".fooline")
	     .data(xScale.ticks(5))
	     .enter().append("line")
	     .attr("x1", xScale)
	     .attr("x2", xScale)
	     .attr("y1", chartHeight + 70)
	     .attr("y2", chartHeight + 90)
	     .style("stroke", "#ccc");

chart.selectAll(".rule")
     .data(xScale.ticks(5))
   .enter().append("text")
     .attr("class", "rule")
     .attr("x", xScale)
     .attr("y", chartHeight + 99)
     .attr("dy", -3)
     .attr("text-anchor", "middle")
     .text(String);


}

function drawDunno(data) {
	data = data.map(function flipYForD3Axis( e){
			//e.yValue = 128.476035 - e.yValue;
			return e;
		});

// think this is right but there's way too much magic (numbers), need to make it more flexible, scaleable
// and also learn how svg works in terms of layering :P
  var h = 250;

		yScale2 = d3.scale
	           .linear()
	           .domain([0,128.476035])
	           .range([0, h]);

    var chart = d3.select("#graphContents")
               .append("g")
               .attr('id', 'dunno')
               .attr('height', h + 'px');

    chart.selectAll("line")
         .data(data)
         .enter().append("line")
	         .attr("x1", function(d, i) { return xScale(d.xValue).toFixed(2); })
	         .attr("x2", function(d, i) { return xScale(d.xValue).toFixed(2); })
	         .attr("y1", function(d, i) { return yScale2(h).toFixed(2); })
	         .attr("y2", function(d, i) { return yScale2(h - d.yValue).toFixed(2); })
	         .style("stroke", "#000");
	}

