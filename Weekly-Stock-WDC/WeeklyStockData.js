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
                id: "timeSeriesWeekly",
                alias: tableau.connectionData,
                columns: cols
            };

            schemaCallback([tableSchema]);
        };

        myConnector.getData = function (table, doneCallback) {
            const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=' + tableau.connectionData + '&outputsize=full&apikey=TTZNA7B3VCDYYHNZ'

            $.getJSON(url,function (data) {
                const weeklyTimeSeries = data['Weekly Time Series'];
                var tableData = [];
                const keys = Object.keys(weeklyTimeSeries);

                for (var i = 0; i < keys.length; i++) {
                    var date = keys[i];
                    var weeklyData = weeklyTimeSeries[date];

                    tableData.push({
                        "open": weeklyData['1. open'],
                        "high": weeklyData['2. high'],
                        "low": weeklyData['3. low'],
                        "close": weeklyData['4. close'],
                        "volume": weeklyData['5. volume'],
                        "date": date
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

