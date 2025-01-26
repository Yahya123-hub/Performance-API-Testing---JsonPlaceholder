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

    var data = {"OkPercent": 96.82352941176471, "KoPercent": 3.176470588235294};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9047058823529411, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.91, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [0.96, 500, 1500, "Post User Todos"], "isController": false}, {"data": [0.95, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [0.94, 500, 1500, "Get User Albums "], "isController": false}, {"data": [0.57, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [0.94, 500, 1500, "Options User Todos"], "isController": false}, {"data": [0.91, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.79, 500, 1500, "Get Posts"], "isController": false}, {"data": [0.88, 500, 1500, "Get User Todos"], "isController": false}, {"data": [0.97, 500, 1500, "Post User Albums "], "isController": false}, {"data": [0.92, 500, 1500, "Post Request"], "isController": false}, {"data": [0.94, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [0.94, 500, 1500, "Delete Post"], "isController": false}, {"data": [0.92, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [0.94, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [0.97, 500, 1500, "Post User Posts"], "isController": false}, {"data": [0.93, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 850, 27, 3.176470588235294, 401.245882352941, 142, 4689, 351.0, 697.4999999999999, 924.1499999999995, 1776.8500000000006, 8.16122744860827, 31.729031421325768, 1.7093195816650826], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 50, 0, 0.0, 336.40000000000003, 147, 1129, 206.0, 811.2, 950.6499999999999, 1129.0, 0.511629334779539, 1.4197214402109959, 0.07294715124786394], "isController": false}, {"data": ["Post User Todos", 50, 0, 0.0, 420.34000000000003, 332, 1368, 356.0, 494.79999999999995, 973.35, 1368.0, 0.5124315903826838, 0.735439416494148, 0.1426201203701806], "isController": false}, {"data": ["Get Post Comments By Id", 50, 0, 0.0, 278.2799999999999, 142, 810, 205.0, 684.5999999999997, 768.9999999999998, 810.0, 0.5123685774598816, 1.421702716065829, 0.07355291102207284], "isController": false}, {"data": ["Get User Albums ", 50, 0, 0.0, 283.0599999999999, 143, 2032, 197.0, 569.5999999999997, 1077.6999999999998, 2032.0, 0.5104176236997111, 1.0716576896967098, 0.07177747833277187], "isController": false}, {"data": ["Get Posts By Id", 50, 21, 42.0, 246.95999999999992, 143, 2007, 167.5, 309.6, 830.5999999999963, 2007.0, 0.5120013107233554, 0.8171520919093552, 0.06850017536044892], "isController": false}, {"data": ["Options User Todos", 50, 0, 0.0, 425.7400000000001, 329, 1824, 370.5, 524.1999999999999, 834.3499999999998, 1824.0, 0.5130467796053644, 0.6058060381758109, 0.07365027011912947], "isController": false}, {"data": ["Options User Albums ", 50, 0, 0.0, 450.82000000000005, 329, 1745, 366.0, 746.4, 826.6999999999999, 1745.0, 0.5127889565770312, 0.6055516775890715, 0.07411402888027403], "isController": false}, {"data": ["Get Posts", 50, 0, 0.0, 725.92, 292, 4689, 435.5, 1410.5, 2825.3499999999876, 4689.0, 0.5085331868757755, 14.323462942551005, 0.06704294944163056], "isController": false}, {"data": ["Get User Todos", 50, 6, 12.0, 340.2, 145, 2222, 201.0, 737.8999999999999, 1494.1499999999962, 2222.0, 0.5130573085013596, 1.8067232953670926, 0.07164765148017034], "isController": false}, {"data": ["Post User Albums ", 50, 0, 0.0, 396.2800000000001, 331, 891, 367.5, 466.9, 635.9999999999989, 891.0, 0.5123738279448686, 0.7358068446738741, 0.1310956473843316], "isController": false}, {"data": ["Post Request", 50, 0, 0.0, 460.64000000000004, 331, 1283, 380.5, 916.3999999999996, 1094.1499999999992, 1283.0, 0.5128994204236549, 0.7487930835513156, 0.12321607170333898], "isController": false}, {"data": ["Get Albums Photos", 50, 0, 0.0, 318.71999999999997, 152, 1430, 208.0, 722.7999999999997, 1133.6999999999982, 1430.0, 0.5128625938538547, 6.043875314769417, 0.07262214463750871], "isController": false}, {"data": ["Delete Post", 50, 0, 0.0, 427.90000000000003, 334, 1061, 397.5, 678.8999999999997, 782.2499999999998, 1061.0, 0.515182426097081, 0.6554086427003802, 0.11219304787075103], "isController": false}, {"data": ["Options Albums Photos", 50, 0, 0.0, 438.78, 328, 1161, 367.5, 779.9, 940.649999999999, 1161.0, 0.5129099432721602, 0.6056544794989895, 0.07463240385503113], "isController": false}, {"data": ["Post Albums Photos", 50, 0, 0.0, 418.3199999999999, 334, 981, 372.0, 523.2, 946.6499999999997, 981.0, 0.5129099432721602, 0.7389810114327626, 0.20736788722136165], "isController": false}, {"data": ["Post User Posts", 50, 0, 0.0, 404.30000000000007, 331, 1119, 359.0, 461.19999999999993, 755.249999999998, 1119.0, 0.5117812032999652, 0.7347358857141395, 0.2483938066797683], "isController": false}, {"data": ["Put Post request", 50, 0, 0.0, 448.5199999999999, 336, 1810, 391.0, 714.0999999999997, 861.7999999999995, 1810.0, 0.513015195510091, 0.6937829131311369, 0.13927560971855987], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 674 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 3.7037037037037037, 0.11764705882352941], "isController": false}, {"data": ["The operation lasted too long: It took 745 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 3.7037037037037037, 0.11764705882352941], "isController": false}, {"data": ["The operation lasted too long: It took 817 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 3.7037037037037037, 0.11764705882352941], "isController": false}, {"data": ["The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 21, 77.77777777777777, 2.4705882352941178], "isController": false}, {"data": ["The operation lasted too long: It took 1,104 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 3.7037037037037037, 0.11764705882352941], "isController": false}, {"data": ["The operation lasted too long: It took 1,971 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 3.7037037037037037, 0.11764705882352941], "isController": false}, {"data": ["The operation lasted too long: It took 2,222 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 3.7037037037037037, 0.11764705882352941], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 850, 27, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 21, "The operation lasted too long: It took 674 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 745 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 817 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 1,104 milliseconds, but should not have lasted longer than 500 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Posts By Id", 50, 21, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get User Todos", 50, 6, "The operation lasted too long: It took 674 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 745 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 817 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 1,104 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 1,971 milliseconds, but should not have lasted longer than 500 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
