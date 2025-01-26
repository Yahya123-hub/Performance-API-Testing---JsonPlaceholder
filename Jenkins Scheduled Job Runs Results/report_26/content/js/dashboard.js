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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9235294117647059, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [0.8, 500, 1500, "Get User Albums "], "isController": false}, {"data": [0.4, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.7, 500, 1500, "Get Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Albums "], "isController": false}, {"data": [1.0, 500, 1500, "Post Request"], "isController": false}, {"data": [1.0, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Post"], "isController": false}, {"data": [0.9, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Post User Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 85, 3, 3.5294117647058822, 374.2470588235295, 146, 2240, 344.0, 452.4000000000001, 665.8000000000005, 2240.0, 5.700871898054997, 22.167510269953052, 1.1940130365526491], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 5, 0, 0.0, 163.4, 150, 199, 156.0, 199.0, 199.0, 199.0, 0.639467962655071, 1.7747733885407342, 0.09117414311293004], "isController": false}, {"data": ["Post User Todos", 5, 0, 0.0, 361.2, 342, 410, 344.0, 410.0, 410.0, 410.0, 0.6257822277847309, 0.9005397371714643, 0.17416790519399247], "isController": false}, {"data": ["Get Post Comments By Id", 5, 0, 0.0, 239.0, 147, 410, 169.0, 410.0, 410.0, 410.0, 0.643915003219575, 1.786989898583387, 0.09243701706374759], "isController": false}, {"data": ["Get User Albums ", 5, 0, 0.0, 572.6, 150, 2240, 158.0, 2240.0, 2240.0, 2240.0, 0.6811989100817438, 1.4298524778610355, 0.09579359673024523], "isController": false}, {"data": ["Get Posts By Id", 5, 3, 60.0, 165.2, 146, 202, 147.0, 202.0, 202.0, 202.0, 0.6358896095637797, 1.0150636287040569, 0.08507507471702912], "isController": false}, {"data": ["Options User Todos", 5, 0, 0.0, 376.6, 334, 408, 396.0, 408.0, 408.0, 408.0, 0.5968011458582001, 0.7043885399259966, 0.08567360199331582], "isController": false}, {"data": ["Options User Albums ", 5, 0, 0.0, 372.4, 339, 411, 355.0, 411.0, 411.0, 411.0, 0.595876534382076, 0.7037627741032059, 0.08612278035990943], "isController": false}, {"data": ["Get Posts", 5, 0, 0.0, 874.2, 309, 2105, 323.0, 2105.0, 2105.0, 2105.0, 0.6074596039363382, 17.10983534048111, 0.08008500637832584], "isController": false}, {"data": ["Get User Todos", 5, 0, 0.0, 271.2, 149, 427, 272.0, 427.0, 427.0, 427.0, 0.6681812107443539, 2.3528591891621007, 0.09331046204730724], "isController": false}, {"data": ["Post User Albums ", 5, 0, 0.0, 375.8, 333, 448, 346.0, 448.0, 448.0, 448.0, 0.6207324643078833, 0.8924241542520174, 0.15882022036002483], "isController": false}, {"data": ["Post Request", 5, 0, 0.0, 367.4, 333, 409, 352.0, 409.0, 409.0, 409.0, 0.6109481915933529, 0.8926764494745847, 0.1467707569648094], "isController": false}, {"data": ["Get Albums Photos", 5, 0, 0.0, 173.8, 154, 204, 166.0, 204.0, 204.0, 204.0, 0.6658676255160474, 7.847223956252496, 0.09428789619123717], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 375.6, 340, 408, 375.0, 408.0, 408.0, 408.0, 0.6056201550387597, 0.7703914198764534, 0.13188798298207363], "isController": false}, {"data": ["Options Albums Photos", 5, 0, 0.0, 496.4, 410, 718, 464.0, 718.0, 718.0, 718.0, 0.5908070424199456, 0.696852290854307, 0.08596704035212101], "isController": false}, {"data": ["Post Albums Photos", 5, 0, 0.0, 394.6, 338, 459, 411.0, 459.0, 459.0, 459.0, 0.6147037128104254, 0.8871183074133268, 0.24852279014015244], "isController": false}, {"data": ["Post User Posts", 5, 0, 0.0, 411.2, 344, 544, 406.0, 544.0, 544.0, 544.0, 0.6153846153846154, 0.8865384615384615, 0.29867788461538464], "isController": false}, {"data": ["Put Post request", 5, 0, 0.0, 371.6, 338, 413, 355.0, 413.0, 413.0, 413.0, 0.6002400960384153, 0.8106758328331333, 0.16295580732292916], "isController": false}]}, function(index, item){
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
