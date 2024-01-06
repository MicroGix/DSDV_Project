function rowConverter(d) {
    return {
        avg: parseFloat(d.avg),
        gender: d.gender,
        grade: d.grade,
        groups: d["group"],
        lunch: d.lunch,
        math: parseFloat(d["math score"]),
        name: d.name,
        parentD: d["parent degrees"],
        reading: parseFloat(d["reading score"]),
        result: d.result,
        tpc: d["test prep"],
        writing: parseFloat(d["writing score"]),
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
    // SVG DIMENSION
    const outer_w = 600;
    const outer_h = 300;
    const margin = {top: 20, right: 10, bottom: 50, left: 70};
    const h = outer_h - margin.top - margin.bottom;
    const w = outer_w - margin.right - margin.left;
    const p = 20;

    //--STACK BAR CHART--
    // set up svg container
    const stack = d3
        .select("#stack-plot")
        .append("svg")
        .attr("width", outer_w)
        .attr("height", outer_h)
        .attr("class", "diagram")
        .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    // create function to count numbers of tpc by gender
    // See explanation at problem 6.
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

    // create dataset
    const TPCbyGender = countGenderbyTPC(data);
    const genderData = Object.entries(TPCbyGender).map(([tpc, value]) => {
        const gender = Object.values(value.gender);
        const female = Object.values(gender[0]);
        const male = Object.values(gender[1]);
        return {"tpc": tpc, "female": female[0], "male": male[0]};
    });

    // set up scale
    const tpcLabelStack = genderData.map((d) => d.tpc);
    const subgroups = genderData.map(({female, male}) => {
        return {female: female, male: male};
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
        .call(d3.axisBottom(xStack).tickSizeOuter(0))
        .attr("class", "chart-axis");

    const yStack = d3
        .scaleLinear()
        .domain([0, 1000])
        .range([h, 0]);
    stack
        .append("g")
        .call(d3.axisLeft(yStack))
        .attr("class", "chart-axis");

    const colorStack = d3
        .scaleOrdinal()
        .domain(subgroups)
        .range(['#e41a1c', '#377eb8'])

    // append rect element to chart
    stack
        .append("g")
        .selectAll("g")
        .data(after_stackData)
        .enter().append("g")
        .attr("fill", (d) => colorStack(d.key))
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

    //--HORIZONTAL GROUP BAR CHART--
    // init svg container
    const bar = d3
        .select("#bar-plot")
        .append("svg")
        .attr("width", outer_w)
        .attr("height", outer_h)
        .attr("class", "diagram")
        .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    // create data set
    function countTPCbyGroup(data) {
        const result = {};
        data.forEach((d) => {
            const tpc = d.tpc;
            const groups = d.groups;
            result[groups] = result[groups] || {tpc: {}};
            result[groups].tpc[tpc] = result[groups].tpc[tpc] || {n: 0};
            result[groups].tpc[tpc].n++;
        });
        return result;
    }

    const TPCbyGroup = countTPCbyGroup(data);
    const groupData = Object.entries(TPCbyGroup).map(([group, groupObj]) => {
        const counts = Object.entries(groupObj).map(([tpc, tpcObj]) => { // don't understand why here we must use Object.entries instead of Object.values
            const tpcCounts = Object.entries(tpcObj).map(([tpc, nObj]) => {
                const nArray = Object.values(nObj);
                return [[tpc, nArray[0]]];
            });
            const countArray = tpcCounts.flat();
            return countArray;
        });
        const countTPC = counts.flat();
        let result = Object.assign(
            {groups: group},
            Object.fromEntries(countTPC),
        );
        return result;
    });

    //set up scale
    const y0Bar = d3
        .scaleBand()
        .rangeRound([h, 0])
        .domain(d3.map(groupData, (d) => d.groups).keys())
        .paddingInner(0.2)
    bar
        .append("g")
        .call(d3.axisLeft(y0Bar))
        .attr("class", "chart-axis");

    const xBar = d3
        .scaleLinear()
        .domain([0, 250])
        .range([0, w])
    bar
        .append("g")
        .attr("transform", "translate(0," + h + ")")
        .call(d3.axisBottom(xBar))
        .attr("class", "chart-axis");

    const innerGroup = d3.keys(groupData[0]).filter((key) => key !== "groups")

    const y1Bar = d3
        .scaleBand()
        .domain(innerGroup)
        .range([y0Bar.bandwidth(), 0])
        .padding([0.05]);

    const colorBar = d3
        .scaleOrdinal()
        .domain(innerGroup)
        .range(['#e41a1c', '#377eb8'])

    bar.selectAll(".barchart")
        .data(groupData)
        .enter().append("g")
        .attr("transform", (d) => "translate(0, " + y0Bar(d.groups) + ")")
        .selectAll("rect")
        .data(function (d) {
            return innerGroup.map(function (key) {
                return {key: key, value: d[key]};
            });
        })
        .enter().append("rect")
        .attr("x", xBar(0.5))
        .attr("y", (d) => y1Bar(d.key))
        .attr("height", y1Bar.bandwidth())
        .attr("width", (d) => xBar(d.value) - xBar(0))
        .attr("fill", (d) => colorBar(d.key))

    //--TABLE OF AVERAGE OF TOTAL MARKS--
    //create dataset
    function average(data) {
        let sum = 0
        data.forEach(e => {
            sum += e.math + e.writing + e.reading;
        })
        let avg = sum / data.length;
        return avg.toFixed(2)
    }

    // female: none, completed
    const fnAvg = average(data.filter((d) => d.tpc === "none" && d.gender === "female"))
    const fcAvg = average(data.filter((d) => d.tpc === "completed" && d.gender === "female"))
    const fmAvg = average(data.filter((d) => d.gender === "female"))
    // male: none, completed
    const mnAvg = average(data.filter((d) => d.tpc === "none" && d.gender === "male"))
    const mcAvg = average(data.filter((d) => d.tpc === "completed" && d.gender === "male"))
    const mmAvg = average(data.filter((d) => d.gender === "male"))

    const total = average(data)

    const tableData = [
        {TPC: "none", Female: fnAvg, Male: mnAvg},
        {TPC: "completed", Female: fcAvg, Male: mcAvg},
    ]
    console.log(tableData)

    function createTable(data, columns) {
        const table = d3.select('#avgTable').append('table');
        const thead = table.append('thead')
        const tbody = table.append('tbody');

        // append the header row
        thead.append('tr')
            .selectAll('th')
            .data(columns).enter()
            .append('th')
            .text(function (column) {
                return column;
            })
            .style("text-align", "left");

        // create a row for each object in the data
        const rows = tbody.selectAll('tr')
            .data(data)
            .enter()
            .append('tr');

        // create a cell in each row for each column
        rows.selectAll('td')
            .data(function (row) {
                return columns.map(function (column) {
                    return {column: column, value: row[column]};
                });
            })
            .enter()
            .append('td')
            .text(function (d) {
                return d.value;
            })
            .style("text-align", "left");

        return table.node();
    }

    createTable(tableData, ['TPC', 'Female', 'Male'])
}

