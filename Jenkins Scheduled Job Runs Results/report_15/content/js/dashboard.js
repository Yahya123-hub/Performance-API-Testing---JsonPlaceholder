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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Todos"], "isController": false}, {"data": [0.9, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [0.8, 500, 1500, "Get User Albums "], "isController": false}, {"data": [0.4, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [0.9, 500, 1500, "Options User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.8, 500, 1500, "Get Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Albums "], "isController": false}, {"data": [0.9, 500, 1500, "Post Request"], "isController": false}, {"data": [0.9, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Post"], "isController": false}, {"data": [0.8, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Post User Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 85, 2, 2.3529411764705883, 398.23529411764713, 148, 1945, 358.0, 678.2000000000005, 904.1000000000003, 1945.0, 5.335844318895166, 20.749286428907723, 1.1175602244193346], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 5, 0, 0.0, 182.4, 154, 209, 191.0, 209.0, 209.0, 209.0, 0.5459707359685521, 1.5147488875846256, 0.07784348383926622], "isController": false}, {"data": ["Post User Todos", 5, 0, 0.0, 383.8, 351, 413, 381.0, 413.0, 413.0, 413.0, 0.5157297576070139, 0.7418651689014956, 0.14353806730273336], "isController": false}, {"data": ["Get Post Comments By Id", 5, 0, 0.0, 340.4, 207, 817, 226.0, 817.0, 817.0, 817.0, 0.5423581733376722, 1.5048320723505804, 0.07785805808656036], "isController": false}, {"data": ["Get User Albums ", 5, 0, 0.0, 551.6, 148, 1945, 208.0, 1945.0, 1945.0, 1945.0, 0.5566069241901369, 1.1685484039296448, 0.078272848714238], "isController": false}, {"data": ["Get Posts By Id", 5, 2, 40.0, 357.4, 156, 647, 205.0, 647.0, 647.0, 647.0, 0.5201289919900135, 0.8301746333090607, 0.06958757021741392], "isController": false}, {"data": ["Options User Todos", 5, 0, 0.0, 414.8, 343, 510, 406.0, 510.0, 510.0, 510.0, 0.498355427090601, 0.5898503687830161, 0.07154125759992026], "isController": false}, {"data": ["Options User Albums ", 5, 0, 0.0, 385.4, 351, 415, 390.0, 415.0, 415.0, 415.0, 0.4979583706802111, 0.5886023553430932, 0.07197054576237426], "isController": false}, {"data": ["Get Posts", 5, 0, 0.0, 632.2, 299, 1219, 376.0, 1219.0, 1219.0, 1219.0, 0.604960677555959, 17.039331896551722, 0.07975555807622504], "isController": false}, {"data": ["Get User Todos", 5, 0, 0.0, 209.0, 151, 258, 201.0, 258.0, 258.0, 258.0, 0.5654189754608164, 1.9908932206264842, 0.07895987645595386], "isController": false}, {"data": ["Post User Albums ", 5, 0, 0.0, 390.2, 348, 443, 402.0, 443.0, 443.0, 443.0, 0.5119803399549457, 0.7370716964468564, 0.13099496979315994], "isController": false}, {"data": ["Post Request", 5, 0, 0.0, 533.8, 353, 1234, 358.0, 1234.0, 1234.0, 1234.0, 0.5087505087505088, 0.7431533310439561, 0.12221936050061051], "isController": false}, {"data": ["Get Albums Photos", 5, 0, 0.0, 267.8, 175, 595, 186.0, 595.0, 595.0, 595.0, 0.5446623093681918, 6.418717660675381, 0.07712503404139434], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 367.2, 347, 407, 362.0, 407.0, 407.0, 407.0, 0.5085952598921778, 0.6466709261519683, 0.11075853804292544], "isController": false}, {"data": ["Options Albums Photos", 5, 0, 0.0, 520.8, 330, 810, 389.0, 810.0, 810.0, 810.0, 0.498603909054647, 0.5897549361786996, 0.07255076411049062], "isController": false}, {"data": ["Post Albums Photos", 5, 0, 0.0, 374.2, 346, 408, 363.0, 408.0, 408.0, 408.0, 0.5090612909794339, 0.7352555169517411, 0.20581188912645085], "isController": false}, {"data": ["Post User Posts", 5, 0, 0.0, 468.8, 342, 832, 411.0, 832.0, 832.0, 832.0, 0.5125576627370579, 0.734499135058944, 0.24877066248077906], "isController": false}, {"data": ["Put Post request", 5, 0, 0.0, 390.2, 361, 413, 406.0, 413.0, 413.0, 413.0, 0.5057145746940427, 0.6850852129058359, 0.13729360523920298], "isController": false}]}, function(index, item){
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
