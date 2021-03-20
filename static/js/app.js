function optionChanged(Country) {
    updatePlotly2(Country);
    updateDemoInfo(Country)
};
//When going to initial html page, creates function so pages loads on first dropdown
function init() {
    d3.csv("2015.csv").then((data) => {
        var names = data.map(x => x.Country)
        names.forEach(function(name) {
            d3.select('#selDataset')
                .append('option')
                .text(name)
            });  

    // Creating data arrays            
    var family = data.map(x=> x.Family);
    var freedom = data.map(x=> x.Freedom);
    var happiness = data.map(x=> x.Happiness_Score);

    //console.log(family);
    //console.log(freedom);
    //console.log(happiness);


    // Selecting Top Ten data
    var sort_family = family.sort(function(a, b) {
        return b-a
    });
    var topten_family = sort_family.map(x => x.slice(0,10));
    var sort_freedom = freedom.sort(function(a, b) {
        return b-a
    });
    var top_freedom = sort_freedom.map(x =>x.slice(0,10));
    var sort_happiness = happiness.sort(function(a, b) {
        return b-a
    });
    var top_happiness = sort_happiness.map(x =>x.slice(0,10));

    var country = data.map(x => x.Country);
    var first_ID = data[0];
    var sample_Meta = d3.select("#sample-metadata").selectAll('h1')

    //console.log(topten_family);
    //console.log(top_happiness);
    
    var firstMetadata = sample_Meta.data(d3.entries(first_ID))
    firstMetadata.enter()
                    .append('h1')
                    .merge(firstMetadata)
                    .text(d => `${d.key} : ${d.value}`)
                    .style('font-size','12px')
  
    firstMetadata.exit().remove()

    // Create chart trace and layout
    var trace1 = {
        x : top_happiness[4],
        y : topten_family[0],
        text : top_freedom[0],
        type : 'line',
        orientation : 'h',
        transforms: [{
            type: 'sort',
            target: 'y',
            order: 'descending'
        }]
    };

    var layout1 = {
        title : '<b>Happy / Family / Freedom</b><br>Testing'
    };

    // Create chart
    var data = [trace1];
    var config = {responsive:true}
    Plotly.newPlot('bar', data, layout1,config);

    });
}; 

init();

// Chart update
function updatePlotly2(id) {
    d3.csv("2015.csv").then((data) => {
        var country_test = data.map(x => x.Country);
        var test = data.filter(x => x.Country === country_test);
       
        var family= test.map(x => x.Family)
            .sort(function(a, b) {
                return b-a
            });
        var topten_family = family.map(x => x.slice(0,10));
        
        var freedom = test.map(x=> x.Freedom)
            .sort(function(a, b) {
                return b-a
            });
        var top_freedom = freedom.map(x => x.slice(0,10));
       
        var happiness = test.map(x=> x.Happiness)
        .sort(function(a, b) {
            return b-a
        });
        var top_happiness = happiness.map(x => x.slice(0,10));

        // Create chart trace and layout
        var trace = {
            x : family[0],
            y : happiness[0],
            text : freedom[0],
            type : 'line',
            orientation : 'h',
            transforms: [{
                type: 'sort',
                target: 'y',
                order: 'descending'
              }]
        };
     
        var layout1 = {
            title: "<b>Testing Again</b><br>Little By Little"
        };
        var data1 = [trace];
        var config = {responsive:true}

        // Plot bar chart
        Plotly.newPlot('bar', data1,layout1,config);
    });
};
// New ID selection update
function updateDemoInfo(NewCountry) {
    d3.csv("2015.csv").then((data) => {
        //var Country = data.map(x => x.Country);
        var dataSamples = data.filter(x => x.Country)[0];
        console.log(dataSamples)

        var sampledata1 = d3.select("#sample-metadata").selectAll('h1')
        console.log(sampledata1)

        var sampledata = sampledata1.data(d3.entries(dataSamples))
        console.log(sampledata)
        
        sampledata.enter().append('h1').merge(sampledata).text(d => `${d.key} : ${d.value}`).style('font-size','12px');
        console.log(sampledata)
        var config = {responsive:true}
    });
};

