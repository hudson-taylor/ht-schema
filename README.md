ht-schema
=========

[![Build Status](https://travis-ci.org/hudson-taylor/ht-schema.svg?branch=master)](https://travis-ci.org/hudson-taylor/ht-schema)

Every API function in HT requires a schema that defines the kind of data that 
function takes. While this may seem laborious at first, HT schemas are very 
pragmatic, combine both validation and coersion in one. This means you are 
free to assume that your data is valid and properly typed every time, no more 
manual validation or type casting required.

Schemas are inherently composible, you can nest schemas inside schemas, infact
this is what happens when you add a String attribute to an Object schema anyway.

Schemas are also extensible, the default ones are defined in lib/schema.js and
they are quite easy to read and create your own. 

Here is an example schema:

```javascript
var tagSchema = s.Object({
    id:    MyCustomValidator(),
    label: s.String()
});

var movieSchema = s.Object({
    releaseDate: s.Date({ min: '1900', max: new Date() }),
    runningTime: s.Number({ min: 0, max: 240 }),
    director:    s.String(),
    genre:       s.String({ enum: [ "Comedy", "Drama", "Action" ] }),
    tags:        s.Array([ tagSchema ]),
    extraInfo:   s.Object({ opt: true, strict: false })
});
```

## Built-in Schema types and their default attributes:

### s.Object { opt: false, strict: true }
 
An object validator with one string attribute:
```javascript
s.Object({ name: s.String()});
```
   
A liberal object validator that can have any attribute:
```javascript
s.Object({strict: false});
```
A liberal object validator that can have any attribute but specifies that a 
cat attribute must be an object with a name:
```javascript
s.Object({strict: false}, { cat: s.Object({ name: s.String() }) });
```

An object validator that requires a foo attribute but remaps it to bar in output.
```javascript
s.Object({ 'foo as bar': s.String() });
```


### s.Number { opt: false }

### s.String { opt: false, min: null, max: null, enum: null, trim: null, upper: null, lower: null, regex: null }

A string validator with an enum restriction
```javascript
s.String({ enum: [ "apples", "oranges" ] });
```

A string validator with a length limit
```javascript
s.String({ len: 10  });
s.String({ max: 256 });
s.String({ min: 1   });
```

A string validator that coerces the value
```javascript
s.String({ trim: true  });
s.String({ upper: true });
s.String({ lower: true });
```

A string validator that matches a regex (regex can optionally be passed in as a string)
```javascript
s.String({ regex: /h[ae]llo world/ });
```

### s.Array { opt: false }

An array validator which can only contain Dates.
```javascript
s.Array([ s.Date() ]);
```
An optional array validator which can contain cats and dogs.

Note: Array validators match in precidence left to right.
```javascript
var catSchema = s.Object({ 
    name:     s.String(), 
    attitude: s.String({ enum: [ "Surly", "Dissinterested", "bemused" ] })
});

var dogSchema = s.Object({ 
    name:     s.String(), 
    attitude: s.String({ enum: [ "Excited", "Confused", "Happy" ]})
});

s.Array({ opt: true }, [ catSchema, dogSchema ]);
```

### s.Boolean { opt: false, coerce: false }

If coerce is set, truthy and falsy values will be converted to true/false

### s.Date { opt: false, min: null, max: null }

### s.Email { opt: false, normalize: true }

If normalize is true (default) then the output email will be lowercased.
