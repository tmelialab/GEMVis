# Palm Oil Gene Expression Visualization Dashboard

## Overview

This project is a web-based dashboard developed to visualize and explore palm oil (_Elaeis guineensis_) gene expression data. The system was created as part of an undergraduate thesis project to help researchers analyze RNA-seq gene expression data through interactive visualizations.

The dashboard allows users to explore gene expression data based on selected genes, treatment categories, and gene categories. Multiple visualization methods are provided to support the analysis and comparison of gene expression patterns.

## Features

- Interactive visualization of gene expression data
- Gene search functionality
- Treatment category filtering
- Gene category filtering
- Minimum and maximum TPM filtering
- Multiple gene selection and comparison
- TPM heatmap visualization
- Log2 Fold Change heatmap visualization
- Interactive bar chart
- Scatter plot with regression analysis
- Hierarchical clustering for gene and sample visualization
- Interactive chart features such as zoom, pan, and tooltips
- Gene expression summary information
- Download visualization as an image
- Fullscreen exploration mode
- Dataset preview page

## Visualizations

### TPM Heatmap

The TPM heatmap visualizes gene expression levels across different samples. It allows users to compare the expression patterns of selected genes.

### Fold Change Heatmap

The Fold Change heatmap calculates and displays the log2 fold change of gene expression relative to a selected reference sample.

The calculation is based on:

`log2((TPM + 1) / (Reference TPM + 1))`

This visualization helps users identify genes with increased or decreased expression compared to the reference sample.

### Bar Chart

The bar chart compares gene expression levels across multiple samples or treatments.

### Scatter Plot

The scatter plot is used to compare the expression of two selected genes. The visualization also includes a regression line to help identify the relationship between the expression patterns of the genes.

## Dataset

The dashboard uses RNA-seq gene expression data measured in TPM (_Transcripts Per Million_).

The dataset contains:

- **26,060 genes**
- **388 samples**
- **33 treatment categories**
- **26 gene categories**

The main data files include:

```text
Data_TPM.csv
Treatment.csv
Category.csv
```

### Data Description

- **Data_TPM.csv** — Contains gene expression data in TPM values.
- **Treatment.csv** — Contains sample names and treatment information.
- **Category.csv** — Contains gene names and their corresponding functional categories.

## Technologies Used

The system was developed using:

- **HTML** — Structure of the web application
- **CSS** — User interface styling and responsive design
- **JavaScript** — Application logic and data processing
- **Plotly.js** — Interactive heatmap visualization
- **Chart.js** — Bar and scatter plot visualization
- **Chart.js Zoom Plugin** — Zoom and pan interaction for charts
- **CSV** — Storage format for gene expression and metadata

## Project Structure

```text
palm-oil-gene-expression-dashboard/
│
├── visualisasi.html
├── dataset.html
├── fullscreen.html
│
├── script.js
│
├── Data_TPM.csv
├── Treatment.csv
├── Category.csv
│
└── README.md
```

## How to Run

1. Clone this repository:

```bash
git clone https://github.com/your-username/palm-oil-gene-expression-dashboard.git
```

2. Open the project folder.

3. Run the project using a local web server.

For example, if you are using Visual Studio Code:

- Install the **Live Server** extension.
- Open the project folder in Visual Studio Code.
- Right-click on `index.html`.
- Select **Open with Live Server**.

4. Open the application in your web browser.

## How to Use

1. Select a **Treatment Category**.
2. Select a **Gene Category**, if needed.
3. Enter one or more gene names in the gene search field.
4. Set the minimum and maximum TPM values if required.
5. Select the desired visualization type:
   - TPM Heatmap
   - Fold Change Heatmap
   - Bar Chart
   - Scatter Plot

6. Click the search button to generate the visualization.
7. Use the available interactive features to explore the data.
8. Download the visualization or open it in fullscreen mode.

## Research Purpose

This dashboard was developed to support the visualization and exploration of palm oil gene expression data. The system aims to make large-scale RNA-seq data easier to explore by providing interactive visualizations and filtering features.

The project was developed using the **Design Science Research (DSR)** approach.

## Evaluation

The system was evaluated using:

- **Black Box Testing**
- **User Acceptance Testing (UAT)**
- **System Usability Scale (SUS)**

These evaluations were used to assess the functionality, usability, and user acceptance of the developed dashboard.

## Author

Developed as an undergraduate thesis project.

**Author:** Qoulan Tsaqila

## License

This project is intended for academic and research purposes.

---

⭐ If you find this project useful, feel free to star the repository!
