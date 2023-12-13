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

const df_url =
  "https://raw.githubusercontent.com/MicroGix/Influence-of-factors-on-students-performence/main/main_data.csv";
d3.csv(df_url, rowConverter).then(
  function (data) {
    console.log(data);
    initPanel_3(data);
  },
);

function initPanel_3(data) {
  // SVG DIMENSION (SOLVE)
  const outer_w = 500;
  const outer_h = 300;
  const margin = { top: 20, right: 10, bottom: 50, left: 50 };
  const h = outer_h - margin.top - margin.bottom;
  const w = outer_w - margin.right - margin.left;
  const p = 20;

  // SVG CONTAINER (SOLVE)
  const stack = d3
    .select("#stack-plot")
    .append("svg")
    .attr("width", outer_w)
    .attr("height", outer_h)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  // CREATE FUNCTION TO COUNT NUMBERS OF TPC BY GROUP AND GENDER (NOTYET!!!)
  // See explaination at problem 6.
 
  function countGenderbyTPC(data) {
    const result = {};
    data.forEach((d) => {
      const tpc = d.tpc;
      const genders = d.gender;
      result[tpc] = result[tpc] || {total: 0, gender: {}};
      result[tpc].gender[genders] = result[tpc].gender[genders] || {n: 0};
      result[tpc].total++;
      result[tpc].gender[genders].n++;
    });
    return result;
  }

  function countGroupbyTPC(data) {
    const result = {};
    data.forEach((d) => {
      const tpc = d.tpc;
      const groups = d.group;
      result[tpc] = result[tpc] || {total: 0, group: {}};
      result[tpc].group[groups] = result[tpc].group[groups] || { n: 0 };
      result[tpc].total++;
      result[tpc].group[groups].n++;
    });
    return result;
  }

  // INIT DATASET FOR CHARTS
  const TPCbyGender = countGenderbyTPC(data); // use for stack bar chart
  const TPCbyGroup = countGroupbyTPC(data); // use for horizontal bar chart
  console.log(TPCbyGender);
  console.log(TPCbyGroup);

  const genderStack= Object.entries(TPCbyGender).map(([tpc, value]) => {
    const gender = Object.values(value.gender);
    const female = Object.values(gender[0]);
    const male = Object.values(gender[1]);
    return {tpc: tpc, female: female[0], male: male[0]};
  });
  console.log(genderStack);

  const groupStack= Object.entries(TPCbyGroup).map(([tpc, value]) => {
    const group = Object.values(value.group);
    return {tpc: tpc};
  });
  console.log(groupStack);

  //----------------------------stack-chart---------------------------------------
  // SET UP SCALE
  // Question: from the object create above how can i get the values that are needed for setting up scale of the chart (X and Y)?
  // Question: what type of data do these scale accept?
  // Question: how can i access value of an object within an object?
  
  // x scale
  const tpcStack = d3.map(data, (d) => d.tpc).keys();
  const xStack = d3
    .scaleBand()
    .domain(tpcStack)
    .range([0, w - p])
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

  const genderKeys = d3.map(data, (d) => d.gender).keys();
  const color = d3
    .scaleOrdinal()
    .domain(genderKeys)
    .range(["red", "blue"]);

  const subgroups = 

  //
  //---------------------barplot1-------------------------
  // const bar = d3
  //   .select("#barplot")
  //   .append("svg")
  //   .attr("width", outer_w)
  //   .attr("height", outer_h)
  //   .append("g")
  //   .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
  //
  // const x_bar = d3
  //   .scaleLinear()
  //   .range([0, w - p])
  //   .domain([0]);
  // bar
  //   .append("g")
  //   .attr("transform", "translate(0," + h + ")")
  //   .call(d3.axisBottom(x_stack));
  //
  // const y_bar = d3
  //   .scaleBand()
  //   .range([h, 0])
  //   .domain(d3.map(df, (d) => d.group).keys())
  //   .padding(0.2);
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
// 6. Example to create count function:
// function countTPCbyGender(data) {
//   const result = {};
//   data.forEach((d) => {
//     const genders = d.gender;
//     const tpc = d.tpc;
//     // For each gender element in the dataset, if it doesn't already exist then crete a new object with two properties n_tpc and groups:
//     result[genders] = result[genders] || { n_tpc: 0, groups: {} };
//     // For each tpc element coresponding with gender element in the dataset, if it hasn't existed, then create a new object with n_tpc property:
//     result[genders].groups[tpc] = result[genders].groups[tpc] || { n_tpc: 0 };
//     // For each gender elements in the dataset, if it hasn't existed then n_tpc increase by 1:
//     result[genders].n_tpc++;
//     // For each tpc element coresponding with gender element in the dataset, if it hasn't existed then n_tpc increase by 1:
//     result[genders].groups[tpc].n_tpc++;
//   });
//   return result;
// }
