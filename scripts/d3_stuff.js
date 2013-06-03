function setupChart(data) {
	var height = 400,
	    width  = 1000;
	    
	var chart = d3.select("body")
	              .append("svg")
	              .attr("class", "chart")
	              .attr("width", width)
	              .attr("height", height)
	              .attr("style", "width: " +width + "px; height: " +height +"px;");


	// x is A FUNCTION WHICH IS WHY THIS WORKS!!!
	// range returns a FUNCTION that does the scaling shenanigans with width
	// unglobal and put on eventual obj

	return chart; // when obj, store chart
}

function drawBla(chart, data) {
	var yMax = 23.5;
    data = data.map(function(e){
    	              var width = e.toX - e.fromX; 
                      e.width = (width >=0) ? width.toFixed(2) : 0;
                      var height = e.toY - e.fromY;
                      e.height = (height >=0) ? height.toFixed(2) : 0;

                      e.fromY = yMax - e.fromY;

                      return e;
                    });


    //var data = [24, 57, 98, 12];


    var ugh = data.map(function(e){
          	return e.width;
          });

    // think carefully about the domain bit :s
    // maximum value for x scale is the max width, which is the maximum toY :D

     
    // this kind of scaling is for bar charts, i totally don't get how this is gonna work..
    xScale = d3.scale
          .linear()
          .domain([1.010355,20494.654359999982])
          //.range([0, chart.style('width')]);
          .range([0, 1000]);

	yScale = d3.scale
	           .linear()
	           .domain([0,yMax])
	           .range([0, 400]);

	chart.selectAll("rect")
		 .data(data) 
		 .enter()
		 .append("rect")
         .attr("id",     function(d, i) { return d.id; })
		 .attr("width",  function(d, i) { return xScale(d.width).toFixed(2); })
		 .attr("x",      function(d, i) { return xScale(d.fromX).toFixed(2); })
		 .attr("height", function(d, i) { return yScale(d.height).toFixed(2); })
		 .attr("y",      function(d, i) { return yScale(d.fromY).toFixed(2); })
		 .attr("fill",   function(d, i) { return d.color; })
		 
}