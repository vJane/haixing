

function updateBarChart(school, vis) {

	var margin = {top: 10, right: 50, bottom: 10, left: 70};
	var height = 450;
	var width = 300;

	d3.csv("data/csvdata.csv", function(data) {
		schoolData = data.filter(function(d) {
	        return d.name == school;
	    });

		 d3.select("#ivy-league-bar-chart").selectAll("svg").remove();

   		 var svg = d3.select("#ivy-league-bar-chart").append("svg")
        .attr("width", width)
        .attr("height", height)
	    .attr("transform","translate(150,40)")
        .append("g")

    	svg.append("g")
        .append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .text(schoolData[0]["name"]).style("text-anchor", "middle")
        .attr("font-size", "24");

        svg.append("g")
        .append("text")
        .attr("x", width / 2)
        .attr("y", height - 80)
        .text(Math.round(schoolData[0]["female"] * 100) + "% of faculty are female")
        .style("text-anchor", "middle")
        .attr("font-size", "24");

        var image_width = 250;
        svg.append("g")
        .append("svg:image")
        .attr("x", (width / 2) - (image_width / 2))
        .attr("y", 40)
        .attr("xlink:href", "data/images/" + schoolData[0]["name"] + ".png")
  		.attr("width", image_width)
  		.attr("height", 250)
  		.attr("align","center");

        svg.append("g")
            .append("text")
            .attr("x", width / 2)
            .attr("y", height - 10)
            .text("The wage gap is $" + schoolData[0]["gap"]).style("text-anchor", "middle")
            .attr("font-size", "24");

        svg.append('rect')
		.attr('class', 'bg-rect')
		.attr("x", 0)
		.attr("y", height - 70)
		.attr('rx', 10)
		.attr('ry', 10)
		.attr('fill', '#58adf2')
		.attr('height', 15)
		.attr('width', function(){
			return width;
		});

		var progress = svg.append('rect')
					.attr('class', 'progress-rect')
					// .attr('fill', function(){
					// 	return colorScale(currentState);
					// })
					.attr('fill', "#e25488")
					.attr('height', 15)
					//.attr('width', 100)
					.attr('rx', 10)
					.attr('ry', 10)
					.attr('x', 0)
					.attr("y", height - 70);

		progress.transition()
		.duration(1000)
		.attr('width', function(){
			return schoolData[0]["female"] * width;
		});

		function moveProgressBar(state){
		progress.transition()
			.duration(1000)
			.attr('fill', "#e25488")
			// function(){
				//return colorScale(state);
				// return schoolData[0]["color"];
			// })
			.attr('width', function(){
				return schoolData[0]["female"] * width;
			});
		}

	});
}