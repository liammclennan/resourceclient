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
                var promise = Q.promise(function(resolve, reject) {
                    $.ajax({
                        dataType: "json",
                        url: url
                    }).then(function (data,result) {
                        resolve(_.isArray(data)
                            ? data.map(function(o) {
                                return new ctor(o);
                            })
                            : new ctor(data));
                    }, function (jqXHR, textStatus, errorThrown) {
                        reject(textStatus + ' ' + errorThrown);
                    });
                });
                return promise
            },
            
            create: function (data) {
                var promise = Q.promise(function (resolve,reject) {
                    $.ajax({
                        url: ctor.url,
                        type: 'POST',
                        data: JSON.stringify(data),
                        dataType: 'json',
                        contentType : 'application/json'
                    }).then(function (data,result) {
                        resolve(new ctor(data));
                    }, function (jqXHR, textStatus, errorThrown) {
                        reject(textStatus + ' ' + errorThrown);
                    });
                });
                return promise;
            },

            update: function (id, data) {
                var url = ctor.url + (id || '');
                var promise = Q.promise(function (resolve,reject) {
                    $.ajax({
                        url: url,
                        type: 'PUT',
                        data: JSON.stringify(data),
                        dataType: 'json',
                        contentType: 'application/json'
                    }).then(function (data,result) {
                        if (!data || result == 'nocontent') throw new Error('Update action did not return the object');
                        resolve(new ctor(data));
                    }, function (jqXHR, textStatus, errorThrown) {
                        reject(textStatus + ' ' + errorThrown);
                    });
                });
                return promise;
            },

            'delete': function (id, info) {
                if (info == null) {
                    info = {};
                }
                var url = ctor.url + (id || '');
                var promise = Q.promise(function (resolve,reject) {
                    $.ajax({
                        url: url,
                        type: 'DELETE',
                        data: JSON.stringify(info),
                        dataType: 'json',
                        contentType: 'application/json'
                    }).then(function (data, result) {
                        resolve(data ? new ctor(data) : null);
                    }, function (jqXHR, textStatus, errorThrown) {
                        reject(textStatus + ' ' + errorThrown);
                    });
                });
                return promise;
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
