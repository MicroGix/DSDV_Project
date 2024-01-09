// bieu do 1
function drawGenderPieChart(csvFilePath, width, height) {
  var radius = Math.min(width, height) / 3;

  // Color for each partition
  var color = d3.scaleOrdinal(d3.schemeCategory10);
  var svg = d3
    .select("#o3")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var g = svg
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // Đọc giá trị của genderFilter từ HTML
  var genderFilterSelect = d3.select("#genderFilter");

  // Đọc file CSV và vẽ biểu đồ
  d3.csv(csvFilePath).then(function (data) {
    // Tạo một đối tượng để đếm số lần xuất hiện của từng giới tính
    var genderCounts = {};

    data.forEach(function (d) {
      var gender = d.gender;
      if (genderCounts[gender]) {
        genderCounts[gender]++;
      } else {
        genderCounts[gender] = 1;
      }
    });

    // Chuyển đổi dữ liệu thành mảng để sử dụng cho biểu đồ Donut
    var genderData = [];
    for (var gender in genderCounts) {
      genderData.push({ gender: gender, count: genderCounts[gender] });
    }

    // Create a tooltip
    var tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Create donut chart
    var pie = d3.pie().value(function (d) {
      return d.count;
    });
    var path = d3
      .arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius);

    console.log(pie(genderData))
    var arc = g
      .selectAll(".arc")
      .data(pie(genderData))
      .enter()
      .append("g")
      .attr("class", "arc");

    // Add tooltips to each arc
    arc
      .append("path")
      .attr("d", path)
      .attr("fill", function (d) {
        return color(d.data.gender);
      })
      .on("mouseover", function (d) {
        // Display tooltip with gender and proportion information
        tooltip.transition().duration(800).style("opacity", 1);
        tooltip
          .html(d.data.gender + "<br/>" + getPercentage(d, genderData) + "%")
          .style("left", d3.event.pageX + 10 + "px")
          .style("top", d3.event.pageY - 28 + "px");

        // Highlight the segment on hover
        d3.select(this).attr("stroke", "white").attr("stroke-width", 2);

        // Scale the path
        d3.select(this)
          .transition()
          .duration(700)
          .attr("transform", "scale(1.25)");
      })
      .on("mouseout", function (d) {
        // Hide tooltip on mouseout
        tooltip.transition().duration(500).style("opacity", 0);

        // Remove the highlight on mouseout
        d3.select(this).attr("stroke", null);

        // Reset the scale
        d3.select(this)
          .transition()
          .duration(500)
          .attr("transform", "scale(1)");
      });

    // Add text labels to each arc
    arc
      .append("text")
      .attr("transform", function (d) {
        var x = path.centroid(d)[0] * 1.5;
        var y = path.centroid(d)[1] * 1.5;
        return "translate(" + x + "," + y + ")";
      })
      .attr("dy", ".35em")
      .attr("text-anchor", function (d) {
        return (d.endAngle + d.startAngle) / 2 > Math.PI ? "end" : "start";
      })
      .text(function (d) {
        return d.data.count;
      });

    // Function to calculate the percentage for the Donut chart
    function getPercentage(d, data) {
      var totalCount = data.reduce(function (acc, curr) {
        return acc + curr.count;
      }, 0);
      return ((d.data.count / totalCount) * 100).toFixed(2);
    }

    // Thêm tiêu đề lớn và cách biểu đồ một khoảng
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 20) // Điều chỉnh khoảng cách từ biểu đồ
      .attr("text-anchor", "middle")
      .style("font-size", "25px") // font size
      .style("font-weight", "bold")
      .text("Proportion of student genders");
    // add number label

    arc
      .append("text")
      .attr("transform", function (d) {
        var x = path.centroid(d)[0] * 1.5; // Điều chỉnh vị trí x của nhãn (tùy ý)
        var y = path.centroid(d)[1] * 1.5; // Điều chỉnh vị trí y của nhãn (tùy ý)
        return "translate(" + x + "," + y + ")";
      })
      .attr("dy", ".35em")
      .attr("text-anchor", function (d) {
        return (d.endAngle + d.startAngle) / 2 > Math.PI ? "end" : "start";
      })
      .text(function (d) {
        return d.data.count;
      });
    var legendWidth = genderData.length * 100; // 100 is the space allocated for each legend item
    // Create a legend
    var legend = svg
      .selectAll(".legend")
      .data(genderData)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", function (d, i) {
        return (
          "translate(" +
          ((width - legendWidth) / 1.65 + i * 100) +
          "," +
          (height - 30) +
          ")"
        );
      });

    // Add colored squares to the legend
    legend
      .append("rect")
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", function (d) {
        return color(d.gender);
      });

    // Add text labels to the legend
    legend
      .append("text")
      .attr("x", 30) // Adjust this value as needed
      .attr("y", 15)
      .text(function (d) {
        return d.gender;
      });
  });
}

