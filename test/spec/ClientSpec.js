describe("Client", function() {

    describe('connecting to couch', function () {
        var Person,gateway;
        
        describe('a get', function () {
            beforeEach(function () {
            Person = dbc.makeConstructor({
                name: [{validator: 'type', args:['string']}],
                age: [{validator: 'type', args:['number']}]
            });
            Person.url = 'http://localhost:5984/';
            gateway = resourceclient(Person);
            });

            it('should 404', function () {
                var o = gateway.get('foo');
                o.then(function (data) {console.log(data);}, function (err) {console.log(err);});    
            });
            
        });
    });

    describe("creating a gateway", function () {
        var constructor = null;
        describe("with null constructor", function () {
            it("should throw", function() {
                expect(function () {
                    resourceclient(constructor);
                }).toThrow();
            });
        });

        describe("with non-constructor constructor", function () {
            it('should throw', function () {
                constructor = "adfad";
                expect(function () {
                    resourceclient(constructor);
                }).toThrow();
            });
        });

        describe("with a constructor", function () {
            beforeEach(function () {
                constructor = function (data) {
                    this.data = data;
                };
            });

            it('should throw', function () {
                expect(function () {
                    resourceclient(constructor);
                }).toThrow();
            });

            describe('with a url', function () {
                var gateway;
                beforeEach(function () {
                    constructor.url = 'http://localhost:3002/people/';
                    gateway = resourceclient(constructor);
                });

                it('should write a resource', function () {
                    gateway.create({
                        data: 'Foo'
                    });
                });
                
                it('should create a gateway', function () {
                    expect(gateway).not.toBe(null);
                });
                
                describe('get collection', function () {
                    var collection;
                    beforeEach(function () {
                        collection = gateway.get();
                    });
                    it('should return an array', function () {
                        expect(collection).not.toBe(null);
                    });
                });

                describe('get resource', function () {
                    var collection;
                    beforeEach(function () {
                        collection = gateway.get(1);
                    });
                    it('should return something', function () {
                        expect(collection).not.toBe(null);
                    });
                });
            });
        });
    });

});
