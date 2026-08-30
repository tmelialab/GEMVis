// ===============================
// GLOBAL
// ===============================
let dataTPM = [];
let dataTreatment = [];
let dataCategory = [];
let chart;

Chart.register(ChartZoom);

// ===============================
// LOAD DATA
// ===============================
async function loadData() {
  try {
    const res1 = await fetch("data/Data_TPM.csv");
    const text1 = await res1.text();
    dataTPM = parseCSV(text1);

    const res2 = await fetch("data/Treatment.csv");
    const text2 = await res2.text();
    dataTreatment = parseCSV(text2);

    const res3 = await fetch("data/Category.csv");
    const text3 = await res3.text();
    dataCategory = parseCSV(text3);

    isiDropdownGeneKategori();
    isiDropdownKategori();
    console.log("Data berhasil dimuat!");

    updateInfoBox();
  } catch (err) {
    console.error("Error:", err);
  }
}

// ===============================
// PARSE CSV
// ===============================
function parseCSV(text) {
  const rows = text
    .split("\n")
    .map((r) => r.trim())
    .filter((r) => r);

  const headers = rows[0].split(",");

  return rows.slice(1).map((row) => {
    const values = row.split(",");
    let obj = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = values[i];
    });
    return obj;
  });
}

//===============================
// INFO BOX
//===============================

function updateInfoBox() {
  console.log("UPDATE INFOBOX");

  // Total genes
  document.getElementById("totalGenes").textContent = dataTPM.length;

  // Total samples
  if (dataTPM.length > 0) {
    const sampleCount = Object.keys(dataTPM[0]).filter(
      (key) => key !== "Gene" && key !== "gene",
    ).length;

    document.getElementById("totalSamples").textContent = sampleCount;
  }

  // Total treatment
  const unik = [...new Set(dataTreatment.map((d) => d.Perlakuan))];
  document.getElementById("totalTreatment").textContent = unik.length;
}

// ===============================
// DROPDOWN CATEGORY
// ===============================
function isiDropdownKategori() {
  const select = document.getElementById("categorySelect");
  const unik = [...new Set(dataTreatment.map((d) => d.Perlakuan))];

  unik.forEach((kat) => {
    const option = document.createElement("option");
    option.value = kat;
    option.textContent = kat;
    select.appendChild(option);
  });
}

function isiDropdownGeneKategori() {
  const select = document.getElementById("geneCategorySelect");

  const unik = [...new Set(dataCategory.map((d) => d.Category))];

  unik.forEach((kat) => {
    const option = document.createElement("option");
    option.value = kat;
    option.textContent = kat;
    select.appendChild(option);
  });
}

