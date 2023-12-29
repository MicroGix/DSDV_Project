function calculateSumByGenderAndGroup(data) {
  const result = {};
  // assign groups to data
  data.forEach((entry) => {
    const genderKey = entry.gender;
    const groupKey = entry.group;

    result[genderKey] = result[genderKey] || {
      math: 0,
      reading: 0,
      writing: 0,
      groups: {},
    };
    result[genderKey].groups[groupKey] = result[genderKey].groups[groupKey] || {
      math: 0,
      reading: 0,
      writing: 0,
    };

    result[genderKey].math += parseInt(entry["math score"], 10);
    result[genderKey].reading += parseInt(entry["reading score"], 10);
    result[genderKey].writing += parseInt(entry["writing score"], 10);

    result[genderKey].groups[groupKey].math += parseInt(
      entry["math score"],
      10
    );
    result[genderKey].groups[groupKey].reading += parseInt(
      entry["reading score"],
      10
    );
    result[genderKey].groups[groupKey].writing += parseInt(
      entry["writing score"],
      10
    );
  });

  return result;
}

function createRow(label, values, isBold) {
  const row = document.createElement("tr");
  row.classList.add("hovered-row"); // Add hover effect and background color styles
  row.addEventListener("mouseover", function () {
    this.classList.add("hovered-row");
  });
  // add hover effect and background color styles
  row.addEventListener("mouseout", function () {
    this.classList.remove("hovered-row");
  });
  // add label and values to row
  row.innerHTML = `
        <td ${isBold ? 'style="font-weight: bold;"' : ""}>${label}</td>
        <td ${isBold ? 'style="font-weight: bold;"' : ""}>${values.math}</td>
        <td ${isBold ? 'style="font-weight: bold;"' : ""}>${values.reading}</td>
        <td ${isBold ? 'style="font-weight: bold;"' : ""}>${values.writing}</td>
    `;

  return row;
}
function createRow2(label, values, isBold) {
  const row = document.createElement("tr");
  row.classList.add("hovered-row");

  // Add hover effect and background color styles
  row.addEventListener("mouseover", function () {
    this.classList.add("hovered-row");
  });

  row.addEventListener("mouseout", function () {
    this.classList.remove("hovered-row");
  });

  row.innerHTML = `
        <td ${isBold ? 'style="font-weight: bold;"' : ""}>${label}</td>
        <td ${isBold ? 'style="font-weight: bold;"' : ""}>${values.male}</td>
        <td ${isBold ? 'style="font-weight: bold;"' : ""}>${values.female}</td>
        <td ${isBold ? 'style="font-weight: bold;"' : ""}>${
    values.Grand_Total
  }</td>
    `;

  return row;
}

