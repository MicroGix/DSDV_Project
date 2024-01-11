var csvFilePath = "./main_data.csv";
function rowConverter(d) {
  return {
    name: d.name,
    gender: d.gender,
    pdegrees: d["parent degrees"],
    lunch: d.lunch,
    tpc: d["test prep"],
    math: parseFloat(d["math score"]),
    reading: parseFloat(d["reading score"]),
    writing: parseFloat(d["writing score"]),
    avg: parseFloat(d.avg),
    result: d.result,
    grade: d.grade,
    group: d.group,
  };
}
d3.csv(csvFilePath, rowConverter).then(function (data) {
  initPanel_2_A(data);
  initPanel_2_B(data);
  initPanel_2_C(data);
  initPanel_2_D(data);
  initPanel_2_E(data);
  initPanel_2(data);
});

//    GROUP A
//----------------------------------------------------------
function initPanel_2_A(data) {
  // SVG DIMENSION (SOLVE)
  const outer_w = 300;
  const outer_h = 200;
  const margin = { top: 20, right: 10, bottom: 50, left: 50 };
  const h = outer_h - margin.top - margin.bottom;
  const w = outer_w - margin.right - margin.left;
  const p = 20;

  // SVG CONTAINER (SOLVE)
  const stack = d3
    .select("#panel2_smbox2")
    .append("svg")
    .attr("width", outer_w)
    .attr("height", outer_h)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  // CREATE FUNCTION TO COUNT NUMBERS OF lunch BY GENDER (SOLVE)
  // See explaination at problem 6.

  function countGenderbylunch(data) {
    const result = {};
    data.forEach((d) => {
      const lunch = d.lunch;
      const gender = d.gender;
      const group = d.group;
      if (group === "group A") {
        result[lunch] = result[lunch] || { total: 0, gender: {} };
        result[lunch].gender[gender] = result[lunch].gender[gender] || { n: 0 };
        result[lunch].total++;
        result[lunch].gender[gender].n++;
      }
    });
    return result;
  }

  // CREATE DATASET FOR STACK CHARTS
  const lunchbyGender = countGenderbylunch(data);
  const genderData = Object.entries(lunchbyGender).map(([lunch, value]) => {
    const gender = Object.values(value.gender);
    const female = Object.values(gender[0]);
    const male = Object.values(gender[1]);
    return { lunch: lunch, female: female[0], male: male[0] };
  });
  console.log(genderData);

  // SET UP SCALE
  const lunchLabelStack = genderData.map((d) => d.lunch);
  const subgroups = genderData.map(({ female, male }) => {
    return { female: female, male: male };
  });
  const after_stackData = d3.stack().keys(["female", "male"])(genderData);
  //-----------------------------------------------------------
  // tooltip
  const stack_tooltip = d3
    .select("#panel2_smbox2")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("background-color", "black")
    .style("border", "1px solid black")
    .style("border-radius", "5px")
    .style("padding", "10px");

  let stack_mouseover = function (d) {
    stack_tooltip.style("opacity", 1);
    stack.selectAll("rect").transition().duration(700).style("opacity", 0.5);
    d3.select(this)
      .transition()
      .duration(700)
      .style("opacity", 1)
      .attr("stroke", "black") // Set the border color to black
      .attr("stroke-width", "2px");
  };
  let stack_mousemove = function (d) {
    const subgroupName = d3.select(this.parentNode).datum().key;
    const subgroupValue = d.data[subgroupName];
    stack_tooltip
      .html("Gender: " + subgroupName + "<br>" + "Amount: " + subgroupValue)
      .style("color", "white")
      .style("left", d3.event.pageX - 20 + "px")
      .style("top", d3.event.pageY - 120 + "px");
  };
  let stack_mouseleave = function (d) {
    stack_tooltip.style("opacity", 0);
    stack.selectAll("rect").transition().duration(700).style("opacity", 1);
    d3.select(this)
      .transition()
      .duration(700)
      .style("opacity", 1)
      .attr("stroke", "black") // Set the border color to black
      .attr("stroke-width", "0px");
  };
  //-----------------------------------------------------------
  const xStack = d3
    .scaleBand()
    .domain(lunchLabelStack.reverse()) // reverse order
    .range([0, w])
    .padding([0.2]);
  stack
    .append("g")
    .attr("transform", "translate(0," + h + ")")
    .call(d3.axisBottom(xStack).tickSizeOuter(0));
  const yStack = d3.scaleLinear().domain([0, 50]).range([h, 0]);
  stack.append("g");
  const color = d3
    .scaleOrdinal()
    .domain(subgroups)
    .range(["#FFD966", "#6096B4"]);

  // INITIATE STACK CHART (SOLVE)
  // New problems: how can i make it more beautiful
  stack
    .append("g")
    .selectAll("g")
    .data(after_stackData)
    .enter()
    .append("g")
    .attr("fill", (d) => color(d.key))
    .selectAll("rect")
    .data((d) => d)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return xStack(d.data.lunch); // data here mean the .data(after_stackData) you add above
    })
    .attr("y", function (d) {
      return yStack(d[1]);
    })
    .attr("height", function (d) {
      return yStack(d[0]) - yStack(d[1]);
    })
    .style("opacity", 1)
    .on("mouseover", stack_mouseover)
    .on("mousemove", stack_mousemove)
    .on("mouseleave", stack_mouseleave)
    .attr("width", xStack.bandwidth());
  stack
    .selectAll(".bar-label")
    .data(after_stackData)
    .enter()
    .append("g")
    .selectAll("text")
    .data((d) => d)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", function (d) {
      return xStack(d.data.lunch) + xStack.bandwidth() / 2;
    })
    .attr("y", function (d) {
      return yStack(d[1]) + 5 + (yStack(d[0]) - yStack(d[1])) / 2; // Center the label vertically within the segment
    })
    .text(function (d) {
      return d[1] - d[0]; // Display the numerical value of each segment
    })
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle"); // Center the label horizontally within the segment
  d3.selectAll("path,line").remove();
}
//---------------------------
// GROUP B
//---------------------------------------------------------
function initPanel_2_B(data) {
  // SVG DIMENSION (SOLVE)
  const outer_w = 300;
  const outer_h = 200;
  const margin = { top: 20, right: 10, bottom: 50, left: 50 };
  const h = outer_h - margin.top - margin.bottom;
  const w = outer_w - margin.right - margin.left;
  const p = 20;

  // SVG CONTAINER (SOLVE)
  const stack = d3
    .select("#panel2_smbox3")
    .append("svg")
    .attr("width", outer_w)
    .attr("height", outer_h)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  // CREATE FUNCTION TO COUNT NUMBERS OF lunch BY GENDER (SOLVE)
  // See explaination at problem 6.
  function countGenderbylunch(data) {
    const result = {};
    data.forEach((d) => {
      const lunch = d.lunch;
      const gender = d.gender;
      const group = d.group;
      if (group === "group B") {
        result[lunch] = result[lunch] || { total: 0, gender: {} };
        result[lunch].gender[gender] = result[lunch].gender[gender] || { n: 0 };
        result[lunch].total++;
        result[lunch].gender[gender].n++;
      }
    });
    return result;
  }

  // CREATE DATASET FOR STACK CHARTS
  const lunchbyGender = countGenderbylunch(data);
  const genderData = Object.entries(lunchbyGender).map(([lunch, value]) => {
    const gender = Object.values(value.gender);
    let female, male;
    if (lunch === "standard") {
      female = Object.values(gender[1]);
      male = Object.values(gender[0]);
    } else {
      female = Object.values(gender[0]);
      male = Object.values(gender[1]);
    }
    return { lunch: lunch, female: female[0], male: male[0] };
  });
  console.log(genderData);
  // SET UP SCALE
  const lunchLabelStack = genderData.map((d) => d.lunch);
  const subgroups = genderData.map(({ female, male }) => {
    return { female: female, male: male };
  });
  // Combine stacks
  const after_stackData = d3.stack().keys(["female", "male"])(genderData);
  //-----------------------------------------------------------
  // tooltip
  const stack_tooltip = d3
    .select("#panel2_smbox3")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("background-color", "black")
    .style("border", "1px solid black")
    .style("border-radius", "5px")
    .style("padding", "10px");

  let stack_mouseover = function (d) {
    stack_tooltip.style("opacity", 1);
    stack.selectAll("rect").transition().duration(700).style("opacity", 0.5);
    d3.select(this)
      .transition()
      .duration(700)
      .style("opacity", 1)
      .attr("stroke", "black") // Set the border color to black
      .attr("stroke-width", "2px");
  };
  let stack_mousemove = function (d) {
    const subgroupName = d3.select(this.parentNode).datum().key;
    const subgroupValue = d.data[subgroupName];
    stack_tooltip
      .html("Gender: " + subgroupName + "<br>" + "Amount: " + subgroupValue)
      .style("color", "white")
      .style("left", d3.event.pageX - 20 + "px")
      .style("top", d3.event.pageY - 120 + "px");
  };
  let stack_mouseleave = function (d) {
    stack_tooltip.style("opacity", 0);
    stack.selectAll("rect").transition().duration(700).style("opacity", 1);
    d3.select(this)
      .transition()
      .duration(700)
      .style("opacity", 1)
      .attr("stroke", "black") // Set the border color to black
      .attr("stroke-width", "0px");
  };
  // Draw charts
  stack.selectAll("g").data(after_stackData).enter();
  // etc
  const xStack = d3
    .scaleBand()
    .domain(lunchLabelStack)
    .range([0, w])
    .padding([0.2]);
  stack
    .append("g")
    .attr("transform", "translate(0," + h + ")")
    .call(d3.axisBottom(xStack).tickSizeOuter(0));
  const yStack = d3.scaleLinear().domain([0, 115]).range([h, 0]);
  stack.append("g");
  const color = d3
    .scaleOrdinal()
    .domain(["female", "male"]) // Adjust the domain for group B categories
    .range(["#6096B4", "#FFD966"]);

  // INITIATE STACK CHART (SOLVE)
  // New problems: how can i make it more beautiful
  stack
    .append("g")
    .selectAll("g")
    .data(after_stackData)
    .enter()
    .append("g")
    .attr("fill", (d) => color(d.key))
    .selectAll("rect")
    .data((d) => d)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return xStack(d.data.lunch); // data here mean the .data(after_stackData) you add above
    })
    .attr("y", function (d) {
      return yStack(d[1]);
    })
    .attr("height", function (d) {
      return yStack(d[0]) - yStack(d[1]);
    })
    .style("opacity", 1)
    .on("mouseover", stack_mouseover)
    .on("mousemove", stack_mousemove)
    .on("mouseleave", stack_mouseleave)
    .attr("width", xStack.bandwidth());
  stack
    .selectAll(".bar-label")
    .data(after_stackData)
    .enter()
    .append("g")
    .selectAll("text")
    .data((d) => d)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", function (d) {
      return xStack(d.data.lunch) + xStack.bandwidth() / 2;
    })
    .attr("y", function (d) {
      return yStack(d[1]) + 5 + (yStack(d[0]) - yStack(d[1])) / 2; // Center the label vertically within the segment
    })
    .text(function (d) {
      return d[1] - d[0]; // Display the numerical value of each segment
    })
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle"); // Center the label horizontally within the segment
  d3.selectAll("path,line").remove();
}
// GROUP C
//----------------------------------------------------------
function initPanel_2_C(data) {
  // SVG DIMENSION (SOLVE)
  const outer_w = 300;
  const outer_h = 200;
  const margin = { top: 20, right: 10, bottom: 50, left: 50 };
  const h = outer_h - margin.top - margin.bottom;
  const w = outer_w - margin.right - margin.left;
  const p = 20;
  // SVG CONTAINER (SOLVE)
  const stack = d3
    .select("#panel2_smbox4")
    .append("svg")
    .attr("width", outer_w)
    .attr("height", outer_h)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  // CREATE FUNCTION TO COUNT NUMBERS OF lunch BY GENDER (SOLVE)
  // See explaination at problem 6.

  function countGenderbylunch(data) {
    const result = {};
    data.forEach((d) => {
      const lunch = d.lunch;
      const gender = d.gender;
      const group = d.group;
      if (group === "group C") {
        result[lunch] = result[lunch] || { total: 0, gender: {} };
        result[lunch].gender[gender] = result[lunch].gender[gender] || { n: 0 };
        result[lunch].total++;
        result[lunch].gender[gender].n++;
      }
    });
    return result;
  }

  // CREATE DATASET FOR STACK CHARTS
  const lunchbyGender = countGenderbylunch(data);
  const genderData = Object.entries(lunchbyGender).map(([lunch, value]) => {
    const gender = Object.values(value.gender);
    let female, male;
    if (lunch === "standard") {
      female = Object.values(gender[1]);
      male = Object.values(gender[0]);
    } else {
      female = Object.values(gender[0]);
      male = Object.values(gender[1]);
    }
    return { lunch: lunch, female: female[0], male: male[0] };
  });
  console.log(genderData);
  // SET UP SCALE
  const lunchLabelStack = genderData.map((d) => d.lunch);
  const subgroups = genderData.map(({ female, male }) => {
    return { female: female, male: male };
  });
  const after_stackData = d3.stack().keys(["female", "male"])(genderData);
  //-----------------------------------------------------------
  // tooltip
  const stack_tooltip = d3
    .select("#panel2_smbox4")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("background-color", "black")
    .style("border", "1px solid black")
    .style("border-radius", "5px")
    .style("padding", "10px");

  let stack_mouseover = function (d) {
    stack_tooltip.style("opacity", 1);
    stack.selectAll("rect").transition().duration(700).style("opacity", 0.5);
    d3.select(this)
      .transition()
      .duration(700)
      .style("opacity", 1)
      .attr("stroke", "black") // Set the border color to black
      .attr("stroke-width", "2px");
  };
  let stack_mousemove = function (d) {
    const subgroupName = d3.select(this.parentNode).datum().key;
    const subgroupValue = d.data[subgroupName];
    stack_tooltip
      .html("Gender: " + subgroupName + "<br>" + "Amount: " + subgroupValue)
      .style("color", "white")
      .style("left", d3.event.pageX - 20 + "px")
      .style("top", d3.event.pageY - 120 + "px");
  };
  let stack_mouseleave = function (d) {
    stack_tooltip.style("opacity", 0);
    stack.selectAll("rect").transition().duration(700).style("opacity", 1);
    d3.select(this)
      .transition()
      .duration(700)
      .style("opacity", 1)
      .attr("stroke", "black") // Set the border color to black
      .attr("stroke-width", "0px");
  };
  const xStack = d3
    .scaleBand()
    .domain(lunchLabelStack)
    .range([0, w])
    .padding([0.2]);
  stack
    .append("g")
    .attr("transform", "translate(0," + h + ")")
    .call(d3.axisBottom(xStack).tickSizeOuter(0));
  const yStack = d3.scaleLinear().domain([0, 190]).range([h, 0]);
  stack.append("g");
  const color = d3
    .scaleOrdinal()
    .domain(subgroups)
    .range(["#FFD966", "#6096B4"]);

  // INITIATE STACK CHART (SOLVE)
  // New problems: how can i make it more beautiful
  stack
    .append("g")
    .selectAll("g")
    .data(after_stackData)
    .enter()
    .append("g")
    .attr("fill", (d) => color(d.key))
    .selectAll("rect")
    .data((d) => d)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return xStack(d.data.lunch); // data here mean the .data(after_stackData) you add above
    })
    .attr("y", function (d) {
      return yStack(d[1]);
    })
    .attr("height", function (d) {
      return yStack(d[0]) - yStack(d[1]);
    })
    .style("opacity", 1)
    .on("mouseover", stack_mouseover)
    .on("mousemove", stack_mousemove)
    .on("mouseleave", stack_mouseleave)
    .attr("width", xStack.bandwidth());
  stack
    .selectAll(".bar-label")
    .data(after_stackData)
    .enter()
    .append("g")
    .selectAll("text")
    .data((d) => d)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", function (d) {
      return xStack(d.data.lunch) + xStack.bandwidth() / 2;
    })
    .attr("y", function (d) {
      return yStack(d[1]) + 5 + (yStack(d[0]) - yStack(d[1])) / 2; // Center the label vertically within the segment
    })
    .text(function (d) {
      return d[1] - d[0]; // Display the numerical value of each segment
    })
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle"); // Center the label horizontally within the segment
  d3.selectAll("path,line").remove();
}
// GROUP D
//----------------------------------------------------------
function initPanel_2_D(data) {
  // SVG DIMENSION (SOLVE)
  const outer_w = 300;
  const outer_h = 200;
  const margin = { top: 20, right: 10, bottom: 50, left: 50 };
  const h = outer_h - margin.top - margin.bottom;
  const w = outer_w - margin.right - margin.left;
  const p = 20;
  // SVG CONTAINER (SOLVE)
  const stack = d3
    .select("#panel2_smbox5")
    .append("svg")
    .attr("width", outer_w)
    .attr("height", outer_h)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  // CREATE FUNCTION TO COUNT NUMBERS OF lunch BY GENDER (SOLVE)
  // See explaination at problem 6.

  function countGenderbylunch(data) {
    const result = {};
    data.forEach((d) => {
      const lunch = d.lunch;
      const gender = d.gender;
      const group = d.group;
      if (group === "group D") {
        result[lunch] = result[lunch] || { total: 0, gender: {} };
        result[lunch].gender[gender] = result[lunch].gender[gender] || { n: 0 };
        result[lunch].total++;
        result[lunch].gender[gender].n++;
      }
    });
    return result;
  }

  // CREATE DATASET FOR STACK CHARTS
  const lunchbyGender = countGenderbylunch(data);
  const genderData = Object.entries(lunchbyGender).map(([lunch, value]) => {
    const gender = Object.values(value.gender);
    const female = Object.values(gender[0]);
    const male = Object.values(gender[1]);
    return { lunch: lunch, female: female[0], male: male[0] };
  });
  console.log(genderData);
  genderData.sort((a, b) => {
    return a.lunch > b.lunch ? 1 : -1;
  });

  // SET UP SCALE
  const lunchLabelStack = genderData.map((d) => d.lunch);
  const subgroups = genderData.map(({ female, male }) => {
    return { female: female, male: male };
  });
  const after_stackData = d3.stack().keys(["female", "male"])(
    genderData.reverse()
  );
  //-----------------------------------------------------------
  // tooltip
  const stack_tooltip = d3
    .select("#panel2_smbox5")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("background-color", "black")
    .style("border", "1px solid black")
    .style("border-radius", "5px")
    .style("padding", "10px");

  let stack_mouseover = function (d) {
    stack_tooltip.style("opacity", 1);
    stack.selectAll("rect").transition().duration(700).style("opacity", 0.5);
    d3.select(this)
      .transition()
      .duration(700)
      .style("opacity", 1)
      .attr("stroke", "black") // Set the border color to black
      .attr("stroke-width", "2px");
  };
  let stack_mousemove = function (d) {
    const subgroupName = d3.select(this.parentNode).datum().key;
    const subgroupValue = d.data[subgroupName];
    stack_tooltip
      .html("Gender: " + subgroupName + "<br>" + "Amount: " + subgroupValue)
      .style("color", "white")
      .style("left", d3.event.pageX - 20 + "px")
      .style("top", d3.event.pageY - 120 + "px");
  };
  let stack_mouseleave = function (d) {
    stack_tooltip.style("opacity", 0);
    stack.selectAll("rect").transition().duration(700).style("opacity", 1);
    d3.select(this)
      .transition()
      .duration(700)
      .style("opacity", 1)
      .attr("stroke", "black") // Set the border color to black
      .attr("stroke-width", "0px");
  };
  const xStack = d3
    .scaleBand()
    .domain(lunchLabelStack.reverse())
    .range([0, w])
    .padding(0.2);
  stack
    .append("g")
    .attr("transform", "translate(0," + h + ")")
    .call(d3.axisBottom(xStack).tickSizeOuter(0));
  const yStack = d3.scaleLinear().domain([0, 155]).range([h, 0]);
  stack.append("g");
  const color = d3
    .scaleOrdinal()
    .domain(subgroups)
    .range(["#FFD966", "#6096B4"]);

  // INITIATE STACK CHART (SOLVE)
  // New problems: how can i make it more beautiful
  stack
    .append("g")
    .selectAll("g")
    .data(after_stackData)
    .enter()
    .append("g")
    .attr("fill", (d) => color(d.key))
    .selectAll("rect")
    .data((d) => d)
    .enter()
    .append("rect")
    .attr("x", (d) => xStack(d.data.lunch))
    .attr("y", function (d) {
      return yStack(d[1]);
    })
    .attr("height", function (d) {
      return yStack(d[0]) - yStack(d[1]);
    })
    .style("opacity", 1)
    .on("mouseover", stack_mouseover)
    .on("mousemove", stack_mousemove)
    .on("mouseleave", stack_mouseleave)
    .attr("width", xStack.bandwidth());
  stack
    .selectAll(".bar-label")
    .data(after_stackData)
    .enter()
    .append("g")
    .selectAll("text")
    .data((d) => d)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", function (d) {
      return xStack(d.data.lunch) + xStack.bandwidth() / 2;
    })
    .attr("y", function (d) {
      return yStack(d[1]) + 5 + (yStack(d[0]) - yStack(d[1])) / 2; // Center the label vertically within the segment
    })
    .text(function (d) {
      return d[1] - d[0]; // Display the numerical value of each segment
    })
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle"); // Center the label horizontally within the segment

  d3.selectAll("path,line").remove();
}
// GROUP E
//----------------------------------------------------------
function initPanel_2_E(data) {
  // SVG DIMENSION (SOLVE)
  const outer_w = 300;
  const outer_h = 200;
  const margin = { top: 20, right: 10, bottom: 50, left: 50 };
  const h = outer_h - margin.top - margin.bottom;
  const w = outer_w - margin.right - margin.left;
  const p = 20;
  // SVG CONTAINER (SOLVE)
  const stack = d3
    .select("#panel2_smbox6")
    .append("svg")
    .attr("width", outer_w)
    .attr("height", outer_h)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  // CREATE FUNCTION TO COUNT NUMBERS OF lunch BY GENDER (SOLVE)
  // See explaination at problem 6.
  function countGenderbylunch(data) {
    const result = {};
    data.forEach((d) => {
      const lunch = d.lunch;
      const gender = d.gender;
      const group = d.group;
      if (group === "group E") {
        result[lunch] = result[lunch] || { total: 0, gender: {} };
        result[lunch].gender[gender] = result[lunch].gender[gender] || { n: 0 };
        result[lunch].total++;
        result[lunch].gender[gender].n++;
      }
    });
    return result;
  }
  // CREATE DATASET FOR STACK CHARTS
  const lunchbyGender = countGenderbylunch(data);
  const genderData = Object.entries(lunchbyGender).map(([lunch, value]) => {
    const gender = Object.values(value.gender);
    let female, male;
    if (lunch === "standard") {
      female = Object.values(gender[0]);
      male = Object.values(gender[1]);
    } else {
      female = Object.values(gender[1]);
      male = Object.values(gender[0]);
    }
    return { lunch: lunch, female: female[0], male: male[0] };
  });
  console.log(genderData);
  genderData.sort((a, b) => {
    return a.lunch > b.lunch ? 1 : -1;
  });

  // SET UP SCALE
  const lunchLabelStack = genderData.map((d) => d.lunch);
  const subgroups = genderData.map(({ female, male }) => {
    return { female: female, male: male };
  });
  const after_stackData = d3.stack().keys(["female", "male"])(
    genderData.reverse()
  );
  //-----------------------------------------------------------
  // tooltip
  const stack_tooltip = d3
    .select("#panel2_smbox6")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("background-color", "black")
    .style("border", "1px solid black")
    .style("border-radius", "5px")
    .style("padding", "10px");

  let stack_mouseover = function (d) {
    stack_tooltip.style("opacity", 1);
    stack.selectAll("rect").transition().duration(700).style("opacity", 0.5);
    d3.select(this)
      .transition()
      .duration(700)
      .style("opacity", 1)
      .attr("stroke", "black") // Set the border color to black
      .attr("stroke-width", "2px");
  };
  let stack_mousemove = function (d) {
    const subgroupName = d3.select(this.parentNode).datum().key;
    const subgroupValue = d.data[subgroupName];
    stack_tooltip
      .html("Gender: " + subgroupName + "<br>" + "Amount: " + subgroupValue)
      .style("color", "white")
      .style("left", d3.event.pageX - 20 + "px")
      .style("top", d3.event.pageY - 120 + "px");
  };
  let stack_mouseleave = function (d) {
    stack_tooltip.style("opacity", 0);
    stack.selectAll("rect").transition().duration(700).style("opacity", 1);
    d3.select(this)
      .transition()
      .duration(700)
      .style("opacity", 1)
      .attr("stroke", "black") // Set the border color to black
      .attr("stroke-width", "0px");
  };
  const xStack = d3
    .scaleBand()
    .domain(lunchLabelStack.reverse())
    .range([0, w])
    .padding([0.2]);
  stack
    .append("g")
    .attr("transform", "translate(0," + h + ")")
    .call(d3.axisBottom(xStack).tickSizeOuter(0));
  const yStack = d3.scaleLinear().domain([0, 91]).range([h, 0]);
  stack.append("g");
  const color = d3
    .scaleOrdinal()
    .domain(subgroups)
    .range(["#FFD966", "#6096B4"]);

  // INITIATE STACK CHART (SOLVE)
  // New problems: how can i make it more beautiful
  stack
    .append("g")
    .selectAll("g")
    .data(after_stackData)
    .enter()
    .append("g")
    .attr("fill", (d) => color(d.key))
    .selectAll("rect")
    .data((d) => d)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return xStack(d.data.lunch);
    })
    .attr("y", function (d) {
      return yStack(d[1]);
    })
    .attr("height", function (d) {
      return yStack(d[0]) - yStack(d[1]);
    })
    .style("opacity", 1)
    .on("mouseover", stack_mouseover)
    .on("mousemove", stack_mousemove)
    .on("mouseleave", stack_mouseleave)
    .attr("width", xStack.bandwidth());
  stack
    .selectAll(".bar-label")
    .data(after_stackData)
    .enter()
    .append("g")
    .selectAll("text")
    .data((d) => d)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", function (d) {
      return xStack(d.data.lunch) + xStack.bandwidth() / 2;
    })
    .attr("y", function (d) {
      return yStack(d[1]) + 5 + (yStack(d[0]) - yStack(d[1])) / 2; // Center the label vertically within the segment
    })
    .text(function (d) {
      return d[1] - d[0]; // Display the numerical value of each segment
    })
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle"); // Center the label horizontally within the segment

  d3.selectAll("path,line").remove();
}
//---------------------------------
// GROUP ALl
//----------------------------------------------------------
function initPanel_2(data) {
  // SVG DIMENSION (SOLVE)
  const outer_w = 300;
  const outer_h = 200;
  const margin = { top: 20, right: 10, bottom: 50, left: 50 };
  const h = outer_h - margin.top - margin.bottom;
  const w = outer_w - margin.right - margin.left;
  const p = 20;

  // SVG CONTAINER (SOLVE)
  const stack = d3
    .select("#panel2_smbox7")
    .append("svg")
    .attr("width", outer_w)
    .attr("height", outer_h)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  // CREATE FUNCTION TO COUNT NUMBERS OF lunch BY GENDER (SOLVE)
  // See explaination at problem 6.

  function countGenderbylunch(data) {
    const result = {};
    data.forEach((d) => {
      const lunch = d.lunch;
      const gender = d.gender;
      result[lunch] = result[lunch] || { total: 0, gender: {} };
      result[lunch].gender[gender] = result[lunch].gender[gender] || { n: 0 };
      result[lunch].total++;
      result[lunch].gender[gender].n++;
    });
    return result;
  }

  // CREATE DATASET FOR STACK CHARTS
  const lunchbyGender = countGenderbylunch(data);
  const genderData = Object.entries(lunchbyGender).map(([lunch, value]) => {
    const gender = Object.values(value.gender);
    let female, male;
    if (lunch === "standard") {
      female = Object.values(gender[1]);
      male = Object.values(gender[0]);
    } else {
      female = Object.values(gender[0]);
      male = Object.values(gender[1]);
    }
    return { lunch: lunch, female: female[0], male: male[0] };
  });

  console.log(genderData);

  // SET UP SCALE
  const lunchLabelStack = genderData.map((d) => d.lunch);
  const subgroups = genderData.map(({ female, male }) => {
    return { female: female, male: male };
  });
  const after_stackData = d3.stack().keys(["female", "male"])(
    genderData.reverse()
  );
  //-----------------------------------------------------------
  // tooltip
  const stack_tooltip = d3
    .select("#panel2_smbox7")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("background-color", "black")
    .style("border", "1px solid black")
    .style("border-radius", "5px")
    .style("padding", "10px");

  let stack_mouseover = function (d) {
    stack_tooltip.style("opacity", 1);
    stack.selectAll("rect").transition().duration(700).style("opacity", 0.5);
    d3.select(this)
      .transition()
      .duration(700)
      .style("opacity", 1)
      .attr("stroke", "black") // Set the border color to black
      .attr("stroke-width", "2px");
  };
  let stack_mousemove = function (d) {
    const subgroupName = d3.select(this.parentNode).datum().key;
    const subgroupValue = d.data[subgroupName];
    stack_tooltip
      .html("Gender: " + subgroupName + "<br>" + "Amount: " + subgroupValue)
      .style("color", "white")
      .style("left", d3.event.pageX - 20 + "px")
      .style("top", d3.event.pageY - 120 + "px");
  };
  let stack_mouseleave = function (d) {
    stack_tooltip.style("opacity", 0);
    stack.selectAll("rect").transition().duration(700).style("opacity", 1);
    d3.select(this)
      .transition()
      .duration(700)
      .style("opacity", 1)
      .attr("stroke", "black") // Set the border color to black
      .attr("stroke-width", "0px");
  };
  //-----------------------------------------------------------
  const xStack = d3
    .scaleBand()
    .domain(lunchLabelStack)
    .range([0, w])
    .padding([0.2]);
  stack
    .append("g")
    .attr("transform", "translate(0," + h + ")")
    .call(d3.axisBottom(xStack).tickSizeOuter(0));
  const yStack = d3.scaleLinear().domain([0, 600]).range([h, 0]);
  stack.append("g");
  const color = d3
    .scaleOrdinal()
    .domain(subgroups)
    .range(["#FFD966", "#6096B4"]);

  // INITIATE STACK CHART (SOLVE)
  // New problems: how can i make it more beautiful
  stack
    .append("g")
    .selectAll("g")
    .data(after_stackData)
    .enter()
    .append("g")
    .attr("fill", (d) => color(d.key))
    .selectAll("rect")
    .data((d) => d)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return xStack(d.data.lunch); // data here mean the .data(after_stackData) you add above
    })
    .attr("y", function (d) {
      return yStack(d[1]);
    })
    .attr("height", function (d) {
      return yStack(d[0]) - yStack(d[1]);
    })
    .style("opacity", 1)
    .on("mouseover", stack_mouseover)
    .on("mousemove", stack_mousemove)
    .on("mouseleave", stack_mouseleave)
    .attr("width", xStack.bandwidth());
  stack
    .selectAll(".bar-label")
    .data(after_stackData)
    .enter()
    .append("g")
    .selectAll("text")
    .data((d) => d)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("fill", "black")
    .attr("x", function (d) {
      return xStack(d.data.lunch) + xStack.bandwidth() / 2;
    })
    .attr("y", function (d) {
      return yStack(d[1]) + 5 + (yStack(d[0]) - yStack(d[1])) / 2; // Center the label vertically within the segment
    })
    .text(function (d) {
      return d[1] - d[0]; // Display the numerical value of each segment
    })
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle"); // Center the label horizontally within the segment

  d3.selectAll("path,line").remove();
}

