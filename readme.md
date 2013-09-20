resourceclient
==============

Resourceclient is a simple, resource-oriented http client. It makes the following demands of its resource types:

1. That they have a `url` property that defines the endpoint of the resource.
1. That they have a constructor that takes a single argument, which is an object containing the properties to be copied to the object.

Gateway methods return jquery promises. The server counterpart to resourceclient is [resourceserver](https://github.com/liammclennan/resourceserver).

eg. 

    function Person(data) {
        this.name = data.name;    
        // do your validation here
    }
    Person.url = '/people/';

A resource-specific gateway can then be created:

    var personGateway = resourclient(Person); 
    personGateway.create(new Person('Greg'));
    personGateway.get(1).then(function (person) {
        person instanceof Person;
        // => true
    });