function renderTable(data) {
  const sumByGenderAndGroup = calculateSumByGenderAndGroup(data);
  const tableBody = document.getElementById("data-table-body");

  let grandTotal = { math: 0, reading: 0, writing: 0 };

  Object.entries(sumByGenderAndGroup).forEach(([gender, values]) => {
    if (["male", "female"].includes(gender)) {
      tableBody.appendChild(createRow(gender, values, true));
    }

    Object.entries(values.groups).forEach(([group, groupValues]) => {
      if (
        ["group A", "group B", "group C", "group D", "group E"].includes(group)
      ) {
        tableBody.appendChild(createRow(group, groupValues, false));

        // Cập nhật grand total
        grandTotal.math += groupValues.math;
        grandTotal.reading += groupValues.reading;
        grandTotal.writing += groupValues.writing;
      }
    });
  });
}
// 2nd table
function calculateAverageByDegree(data) {
  const result = {};

  data.forEach((entry) => {
    const genderKey = entry.gender;
    const groupKey = entry.parent_degrees;
    const sumAvg = parseFloat(entry["Sum_avg"]);
    // set initial values
    result[groupKey] = result[groupKey] || {
      male: 0,
      female: 0,
      Grand_Total: 0,
      count: 0,
      countmale: 0,
      countfemale: 0,
    };

    result[groupKey].male += genderKey === "male" ? sumAvg : 0;
    result[groupKey].countmale += genderKey === "male" ? 1 : 0;
    result[groupKey].female += genderKey === "female" ? sumAvg : 0;
    result[groupKey].countfemale += genderKey === "female" ? 1 : 0;
    result[groupKey].Grand_Total += sumAvg;
    result[groupKey].count += 1;
  });

  // calculate the average for each group and round up to 2 decimal places
  Object.keys(result).forEach((groupKey) => {
    const group = result[groupKey];
    if (group.count > 0) {
      group.male = parseFloat((group.male / group.countmale).toFixed(2));
      group.female = parseFloat((group.female / group.countfemale).toFixed(2));
      group.Grand_Total = parseFloat(
        (group.Grand_Total / group.count).toFixed(2)
      );
    }
    delete group.count; // remove the group from the object
  });

  return result;
}
// read data in the table
function getDataFromTable(tableId) {
  var table = document.getElementById(tableId);

  if (!table) {
    console.error("Table with ID '" + tableId + "' not found.");
    return;
  }

  var rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
  var dataTable = [];

  // loop to obtain data from each row
  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].getElementsByTagName("td");
    var rowData = {};

    // loop to obtain data from each cell
    for (var j = 0; j < cells.length; j++) {
      var columnName = table
        .getElementsByTagName("thead")[0]
        .getElementsByTagName("th")[j].textContent;
      rowData[columnName] = cells[j].textContent;
    }

    dataTable.push(rowData);
  }
  return dataTable;
}
// show the table
function renderDegreeTable(data) {
  const sumByDegree = calculateAverageByDegree(data);
  const degreeTableBody = document.getElementById("data_table_2");

  let degreeGrandTotal = { male: 0, female: 0, Grand_Total: 0 };

  Object.entries(sumByDegree).forEach(([parent_degrees, values]) => {
    if (
      [
        "bachelor's degree",
        "some college",
        "master's degree",
        "associate's degree",
        "high school",
        "some high school",
      ].includes(parent_degrees)
    ) {
      degreeTableBody.appendChild(createRow2(parent_degrees, values, false));
    }
    // Assume createRow2 is a function that works correctly with the structure of values
    degreeGrandTotal.male += values.male || 0;
    degreeGrandTotal.female += values.female || 0;
    degreeGrandTotal.Grand_Total += values.Grand_Total || 0;
  });

  // calculate the average for Grand Total
  degreeGrandTotal.male /= 6;
  degreeGrandTotal.female /= 6;
  degreeGrandTotal.Grand_Total /= 6;
  degreeGrandTotal.male = parseFloat(degreeGrandTotal.male).toFixed(2);
  degreeGrandTotal.female = parseFloat(degreeGrandTotal.female).toFixed(2);
  degreeGrandTotal.Grand_Total = parseFloat(
    degreeGrandTotal.Grand_Total
  ).toFixed(2);
  degreeTableBody.appendChild(createRow2("Total", degreeGrandTotal, true));
}

// Fetch data from CSV file
fetch("./main_data.csv")
  .then((response) => response.text())
  .then((csv) => {
    // Parse CSV data
    Papa.parse(csv, {
      header: true,
      complete: function (result) {
        const data = result.data;
        renderTable(data);
        renderDegreeTable(data);
      },
    });

    $("#data-table").DataTable({
      data: getDataFromTable("data-table"),
      columns: [
        { data: "Gender" },
        { data: "Sum of Math score" },
        { data: "Sum of Reading score" },
        { data: "Sum of Writing score" },
      ],
      searching: false,
      ordering: false,
      paging: false,
      info: false,
      createdRow: (row, data, index) => {
        boldRows = [0, 6, 12];
        if (boldRows.includes(index)) {
          $(row).addClass("bold-row");
        }
      },
    });

    $("#data_table_degree").DataTable({
      data: getDataFromTable("data_table_degree"),
      columns: [
        { data: "Parental Degree" },
        { data: "Male" },
        { data: "Female" },
        { data: "Total" },
      ],
      searching: false,
      ordering: true,
      // order: [[1, 'desc']],
      paging: false,
      info: false,
      createdRow: (row, data, index) => {
        // Adjust index based on the actual number of columns
      },
      drawCallback: (settings) => {
        const grandTotalRow = $(
          '#data_table_degree tbody tr:contains("Total")'
        );

        if (grandTotalRow.length > 0) {
          grandTotalRow
            .css("font-weight", "bold")
            .detach()
            .appendTo($("#data_table_degree tbody"));
        }
      },
    });
  });

function calculateAndDisplayAverages(csvFilePath) {
  d3.csv(csvFilePath).then(function (data) {
    // calculate average for free/reduced lunch
    var freeReduceData = data.filter(function (d) {
      return d.lunch === "free/reduced";
    });
    var freeReduceAvg = d3.mean(freeReduceData, function (d) {
      return +d.Sum_avg;
    });

    // calculate average for standard lunch
    var standardData = data.filter(function (d) {
      return d.lunch === "standard";
    });
    var standardAvg = d3.mean(standardData, function (d) {
      return +d.Sum_avg;
    });

    // show id values with corresponding averages
    d3.select(".Free_Reduce").text(freeReduceAvg.toFixed(2));
    d3.select(".Standard").text(standardAvg.toFixed(2));
  });
}

calculateAndDisplayAverages("./main_data.csv");
