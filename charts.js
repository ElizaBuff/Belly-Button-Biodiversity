function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

//Deliverable 1- Horiztonal Bar Chart
// 1. Create the buildCharts function.
function buildCharts(sample) {
  
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    var metadata = data.metadata;
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var wFreqResultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    var wFreqresult = wFreqResultArray[0];
    console.log(wFreqresult);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    var wfreq = wFreqresult.wfreq; 
    console.log(wfreq);


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map(x=> 'OTU ' + x.toString()).reverse();

    var xValues = sample_values.slice(0,10).map(x=>x).reverse();
    
    var top10Labels = otu_labels.slice(0,10).map(x=>x).reverse(); 

    // 8. Create the trace for the bar chart. 
    var barData = [{
      type: 'bar',
      x: xValues,
      y: yticks,
      orientation: 'h',
      hovertemplate: top10Labels,
      marker: {
        color: ['mediumpurple', 'black', 'cyan', 'black', 'greenyellow', 'black', 'yellow', 'black', 'lightcoral', 'black']
      }
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",   
      height: 400,
      width: 500,  
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

//Deliverable 2- Bubble chart


    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      mode: 'markers',
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Jet'
      }
    }
];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: 'OTU ID'},
      yaxis: {title: '# of Cultures'},
      height: 600,
      width: 1200,
      hovertemplate: otu_ids
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    

  //Deliverable 3- Gauge chart
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        value: wfreq,
        title: { text: "Belly Button Washing Frequency Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10] },
          steps: [
            { range: [0, 2], color: "mediumpurple" },
            { range: [2, 4], color: "cyan" },
            { range: [4, 6], color: "greenyellow" },
            { range: [6, 8], color: "yellow" },
            { range: [8, 10], color: "lightcoral" }
          ],

        }
      }
      ];
        
    // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
        width: 600, 
        height: 500, 
        margin: { t: 0, b: 0 }
      };
    
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);


  });
}

