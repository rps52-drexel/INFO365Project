(function () {

    $(document).ready(function () {
        var myConnector = tableau.makeConnector();

        myConnector.getSchema = function (schemaCallback) {
            var cols = [{
                id: "open",
                alias: "Open",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "high",
                alias: "High",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "date",
                alias: "Date",
                dataType: tableau.dataTypeEnum.date
            }, {
                id: "low",
                alias: "Low",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "close",
                alias: "Close",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "volume",
                alias: "Volume",
                dataType: tableau.dataTypeEnum.string
            }];

            var tableSchema = {
                id: "timeSeriesDaily",
                alias: tableau.connectionData,
                columns: cols
            };

            schemaCallback([tableSchema]);
        };

        myConnector.getData = function (table, doneCallback) {
            const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + tableau.connectionData + '&apikey=TTZNA7B3VCDYYHNZ&datatype=json'
            //const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=TSLA&apikey=QYOWP5SXIHB6BV3X'

            $.getJSON(url, function (data) {
                    var obj = JSON.parse(data);
                    var tableData = [];
                    for (var i = 0; i < obj.length; i++) {
                        var ref = obj[i];

                        tableData.push({
                            "open": ref.open,
                            "high": ref.high,
                            "low": ref.low,
                            "close": ref.close,
                            "volume": ref.volume
                        });
                    }
                    table.appendRows(tableData);
                    doneCallback();
            });
        };
        //     $.getJSON(url, function (resp {
        //
        //         resp = resp.json();
        //         const feat = resp['Monthly Time Series'];
        //         var tableData = [];
        //
        //         for (var i = 0, len = Object.keys(feat).length; i < len; i++) {
        //             tableData.push({
        //                 "open": feat[i].open,
        //                 "high": feat[i].high,
        //                 "low": feat[i].low,
        //                 "close": feat[i].close,
        //                 "volume": feat[i].volume
        //             });
        //         }
        //         table.appendRows(tableData);
        //         doneCallback();
        //     });
        // };
        //     $.ajax({
        //         dataType: "json",
        //         url: url,
        //         data: {},
        //         success: function(data) {
        //             const allRows = []
        //             const timeSeries = data['Time Series (Daily)']
        //             const keys = Object.keys(timeSeries)
        //             for (var i = 0 ; i < keys.length ; i++) {
        //                 const key = keys[i]
        //                 const actual = timeSeries[key]
        //                 const expected = {}
        //                 expected.open = actual['1. open'] ? actual['1. open'] : '--'
        //                 expected.high = actual['2. high'] ? actual['2. high'] : '--'
        //                 expected.low = actual['3. low'] ? actual['3. low'] : '--'
        //                 expected.close = actual['4. close'] ? actual['4. close'] : '--'
        //                 expected.volume = actual['5. volume'] ? actual['5. volume'] : '--'
        //                 expected.date = key
        //                 allRows.push(expected)
        //                 }
        //
        //             table.appendRows(allRows)
        //             doneCallback();
        //         }
        //     });
        // };

        tableau.registerConnector(myConnector);

        $("#submitButton").click(function () {
            tableau.connectionData = $("#submitSymbol").val();

            tableau.connectionName = tableau.connectionData;
            tableau.submit();
        });
    });
})();

