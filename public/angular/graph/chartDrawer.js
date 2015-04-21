define([
  'd3'
], function (d3) {
  var service = {};

  service.drawLineChart = function(svgId, data, yLabel, xLabel) {
    var divWidth = 900;
    var divHeight = 500;

    var svg = d3.select("#" + svgId)
      .attr("width", divWidth)
      .attr("height", divHeight);

    var margin = {left: 80, right: 10, top: 20, bottom: 50};
    var width = divWidth - margin.left - margin.right;
    var height = divHeight - margin.top - margin.bottom;
    data = data.map(function(d) {
      return parseInt(d);
    });

    var x = d3.scale.linear()
      .domain([0, data.length-1])
      .range([0, width]);
    var y = d3.scale.linear()
      .domain([0, Math.max(1, d3.max(data))])
      .range([height, 0]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    var chart = svg.append("g")
      .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    var line = d3.svg.line()
      .x(function(d, i) {
        return x(i);
      })
      .y(function(d) {
        return y(d);
      });

    chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, " + height + ")")
      .call(xAxis);

    chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    chart.append("path")
      .attr("d", line(data))
      .attr("stroke", "steelblue")
      .attr("stroke-width", "2")
      .attr("fill", "none");

    var dash = [0.2, 0.4, 0.6, 0.8, 0];

    var dashLine = chart.selectAll(".dash")
      .data(dash)
      .enter().append("g")
      .attr("transform", function(d) {return "translate(0, " + d*height + ")";})
      .append("path")
      .attr("d", "M 0 0 L " + width + " 0")
      .attr("stroke", "#DDD")
      .attr("stroke-dasharray", ("5, 3"));

    svg.append("text")
      .style("text-anchor", "middle")
      .attr("transform", "translate(" + 40 + ", " + (margin.top + height/2) + ")rotate(" +  -90 + ")")
      .attr("font-size", "1.6em")
      .text(yLabel);

    svg.append("text")
      .style("text-anchor", "middle")
      .attr("transform", "translate(" + (margin.left + width/2) + ", " + (margin.top+height+40) + ")")
      .attr("font-size", "1.6em")
      .text(xLabel);
  }

  return service;
});