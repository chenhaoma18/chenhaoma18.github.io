(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    myConnector.init = function (initCallback) {
        initCallback();
        tableau.submit();
    };

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
        var api_key = "6ca8cd130f172749edff6c83ad90630ec3d1b081dd5b8570226c8f3fa087b641";
        console.log("test2")
        

        //change the url here so that its pointing to your API 
        $.getJSON("https://crossorigin.me/https://ge-dw.aha.io/api/v1/bookmarks/custom_pivots/6837530641511890383/6838682896900871649?view=list?access_token=" + api_key, function (resp) {
       //     resp.set('Access-Control-Allow-Origin', '*');
            var feat = resp.columns, //features should be whatever the object in the json file is 
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    //tells the mapping from the defined fields to the schema 
                    //maps the different objects in the json response to the schema you defined
                    "ReleaseName": feat[i].title,
                    "OriginalGADate": feat[i].title,
                    "ReleaseDate": feat[i].title,
                    "WorkspaceName": feat[i].title,
                    "Productline" :feat[i].title,
                    "ReleaseType" : feat[i].title,
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
