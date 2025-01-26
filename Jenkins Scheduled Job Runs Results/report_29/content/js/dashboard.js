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

    var data = {"OkPercent": 98.82352941176471, "KoPercent": 1.1764705882352942};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9470588235294117, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Albums "], "isController": false}, {"data": [0.7, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [0.9, 500, 1500, "Options User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.9, 500, 1500, "Get Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Albums "], "isController": false}, {"data": [1.0, 500, 1500, "Post Request"], "isController": false}, {"data": [0.7, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Post"], "isController": false}, {"data": [1.0, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Posts"], "isController": false}, {"data": [0.9, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 85, 1, 1.1764705882352942, 348.9882352941177, 143, 1842, 344.0, 462.0000000000001, 699.9000000000002, 1842.0, 6.331942789034565, 24.615063854849524, 1.3261870064809298], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 5, 0, 0.0, 200.0, 147, 305, 175.0, 305.0, 305.0, 305.0, 0.8704735376044568, 2.415224038126741, 0.12411048485376044], "isController": false}, {"data": ["Post User Todos", 5, 0, 0.0, 347.2, 334, 358, 352.0, 358.0, 358.0, 358.0, 0.8770391159445712, 1.258688168742326, 0.2440978008244168], "isController": false}, {"data": ["Get Post Comments By Id", 5, 0, 0.0, 220.2, 144, 414, 171.0, 414.0, 414.0, 414.0, 0.8359806052499582, 2.3190297922588194, 0.12000893454271862], "isController": false}, {"data": ["Get User Albums ", 5, 0, 0.0, 175.2, 146, 199, 178.0, 199.0, 199.0, 199.0, 0.6503642039542143, 1.3653837555280959, 0.0914574661810614], "isController": false}, {"data": ["Get Posts By Id", 5, 1, 20.0, 283.0, 143, 653, 165.0, 653.0, 653.0, 653.0, 0.8758101243650377, 1.3977040090208444, 0.1171738154668068], "isController": false}, {"data": ["Options User Todos", 5, 0, 0.0, 457.4, 361, 722, 367.0, 722.0, 722.0, 722.0, 0.8139345596614033, 0.9606653406316132, 0.11684412135764286], "isController": false}, {"data": ["Options User Albums ", 5, 0, 0.0, 354.8, 340, 369, 361.0, 369.0, 369.0, 369.0, 0.8143322475570033, 0.9619299674267101, 0.11769645765472313], "isController": false}, {"data": ["Get Posts", 5, 0, 0.0, 443.4, 298, 720, 405.0, 720.0, 720.0, 720.0, 0.6064281382656156, 17.0809013038205, 0.07994902213462705], "isController": false}, {"data": ["Get User Todos", 5, 0, 0.0, 186.2, 169, 203, 179.0, 203.0, 203.0, 203.0, 0.6534239414532148, 2.301022200078411, 0.09124963244903293], "isController": false}, {"data": ["Post User Albums ", 5, 0, 0.0, 353.8, 334, 371, 361.0, 371.0, 371.0, 371.0, 0.8742787200559539, 1.2562633873929008, 0.2236924068893163], "isController": false}, {"data": ["Post Request", 5, 0, 0.0, 353.4, 332, 371, 360.0, 371.0, 371.0, 371.0, 0.8755034144633165, 1.2771748052004903, 0.21032601558396077], "isController": false}, {"data": ["Get Albums Photos", 5, 0, 0.0, 653.0, 153, 1842, 476.0, 1842.0, 1842.0, 1842.0, 0.6534239414532148, 7.700575625653424, 0.09252585108468374], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 356.2, 335, 375, 353.0, 375.0, 375.0, 375.0, 0.8712319219376198, 1.1062263133821224, 0.18973117050008712], "isController": false}, {"data": ["Options Albums Photos", 5, 0, 0.0, 354.4, 337, 369, 361.0, 369.0, 369.0, 369.0, 0.8112932013629726, 0.9588154612201849, 0.11804949902644815], "isController": false}, {"data": ["Post Albums Photos", 5, 0, 0.0, 352.6, 339, 368, 353.0, 368.0, 368.0, 368.0, 0.8741258741258742, 1.258092493444056, 0.35340635926573427], "isController": false}, {"data": ["Post User Posts", 5, 0, 0.0, 378.2, 340, 429, 362.0, 429.0, 429.0, 429.0, 0.8674531575294934, 1.244930820610687, 0.42101974540249826], "isController": false}, {"data": ["Put Post request", 5, 0, 0.0, 463.8, 338, 736, 425.0, 736.0, 736.0, 736.0, 0.8159268929503916, 1.1026168305319843, 0.22151140257832896], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 1, 100.0, 1.1764705882352942], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 85, 1, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Posts By Id", 5, 1, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
