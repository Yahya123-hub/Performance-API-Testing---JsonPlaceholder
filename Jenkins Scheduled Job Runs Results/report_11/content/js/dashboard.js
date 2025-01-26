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

    var data = {"OkPercent": 96.94117647058823, "KoPercent": 3.0588235294117645};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9094117647058824, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.95, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [0.96, 500, 1500, "Post User Todos"], "isController": false}, {"data": [0.98, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [0.96, 500, 1500, "Get User Albums "], "isController": false}, {"data": [0.59, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [0.92, 500, 1500, "Options User Todos"], "isController": false}, {"data": [0.97, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.85, 500, 1500, "Get Posts"], "isController": false}, {"data": [0.86, 500, 1500, "Get User Todos"], "isController": false}, {"data": [0.94, 500, 1500, "Post User Albums "], "isController": false}, {"data": [0.95, 500, 1500, "Post Request"], "isController": false}, {"data": [0.9, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [0.92, 500, 1500, "Delete Post"], "isController": false}, {"data": [0.94, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [0.92, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [0.95, 500, 1500, "Post User Posts"], "isController": false}, {"data": [0.9, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 850, 26, 3.0588235294117645, 369.78823529411756, 141, 2197, 346.0, 517.0, 827.4499999999999, 1200.330000000002, 8.100175344972174, 31.49582505944099, 1.6965325889113363], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 50, 0, 0.0, 261.02, 145, 1066, 192.0, 625.2999999999997, 897.7999999999988, 1066.0, 0.5081559022308044, 1.4100333794908277, 0.07245191574775141], "isController": false}, {"data": ["Post User Todos", 50, 0, 0.0, 404.50000000000006, 332, 950, 351.5, 494.2999999999999, 848.2499999999998, 950.0, 0.5107304466848487, 0.7334169016026721, 0.14214665752459166], "isController": false}, {"data": ["Get Post Comments By Id", 50, 0, 0.0, 240.64000000000001, 141, 694, 203.5, 390.0, 535.9499999999989, 694.0, 0.5128362923987404, 1.422980482732802, 0.07362005369395981], "isController": false}, {"data": ["Get User Albums ", 50, 0, 0.0, 245.33999999999995, 142, 1094, 171.5, 343.69999999999993, 913.3999999999992, 1094.0, 0.5082540457022038, 1.0670853250538748, 0.07147322517687241], "isController": false}, {"data": ["Get Posts By Id", 50, 19, 38.0, 233.95999999999998, 144, 1070, 194.0, 290.6, 823.5999999999984, 1070.0, 0.5121166806645226, 0.8173762310004712, 0.06851561059671836], "isController": false}, {"data": ["Options User Todos", 50, 0, 0.0, 415.9000000000001, 328, 1083, 366.0, 516.5, 772.2499999999997, 1083.0, 0.5092116385412105, 0.6017847231416321, 0.07309971764214643], "isController": false}, {"data": ["Options User Albums ", 50, 0, 0.0, 382.84000000000015, 328, 713, 357.0, 411.9, 589.3999999999993, 713.0, 0.5095541401273885, 0.6022691082802548, 0.07364649681528662], "isController": false}, {"data": ["Get Posts", 50, 0, 0.0, 530.6000000000001, 290, 1964, 397.5, 980.6999999999999, 1760.4999999999986, 1964.0, 0.5092998146148675, 14.345036061609997, 0.06714401852832726], "isController": false}, {"data": ["Get User Todos", 50, 7, 14.0, 301.2000000000001, 142, 1062, 201.5, 842.4, 969.6499999999993, 1062.0, 0.508357395583391, 1.7902222697395178, 0.07099131598478996], "isController": false}, {"data": ["Post User Albums ", 50, 0, 0.0, 422.15999999999997, 334, 930, 359.5, 823.2999999999995, 893.35, 930.0, 0.5100323360501056, 0.7327730203094877, 0.13049655473156999], "isController": false}, {"data": ["Post Request", 50, 0, 0.0, 437.71999999999997, 336, 1385, 360.5, 538.5999999999999, 1097.5499999999981, 1385.0, 0.5091027573005336, 0.7440656118906039, 0.12230398271087035], "isController": false}, {"data": ["Get Albums Photos", 50, 0, 0.0, 332.69999999999993, 145, 2197, 196.0, 739.6999999999999, 1245.049999999996, 2197.0, 0.51277843869221, 6.042913626317841, 0.07261022813512738], "isController": false}, {"data": ["Delete Post", 50, 0, 0.0, 423.8599999999999, 332, 893, 362.5, 715.9, 799.4999999999999, 893.0, 0.5091960812269589, 0.6484393299234169, 0.11088938097032405], "isController": false}, {"data": ["Options Albums Photos", 50, 0, 0.0, 400.70000000000016, 332, 805, 363.0, 510.4, 709.5, 805.0, 0.509767138371192, 0.6024113419365034, 0.07417510118877696], "isController": false}, {"data": ["Post Albums Photos", 50, 0, 0.0, 422.0, 333, 975, 372.0, 511.8, 909.3999999999995, 975.0, 0.5091597845235791, 0.7335580372144886, 0.20585170975855643], "isController": false}, {"data": ["Post User Posts", 50, 0, 0.0, 389.7399999999999, 334, 921, 358.0, 503.79999999999995, 516.6999999999999, 921.0, 0.5107513151846366, 0.7338159667245518, 0.24789394887379337], "isController": false}, {"data": ["Put Post request", 50, 0, 0.0, 441.52, 331, 840, 397.0, 745.5, 799.3999999999996, 840.0, 0.5099647104420375, 0.6898368336036146, 0.13844745068641248], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 1,062 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 3.8461538461538463, 0.11764705882352941], "isController": false}, {"data": ["The operation lasted too long: It took 1,056 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 3.8461538461538463, 0.11764705882352941], "isController": false}, {"data": ["The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 18, 69.23076923076923, 2.1176470588235294], "isController": false}, {"data": ["The result was the wrong size: It was 1,636 bytes, but should have been less than or equal to 1,634 bytes.", 1, 3.8461538461538463, 0.11764705882352941], "isController": false}, {"data": ["The operation lasted too long: It took 751 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 3.8461538461538463, 0.11764705882352941], "isController": false}, {"data": ["The operation lasted too long: It took 828 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 3.8461538461538463, 0.11764705882352941], "isController": false}, {"data": ["The operation lasted too long: It took 861 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 3.8461538461538463, 0.11764705882352941], "isController": false}, {"data": ["The operation lasted too long: It took 844 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 3.8461538461538463, 0.11764705882352941], "isController": false}, {"data": ["The operation lasted too long: It took 899 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 3.8461538461538463, 0.11764705882352941], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 850, 26, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 18, "The operation lasted too long: It took 1,062 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 1,056 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The result was the wrong size: It was 1,636 bytes, but should have been less than or equal to 1,634 bytes.", 1, "The operation lasted too long: It took 751 milliseconds, but should not have lasted longer than 500 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Posts By Id", 50, 19, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 18, "The result was the wrong size: It was 1,636 bytes, but should have been less than or equal to 1,634 bytes.", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get User Todos", 50, 7, "The operation lasted too long: It took 1,062 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 1,056 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 751 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 828 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 861 milliseconds, but should not have lasted longer than 500 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
