/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 95.29411764705883, "KoPercent": 4.705882352941177};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.888235294117647, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [0.8, 500, 1500, "Post User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Albums "], "isController": false}, {"data": [0.6, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Todos"], "isController": false}, {"data": [0.9, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.9, 500, 1500, "Get Posts"], "isController": false}, {"data": [0.6, 500, 1500, "Get User Todos"], "isController": false}, {"data": [0.8, 500, 1500, "Post User Albums "], "isController": false}, {"data": [1.0, 500, 1500, "Post Request"], "isController": false}, {"data": [1.0, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Delete Post"], "isController": false}, {"data": [1.0, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Post User Posts"], "isController": false}, {"data": [0.9, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 85, 4, 4.705882352941177, 410.28235294117644, 150, 1493, 362.0, 837.6000000000003, 1004.6000000000001, 1493.0, 5.782706306551466, 22.47562015273148, 1.2111527569902714], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 5, 0, 0.0, 480.4, 153, 957, 222.0, 957.0, 957.0, 957.0, 0.6426735218508997, 1.7832935009640103, 0.09163118573264781], "isController": false}, {"data": ["Post User Todos", 5, 0, 0.0, 641.2, 335, 1078, 410.0, 1078.0, 1078.0, 1078.0, 0.6260172780768749, 0.8983103402403906, 0.17423332446475523], "isController": false}, {"data": ["Get Post Comments By Id", 5, 0, 0.0, 212.0, 150, 309, 160.0, 309.0, 309.0, 309.0, 0.6355662895640015, 1.7635723194991737, 0.09123852008389476], "isController": false}, {"data": ["Get User Albums ", 5, 0, 0.0, 224.2, 196, 310, 200.0, 310.0, 310.0, 310.0, 0.7087172218284905, 1.4880293231750532, 0.09966335931963147], "isController": false}, {"data": ["Get Posts By Id", 5, 2, 40.0, 197.8, 162, 214, 202.0, 214.0, 214.0, 214.0, 0.6424257998201208, 1.0252463301426185, 0.08594954548374663], "isController": false}, {"data": ["Options User Todos", 5, 0, 0.0, 393.0, 347, 451, 404.0, 451.0, 451.0, 451.0, 0.6173601679219657, 0.7278097604642548, 0.0886249459809853], "isController": false}, {"data": ["Options User Albums ", 5, 0, 0.0, 472.8, 350, 763, 413.0, 763.0, 763.0, 763.0, 0.5871301080319399, 0.692630049318929, 0.08485864842649131], "isController": false}, {"data": ["Get Posts", 5, 0, 0.0, 641.2, 312, 1493, 482.0, 1493.0, 1493.0, 1493.0, 0.606501698204755, 17.083091680312954, 0.07995871997816593], "isController": false}, {"data": ["Get User Todos", 5, 2, 40.0, 554.4, 162, 1099, 337.0, 1099.0, 1099.0, 1099.0, 0.6315523556902868, 2.2237550524188454, 0.08819529967159277], "isController": false}, {"data": ["Post User Albums ", 5, 0, 0.0, 495.4, 341, 895, 376.0, 895.0, 895.0, 895.0, 0.6246096189881324, 0.8955584400374765, 0.15981222673329168], "isController": false}, {"data": ["Post Request", 5, 0, 0.0, 407.4, 372, 448, 406.0, 448.0, 448.0, 448.0, 0.6260172780768749, 0.912249006197571, 0.15039086953799924], "isController": false}, {"data": ["Get Albums Photos", 5, 0, 0.0, 199.4, 160, 306, 164.0, 306.0, 306.0, 306.0, 0.6317917614354309, 7.44514764183725, 0.08946270059388425], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 458.6, 344, 818, 362.0, 818.0, 818.0, 818.0, 0.623208276205908, 0.791790983734264, 0.13571820858781006], "isController": false}, {"data": ["Options Albums Photos", 5, 0, 0.0, 395.0, 354, 407, 406.0, 407.0, 407.0, 407.0, 0.5885122410546139, 0.693340983992467, 0.08563312882532956], "isController": false}, {"data": ["Post Albums Photos", 5, 0, 0.0, 376.0, 336, 416, 366.0, 416.0, 416.0, 416.0, 0.6257822277847309, 0.8994397293491865, 0.25300179912390486], "isController": false}, {"data": ["Post User Posts", 5, 0, 0.0, 401.8, 336, 508, 404.0, 508.0, 508.0, 508.0, 0.6261740763932373, 0.8990245381966186, 0.3039145663744521], "isController": false}, {"data": ["Put Post request", 5, 0, 0.0, 424.2, 346, 508, 409.0, 508.0, 508.0, 508.0, 0.6181998021760633, 0.8349319593842731, 0.1678315869188922], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 1,099 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 25.0, 1.1764705882352942], "isController": false}, {"data": ["The operation lasted too long: It took 867 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 25.0, 1.1764705882352942], "isController": false}, {"data": ["The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 2, 50.0, 2.3529411764705883], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 85, 4, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 2, "The operation lasted too long: It took 1,099 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 867 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Posts By Id", 5, 2, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get User Todos", 5, 2, "The operation lasted too long: It took 1,099 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 867 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