// ===============================
// SEARCH & VISUALIZE
// ===============================
function searchGene() {
  const input = document
    .querySelector("input[placeholder='Search gene...']")
    .value.trim();

  const selectedType = document.querySelector(
    "input[name='visualType']:checked",
  );

  if (!selectedType) {
    alert("Pilih tipe visualisasi terlebih dahulu!");
    return;
  }

  const type = selectedType.value;

  // ===============================
  // 1 Ambil Gen
  // ===============================
  let genes;

  if (!input) {
    genes = dataTPM.map((row) => row.Gene || row.gene || Object.values(row)[0]);
  } else {
    genes = input.split(/[, ]+/).filter((g) => g);
  }

  // ===============================
  // 2 Filter Gene Category
  // ===============================
  const selectedGeneCategory =
    document.getElementById("geneCategorySelect").value;

  if (selectedGeneCategory) {
    const allowedGenes = dataCategory
      .filter((d) => d.Category === selectedGeneCategory)
      .map((d) => d.Gene);

    genes = genes.filter((g) => allowedGenes.includes(g));

    if (genes.length === 0) {
      alert("Tidak ada gen dalam kategori tersebut.");
      return;
    }
  }

  // ===============================
  // 3 Validasi Khusus Visualisasi
  // ===============================
  if (type === "bar" && genes.length > 50) {
    alert("Bar chart maksimal 50 gen!");
    return;
  }

  if (type === "scatter" && genes.length !== 2) {
    alert("Scatter plot membutuhkan tepat 2 gen!");
    return;
  }

  // ===============================
  // 4 Ambil Data Gen dari TPM
  // ===============================
  const foundGenes = genes.map((geneName) =>
    dataTPM.find(
      (g) =>
        g.gene === geneName ||
        g.Gene === geneName ||
        Object.values(g)[0] === geneName,
    ),
  );

  if (foundGenes.includes(undefined)) {
    alert("Ada gen yang tidak ditemukan!");
    return;
  }

  // ===============================
  // 5 Filter Treatment (Sample)
  // ===============================
  const selectedCategory = document.getElementById("categorySelect").value;

  let labels = Object.keys(foundGenes[0]).filter(
    (key) => key !== "Gene" && key !== "gene",
  );

  if (selectedCategory) {
    const samplesKategori = dataTreatment
      .filter((d) => d.Perlakuan === selectedCategory)
      .map((d) => d.Sample);

    labels = labels.filter((s) => samplesKategori.includes(s));
  }

  // ===============================
  // 6 Buat Matrix
  // ===============================
  let matrix = foundGenes.map((gene) =>
    labels.map((s) => parseFloat(gene[s]) || 0),
  );

  // ===============================
  // 7 Filter Min/Max TPM (SYNC FIX)
  // ===============================
  const minTPM = parseFloat(
    document.querySelector("input[placeholder='Min TPM']").value,
  );
  const maxTPM = parseFloat(
    document.querySelector("input[placeholder='Max TPM']").value,
  );

  if (!isNaN(minTPM) || !isNaN(maxTPM)) {
    matrix = matrix.map((row) =>
      row.map((value) => {
        if (!isNaN(minTPM) && value < minTPM) return null;
        if (!isNaN(maxTPM) && value > maxTPM) return null;
        return value;
      }),
    );
  }

  // ===============================
  // 8 Switch Visualisasi
  // ===============================
  // 🔥 Update Gene Information pakai gen pertama setelah filtering
  if (genes.length > 0 && foundGenes.length > 0) {
    updateGeneInformation(genes[0], foundGenes[0], labels);
  }
  switch (type) {
    case "bar":
      tampilkanBarChartMulti(labels, matrix, genes);
      break;

    case "scatter":
      tampilkanScatterPlot(labels, matrix[0], matrix[1], genes[0], genes[1]);
      break;

    case "heatmapTPM":
      tampilkanHeatmapTPM(labels, matrix, genes);
      break;

    case "heatmapFC":
      const referenceSample = document
        .getElementById("referenceSample")
        .value.trim();

      if (!referenceSample) {
        alert("Pilih reference terlebih dahulu.");
        return;
      }

      const result = hitungLog2FC(foundGenes, labels, referenceSample);

      if (!result.matrix || result.matrix.length === 0) {
        alert("Tidak ada data untuk Heatmap FC.");
        return;
      }

      // 🔥 Update Gene Information pakai gen pertama
      updateGeneInformation(genes[0], foundGenes[0], labels);

      // ==========================
      // 🔥 ROW CLUSTERING (GEN)
      // ==========================
      const rowOrder = clusterOrder(result.matrix);

      const orderedMatrix = rowOrder.map((i) => result.matrix[i]);
      const orderedGenes = rowOrder.map((i) => genes[i]);

      // ==========================
      // 🔥 COLUMN CLUSTERING (TREATMENT)
      // ==========================
      const transposed = orderedMatrix[0].map((_, colIndex) =>
        orderedMatrix.map((row) => row[colIndex]),
      );

      const colOrder = clusterOrder(transposed);

      const finalMatrix = orderedMatrix.map((row) =>
        colOrder.map((i) => row[i]),
      );

      const orderedSamples = colOrder.map((i) => result.samples[i]);
      tampilkanHeatmapFC(orderedSamples, finalMatrix, orderedGenes);
      break;

    default:
      alert("Tipe visualisasi tidak dikenali");
  }
}

