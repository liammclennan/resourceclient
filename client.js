(function () {
    var _ = this._ || require('underscore')
        , dbc = this.dbc || require('dbc');

    var resourceclient = function (constructor) {
        dbc.required(constructor);
        dbc.isFunction(constructor);
        dbc.required(constructor.url, 'Cannot build a gateway for a constructor that does not have a url property');
        return {
            get: function (id) {
                var url = constructor.url + (id || '');
                return $.ajax({
                    dataType: "json",
                    url: url
                }).done(function(data) {
                    return _.isArray(data)
                        ? data.map(function(o) {
                            return new constructor(o);
                        })
                        : new constructor(data);
                });
            },
            
            create: function (data) {
                return $.ajax({
                    url: constructor.url,
                    type: 'POST',
                    data: JSON.stringify(data),
                    dataType: 'json',
                    contentType : 'application/json'
                });
            },

            update: function (id, data) {
                var url = constructor.url + (id || '');
                return $.ajax({
                    url: url,
                    type: 'PUT',
                    data: JSON.stringify(data),
                    dataType: 'json',
                    contentType: 'application/json'
                });
            },

            delete: function (id) {
                var url = constructor.url + (id || '');
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

})();
