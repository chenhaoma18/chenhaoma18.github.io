(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();
    

    // Define the schema
    myConnector.getSchema = function (schemaCallback) {
        var cols = [{
            id: "ReleaseName", //put the column headers that you want 
            dataType: tableau.dataTypeEnum.string // this specifies what type of data you would like it to be represented as 
            //can add other fields such as alias: etc. 
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
            id: "Calculated",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            //can rename these to whatever you want 
            id: "ahaconnector",
            alias: "connecting to aha",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };
    // Download the data and push to table object 
    myConnector.getData = function (table, doneCallback) {
        var input = JSON.parse(tableau.connectionData);
  
        var settings = {
            "url": "https://"+ input.companyId + ".aha.io/api/v1/bookmarks/custom_pivots/" + input.listId +"?view=list/APP-1?",
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": "Bearer " + input.apikey,
            },
        };

        $.ajax(settings).done(function (response) {
            var feat = response.rows,  
                tableData = [];

            // Iterate over the JSON object
            feat.forEach((item) => {
                tableData.push({
                    //tells the mapping from the defined fields to the schema 
                    //maps the different objects in the json response to the schema you defined (refer to the json documentation for aha!)
                    "ReleaseName": item[0].rich_value, 
                    "OriginalGADate": item[1].rich_value,
                    "ReleaseDate": item[2].rich_value,
                    "WorkspaceName": item[3].rich_value,
                    "Productline": item[4].rich_value,
                    "Calculated": item[5].rich_value,
                });

            });

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function () {


            var information = {
                apikey: $('#api-key').val().trim(),
                listId: $('#list-id').val().trim(),
                companyId: $('#company-id').val().trim(),
            };

            //create object or table with the three different input values - can finish this easy by tomorrow morning

            tableau.connectionData = JSON.stringify(information);


            tableau.connectionName = "Aha! Connection Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
