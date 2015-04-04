// Set the dimensions of the canvas / graph
var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 500 - margin.left - margin.right,
    height = 180 - margin.top - margin.bottom;

// Set the ranges
var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(10);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(10);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.freq); })
    .y(function(d) { return y(d.magn1); });
    
// Adds the svg canvas
var svg = d3.select("#spectrumAnalyzer")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");

//Lookout for these variable
var NofSamples = 200;
var i;
var data_antenna=[]; 
var data_amplifier=[]; 
var data_mixer=[]; 
var data_lo=[];
var data_filter=[];

// Get the data
var data_total;
d3.csv("js/noiseSignal.csv", function(error, data) {
    
    data.forEach(function(d) {
        d.freq = +d.freq;
        d.magn1 = +d.magn1;
        d.magn2 = +d.magn2;
        d.mag1 = +d.mag1;
        d.mag2 = +d.mag2;
        d.mag3 = +d.mag3;
        d.mag4 = +d.mag4;
        d.mag5 = +d.mag5;
    });
    data_total = data;
    
    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.freq; }));
    y.domain([0, 18]);
    
    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    
    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));
});

    //Update function which updates the data based on a hidden radio checked button 

    //Checking hidden radio buttons to preserve the Probe selection so that the user can have the flexibility to click elsewhere (esp on spectrum Analyzer)

    document.getElementById("antennaOut").onclick = 
        function() {
            document.getElementById("antenna_check").checked=true;
            updateData();
            drawGraph();
        };

    document.getElementById("amplifierOut").onclick =
        function() {
            document.getElementById("amplifier_check").checked=true;
            updateData();
            drawGraph();
    };

    document.getElementById("loOut").onclick =
        function () {
            document.getElementById("lo_check").checked=true;
            updateData();
            drawGraph();
        };

    document.getElementById("mixerOut").onclick = 
        function (){ 
            document.getElementById("mixer_check").checked=true;
            updateData();
            drawGraph();
        };

    document.getElementById("filterOut").onclick =
        function () {
            document.getElementById("filter_check").checked=true;
            updateData();
            drawGraph();
        };

    document.getElementById("CF").oninput = 
        function (){
            updateData();
            drawGraph();
    };
    document.getElementById("LO").oninput = 
        function (){
            updateData();
            drawGraph();
    };


    //
    function updateData() {    

    //Calculate signal at Antenna Output based on Carrier Frequency

        var CFF = +document.getElementById("CF").value;
        var LOF = +document.getElementById("LO").value;
        
        document.getElementById("CF_display").innerHTML=CFF;
        document.getElementById("LO_display").innerHTML=LOF;
        
        var pie = Math.PI;
        var lowendFrequency = Math.abs(CFF-LOF);
        var highendFrequency = CFF + LOF;
        console.log(CFF);

        for(i=0; i <=NofSamples;i++){
            if (i < CFF -4 || i > CFF + 4){
                data_antenna[i] =0;
            }else{
                data_antenna[i] = 5*(Math.sin(pie/2 + (i - CFF)*pie/8));
            }
            data_total[i].mag1 = data_antenna[i] + ((Math.random() < 0.5)? data_total[i].magn1 : data_total[i].magn2 ) ;
            data_total[i].mag2= 2*data_total[i].mag1;
            if ( i != LOF ) {
                data_lo[i] = (Math.random() < 0.5)? data_total[i].magn1 : data_total[i].magn2;
            }else {
                data_lo[i]= 5 + ((Math.random() < 0.5)? data_total[i].magn1 : data_total[i].magn2);
            }
            data_total[i].mag3 = data_lo[i];

            if (i < (lowendFrequency -4) || (i > (lowendFrequency + 4) && i<(highendFrequency -4)) || i > (highendFrequency + 4) ) {
                data_mixer[i]=0;
            }else if ( i >= (lowendFrequency -4) && i <= (lowendFrequency +4) ) {
                data_mixer[i] = 14* Math.sin(pie/2 + (i - lowendFrequency)*pie/8);
            }else {
                data_mixer[i] = 14* Math.sin(pie/2 + (i - highendFrequency)*pie/8);
            }           
            data_total[i].mag4 = data_mixer[i] + ((Math.random() < 0.5)? data_total[i].magn1 : data_total[i].magn2 ) ;
            if ( i < 30 ) {
                data_filter[i]= data_total[i].mag4;
            }else if (i <60 ){
                data_filter[i] = ( (30-i)/30 + 1 ) * data_total[i].mag4;
            }else{
                data_filter[i] = 0;
            }
            
            data_total[i].mag5 = data_filter[i] + ((Math.random() < 0.5)? data_total[i].magn1 : data_total[i].magn2 );

        }


    }


    function drawGraph() {    

        // Scale the range of the data again 
            x.domain(d3.extent(data_total, function(d) { return d.freq; }));
            y.domain([0, 18]);

        // Select the section we want to apply our changes to
            var svg = d3.select("#spectrumAnalyzer").transition();

        var selectedProbe = document.getElementsByName("selectedProbe");
        if (selectedProbe[0].checked){
            document.getElementById("antennaOut").style.fill='green';
            document.getElementById("amplifierOut").style.fill='white';
            document.getElementById("mixerOut").style.fill='white';
            document.getElementById("loOut").style.fill='white';
            document.getElementById("filterOut").style.fill='white';
            
            valueline = d3.svg.line()
                .x(function(d) { return x(d.freq); })
                .y(function(d) { return y(d.mag1); });
        }else if(selectedProbe[1].checked){
            document.getElementById("antennaOut").style.fill='white';
            document.getElementById("amplifierOut").style.fill='green';
            document.getElementById("mixerOut").style.fill='white';
            document.getElementById("loOut").style.fill='white';
            document.getElementById("filterOut").style.fill='white';
            valueline = d3.svg.line()
                .x(function(d) { return x(d.freq); })
                .y(function(d) { return y(d.mag2); });
        }else if(selectedProbe[2].checked){
            document.getElementById("antennaOut").style.fill='white';
            document.getElementById("amplifierOut").style.fill='white';
            document.getElementById("mixerOut").style.fill='white';
            document.getElementById("loOut").style.fill='green';
            document.getElementById("filterOut").style.fill='white';
            valueline = d3.svg.line()
                .x(function(d) { return x(d.freq); })
                .y(function(d) { return y(d.mag3); });        
        }else if(selectedProbe[3].checked){
            document.getElementById("antennaOut").style.fill='white';
            document.getElementById("amplifierOut").style.fill='white';
            document.getElementById("mixerOut").style.fill='green';
            document.getElementById("loOut").style.fill='white';
            document.getElementById("filterOut").style.fill='white';
            valueline = d3.svg.line()
                .x(function(d) { return x(d.freq); })
                .y(function(d) { return y(d.mag4); });
        }else if(selectedProbe[4].checked){
            document.getElementById("antennaOut").style.fill='white';
            document.getElementById("amplifierOut").style.fill='white';
            document.getElementById("mixerOut").style.fill='white';
            document.getElementById("loOut").style.fill='white';
            document.getElementById("filterOut").style.fill='green';
            valueline = d3.svg.line()
                .x(function(d) { return x(d.freq); })
                .y(function(d) { return y(d.mag5); });
        }
        
        

        // Make the changes
            svg.select(".line")   // change the line
                .duration(750)
                .attr("d", valueline(data_total));
    }




