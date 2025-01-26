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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.888235294117647, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [0.9, 500, 1500, "Post User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Albums "], "isController": false}, {"data": [0.6, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [0.9, 500, 1500, "Options User Todos"], "isController": false}, {"data": [0.9, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.8, 500, 1500, "Get Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Todos"], "isController": false}, {"data": [0.9, 500, 1500, "Post User Albums "], "isController": false}, {"data": [0.7, 500, 1500, "Post Request"], "isController": false}, {"data": [1.0, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [0.7, 500, 1500, "Delete Post"], "isController": false}, {"data": [0.8, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 85, 2, 2.3529411764705883, 358.9999999999999, 148, 910, 346.0, 514.4000000000001, 589.4000000000002, 910.0, 5.950714085690283, 23.132854067488097, 1.24634096716606], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 5, 0, 0.0, 202.6, 149, 300, 202.0, 300.0, 300.0, 300.0, 0.6339546088500064, 1.7591002202992267, 0.09038805946494231], "isController": false}, {"data": ["Post User Todos", 5, 0, 0.0, 409.6, 340, 539, 403.0, 539.0, 539.0, 539.0, 0.630596544330937, 0.9048814084373817, 0.1755078272796065], "isController": false}, {"data": ["Get Post Comments By Id", 5, 0, 0.0, 219.6, 187, 303, 201.0, 303.0, 303.0, 303.0, 0.6423432682425488, 1.7823771117034943, 0.09221138714028777], "isController": false}, {"data": ["Get User Albums ", 5, 0, 0.0, 206.2, 148, 291, 203.0, 291.0, 291.0, 291.0, 0.6444129398118315, 1.352763725995618, 0.09062056966103879], "isController": false}, {"data": ["Get Posts By Id", 5, 2, 40.0, 201.4, 163, 263, 200.0, 263.0, 263.0, 263.0, 0.6371049949031601, 1.0168793004587156, 0.08523767998216106], "isController": false}, {"data": ["Options User Todos", 5, 0, 0.0, 453.0, 344, 512, 493.0, 512.0, 512.0, 512.0, 0.6041565973900435, 0.7123619879772838, 0.08672951153939101], "isController": false}, {"data": ["Options User Albums ", 5, 0, 0.0, 393.6, 340, 506, 370.0, 506.0, 506.0, 506.0, 0.610798924993892, 0.7201939668336184, 0.08827953212802346], "isController": false}, {"data": ["Get Posts", 5, 0, 0.0, 570.2, 290, 910, 457.0, 910.0, 910.0, 910.0, 0.599592277251469, 16.888359665427508, 0.07904780998920734], "isController": false}, {"data": ["Get User Todos", 5, 0, 0.0, 215.2, 150, 312, 200.0, 312.0, 312.0, 312.0, 0.6367804381049414, 2.242412363092206, 0.08892539321192053], "isController": false}, {"data": ["Post User Albums ", 5, 0, 0.0, 442.6, 349, 611, 409.0, 611.0, 611.0, 611.0, 0.6257822277847309, 0.8994397293491865, 0.16011224968710888], "isController": false}, {"data": ["Post Request", 5, 0, 0.0, 522.6, 346, 829, 511.0, 829.0, 829.0, 829.0, 0.6099048548426446, 0.8909137518297146, 0.14652011161258843], "isController": false}, {"data": ["Get Albums Photos", 5, 0, 0.0, 240.2, 199, 320, 233.0, 320.0, 320.0, 320.0, 0.6397134083930399, 7.53862269703173, 0.09058441818065507], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 445.2, 342, 532, 502.0, 532.0, 532.0, 532.0, 0.6031363088057901, 0.7668783926417371, 0.13134706724969844], "isController": false}, {"data": ["Options Albums Photos", 5, 0, 0.0, 415.6, 334, 520, 367.0, 520.0, 520.0, 520.0, 0.5982292414453219, 0.7058403999162478, 0.08704702829624311], "isController": false}, {"data": ["Post Albums Photos", 5, 0, 0.0, 397.6, 334, 511, 388.0, 511.0, 511.0, 511.0, 0.6178942165101335, 0.8899124907315867, 0.24981270081562035], "isController": false}, {"data": ["Post User Posts", 5, 0, 0.0, 383.0, 352, 413, 394.0, 413.0, 413.0, 413.0, 0.6254691018263697, 0.8970350809982487, 0.3035724058669002], "isController": false}, {"data": ["Put Post request", 5, 0, 0.0, 384.8, 337, 425, 407.0, 425.0, 425.0, 425.0, 0.6104260774020266, 0.8251482190819192, 0.1657211421071908], "isController": false}]}, function(index, item){
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
