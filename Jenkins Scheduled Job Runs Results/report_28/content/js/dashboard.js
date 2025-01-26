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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8705882352941177, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get Post Comments"], "isController": false}, {"data": [0.9, 500, 1500, "Post User Todos"], "isController": false}, {"data": [0.7, 500, 1500, "Get Post Comments By Id"], "isController": false}, {"data": [0.9, 500, 1500, "Get User Albums "], "isController": false}, {"data": [0.4, 500, 1500, "Get Posts By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Options User Albums "], "isController": false}, {"data": [0.8, 500, 1500, "Get Posts"], "isController": false}, {"data": [0.8, 500, 1500, "Get User Todos"], "isController": false}, {"data": [0.9, 500, 1500, "Post User Albums "], "isController": false}, {"data": [0.9, 500, 1500, "Post Request"], "isController": false}, {"data": [1.0, 500, 1500, "Get Albums Photos"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Post"], "isController": false}, {"data": [0.9, 500, 1500, "Options Albums Photos"], "isController": false}, {"data": [0.9, 500, 1500, "Post Albums Photos"], "isController": false}, {"data": [0.8, 500, 1500, "Post User Posts"], "isController": false}, {"data": [0.9, 500, 1500, "Put Post request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 85, 4, 4.705882352941177, 418.6117647058823, 145, 1190, 366.0, 819.8, 1080.2000000000005, 1190.0, 5.9216943012400725, 23.033036849484464, 1.2402629493520971], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get Post Comments", 5, 0, 0.0, 202.6, 152, 299, 200.0, 299.0, 299.0, 299.0, 0.6734006734006734, 1.8685553451178452, 0.0960122053872054], "isController": false}, {"data": ["Post User Todos", 5, 0, 0.0, 479.8, 341, 962, 372.0, 962.0, 962.0, 962.0, 0.7191140514885661, 1.033866900977995, 0.20014404753343878], "isController": false}, {"data": ["Get Post Comments By Id", 5, 0, 0.0, 530.8, 153, 978, 508.0, 978.0, 978.0, 978.0, 0.6690753378830456, 1.8566840626254517, 0.09604890104375753], "isController": false}, {"data": ["Get User Albums ", 5, 0, 0.0, 383.2, 152, 1124, 198.0, 1124.0, 1124.0, 1124.0, 0.6335529650278763, 1.3303374857450583, 0.0890933857070451], "isController": false}, {"data": ["Get Posts By Id", 5, 3, 60.0, 367.8, 145, 1190, 152.0, 1190.0, 1190.0, 1190.0, 0.6793478260869565, 1.0844355044157608, 0.09088930876358695], "isController": false}, {"data": ["Options User Todos", 5, 0, 0.0, 381.8, 340, 409, 406.0, 409.0, 409.0, 409.0, 0.7295010213014298, 0.8620080427487599, 0.1047232911438576], "isController": false}, {"data": ["Options User Albums ", 5, 0, 0.0, 386.0, 340, 410, 407.0, 410.0, 410.0, 410.0, 0.7227522405319456, 0.8551627095981498, 0.10446028476438277], "isController": false}, {"data": ["Get Posts", 5, 0, 0.0, 571.8, 303, 1136, 455.0, 1136.0, 1136.0, 1136.0, 0.6096817461285209, 17.172662823131326, 0.08037796457749055], "isController": false}, {"data": ["Get User Todos", 5, 1, 20.0, 388.0, 151, 1179, 186.0, 1179.0, 1179.0, 1179.0, 0.6466632177961718, 2.2773407187661667, 0.09030550795395757], "isController": false}, {"data": ["Post User Albums ", 5, 0, 0.0, 397.0, 337, 536, 359.0, 536.0, 536.0, 536.0, 0.7813720893889671, 1.1249011075949367, 0.19992137443350524], "isController": false}, {"data": ["Post Request", 5, 0, 0.0, 502.6, 349, 909, 411.0, 909.0, 909.0, 909.0, 0.7288629737609329, 1.0669585914723032, 0.17509794096209913], "isController": false}, {"data": ["Get Albums Photos", 5, 0, 0.0, 259.2, 153, 457, 207.0, 457.0, 457.0, 457.0, 0.6552221202987812, 7.721639120036692, 0.09278047601887039], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 362.6, 344, 406, 352.0, 406.0, 406.0, 406.0, 0.7865345288658172, 1.0051358246814535, 0.17128632806355198], "isController": false}, {"data": ["Options Albums Photos", 5, 0, 0.0, 482.6, 367, 821, 407.0, 821.0, 821.0, 821.0, 0.7182876023559833, 0.8515636223243787, 0.10451645776468897], "isController": false}, {"data": ["Post Albums Photos", 5, 0, 0.0, 472.4, 369, 819, 389.0, 819.0, 819.0, 819.0, 0.7290755322251385, 1.052460402085156, 0.29476295931758534], "isController": false}, {"data": ["Post User Posts", 5, 0, 0.0, 483.4, 340, 759, 354.0, 759.0, 759.0, 759.0, 0.7217090069284064, 1.0366109447170901, 0.35028259418302543], "isController": false}, {"data": ["Put Post request", 5, 0, 0.0, 464.8, 346, 818, 384.0, 818.0, 818.0, 818.0, 0.7320644216691069, 0.9918615025622255, 0.19874405197657394], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 1,179 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 25.0, 1.1764705882352942], "isController": false}, {"data": ["The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 3, 75.0, 3.5294117647058822], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 85, 4, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 3, "The operation lasted too long: It took 1,179 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Posts By Id", 5, 3, "The result was the wrong size: It was 1,635 bytes, but should have been less than or equal to 1,634 bytes.", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get User Todos", 5, 1, "The operation lasted too long: It took 1,179 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
