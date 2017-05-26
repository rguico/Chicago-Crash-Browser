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

# Modules

**crashbrowser.js** - the entry point of the application. Has the logic that triggers searches. Also where events are assigned to various DOM elements.

**areas.js** - with *api/areas.json*, manages the list of neighborhoods and wards that can be preselected in the dropdown.

**crashes.js** - handles 
