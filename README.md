Backbone.CartoDB
================

this is a library that allows to access data from CartoDB using the SQL-API in the same way it works with REST

usage
-----

Add backbone.cartodb.js to your HTML. This library does **not** change Backbone.sync method so you could use it
as usual if you have another models in your app from a REST API or localstorage.

First you have to create a CartoDB instance linked to your account:

        var CartoDB = Backbone.CartoDB({
            user: 'YOURUSER' // you should put your account name here
                           // YOURUSER.cartobd.com
        });

Then you have to define a collection pointing to your public table:

        var WifiPlaces= CartoDB.CartoDBCollection.extend({
            table: 'nyc_wifi', //public table
            columns: {
                'address': 'address',
                'type': 'type',
                'name': 'name',
                'location': 'the_geom'
            }
        });

columns dict tells which columns you want to fetch and the name are going to have in the model, so you can access it using that name:

    var places = new WifiPlaces();
    places.fetch();
    places.each(function(p) {
        console.log(p.get('address'));
        console.log(p.get('location'));
    });


Now you can do all you have been doing with Backbone models, that is, bind events, etc.

more features
-------------

**PostGIS functions**

if you map a column using a PostGIS function it will be mapped to a object:

    columns: {
        'center': 'ST_Centroid(the_geom)',
        ...
    }

then model.get('center') will return a point in GeoJSON format (as javascript object)

**filter**

you could do:

    places.where = "type = 'Free'"

so you will only get models with type = Free

**raw sql**

if you feel like real men, you can do this:

    var MenList = CartoDB.CartoDBCollection.extend({
        sql: function() {
            return "select * from table";
        }
    });

all the columns will be mapped to model attributes. But be careful, geo types will not be converted.

examples
--------

You can take a look at exaples folder