// ===============================
// BAR CHART
// ===============================
function tampilkanBarChartMulti(labels, matrix, genes) {
  document.querySelector(".chart-box").style.height = "350px";
  document.getElementById("heatmapTPM").style.display = "none";
  document.getElementById("myChart").style.display = "block";

  if (chart) chart.destroy();

  const ctx = document.getElementById("myChart").getContext("2d");

  // Buat banyak dataset (1 gen = 1 dataset)
  const datasets = matrix.map((row, i) => ({
    label: genes[i],
    data: row,
    borderWidth: 1,
  }));

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets,
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Sample",
          },
          ticks: {
            maxRotation: 90,
            minRotation: 45,
          },
        },
        y: {
          title: {
            display: true,
            text: "TPM",
          },
          beginAtZero: true,
        },
      },
      plugins: {
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
              speed: 0.01,
            },
            pinch: {
              enabled: true,
            },
            mode: "x",
          },
          pan: {
            enabled: true,
            mode: "xy",
          },
        },
      },
    },
  });
  const canvas = document.getElementById("myChart");

  canvas.addEventListener(
    "wheel",
    function (e) {
      e.preventDefault();
    },
    { passive: false },
  );

  window.lastChartJSData = {
    type: chart.config.type,
    data: chart.config.data,
    options: chart.config.options,
  };

  document.getElementById("myChart").onclick = function (evt) {
    const points = chart.getElementsAtEventForMode(
      evt,
      "nearest",
      { intersect: true },
      true,
    );

    if (points.length) {
      const datasetIndex = points[0].datasetIndex;
      const geneName = chart.data.datasets[datasetIndex].label;

      const geneObject = dataTPM.find(
        (g) =>
          g.Gene === geneName ||
          g.gene === geneName ||
          Object.values(g)[0] === geneName,
      );

      if (geneObject) {
        const labels = Object.keys(geneObject).filter(
          (key) => key !== "Gene" && key !== "gene",
        );

        updateGeneInformation(geneName, geneObject, labels);
      }
    }
  };
}

