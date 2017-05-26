# Quick start

## Install gulp

Gulp is used to copy all of project's files in various subdirectories into a single directory.

It's also used to deploy the website, assuming you have permission to. :-D

```
npm install gulp-cli -g
npm install gulp -D
```

## Install webpack

Webpack helps us write more modular JavaScript. We can avoid keeping all of the logic in one file and split it out into files that make a little more sense.

In addition, we use ```babel-loader```. This lets us write [ES6 JavaScript](http://es6-features.org/#Constants), which is converted back to ES5 (regular) JavaScript when deploying the website.

```
npm install --save-dev webpack
```

That's it!

# CSS / styling

Bootstrap.

# Modules

**crashbrowser.js** - the entry point of the application. Has the logic that triggers searches. Also where events are assigned to various DOM elements.

**areas.js** - with *api/areas.json*, manages the list of neighborhoods and wards that can be preselected in the dropdown.

**crashes.js** - manages instances of SummaryObject, which keeps track of crashes per type.

**ccb-control.js** - a custom Leaflet control for the map.

**ccb.util.js** - convenience functions that don't really belng anywhere else!

**map.js** - manages all of the objects that have to do with the map, including placing icons, drawing circles or shapes, managing layers, and making sure markers don't go out of control.

**summary.js** - manages the textual and chart outputs of the map.
