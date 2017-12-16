/////////////////////////////////////////
// Global submit form function
var submitForm;

define(['methods', 'chart'], function(methods, Chart) {
    /////////////////////////////////////////
    // BASIC SETUP
    // Crypto buttons event listeners
    methods.addCryptoListeners();
    // print oldest data point
    methods.printOldest(methods.selected);



    //////////////////////////////////////////
    // HANDLE SUBMIT FORM
    submitForm = function() {
        // build request url
        var url = methods.buildUrl(methods.selected);
        var request = new XMLHttpRequest();
        request.open("GET", url);
        request.onload = function() {
            if (this.status == 200) {
                var rawData = JSON.parse(request.responseText);
                // create monthly savings data
                var savings = methods.createSavings(rawData);
                var latestPrice = rawData.latestPrice;
                // add titles for summary and historical performance
                document.getElementById("summary-title").innerHTML = methods.summaryTitle;
                document.getElementById("performance-title").innerHTML = methods.performanceTitle;
                // print total savings summary
                var summary = methods.buildSummary(savings, methods.selected, latestPrice);
                document.getElementById("summary").innerHTML = summary;
                // print chart
                methods.printChart(rawData, savings, latestPrice);
                // print main table
                var table = methods.buildTable(savings, latestPrice);
                document.getElementById("table").innerHTML = table;
                // add disclaimer
                document.getElementById("disclaimer").innerHTML = methods.disclaimer;
            } else {
                document.getElementById("summary-title").innerHTML = methods.errorTitle;
            }
        };
        request.send();
    }
    // run at refresh to plot default data
    submitForm();
});
