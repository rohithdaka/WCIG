// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 180 - margin.top - margin.bottom;

// Set the ranges
var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(10);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(10);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.freq); })
    .y(function(d) { return y(d.mag1); });
    
// Adds the svg canvas
var svg = d3.select("#spectrumAnalyzer")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("js/noiseSignal.csv", function(error, data) {
    data.forEach(function(d) {
        d.freq = +d.freq;
        d.mag = +d.mag1;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.freq; }));
    y.domain([0, 15]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

});