// Sử dụng hàm
drawGenderPieChart("./main_data.csv", 500, 300);
// sơ đồ 2
function drawGroupPieChart(csvFilePath, width, height) {
  var customWidth = width;
  var customHeight = height;

  // Chọn vị trí để vẽ biểu đồ
  var svg = d3
    .select("#o4")
    .append("svg")
    .attr("width", customWidth)
    .attr("height", customHeight)
    .append("g")
    .attr(
      "transform",
      "translate(" + customWidth / 2 + "," + customHeight / 2 + ")"
    );

  // Read csv file
  d3.csv(csvFilePath)
    .then(function (data) {
      var counts = {};

      data.forEach(function (d) {
        var customGroup = d.group;
        counts[customGroup] = (counts[customGroup] || 0) + 1;
      });

      var pieData = Object.entries(counts).map(function ([
        customGroup,
        customCount,
      ]) {
        return { customGroup, customCount };
      });

      var pie = d3.pie().value(function (d) {
        return d.customCount;
      });

      var path = d3
        .arc()
        .outerRadius(customWidth / 4.5)
        .innerRadius(0);

      var color = d3.scaleOrdinal(d3.schemeCategory10);

      // Add tooltip
      var tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      var arc = svg
        .selectAll(".arc")
        .data(pie(pieData))
        .enter()
        .append("g")
        .attr("class", "arc");

      // Vẽ các phần tử của biểu đồ tròn
      arc
        .append("path")
        .attr("d", path)
        .attr("fill", function (d) {
          return color(d.data.customGroup);
        })
        .on("mouseover", function (d) {
          tooltip.transition().duration(350).style("opacity", 0.9);
          tooltip
            .html(
              d.data.customGroup + "<br/>" + getPercentage(d, pieData) + "%"
            )
            .style("left", d3.event.pageX + 10 + "px")
            .style("top", d3.event.pageY - 28 + "px");

          // Scale the path
          d3.select(this)
            .transition()
            .duration(350)
            .attr("transform", "scale(1.150)");
        })
        .on("mouseout", function () {
          // Ẩn tooltip khi rê chuột ra khỏi
          tooltip.transition().duration(500).style("opacity", 0);

          // Reset the scale
          d3.select(this)
            .transition()
            .duration(350)
            .attr("transform", "scale(1)");
        });

      // Create legend
      var legend2 = d3
        .select("#o4")
        .append("svg")
        .attr("width", customWidth)
        .attr("height", 50)
        .selectAll(".legend2")
        .data(pieData)
        .enter()
        .append("g")
        .attr("class", "legend2")
        .attr("transform", function (d, i) {
          return "translate(" + i * 95 + "," + 10 + ")";
        });

      // Add colored squares to the legend
      legend2
        .append("circle")
        .attr("cx", 37)
        .attr("cy", 9)
        .attr("r", 9) // Đặt bán kính để tạo hình tròn
        .attr("fill", function (d) {
          return color(d.customGroup);
        });
      // Add text labels to the legend
      legend2
        .append("text")
        .attr("x", 50)
        .attr("y", 15)
        .text(function (d) {
          return d.customGroup;
        });

      // Thêm tiêu đề
      svg
        .append("text")
        .attr("x", customWidth - 490)
        .attr("y", -125)
        .attr("text-anchor", "middle")
        .style("font-size", "25px")
        .style("font-weight", "bold")
        .text("Proportion of student groups");
      slices
        .append("text")
        .attr("transform", function (d) {
          return "translate(" + arc.centroid(d) + ")";
        })
        .text(function (d) {
          return d.value;
        });
    })

    .catch(function (error) {
      console.log(error);
    });

  function getPercentage(d, data) {
    var totalCount = data.reduce(function (acc, curr) {
      return acc + curr.customCount;
    }, 0);
    return ((d.data.customCount / totalCount) * 100).toFixed(2);
  }
}

// Sử dụng hàm
drawGroupPieChart("main_data.csv", 500, 300);

function countRows(csvFilePath) {
  d3.csv(csvFilePath).then(function (data) {
    var rowCount = data.length;

    // Update the DOM element with the row count and apply styling
    d3.select("#row-count")
      .html("<strong>Total Students:</strong> " + rowCount)
      .style("font-size", "18px") // Thay đổi kích thước font chữ
      .style("font-weight", "bold") // Làm đậm chữ
      .style("text-align", "center");
  });
}

// Sử dụng hàm với đường dẫn đến tệp CSV của bạn
countRows("./main_data.csv");
