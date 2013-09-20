(function (global) {

    var resourceclient = function (ctor) {
        var _ = global._ || require('underscore')
        , dbc = global.dbc || require('dbc');
        
        dbc.required(ctor);
        dbc.isFunction(ctor);
        dbc.required(ctor.url, 'Cannot build a gateway for a ctor that does not have a url property');
        
        return {
            get: function (id) {
                var url = ctor.url + (id || '');
                return $.ajax({
                    dataType: "json",
                    url: url
                }).pipe(function(data) {
                    return _.isArray(data)
                        ? data.map(function(o) {
                            return new ctor(o);
                        })
                        : new ctor(data);
                });
            },
            
            create: function (data) {
                return $.ajax({
                    url: ctor.url,
                    type: 'POST',
                    data: JSON.stringify(data),
                    dataType: 'json',
                    contentType : 'application/json'
                }).pipe(function (result) {
                    return new ctor(result);
                });
            },

            update: function (id, data) {
                var url = ctor.url + (id || '');
                return $.ajax({
                    url: url,
                    type: 'PUT',
                    data: JSON.stringify(data),
                    dataType: 'json',
                    contentType: 'application/json'
                }).pipe(function (result) {
                    return new ctor(result);
                });
            },

            delete: function (id) {
                var url = ctor.url + (id || '');
                return $.ajax({
                    url: url,
                    type: 'DELETE'
                });
            }
        };
    };

    if (typeof define !== "undefined" && define !== null) {
        define('resourceclient', [], function () {
            return resourceclient;
        });
    } else if (typeof window !== "undefined" && window !== null) {
        window.resourceclient = resourceclient;
    }

    if (typeof module !== "undefined" && module !== null) {
        module.exports = resourceclient;
    }

})(this);
