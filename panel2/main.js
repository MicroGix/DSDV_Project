var csvFilePath = "./main_data.csv";
// Read data from the CSV file
d3.csv(csvFilePath).then(function (data) {
  

  new gridjs.Grid({
    columns: ['Group', 'Lunch', 'Gender'],
    data: data, // Use the processed data with counts
    pagination: {
      limit: 10,
      summary: false
    },
    sort: true,
    search: true
  }).render(document.getElementById("table-container"));
});

//------------------------------------------------------
//    GROUP A

  //----------------------------------------------------------
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
  
  d3.csv(csvFilePath, rowConverter).then(
    function (data) {
      initPanel_2_A(data);
    },
  );
  
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
      .select("#on2")
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
  return { "lunch": lunch, "female": female[0], "male": male[0] };
});
console.log(genderData);
  
    // SET UP SCALE
    const lunchLabelStack = genderData.map((d) => d.lunch);
    const subgroups = genderData.map(({ female, male }) => {
      return { female: female, male: male };
    });
    const after_stackData = d3.stack().keys(["female", "male"])(genderData);
  
    const xStack = d3
      .scaleBand()
      .domain(lunchLabelStack)
      .range([0, w])
      .padding([0.2]);
    stack
      .append("g")
      .attr("transform", "translate(0," + h + ")")
      .call(d3.axisBottom(xStack).tickSizeOuter(0));
  
    const yStack = d3
      .scaleLinear()
      .domain([0, 150])
      .range([h, 0]);
    stack
      .append("g")
      .call(d3.axisLeft(yStack));
  
    const color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range(["#FFC947", "#4C6EF5"]);
  
    // INITIATE STACK CHART (SOLVE)
    // New problems: how can i make it more beautiful
    stack.append("g")
      .selectAll("g")
      .data(after_stackData)
      .enter().append("g")
      .attr("fill", (d) => color(d.key))
      .selectAll("rect")
      .data((d) => d)
      .enter().append("rect")
      .attr("x", function (d) {
        return xStack(d.data.lunch); // data here mean the .data(after_stackData) you add above
      })
      .attr("y", function (d) {
        return yStack(d[1]);
      })
      .attr("height", function (d) {
        return yStack(d[0]) - yStack(d[1]);
      })
      .attr("width", xStack.bandwidth());
    }  







// -------------------------------------------------------

d3.csv(csvFilePath).then(function(data) {
      // data processing and visualization
    
    // Filter data based on gender and Lunch
const maleStandard = data.filter(d => d.gender == "male" && d.Lunch == "standard");
const femaleStandard = data.filter(d => d.gender == "female" && d.Lunch == "standard");
const maleFreeReduced = data.filter(d => d.gender == "male" && d.Lunch == "free/reduced"); 
const femaleFreeReduced = data.filter(d => d.gender == "female" && d.Lunch == "free/reduced");

// Count students in each category
const maleStandardCount = {
  groupA: maleStandard.filter(d => d.group == "groupA").length,
  groupB: maleStandard.filter(d => d.group == "groupB").length,
  groupC: maleStandard.filter(d => d.group == "groupC").length,
  groupD: maleStandard.filter(d => d.group == "groupD").length,
  groupE: maleStandard.filter(d => d.group == "groupE").length
};

// Do similar counting for other categories
  
})

// Data for the bar chart
const data = [
  { label: "Free/reduced - Female ", value: 182.48 },
  { label: "Free/reduced - Male", value: 179.75 },
  // and so on
];

// Set up dimensions and margins
const width = 400;
const height = 200;
const margin = { top: 20, right: 20, bottom: 30, left: 50 };

// Create the SVG element
const svg = d3.select("#on2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Create the scales
const xScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.value)])
  .range([0, width]);

const yScale = d3.scaleBand()
  .domain(data.map(d => d.label))
  .range([0, height])
  .padding(0.1);

