// resource: https://codepen.io/mhartley/pen/yoEEJZ?editors=0010

var width = 1250,
    height = 200;

var margin = 50;

var svgTime = d3.select('#timeline').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g');
// .attr('transform', 'translate(10,100)');

var mindate = new Date('1902'),
    maxdate = new Date('2015');

var categories = ['Harvard', 'Yale', 'Princeton', 'Brown', 'Columbia', 'UPenn', 'Dartmouth', 'Cornell', 'general'];

var timeScale = d3.scaleTime()
    .domain([mindate, maxdate])
    .range([0, width]);

var yScale = d3.scaleOrdinal()
    .domain(categories)
    .range([height / 2]);

var textColor = d3.scaleOrdinal()
    .domain(categories)
    .range(["darkred", "darkblue", "orange", "brown", "skyblue", "blue", "darkgreen", "red", "black"]);

var timeaxis = d3.axisBottom(timeScale)
    .ticks(d3.timeYear.every(10))
    .tickFormat(d3.timeFormat('%Y'));

svgTime.append('g')
    .attr('class', 'timescale')
    .call(timeaxis)
    .attr('transform', 'translate(0,' + height / 2 + ')')
    .attr('font-size', '14px');
// .attr('fill', 'pink');

var mapx = function(d) { return timeScale(d.year); };
var yval = function(d) { return d.type; } ;
var mapy = function(d) { return yScale(yval(d)); };

// var showGeneralDescription = function(d) {
//     document.getElementById("general-event-description").innerHTML = d.description;
// };

var tool_tip;

var showMoreInfo = function(d) {
    document.getElementById("timeline-description").innerHTML = "<strong id='description' style='color:" + textColor(yval(d)) + "';>" + d3.timeFormat("%Y")(d.year) + ":  " + d.event + "</strong>" + "<br>" + "<br>" + "<p id='moreDetail'>" + d.description + "</p>";
};

var data;
var general;
var selectedValue;

var filtered;

d3.csv('data/history.csv', function(error,csv){
    if (error) return error;

    data = csv;

    data.forEach(function(d) {
        d.year = d3.timeParse('%Y')(d.year);
        d.event = d.event.toString();
    });

    general = data.filter(function(d) {
        return d.type == "general"
    });

    tool_tip = d3.tip()
        .attr("class", "d3-tip tooltip")
        .offset([-10, 0])
        .html(function(d) { return "<strong>" + d3.timeFormat("%Y")(d.year) + ":  " + d.event + "</strong>"});

    svgTime.call(tool_tip);

    var generaleventdot = svgTime.selectAll('.generalevent')
        .data(general)
        .enter().append('g')
        .attr('transform', function(d) { return 'translate(' + mapx(d) + ',' + mapy(d) + ')' })
        .attr('class', 'generalevent');

    generaleventdot.append('circle')
        .attr('r', '3px')
        .attr('stroke', function(d) {return textColor(yval(d)) })
        .attr('fill', 'white')
        .attr('stroke-width', '3px')
        .on("mouseover", tool_tip.show)
        .on("mouseout", tool_tip.hide)
        .on("click", showMoreInfo);
    // .transition()
    // .duration(500);

    // generaleventdot.append('text')
    //     .attr('text-anchor', 'end')
    //     .attr('transform', function(d) { return d })
    //     .attr('dx', '-5em')
    //     .attr('dy', '.3em')
    //     .attr('font-size', '10px')
    //     // .attr('fill', function(d) {return textColor(yval(d)) })
    //     .text(function (d) {return d.event });
    //     // .on("mouseover", tool_tip.show)
    //     // .on("mouseout", tool_tip.hide);
    //     // .transition()
    //     // .duration(500);

    // var showGeneralDescription = generaleventdot.append('text')
    //     ,attr

    updateVisualization();

    d3.selectAll("#school-history").on("change", updateVisualization);

});

svgTime.selectAll('g.event');

selectedValue = "Harvard";

// Render visualization
function updateVisualization() {

    svgTime.call(tool_tip);

    svgTime.selectAll(".event").remove();

    // var tool_tip = d3.tip()
    //     .attr("class", "d3-tip tooltip")
    //     .offset([margin, 0])
    //     .html(function(d) { return "<strong>" + d3.timeFormat("%Y")(d.year) + ":  " + d.event + "</strong>" + "<br>" + "<br>" + d.description; });

    // svgTime.call(tool_tip);

    // Update selectedValue
    var checked = [];

    d3.selectAll("#school-history").each(function(d) {
        cb = d3.select(this);
        if(cb.property("checked")){
            checked.push(cb.property("value"));
        }
    });

    if (checked.length > 0) {
        selectedValue = categories.filter(function(d) {return checked.includes(d);});
    }

    console.log(selectedValue);

    filtered = data.filter(function(d) {
        return d.type == selectedValue;
    });
    6
    console.log(filtered);

    var eventdotGroup = svgTime.selectAll('.event')
        .data(filtered);

    var eventdot = eventdotGroup.enter().append('g')
        .attr('class', 'event')
        .attr('transform', function(d) { return 'translate(' + mapx(d) + ',' + mapy(d) + ')' });

    eventdot.append('circle');
    // eventdot.append('text');

    eventdotGroup.merge(eventdot).append('circle')
        .attr('r', '5px')
        .attr('stroke', function(d) {return textColor(yval(d)) })
        .attr('fill', 'white')
        .attr('stroke-width', '4px')
        .on("mouseover", tool_tip.show)
        .on("mouseout", tool_tip.hide)
        .on("click", showMoreInfo);

    // eventdotGroup.merge(eventdot).append('text')
    //     .attr('text-anchor', 'start')
    //     .attr('transform', function(d) { return d  })
    //     .attr('dx', '1em')
    //     .attr('dy', '.3em')
    //     .attr('font-size', '14px')
    //     .attr('fill', function(d) {return textColor(yval(d)) })
    //     .text(function (d) {return d.event });
    //     // .on("mouseover", tool_tip.show)
    //     // .on("mouseout", tool_tip.hide);
}
