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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9058823529411765, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Albums "], "isController": false}, {"data": [0.6, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [0.9, 500, 1500, "Options User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.8, 500, 1500, "Get Posts"], "isController": false}, {"data": [0.8, 500, 1500, "Get User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Albums "], "isController": false}, {"data": [0.7, 500, 1500, "Post Request"], "isController": false}, {"data": [0.8, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Post"], "isController": false}, {"data": [1.0, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Posts"], "isController": false}, {"data": [0.9, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 85, 3, 3.5294117647058822, 407.0941176470589, 155, 2498, 362.0, 737.0000000000002, 903.6000000000001, 2498.0, 5.520555952458271, 21.464459391439892, 1.1562469555757615], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 5, 0, 0.0, 358.0, 171, 767, 213.0, 767.0, 767.0, 767.0, 0.6059137178865729, 1.681292224612215, 0.08639004180804653], "isController": false}, {"data": ["Post User Todos", 5, 0, 0.0, 362.8, 347, 410, 349.0, 410.0, 410.0, 410.0, 0.6062810719049351, 0.8704633124166363, 0.16874033739541652], "isController": false}, {"data": ["Get Post Comments By Id", 5, 0, 0.0, 171.0, 155, 201, 167.0, 201.0, 201.0, 201.0, 0.653765690376569, 1.8139444135721758, 0.09385112938023013], "isController": false}, {"data": ["Get User Albums ", 5, 0, 0.0, 186.4, 166, 208, 189.0, 208.0, 208.0, 208.0, 0.6275888038157399, 1.3178139120748087, 0.08825467553658843], "isController": false}, {"data": ["Get Posts By Id", 5, 2, 40.0, 204.8, 176, 248, 202.0, 248.0, 248.0, 248.0, 0.6256256256256256, 0.9984349583958959, 0.08370186592842843], "isController": false}, {"data": ["Options User Todos", 5, 0, 0.0, 458.6, 356, 717, 408.0, 717.0, 717.0, 717.0, 0.5371146202599635, 0.6342568347835429, 0.07710532146310023], "isController": false}, {"data": ["Options User Albums ", 5, 0, 0.0, 366.0, 344, 406, 356.0, 406.0, 406.0, 406.0, 0.5405405405405406, 0.6383023648648649, 0.078125], "isController": false}, {"data": ["Get Posts", 5, 0, 0.0, 835.0000000000001, 321, 2498, 484.0, 2498.0, 2498.0, 2498.0, 0.6051071039574004, 17.043692514825125, 0.07977486233813386], "isController": false}, {"data": ["Get User Todos", 5, 1, 20.0, 364.2, 159, 1034, 200.0, 1034.0, 1034.0, 1034.0, 0.629009938357026, 2.215171523147566, 0.08784025506353], "isController": false}, {"data": ["Post User Albums ", 5, 0, 0.0, 414.4, 387, 448, 412.0, 448.0, 448.0, 448.0, 0.6019744762822057, 0.8648680170960752, 0.15402081326751746], "isController": false}, {"data": ["Post Request", 5, 0, 0.0, 697.8, 362, 1021, 830.0, 1021.0, 1021.0, 1021.0, 0.561104253170239, 0.8192998821681069, 0.13479652957019414], "isController": false}, {"data": ["Get Albums Photos", 5, 0, 0.0, 455.6, 194, 918, 340.0, 918.0, 918.0, 918.0, 0.5945303210463733, 7.006168252080856, 0.08418642241379311], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 404.2, 362, 459, 407.0, 459.0, 459.0, 459.0, 0.5610412926391383, 0.7144510210951526, 0.12217989087746857], "isController": false}, {"data": ["Options Albums Photos", 5, 0, 0.0, 381.0, 339, 460, 355.0, 460.0, 460.0, 460.0, 0.5415357955160836, 0.6394776210332502, 0.07879768899599263], "isController": false}, {"data": ["Post Albums Photos", 5, 0, 0.0, 390.8, 351, 421, 409.0, 421.0, 421.0, 421.0, 0.6024096385542169, 0.8678463855421686, 0.24355233433734938], "isController": false}, {"data": ["Post User Posts", 5, 0, 0.0, 379.0, 357, 408, 367.0, 408.0, 408.0, 408.0, 0.61020258725897, 0.8770470389919452, 0.29616277916768363], "isController": false}, {"data": ["Put Post request", 5, 0, 0.0, 491.0, 392, 819, 416.0, 819.0, 819.0, 819.0, 0.5365382551775941, 0.7262129117931108, 0.14566175287047964], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 2, 66.66666666666667, 2.3529411764705883], "isController": false}, {"data": ["The operation lasted too long: It took 1,034 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 33.333333333333336, 1.1764705882352942], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 85, 3, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 2, "The operation lasted too long: It took 1,034 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Posts By Id", 5, 2, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get User Todos", 5, 1, "The operation lasted too long: It took 1,034 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
