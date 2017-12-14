/////////////////////////////////////////
// Global submit form function
var submitForm;

define(['methods', 'chart'], function(methods, Chart) {
    /////////////////////////////////////////
    // BASIC SETUP
    var selectedCrypto = "bitcoin";
    var cryptoButtons = document.querySelectorAll(".crypto-btn");
    // print oldest data point
    methods.printOldest(selectedCrypto);
    // Crypto buttons event listeners
    for (var i = 0; i < cryptoButtons.length; i++) {
        cryptoButtons[i].addEventListener("click", function() {
            // deselect all buttons
            for (var j = 0; j < cryptoButtons.length; j++) {
                cryptoButtons[j].classList.remove("selected");
            }
            // update selected crypto
            selectedCrypto = this.classList[0];
            // select clicked button
            this.classList.add("selected");
            // print oldest data point message
            methods.printOldest(selectedCrypto);
            
        });
    }
    
    //////////////////////////////////////////
    // HANDLE SUBMIT FORM
    submitForm = function() {
        // build request url
        var url = methods.buildUrl(selectedCrypto);
        var request = new XMLHttpRequest();
        request.open("GET", url);
        request.onload = function() {
            if (this.status == 200) {
                var dbData = JSON.parse(request.responseText);
                // print total savings
                var summary = methods.buildSummary(dbData, selectedCrypto);
                document.getElementById("summary").innerHTML = summary;
                // print table
                var table = methods.buildTable(dbData);
                document.getElementById("table").innerHTML = table;
                // add title for summary and historical performance
                document.getElementById("summary-title").innerHTML = methods.summaryTitle;
                document.getElementById("performance-title").innerHTML = methods.performanceTitle;
                // add disclaimer
                document.getElementById("disclaimer").innerHTML = methods.disclaimer;
                // print chart
                var cryptoChart = document.getElementById('cryptoChart').getContext('2d');
                var chartData = methods.buildChartData(dbData);
                Chart.defaults.global.defaultFontFamily = 'Lato';
                Chart.defaults.global.defaultFontSize = 16;
                Chart.defaults.global.defaultFontColor = '#333';
                var massPopChart = new Chart(cryptoChart, chartData);
            } else {
                document.getElementById("summary-title").innerHTML = methods.errorTitle;
            }
        };
        request.send();
    }
    // run at refresh to plot default data
    submitForm();
});


