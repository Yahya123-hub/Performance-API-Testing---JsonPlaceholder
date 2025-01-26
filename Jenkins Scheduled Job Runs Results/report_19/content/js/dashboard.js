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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9294117647058824, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Albums "], "isController": false}, {"data": [0.8, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Todos"], "isController": false}, {"data": [0.9, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.6, 500, 1500, "Get Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Todos"], "isController": false}, {"data": [0.9, 500, 1500, "Post User Albums "], "isController": false}, {"data": [1.0, 500, 1500, "Post Request"], "isController": false}, {"data": [0.8, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Delete Post"], "isController": false}, {"data": [1.0, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 85, 1, 1.1764705882352942, 384.38823529411764, 156, 1444, 362.0, 546.0000000000002, 860.9000000000001, 1444.0, 5.778382053025153, 22.463128292828006, 1.2102470683208701], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 5, 0, 0.0, 188.2, 156, 209, 202.0, 209.0, 209.0, 209.0, 0.6998880179171333, 1.9419158559630458, 0.09978872130459127], "isController": false}, {"data": ["Post User Todos", 5, 0, 0.0, 404.2, 367, 436, 411.0, 436.0, 436.0, 436.0, 0.6851192107426691, 0.9851264901342833, 0.19068259283365305], "isController": false}, {"data": ["Get Post Comments By Id", 5, 0, 0.0, 237.0, 196, 357, 204.0, 357.0, 357.0, 357.0, 0.6972528238739367, 1.9343318574815227, 0.10009391123971552], "isController": false}, {"data": ["Get User Albums ", 5, 0, 0.0, 196.8, 194, 199, 197.0, 199.0, 199.0, 199.0, 0.6432522835456066, 1.350075984175994, 0.09045735237360093], "isController": false}, {"data": ["Get Posts By Id", 5, 1, 20.0, 211.8, 185, 252, 205.0, 252.0, 252.0, 252.0, 0.6974473427256243, 1.1130551244943507, 0.09331082612637746], "isController": false}, {"data": ["Options User Todos", 5, 0, 0.0, 417.0, 402, 458, 407.0, 458.0, 458.0, 458.0, 0.6111722283339445, 0.7230215209020903, 0.08773663824715806], "isController": false}, {"data": ["Options User Albums ", 5, 0, 0.0, 454.6, 331, 758, 401.0, 758.0, 758.0, 758.0, 0.6109481915933529, 0.7194153607649072, 0.08830110581622679], "isController": false}, {"data": ["Get Posts", 5, 0, 0.0, 810.4, 325, 1444, 835.0, 1444.0, 1444.0, 1444.0, 0.5937537109606934, 16.724024202885644, 0.07827807712860706], "isController": false}, {"data": ["Get User Todos", 5, 0, 0.0, 220.0, 203, 274, 207.0, 274.0, 274.0, 274.0, 0.6448284756254836, 2.2706274584085633, 0.09004928907660563], "isController": false}, {"data": ["Post User Albums ", 5, 0, 0.0, 424.8, 383, 513, 409.0, 513.0, 513.0, 513.0, 0.6779661016949153, 0.9755031779661016, 0.17346398305084745], "isController": false}, {"data": ["Post Request", 5, 0, 0.0, 367.2, 332, 407, 348.0, 407.0, 407.0, 407.0, 0.6075334143377885, 0.8849578523693803, 0.14595041008505466], "isController": false}, {"data": ["Get Albums Photos", 5, 0, 0.0, 498.0, 180, 919, 414.0, 919.0, 919.0, 919.0, 0.6333924499619965, 7.464134152520902, 0.08968936059032176], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 395.8, 337, 526, 355.0, 526.0, 526.0, 526.0, 0.6116207951070336, 0.7763522553516818, 0.13319476299694188], "isController": false}, {"data": ["Options Albums Photos", 5, 0, 0.0, 362.2, 344, 391, 355.0, 391.0, 391.0, 391.0, 0.6144015728680265, 0.7238418530351438, 0.0894002288645859], "isController": false}, {"data": ["Post Albums Photos", 5, 0, 0.0, 574.0, 349, 1330, 405.0, 1330.0, 1330.0, 1330.0, 0.602918123718799, 0.8679901347522008, 0.24375791330037383], "isController": false}, {"data": ["Post User Posts", 5, 0, 0.0, 382.6, 345, 418, 399.0, 418.0, 418.0, 418.0, 0.6821282401091405, 0.9792270634379263, 0.3310720071623465], "isController": false}, {"data": ["Put Post request", 5, 0, 0.0, 390.0, 338, 424, 407.0, 424.0, 424.0, 424.0, 0.6102770657878677, 0.826377128341267, 0.16568068778225314], "isController": false}]}, function(index, item){
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
