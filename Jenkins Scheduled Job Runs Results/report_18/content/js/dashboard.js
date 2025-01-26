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

    var data = {"OkPercent": 92.94117647058823, "KoPercent": 7.0588235294117645};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7823529411764706, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [0.7, 500, 1500, "Post User Todos"], "isController": false}, {"data": [0.8, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Albums "], "isController": false}, {"data": [0.4, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [0.9, 500, 1500, "Options User Todos"], "isController": false}, {"data": [0.7, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.6, 500, 1500, "Get Posts"], "isController": false}, {"data": [0.4, 500, 1500, "Get User Todos"], "isController": false}, {"data": [0.9, 500, 1500, "Post User Albums "], "isController": false}, {"data": [0.7, 500, 1500, "Post Request"], "isController": false}, {"data": [0.8, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [0.8, 500, 1500, "Delete Post"], "isController": false}, {"data": [0.8, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Post User Posts"], "isController": false}, {"data": [0.9, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 85, 6, 7.0588235294117645, 488.08235294117645, 146, 3765, 355.0, 1028.4, 1153.4000000000003, 3765.0, 5.302557704304429, 20.607113615096694, 1.1105885449157828], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 5, 0, 0.0, 176.2, 150, 206, 166.0, 206.0, 206.0, 206.0, 0.5774338838203026, 1.6021534674904723, 0.08232944046656657], "isController": false}, {"data": ["Post User Todos", 5, 0, 0.0, 444.4, 334, 519, 508.0, 519.0, 519.0, 519.0, 0.5782352260899735, 0.8283897233144443, 0.16093460882386953], "isController": false}, {"data": ["Get Post Comments By Id", 5, 0, 0.0, 926.2, 161, 3765, 204.0, 3765.0, 3765.0, 3765.0, 0.5681818181818181, 1.5765935724431817, 0.08156516335227272], "isController": false}, {"data": ["Get User Albums ", 5, 0, 0.0, 174.0, 147, 207, 167.0, 207.0, 207.0, 207.0, 0.6346788525006347, 1.3325776688245747, 0.08925171363290176], "isController": false}, {"data": ["Get Posts By Id", 5, 3, 60.0, 193.8, 146, 303, 160.0, 303.0, 303.0, 303.0, 0.5807875479149727, 0.9271048103728656, 0.07770302154721803], "isController": false}, {"data": ["Options User Todos", 5, 0, 0.0, 459.6, 328, 917, 355.0, 917.0, 917.0, 917.0, 0.5711674663011195, 0.6720142220699109, 0.08199376713502399], "isController": false}, {"data": ["Options User Albums ", 5, 0, 0.0, 565.6, 354, 922, 527.0, 922.0, 922.0, 922.0, 0.5356760231412042, 0.6310933147632313, 0.07742192521962717], "isController": false}, {"data": ["Get Posts", 5, 0, 0.0, 669.8, 459, 1064, 551.0, 1064.0, 1064.0, 1064.0, 0.5917860101787193, 16.668716342170672, 0.07801866345129602], "isController": false}, {"data": ["Get User Todos", 5, 3, 60.0, 623.0, 166, 1178, 514.0, 1178.0, 1178.0, 1178.0, 0.565482922415743, 1.9915601673829448, 0.07896880654829223], "isController": false}, {"data": ["Post User Albums ", 5, 0, 0.0, 491.6, 344, 1016, 347.0, 1016.0, 1016.0, 1016.0, 0.5901794145420207, 0.8451553647308783, 0.15100293614258736], "isController": false}, {"data": ["Post Request", 5, 0, 0.0, 655.6, 334, 1049, 510.0, 1049.0, 1049.0, 1049.0, 0.5534034311012728, 0.8080554786939679, 0.13294652739346985], "isController": false}, {"data": ["Get Albums Photos", 5, 0, 0.0, 597.4, 190, 1226, 247.0, 1226.0, 1226.0, 1226.0, 0.5639521768554027, 6.64604422794947, 0.07985650941800136], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 481.4, 335, 748, 356.0, 748.0, 748.0, 748.0, 0.5992329817833174, 0.7615642602468841, 0.1304970263063279], "isController": false}, {"data": ["Options Albums Photos", 5, 0, 0.0, 507.4, 343, 923, 413.0, 923.0, 923.0, 923.0, 0.5422993492407809, 0.638896420824295, 0.07890879202819956], "isController": false}, {"data": ["Post Albums Photos", 5, 0, 0.0, 383.0, 335, 483, 347.0, 483.0, 483.0, 483.0, 0.5900401227283455, 0.8476064653646448, 0.23855137774368657], "isController": false}, {"data": ["Post User Posts", 5, 0, 0.0, 390.0, 341, 510, 358.0, 510.0, 510.0, 510.0, 0.5776340110905731, 0.8275284123729204, 0.28035556983595195], "isController": false}, {"data": ["Put Post request", 5, 0, 0.0, 558.4, 340, 1277, 357.0, 1277.0, 1277.0, 1277.0, 0.6102770657878677, 0.8238740388136214, 0.16568068778225314], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 514 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 16.666666666666668, 1.1764705882352942], "isController": false}, {"data": ["The operation lasted too long: It took 845 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 16.666666666666668, 1.1764705882352942], "isController": false}, {"data": ["The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 3, 50.0, 3.5294117647058822], "isController": false}, {"data": ["The operation lasted too long: It took 1,178 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 16.666666666666668, 1.1764705882352942], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 85, 6, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 3, "The operation lasted too long: It took 514 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 845 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 1,178 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Posts By Id", 5, 3, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get User Todos", 5, 3, "The operation lasted too long: It took 514 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 845 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 1,178 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
