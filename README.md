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
<img width="903" height="615" alt="image" src="https://github.com/user-attachments/assets/abd7b91d-0e54-4c96-865d-5663d9b0139e" />

The TPM heatmap visualizes gene expression levels across different samples. It allows users to compare the expression patterns of selected genes.

### Fold Change Heatmap
<img width="882" height="726" alt="image" src="https://github.com/user-attachments/assets/221893e7-3a49-4552-b7e9-e135481255c5" />

The Fold Change heatmap calculates and displays the log2 fold change of gene expression relative to a selected reference sample.

The calculation is based on:

`log2((TPM + 1) / (Reference TPM + 1))`

This visualization helps users identify genes with increased or decreased expression compared to the reference sample.

### Bar Chart
<img width="892" height="555" alt="image" src="https://github.com/user-attachments/assets/43598706-6fa7-47b0-b1bf-36149f228ee5" />

The bar chart compares gene expression levels across multiple samples or treatments.

### Scatter Plot
<img width="900" height="627" alt="image" src="https://github.com/user-attachments/assets/9297c7c1-c15f-46a0-a64c-8a52a0eec3ac" />

The scatter plot is used to compare the expression of two selected genes. The visualization also includes a regression line to help identify the relationship between the expression patterns of the genes.

## Dataset

The dashboard uses RNA-seq gene expression data measured in TPM (Transcripts Per Million). The gene expression data are provided as a matrix in which genes are represented as rows and biological samples are represented as columns.

The dataset consists of three main CSV files:
- Data_TPM.csv
- Treatment.csv
- Category.csv
  
## Dataset Summary
Dataset Component	Description
Total genes	26,060 genes
Total samples	388 samples
Treatment categories	33 categories
Gene categories	26 categories
Main expression unit	TPM (Transcripts Per Million)
Data format	CSV

## 1. Data_TPM.csv

Data_TPM.csv contains the gene expression matrix used as the main data source for the dashboard.

The data are organized in a gene-by-sample matrix:

The first column contains the gene identifier or gene name.
The remaining columns contain sample identifiers.
Each row represents one gene.
Each cell contains the TPM value of a specific gene in a specific sample.

For example:

gene,SRR16912777,SRR16912776,SRR16912775,SRR11553561,SRR11553560
p5.00_sc00001_p0001,61.9578,80.8683,35.0124,0,0
p5.00_sc00001_p0002,4.25948,9.37317,3.99109,0,34.4019
p5.00_sc00001_p0003,9.1128,16.5501,8.5413,0,0
p5.00_sc00001_p0004,14.8986,18.8549,1.8913,0,0

In this structure, for example, the value 61.9578 represents the TPM expression level of gene p5.00_sc00001_p0001 in sample SRR16912777.

The TPM values are used by the dashboard to generate the different gene expression visualizations, including the TPM heatmap, Fold Change heatmap, bar chart, and scatter plot.

## 2. Treatment.csv

Treatment.csv contains information about the samples and their corresponding treatment categories.

The main columns include:

Column	Description	Example
Sample	Sample identifier corresponding to a column in Data_TPM.csv	SRR16912777
Perlakuan	Treatment category associated with the sample	Control

Example:

Sample,Perlakuan
SRR16912777,Control
SRR16912776,Control
SRR16912775,Drought Stress
SRR11553561,Drought Stress

The sample identifiers in Treatment.csv are used to match the corresponding sample columns in Data_TPM.csv. The treatment information allows users to filter and group samples based on their experimental conditions.

## 3. Category.csv

Category.csv contains the classification of genes into predefined gene categories.

The main columns include:

Column	Description	Example
Gene	Gene identifier corresponding to a row in Data_TPM.csv	p5.00_sc00001_p0001
Category	Category assigned to the gene	Stress Response

Example:

Gene,Category
p5.00_sc00001_p0001,Stress Response
p5.00_sc00001_p0002,Photosynthesis
p5.00_sc00001_p0003,Metabolism
p5.00_sc00001_p0004,Defense Response

The gene identifiers in Category.csv are matched with the gene identifiers in Data_TPM.csv. This information is used to provide gene category filtering in the dashboard.

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
## 1. Preparation

Before running the visualization, make sure the following files are located in the same project folder:

- index.html
- dataset.html
- fullscreen.html
- style.css
- script.js
- Data_TPM.csv
- Treatment.csv
- Category.csv

A web browser with JavaScript enabled is also required.

## 2. Run Visualization

The dashboard can be run directly without using Live Server or another local development server.

Open the project folder and double-click:

index.html

The application will open in the default web browser.

Note: If the browser blocks the CSV files from being loaded because of local file security restrictions (file://), the application may not function correctly. In that case, a local web server such as Live Server can be used as an alternative.

## How to Use
1. Open the dashboard through index.html.
2. Select a Treatment Category.
3. Select a Gene Category, if needed.
4. Enter one or more gene names in the gene search field.
5.  Set the minimum and maximum TPM values if required.
6. Select the desired visualization type:
TPM Heatmap
Fold Change Heatmap
Bar Chart
Scatter Plot
7. Click the search button to generate the visualization.
8. Use zoom, pan, hover, and other interactive features to explore the data.
9. Download the visualization as an image if needed.
10. Use the fullscreen feature for a larger visualization view.
    
## Research Purpose

This dashboard was developed to support the visualization and exploration of palm oil gene expression data. The system aims to make large-scale RNA-seq data easier to explore by providing interactive visualizations and filtering features.

The project was developed using the **Design Science Research (DSR)** approach.

## Evaluation

The system was evaluated using:

- **Black Box Testing**
- **User Acceptance Testing (UAT)**
- **System Usability Scale (SUS)**

These evaluations were used to assess the functionality, usability, and user acceptance of the developed dashboard.

## Citation

Journal: In preparation

## License

This project is intended for academic and research purposes.

---

⭐ If you find this project useful, feel free to star the repository!
