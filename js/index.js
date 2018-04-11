document.addEventListener("DOMContentLoaded",function(){
  req=new XMLHttpRequest();
  req.open("GET","https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json", true);
  req.send();
  req.onload=function(){
    const dataset=JSON.parse(req.responseText);
    const data = dataset.monthlyVariance;
    const w = 1000;
    const h = 600;
    const padding = 92;
    // const baseTemp = data.baseTemperature;
    const boxWidth = Math.floor(w / (data.length / 12)); // width / number of years
    const boxHeight = Math.floor((h - padding - padding) / 12) + 4; // height / 12
    // need +4 above because 1753 months != 2015 months
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const colors = ["#3910ed", "#3155c4", "#3479f9", "#2fc0ed", "#36edba", "#e2fff7", "#fff1a5", "#d6bc2c", "#f9a86d", "#c17036", "#f26060"];
    const legendTemps = ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12+"]
    const legendWidth = 30;
    const legendHeight = 20;
    
    const svg = d3.select(".chart")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
        
    const xScale = d3.scaleLinear()
    .domain([1753, 2015])
    .range([padding, w - padding]);
        
    const yScale = d3.scaleLinear()
    .domain([1, 12])
    .range([padding, h - padding]);
      
    let tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip");
    
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => xScale(d.year))
      .attr("y", (d, i) => yScale(d.month - 1))
      .attr("width", boxWidth)
      .attr("height", boxHeight)
      .attr("fill", (d) => 8.66 + d.variance < 3 ? colors[0] : 8.66 + d.variance < 4 ? colors[1] : 8.66 + d.variance < 5 ? colors[2] : 8.66 + d.variance < 6 ? colors[3] : 8.66 + d.variance < 7 ? colors[4] : 8.66 + d.variance < 8 ? colors[5] : 8.66 + d.variance < 9 ? colors[6] : 8.66 + d.variance < 10 ?  colors[7] : 8.66 + d.variance < 11 ? colors[8] : 8.66 + d.variance < 12 ? colors[9] : colors[10])
      .attr("fill-opacity", "0.8")
      .on("mousemove", (d) => {
        tooltip
          .style("left", d3.event.pageX - 50 +"px")
          .style("top", d3.event.pageY - 70 + "px")
          .style("display", "inline-block")
          .html("<span>" + d.year + " &#8212; " + months[d.month-1] + "<br/>" + (Math.floor((8.66 + d.variance)*100)/100) + " ℃<br/>" + d.variance + " ℃</span>")
       })
        .on("mouseout", (d) => {
          tooltip
            .style("display", "none");
        });
    
    svg.selectAll("text")
      .data(months)
      .enter()
      .append("text")
      .text((month) => month)
      .attr("x", padding - 5)
      .attr("y", (month, i) => (padding + (i*boxHeight) - boxHeight / 3)) // divided by 3 instead of 2 b/c y attribute aligns by bottom of text and I want it to be centered
      .style("text-anchor", "end");
        
    const xAxis = d3.axisBottom(xScale)
    .tickFormat(d => d); // so it's 2015, not 2,015
    
    svg.append("g")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(xAxis);
    
    svg.append("text") // subhead
      .attr("x", w/2)
      .attr("y", 18)
      .attr("font-size", "25px")
      .style("text-anchor", "middle")
      .text("1753 - 2015");
    
    svg.append("text") // subhead
      .attr("x", w/2)
      .attr("y", 35)
      .attr("font-size", "12px")
      .style("text-anchor", "middle")
      .text("Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average");
    
    svg.append("text") // subhead
      .attr("x", w/2)
      .attr("y", 50)
      .attr("font-size", "12px")
      .style("text-anchor", "middle")
      .text("Estimated Jan 1951-Dec 1980 absolute temperature ℃: 8.66 +/- 0.07");
    
    svg.append("text") // subhead
      .attr("x", w/2)
      .attr("y", h - 50)
      .attr("font-size", "15px")
      .style("text-anchor", "middle")
      .text("Year");
    
    svg.selectAll(null)
      .data(colors)
      .enter()
      .append("rect")
      .attr("x", (d, i) => 600 + i*legendWidth)
      .attr("y", h - 40)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("fill", (d, i) => colors[i])
      .attr("fill-opacity", "0.8");
    
    svg.selectAll(null) // legend text
      .data(legendTemps)
      .enter()
      .append("text")
      .attr("x", (d, i) => 600 + (i+1)*legendWidth)
      .attr("y", h - 6)
      .attr("font-size", "12px")
      .style("text-anchor", "middle")
      .text(d => d);

    };
  });