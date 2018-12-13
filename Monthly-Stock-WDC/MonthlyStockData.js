(function () {

    $(document).ready(function () {
        var myConnector = tableau.makeConnector();

        myConnector.getSchema = function (schemaCallback) {
            var cols = [{
                id: "open",
                alias: tableau.connectionData + " Open",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "high",
                alias: tableau.connectionData + " High",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "date",
                alias: tableau.connectionData + " Date",
                dataType: tableau.dataTypeEnum.date
            }, {
                id: "low",
                alias: tableau.connectionData + " Low",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "close",
                alias: tableau.connectionData + " Close",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "volume",
                alias: tableau.connectionData + " Volume",
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

            $.getJSON(url,function (data) {
                const monthlyTimeSeries = data['Monthly Time Series'];
                var tableData = [];
                const keys = Object.keys(monthlyTimeSeries);

                for (var i = 0; i < keys.length; i++) {
                    var month = keys[i];
                    var monthlyData = monthlyTimeSeries[month];

                    tableData.push({
                        "open": monthlyData['1. open'],
                        "high": monthlyData['2. high'],
                        "low": monthlyData['3. low'],
                        "close": monthlyData['4. close'],
                        "volume": monthlyData['5. volume'],
                        "date": month
                    });
                }

                table.appendRows(tableData);
                doneCallback();
            });
        };

        tableau.registerConnector(myConnector);

        $("#submitButton").click(function () {
            tableau.connectionData = $("#ticker").val();

            tableau.connectionName = tableau.connectionData;
            tableau.submit();
        });
    });
})();

