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
                id: "timeSeriesMonthly",
                alias: tableau.connectionData,
                columns: cols
            };

            schemaCallback([tableSchema]);
        };

        myConnector.getData = function (table, doneCallback) {
            const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=' + tableau.connectionData + '&apikey=TTZNA7B3VCDYYHNZ'
            //const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=TSLA&apikey=QYOWP5SXIHB6BV3X'

            $.getJSON(url,function (data) {
                    const obj = data['Monthly Time Series'];
                    var tableData = [];
                    const len = Object.keys(obj);

                    for (var i = 0; i < len; i++) {
                        var ref = obj[i];

                        tableData.push({
                            "open": ref["1. open"],
                            "high": ref["2. high"],
                            "low": ref["3. low"],
                            "close": ref["4. close"],
                            "volum": ref["5. volume"]
                        });
                    }
                    table.appendRows(tableData);
                    doneCallback();
                });
        };
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

