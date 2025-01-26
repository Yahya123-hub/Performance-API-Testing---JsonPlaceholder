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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8529411764705882, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [0.7, 500, 1500, "Get User Albums "], "isController": false}, {"data": [0.5, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Todos"], "isController": false}, {"data": [0.9, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.0, 500, 1500, "Get Posts"], "isController": false}, {"data": [0.8, 500, 1500, "Get User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Albums "], "isController": false}, {"data": [1.0, 500, 1500, "Post Request"], "isController": false}, {"data": [1.0, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Delete Post"], "isController": false}, {"data": [0.8, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 85, 5, 5.882352941176471, 3575.929411764705, 145, 172431, 356.0, 773.0000000000006, 21343.4, 172431.0, 0.43041025692960516, 1.5456346826483904, 0.08876717052094832], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 5, 0, 0.0, 206.4, 162, 254, 201.0, 254.0, 254.0, 254.0, 0.029318978761331785, 0.08134298697357772, 0.0041802450187055085], "isController": false}, {"data": ["Post User Todos", 5, 0, 0.0, 374.8, 333, 419, 358.0, 419.0, 419.0, 419.0, 0.02929184046492009, 0.041986878353915735, 0.008152514191896705], "isController": false}, {"data": ["Get Post Comments By Id", 5, 0, 0.0, 163.6, 148, 198, 157.0, 198.0, 198.0, 198.0, 0.0293262012012012, 0.08136875278598911, 0.0042099136490005625], "isController": false}, {"data": ["Get User Albums ", 5, 1, 20.0, 34794.8, 145, 172431, 298.0, 172431.0, 172431.0, 172431.0, 0.028997106088812338, 0.06616663875695206, 0.0032621744349913876], "isController": false}, {"data": ["Get Posts By Id", 5, 2, 40.0, 323.4, 183, 830, 202.0, 830.0, 830.0, 830.0, 0.02932774932986093, 0.04680410933091673, 0.003923732088077097], "isController": false}, {"data": ["Options User Todos", 5, 0, 0.0, 363.6, 328, 409, 344.0, 409.0, 409.0, 409.0, 0.029239766081871347, 0.03448236476608187, 0.00419750548245614], "isController": false}, {"data": ["Options User Albums ", 5, 0, 0.0, 451.8, 369, 686, 408.0, 686.0, 686.0, 686.0, 0.02922609305588029, 0.03453473886485854, 0.004224083761982697], "isController": false}, {"data": ["Get Posts", 5, 1, 20.0, 20871.4, 17422, 22794, 21356.0, 22794.0, 22794.0, 22794.0, 0.17094601524838457, 3.9223095768231393, 0.01802946254572806], "isController": false}, {"data": ["Get User Todos", 5, 1, 20.0, 252.4, 156, 505, 175.0, 505.0, 505.0, 505.0, 0.029331706401351607, 0.10323385729538202, 0.0040961269681575], "isController": false}, {"data": ["Post User Albums ", 5, 0, 0.0, 372.4, 338, 407, 360.0, 407.0, 407.0, 407.0, 0.029294071465816748, 0.04206445574544624, 0.007495162816449207], "isController": false}, {"data": ["Post Request", 5, 0, 0.0, 382.4, 346, 414, 382.0, 414.0, 414.0, 414.0, 0.029263724686878146, 0.04275247278473604, 0.007030152610324241], "isController": false}, {"data": ["Get Albums Photos", 5, 0, 0.0, 184.4, 157, 211, 190.0, 211.0, 211.0, 211.0, 0.02932551319648094, 0.3455656616568915, 0.00415253848973607], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 402.2, 341, 508, 408.0, 508.0, 508.0, 508.0, 0.029238911142949037, 0.037279611707260026, 0.0063674581883570655], "isController": false}, {"data": ["Options Albums Photos", 5, 0, 0.0, 471.8, 346, 735, 408.0, 735.0, 735.0, 735.0, 0.029203901641259272, 0.034485701039658895, 0.004249395844284796], "isController": false}, {"data": ["Post Albums Photos", 5, 0, 0.0, 401.8, 342, 512, 345.0, 512.0, 512.0, 512.0, 0.02927571871889455, 0.042192486020844314, 0.01183608159142807], "isController": false}, {"data": ["Post User Posts", 5, 0, 0.0, 380.6, 340, 411, 392.0, 411.0, 411.0, 411.0, 0.02929218367370851, 0.04198164917923301, 0.014217007115071414], "isController": false}, {"data": ["Put Post request", 5, 0, 0.0, 393.0, 350, 409, 406.0, 409.0, 409.0, 409.0, 0.02923959509008719, 0.03953056195577803, 0.00793809319828539], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 505 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 20.0, 1.1764705882352942], "isController": false}, {"data": ["The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 2, 40.0, 2.3529411764705883], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: jsonplaceholder.typicode.com:80 failed to respond", 1, 20.0, 1.1764705882352942], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, 20.0, 1.1764705882352942], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 85, 5, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 2, "The operation lasted too long: It took 505 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: jsonplaceholder.typicode.com:80 failed to respond", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get User Albums ", 5, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get Posts By Id", 5, 2, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Posts", 5, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: jsonplaceholder.typicode.com:80 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get User Todos", 5, 1, "The operation lasted too long: It took 505 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
