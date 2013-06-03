// yeah i know. TODO refactor
chartHeight = 400;
chartWidth  = 1000;
yMax = 23.5;

function setupChart(data) {    
	var chart = d3.select("body")
	              .append("svg")
	              .attr("class", "chart")
	              .attr("width",  chartWidth + 300)
	              .attr("height", chartHeight)
	              .attr("style", "width: " + 1300 + "px; height: " + chartHeight +"px;");

	return chart;
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

    xScale = d3.scale
          .linear()
          .domain([1.010355,20494.654359999982])
          .range([0, chartWidth]);

	yScale = d3.scale
	           .linear()
	           .domain([0,yMax])
	           .range([0, chartHeight]);

     var chart = d3.select("svg")
	               .append("g")
	               .attr('id', 'objects')
                   .attr("transform", "translate(200,0)");

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
function drawTicks(wibble, data){
	data = data.map(flipYForD3Axis.bind(null, 'position'));


    var chart = d3.select("svg")
	               .append("g")
	               .attr('id', 'tics')
                   .attr("transform", "translate(0,0)");

    chart.selectAll(".rule")
         .data(data)
         .enter().append("text")
         .attr("class", "rule")
         .attr("y", function(d, i) { 
            return yScale(d.position).toFixed(2);
          })
         .attr("x", 0)
         .attr("dx", 0)
         .attr("text-anchor", "middle")
         .text(function(d, i) {
            return d.title;
         })
         .attr("text-anchor", "start");
}