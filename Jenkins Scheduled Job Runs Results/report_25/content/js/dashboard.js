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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9117647058823529, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [0.9, 500, 1500, "Post User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Albums "], "isController": false}, {"data": [0.6, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [0.9, 500, 1500, "Options User Todos"], "isController": false}, {"data": [0.9, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.6, 500, 1500, "Get Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Todos"], "isController": false}, {"data": [0.9, 500, 1500, "Post User Albums "], "isController": false}, {"data": [1.0, 500, 1500, "Post Request"], "isController": false}, {"data": [1.0, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Post"], "isController": false}, {"data": [1.0, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Posts"], "isController": false}, {"data": [0.9, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 85, 2, 2.3529411764705883, 389.635294117647, 143, 1510, 390.0, 620.2000000000011, 968.2000000000005, 1510.0, 6.080114449213162, 23.642452387339056, 1.2734430883404864], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 5, 0, 0.0, 314.8, 149, 819, 204.0, 819.0, 819.0, 819.0, 0.6786102062975027, 1.8830107814196524, 0.09675497081976113], "isController": false}, {"data": ["Post User Todos", 5, 0, 0.0, 524.0, 376, 1024, 408.0, 1024.0, 1024.0, 1024.0, 0.6611133148221605, 0.9493174005024462, 0.1840012643792146], "isController": false}, {"data": ["Get Post Comments By Id", 5, 0, 0.0, 190.2, 147, 206, 198.0, 206.0, 206.0, 206.0, 0.6784260515603798, 1.8824997879918588, 0.09739123982360923], "isController": false}, {"data": ["Get User Albums ", 5, 0, 0.0, 182.4, 154, 206, 182.0, 206.0, 206.0, 206.0, 0.7003782042302844, 1.4705206436475697, 0.09849068496988374], "isController": false}, {"data": ["Get Posts By Id", 5, 2, 40.0, 195.0, 143, 225, 202.0, 225.0, 225.0, 225.0, 0.6779661016949153, 1.0820974576271187, 0.09070444915254237], "isController": false}, {"data": ["Options User Todos", 5, 0, 0.0, 460.2, 345, 775, 411.0, 775.0, 775.0, 775.0, 0.6598917777484492, 0.7797549326910387, 0.09473055793849809], "isController": false}, {"data": ["Options User Albums ", 5, 0, 0.0, 461.6, 361, 736, 406.0, 736.0, 736.0, 736.0, 0.6554798112218144, 0.7760778546145779, 0.09473731646565285], "isController": false}, {"data": ["Get Posts", 5, 0, 0.0, 841.2, 409, 1510, 543.0, 1510.0, 1510.0, 1510.0, 0.5915759583530525, 16.66245322852579, 0.07799097107193563], "isController": false}, {"data": ["Get User Todos", 5, 0, 0.0, 268.2, 146, 405, 201.0, 405.0, 405.0, 405.0, 0.6832467887400929, 2.406309784094015, 0.09541434647444658], "isController": false}, {"data": ["Post User Albums ", 5, 0, 0.0, 553.8, 390, 1148, 408.0, 1148.0, 1148.0, 1148.0, 0.6598046978094484, 0.9483403849960411, 0.16881721760358934], "isController": false}, {"data": ["Post Request", 5, 0, 0.0, 388.6, 347, 414, 407.0, 414.0, 414.0, 414.0, 0.6511264487563485, 0.950746353691887, 0.1564229554629509], "isController": false}, {"data": ["Get Albums Photos", 5, 0, 0.0, 189.8, 154, 209, 204.0, 209.0, 209.0, 209.0, 0.6809206046574969, 8.024356742816288, 0.09641942155794635], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 382.8, 334, 411, 410.0, 411.0, 411.0, 411.0, 0.6514657980456027, 0.8280741042345277, 0.14187194625407165], "isController": false}, {"data": ["Options Albums Photos", 5, 0, 0.0, 405.8, 388, 413, 409.0, 413.0, 413.0, 413.0, 0.6513809275664408, 0.7712248404116727, 0.09478101387441376], "isController": false}, {"data": ["Post Albums Photos", 5, 0, 0.0, 411.2, 334, 511, 406.0, 511.0, 511.0, 511.0, 0.6494349915573451, 0.9369875552019743, 0.26256453760228604], "isController": false}, {"data": ["Post User Posts", 5, 0, 0.0, 383.8, 342, 414, 393.0, 414.0, 414.0, 414.0, 0.6606765327695561, 0.9492063623150107, 0.3206603874867865], "isController": false}, {"data": ["Put Post request", 5, 0, 0.0, 470.4, 336, 838, 404.0, 838.0, 838.0, 838.0, 0.6553079947575361, 0.8864576507208388, 0.17790588138925295], "isController": false}]}, function(index, item){
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
