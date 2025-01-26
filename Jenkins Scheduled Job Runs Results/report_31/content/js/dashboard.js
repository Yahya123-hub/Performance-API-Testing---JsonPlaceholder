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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8764705882352941, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [0.9, 500, 1500, "Post User Todos"], "isController": false}, {"data": [0.9, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [0.9, 500, 1500, "Get User Albums "], "isController": false}, {"data": [0.4, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Todos"], "isController": false}, {"data": [0.8, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.6, 500, 1500, "Get Posts"], "isController": false}, {"data": [0.8, 500, 1500, "Get User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Albums "], "isController": false}, {"data": [0.9, 500, 1500, "Post Request"], "isController": false}, {"data": [1.0, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Delete Post"], "isController": false}, {"data": [0.9, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Post User Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 85, 4, 4.705882352941177, 398.76470588235287, 148, 1363, 363.0, 667.2000000000007, 944.8000000000004, 1363.0, 6.162993039443156, 23.961609311557424, 1.2908015063080047], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 5, 0, 0.0, 195.2, 177, 213, 198.0, 213.0, 213.0, 213.0, 0.6259389083625438, 1.7368582170130193, 0.0892451959188783], "isController": false}, {"data": ["Post User Todos", 5, 0, 0.0, 414.6, 355, 510, 408.0, 510.0, 510.0, 510.0, 0.600672753483902, 0.8619419374699664, 0.16717942845987507], "isController": false}, {"data": ["Get Post Comments By Id", 5, 0, 0.0, 293.2, 155, 510, 202.0, 510.0, 510.0, 510.0, 0.6268806419257773, 1.7397162189694082, 0.08999165465145437], "isController": false}, {"data": ["Get User Albums ", 5, 0, 0.0, 262.8, 150, 606, 179.0, 606.0, 606.0, 606.0, 0.608939227865059, 1.2782966447448545, 0.08563207891852392], "isController": false}, {"data": ["Get Posts By Id", 5, 3, 60.0, 208.2, 193, 226, 203.0, 226.0, 226.0, 226.0, 0.6243756243756243, 0.9966839800824177, 0.08353462943306694], "isController": false}, {"data": ["Options User Todos", 5, 0, 0.0, 370.0, 344, 416, 365.0, 416.0, 416.0, 416.0, 0.6876633200385092, 0.8086759472562234, 0.09871729301334067], "isController": false}, {"data": ["Options User Albums ", 5, 0, 0.0, 532.6, 347, 982, 368.0, 982.0, 982.0, 982.0, 0.6641870350690755, 0.7836628669633369, 0.09599578241232731], "isController": false}, {"data": ["Get Posts", 5, 0, 0.0, 761.2, 437, 1282, 617.0, 1282.0, 1282.0, 1282.0, 0.5877512636652169, 16.554726071176677, 0.07748673886211356], "isController": false}, {"data": ["Get User Todos", 5, 1, 20.0, 357.0, 148, 773, 276.0, 773.0, 773.0, 773.0, 0.6142506142506142, 2.163193911240786, 0.08577913851351351], "isController": false}, {"data": ["Post User Albums ", 5, 0, 0.0, 378.6, 352, 409, 363.0, 409.0, 409.0, 409.0, 0.6063545961678389, 0.8717531606233325, 0.15514150800388066], "isController": false}, {"data": ["Post Request", 5, 0, 0.0, 590.8, 359, 1363, 410.0, 1363.0, 1363.0, 1363.0, 0.6035003017501509, 0.8827370624622812, 0.1449815178032589], "isController": false}, {"data": ["Get Albums Photos", 5, 0, 0.0, 194.0, 153, 254, 195.0, 254.0, 254.0, 254.0, 0.6236746912810278, 7.349860062991144, 0.08831331077709867], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 492.2, 375, 856, 410.0, 856.0, 856.0, 856.0, 0.6819421713038735, 0.8704086112247682, 0.14850889082105836], "isController": false}, {"data": ["Options Albums Photos", 5, 0, 0.0, 429.2, 340, 741, 360.0, 741.0, 741.0, 741.0, 0.6632179334129195, 0.7845919966175886, 0.09650339070168458], "isController": false}, {"data": ["Post Albums Photos", 5, 0, 0.0, 386.2, 354, 454, 358.0, 454.0, 454.0, 454.0, 0.602918123718799, 0.8686966794284336, 0.24375791330037383], "isController": false}, {"data": ["Post User Posts", 5, 0, 0.0, 516.0, 356, 1058, 387.0, 1058.0, 1058.0, 1058.0, 0.6104260774020266, 0.8774874862654132, 0.29627125045781955], "isController": false}, {"data": ["Put Post request", 5, 0, 0.0, 397.2, 353, 410, 409.0, 410.0, 410.0, 410.0, 0.6839945280437756, 0.9224574640902873, 0.1856938269493844], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 3, 75.0, 3.5294117647058822], "isController": false}, {"data": ["The operation lasted too long: It took 773 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 25.0, 1.1764705882352942], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 85, 4, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 3, "The operation lasted too long: It took 773 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Posts By Id", 5, 3, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get User Todos", 5, 1, "The operation lasted too long: It took 773 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
