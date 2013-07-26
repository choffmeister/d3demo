$(function () {
	var data = [{"X":-10,"Y":100},{"X":-9,"Y":81},{"X":-8,"Y":64},{"X":-7,"Y":49},{"X":-6,"Y":36},{"X":-5,"Y":25},{"X":-4,"Y":16},{"X":-3,"Y":9},{"X":-2,"Y":4},{"X":-1,"Y":1},{"X":0,"Y":0},{"X":1,"Y":1},{"X":2,"Y":4},{"X":3,"Y":9},{"X":4,"Y":16},{"X":5,"Y":25},{"X":6,"Y":36},{"X":7,"Y":49},{"X":8,"Y":64},{"X":9,"Y":81},{"X":10,"Y":100}];

	data = [];
	for (var d = 0.0; d <= 6.28; d += 0.1) {
		data.push({
			X: d,
			Y: Math.sin(d)
		});
	}

	var svg = d3.select("#canvas")
		.append("svg");

	var domainX = d3.extent(data, function (d) { return d.X; });
	var domainY = d3.extent(data, function (d) { return d.Y; });

	var scaleX = d3.scale.linear().domain(domainX).range([10, 1000]);
	var scaleY = d3.scale.linear().domain(domainY).range([600, 10]);

	function draw() {
		var circles = svg.selectAll("circle").data(data);
		circles.enter()
			.append("circle")
			.attr("r", 4)
			.attr("fill", "green");

		circles
			.attr("cx", function (d, i) {
				return scaleX(d.X);
			})
			.attr("cy", function (d, i) {
				return scaleY(d.Y);
			});

		circles.exit()
			.remove();
	};

	draw();
});
