       //------------------------1. PREPARATION------------------------//
       //-----------------------------SVG------------------------------// 
       const width = 960;
       const height = 500;
       const margin = 0;
       const padding = 5;
       const adj = 100;
       // we are appending SVG first
       const svg = d3.select("div#linechart-container").append("svg")
           .attr("preserveAspectRatio", "xMinYMin meet")
           .attr("viewBox", "-" +
               adj + " -" +
               adj + " " +
               (width + adj * 3) + " " +
               (height + adj * 3))
           .style("padding", padding)
           .style("margin", margin)
           .classed("svg-content", true)
           .attr("class", "linechart-svg")

       //-----------------------------DATA-----------------------------//
       const timeConv = d3.timeParse("%d-%b-%Y");
       const dataset = d3.csv("assets/data/ticketsourcesdata.csv");
       dataset.then(function (data) {
           var slices = data.columns.slice(1).map(function (id) {
               return {
                   id: id,
                   values: data.map(function (d) {
                       return {
                           date: timeConv(d.date),
                           measurement: +d[id]
                       };
                   })
               };
           });

           //----------------------------SCALES----------------------------//
           const xScale = d3.scaleTime().range([0, width]);
           const yScale = d3.scaleLinear().rangeRound([height, 0]);
           xScale.domain(d3.extent(data, function (d) {
               return timeConv(d.date)
           }));
           yScale.domain([(0), d3.max(slices, function (c) {
               return d3.max(c.values, function (d) {
                   return d.measurement + 4;
               });
           })]);

           //-----------------------------AXES-----------------------------//
           const yaxis = d3.axisLeft()
               .ticks((slices[0].values).length)
               .scale(yScale);

           const xaxis = d3.axisBottom()
               .ticks(d3.timeDay.every(1))
               .tickFormat(d3.timeFormat('%a'))
               .scale(xScale);

           const xaxis1 = d3.axisBottom(xScale)
               .ticks(0)
               .tickFormat(d3.timeFormat(''))
               .scale(xScale);
           const yaxis1 = d3.axisLeft(yScale);

           //----------------------------LINES-----------------------------//
           const line = d3.line()
               .x(function (d) {
                   return xScale(d.date);
               })
               .y(function (d) {
                   return yScale(d.measurement);
               });

           let id = 0;
           const ids = function () {
               return "line-" + id++;
           }
           //-------------------------2. DRAWING---------------------------//
           //-----------------------------AXES-----------------------------//
           svg.append("g")
               .attr("class", "axis")
               .attr("transform", "translate(0," + height + ")")
               .call(xaxis);

           svg.append("g")
               .attr("transform", `translate(0,${500 - (1 *(86))})`)
               .call(xaxis1).attr("stroke-dasharray", "10,10")
               .attr("stroke-opacity", 0.5);

           svg.append("g")
               .attr("transform", `translate(0,${500 - (2 *(86))})`)
               .call(xaxis1).attr("stroke-dasharray", "10,10")
               .attr("stroke-opacity", 0.5);

           svg.append("g")
               .attr("transform", `translate(0,${500 - (3.015 *(86))})`)
               .call(xaxis1).attr("stroke-dasharray", "10,10")
               .attr("stroke-opacity", 0.5);

           svg.append("g")
               .attr("transform", `translate(0,${500 - (4.01 *(86))})`)
               .call(xaxis1).attr("stroke-dasharray", "10,10")
               .attr("stroke-opacity", 0.5);

           svg.append("g")
               .attr("transform", `translate(0,${500 - (5.01 *(86))})`)
               .call(xaxis1).attr("stroke-dasharray", "10,10")
               .attr("stroke-opacity", 0.5);

           svg.append("g")
               .attr("class", "axis")
               .call(yaxis)
               .append("text")
               .attr("transform", "rotate(-90)")
               .attr("dy", ".75em")
               .attr("y", 6)
               .style("text-anchor", "end")
               .text("Frequency");

           //----------------------------LINES-----------------------------//
           const lines = svg.selectAll("lines")
               .data(slices)
               .enter()
               .append("g");

           lines.append("path")
               .attr("class", ids)
               .attr("d", function (d) {
                   return line(d.values);
               });

           lines.append("text")
               .attr("class", "serie_label")
               .datum(function (d) {
                   return {
                       id: d.id,
                       value: d.values[d.values.length - 1]
                   };
               })
               .attr("transform", function (d) {
                   return "translate(" + (xScale(d.value.date) + 10) +
                       "," + (yScale(d.value.measurement) + 5) + ")";
               })
               .attr("x", 5)
               .text(function (d) {
                   return d.id;
               });

       });


       /* >>>>>>>>>>>>>>>>>>>>PIE CHART<<<<<<<<<<<<<<<< */


       const pieSvg = d3.select(".pie-chart-svg"),
           pieWidth = pieSvg.attr("width"),
           pieHeight = pieSvg.attr("height"),
           radius = Math.min(pieWidth, pieHeight) / 2;

       const pieG = pieSvg.append("g")
           .attr("transform", "translate(" + pieWidth / 2 + "," + pieHeight / 2 + ")");

       const pieColor = d3.scaleOrdinal(['var(--pri-yellow)', 'var(--pri-green)', 'var(--pri-blue-darker)']);

       const pie = d3.pie().value(function (d) {
           return d.percent;
       });

       const path = d3.arc()
           .outerRadius(radius - 10)
           .innerRadius(0);

       const label = d3.arc()
           .outerRadius(radius)
           .innerRadius(radius - 80);

       d3.csv("assets/data/ticketstatusdata.csv").then(function (data) {
           var pieArc = pieG.selectAll(".pie-arc")
               .data(pie(data))
               .enter().append("g")
               .attr("class", "pie-arc");

           pieArc.append("path")
               .attr("d", path)
               .attr("fill", function (d) {
                   return pieColor(d.data.status);
               });

           /*  pieArc.append("text")
               .attr("transform", function(d) { 
                        return "translate(" + label.centroid(d) + ")"; 
                })
               .text(function(d) { return d.data.browser; }); */
       })

       pieSvg.append("g")
           .attr("transform", "translate(" + (pieWidth / 2 - 120) + "," + 20 + ")")
           .attr("class", "title");