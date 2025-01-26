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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9411764705882353, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [0.8, 500, 1500, "Get User Albums "], "isController": false}, {"data": [0.8, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Todos"], "isController": false}, {"data": [0.9, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.7, 500, 1500, "Get Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Albums "], "isController": false}, {"data": [0.9, 500, 1500, "Post Request"], "isController": false}, {"data": [0.9, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Post"], "isController": false}, {"data": [1.0, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 85, 1, 1.1764705882352942, 374.3294117647059, 153, 1455, 349.0, 491.8000000000002, 926.1, 1455.0, 6.33052804051538, 24.608982251247486, 1.3258906959857004], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 5, 0, 0.0, 204.4, 155, 307, 185.0, 307.0, 307.0, 307.0, 0.6171315724512466, 1.7122990465317205, 0.0879894624784004], "isController": false}, {"data": ["Post User Todos", 5, 0, 0.0, 387.2, 369, 411, 379.0, 411.0, 411.0, 411.0, 0.605840300496789, 0.8692388373924633, 0.16861766175936024], "isController": false}, {"data": ["Get Post Comments By Id", 5, 0, 0.0, 167.0, 157, 196, 160.0, 196.0, 196.0, 196.0, 0.6152331733727083, 1.7069115679217421, 0.08831960594315245], "isController": false}, {"data": ["Get User Albums ", 5, 0, 0.0, 515.8, 153, 963, 306.0, 963.0, 963.0, 963.0, 0.6142506142506142, 1.2892064649877149, 0.08637899262899262], "isController": false}, {"data": ["Get Posts By Id", 5, 1, 20.0, 205.2, 153, 307, 201.0, 307.0, 307.0, 307.0, 0.6211951795254068, 0.9913644163871289, 0.08310912069822339], "isController": false}, {"data": ["Options User Todos", 5, 0, 0.0, 371.4, 348, 412, 370.0, 412.0, 412.0, 412.0, 0.640450877417702, 0.7549064541437172, 0.09193972556679902], "isController": false}, {"data": ["Options User Albums ", 5, 0, 0.0, 439.4, 332, 750, 354.0, 750.0, 750.0, 750.0, 0.6410256410256411, 0.7560847355769231, 0.09264823717948718], "isController": false}, {"data": ["Get Posts", 5, 0, 0.0, 786.4, 343, 1455, 514.0, 1455.0, 1455.0, 1455.0, 0.5943183168905265, 16.73969507755854, 0.07835251248068466], "isController": false}, {"data": ["Get User Todos", 5, 0, 0.0, 200.6, 158, 265, 200.0, 265.0, 265.0, 265.0, 0.6223549912870301, 2.1911271626835944, 0.08691090210355987], "isController": false}, {"data": ["Post User Albums ", 5, 0, 0.0, 362.8, 337, 408, 355.0, 408.0, 408.0, 408.0, 0.602990834539315, 0.8671526395923782, 0.15428085805595756], "isController": false}, {"data": ["Post Request", 5, 0, 0.0, 468.6, 336, 917, 354.0, 917.0, 917.0, 917.0, 0.6000240009600384, 0.8764803717148686, 0.14414639085563422], "isController": false}, {"data": ["Get Albums Photos", 5, 0, 0.0, 350.2, 171, 757, 209.0, 757.0, 757.0, 757.0, 0.611321677466683, 7.204043892896442, 0.08656410471940335], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 397.4, 342, 477, 408.0, 477.0, 477.0, 477.0, 0.6445790898543251, 0.8194463468480083, 0.14037220413819776], "isController": false}, {"data": ["Options Albums Photos", 5, 0, 0.0, 370.4, 336, 414, 361.0, 414.0, 414.0, 414.0, 0.6755843804891231, 0.7979020993784623, 0.09830280536413999], "isController": false}, {"data": ["Post Albums Photos", 5, 0, 0.0, 377.2, 347, 403, 378.0, 403.0, 403.0, 403.0, 0.5975143403441683, 0.8611442026171128, 0.24157318056883365], "isController": false}, {"data": ["Post User Posts", 5, 0, 0.0, 379.4, 343, 406, 377.0, 406.0, 406.0, 406.0, 0.6084205402774397, 0.8724655481869068, 0.2952978598807496], "isController": false}, {"data": ["Put Post request", 5, 0, 0.0, 380.2, 334, 430, 379.0, 430.0, 430.0, 430.0, 0.6430868167202572, 0.8685440112540193, 0.17458802250803857], "isController": false}]}, function(index, item){
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