// ===============================
// SCATTER
// ===============================
function tampilkanScatterPlot(labels, values1, values2, gene1, gene2) {
  document.querySelector(".chart-box").style.height = "350px";
  document.getElementById("heatmapTPM").style.display = "none";
  document.getElementById("myChart").style.display = "block";
  if (chart) chart.destroy();

  const ctx = document.getElementById("myChart").getContext("2d");

  const scatterData = labels
    .map((_, i) => ({
      x: values1[i],
      y: values2[i],
    }))
    .filter(
      (point) =>
        point.x !== null &&
        point.y !== null &&
        !isNaN(point.x) &&
        !isNaN(point.y),
    );

  // 🔥 gunakan data yang sama dengan scatter plot
  const filteredX = scatterData.map((p) => p.x);
  const filteredY = scatterData.map((p) => p.y);

  const { slope, intercept } = hitungRegresi(filteredX, filteredY);

  const minX = Math.min(...filteredX);
  const maxX = Math.max(...filteredX);

  const regressionLine = [
    { x: minX, y: slope * minX + intercept },
    { x: maxX, y: slope * maxX + intercept },
  ];
  chart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: gene1 + " vs " + gene2,
          data: scatterData,
          backgroundColor: "rgba(52, 152, 219, 0.8)",
          pointRadius: 5,
        },
        {
          label: "Regression Line",
          data: regressionLine,
          type: "line",
          borderColor: "rgba(44, 62, 80, 1)",
          borderWidth: 2,
          fill: false,
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "TPM " + gene1 } },
        y: { title: { display: true, text: "TPM " + gene2 } },
      },
      plugins: {
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
              speed: 0.01,
            },
            pinch: {
              enabled: true,
            },
            mode: "xy",
          },
          pan: {
            enabled: true,
            mode: "xy",
          },
        },
      },
    },
  });

  const canvas = document.getElementById("myChart");

  canvas.addEventListener(
    "wheel",
    function (e) {
      e.preventDefault();
    },
    { passive: false },
  );
  window.lastChartJSData = {
    type: chart.config.type,
    data: chart.config.data,
    options: chart.config.options,
  };

  document.getElementById("myChart").onclick = function (evt) {
    const points = chart.getElementsAtEventForMode(
      evt,
      "nearest",
      { intersect: true },
      true,
    );

    if (points.length) {
      const datasetIndex = points[0].datasetIndex;
      const geneName = chart.data.datasets[datasetIndex].label;

      const geneObject = dataTPM.find(
        (g) =>
          g.Gene === geneName ||
          g.gene === geneName ||
          Object.values(g)[0] === geneName,
      );

      if (geneObject) {
        const labels = Object.keys(geneObject).filter(
          (key) => key !== "Gene" && key !== "gene",
        );

        updateGeneInformation(geneName, geneObject, labels);
      }
    }
  };
}
// ===============================
// REGRESI
// ===============================
function hitungRegresi(x, y) {
  const valid = x
    .map((xi, i) => ({ x: xi, y: y[i] }))
    .filter((p) => !isNaN(p.x) && !isNaN(p.y));

  const n = valid.length;

  const sumX = valid.reduce((a, b) => a + b.x, 0);
  const sumY = valid.reduce((a, b) => a + b.y, 0);
  const sumXY = valid.reduce((t, p) => t + p.x * p.y, 0);
  const sumX2 = valid.reduce((t, p) => t + p.x * p.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

// ===============================
// Heatmap TPM
// ===============================
function tampilkanHeatmapTPM(labels, matrix, genes) {
  document.getElementById("myChart").style.display = "none";
  document.getElementById("heatmapTPM").style.display = "block";

  if (chart) chart.destroy();

  const data = [
    {
      z: matrix,
      x: labels,
      y: genes,
      type: "heatmap",
      colorscale: [
        [0, "#2166ac"],
        [0.5, "#f7f7f7"],
        [1, "#b2182b"],
      ],
      reversescale: true,
      hoverongaps: false,
    },
  ];

  const layout = {
    title: "Heatmap TPM",
    xaxis: {
      tickangle: -45,
    },
    yaxis: {
      automargin: true,
    },
    margin: {
      l: 100,
      r: 50,
      t: 50,
      b: 100,
    },
  };

  window.lastPlotlyData = data;
  window.lastPlotlyLayout = layout;

  Plotly.newPlot("heatmapTPM", data, layout, {
    responsive: true,
    displaylogo: false,
  });
  const heatmapDiv = document.getElementById("heatmapTPM");

  heatmapDiv.on("plotly_click", function (data) {
    const geneName = data.points[0].y; // baris = gen

    const geneObject = dataTPM.find(
      (g) =>
        g.Gene === geneName ||
        g.gene === geneName ||
        Object.values(g)[0] === geneName,
    );

    if (geneObject) {
      const labels = Object.keys(geneObject).filter(
        (key) => key !== "Gene" && key !== "gene",
      );

      updateGeneInformation(geneName, geneObject, labels);
    }
  });

  setTimeout(() => {
    Plotly.Plots.resize("heatmapTPM");
  }, 100);
}

//HeatmapFC//

function hitungLog2FC(foundGenes, labels, referenceSample) {
  if (!labels.includes(referenceSample)) {
    alert("Sample reference tidak ditemukan.");
    return { matrix: [], samples: [] };
  }

  const minTPM = parseFloat(
    document.querySelector("input[placeholder='Min TPM']").value,
  );

  const maxTPM = parseFloat(
    document.querySelector("input[placeholder='Max TPM']").value,
  );

  const matrix = foundGenes.map((gene) => {
    const refValue = parseFloat(gene[referenceSample]) || 0;

    return labels.map((sample) => {
      let value = parseFloat(gene[sample]) || 0;

      if (!isNaN(minTPM) && value < minTPM) return null;
      if (!isNaN(maxTPM) && value > maxTPM) return null;

      return Math.log2((value + 1) / (refValue + 1));
    });
  });

  return {
    matrix,
    samples: labels,
  };
}

//clustering//

// ===============================
// Hierarchical Clustering (Correlation Distance)
// ===============================
function clusterOrder(matrix) {
  function correlation(a, b) {
    const meanA = a.reduce((x, y) => x + y, 0) / a.length;
    const meanB = b.reduce((x, y) => x + y, 0) / b.length;

    const numerator = a.reduce(
      (sum, val, i) => sum + (val - meanA) * (b[i] - meanB),
      0,
    );

    const denomA = Math.sqrt(
      a.reduce((sum, val) => sum + Math.pow(val - meanA, 2), 0),
    );

    const denomB = Math.sqrt(
      b.reduce((sum, val) => sum + Math.pow(val - meanB, 2), 0),
    );

    return numerator / (denomA * denomB || 1);
  }

  function corrDistance(a, b) {
    return 1 - correlation(a, b); // 🔥 distance
  }

  let clusters = matrix.map((row, i) => ({
    vector: row,
    indices: [i],
  }));

  while (clusters.length > 1) {
    let minDist = Infinity;
    let pair = [0, 1];

    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const dist = corrDistance(clusters[i].vector, clusters[j].vector);

        if (dist < minDist) {
          minDist = dist;
          pair = [i, j];
        }
      }
    }

    const [i, j] = pair;

    const merged = {
      vector: clusters[i].vector.map(
        (v, idx) => (v + clusters[j].vector[idx]) / 2,
      ),
      indices: [...clusters[i].indices, ...clusters[j].indices],
    };

    clusters = clusters.filter((_, idx) => idx !== i && idx !== j);
    clusters.push(merged);
  }

  return clusters[0].indices;
}

