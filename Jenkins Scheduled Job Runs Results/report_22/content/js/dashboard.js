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

    var data = {"OkPercent": 94.11764705882354, "KoPercent": 5.882352941176471};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9058823529411765, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [0.9, 500, 1500, "Get User Albums "], "isController": false}, {"data": [0.2, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.8, 500, 1500, "Get Posts"], "isController": false}, {"data": [0.8, 500, 1500, "Get User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Albums "], "isController": false}, {"data": [1.0, 500, 1500, "Post Request"], "isController": false}, {"data": [1.0, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Delete Post"], "isController": false}, {"data": [1.0, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Posts"], "isController": false}, {"data": [0.9, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 85, 5, 5.882352941176471, 371.63529411764716, 149, 1045, 385.0, 447.4000000000001, 817.1, 1045.0, 5.888873493141195, 22.90767729406263, 1.2333888301926008], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 5, 0, 0.0, 184.2, 156, 204, 197.0, 204.0, 204.0, 204.0, 0.5881660981061052, 1.6322757984354783, 0.08385961945653453], "isController": false}, {"data": ["Post User Todos", 5, 0, 0.0, 391.2, 340, 420, 412.0, 420.0, 420.0, 420.0, 0.5668291576918716, 0.8184703052375014, 0.1577600683029135], "isController": false}, {"data": ["Get Post Comments By Id", 5, 0, 0.0, 254.0, 202, 404, 209.0, 404.0, 404.0, 404.0, 0.5878203620973431, 1.631201504820127, 0.08438436838702093], "isController": false}, {"data": ["Get User Albums ", 5, 0, 0.0, 377.8, 166, 1040, 210.0, 1040.0, 1040.0, 1040.0, 0.5752416014726185, 1.2077826593419236, 0.08089335020708698], "isController": false}, {"data": ["Get Posts By Id", 5, 4, 80.0, 215.4, 149, 303, 201.0, 303.0, 303.0, 303.0, 0.5898313082458417, 0.9416564675002949, 0.07891297776335968], "isController": false}, {"data": ["Options User Todos", 5, 0, 0.0, 412.6, 398, 443, 407.0, 443.0, 443.0, 443.0, 0.5616715344866322, 0.6634745001123343, 0.08063058161087397], "isController": false}, {"data": ["Options User Albums ", 5, 0, 0.0, 389.4, 351, 411, 408.0, 411.0, 411.0, 411.0, 0.5641430666817105, 0.6677162078303058, 0.08153630260634097], "isController": false}, {"data": ["Get Posts", 5, 0, 0.0, 554.8, 338, 1045, 385.0, 1045.0, 1045.0, 1045.0, 0.6032090722644469, 16.990113968814093, 0.0795246335504886], "isController": false}, {"data": ["Get User Todos", 5, 1, 20.0, 364.2, 184, 915, 238.0, 915.0, 915.0, 915.0, 0.5834986579530866, 2.0547814068152643, 0.08148467586649549], "isController": false}, {"data": ["Post User Albums ", 5, 0, 0.0, 396.6, 378, 408, 398.0, 408.0, 408.0, 408.0, 0.5625562556255626, 0.8106523542979298, 0.14393529196669666], "isController": false}, {"data": ["Post Request", 5, 0, 0.0, 382.6, 342, 411, 397.0, 411.0, 411.0, 411.0, 0.5677946854417443, 0.8310651118555531, 0.13640380138541905], "isController": false}, {"data": ["Get Albums Photos", 5, 0, 0.0, 204.8, 199, 210, 205.0, 210.0, 210.0, 210.0, 0.5880969183721477, 6.930469485121147, 0.08327544254293107], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 473.6, 353, 818, 407.0, 818.0, 818.0, 818.0, 0.5635072692437733, 0.7186918883128592, 0.12271691507945454], "isController": false}, {"data": ["Options Albums Photos", 5, 0, 0.0, 400.4, 372, 416, 405.0, 416.0, 416.0, 416.0, 0.5609783462358353, 0.6635322001570739, 0.081626732020644], "isController": false}, {"data": ["Post Albums Photos", 5, 0, 0.0, 444.6, 407, 506, 436.0, 506.0, 506.0, 506.0, 0.5617346365576902, 0.8112238091225705, 0.2271075581395349], "isController": false}, {"data": ["Post User Posts", 5, 0, 0.0, 389.6, 347, 430, 407.0, 430.0, 430.0, 430.0, 0.5709717939933768, 0.8235599020783374, 0.27712205235811355], "isController": false}, {"data": ["Put Post request", 5, 0, 0.0, 482.0, 374, 815, 409.0, 815.0, 815.0, 815.0, 0.5617346365576902, 0.7600971800921245, 0.15250217672171668], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 915 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 20.0, 1.1764705882352942], "isController": false}, {"data": ["The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 4, 80.0, 4.705882352941177], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 85, 5, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 4, "The operation lasted too long: It took 915 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Posts By Id", 5, 4, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get User Todos", 5, 1, "The operation lasted too long: It took 915 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
