(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    /*myConnector.init = function (initCallback) {
        initCallback();
        tableau.submit();
    }; */

    // Define the schema
    myConnector.getSchema = function (schemaCallback) {
        var cols = [{
            id: "ReleaseName", //put the column headers that you want 
            dataType: tableau.dataTypeEnum.string // this specifies what type of data it is in the json file
        }, {
            id: "OriginalGADate",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "ReleaseDate",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "WorkspaceName",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "Productline",
            dataType: tableau.dataTypeEnum.string
        },
        {
            id: "ReleaseType",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "ahaconnector",
            alias: "connecting to aha",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };
    // Download the data and push to table object 
    myConnector.getData = function (table, doneCallback) {
  
        var settings = {
            "url": "https://ge-dw.aha.io/api/v1/bookmarks/custom_pivots/6837530641511890383?view=list/APP-1?",
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": "Bearer 6ca8cd130f172749edff6c83ad90630ec3d1b081dd5b8570226c8f3fa087b641",
               // "Cookie": "_aha_t=6839706221717396714"
            },
        };

        $.ajax(settings).done(function (response) {
            var feat = response.rows, //features should be whatever the object in the json file is 
                tableData = [];

            // Iterate over the JSON object
            for (row in feat) {
                tableau.log(row)
               
                tableData.push({
                    //tells the mapping from the defined fields to the schema 
                    //maps the different objects in the json response to the schema you defined
                    "ReleaseName": row[0].richValue,
                    "OriginalGADate": row[1].richValue,
                    "ReleaseDate": row[2].richValue,
                    "WorkspaceName": row[3].richValue,
                    "Productline": row[4].richValue,
                    "ReleaseType": row[5].richValue,
                });
               
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Aha! Connection Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
