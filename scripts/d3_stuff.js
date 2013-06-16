// yeah i know. TODO refactor
var chartHeight = 500,
    chartHeightIncTrimmings = 600,
    bottomChartHeight = 200 + 300, //confusion;
    chartWidth  = 1000;

function setupChart() {
  d3.select("body")
    .append("svg")
    .attr("class", "chart")
    .attr("width",  chartWidth + 300)
    .attr("height", chartHeightIncTrimmings)
    .attr("style", "width: " + 1300 + "px; height: " + chartHeightIncTrimmings +"px;");


  d3.select("svg")
    .append("g")
    .attr('id', 'graphContents')
    .attr("transform", "translate(0,0)");
}

function drawDets(data) {
  xScale = d3.scale
          .linear()
          .domain([out.ranges[1].from, out.ranges[1].to])
          .range([0, chartWidth]);

  yScale = d3.scale
             .linear()
             .domain([out.ranges[0].from, out.ranges[0].to])
             .range([0, chartHeight]);

  drawTicks(data.tics[1].tics);
  drawObjects(data.objects);
  drawDunno(data.dunno);
}

// i wanted to call this flip-reverse it sooo bad :P
// paramName is also a bit lame, reconsider
function flipYForD3Axis(paramName, e){
  e[paramName] = out.ranges[0].to - e[paramName];
  return e;
}

function drawObjects(data) {
  function calcWidthAndHeight(e){
    var width,
        height,
        objectWrapper;

    width = e.toX - e.fromX; 
    e.width = width >= 0 ? width.toFixed(2) : 0;

    height = e.toY - e.fromY;
    e.height = height >= 0 ? height.toFixed(2) : 0;

    return e;
  }

  data = data.map(calcWidthAndHeight)
             .map(flipYForD3Axis.bind(null, 'fromY'));

  objectWrapper = d3.select("#graphContents")
                    .append("g")
                    .attr('id', 'objects')
                    .attr('transform', 'translate(0, -15)');

  objectWrapper.selectAll("rect")
               .data(data) 
               .enter()
               .append("rect")
               .attr("id",     function(d, i) { return d.id; })
               .attr("width",  function(d, i) { return xScale(d.width).toFixed(2); })
               .attr("x",      function(d, i) { return xScale(d.fromX).toFixed(2); })
               .attr("height", function(d, i) { return yScale(d.height).toFixed(2); })
               .attr("y",      function(d, i) { return yScale(d.fromY).toFixed(2); })
               .attr("fill",   function(d, i) { return d.color; });
}

function drawTicks(data){
  var xAxisContainer,
      yAxisContainer,
      xAxis,
      yAxis;

  data = data.map(flipYForD3Axis.bind(null, 'position'));

  yAxisContainer = d3.select("svg")
                     .append("g")
                     .attr('id', 'yAxis')
                     .attr("class", "axis")
                     .attr("transform", "translate(0,0)");

  yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .tickValues(_.map(out.tics[1].tics, function(e) {return e.position}))
                .tickFormat(function getTickTitleFromPosition(p){
                   var ticValue = _.find(out.tics[1].tics, 
                                         function(o, i) { 
                                           return o.position === p;
                                         });
                   return ticValue ? ticValue.title : '';
                });
  yAxisContainer.call(yAxis);

  xAxisContainer = d3.select("svg")
                     .append("g")
                     .attr('id', 'xAxis')
                     .attr("class", "axis")
                     .attr("transform", "translate(0,500)");

  xAxis = d3.svg.axis()
                .scale(xScale);
  xAxis.ticks(5);  // needed? doesn't seem to be in the input file but its how the output looks
  xAxisContainer.call(xAxis);
}

function drawDunno(data) {
  // think this is right but there's way too much magic (numbers), need to make it more flexible, scaleable
  var height = 250,
      container,
      yScale2;

  yScale2 = d3.scale
              .linear()
              .domain([out.ranges[2].from, out.ranges[2].to])
              .range([0, height]);

  container = d3.select("#graphContents")
                .append("g")
                .attr('id', 'dunno')
                .attr('height', height + 'px');

  container.selectAll("line")
           .data(data)
           .enter().append("line")
           .attr("x1", function(d, i) { return xScale(d.xValue).toFixed(2); })
           .attr("x2", function(d, i) { return xScale(d.xValue).toFixed(2); })
           .attr("y1", function(d, i) { return yScale2(height).toFixed(2); })
           .attr("y2", function(d, i) { return yScale2(height - d.yValue).toFixed(2); })
           .style("stroke", "#000");
  }

