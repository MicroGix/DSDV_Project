// Load the data from the CSV file
d3.csv("../panel4/main_data.csv").then(function (data) {
  // Calculate the count for each "parent degrees" value
  var counts = {};
  data.forEach(function (d) {
    var customGroup = d["parent degrees"];
    counts[customGroup] = (counts[customGroup] || 0) + 1;
  });
  // Convert the data to an array for use in the pie chart
  var pieData = Object.entries(counts).map(function ([
    customGroup,
    customCount,
  ]) {
    return { customGroup, customCount };
  });

  // Define the width and height of the chart
  var customWidth = 365;
  var customHeight = 365;
  // Select the location to draw the chart
  var svg = d3
    .select("#panel4_box-1")
    .append("svg")
    .attr("width", customWidth)
    .attr("height", customHeight)
    .append("g")
    .attr(
      "transform",
      "translate(" + customWidth / 2 + "," + customHeight / 2 + ")"
    );

  // Create a pie chart
  var pie = d3.pie().value(function (d) {
    return d.customCount;
  });

  var path = d3
    .arc()
    .outerRadius(customWidth / 3)
    .innerRadius(0);

  // Define the color scale
  var color = d3
    .scaleOrdinal()
    .domain([
      "master's degree",
      "bachelor's degree",
      "associate's degree",
      "some college",
      "some high school",
      "high school",
    ])
    .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"]); // Choose your own colors here

  // Add tooltip
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("background-color", "black")
    .style("border", "1px solid black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "#fff");
  var arc = svg
    .selectAll(".arc")
    .data(pie(pieData))
    .enter()
    .append("g")
    .attr("class", "arc");

  // Draw the elements of the pie chart
  arc
    .append("path")
    .attr("d", path)
    .attr("fill", function (d) {
      return color(d.data.customGroup);
    });

  // Add tooltips to each arc
  arc
    .append("path")
    .attr("d", path)
    .attr("fill", function (d) {
      return color(d.data.customGroup);
    })
    .on("mouseover", function (d) {
      // Display tooltip with group and proportion information
      tooltip.transition().duration(350).style("opacity", 0.9);
      tooltip
        .html(d.data.customGroup + "<br/>" + getPercentage(d, pieData) + "%")
        .style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY - 28 + "px");

      // Highlight the corresponding bar in the bar chart
      d3.select("#panel4_box-2")
        .selectAll(".bar")
        .attr("fill", function (barData) {
          return barData.group === d.data.customGroup
            ? color(barData.group)
            : "#ccc"; // Change the color as needed
        });

      // Scale the path
      d3.select(this)
        .transition()
        .duration(350)
        .attr("transform", "scale(1.125)");
    })
    .on("mouseout", function (d) {
      // Hide tooltip on mouseout
      tooltip
        .transition()
        .duration(500)
        .style("opacity", 0)
        .style("background-color", "black")
        .style("border", "1px solid black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "#fff");

      // Reset the color of the corresponding bar in the bar chart
      d3.select("#panel4_box-2")
        .selectAll(".bar")
        .attr("fill", function (barData) {
          return color(barData.group);
        });

      // Reset the scale
      d3.select(this).transition().duration(350).attr("transform", "scale(1)");
    });

  function getPercentage(d, data) {
    var totalCount = data.reduce(function (acc, curr) {
      return acc + curr.customCount;
    }, 0);
    return ((d.data.customCount / totalCount) * 100).toFixed(2);
  }

  var svgLegend = d3
    .select("#panel4_box-1") // Change the selection to the desired element
    .append("svg")
    .attr("width", customWidth - 200)
    .attr("height", customHeight - 100 + 20); // Adjust the height as needed

  var legend2 = svgLegend
    .selectAll(".legend2")
    .data(pieData)
    .enter()
    .append("g")
    .attr("class", "legend2")
    .attr("transform", function (d, i) {
      return "translate(" + (customWidth - 220) + "," + (i * 25 + 40) + ")"; // Adjust the translation as needed
    });

  // Add colored squares to the legend
  legend2
    .append("rect")
    .attr("width", 12)
    .attr("height", 12)
    .attr("fill", function (d) {
      return color(d.customGroup);
    });

  // Add text labels to the legend
  legend2
    .append("text")
    .attr("x", -8)
    .attr("y", 7)
    .attr("dy", ".20em")
    .style("font-family", "Segoe UI")
    .style("text-anchor", "end")
    .text(function (d) {
      return d.customGroup.replace(/\b\w/g, function (l) {
        return l.toUpperCase();
      });
    });
});

// Create bar chart

// Load the data from the CSV file
d3.csv("../panel4/main_data.csv").then(function (data) {
  // Filter the data to include only those rows where the parent's degree is one of the specified groups
  var filteredData = data.filter(function (d) {
    return [
      "master's degree",
      "bachelor's degree",
      "associate's degree",
      "some college",
      "some high school",
      "high school",
    ].includes(d["parent degrees"]);
  });

  // Calculate the total and count for each group
  var totals = {},
    counts = {};
  filteredData.forEach(function (d) {
    var group = d["parent degrees"];
    totals[group] =
      (totals[group] || 0) +
      parseFloat(d["math score"]) +
      parseFloat(d["reading score"]) +
      parseFloat(d["writing score"]);
    counts[group] = (counts[group] || 0) + 1;
  });

  // Calculate the average for each group
  var averages = {};
  for (var group in totals) {
    averages[group] = totals[group] / counts[group];
  }

  // Convert the data to an array for use in the bar chart
  var barData = Object.entries(averages).map(function ([group, avg]) {
    return { group, avg };
  });

  // Sort the data in decreasing order of the average score
  barData.sort(function (a, b) {
    return b.avg - a.avg;
  });

  // Define the dimensions of the chart
  var margin = { top: 70, right: 50, bottom: 30, left: 100 },
    width = 800 - margin.left - margin.right, // Adjust the width here
    height = 400 - margin.top - margin.bottom; // Adjust the height here

  // Define the scales
  var x = d3.scaleLinear().range([0, width]);
  var y = d3
    .scaleBand()
    .range([height, 0])
    .domain(
      barData.map(function (d) {
        return d.group;
      })
    )
    .padding(0.1);

  // Define the color scale
  var color = d3
    .scaleOrdinal()
    .domain([
      "master's degree",
      "bachelor's degree",
      "associate's degree",
      "some college",
      "some high school",
      "high school",
    ])
    .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"]); // Choose your own colors here

  // Define the SVG element
  var svg = d3
    .select("#panel4_box-2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Set the domains of the scales
  x.domain([
    0,
    d3.max(barData, function (d) {
      return d.avg;
    }),
  ]);

  // Add the x-axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .attr("color", "black")
    .style("font-family", "Segoe UI")
    .style("font-size", "10px");

  // Add the y-axis
  svg
    .append("g")
    .call(
      d3.axisLeft(y).tickFormat(function (d) {
        return d.replace(/\b\w/g, function (l) {
          return l.toUpperCase();
        });
      })
    )
    .style("font-family", "Segoe UI")
    .style("font-size", "11px")
    .attr("color", "black");

  // Add the bars
  var bars = svg
    .selectAll(".bar")
    .data(barData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", 1.5)
    .attr("height", y.bandwidth())
    .attr("y", function (d) {
      return y(d.group);
    })
    .attr("width", function (d) {
      return x(d.avg);
    })
    .attr("fill", function (d) {
      return color(d.group);
    });
  // Add text label on top of each bar
  svg
    .selectAll(".text")
    .data(barData)
    .enter()
    .append("text")
    .attr("class", "label")
    .style("font-family", "Segoe UI")
    .style("font-size", "12px")
    // Position text at the end of the bar
    .attr("y", function (d) {
      return y(d.group) + y.bandwidth() / 2 + 5;
    })
    .attr("x", function (d) {
      return x(d.avg) + 5;
    })
    // Align the text to the left
    .attr("text-anchor", "start")
    // Display the value
    .text(function (d) {
      return d.avg.toFixed(2);
    }); // Use toFixed(2) to round to 2 decimal places
  // Add a title to the chart
  svg
    .append("text")
    .attr("x", width / 2) // Center the text
    .attr("y", -20) // Position the text at the very top
    .attr("text-anchor", "middle") // Ensure the text is centered
    .style("font-size", "24px")
    .style("font-weight", "bold")
    .style("font-family", "Segoe UI")
    .text("The total mark of Student by Parent's Dergree");
  bars
    .on("mouseover", function (d) {
      // Highlight the corresponding arc in the pie chart
      d3.select("#panel4_box-1")
        .selectAll(".arc")
        .select("path")
        .attr("fill", function (arcData) {
          return arcData.data.customGroup === d.group
            ? color(arcData.data.customGroup)
            : "#ccc"; // Change the color as needed
        });
    })
    .on("mouseout", function (d) {
      // Reset the color of the corresponding arc in the pie chart
      d3.select("#panel4_box-1")
        .selectAll(".arc")
        .select("path")
        .attr("fill", function (arcData) {
          return color(arcData.data.customGroup);
        });
    });
});


d3.csv("../panel4/main_data.csv").then(function (data) {
  // Calculate the total score for each student and add it to the data
  data.forEach(function (d) {
    d.totalScore = +d["math score"] + +d["reading score"] + +d["writing score"];
  });

  // Sort the data by total score in descending order
  data.sort(function (a, b) {
    return b.totalScore - a.totalScore;
  });

  // Keep only the top 5 and bottom 5 rows
  var filteredData = data.slice(0, 5).concat(data.slice(-5));

  // Create the DataTable
  var table = $("#panel4_box-4").DataTable({
    data: filteredData,
    columns: [
      { data: "name", title: "Name" },
      { data: "totalScore", title: "Total Score" },
      { data: "parent degrees", title: "Parent's Degree" },
    ],
    order: [[1, "desc"]],
    dom: "Bfrtip",
    buttons: [
      {
        text: "Sort Ascending",
        action: function (e, dt, node, config) {
          dt.order([1, "asc"]).draw();
        },
      },
      {
        text: "Sort Descending",
        action: function (e, dt, node, config) {
          dt.order([1, "desc"]).draw();
        },
      },
    ],
    paging: true,
    pageLength: 5,
    info: false,
    searching: true,
  });
});
$("#panel4_box-4 tbody").on("mouseenter", "tr", function () {
  $(this).css("background-color", "#f5f5f5");
});

$("#panel4_box-4 tbody").on("mouseleave", "tr", function () {
  $(this).css("background-color", "");
});
