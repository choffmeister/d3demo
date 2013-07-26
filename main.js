$(function () {
	data1 = _.range(0.0, Math.PI * 2.0, 0.1).map(function (d) {
		return { X: d, Y: Math.abs(d) <= 1.0 ? Math.sqrt(1 - d*d) : null };
	});
	console.log(data1);
	data2 = _.range(0.0, Math.PI * 2.0, 0.1).map(function (d) {
		return { X: d, Y: Math.sin(d) };
	});

	var svg = d3.select("#canvas")
		.append("svg");

	var domainX = d3.extent(data2, function (d) { return d.X; });
	var domainY = d3.extent(data2, function (d) { return d.Y; });

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
		var circles = svg.selectAll("circle." + name).data(_.filter(data, function (d) { return d.Y != null; }));
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
			if (data1[i].Y != null) data1[i].Y *= -1;
		}
		drawAll();
	};

	setTimeout(alterData, 1000);
});