//------------------------------------------------------------------
var csvFilePath = "./main_data.csv";

// Read data from the CSV file
d3.csv(csvFilePath).then(function (data) {
  // Create an object to store scores for each group, gender, and lunch type
  var scores = {};

  // Process the data to calculate scores for each group, gender, and lunch type
  data.forEach(function (row) {
    var group = row["group"];
    var gender = row["gender"];
    var lunch = row["lunch"];

    // Get individual scores
    var math = parseFloat(row["math score"]);
    var reading = parseFloat(row["reading score"]);
    var writing = parseFloat(row["writing score"]);

    // Calculate average of the three scores
    var score = (math + reading + writing) / 3;

    if (!scores[group]) {
      scores[group] = {};
    }

    if (!scores[group][lunch]) {
      scores[group][lunch] = {
        female: { sum: 0, count: 0 },
        male: { sum: 0, count: 0 },
      };
    }

    // Accumulate scores for each gender and count
    scores[group][lunch][gender].sum += score;
    scores[group][lunch][gender].count++;
  });

  // Calculate average scores for each group, gender, and lunch type
  Object.keys(scores).forEach(function (group) {
    Object.keys(scores[group]).forEach(function (lunch) {
      Object.keys(scores[group][lunch]).forEach(function (gender) {
        var sum = scores[group][lunch][gender].sum;
        var count = scores[group][lunch][gender].count;
        scores[group][lunch][gender].average = sum / count;
      });
    });
  });

  // Prepare the processed data for Grid.js
  var processedData1 = [];
  var processedData2 = [];
  -processedData1.push([
    "Standard",
    (
      scores["group A"]["standard"]["female"].average +
      scores["group B"]["standard"]["female"].average +
      scores["group C"]["standard"]["female"].average +
      scores["group D"]["standard"]["female"].average +
      scores["group E"]["standard"]["female"].average
    ).toFixed(2),
    (
      scores["group A"]["standard"]["male"].average +
      scores["group B"]["standard"]["male"].average +
      scores["group C"]["standard"]["male"].average +
      scores["group D"]["standard"]["male"].average +
      scores["group E"]["standard"]["male"].average
    ).toFixed(2),
  ]);
  //------------------------------
  processedData1.push([
    "group A",
    scores["group A"]["standard"]["female"].average.toFixed(2),
    scores["group A"]["standard"]["male"].average.toFixed(2),
  ]);
  //------------------------------
  processedData1.push([
    "group B",
    scores["group B"]["standard"]["female"].average.toFixed(2),
    scores["group B"]["standard"]["male"].average.toFixed(2),
  ]);
  //------------------------------
  processedData1.push([
    "group C",
    scores["group C"]["standard"]["female"].average.toFixed(2),
    scores["group C"]["standard"]["male"].average.toFixed(2),
  ]);
  //------------------------------
  processedData1.push([
    "group D",
    scores["group D"]["standard"]["female"].average.toFixed(2),
    scores["group D"]["standard"]["male"].average.toFixed(2),
  ]);
  //------------------------------
  processedData1.push([
    "group E",
    scores["group E"]["standard"]["female"].average.toFixed(2),
    scores["group E"]["standard"]["male"].average.toFixed(2),
  ]);
  //------------------------------
  processedData2.push([
    "Free/Reduced",
    (
      scores["group A"]["free/reduced"]["female"].average +
      scores["group B"]["free/reduced"]["female"].average +
      scores["group C"]["free/reduced"]["female"].average +
      scores["group D"]["free/reduced"]["female"].average +
      scores["group E"]["free/reduced"]["female"].average
    ).toFixed(2),
    (
      scores["group A"]["free/reduced"]["male"].average +
      scores["group B"]["free/reduced"]["male"].average +
      scores["group C"]["free/reduced"]["male"].average +
      scores["group D"]["free/reduced"]["male"].average +
      scores["group E"]["free/reduced"]["male"].average
    ).toFixed(2),
  ]);
  //---------------------------------
  processedData2.push([
    "group A",
    scores["group A"]["free/reduced"]["female"].average.toFixed(2),
    scores["group A"]["free/reduced"]["male"].average.toFixed(2),
  ]);
  //---------------------------------
  processedData2.push([
    "group B",
    scores["group B"]["free/reduced"]["female"].average.toFixed(2),
    scores["group B"]["free/reduced"]["male"].average.toFixed(2),
  ]);
  //---------------------------------
  processedData2.push([
    "group C",
    scores["group C"]["free/reduced"]["female"].average.toFixed(2),
    scores["group C"]["free/reduced"]["male"].average.toFixed(2),
  ]);
  //---------------------------------
  processedData2.push([
    "group D",
    scores["group D"]["free/reduced"]["female"].average.toFixed(2),
    scores["group D"]["free/reduced"]["male"].average.toFixed(2),
  ]);
  //---------------------------------
  processedData2.push([
    "group E",
    scores["group E"]["free/reduced"]["female"].average.toFixed(2),
    scores["group E"]["free/reduced"]["male"].average.toFixed(2),
  ]);

  // Render the Grid.js table
  $(document).ready(function () {
    // Processed Data 1
    $("#panel2_table-container1").DataTable({
      data: processedData1,
      columns: [{ title: "Group" }, { title: "Female" }, { title: "Male" }],
      paging: false,
      ordering: true,
      searching: false,
      info: false,
    });

    // Processed Data 2
    $("#panel2_table-container2").DataTable({
      data: processedData2,
      columns: [{ title: "Group" }, { title: "Female" }, { title: "Male" }],
      paging: false,
      ordering: true,
      searching: false,
      info: false,
    });
  });
});

d3.csv(csvFilePath).then(function (data) {
  // Count the number of rows in the dataset
  var rowCount = data.length;
  d3.select("#text").text("Total students: " + rowCount);
});
