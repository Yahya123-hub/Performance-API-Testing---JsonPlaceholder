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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8764705882352941, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Todos"], "isController": false}, {"data": [0.9, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [0.9, 500, 1500, "Get User Albums "], "isController": false}, {"data": [0.3, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Todos"], "isController": false}, {"data": [0.9, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.8, 500, 1500, "Get Posts"], "isController": false}, {"data": [0.8, 500, 1500, "Get User Todos"], "isController": false}, {"data": [0.8, 500, 1500, "Post User Albums "], "isController": false}, {"data": [0.9, 500, 1500, "Post Request"], "isController": false}, {"data": [1.0, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Post"], "isController": false}, {"data": [0.9, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [0.8, 500, 1500, "Post User Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 85, 4, 4.705882352941177, 433.8705882352941, 149, 2309, 367.0, 862.8, 1079.4000000000003, 2309.0, 5.888057633693544, 22.891988778054863, 1.2332179533804377], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 5, 0, 0.0, 182.2, 158, 205, 186.0, 205.0, 205.0, 205.0, 0.9349289454001496, 2.594427823485415, 0.1333004160433807], "isController": false}, {"data": ["Post User Todos", 5, 0, 0.0, 385.0, 339, 422, 403.0, 422.0, 422.0, 422.0, 0.8275405494869249, 1.1871651046838796, 0.23032134433962265], "isController": false}, {"data": ["Get Post Comments By Id", 5, 0, 0.0, 420.6, 153, 1341, 202.0, 1341.0, 1341.0, 1341.0, 0.796431984708506, 2.2099432044440905, 0.11433154467983435], "isController": false}, {"data": ["Get User Albums ", 5, 0, 0.0, 394.4, 163, 1225, 184.0, 1225.0, 1225.0, 1225.0, 0.5979430758191819, 1.2554468877062903, 0.08408574503707247], "isController": false}, {"data": ["Get Posts By Id", 5, 3, 60.0, 395.2, 149, 830, 172.0, 830.0, 830.0, 830.0, 0.830702774547267, 1.3260417531982056, 0.1111389454228277], "isController": false}, {"data": ["Options User Todos", 5, 0, 0.0, 385.6, 342, 409, 407.0, 409.0, 409.0, 409.0, 0.8361204013377926, 0.9881571383779264, 0.1200290029264214], "isController": false}, {"data": ["Options User Albums ", 5, 0, 0.0, 454.2, 335, 829, 354.0, 829.0, 829.0, 829.0, 0.8269930532583526, 0.9767240220807145, 0.11952633972874627], "isController": false}, {"data": ["Get Posts", 5, 0, 0.0, 498.6, 330, 713, 424.0, 713.0, 713.0, 713.0, 0.5806526535826269, 16.354785122227383, 0.07655088694692834], "isController": false}, {"data": ["Get User Todos", 5, 1, 20.0, 609.0, 157, 2309, 200.0, 2309.0, 2309.0, 2309.0, 0.5983008256551394, 2.1069070090941726, 0.08355177545770014], "isController": false}, {"data": ["Post User Albums ", 5, 0, 0.0, 590.2, 367, 918, 433.0, 918.0, 918.0, 918.0, 0.8320852055250457, 1.1961224829422532, 0.21289680063238475], "isController": false}, {"data": ["Post Request", 5, 0, 0.0, 518.2, 359, 1015, 406.0, 1015.0, 1015.0, 1015.0, 0.8283631544068919, 1.2113193236414845, 0.1990013046719682], "isController": false}, {"data": ["Get Albums Photos", 5, 0, 0.0, 191.4, 162, 216, 199.0, 216.0, 216.0, 216.0, 0.8006405124099278, 9.435048038430745, 0.11337194755804643], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 377.2, 338, 409, 382.0, 409.0, 409.0, 409.0, 0.8361204013377926, 1.0636039402173911, 0.1820848139632107], "isController": false}, {"data": ["Options Albums Photos", 5, 0, 0.0, 466.0, 343, 805, 396.0, 805.0, 805.0, 805.0, 0.8177952240758913, 0.9658608828099444, 0.1189955941282303], "isController": false}, {"data": ["Post Albums Photos", 5, 0, 0.0, 507.2, 348, 876, 448.0, 876.0, 876.0, 876.0, 0.8210180623973727, 1.1818170155993433, 0.33193503694581283], "isController": false}, {"data": ["Post User Posts", 5, 0, 0.0, 626.6, 347, 1107, 412.0, 1107.0, 1107.0, 1107.0, 0.7960515841426524, 1.1421474486546728, 0.3863648801942366], "isController": false}, {"data": ["Put Post request", 5, 0, 0.0, 374.2, 340, 408, 362.0, 408.0, 408.0, 408.0, 0.8427439743805831, 1.1388565544412608, 0.22879182116972865], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 2,309 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 25.0, 1.1764705882352942], "isController": false}, {"data": ["The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 3, 75.0, 3.5294117647058822], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 85, 4, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 3, "The operation lasted too long: It took 2,309 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Posts By Id", 5, 3, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get User Todos", 5, 1, "The operation lasted too long: It took 2,309 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
