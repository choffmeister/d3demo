$(function () {
	data1 = _.range(-1.1, 1.1, 0.1).map(function (d) {
		return { X: d, Y: Math.abs(d) <= 1.0 ? Math.sqrt(1 - d*d) : null };
	});
	data2 = _.range(-Math.PI, Math.PI, 0.1).map(function (d) {
		return { X: d, Y: Math.sin(d) };
	});

	var svg = d3.select("#canvas")
		.append("svg");

	var domainX = d3.extent(data2, function (d) { return d.X; });
	var domainY = d3.extent(data2, function (d) { return d.Y; });

	var scaleX = d3.scale.linear().domain(domainX);
	var scaleY = d3.scale.linear().domain(domainY);

	var axisX = d3.svg.axis().scale(scaleX).orient("bottom");
	var axisY = d3.svg.axis().scale(scaleY).orient("left");

	var axisLayer = svg.append("g");
	var dataLayer = svg.append("g");

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

	function drawData(name, data, trigger) {
		var circles = dataLayer.selectAll("circle." + name).data(_.filter(data, function (d) { return d.Y != null; }));
		circles.enter()
			.append("circle")
			.attr("class", name)
			.attr("r", 4)
			.attr("fill", "green")
			.each(function (d, i) {
				var numberFormatter = d3.format(".2f");

				$(this).tooltip({
					title: "X: " + numberFormatter(d.X) + "<br/>" + "Y: " + numberFormatter(d.Y),
					html: true,
					container: "#tooltip-layer"
				});
			});

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

	function drawAxes() {
		axisLayer.select("g.axis").remove();
		axisLayer
			.append("g")
			.attr("class", "axis axis-x")
			.attr("transform", "translate(0," + scaleY(0) + ")")
			.call(axisX);
		axisLayer
			.append("g")
			.attr("class", "axis axis-y")
			.attr("transform", "translate(" + scaleX(0) + ",0)")
			.call(axisY);
	}

	function drawAll(trigger) {
		drawData("cos", data1, trigger);
		drawData("sin", data2, trigger);
		drawAxes();
	};

	alterData = function () {
		for (var i = 0; i < data1.length; i++) {
			if (data1[i].Y != null) data1[i].Y *= -1;
		}
		drawAll();
	};

	setTimeout(alterData, 1000);
});
