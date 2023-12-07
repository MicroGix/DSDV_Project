function rowConverter(d) {
  return {
    // name: d.name,
    gender: d.gender,
    // pdegrees: d["parent degrees"],
    // lunch: d.lunch,
    TPC: d["test prep"],
    // math: parseFloat(d["math score"]),
    // reading: parseFloat(d["reading score"]),
    // writing: parseFloat(d["writing score"]),
    // avg: parseFloat(d.avg),
    // result: d.result,
    // grade: d.grade,
    group: d.group,
  };
}

const df_url =
  "https://raw.githubusercontent.com/MicroGix/Influence-of-factors-on-students-performence/main/main_data.csv";
d3.csv(df_url, rowConverter).then(
  function (data) {
    df = data;
    console.log(df);
    initPanel_3();
  },
);

function initPanel_3() {
  const outer_w = 500;
  const outer_h = 300;
  const margin = { top: 20, right: 10, bottom: 50, left: 50 };
  const h = outer_h - margin.top - margin.bottom;
  const w = outer_w - margin.right - margin.left;
  const p = 20;
  //------------------------stack-plot--------------------
  const stack = d3
    .select("#stack-plot")
    .append("svg")
    .attr("width", outer_w)
    .attr("height", outer_h)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  // groups data bases on tcp status
  const tcpGroup = d3.map(df, function (d) {
    return (d.TCP);
  }).keys();

  // x scale
  const x_stack = d3
    .scaleBand()
    .domain(tcpGroup)
    .range([0, w - p])
    .padding([0.2]);
  stack
    .append("g")
    .attr("transform", "translate(0," + h + ")")
    .call(d3.axisBottom(x_stack).tickSizeOuter(0));

  // generate a whole new dataset for gender
  const genderCounts = {};
  df.forEach(function (d) {
    const gender = d.gender;
    if (genderCounts[gender]) {
      genderCounts[gender]++;
    } else {
      genderCounts[gender] = 1;
    }
  });

  const genderData = [];
  for (const gender in genderCounts) {
    genderData.push({ gender: gender, count: genderCounts[gender] });
  }
  console.log(genderData);

  const stackData = [];
  df.forEach(function(obj) {
    let values = Object.values(obj)
    return stackData.push(values);
  })
  console.log(stackData);
  const y_stack = d3
    .scaleLinear()
    .domain([0, 1000])
    .range([h, 0]);
  stack
    .append("g")
    .call(d3.axisLeft(y_stack));

  const genderGroup = d3.map(genderData, (d) => d.gender).keys();
  const color = d3
    .scaleOrdinal()
    .domain(genderGroup)
    .range(["red", "blue"]);

  //---------------------barplot1-------------------------
  const bar = d3
    .select("#barplot")
    .append("svg")
    .attr("width", outer_w)
    .attr("height", outer_h)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  const x_bar = d3
    .scaleLinear()
    .range([0, w - p])
    .domain([0]);
  bar
    .append("g")
    .attr("transform", "translate(0," + h + ")")
    .call(d3.axisBottom(x_stack));

  const y_bar = d3
    .scaleBand()
    .range([h, 0])
    .domain(d3.map(df, (d) => d.group).keys())
    .padding(0.2);
}

//-----------Summay of what i found-------------------------------------------------
// 1. function to identify unique values: https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
// function onlyUnique(value, index, array) {
//   return array.indexOf(value) == index;
// }
// 2. different API for fetching data v4 vs v5: https://stackoverflow.com/questions/52638816/d3-importing-csv-file-to-array
// 3. function to calculate number of occurence -> not quite good
// let genderData = [];
// df.forEach(function(d) {
//   const gender = d.gender;
//   genderData.push(gender);
// })
// let n_male = 0;
// let n_female = 0;
// genderData.forEach(genderCount);
// function genderCount(item) {
//   if (item =="male") {
//     return n_male++;
//   } else {
//     return n_female++;
//   }
// }
// const total = n_male + n_female;
// 4. Create stack barchart using stack layout (can only apply for v3): https://www.youtube.com/watch?v=iEV8ZdTd2rg
// 5. Problems: since we use d3 v5 the API for fetching data has changed so the v4 version will not work:
// d3.csv(
//   "data.csv",
//   rowConverter,
//   function (error, data) {
//     if (error) {
//       console.log(error);
//     } else {
//       dataset = data;
//       console.log(data);
//       initChart();
//     }
//   },
// );
// Detail on this problem: https://stackoverflow.com/questions/52638816/d3-importing-csv-file-to-array
