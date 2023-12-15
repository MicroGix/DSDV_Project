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

  // CREATE FUNCTION TO COUNT NUMBERS OF TPC BY GENDER (SOLVE)
  // See explaination at problem 6.

  function countGenderbyTPC(data) {
    const result = {};
    data.forEach((d) => {
      const tpc = d.tpc;
      const genders = d.gender;
      result[tpc] = result[tpc] || { total: 0, gender: {} };
      result[tpc].gender[genders] = result[tpc].gender[genders] || { n: 0 };
      result[tpc].total++;
      result[tpc].gender[genders].n++;
    });
    return result;
  }

  // CREATE DATASET FOR STACK CHARTS
  const TPCbyGender = countGenderbyTPC(data);
  const genderData = Object.entries(TPCbyGender).map(([tpc, value]) => {
    const gender = Object.values(value.gender);
    const female = Object.values(gender[0]);
    const male = Object.values(gender[1]);
    return { "tpc": tpc, "female": female[0], "male": male[0] };
  });
  console.log(genderData);

  // SET UP SCALE
  const tpcLabelStack = genderData.map((d) => d.tpc);
  const subgroups = genderData.map(({ female, male }) => {
    return { female: female, male: male };
  });
  const after_stackData = d3.stack().keys(["female", "male"])(genderData);

  const xStack = d3
    .scaleBand()
    .domain(tpcLabelStack)
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
      return xStack(d.data.tpc); // data here mean the .data(after_stackData) you add above
    })
    .attr("y", function (d) {
      return yStack(d[1]);
    })
    .attr("height", function (d) {
      return yStack(d[0]) - yStack(d[1]);
    })
    .attr("width", xStack.bandwidth());

  //---------------------barplot1-------------------------
  // SETUP DATASET FOR BARCHART (SOLVE)
  function countTPCbyGroup(data) { // a great approach but very hard to inegrate when need to access certain data
    const result = {};
    data.forEach((d) => {
      const tpc = d.tpc;
      const groups = d.group;
      result[groups] = result[groups] || { tpc: {} };
      result[groups].tpc[tpc] = result[groups].tpc[tpc] || { n: 0 };
      result[groups].tpc[tpc].n++;
    });
    return result;
  }

  const TPCbyGroup = countTPCbyGroup(data);

  const groupData = Object.entries(TPCbyGroup).map(([group, value]) => {
    const counts = Object.entries(value).map(([key, innerObj]) => { // dont understand why here we must use Object.entries instead of Object.values
      const tpcObj = Object.entries(innerObj).map(([tpc, nObj]) => {
        const nArray = Object.values(nObj);
        return [[tpc, nArray[0]]];
      });
      const countArray = tpcObj.flat();
      return countArray;
    });
    const countTPC = counts.flat();
    let result = Object.assign(
      { group: group },
      Object.fromEntries(countTPC),
    );
    return result;
  });

  console.log(groupData);

  // SETUP
  const bar = d3
    .select("#barplot")
    .append("svg")
    .attr("width", outer_w)
    .attr("height", outer_h)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

  const xBar = d3
    .scaleLinear()
    .domain([0, 1000])
    .range([0, w - p]);
  bar
    .append("g")
    .attr("transform", "translate(0," + h + ")")
    .call(d3.axisBottom(xBar));

  const yBar = d3
    .scaleBand()
    .domain(groupData.map((d) => d.group))
    .range([h, 0])
    .padding(0.2);
  bar
    .append("g")
    .call(d3.axisLeft(yBar));

  bar 
    .selectAll("rect")
    .data(groupData)
    .enter()
    .append("rect")
    .attr("x", xBar(5))
    .attr("y", function (d) {
      return yBar(d.group);
    })
    .attr("width", function (d) {
      return xBar(d.none);
    })
    .attr("height", yBar.bandwidth())
    .attr("fill", "lightgreen");
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
// 7. Another approach only downside is unsuable data in this case
// const groupData = Object.entries(TPCbyGroup).map(([tpc, value]) => {
//   const values = Object.entries(value).map(([key, groupValue]) => { // not a very good solution since in group parameter both total and group are contained here so when use with Object.entries() only the "object" part get return other get by passed;
//     const groups = Object.entries(groupValue).map(([groupName, n_count]) => {
//       const countArray = Object.values(n_count);
//       return [[groupName, countArray[0]]];
//     });
//     const groupArray = groups.flat();
//     return groupArray;
//   });
//   const counts = values.flat();
//   let result = Object.assign({ tpc: tpc }, Object.fromEntries(counts));
//   return result;
// });
