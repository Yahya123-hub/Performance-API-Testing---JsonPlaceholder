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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8588235294117647, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [0.9, 500, 1500, "Get User Albums "], "isController": false}, {"data": [0.3, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.6, 500, 1500, "Get Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Todos"], "isController": false}, {"data": [0.7, 500, 1500, "Post User Albums "], "isController": false}, {"data": [1.0, 500, 1500, "Post Request"], "isController": false}, {"data": [0.8, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Delete Post"], "isController": false}, {"data": [0.9, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [0.8, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Post User Posts"], "isController": false}, {"data": [0.8, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 85, 3, 3.5294117647058822, 405.89411764705875, 159, 1431, 364.0, 717.0, 991.4000000000003, 1431.0, 5.679160820471704, 22.07741145102559, 1.1894657830560567], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 5, 0, 0.0, 231.2, 198, 309, 205.0, 309.0, 309.0, 309.0, 0.6778741865509761, 1.8808360730748372, 0.09665003050433839], "isController": false}, {"data": ["Post User Todos", 5, 0, 0.0, 375.4, 345, 408, 364.0, 408.0, 408.0, 408.0, 0.7176690110521028, 1.0306680152863499, 0.1997418634275872], "isController": false}, {"data": ["Get Post Comments By Id", 5, 0, 0.0, 189.0, 161, 215, 200.0, 215.0, 215.0, 215.0, 0.686436024162548, 1.9047258975151016, 0.09854110893739704], "isController": false}, {"data": ["Get User Albums ", 5, 0, 0.0, 376.0, 160, 1123, 200.0, 1123.0, 1123.0, 1123.0, 0.6426735218508997, 1.3492378293701799, 0.09037596401028278], "isController": false}, {"data": ["Get Posts By Id", 5, 3, 60.0, 303.4, 198, 717, 200.0, 717.0, 717.0, 717.0, 0.6782419967444384, 1.0825378119913185, 0.09074136089256647], "isController": false}, {"data": ["Options User Todos", 5, 0, 0.0, 373.4, 341, 410, 362.0, 410.0, 410.0, 410.0, 0.612369871402327, 0.7232423071034906, 0.08790856552357625], "isController": false}, {"data": ["Options User Albums ", 5, 0, 0.0, 382.4, 349, 410, 377.0, 410.0, 410.0, 410.0, 0.6099792607051361, 0.7213719577284373, 0.0881610650237892], "isController": false}, {"data": ["Get Posts", 5, 0, 0.0, 696.0, 436, 1062, 652.0, 1062.0, 1062.0, 1062.0, 0.5943183168905265, 16.739811155354808, 0.07835251248068466], "isController": false}, {"data": ["Get User Todos", 5, 0, 0.0, 206.2, 159, 264, 203.0, 264.0, 264.0, 264.0, 0.6455777921239509, 2.2735181972240155, 0.09015392995480956], "isController": false}, {"data": ["Post User Albums ", 5, 0, 0.0, 810.4, 388, 1431, 913.0, 1431.0, 1431.0, 1431.0, 0.6248437890527369, 0.8967484691327168, 0.15987214133966507], "isController": false}, {"data": ["Post Request", 5, 0, 0.0, 386.8, 364, 411, 384.0, 411.0, 411.0, 411.0, 0.6256256256256256, 0.9109451248123123, 0.15029678115615616], "isController": false}, {"data": ["Get Albums Photos", 5, 0, 0.0, 380.2, 163, 717, 209.0, 717.0, 717.0, 717.0, 0.6502796202367017, 7.663138899726882, 0.09208061028742359], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 412.6, 343, 512, 406.0, 512.0, 512.0, 512.0, 0.6240639041437843, 0.7919029658637043, 0.1359045416250624], "isController": false}, {"data": ["Options Albums Photos", 5, 0, 0.0, 411.8, 338, 510, 408.0, 510.0, 510.0, 510.0, 0.6101281269066504, 0.7215480094569859, 0.08877840909090909], "isController": false}, {"data": ["Post Albums Photos", 5, 0, 0.0, 436.2, 352, 544, 410.0, 544.0, 544.0, 544.0, 0.6153088850603002, 0.8848670548240217, 0.24876745938961362], "isController": false}, {"data": ["Post User Posts", 5, 0, 0.0, 501.2, 346, 1022, 377.0, 1022.0, 1022.0, 1022.0, 0.6595435958316845, 0.9483515532251682, 0.32011051477377656], "isController": false}, {"data": ["Put Post request", 5, 0, 0.0, 428.0, 355, 514, 400.0, 514.0, 514.0, 514.0, 0.6110228522546743, 0.8252388717463033, 0.1658831571550776], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 3, 100.0, 3.5294117647058822], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 85, 3, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 3, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Posts By Id", 5, 3, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
