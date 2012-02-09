$(document).ready(function() {

    module("CartoDB.SQL");

    var CartoDB = Backbone.CartoDB({
        user: 'test-user'
    });

    test("SQL format", function() {
        var s = CartoDB.SQL("{0} is {1}").format("CartoDB", "epic!");
        equals("CartoDB is epic!", s);
    });


    module("CartoDB.CartoDBModel");

    var last_query;
    var return_data = '';
    var query_stub = function(sql,callback) {
        last_query = sql;
        callback(return_data);
    };

    CartoDB = Backbone.CartoDB({
        user: 'test-user'
    }, query_stub);

    var Country = CartoDB.CartoDBModel.extend({
      table: 'test_table',
      columns: {
        'id': 'cartodb_id',
        'name': 'name_0',
        'center': 'ST_Centroid(the_geom)'
      },
      what: 'name'
    });
    return_data_model = { rows: [{
        'id': 1,
        'name': 'test',
        'center': '{"coordinates":[1,2]}'
    }]};

    test("query sql", function() {
        return_data = return_data_model;
        var c = new Country({'name': 'test_name'});
        c.fetch();
        equals("select cartodb_id as id,name_0 as name,ST_AsGeoJSON(ST_Centroid(the_geom)) as center from test_table where name_0 = 'test_name'", last_query);
    });

    test("value parsing", function() {
        return_data = return_data_model;
        var c = new Country({'name': 'test_name'});
        c.fetch();
        equals('test', c.get('name'));
        equals(1, c.get('id'));
        equals(1, c.get('center').coordinates[0]);
    });

    module("CartoDB.CartoDBCollecion");
    return_data_collection = { rows: [
        {
            'id': 1,
            'name': 'test',
            'center': '{"coordinates":[1,2]}'
        },
        {
            'id': 2,
            'name': 'test',
            'center': '{"coordinates":[1,2]}'
        }
    ]};

    var Countries = CartoDB.CartoDBCollection.extend({
      table: 'test_table',
      columns: {
        'id': 'cartodb_id',
        'name': 'name_0',
        'center': 'ST_Centroid(the_geom)'
      }
    });

    test("query sql", function() {
        return_data = return_data_collection;
        var c = new Countries();
        c.fetch();
        equals("select cartodb_id as id,name_0 as name,ST_AsGeoJSON(ST_Centroid(the_geom)) as center from test_table", last_query);
    });

    test("value parsing", function() {
        return_data = return_data_collection;
        var c = new Countries();
        c.fetch();
        equals(2, c.length);
        var row0 = c.get(1);
        equals('test', row0.get('name'));
        equals(1, row0.get('center').coordinates[0]);
    });

    var Custom = CartoDB.CartoDBCollection.extend({
        sql: function() {
           return "select cartodb_id as id,name_0 as name,ST_AsGeoJSON(ST_Centroid(the_geom)) as center from test_table";
        }
    });

    test("custom sql", function() {
        return_data = return_data_collection;
        var c = new Custom();
        c.fetch();
        equals(2, c.length);
        var row0 = c.get(1);
        equals('test', row0.get('name'));
        var center = JSON.parse(row0.get('center'));
        equals(1, center.coordinates[0]);
    });
});
