// Set up plotting area
// ================================================================================================================
var svgWidth = 960;
var svgHeight = 600;

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



// Set up chart components
// ================================================================================================================

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcareLow"

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.9,
      d3.max(censusData, d => d[chosenXAxis]) + 1
    ])
    .range([0, width]);

  return xLinearScale;
}

// function used for updating x-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, d => d[chosenYAxis])+1])
    .range([height, 0]);
    
    return yLinearScale;
}


// function used for updating xAxis var upon click on axis label
function renderXaxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYaxis(newYScale, yAxis) {
    var LeftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(LeftAxis);
  
    return yAxis;
  }

// function used for updating circles group with a transition to
// new circles
function renderCircles_x(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}


// function used for updating circles group with a transition to
// new circles
  function renderCircles_y(circlesGroup, newYScale, chosenYaxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYaxis]));
  
    return circlesGroup;
}

// function used for updating circles text group with a transition to
// new circles text
function renderCirclesText_x(circleTextGroup, newXScale, chosenXaxis) {
    circleTextGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis])-6.5);
    return circleTextGroup;
}

function renderCirclesText_y(circleTextGroup, newYScale, chosenYaxis) {
    circleTextGroup.transition()
        .duration(1000)
        .attr("y", d => newYScale(d[chosenYAxis])+2);
    return circleTextGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var xlabel = "Poverty: ";
  }
  else if (chosenXAxis === "age") {
    var xlabel = "Age: ";
  }
  else {
      var xlabel = "Household Income: $"
  }

  if (chosenYAxis === "healthcareLow") {
      var ylabel = "Lacks Healthcare: ";
  }
  else if (chosenYAxis === "smokes") {
      var ylabel = "Smokes: ";
  }
  else {
      var ylabel = "Obese: ";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([0, 0])
    .html(function(d) {
        if(chosenXAxis === "poverty") {
            return (`${d.state}<br>${xlabel}${d[chosenXAxis]}%<br>${ylabel}${d[chosenYAxis]}%`);
        }
        else {
            return (`${d.state}<br>${xlabel}${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
        }
        
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}


// Data
// ================================================================================================================
// Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv", function(err, censusData) {

    if (err) throw err;

    // parse data
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        
        data.healthcareLow = +data.healthcareLow;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
  });

  console.log(censusData);

  // xLinearScale function above csv import
  var xLinearScale = xScale(censusData, chosenXAxis);
  var yLinearScale = yScale(censusData, chosenYAxis)

//   // Create y scale function
//   var yLinearScale = d3.scaleLinear()
//     .domain([0, 25])
//     .range([height, 0]);

  console.log(`Y-axis: healthcare max: ${d3.max(censusData, d => d["healthcareLow"])}`);
  console.log(`Y-axis: smokes max: ${d3.max(censusData, d => d["smokes"])}`);
  console.log(`Y-axis: obese max: ${d3.max(censusData, d => d["obesity"])}`);
  

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
//   chartGroup.append("g")
//     .call(leftAxis);
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis)

  // append initial circles
  var datagroup = chartGroup.selectAll("circle").data(censusData).enter()
  var circlesGroup = datagroup
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 12)
    .attr("fill", "lightblue")
    .attr("opacity", ".9");

  // check 
  console.log(censusData)
  
  // append initial circle text
  var circleTextGroup = datagroup
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]) - 8)
    .attr("y", d => yLinearScale(d[chosenYAxis]) + 2.4)
    .attr("font-size", "11.5")
    .attr("font-weight", "bold")
    .attr("fill", "white")
    .text(d => {return d.abbr})

    

  // Create group for  2 x- axis labels
  var xLabelGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xLabelGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty (%)");

  var ageLabel = xLabelGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age");

  var incomeLabel = xLabelGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income");
    

  // append y axis

  var yLabelGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  var healthcareLowLabel = yLabelGroup.append("text")
    .attr("x", 0-(height/2))
    .attr("y", 0-margin.left/3)
    .attr("value", "healthcareLow")
    .classed("active", true)
    .text("Lacks Healthcare (%)");

  var smokesLabel = yLabelGroup.append("text")
    .attr("x", 0-(height/2))
    .attr("y", 0-margin.left/1.8)
    .attr("value", "smokes")
    .classed("inactive", true)
    .text("Smokes (%)");
  
  var obesityLabel = yLabelGroup.append("text")
    .attr("x", 0-(height/2))
    .attr("y", 0-margin.left/1.3)
    .attr("value", "obesity")
    .classed("inactive", true)
    .text("Obese (%)");
  

//   chartGroup.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("x", 0 - (height / 2))
//     .attr("y", 0 - margin.left/2)
//     .attr("dy", "1em")
//     .classed("axis-text", true)
//     .text("Lacks Healthcare");

  // updateToolTip function above csv import
  //var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  var circleTextGroup = updateToolTip(chosenXAxis, chosenYAxis, circleTextGroup);
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  

  // Event listeners for updating charts
  // ================================================================================================================
  // x axis labels event listener
  xLabelGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXaxis(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles_x(circlesGroup, xLinearScale, chosenXAxis);
        
        // updates circle text with new x values
        circleTextGroup = renderCirclesText_x(circleTextGroup, xLinearScale, chosenXAxis);
                                

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
            povertyLabel
                .classed("active", true)
                .classed("inactive", false);
            ageLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
        }
        else if (chosenXAxis === "age") {
            povertyLabel
                .classed("active", false)
                .classed("inactive", true);
            ageLabel
                .classed("active", true)
                .classed("inactive", false);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
        }
        else {
            povertyLabel
                .classed("active", false)
                .classed("inactive", true);
            ageLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", true)
                .classed("inactive", false);

        }
      }
    });

    // y axis labels event listener
  yLabelGroup.selectAll("text")
    .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(censusData, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYaxis(yLinearScale, yAxis);

        // updates circles with new y values
        circlesGroup = renderCircles_y(circlesGroup, yLinearScale, chosenYAxis);

        // update circle text group with new y values
        circleTextGroup = renderCirclesText_y(circleTextGroup, yLinearScale, chosenYAxis);;
        

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenYAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "healthcareLow") {
            healthcareLowLabel
                .classed("active", true)
                .classed("inactive", false);
            smokesLabel
                .classed("active", false)
                .classed("inactive", true);
            obesityLabel
                .classed("active", false)
                .classed("inactive", true);
        }
        else if (chosenYAxis === "smokes") {
            healthcareLowLabel
                .classed("active", false)
                .classed("inactive", true);
            smokesLabel
                .classed("active", true)
                .classed("inactive", false);
            obesityLabel
                .classed("active", false)
                .classed("inactive", true);
        }
        else {
            healthcareLowLabel
                .classed("active", false)
                .classed("inactive", true);
            smokesLabel
                .classed("active", false)
                .classed("inactive", true);
            obesityLabel
                .classed("active", true)
                .classed("inactive", false);

      }
    }
  });

});
