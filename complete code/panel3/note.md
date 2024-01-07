# Problems Summary
1. function to identify unique values: https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
function onlyUnique(value, index, array) {
  return array.indexOf(value) == index;
}

2. different API for fetching data v4 vs v5: https://stackoverflow.com/questions/52638816/d3-importing-csv-file-to-array

3. function to calculate number of occurence -> not quite good
let genderData = [];
df.forEach(function(d) {
  const gender = d.gender;
  genderData.push(gender);
})
let n_male = 0;
let n_female = 0;
genderData.forEach(genderCount);
function genderCount(item) {
  if (item =="male") {
    return n_male++;
  } else {
    return n_female++;
  }
}
const total = n_male + n_female;

4. Create stack barchart using stack layout (can only apply for v3): https://www.youtube.com/watch?v=iEV8ZdTd2rg

5. Problems: since we use d3 v5 the API for fetching data has changed so the v4 version will not work:
d3.csv(
  "data.csv",
  rowConverter,
  function (error, data) {
    if (error) {
      console.log(error);
    } else {
      dataset = data;
      console.log(data);
      initChart();
    }
  },
);
Detail on this problem: https://stackoverflow.com/questions/52638816/d3-importing-csv-file-to-array

6. Example to create count function:
function countTPCbyGender(data) {
  const result = {};
  data.forEach((d) => {
    const genders = d.gender;
    const tpc = d.tpc;
    // For each gender element in the dataset, if it doesn't already exist then crete a new object with two properties n_tpc and groups:
    result[genders] = result[genders] || { n_tpc: 0, groups: {} };
    // For each tpc element coresponding with gender element in the dataset, if it hasn't existed, then create a new object with n_tpc property:
    result[genders].groups[tpc] = result[genders].groups[tpc] || { n_tpc: 0 };
    // For each gender elements in the dataset, if it hasn't existed then n_tpc increase by 1:
    result[genders].n_tpc++;
    // For each tpc element coresponding with gender element in the dataset, if it hasn't existed then n_tpc increase by 1:
    result[genders].groups[tpc].n_tpc++;
  });
  return result;
}

7. Another approach only downside is unsuable data in this case
const groupData = Object.entries(TPCbyGroup).map(([tpc, value]) => {
  const values = Object.entries(value).map(([key, groupValue]) => { // not a very good solution since in group parameter both total and group are contained here so when use with Object.entries() only the "object" part get return other get by passed;
    const groups = Object.entries(groupValue).map(([groupName, n_count]) => {
      const countArray = Object.values(n_count);
      return [[groupName, countArray[0]]];
    });
    const groupArray = groups.flat();
    return groupArray;
  });
  const counts = values.flat();
  let result = Object.assign({ tpc: tpc }, Object.fromEntries(counts));
  return result;
});

8. Vertical version of group chart
const x0Bar = d3
    .scaleBand()
    .rangeRound([0, w])
    .domain(d3.map(groupData, (d) => d.group).keys())
    .padding(0.2);
bar
    .append("g")
    .attr("transform", "translate(0," + h + ")")
    .call(d3.axisBottom(x0Bar));
const yBar = d3
    .scaleLinear()
    .domain([0, 200])
    .range([h, 0]);
bar
    .append("g")
    .call(d3.axisLeft(yBar));
const x1Bar = d3
    .scaleBand()
    .domain(innerGroup)
    .range([0, x0Bar.bandwidth()])
    .padding([0.05]);
bar.selectAll(".barchart")
    .data(groupData)
    .enter().append("g")
    .attr("transform", (d) => "translate(" + x0Bar(d.group) + ",0)")
    .selectAll("rect")
    .data(function(d) { return innerGroup.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
    .attr("x", (d) => x1Bar(d.key))
    .attr("y", (d) => yBar(d.value))
    .attr("width", x1Bar.bandwidth())
    .attr("height", (d) => h - yBar(d.value))
    .attr("fill", (d) => colorBar(d.key))

9. Obtain certain columns from a dataset
function createTableData(data) {
   const result = [];
   data.forEach(d => {
     const avg = d.avg;
     const gender = d.gender;
     const tpc = d.tpc;
     result.push({avg: avg, gender: gender, tpc: tpc})
   })
   return result;
}
