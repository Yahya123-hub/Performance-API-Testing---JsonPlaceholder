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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9411764705882353, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [0.9, 500, 1500, "Post User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Albums "], "isController": false}, {"data": [0.8, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Todos"], "isController": false}, {"data": [0.9, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.9, 500, 1500, "Get Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Albums "], "isController": false}, {"data": [1.0, 500, 1500, "Post Request"], "isController": false}, {"data": [0.9, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Delete Post"], "isController": false}, {"data": [1.0, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Posts"], "isController": false}, {"data": [0.9, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 85, 1, 1.1764705882352942, 368.3294117647057, 162, 1020, 402.0, 498.0000000000001, 730.3000000000004, 1020.0, 6.082725060827251, 23.654840015385716, 1.2739898651066266], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 5, 0, 0.0, 267.4, 195, 535, 202.0, 535.0, 535.0, 535.0, 0.6099792607051361, 1.6925733118823962, 0.08696969928022448], "isController": false}, {"data": ["Post User Todos", 5, 0, 0.0, 421.4, 366, 514, 408.0, 514.0, 514.0, 514.0, 0.6181233774261342, 0.8892767183829892, 0.17203629156879713], "isController": false}, {"data": ["Get Post Comments By Id", 5, 0, 0.0, 201.2, 193, 207, 202.0, 207.0, 207.0, 207.0, 0.6105751618024179, 1.69422682104042, 0.08765092654780804], "isController": false}, {"data": ["Get User Albums ", 5, 0, 0.0, 231.8, 162, 313, 194.0, 313.0, 313.0, 313.0, 0.6350819255683983, 1.333548004255049, 0.08930839578305601], "isController": false}, {"data": ["Get Posts By Id", 5, 1, 20.0, 212.2, 185, 264, 205.0, 264.0, 264.0, 264.0, 0.6354855109303508, 1.0140462156837824, 0.08502101073970512], "isController": false}, {"data": ["Options User Todos", 5, 0, 0.0, 405.2, 400, 407, 407.0, 407.0, 407.0, 407.0, 0.6099792607051361, 0.7206571382822985, 0.08756538215200683], "isController": false}, {"data": ["Options User Albums ", 5, 0, 0.0, 416.6, 344, 513, 409.0, 513.0, 513.0, 513.0, 0.6025548324897565, 0.7123563283321283, 0.08708800313328513], "isController": false}, {"data": ["Get Posts", 5, 0, 0.0, 486.4, 290, 811, 442.0, 811.0, 811.0, 811.0, 0.6107243190423843, 17.201789994808845, 0.08051541315500184], "isController": false}, {"data": ["Get User Todos", 5, 0, 0.0, 239.8, 198, 308, 225.0, 308.0, 308.0, 308.0, 0.6374298827129016, 2.2446993721315653, 0.08901608713666496], "isController": false}, {"data": ["Post User Albums ", 5, 0, 0.0, 380.4, 337, 408, 402.0, 408.0, 408.0, 408.0, 0.6263309532757109, 0.9002284150695228, 0.1602526462482776], "isController": false}, {"data": ["Post Request", 5, 0, 0.0, 399.0, 350, 415, 410.0, 415.0, 415.0, 415.0, 0.6183527083848628, 0.9040992919861489, 0.14854957642839475], "isController": false}, {"data": ["Get Albums Photos", 5, 0, 0.0, 345.0, 204, 619, 209.0, 619.0, 619.0, 619.0, 0.6100536847242557, 7.189458844253295, 0.086384554965837], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 456.2, 333, 778, 404.0, 778.0, 778.0, 778.0, 0.6138735420503376, 0.7830484576427257, 0.13368535144260282], "isController": false}, {"data": ["Options Albums Photos", 5, 0, 0.0, 400.0, 371, 413, 406.0, 413.0, 413.0, 413.0, 0.602918123718799, 0.7118437613047148, 0.08772929729892681], "isController": false}, {"data": ["Post Albums Photos", 5, 0, 0.0, 515.0, 362, 1020, 408.0, 1020.0, 1020.0, 1020.0, 0.6217358865953743, 0.8955668288361105, 0.25136587602586424], "isController": false}, {"data": ["Post User Posts", 5, 0, 0.0, 408.0, 358, 460, 406.0, 460.0, 460.0, 460.0, 0.6181998021760633, 0.8898696371167162, 0.3000442399233433], "isController": false}, {"data": ["Put Post request", 5, 0, 0.0, 476.0, 353, 820, 411.0, 820.0, 820.0, 820.0, 0.60960741282614, 0.8259466060107291, 0.1654988874664716], "isController": false}]}, function(index, item){
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
