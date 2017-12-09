// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the globalfund line
var Men_line = d3.line()
    .x(function (d) {
        return x(d.date);
    })
    .y(function (d) {
        return y(d.Men);
    });

// define the us line
var Women_line = d3.line()
    .x(function (d) {
        return x(d.date);
    })
    .y(function (d) {
        return y(d.Women);
    });

var diff_line = d3.line()
    .x(function (d) {
        return x(d.date);
    })
    .y(function (d) {
        return y(d.diff);
    });


// append SVG
var svg = d3.select("#vis1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg3 = d3.select("#leg")
    .append("svg")
    .attr("width", 200)
    .attr("height", 180)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var bisectDate = d3.bisector(function(d) { return d.date; }).left;

var formatDate = d3.timeFormat("%Y");

// Load CSV file
d3.csv("data/wagegap.csv", function(error, data) {

    if (error) throw error;

    //format data
    data.forEach(function (d) {
        var parseTime = d3.timeParse("%Y");
        d.date = parseTime(d.date);
        d.Men = +d.Men;
        d.Women = +d.Women;
        d.diff = +d.diff;
    });

    // // filter out null values
    // var filteredData = data.filter(function(d){
    //     if (d.uk) {return d.uk};
    // });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([130000, 250000]);

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0,"+350+")")
        .attr("class", "axis x-axis")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .attr("class", "axis y-axis")
        .call(d3.axisLeft(y));

    // Add the valueline path.
    svg.append("path")
        .data(data)
        .attr("fill", "none")
        .attr("stroke", "#58adf2")
        .attr("stroke-width", 2)
        .attr("class", "line")
        .attr("d", Men_line(data));

    svg.append("path")
        .data(data)
        .attr("fill", "none")
        .attr("stroke", "#e25488")
        .attr("stroke-width", 2)
        .attr("class", "line")
        .attr("d", Women_line(data));

    var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("stroke-width", 2)
        .attr("stroke", "grey");

    focus.append("text")
        .attr("id", "text1")
        .attr("x", 15)
        .attr("dy", "5em");

    focus.append("text")
        .attr("id", "text2")
        .attr("x", 15)
        .attr("dy", "6em");

    focus.append("text")
        .attr("id", "text3")
        .attr("x", 15)
        .attr("dy", "1em");


    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        const x0 = x.invert(d3.mouse(this)[0]);
        const i = bisectDate(data, x0, 1);
        d0 = data[i - 1];
        d1 = data[i];
        const d = (x0 - d0.date) > (d1.date - x0) ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.date) + "," + y(d.Men) + ")");
        focus.select('#text1').text(function() {return "Men's Wage: $" + d.Men });
        focus.select('#text2').text(function() {return "Women's Wage: $" + d.Women });
        focus.select('#text3').text(function() {return "$" + d.diff });


        var cdate = (formatDate(d.date));

        focus.select("#text1")
            .data(data)
            .attr("x", function(data) {
                if (cdate > 2010){return -180}
                else {return 15}
            })
            .attr("y",  - y(d.Men) + 10);

        focus.select("#text2")
            .data(data)
            .attr("x", function(data) {
                if (cdate > 2010){return -180}
                else {return 15}
            })
            .attr("y",  - y(d.Men) + 10);

        focus.select("#text3")
            .data(data)
            .attr("x", function(data) {
                if (cdate > 2010){return -150}
                else {return 15}
            })
            .attr("y",  - y(d.Men) + 10);




        focus.select("line")
            .attr("class", "x-hover-line hover-line")
            .attr("y1", -(y(d.Men)))
            .attr("y2", height - y(d.Men));

    }

// text label for the x axis
    svg.append("text")
        .attr("class", "axis x-axis")
        .attr("text-anchor","end")
        .attr("x",width)
        .attr("y",height)
        .attr("dy","-0.3em")
        .style("font-size", "12px")
        .text("Time(yr)");

    svg.append("text")
        .attr("class", "axis y-axis")
        .attr("text-anchor","end")
        // how do these work
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy","1.2em")
        .attr("transform", function(d) {
            return "rotate(-90)"
        })
        .style("font-size", "12px")
        .text("Wage($)");

// add label (Men: #8dd3c7 Women: fc8d62
    var ordinal = d3.scaleOrdinal()
        .domain(["Average Male Professor Wage","Average Female Professor Wage"])
        .range(["#58adf2","#e25488"])

    svg.append("g")
        .attr("class","legendOrdinal")
        .attr("transform","translate(550,240)")

    var legendOrdinal =d3.legendColor()
        .shape("path",d3.symbol().type(d3.symbolSquare).size(100))
        .cellFilter(function(d){return d.label !=="e"})
        .scale(ordinal);

    svg.select(".legendOrdinal").call(legendOrdinal);

});

