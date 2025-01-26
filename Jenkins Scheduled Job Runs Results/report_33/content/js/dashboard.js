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

    var data = {"OkPercent": 97.6470588235294, "KoPercent": 2.3529411764705883};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.888235294117647, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Albums "], "isController": false}, {"data": [0.6, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Todos"], "isController": false}, {"data": [0.9, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.0, 500, 1500, "Get Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Albums "], "isController": false}, {"data": [0.9, 500, 1500, "Post Request"], "isController": false}, {"data": [1.0, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Delete Post"], "isController": false}, {"data": [1.0, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Post User Posts"], "isController": false}, {"data": [0.9, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 85, 2, 2.3529411764705883, 1574.8235294117649, 145, 22412, 349.0, 709.6000000000003, 21346.7, 22412.0, 2.4717206083340604, 9.610631306522434, 0.5176868875221727], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 5, 0, 0.0, 169.6, 153, 213, 160.0, 213.0, 213.0, 213.0, 0.7189072609633358, 1.9946868260244428, 0.1025004493170381], "isController": false}, {"data": ["Post User Todos", 5, 0, 0.0, 371.0, 335, 461, 353.0, 461.0, 461.0, 461.0, 0.6854009595613434, 0.9843268077450309, 0.19076100925291295], "isController": false}, {"data": ["Get Post Comments By Id", 5, 0, 0.0, 183.4, 146, 303, 156.0, 303.0, 303.0, 303.0, 0.724952878062926, 2.0116026442656225, 0.10407038386254894], "isController": false}, {"data": ["Get User Albums ", 5, 0, 0.0, 168.6, 145, 199, 155.0, 199.0, 199.0, 199.0, 0.7182876023559833, 1.5079830933055596, 0.10100919408131015], "isController": false}, {"data": ["Get Posts By Id", 5, 2, 40.0, 163.6, 145, 206, 155.0, 206.0, 206.0, 206.0, 0.7138777841233581, 1.139415869503141, 0.09550903947744147], "isController": false}, {"data": ["Options User Todos", 5, 0, 0.0, 366.8, 336, 409, 366.0, 409.0, 409.0, 409.0, 0.6614631565021828, 0.7821285057547295, 0.09495613672443445], "isController": false}, {"data": ["Options User Albums ", 5, 0, 0.0, 449.0, 335, 733, 414.0, 733.0, 733.0, 733.0, 0.6555657532450505, 0.7751552871377999, 0.0947497377736987], "isController": false}, {"data": ["Get Posts", 5, 0, 0.0, 21561.4, 21346, 22412, 21350.0, 22412.0, 22412.0, 22412.0, 0.17105713308244952, 4.818031292764283, 0.022551477505987], "isController": false}, {"data": ["Get User Todos", 5, 0, 0.0, 168.2, 154, 196, 164.0, 196.0, 196.0, 196.0, 0.7250580046403712, 2.5532804343097446, 0.1012532174448956], "isController": false}, {"data": ["Post User Albums ", 5, 0, 0.0, 364.6, 338, 408, 350.0, 408.0, 408.0, 408.0, 0.6799020940984498, 0.9765625, 0.17395932485722057], "isController": false}, {"data": ["Post Request", 5, 0, 0.0, 505.4, 341, 940, 414.0, 940.0, 940.0, 940.0, 0.6790710308298248, 0.9914171787994024, 0.16313620467200868], "isController": false}, {"data": ["Get Albums Photos", 5, 0, 0.0, 229.0, 159, 408, 171.0, 408.0, 408.0, 408.0, 0.7236937328122738, 8.52870237190621, 0.1024761633376755], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 393.0, 337, 520, 352.0, 520.0, 520.0, 520.0, 0.6647168306301515, 0.8459560289816538, 0.1447576691704334], "isController": false}, {"data": ["Options Albums Photos", 5, 0, 0.0, 365.8, 347, 395, 364.0, 395.0, 395.0, 395.0, 0.6512960791976032, 0.7704883499413834, 0.09476866777387001], "isController": false}, {"data": ["Post Albums Photos", 5, 0, 0.0, 361.4, 347, 382, 362.0, 382.0, 382.0, 382.0, 0.6781500067815001, 0.9766949511731995, 0.2741739285229893], "isController": false}, {"data": ["Post User Posts", 5, 0, 0.0, 505.6, 339, 1100, 366.0, 1100.0, 1100.0, 1100.0, 0.6942515967786727, 0.9989358424743127, 0.3369560972646487], "isController": false}, {"data": ["Put Post request", 5, 0, 0.0, 445.6, 339, 694, 405.0, 694.0, 694.0, 694.0, 0.6600660066006601, 0.8913469471947194, 0.17919760726072606], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 2, 100.0, 2.3529411764705883], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 85, 2, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 2, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Posts By Id", 5, 2, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
