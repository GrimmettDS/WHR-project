const svgWidth = 660;
const svgHeight = 600;

const margin = {
    top: 20,
    right: 40,
    bottom: 180,
    left: 100
};

// Calculate chart width and height
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
const svg = d3.select("#scatter")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

// Append SVG group
const chartGroup = svg.append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)

// Initial params
var chosenYaxis = "Happiness Score";
var chosenXaxis = "Wealth";

// function used for updating xAxis const upon click on axis label
function renderXAxes(newXScale, xAxis) {
  const bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
// function used for updating yAxis const upon click on axis label
function renderYAxes(newYScale, yAxis) {
  const leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}


// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d=>newYScale(d[chosenYAxis]));
  return circlesGroup;
}
function renderTexts(txtGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  txtGroup.transition()
    .duration(1000)
    .attr("x", d=>newXScale(d[chosenXAxis]))
    .attr("y", d=>newYScale(d[chosenYAxis]))
  return txtGroup;
}

// function used for updating x-scale const upon click on axis label
function xScale(HappinessData, chosenXaxis) {
    // create scales
    const xLinearScale = d3.scaleLinear()
      .domain([d3.min(HappinessData, d => d[chosenXaxis]-.2),
        d3.max(HappinessData, d => d[chosenXaxis]+.2)
      ])
      .range([0, width]);
    return xLinearScale;
}
function yScale(HappinessData, chosenYaxis) {
    // create scales
    const yLinearScale = d3.scaleLinear()
      .domain([0, 8])
      .range([height, 0]);
    return yLinearScale;
}

