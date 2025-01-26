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

    var data = {"OkPercent": 96.47058823529412, "KoPercent": 3.5294117647058822};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9058823529411765, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [0.8, 500, 1500, "Post User Todos"], "isController": false}, {"data": [0.9, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Albums "], "isController": false}, {"data": [0.6, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.8, 500, 1500, "Get Posts"], "isController": false}, {"data": [0.8, 500, 1500, "Get User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Albums "], "isController": false}, {"data": [0.9, 500, 1500, "Post Request"], "isController": false}, {"data": [1.0, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Post"], "isController": false}, {"data": [0.8, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Post User Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 85, 3, 3.5294117647058822, 377.5764705882352, 145, 1183, 355.0, 511.4, 885.5000000000002, 1183.0, 5.9052382937335, 22.959259826142837, 1.236816338404891], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 5, 0, 0.0, 266.4, 190, 512, 200.0, 512.0, 512.0, 512.0, 0.6756756756756757, 1.874736064189189, 0.09633657094594594], "isController": false}, {"data": ["Post User Todos", 5, 0, 0.0, 534.4, 335, 991, 423.0, 991.0, 991.0, 991.0, 0.6592827004219409, 0.9473325833992616, 0.1834917672072785], "isController": false}, {"data": ["Get Post Comments By Id", 5, 0, 0.0, 330.0, 175, 811, 211.0, 811.0, 811.0, 811.0, 0.7085163667280714, 1.966132917670398, 0.10171084561428369], "isController": false}, {"data": ["Get User Albums ", 5, 0, 0.0, 202.4, 145, 280, 195.0, 280.0, 280.0, 280.0, 0.6883259911894274, 1.4449468268171806, 0.09679584251101321], "isController": false}, {"data": ["Get Posts By Id", 5, 2, 40.0, 206.6, 161, 257, 207.0, 257.0, 257.0, 257.0, 0.6737636437137853, 1.0753899407087992, 0.09014220623905134], "isController": false}, {"data": ["Options User Todos", 5, 0, 0.0, 359.6, 347, 372, 361.0, 372.0, 372.0, 372.0, 0.6684491978609626, 0.7892139455213903, 0.09595901570855614], "isController": false}, {"data": ["Options User Albums ", 5, 0, 0.0, 387.6, 353, 408, 406.0, 408.0, 408.0, 408.0, 0.6693440428380187, 0.7902704568273092, 0.0967411311914324], "isController": false}, {"data": ["Get Posts", 5, 0, 0.0, 574.6, 335, 1183, 432.0, 1183.0, 1183.0, 1183.0, 0.6051803437424352, 17.045755416364077, 0.0797845179738562], "isController": false}, {"data": ["Get User Todos", 5, 1, 20.0, 342.6, 149, 914, 206.0, 914.0, 914.0, 914.0, 0.6891798759476223, 2.426801559269469, 0.09624289283252929], "isController": false}, {"data": ["Post User Albums ", 5, 0, 0.0, 372.6, 337, 408, 364.0, 408.0, 408.0, 408.0, 0.6601531555320834, 0.9496148418933192, 0.16890637377871667], "isController": false}, {"data": ["Post Request", 5, 0, 0.0, 418.4, 348, 507, 411.0, 507.0, 507.0, 507.0, 0.670690811535882, 0.9786584087860496, 0.16112298792756538], "isController": false}, {"data": ["Get Albums Photos", 5, 0, 0.0, 282.0, 155, 418, 268.0, 418.0, 418.0, 418.0, 0.7566585956416465, 8.917044207778451, 0.10714403942191283], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 402.6, 363, 426, 409.0, 426.0, 426.0, 426.0, 0.6693440428380187, 0.8506682981927711, 0.1457653530789826], "isController": false}, {"data": ["Options Albums Photos", 5, 0, 0.0, 486.0, 346, 819, 409.0, 819.0, 819.0, 819.0, 0.6691648822269807, 0.7916272835251605, 0.09736871821466808], "isController": false}, {"data": ["Post Albums Photos", 5, 0, 0.0, 388.4, 337, 463, 395.0, 463.0, 463.0, 463.0, 0.660414740457007, 0.9528288452648264, 0.26700361577070403], "isController": false}, {"data": ["Post User Posts", 5, 0, 0.0, 483.4, 336, 973, 357.0, 973.0, 973.0, 973.0, 0.6606765327695561, 0.9485611703884779, 0.3206603874867865], "isController": false}, {"data": ["Put Post request", 5, 0, 0.0, 381.2, 342, 453, 351.0, 453.0, 453.0, 453.0, 0.6688963210702341, 0.902618102006689, 0.18159489966555184], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 914 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 33.333333333333336, 1.1764705882352942], "isController": false}, {"data": ["The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 2, 66.66666666666667, 2.3529411764705883], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 85, 3, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 2, "The operation lasted too long: It took 914 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Posts By Id", 5, 2, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get User Todos", 5, 1, "The operation lasted too long: It took 914 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
