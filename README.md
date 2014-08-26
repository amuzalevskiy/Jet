Javascript extended type library (Jet)
========================================

## Getting Started
   1. Download and install [Node.js](http://nodejs.org/#download)
   2. Clone this repository
   3. On the command line, type `npm install nodemon -g` to install the [nodemon](https://github.com/remy/nodemon) library globally.  If it complains about user permissions type `sudo npm install nodemon -g`.
   4.  If you have installed [Grunt](http://gruntjs.com/) globally in the past, you will need to remove it first by typing `npm uninstall -g grunt`.  If it complains about user permissions, type `sudo npm uninstall -g grunt`.
   5.  Next, install the latest version of [Grunt](http://gruntjs.com/) by typing `npm install -g grunt-cli`.  If it complains about user permissions, type `sudo npm install -g grunt-cli`. 
   6. Navigate to inside of the **Backbone-Require-Boilerplate** folder and type `npm install`
   7. Next, type `nodemon` (this will start your Node.js web server and restart the server any time you make a file change thanks to the wonderful **nodemon** library)
   8. To view the demo page, go to `http://localhost:8001`
   9. To view the Jasmine test suite page, go to `http://localhost:8001/specRunner.html`
   10. Enjoy using Backbone, Require, Grunt, Lodash, Almond, jQuery, jQueryUI, jQuery Mobile, Twitter Bootstrap, and Jasmine (enjoyment optional)

## Tour of the Jet files

index.html
----------
Uses a large portion of the [HTML5 Boilerplate](https://github.com/h5bp/html5-boilerplate) HTML and CSS.  As you continue down the page to the first `<script>` tag, you will notice there is a `production` local JavaScript variable that is used to communicate to your application whether you would like to load production or development CSS and JavaScript files.

_Mobile Detection Script_

There is also a simple JavaScript mobile browser detection script that stores different production/development CSS and JavaScript files within a local `config` object based on whether a user is using a mobile or desktop browser.


_Loading Files_

The `loadFiles()` method is then used to load all of the correct CSS and JavaScript files.  Below is what get's included:

_Production Mode_

In production mode, your app's single minified and concatenated JavaScript file is loaded using Almond.js instead of Require.js.  Your application's minfied common CSS file is also included.

_Development Mode_

In development mode, your app's non-minified JavaScript files are loaded using Require.js instead of Almond.js.  Your application's non-minified common CSS file is also included.

_Loader Methods_

You will notice that the CSS files and the Require.js file are being included on the page via the `loadFiles()` method (which uses the `loadCss()` and `loadJS()` methods internally).  Require.js does not officially support [loading CSS files](http://requirejs.org/docs/faq-advanced.html#css), which is why I included the `loadCSS()` method to asynchronously include CSS files.  Loading CSS asynchronously also allows the flexibilty/mechanism to load different CSS files if a user is on a mobile/desktop device.

> Feel free to use the `loadCSS()` and `loadJS()` methods to load any other dependencies your application may have that you do not want to use Require.js for.

Gruntfile.js
------------
This file is ready made for you to have your entire project optimized using Grunt.js, the [Require.js Optimizer](https://github.com/jrburke/r.js/) and [almond.js](https://github.com/jrburke/almond).

Grunt.js is a JavaScript command line task runner that allows you to easily automate common development tasks such as code linting, minification, and unit testing.

> Running the Jasmine Tasks with Grunt has not been implemented yet.

Almond.js a lightweight AMD shim library created by [James Burke](https://github.com/jrburke), the creator of Require.js.  Almond is meant for small to medium sized projects that use one concatenated/minified JavaScript file.  If you don't need some of the advanced features that Require.js provides (lazy loading, etc) then Almond.js is great for performance.

Backbone-Require-Boilerplate sets you up to use Require.js in development and Almond.js in production.  By default, Backbone-Require-Boilerplate is in _development_ mode, so if you want to try out the production build, read the production instructions below.

**Production Build Instructions**

Navigate to the root directory of the Backbone-Require-Boilerplate folder and type **grunt** and wait a few seconds for the build to complete.

**Note:** If you are on a Windows machine, you will have to type `grunt.cmd`

Once the script has finished, you will see that both _DesktopInit.min.js_ and _MobileInit.min.js_, and the _mobile.min.css_ and _desktop.min.css_ files will be created/updated.

Next, update the `production` local variable inside of **index.html** to be **true**.

And that's it!  If you have any questions just create in an issue on Github.

SpecRunner.html
---------------
This file is the starting point to your Jasmine test suite and outputs the results of your Jasmine tests.  It includes Require.js and points it to **testInit.js** for all of the proper configurations.

TestInit.js
-----------
This file includes all of the Require.js configurations for your Jasmine unit tests.  This file will look very similar to the **Init.js** file, but will also include Jasmine and the jasmine-jquery plugin as dependencies.

You will also notice a _specs_ array that will allow you to add as many specs files as your application needs (Specs folders are where your unit tests are).  The boilerplate only includes one specs js file by default, so only one specs item is added to the array.  Finally, once the specs file is included by the `require()` call, Jasmine is initialized

spec.js
-------
This file contains all of your Jasmine unit tests.  Only seven tests are provided, with unit tests provided for Views, Models, Collections, and Routers (Mobile and Desktop).  I'd write more, but why spoil your fun?  Read through the tests and use them as examples to write your own.

The entire file is wrapped in an AMD define method, with all external module (file) dependencies listed.  The Jasmine tests should be self explanatory (BDD tests are supposed to describe an app's functionality and make sense to non-techy folk as well), but if you have any questions, just file an issue and I'll respond as quickly as I can.


## FAQ

** What libraries have you included?**

   -Require, Grunt, Lodash, Almond, jQuery and Jasmine (w/the jasmine-jquery plugin)

## Change Log

`0.0.1` - Aug 27, 2014

- Initial release, based on https://github.com/BoilerplateMVC/Backbone-Require-Boilerplate
- realization of views, view collections, models (Need to rewrite and add tests... it is completely NOT understandable)
- Button component
- Panel component
- Basic D&D support

## Contributors
* [Andrii Muzalevskyi](https://github.com/amuzalevskiy)

## License
Copyright (c) 2012 Andrii Muzalevskyi
Licensed under the MIT license.		
		  

	

