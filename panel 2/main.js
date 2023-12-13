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

d3.csv(csvFilePath).then(function(data) {
      // data processing and visualization
    
    // Filter data based on gender and lunch
const maleStandard = data.filter(d => d.gender == "male" && d.lunch == "standard");
const femaleStandard = data.filter(d => d.gender == "female" && d.lunch == "standard");
const maleFreeReduced = data.filter(d => d.gender == "male" && d.lunch == "free/reduced"); 
const femaleFreeReduced = data.filter(d => d.gender == "female" && d.lunch == "free/reduced");

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