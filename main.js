$(function () {
	data1 = _.range(0.0, Math.PI * 2.0, 0.1).map(function (d) {
		return { X: d, Y: Math.cos(d) };
	});
	data2 = _.range(0.0, Math.PI * 2.0, 0.1).map(function (d) {
		return { X: d, Y: Math.sin(d) };
	});

	var svg = d3.select("#canvas")
		.append("svg");

	var domainX = d3.extent(data1, function (d) { return d.X; });
	var domainY = d3.extent(data1, function (d) { return d.Y; });

	var scaleX = d3.scale.linear().domain(domainX);
	var scaleY = d3.scale.linear().domain(domainY);

	function resize() {
		var width = $("#canvas").width();
		var height = $("#canvas").height();

		svg.attr("width", width).attr("height", height);
		scaleX = scaleX.range([10, width - 10]);
		scaleY = scaleY.range([height - 10, 10]);
		drawAll("resized");
	}
	$(window).resize(resize);
	resize();

	function draw(name, data, trigger) {
		var circles = svg.selectAll("circle." + name).data(data);
		circles.enter()
			.append("circle")
			.attr("class", name)
			.attr("r", 4)
			.attr("fill", "green");

		circles
			.transition()
			.ease("bounce")
			.duration(trigger == "resized" ? 0 : 5000)
			.attr("cx", function (d, i) {
				return scaleX(d.X);
			})
			.attr("cy", function (d, i) {
				return scaleY(d.Y);
			});

		circles.exit()
			.remove();
	};

	function drawAll(trigger) {
		draw("cos", data1, trigger);
		draw("sin", data2, trigger);
	};

	alterData = function () {
		for (var i = 0; i < data1.length; i++) {
			data1[i].Y *= -1;
		}
		drawAll();
	};

	setTimeout(alterData, 1000);
});
