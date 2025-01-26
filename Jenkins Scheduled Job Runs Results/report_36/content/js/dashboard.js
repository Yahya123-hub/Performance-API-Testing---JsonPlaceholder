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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9764705882352941, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [0.9, 500, 1500, "Get User Albums "], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.8, 500, 1500, "Get Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Albums "], "isController": false}, {"data": [1.0, 500, 1500, "Post Request"], "isController": false}, {"data": [1.0, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Post"], "isController": false}, {"data": [0.9, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 85, 0, 0.0, 327.2588235294118, 143, 1311, 345.0, 448.20000000000005, 500.0000000000001, 1311.0, 6.119951040391677, 23.788637815897474, 1.2817866207070343], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 5, 0, 0.0, 218.0, 149, 397, 163.0, 397.0, 397.0, 397.0, 0.6182762458266354, 1.7154750680103872, 0.08815266786200074], "isController": false}, {"data": ["Post User Todos", 5, 0, 0.0, 349.0, 335, 364, 348.0, 364.0, 364.0, 364.0, 0.6256256256256256, 0.8970151792417418, 0.17412431963213212], "isController": false}, {"data": ["Get Post Comments By Id", 5, 0, 0.0, 167.2, 149, 205, 161.0, 205.0, 205.0, 205.0, 0.6198090987975703, 1.71972813623404, 0.08897650148754184], "isController": false}, {"data": ["Get User Albums ", 5, 0, 0.0, 268.2, 143, 621, 196.0, 621.0, 621.0, 621.0, 0.612369871402327, 1.2854983159828537, 0.08611451316595224], "isController": false}, {"data": ["Get Posts By Id", 5, 0, 0.0, 175.6, 146, 210, 160.0, 210.0, 210.0, 210.0, 0.6333924499619965, 1.0107063117557638, 0.08474098207499367], "isController": false}, {"data": ["Options User Todos", 5, 0, 0.0, 386.6, 335, 450, 351.0, 450.0, 450.0, 450.0, 0.6154603643525357, 0.7256902772648941, 0.08835222027326439], "isController": false}, {"data": ["Options User Albums ", 5, 0, 0.0, 364.8, 341, 413, 347.0, 413.0, 413.0, 413.0, 0.6110975311659741, 0.7215008937301393, 0.08832269005133218], "isController": false}, {"data": ["Get Posts", 5, 0, 0.0, 587.8, 302, 1311, 324.0, 1311.0, 1311.0, 1311.0, 0.6076072426783328, 17.113993764430674, 0.08010447047028801], "isController": false}, {"data": ["Get User Todos", 5, 0, 0.0, 186.2, 151, 261, 163.0, 261.0, 261.0, 261.0, 0.6186587478346943, 2.1784762821702546, 0.08639472748082157], "isController": false}, {"data": ["Post User Albums ", 5, 0, 0.0, 371.6, 335, 465, 356.0, 465.0, 465.0, 465.0, 0.6253908692933083, 0.8977779080675422, 0.16001211694809256], "isController": false}, {"data": ["Post Request", 5, 0, 0.0, 360.4, 337, 406, 351.0, 406.0, 406.0, 406.0, 0.6256256256256256, 0.9132667824074074, 0.15029678115615616], "isController": false}, {"data": ["Get Albums Photos", 5, 0, 0.0, 229.0, 146, 333, 204.0, 333.0, 333.0, 333.0, 0.616294835449279, 7.262890191667695, 0.08726831166029829], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 394.6, 348, 472, 374.0, 472.0, 472.0, 472.0, 0.6221226825930073, 0.7900472035585416, 0.1354817951350006], "isController": false}, {"data": ["Options Albums Photos", 5, 0, 0.0, 397.8, 347, 512, 379.0, 512.0, 512.0, 512.0, 0.6065752759917505, 0.7161616295644789, 0.08826144152614339], "isController": false}, {"data": ["Post Albums Photos", 5, 0, 0.0, 381.0, 341, 463, 347.0, 463.0, 463.0, 463.0, 0.6255473539346929, 0.9009348023270362, 0.25290684036031524], "isController": false}, {"data": ["Post User Posts", 5, 0, 0.0, 357.8, 340, 408, 350.0, 408.0, 408.0, 408.0, 0.6223549912870301, 0.8923257794996265, 0.30206096745083394], "isController": false}, {"data": ["Put Post request", 5, 0, 0.0, 367.8, 344, 401, 366.0, 401.0, 401.0, 401.0, 0.6225874735400323, 0.8406146883949694, 0.16902277113684472], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 85, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