function tampilkanHeatmapFC(labels, matrix, genes) {
  document.querySelector(".chart-box").style.height = "550px";
  document.getElementById("myChart").style.display = "none";
  document.getElementById("heatmapTPM").style.display = "block";

  const data = [
    {
      z: matrix,
      x: labels,
      y: genes,
      type: "heatmap", // 🔥 penting
      colorscale: [
        [0, "#2166ac"],
        [0.5, "#f7f7f7"],
        [1, "#b2182b"],
      ],
      zmid: 0,
      hoverongaps: false,
    },
  ];

  const layout = {
    title: "Fold Change Heatmap",
    autosize: true,
    margin: {
      l: 120,
      r: 40,
      t: 60,
      b: 140,
    },
    xaxis: {
      tickangle: -30,
      automargin: true,
    },
    yaxis: {
      automargin: true,
    },
  };

  window.lastPlotlyData = data;
  window.lastPlotlyLayout = layout;

  Plotly.react("heatmapTPM", data, layout, {
    responsive: true,
    displaylogo: false,
  });

  const heatmapDiv = document.getElementById("heatmapTPM");

  heatmapDiv.on("plotly_click", function (data) {
    const geneName = data.points[0].y; // baris = gen

    const geneObject = dataTPM.find(
      (g) =>
        g.Gene === geneName ||
        g.gene === geneName ||
        Object.values(g)[0] === geneName,
    );

    if (geneObject) {
      const labels = Object.keys(geneObject).filter(
        (key) => key !== "Gene" && key !== "gene",
      );

      updateGeneInformation(geneName, geneObject, labels);
    }
  });
}

// ===============================
// EVENT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  loadData();

  document
    .querySelector(".sidebar button")
    .addEventListener("click", searchGene);

  // 🔥 PINDAHKAN EXPLORE KE SINI
  const exploreBtn = document.getElementById("exploreBtn");

  if (exploreBtn) {
    exploreBtn.addEventListener("click", function () {
      const chartType = document.querySelector(
        "input[name='visualType']:checked",
      );
      if (!chartType) return;

      localStorage.setItem("lastChartType", chartType.value);

      if (window.lastPlotlyData) {
        localStorage.setItem(
          "plotlyData",
          JSON.stringify(window.lastPlotlyData),
        );
        localStorage.setItem(
          "plotlyLayout",
          JSON.stringify(window.lastPlotlyLayout),
        );
      }

      if (window.lastChartJSData) {
        localStorage.setItem(
          "chartJSData",
          JSON.stringify(window.lastChartJSData),
        );
      }

      window.location.href = "fullscreen.html";
    });
  }
});

document.querySelectorAll("input[name='visualType']").forEach((radio) => {
  radio.addEventListener("change", function () {
    const refSelect = document.getElementById("referenceSample");

    if (this.value === "heatmapFC") {
      refSelect.disabled = false;
    } else {
      refSelect.disabled = true;
    }
  });
});

// ===============================
// DOWNLOAD VISUALIZATION
// ===============================
document.getElementById("downloadBtn").addEventListener("click", function () {
  const chartCanvas = document.getElementById("myChart");
  const heatmapDiv = document.getElementById("heatmapTPM");

  // 🔥 Kalau Heatmap sedang tampil
  if (heatmapDiv.style.display === "block") {
    Plotly.toImage("heatmapTPM", {
      format: "png",
      width: 1200,
      height: 800,
    }).then(function (dataUrl) {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "heatmap.png";
      link.click();
    });
  }

  // 🔥 Kalau Chart.js (bar / scatter)
  else if (chartCanvas.style.display === "block") {
    const link = document.createElement("a");
    link.href = chartCanvas.toDataURL("image/png");
    link.download = "chart.png";
    link.click();
  }
});

//Gene Information//
function updateGeneInformation(geneName, geneObject, labels) {
  if (!geneName || !geneObject) return;

  // 🔹 Ambil kategori
  const categoryData = dataCategory.find((d) => d.Gene === geneName);

  const category = categoryData ? categoryData.Category : "Unknown";

  // 🔹 Ambil nilai TPM
  const values = labels.map((s) => parseFloat(geneObject[s]) || 0);

  const mean = values.reduce((a, b) => a + b, 0) / values.length;

  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  const highestSample = labels[values.indexOf(maxValue)];
  const lowestSample = labels[values.indexOf(minValue)];

  // 🔹 Update UI
  document.getElementById("infoGeneName").textContent = geneName;
  document.getElementById("infoGeneCategory").textContent = category;
  document.getElementById("infoMeanTPM").textContent = mean.toFixed(2);
  document.getElementById("infoHighest").textContent =
    highestSample + " (" + maxValue.toFixed(2) + ")";
  document.getElementById("infoLowest").textContent =
    lowestSample + " (" + minValue.toFixed(2) + ")";
}
