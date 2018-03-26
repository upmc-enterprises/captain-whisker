# Captain Whisker

Captain Whisker leverages Handlebars to make JSON templating easy in Node.js.  Coming from rails, I really missed
[Jbuilder](https://github.com/rails/jbuilder), and the existing similar solutions in Node.js were either abandoned or
not quite what I wanted.  It's probably overly simple and naive right now, but it works surprisingly well.

Here is a simple example:

```
// view.hbs
{{#jsonList users}}
  {
    "id": {{json id}},
    "firstName": {{json firstName}},
    "lastName": {{json lastName}}
  }
{{/jsonlist}}

// app.js
const CaptainWhisker = require('captain-whisker');
CaptainWhisker.initialize('./src');
CaptainWhisker.build(
  'view.hbs', 
  { 
    users: [
      {
        id: 1,
        firstName: 'Jerry',
        lastName: 'Seinfeld'
      },
      {
        id: 2,
        firstName: 'George',
        lastName: 'Costanza'
      },
      {
        id: 3,
        firstName: undefined,
        lastName: 'Kramer'
      }
    ]
  }
);
```

Would produce a JSON structure like this:

```
[
  {
    "id": 1,
    "firstName": "Jerry",
    "lastName": "Seinfeld"
  },
  {
    "id": 2,
    "firstName": "George",
    "lastName": "Costanza"
  },
  {
    "id": 3,
    "firstName": null,
    "lastName": "Kramer"
  }
]
```

## Finding template files

Calling `CaptainWhisker.initialize('./root')` will search your source directory and all subdirectories for files with an
`.hbs` extension.  This shold be done once per process; CaptainWhisker will store store the precompiled templates so
they don't need to be compiled with every use.  Any `.hbs` files it finds that don't start with `_` will be compiled and
registered as templates, usable with `CaptainWhisker.build('path/relative/to/root.hbs', context)`.  

Any files that have names beginning with an underscore will be considered partials.

## Partials support

CaptainWhisker supports partials, so you can reuse pieces of templates across your views.  For example:

```
// _user.hbs
{
  "id": {{json id}},
  "firstName": {{json firstName}},
  "lastName": {{json lastName}}
}

// index.hbs
{{#jsonList users}}
  {{> _user}}
{{/jsonList}}

// update.hbs - pass a context object and a param to the partial
{{> _user user id=foo.id}}
```

For details on passing partial contexts and parameter, see the [Handlebars](http://handlebarsjs.com/partials.html)
documentation.
