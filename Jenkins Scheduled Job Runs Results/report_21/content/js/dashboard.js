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

    var data = {"OkPercent": 98.82352941176471, "KoPercent": 1.1764705882352942};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9294117647058824, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [0.9, 500, 1500, "Post User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Albums "], "isController": false}, {"data": [0.8, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.7, 500, 1500, "Get Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Albums "], "isController": false}, {"data": [1.0, 500, 1500, "Post Request"], "isController": false}, {"data": [0.9, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Post"], "isController": false}, {"data": [0.8, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [0.8, 500, 1500, "Post User Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 85, 1, 1.1764705882352942, 381.3176470588234, 143, 1489, 372.0, 576.8000000000005, 787.9000000000003, 1489.0, 5.459216441875401, 21.225463631984585, 1.1433997671804752], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 5, 0, 0.0, 197.4, 146, 221, 203.0, 221.0, 221.0, 221.0, 0.61020258725897, 1.6929546390651695, 0.08700154076153283], "isController": false}, {"data": ["Post User Todos", 5, 0, 0.0, 631.2, 351, 1489, 421.0, 1489.0, 1489.0, 1489.0, 0.5216484089723527, 0.7482394366197183, 0.14518534820031298], "isController": false}, {"data": ["Get Post Comments By Id", 5, 0, 0.0, 229.6, 143, 401, 204.0, 401.0, 401.0, 401.0, 0.6099048548426446, 1.6920094840204927, 0.08755470084166869], "isController": false}, {"data": ["Get User Albums ", 5, 0, 0.0, 200.6, 148, 254, 204.0, 254.0, 254.0, 254.0, 0.6119202056051891, 1.2847934004405825, 0.08605127891322972], "isController": false}, {"data": ["Get Posts By Id", 5, 1, 20.0, 170.8, 146, 207, 173.0, 207.0, 207.0, 207.0, 0.6133464180569186, 0.9787187960009814, 0.08205904225956821], "isController": false}, {"data": ["Options User Todos", 5, 0, 0.0, 425.8, 406, 462, 409.0, 462.0, 462.0, 462.0, 0.5192647211548448, 0.6130771951916087, 0.07454288477515839], "isController": false}, {"data": ["Options User Albums ", 5, 0, 0.0, 386.2, 342, 426, 409.0, 426.0, 426.0, 426.0, 0.5196424859696529, 0.6151470913011848, 0.0751045780503014], "isController": false}, {"data": ["Get Posts", 5, 0, 0.0, 542.2, 375, 642, 632.0, 642.0, 642.0, 642.0, 0.584385226741468, 16.459917565158953, 0.0770429742286115], "isController": false}, {"data": ["Get User Todos", 5, 0, 0.0, 270.2, 176, 408, 264.0, 408.0, 408.0, 408.0, 0.6055468087683178, 2.1323053545476567, 0.08456366567760688], "isController": false}, {"data": ["Post User Albums ", 5, 0, 0.0, 397.4, 345, 455, 407.0, 455.0, 455.0, 455.0, 0.5192107995846313, 0.7457570742471443, 0.13284495067497404], "isController": false}, {"data": ["Post Request", 5, 0, 0.0, 369.6, 349, 410, 364.0, 410.0, 410.0, 410.0, 0.5223023085762039, 0.7632550532748354, 0.12547496866186147], "isController": false}, {"data": ["Get Albums Photos", 5, 0, 0.0, 307.8, 202, 713, 208.0, 713.0, 713.0, 713.0, 0.6096817461285209, 7.184718327033289, 0.08633188787952688], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 362.0, 342, 407, 354.0, 407.0, 407.0, 407.0, 0.522029651284193, 0.6634466681457507, 0.113684191637085], "isController": false}, {"data": ["Options Albums Photos", 5, 0, 0.0, 555.0, 354, 823, 409.0, 823.0, 823.0, 823.0, 0.49910161708923934, 0.5916108816630066, 0.07262318451786784], "isController": false}, {"data": ["Post Albums Photos", 5, 0, 0.0, 587.6, 407, 1289, 409.0, 1289.0, 1289.0, 1289.0, 0.5192647211548448, 0.7491813467130544, 0.20993710406065014], "isController": false}, {"data": ["Post User Posts", 5, 0, 0.0, 437.8, 347, 540, 422.0, 540.0, 540.0, 540.0, 0.5869233478107759, 0.8424413443479282, 0.28486416392769104], "isController": false}, {"data": ["Put Post request", 5, 0, 0.0, 411.2, 349, 475, 419.0, 475.0, 475.0, 475.0, 0.5184570717544588, 0.6996132634280382, 0.14075299408958938], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 1, 100.0, 1.1764705882352942], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 85, 1, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Posts By Id", 5, 1, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
