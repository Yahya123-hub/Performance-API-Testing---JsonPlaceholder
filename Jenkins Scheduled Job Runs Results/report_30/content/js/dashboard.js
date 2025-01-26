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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9235294117647059, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [0.9, 500, 1500, "Post User Todos"], "isController": false}, {"data": [0.9, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Albums "], "isController": false}, {"data": [0.6, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.8, 500, 1500, "Get Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Post User Albums "], "isController": false}, {"data": [0.9, 500, 1500, "Post Request"], "isController": false}, {"data": [1.0, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Delete Post"], "isController": false}, {"data": [1.0, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Post User Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 85, 2, 2.3529411764705883, 357.85882352941167, 147, 1329, 348.0, 533.4000000000002, 809.5000000000001, 1329.0, 6.383298287774107, 24.818738970036044, 1.3369431041604085], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 5, 0, 0.0, 236.2, 152, 555, 159.0, 555.0, 555.0, 555.0, 0.6269592476489029, 1.739689459247649, 0.08939067398119123], "isController": false}, {"data": ["Post User Todos", 5, 0, 0.0, 481.6, 350, 873, 403.0, 873.0, 873.0, 873.0, 0.6059137178865729, 0.8707642844158991, 0.1686380953102278], "isController": false}, {"data": ["Get Post Comments By Id", 5, 0, 0.0, 266.6, 158, 654, 160.0, 654.0, 654.0, 654.0, 0.6269592476489029, 1.7398119122257054, 0.09000293887147336], "isController": false}, {"data": ["Get User Albums ", 5, 0, 0.0, 232.2, 157, 304, 236.0, 304.0, 304.0, 304.0, 0.6235969069593416, 1.309066319531055, 0.08769331504115739], "isController": false}, {"data": ["Get Posts By Id", 5, 2, 40.0, 169.4, 152, 187, 167.0, 187.0, 187.0, 187.0, 0.6268806419257773, 1.0005602745737212, 0.08386977338264795], "isController": false}, {"data": ["Options User Todos", 5, 0, 0.0, 384.4, 335, 466, 368.0, 466.0, 466.0, 466.0, 0.602990834539315, 0.7111052068258563, 0.08656216081765557], "isController": false}, {"data": ["Options User Albums ", 5, 0, 0.0, 394.0, 342, 419, 407.0, 419.0, 419.0, 419.0, 0.5975857535556351, 0.705197875582646, 0.08636981594358789], "isController": false}, {"data": ["Get Posts", 5, 0, 0.0, 604.0, 289, 1329, 424.0, 1329.0, 1329.0, 1329.0, 0.6087168249330411, 17.145246492269294, 0.08025075328707085], "isController": false}, {"data": ["Get User Todos", 5, 0, 0.0, 229.4, 147, 398, 205.0, 398.0, 398.0, 398.0, 0.6235191420376606, 2.195591135116598, 0.08707347393689986], "isController": false}, {"data": ["Post User Albums ", 5, 0, 0.0, 375.8, 342, 408, 376.0, 408.0, 408.0, 408.0, 0.6032818532818532, 0.8680424635014479, 0.15435531792953666], "isController": false}, {"data": ["Post Request", 5, 0, 0.0, 447.6, 339, 785, 362.0, 785.0, 785.0, 785.0, 0.6144015728680265, 0.8980822990906857, 0.1476003778569673], "isController": false}, {"data": ["Get Albums Photos", 5, 0, 0.0, 206.6, 152, 247, 213.0, 247.0, 247.0, 247.0, 0.6260172780768749, 7.377466899336421, 0.08864502472768249], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 448.8, 331, 820, 351.0, 820.0, 820.0, 820.0, 0.6137228427642077, 0.7800992696698171, 0.1336525331410335], "isController": false}, {"data": ["Options Albums Photos", 5, 0, 0.0, 374.0, 348, 423, 363.0, 423.0, 423.0, 423.0, 0.5964451866873435, 0.7038519175712753, 0.08678743439102947], "isController": false}, {"data": ["Post Albums Photos", 5, 0, 0.0, 406.2, 345, 519, 384.0, 519.0, 519.0, 519.0, 0.6025548324897565, 0.869938539407086, 0.24361103579175705], "isController": false}, {"data": ["Post User Posts", 5, 0, 0.0, 455.8, 346, 822, 365.0, 822.0, 822.0, 822.0, 0.6106497313141181, 0.8768548485588665, 0.29637980123351243], "isController": false}, {"data": ["Put Post request", 5, 0, 0.0, 371.0, 341, 409, 352.0, 409.0, 409.0, 409.0, 0.6078288353999514, 0.8217560934840747, 0.16501603148553365], "isController": false}]}, function(index, item){
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
