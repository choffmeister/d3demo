$(function () {
	funcs = {
		/*
		"sin": {
			values: _.range(-Math.PI, Math.PI, 0.1).map(function (d) {
				return { X: d, Y: Math.sin(d) };
			}),
			color: "#ff0000"
		},
		"cos": {
			values: _.range(-Math.PI, Math.PI, 0.1).map(function (d) {
				return { X: d, Y: Math.cos(d) };
			}),
			color: "#00ff00"
		}
		*/
		"B0": {
			values: _.range(0, 1, 0.01).map(function (t) {
				return { X: t, Y: (1-t)*(1-t)*(1-t) };
			}),
			color: "#ff0000"
		},
		"B1": {
			values: _.range(0, 1, 0.01).map(function (t) {
				return { X: t, Y: 3*(1-t)*(1-t)*t };
			}),
			color: "#00ff00"
		},
		"B2": {
			values: _.range(0, 1, 0.01).map(function (t) {
				return { X: t, Y: 3*(1-t)*t*t };
			}),
			color: "#0000ff"
		},
		"B3": {
			values: _.range(0, 1, 0.01).map(function (t) {
				return { X: t, Y: t*t*t };
			}),
			color: "#00ffff"
		},
		"BEZ": {
			values: _.range(0, 1, 0.01).map(function (t) {
				var a1 = 3;
				var a2 = -10;
				var a3 = 10;
				var a4 = -3;
				return { X: t, Y: a1 * (1-t)*(1-t)*(1-t) + a2 * 3*(1-t)*(1-t)*t + a3 * 3*(1-t)*t*t + a4 * t*t*t };
			}),
			color: "#000000"
		}
	};

	var svg = d3.select("#canvas")
		.append("svg");

	var domainX = null;
	var domainY = null;
	getDomain();

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
		scaleX = scaleX.range([50, width - 10]);
		scaleY = scaleY.range([height - 10, 10]);
		drawAll("resized");
	}
	$(window).resize(resize);
	resize();

	function getDomain() {
		domainsX = [];
		domainsY = [];

		_.each(funcs, function (func, name) {
			domainsX.push(d3.extent(func.values, function (d) { return d.X; }));
			domainsY.push(d3.extent(func.values, function (d) { return d.Y; }));
		});

		domainX = [
			d3.min(domainsX, function (d) { return d[0]; }),
			d3.max(domainsX, function (d) { return d[1]; })
		];
		domainY = [
			d3.min(domainsY, function (d) { return d[0]; }),
			d3.max(domainsY, function (d) { return d[1]; })
		];
	}

	function drawData(name, data, color, trigger) {
		var circles = dataLayer.selectAll("circle." + name).data(_.filter(data, function (d) { return d.Y != null; }));
		circles.enter()
			.append("circle")
			.attr("class", name)
			.attr("r", 4)
			.attr("fill", color)
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
		axisLayer.selectAll("*").remove();
		axisLayer
			.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0," + scaleY(0) + ")")
			.call(axisX);
		axisLayer
			.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + scaleX(0) + ",0)")
			.call(axisY);
	}

	function drawAll(trigger) {
		_.each(funcs, function (func, name) {
			drawData(name, func.values, func.color, trigger);
		});
		drawAxes();
	};
});
