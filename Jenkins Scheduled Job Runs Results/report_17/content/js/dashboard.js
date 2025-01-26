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

    var data = {"OkPercent": 95.29411764705883, "KoPercent": 4.705882352941177};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8470588235294118, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Albums "], "isController": false}, {"data": [0.4, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Todos"], "isController": false}, {"data": [0.8, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.5, 500, 1500, "Get Posts"], "isController": false}, {"data": [0.8, 500, 1500, "Get User Todos"], "isController": false}, {"data": [0.9, 500, 1500, "Post User Albums "], "isController": false}, {"data": [0.8, 500, 1500, "Post Request"], "isController": false}, {"data": [0.9, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Delete Post"], "isController": false}, {"data": [0.9, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [0.8, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Posts"], "isController": false}, {"data": [0.7, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 85, 4, 4.705882352941177, 419.7058823529413, 152, 2744, 359.0, 517.8000000000001, 1042.500000000001, 2744.0, 4.782804411433716, 18.60139457433041, 1.0017293706392079], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 5, 0, 0.0, 181.8, 155, 210, 170.0, 210.0, 210.0, 210.0, 0.6422607578676942, 1.7822736030828517, 0.09157233461785484], "isController": false}, {"data": ["Post User Todos", 5, 0, 0.0, 388.0, 359, 408, 403.0, 408.0, 408.0, 408.0, 0.6261740763932373, 0.9014705306825297, 0.17427696462116468], "isController": false}, {"data": ["Get Post Comments By Id", 5, 0, 0.0, 229.0, 155, 410, 204.0, 410.0, 410.0, 410.0, 0.6260956674179815, 1.7374154770848986, 0.08987896788129227], "isController": false}, {"data": ["Get User Albums ", 5, 0, 0.0, 186.2, 172, 201, 186.0, 201.0, 201.0, 201.0, 0.6541933795629988, 1.3735505527934058, 0.09199594400104671], "isController": false}, {"data": ["Get Posts By Id", 5, 3, 60.0, 180.2, 152, 201, 182.0, 201.0, 201.0, 201.0, 0.6400409626216078, 1.0216903881848438, 0.08563048035074244], "isController": false}, {"data": ["Options User Todos", 5, 0, 0.0, 369.6, 335, 414, 353.0, 414.0, 414.0, 414.0, 0.5193725979017346, 0.6126973615872027, 0.07455837098784668], "isController": false}, {"data": ["Options User Albums ", 5, 0, 0.0, 410.6, 336, 513, 350.0, 513.0, 513.0, 513.0, 0.5099959200326397, 0.6016358119135047, 0.07371034781721746], "isController": false}, {"data": ["Get Posts", 5, 0, 0.0, 1334.8, 358, 2744, 850.0, 2744.0, 2744.0, 2744.0, 0.4898119122257053, 13.79614563944945, 0.06457481264694358], "isController": false}, {"data": ["Get User Todos", 5, 1, 20.0, 354.6, 176, 815, 208.0, 815.0, 815.0, 815.0, 0.6549646319098769, 2.3065756402279276, 0.09146478746397695], "isController": false}, {"data": ["Post User Albums ", 5, 0, 0.0, 406.8, 346, 510, 406.0, 510.0, 510.0, 510.0, 0.6180469715698392, 0.8913396168108776, 0.15813311186650186], "isController": false}, {"data": ["Post Request", 5, 0, 0.0, 564.4, 356, 1135, 404.0, 1135.0, 1135.0, 1135.0, 0.5250446287934475, 0.7702363685288249, 0.12613376824530084], "isController": false}, {"data": ["Get Albums Photos", 5, 0, 0.0, 318.4, 186, 511, 287.0, 511.0, 511.0, 511.0, 0.6275100401606426, 7.394936190072791, 0.08885640217118473], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 403.0, 358, 503, 388.0, 503.0, 503.0, 503.0, 0.519588485919152, 0.6634901408084797, 0.1131525706640341], "isController": false}, {"data": ["Options Albums Photos", 5, 0, 0.0, 409.8, 336, 613, 353.0, 613.0, 613.0, 613.0, 0.4959825414145422, 0.5847169179644877, 0.0721693346394207], "isController": false}, {"data": ["Post Albums Photos", 5, 0, 0.0, 563.6, 353, 1125, 419.0, 1125.0, 1125.0, 1125.0, 0.5679236710586097, 0.8212708711949114, 0.22960976544752384], "isController": false}, {"data": ["Post User Posts", 5, 0, 0.0, 384.2, 353, 420, 389.0, 420.0, 420.0, 420.0, 0.6239081607187422, 0.8963805527826305, 0.3028148006613427], "isController": false}, {"data": ["Put Post request", 5, 0, 0.0, 450.0, 347, 511, 511.0, 511.0, 511.0, 511.0, 0.5139802631578947, 0.6946764494243421, 0.13953761050575658], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The result was the wrong size: It was 1,636 bytes, but should have been less than or equal to 1,634 bytes.", 1, 25.0, 1.1764705882352942], "isController": false}, {"data": ["The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 2, 50.0, 2.3529411764705883], "isController": false}, {"data": ["The operation lasted too long: It took 815 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 25.0, 1.1764705882352942], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 85, 4, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 2, "The result was the wrong size: It was 1,636 bytes, but should have been less than or equal to 1,634 bytes.", 1, "The operation lasted too long: It took 815 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Posts By Id", 5, 3, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 2, "The result was the wrong size: It was 1,636 bytes, but should have been less than or equal to 1,634 bytes.", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get User Todos", 5, 1, "The operation lasted too long: It took 815 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