// Create the bars
svg.selectAll(".bar")
  .data(data)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", 0)
  .attr("y", d => yScale(d.label))
  .attr("width", d => xScale(d.value))
  .attr("height", yScale.bandwidth())
  .attr("fill", "steelblue");

// Add labels to the bars
svg.selectAll("text")
  .data(data)
  .enter()
  .append("text")
  .text(d => d.value)
  .attr("x", d => xScale(d.value) + 5)
  .attr("y", d => yScale(d.label) + yScale.bandwidth() / 2)
  .attr("text-anchor", "start")
  .attr("alignment-baseline", "middle")
  .attr("fill", "white");

// Add y-axis
svg.append("g")
  .call(d3.axisLeft(yScale));

// Add x-axis
svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(xScale))





  //----------------------------------------------------------
  function rowConverter(d) {
    return {
      name: d.name,
      gender: d.gender,
      pdegrees: d["parent degrees"],
      lunch: d.lunch,
      lunch: d["test prep"],
      math: parseFloat(d["math score"]),
      reading: parseFloat(d["reading score"]),
      writing: parseFloat(d["writing score"]),
      avg: parseFloat(d.avg),
      result: d.result,
      grade: d.grade,
      group: d.group,
    };
  }
  
  const df_url =
    "https://raw.githubusercontent.com/MicroGix/Influence-of-factors-on-students-performence/main/main_data.csv";
  d3.csv(df_url, rowConverter).then(
    function (data) {
      initPanel_4(data);
    },
  );
  
  function initPanel_4(data) {
    // SVG DIMENSION (SOLVE)
    const outer_w = 500;
    const outer_h = 300;
    const margin = { top: 20, right: 10, bottom: 50, left: 50 };
    const h = outer_h - margin.top - margin.bottom;
    const w = outer_w - margin.right - margin.left;
    const p = 20;
  
    // SVG CONTAINER (SOLVE)
    const stack = d3
      .select("#on4")
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
        const genders = d.gender;
        result[lunch] = result[lunch] || { total: 0, gender: {} };
        result[lunch].gender[genders] = result[lunch].gender[genders] || { n: 0 };
        result[lunch].total++;
        result[lunch].gender[genders].n++;
      });
      return result;
    }
  
    // CREATE DATASET FOR STACK CHARTS
    const lunchbyGender = countGenderbylunch(data);
    const genderData = Object.entries(lunchbyGender).map(([lunch, value]) => {
      const gender = Object.values(value.gender);
      const female = Object.values(gender[0]);
      const male = Object.values(gender[1]);
      return { "lunch": lunch, "female": female[0], "male": male[0] };
    });
    console.log(genderData);
  
    // SET UP SCALE
    const lunchLabelStack = genderData.map((d) => d.lunch);
    const subgroups = genderData.map(({ female, male }) => {
      return { female: female, male: male };
    });
    const after_stackData = d3.stack().keys(["female", "male"])(genderData);
  
    const xStack = d3
      .scaleBand()
      .domain(lunchLabelStack)
      .range([0, w])
      .padding([0.2]);
    stack
      .append("g")
      .attr("transform", "translate(0," + h + ")")
      .call(d3.axisBottom(xStack).tickSizeOuter(0));
  
    const yStack = d3
      .scaleLinear()
      .domain([0, 1000])
      .range([h, 0]);
    stack
      .append("g")
      .call(d3.axisLeft(yStack));
  
    const color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range(["red", "blue"]);
  
    // INITIATE STACK CHART (SOLVE)
    // New problems: how can i make it more beautiful
    stack.append("g")
      .selectAll("g")
      .data(after_stackData)
      .enter().append("g")
      .attr("fill", (d) => color(d.key))
      .selectAll("rect")
      .data((d) => d)
      .enter().append("rect")
      .attr("x", function (d) {
        return xStack(d.data.lunch); // data here mean the .data(after_stackData) you add above
      })
      .attr("y", function (d) {
        return yStack(d[1]);
      })
      .attr("height", function (d) {
        return yStack(d[0]) - yStack(d[1]);
      })
      .attr("width", xStack.bandwidth());
    }  