// function used for updating tooltip for circles group
function updateToolTip(chosenXaxis, chosenYaxis, circlesGroup){
  let xLabel = ""
  let yLabel = ""
  if (chosenXaxis === "HappinessScore"){
    xLabel = "Happiness Score";
  }
  else if (chosenXaxis === "Wealth"){
    xLabel = "GDP per Capita";
  }
  else if (chosenXaxis === "Family"){
    xLabel = "Family";
  }
  else if (chosenXaxis === "Health"){
    xLabel = "Health (Life Expectancy";
  }
  else if (chosenXaxis === "Freedom"){
    xLabel = "Freedom";
  }
  else if (chosenXaxis === "Trust"){
    xLabel = "Trust (Perception Of Government Corruption)";
  }
  else{
    xLabel = "Generosity";
  }
  if (chosenYaxis === "HappinessScore"){
    yLabel = "Happiness Score";
  }
  // const toolTip = d3.tip()
  //                   .attr("class", "d3-tip")
  //                   .offset([80, -60])
  //                   .html(function(d){
  //                     return(`${d.country}<br>${xLabel}${d[chosenXaxis]}<br>${yLabel}${d[chosenYaxis]}`)
  //                     })
  
  // circlesGroup.call(toolTip);
  // circlesGroup.on("mouseover", function(data){
  //   toolTip.show(data, this);
  //   d3.select(this).style("stroke", "black");
    
  // })
  // circlesGroup.on("mouseout", function(data, index){
  //   toolTip.hide(data, this)
  //   d3.select(this).style("stroke", "white");
  // })
  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below

d3.csv('static/data/clean/2020.csv',function(HappinessData){
    console.log(HappinessData)
    // parse data to interger from string
    HappinessData.forEach(function(data){
        data.HappinessScore = +data.HappinessScore;
		    data.Wealth = +data.Wealth;
        data.Health = +data.Health;
        data.Family = +data.Family;
        data.Freedom = +data.Freedom;
        data.Trust = +data.Trust;
        data.Generosity = +data.Generosity;
    })

    // xLinearScale function after csv import
    let xLinearScale = xScale(HappinessData, chosenXaxis);

    // yLinearScale function after csv import
    let yLinearScale = yScale(HappinessData, chosenYaxis)

    // Create initial axis functions
    const bottomAxis = d3.axisBottom(xLinearScale);
    const leftAxis = d3.axisLeft(yLinearScale);

    // append X-axis
    let xAxis = chartGroup.append("g")
                        .classed("x-axis", true)
                        .attr("transform", `translate(0, ${height})`)
                        .call(bottomAxis)
    
    let yAxis = chartGroup.append("g")
                        .classed("y-axis", true)
                        .call(leftAxis)
    
    let crlTxtGroup = chartGroup.selectAll("mycircles")
                      .data(HappinessData)
                      .enter()
                      .append("g")
    
    let circlesGroup = crlTxtGroup.append("circle")
                            .attr("cx", d=>xLinearScale(d[chosenXaxis]))
                            .attr("cy", d=>yLinearScale(d[chosenYaxis]))
                            .classed("stateCircle", true)
                            .attr("r", 8)
                            .attr("opacity", "1");

    let txtGroup = crlTxtGroup.append("text")
                              .text(d=>d.abbr)
                              .attr("x", d=>xLinearScale(d[chosenXaxis]))
                              .attr("y", d=>yLinearScale(d[chosenYaxis])+3)
                              .classed("stateText", true)
                              .style("font-size", "7px")
                              .style("font-weight", "800")

     // Create group for  3 x- axis labels
     const xlabelsGroup = chartGroup.append("g")
                                .attr("transform", `translate(${width / 2}, ${height + 20 + margin.top})`);
    
    // Create group for  3 y- axis labels
    const ylabelsGroup = chartGroup.append("g")
                                .attr("transform", `translate(${0-margin.left/4}, ${height/2})`);

    
    const x_WealthLabel = xlabelsGroup.append("text")
                                .attr("x", -150)
                                .attr("y", 10)
                                .attr("value", "Wealth") // value to grab for event listener
                                .attr("class", "active aText")
                                .text("GDP per Capita");

    const x_FamilyLabel = xlabelsGroup.append("text")
                                .attr("x", -150)
                                .attr("y", 30)
                                .attr("value", "Family") // value to grab for event listener
                                .attr('class','inactive aText')
                                .text("Family");

	  const x_HealthLabel = xlabelsGroup.append("text")
                                .attr("x", -150)
                                .attr("y", 50)
                                .attr("value", "Health") // value to grab for event listener
                                .attr('class','inactive aText')
                                .text("Health");

	  const x_FreedomLabel = xlabelsGroup.append("text")
                                .attr("x", 0)
                                .attr("y", 10)
                                .attr("value", "Freedom") // value to grab for event listener
                                .attr('class','inactive aText')
                                .text("Freedom");

	  const x_TrustLabel = xlabelsGroup.append("text")
                                .attr("x", 0)
                                .attr("y", 30)
                                .attr("value", "Trust") // value to grab for event listener
                                .attr('class','inactive aText')
                                .text("Perception of Government Corruption");
    
	  const x_GenerosityLabel = xlabelsGroup.append("text")
                                .attr("x", 0)
                                .attr("y", 50)
                                .attr("value", "Generosity") // value to grab for event listener
                                .attr('class','inactive aText')
                                .text("Generosity");

   const y_HappinessLabel = ylabelsGroup.append("text")
                                .attr("y", 0 - 20)
                                .attr("x", 0)
                                .attr("transform", "rotate(-90)")
                                .attr("dy", "1em")
                                .attr("value", "HappinessScore")
                                .attr('class','aText')
                                .text("Happiness Score");
    
    

     // updateToolTip function after csv import
    //  circlesGroup = updateToolTip(chosenXaxis, chosenYaxis, circlesGroup);

    // x axis labels event listener
    xlabelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        const value = d3.select(this).attr("value");
        console.log(`${value} click`)
        if (value !== chosenXaxis) {

            // replaces chosenXAxis with value
            chosenXaxis = value;
            console.log(chosenXaxis)

            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(HappinessData, chosenXaxis);

            // updates x axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXaxis, chosenYaxis);

             // updates texts with new x values
            txtGroup = renderTexts(txtGroup, xLinearScale, yLinearScale, chosenXaxis, chosenYaxis);

            // changes classes to change bold text
            if (chosenXaxis === "Wealth"){
                x_WealthLabel
                  .attr('class','active aText');
                x_FamilyLabel
                  .attr('class','inactive aText');
				        x_HealthLabel
                  .attr('class','inactive aText');
				        x_FreedomLabel
                  .attr('class','inactive aText');
				        x_TrustLabel
                  .attr('class','inactive aText');
				        x_GenerosityLabel
                  .attr('class','inactive aText');
            }
			      else if (chosenXaxis === "Family"){
                
                x_WealthLabel
                .attr('class','inactive aText');
                x_FamilyLabel
                .attr('class','active aText');
				        x_HealthLabel
                .attr('class','inactive aText');
			        	x_FreedomLabel
                .attr('class','inactive aText');
				        x_TrustLabel
                .attr('class','inactive aText');
				        x_GenerosityLabel
                .attr('class','inactive aText');
            }
		        else if (chosenXaxis === "Health"){
                x_WealthLabel
                .attr('class','inactive aText');
                x_FamilyLabel
                .attr('class','inactive aText');
				        x_HealthLabel
                .attr('class','active aText');
				        x_FreedomLabel
                .attr('class','inactive aText');
			        	x_TrustLabel
                .attr('class','inactive aText');
			        	x_GenerosityLabel
                .attr('class','inactive aText');
            }
			      else if (chosenXaxis === "Freedom"){
                
                x_WealthLabel
                .attr('class','inactive aText');
                x_FamilyLabel
                .attr('class','inactive aText');
				        x_HealthLabel
                .attr('class','inactive aText');
				        x_FreedomLabel
                .attr('class','active aText');
				        x_TrustLabel
                .attr('class','inactive aText');
				        x_GenerosityLabel
                .attr('class','inactive aText');
            }
			      else if (chosenXaxis === "Trust"){
                
                x_WealthLabel
                .attr('class','inactive aText');
                x_FamilyLabel
                .attr('class','inactive aText');
				        x_HealthLabel
                .attr('class','inactive aText');
			        	x_FreedomLabel
                .attr('class','inactive aText');
			        	x_TrustLabel
                .attr('class','active aText');
			        	x_GenerosityLabel
                .attr('class','inactive aText');
            }
            else {
              x_WealthLabel
                .attr('class','inactive aText');
                x_FamilyLabel
                .attr('class','inactive aText');
				        x_HealthLabel
                .attr('class','inactive aText');
			        	x_FreedomLabel
                .attr('class','inactive aText');
			        	x_TrustLabel
                .attr('class','inactive aText');
			        	x_GenerosityLabel
                .attr('class','active aText');
			       
            }
          // update tooltip with new info after changing x-axis 
          // circlesGroup = updateToolTip(chosenXaxis, chosenYaxis, circlesGroup); 
      }})
// y axis labels event listener
ylabelsGroup.selectAll("text")
.on("click", function() {
// get value of selection
const value = d3.select(this).attr("value");
console.log(`${value} click`)
if (value !== chosenYaxis) {

    // replaces chosenXAxis with value
    chosenYaxis = value;
    console.log(chosenYaxis)

    // functions here found above csv import
    // updates x scale for new data
    yLinearScale = yScale(HappinessData, chosenYaxis);

    // updates x axis with transition
    yAxis = renderYAxes(yLinearScale, yAxis);

    // updates circles with new x values
    circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXaxis, chosenYaxis);

     // updates texts with new x values
    txtGroup = renderTexts(txtGroup, xLinearScale, yLinearScale, chosenXaxis, chosenYaxis);

    // changes classes to change bold text
	if (chosenYaxis === "Happiness") {
		y_HappinessLabel
			.classed("active", true)
			.classed("inactive", false);
		y_WealthLabel
			.classed("active", false)
			.classed("inactive", true);
		y_FamilyLabel
			.classed("active", false)
			.classed("inactive", true);
		y_HealthLabel
			.classed("active", false)
			.classed("inactive", true);
		y_FreedomLabel
			.classed("active", false)
			.classed("inactive", true);
		y_TrustLabel
			.classed("active", false)
			.classed("inactive", true);
		y_GenerosityLabel
			.classed("active", false)
			.classed("inactive", true);
	}
	else if (chosenYaxis === "Wealth"){
		y_HappinessLabel
			.classed("active", false)
			.classed("inactive", true);
		y_WealthLabel
			.classed("active", true)
			.classed("inactive", false);
		y_FamilyLabel
			.classed("active", false)
			.classed("inactive", true);
		y_HealthLabel
			.classed("active", false)
			.classed("inactive", true);
		y_FreedomLabel
			.classed("active", false)
			.classed("inactive", true);
		y_TrustLabel
			.classed("active", false)
			.classed("inactive", true);
		y_GenerosityLabel
			.classed("active", false)
			.classed("inactive", true);
	}
	else if (chosenYaxis === "Family"){
		y_HappinessLabel
			.classed("active", false)
			.classed("inactive", true);
		y_WealthLabel
			.classed("active", false)
			.classed("inactive", true);
		y_FamilyLabel
			.classed("active", true)
			.classed("inactive", false);
		y_HealthLabel
			.classed("active", false)
			.classed("inactive", true);
		y_FreedomLabel
			.classed("active", false)
			.classed("inactive", true);
		y_TrustLabel
			.classed("active", false)
			.classed("inactive", true);
		y_GenerosityLabel
			.classed("active", false)
			.classed("inactive", true);
	}
	else if (chosenYaxis === "Health"){
		y_HappinessLabel
			.classed("active", false)
			.classed("inactive", true);
		y_WealthLabel
			.classed("active", false)
			.classed("inactive", true);
		y_FamilyLabel
			.classed("active", false)
			.classed("inactive", true);
		y_HealthLabel
			.classed("active", true)
			.classed("inactive", false);
		y_FreedomLabel
			.classed("active", false)
			.classed("inactive", true);
		y_TrustLabel
			.classed("active", false)
			.classed("inactive", true);
		y_GenerosityLabel
			.classed("active", false)
			.classed("inactive", true);
	}
	else if (chosenYaxis === "Freedom"){
		y_HappinessLabel
			.classed("active", false)
			.classed("inactive", true);
		y_WealthLabel
			.classed("active", false)
			.classed("inactive", true);
		y_FamilyLabel
			.classed("active", false)
			.classed("inactive", true);
		y_HealthLabel
			.classed("active", false)
			.classed("inactive", true);
		y_FreedomLabel
			.classed("active", true)
			.classed("inactive", false);
		y_TrustLabel
			.classed("active", false)
			.classed("inactive", true);
		y_GenerosityLabel
			.classed("active", false)
			.classed("inactive", true);
	}
	else if (chosenYaxis === "Trust"){
		y_HappinessLabel
			.classed("active", false)
			.classed("inactive", true);
		y_WealthLabel
			.classed("active", false)
			.classed("inactive", true);
		y_FamilyLabel
			.classed("active", false)
			.classed("inactive", true);
		y_HealthLabel
			.classed("active", false)
			.classed("inactive", true);
		y_FreedomLabel
			.classed("active", false)
			.classed("inactive", true);
		y_TrustLabel
			.classed("active", true)
			.classed("inactive", false);
		y_GenerosityLabel
			.classed("active", false)
			.classed("inactive", true);
	}
	else{
	y_HappinessLabel
		.classed("active", false)
		.classed("inactive", true);
	y_WealthLabel
		.classed("active", false)
		.classed("inactive", true);
	y_FamilyLabel
		.classed("active", false)
		.classed("inactive", true);
	Y_HealthLabel
		.classed("active", false)
		.classed("inactive", true);
	Y_FreedomLabel
		.classed("active", false)
		.classed("inactive", true);
	y_TrustLabel
		.classed("active", false)
		.classed("inactive", true);
	y_GenerosityLabel
		.classed("active", true)
		.classed("inactive", false);
}
     // update tooltip with new info after changing y-axis 
    //  circlesGroup = updateToolTip(chosenXaxis, chosenYaxis, circlesGroup); 
  }})
})
// })()