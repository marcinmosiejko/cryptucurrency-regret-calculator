define([""], function(){
    var methods = {};

    methods.createSavings = function(rawData) {
      // var setup
      var savingsData = [];
      var spent = 0;
      var amount = 0;
      var value = 0;
      var saving = Number(rawData.userData.saving);
      var startingDate = rawData.data[0].date;
      // loop through data to create final array
      rawData.data.forEach(function(data) {
        if (data.date === startingDate) {
          // update total amount, current value and spent amount
          spent += saving;
          amount += saving / data.avgPrice;
          value = amount * data.avgPrice;
          // create saving obj
          var savingObj = {
              date: data.date,
              avgPrice: data.avgPrice,
              amount: amount.toFixed(6),
              value: value.toFixed(2),
              spent: spent.toFixed(2)
          }
          // add obj to final array
          savingsData.push(savingObj);
          startingDate = methods.addMonths(new Date(data.date), 1).toDateString().substr(4);
        }
      });

      return savingsData;
    }

    methods.addMonths = function(date, months) {
      var d = date.getDate();
      date.setMonth(date.getMonth() + +months);
      if (date.getDate() != d) {
        date.setDate(0);
      }

      return date;
    }

    methods.buildSummary = function(savings, selected, latestPrice) {
        var lastData = savings[savings.length - 1];
        var summary = "\
        <table class=\"table\">\
          <thead class=\"thead-dark\">\
              <tr>\
                  <th>Spent</th>\
                  <th>Crypto Amount</th>\
                  <th>Current Price</th>\
                  <th>Profit</th>\
              </tr>\
          </thead>\
          <tbody>\
              <tr>\
                  <td>$"+Number(lastData.spent).formatMoney(2)+"</td>\
                  <td>"+lastData.amount+"</td>\
                  <td id=\"latest-price\">$"+Number(latestPrice).formatMoney(2)+"</td>\
                  <td  id=\"latest-value\"><strong>$"+(Number(latestPrice) * Number(lastData.amount) - Number(lastData.spent)).formatMoney(2)+"</strong></td>\
              </tr>\
          </tbody>\
        </table>";

        return summary;
    }

    methods.buildUrl = function(selectedCrypto) {
        var sInput = document.getElementById("saving");
        var yInput = document.getElementById("year");
        var mInput = document.getElementById("month");
        var dInput = document.getElementById("day");
        var saving = sInput.value;
        var crypto = selectedCrypto;
        var year = yInput.options[yInput.selectedIndex].value;
        var month = mInput.options[mInput.selectedIndex].value;
        var day = dInput.options[dInput.selectedIndex].value;

        var url = "/api/calculator?saving="+saving+"&crypto="+crypto+"&year="+year+"&month="+month+"&day="+day;
        return url;
    }

    methods.buildTable = function(savings, latestPrice) {
        var table = "\
        <table class=\"table table-striped\">\
          <thead class=\"thead-dark\">\
              <tr>\
                  <th>Date</th>\
                  <th>Spent</th>\
                  <th>Amount</th>\
                  <th>Price</th>\
                  <th>Value</th>\
              </tr>\
          </thead>\
          <tbody>";

        savings.forEach(function(obj) {
            var tableRow = "\
            <tr>\
                <td>"+obj.date+"</td>\
                <td>$"+Number(obj.spent).formatMoney(2)+"</td>\
                <td>"+obj.amount+"</td>\
                <td>$"+Number(obj.avgPrice).formatMoney(2)+"</td>\
                <td>$"+Number(obj.value).formatMoney(2)+"</td>\
            </tr>";
            table += tableRow;
        });
        var latestObj = savings[savings.length - 1];
        table += "\
          <tr>\
            <td>"+new Date().toDateString().substr(4)+"</td>\
            <td>$"+Number(latestObj.spent).formatMoney(2)+"</td>\
            <td>"+Number(latestObj.amount)+"</td>\
            <td>$"+Number(latestPrice).formatMoney(2)+"</td>\
            <td>$"+(Number(latestObj.amount) * Number(latestPrice)).formatMoney(2)+"</td>\
          </tr>\
        </tbody>\
        </table>";

        return table;
    }

    methods.buildChartData = function(savings, userData, latestPrice) {
        var data = {
          type:'line',
          data:{
            labels:[],
            datasets:[{
              label: "",
              data:[],
              backgroundColor: 'rgb(19, 153, 7)',
              borderWidth:1,
              borderColor:'#777',
              hoverBorderWidth:3,
              hoverBorderColor:'#000'
            }]
          },
          options:{
            title:{
              display:false,
              text:'Savings Growth Progress',
              fontSize: 25
            },
            legend:{
              display:false,
              position:'right',
              labels:{
                fontColor:'#000'
              }
            },
            layout:{
              padding:{
                left:50,
                right:0,
                bottom:0,
                top:0
              }
            },
            tooltips:{
              enabled:true
            }
          }
        }
        savings.forEach(function(obj) {
            data.data.labels.push(obj.date);
            data.data.datasets[0].data.push(Number(obj.value));
        });
        data.data.datasets[0].label = (userData.crypto).toUpperCase();
        data.data.labels.push(new Date().toDateString());
        data.data.datasets[0].data.push((Number(savings[savings.length - 1].amount) * Number(latestPrice)).toFixed(2));

        return data;
    }

    methods.buildOldest = function(data) {
      var oldest = "oldest data point: " + data;

      return oldest;
    }

    methods.printOldest = function(selected) {
      var url = this.buildUrl(selected);
      var requestOldest = new XMLHttpRequest();
      requestOldest.open("GET", url);
      requestOldest.onload = function() {
          if (this.status == 200) {
              var data = JSON.parse(requestOldest.responseText);
              document.getElementById("oldest").innerHTML = methods.buildOldest(data.oldestDataPoint);
          }
      };
      requestOldest.send();
    }

    methods.disclaimer = "Data does not include transaction fees. All calculations rounded. Price data from CoinMarketCap website. Past performance is not a guarantee of future results."
    methods.performanceTitle = "<h3>HISTORICAL PERFORMANCE</h3>";
    methods.summaryTitle = "<h3>SUMMARY</h3>";
    methods.errorTitle = "<h3>SORRY, SOMETHING WENT WRONG</h3>";

    return methods;
});


// FORMATS MONEY VALUES TO HAVE COMAS
Number.prototype.formatMoney = function(c, d, t){
var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;

   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };
