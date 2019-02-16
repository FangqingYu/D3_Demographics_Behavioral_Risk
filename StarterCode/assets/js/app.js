// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);



// Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv").then(censusData => {

    console.log(censusData);

    //1. parse data
    //===================================================
    censusData.forEach(data => {
        console.log(data);
        data.poverty = +data.poverty;
        console.log(`poverty: ${data.poverty}`);
        data.healthcareLow = +data.healthcareLow;
        console.log(`healthcareLow: ${data.healthcareLow}`);
        data.abbr = String(data.abbr)
        console.log(`abbr: ${data.abbr}`);
    });

    //console.log(censusData['state']);

    //2. Create scale functions
    //===================================================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d=> d.poverty)-2, d3.max(censusData, d => d.poverty)+2])
      .range([0, width]);

    //console.log(xLinearScale);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(censusData, d => d.healthcareLow)])
      .range([height, 0]);

    //console.log(yLinearScale);


    //3. Create axis functions
    //===================================================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //4. Append axis to the chart
    //===================================================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);


    //5. Create circles
    //===================================================
    

    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcareLow))
    .attr("r", "10")
    .attr("fill", "lightblue")
    .attr("opacity", "1")
    
    console.log(circlesGroup)
  
    
    var labelGroup =  chartGroup.selectAll("text")
      .data(censusData)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d.poverty)-6)
      .attr("y", d => yLinearScale(d.healthcareLow)+2)
      .attr("font-size", "9")
      .attr("fill", "black")
      .text(d => {return d.abbr})
      
      console.log(labelGroup)
  


    //6. Initialize too tip
    //===================================================
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([2, -2])
    .html(d => {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Lacks Healthcare: ${d.healthcareLow}%`);
    })

    //7. Create tooltip in the chart
    //===================================================
    chartGroup.call(toolTip);

    //8. Create event listeners to display and hide the tooltip
    //===================================================
    circlesGroup.on("mouseover", data => {
        toolTip.show(data, this);
    })

    // onmouseout event
    .on("mouseout", (data, index) => {
        toolTip.hide(data);
    });

    //9. Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty(%)");

    // Add abbreviation in circles
    

});
