(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

      // Define the schema
    myConnector.getSchema = function (schemaCallback) {
      
        var input = JSON.parse(tableau.connectionData); //user input from interactive phase 

        //api request to determine schema
        var settings = {
            "url": "https://" + input.companyId + ".aha.io/api/v1/bookmarks/custom_pivots/" + input.listId + "?view=list/APP-1?",
            "method": "GET",
            "timeout": 0,
            "async" : false, //wait for response before moving on to creating schema step 
            "headers": {
                "Authorization": "Bearer " + input.apikey,
            },
        };

        var cols = [];

        $.ajax(settings).done(function (response) {
            var feat = response.columns;

            feat.forEach((item) => {
                //response formatting since IDs can only contain alphanumeric values and underscores as per Tableau          
                var title = (item.title).replace(/\s/g, '') //removes whitespace 
                title = title.replace(/[()]/g, '')  //removes parenthesis 
                var obj = {
                    id: title,
                    dataType: tableau.dataTypeEnum.string
                }
                cols.push(obj);
            });

        });

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
        //accessing data retrieved from interactive phase 
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
            var rows = response.rows,  
                tableData = [];
            var columns = response.columns;

            // Iterate over the JSON object
            rows.forEach((row) => {
                var i = 0;
                var rowObj = {}; //creating a row object 

                columns.forEach((column) => {
                    //response formatting since IDs can only contain alphanumeric values and underscores as per Tableau          
                    var title = (column.title).replace(/\s/g, '') //removes whitespace 
                    title = title.replace(/[()]/g, '') //removes parenthesis 
                    rowObj[title] = row[i].plain_value;
                    i += 1;
                });

                tableData.push(rowObj);
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

            tableau.connectionData = JSON.stringify(information);

            tableau.connectionName = "Aha! Connection Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
