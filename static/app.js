d3.json("/static/samples.json").then(function(data) {console.log(data)});

 // Populate ID Dropdown
d3.json("/static/samples.json").then(function(data) {

    var names = data.names;
    console.log(names);

    d3.selectAll("#selDataset")
        .selectAll("option")
        .select('option')
        .data(names)
        .enter()
        .append("option")
        .attr("value", function(d) {
        return d;
        })
        .text(function(d) {
        return d;
        });
});

// Submit Button handler
function handleSubmit() {
    // Prevent the page from refreshing
    // d3.event.preventDefault();
  
    // Select the input value from the form
    var belly = d3.select("#selDataset").node().value;
    console.log(belly);
  
    // clear the input value
    d3.select("#selDataset").node().value = "";
  
    // Build the plot with the new stock
    buildPlot(belly);
  }
  
function buildPlot(belly) {

    d3.json("/static/samples.json").then(function(data) {
        // Grab values from the response json object to build the plots
        // var person = data.samples.map(row => row.id === belly)
        data.samples.forEach(function(row) {
            if (row.id === belly) {
            console.log(row.id);
            var sampleValue = row.sample_values;
            var otu_id = row.otu_ids;
            var label = row.otu_labels;
            console.log(sampleValue, otu_id, label); 

            var bar1 = {
                type: "bar",
                orientation: 'h',
                x: sampleValue.slice(0,10),
                y: otu_id.map(id => String(`OTU ${id}`)),
                text: row.otu_labels,
                transforms: [{
                    type: 'sort',
                    target: 'y',
                    order: 'descending'
                  }],
                };
    
            var tableData = [bar1];
    
            var layout = {
                title: `ID ${belly} Data`,
                yaxis: {
                    autorange: true,
                },
                xaxis: {
                    autorange: true,
                },
            };

            Plotly.newPlot("bar", tableData, layout);

            var bubble1 = {
                type: 'scatter',
                x: otu_id,
                y: sampleValue,
                text: row.otu_labels,
                mode: 'markers',
                marker: {
                  size: sampleValue,
                  color: otu_id
                }
              };
              
              var bubbleData = [bubble1];
              
              var layout = {
                title: `ID ${belly} Data`,
                showlegend: false,
                yaxis: {
                    autorange: true,
                },
                xaxis: {
                    autorange: true,
                },
                height: 600,
                width: 1200
              };
              
            Plotly.newPlot('bubble', bubbleData, layout);

        }
            else {;}
        })

        data.metadata.forEach(function(row) {
            if (row.id === parseInt(belly)) {
                console.log(row);
                d3.select("#sample-metadata").html('');
                var sampleData = Object.entries(row);
                sampleData.forEach(function(sample) {
                    console.log(sample);
                    d3.select("#sample-metadata")
                    .append("li")
                    .data(sample)
                    .text(`${sample[0]}: ${sample[1]}`)
                })
                
                var gaugeData = [
                    {
                      domain: { x: [0, 1], y: [0, 1] },
                      value: row.wfreq,
                      title: { text: "Belly Button Washing Frequency<br><span style='font-size:0.8em;color:gray'>Washes per Week</span><br><span style='font-size:0.8em;color:gray'></span>"},
                      subtitle: {text: "Washes per Week"},
                      type: "indicator",
                      mode: "gauge+number+delta",
                      gauge: {
                        axis: { range: [null, 9] },
                        steps: [
                          { range: [0, 1], color: "white" },
                          { range: [1, 2], color: "black" },
                          { range: [2, 3], color: "white" },
                          { range: [3, 4], color: "black" },
                          { range: [4, 5], color: "white" },
                          { range: [5, 6], color: "black" },
                          { range: [6, 7], color: "white" },
                          { range: [7, 8], color: "black" },
                          { range: [8, 9], color: "white" },
                        ],
                      }
                    }
                  ];
                
                var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
                
                Plotly.newPlot('gauge', gaugeData, layout);
        }});
    });
}

// Add event listener for submit button
d3.select("#setDataset").on("click", handleSubmit);