---
id: js-delivery-utilities
title: Utility functions in Mojito JS Delivery
sidebar_label: Utility functions
---
We've baked a series of utility functions into Mojito which we think are handy for a wide range of experiments. We often encounter race conditions or are waiting for an element to exist before we can do something on the page. These utilities will allow you to overcome the majority of these issues.

## Table of contents

-   [`Mojito.utils.domReady()`](#mojitoutilsdomready) - detect when DOM Content Loaded.
-   [`Mojito.utils.waitForElement()`](#mojitoutilswaitforelement) - wait for a single element to exist before performing an action.
-   [`Mojito.utils.waitUntil()`](#mojitoutilswaituntil) - wait until a condition is satisfied before performing an action.
-   [`Mojito.utils.observeSelector()`](#mojitoutilsobserveselector) - wait for elements to exist before performing an action.
-   [`Mojito.utils.watchElement()`](#mojitoutilswatchelement) - watch for element mutations before performing an action.
-   [`Mojito.utils.waitForIntersection()`](#mojitoutilswaitforintersection-added-in-270) - wait until an element is in the viewport.

## Mojito.utils.domReady()

### Description

A polyfill method to detect DOM Content Loaded, inspired by https:. Often used in trigger functions to delay activation until the DOM is ready.

### Syntax

`Mojito.utils.domReady(callback);`

| Parameter                                          |                                                    |
| -------------------------------------------------- | -------------------------------------------------- |
| **callback**  Type: _function_  _Required_ | A function that's executed when the DOM is loaded. |

| Return value     |                                                      |
| ---------------- | ---------------------------------------------------- |
| Type: _function_ | This function returns itself, allowing for chaining. |

### Example

Imagine you place the Mojito library inside the page header, but you need to Manipulate the DOM further down the page, you can delay experiment activation until DOM Content Loaded has fired.

```js
function(test){
    // If users are from Google, wait until Mojito.domReady() fires before activation
    if (document.referrer.indexOf('google.com') > -1) Mojito.utils.domReady(function(){
        test.activate();
    })
}
```

## Mojito.utils.waitForElement()

### Description

A function that executes a callback once the first selected DOM element is detected on the page. Under the hood, it's a simple wrapper of `Mojito.utils.observeSelector()`. Commonly used to wait for a specific element to exist before manipulating it or activating an experiment.

### Syntax

`Mojito.utils.waitForElement(selector, callback, timeout);`

| Parameter                                                  |                                                                                                                                                                                                       |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **selector**  Type: _CSS selector_  _Required_     | A CSS selector specifying the DOM element to wait for.                                                                                                                                                |
| **callback**  Type: _function_  _Required_         | A function that's executed once first matched element exists.                                                                                                                                         |
| **timeout**  Type: _integer_ or _null_  _Optional_ | Time in milliseconds which the function will wait for the selected element to exist. Defaults to `Mojito.options.defaultWaitTimeout` (2000ms by default). Set to `null` for no timeout. |

| Return value |   |
| ------------ | - |
| N/A          |   |

### Example

Let's say you are transforming many elements on a page and one of the elements is injected by another script some time after DOM Content Loaded. We can delay activation until the moment the element gets injected.

```js
function(test){
    // Wait up to 4 seconds for an element to exist before activating experiment
    Mojito.utils.waitForElement('.someDelayedElement', test.activate, 4000);
}
```

## Mojito.utils.waitUntil()

### Description

A utility that executes a callback once a polled condition function returns true. Commonly used to run functions off the back of actions or changes on a page that can be detected with JS.

### Syntax

`Mojito.utils.waitUntil(conditionFunction, callback, timeout);`

| Parameter                                                   |                                                                                                                                                                                                                                                     |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **conditionFunction**  Type: _function_  _Required_ | A function that returns a boolean. `true` if a condition is matched and `false` if a condition not yet matched.                                                                                                                       |
| **callback**  Type: _function_  _Required_          | A function that's executed once **conditionFunction** returns `true`                                                                                                                                                                         |
| **timeout**  Type: _integer_   _Optional_           | Total time in milliseconds which the function will poll the **conditionFunction**. Defaults to `Mojito.options.defaultWaitTimeout` (2000ms by default). Polling interval defaults to `Mojito.options.waitInterval` (50ms by default). |

| Return value |   |
| ------------ | - |
| N/A          |   |

### Example

Imagine that your experiment leverages a JS framework, e.g. jQuery, but Mojito is loaded before the framework. Premature activation will likely result in JS errors on the jQuery calls. We can delay the experiment from activating until jQuery has been included on the page.

```js
function(test){
    // Wait until jQuery exists on the page before activating
    Mojito.utils.waitUntil(function() {
        if(window.jQuery) {
            return true;
        }
        else {
            return false;
        }
    }, test.activate);
}
```

## Mojito.utils.observeSelector()

### Description

A wrapper of [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe) which is set to only observe the selected element being added to the DOM, and executing a callback once that happens. Commonly used to detect and manipulate elements that are dynamically injected independent of initial page load.

### Syntax

`Mojito.utils.observeSelector(selector, callback, options);`

| Parameter                                              |                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **selector**  Type: _CSS Selector_  _Required_ | A CSS selector specifying the DOM element to observe.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **callback**  Type: _function_  _Required_     | A function that's executed once the matched element is added to the page. The first argument of the function is the matched element.                                                                                                                                                                                                                                                                                                                                   |
| **options**  Type: _object_   _Optional_       | Three options can be specified:  `timeout` - Type: _integer or null_ - Time in milliseconds to observe. Defaults to `null` (no timeout).  `once` - Type: _boolean_ - If `true`, callback is invoked only on the first match, if `false` (default), callback is invoked on every match.  `onTimeout` - Type: _function_ - Callback function if timeout is specified and no elements matched within given timeout. |

| Return value |   |
| ------------ | - |
| N/A          |   |

### Example

Imagine you have a list of cross sell products on an ecommerce product page. You want to experiment with the styling of some of the products but its DOM elements are intermittently destroyed and created by some third party script. MutationObservers are an ideal way to deal with this scenario.

```js
function treatment() {
    function styleProduct(element) {
        // do some styling to certain products
    }
    // observe cross sell item nodes and style
    Mojtio.utils.observeSelector('#crossSellList .crossSellItem', styleProduct);
}
```

## Mojito.utils.watchElement()

### Description

A wrapper of [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe) which can be customised to observe specific mutations on the selected element, and executing a callback once the mutation(s) occur. Useful to detect DOM text node changes or attribute changes.

### Syntax

`Mojito.utils.watchElement(selectorOrElement, callback, options);`

| Parameter                                                                      |                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **selectorOrElement**  Type: _CSS Selector or DOM element_  _Required_ | A CSS selector or DOM element specifying the element to watch.                                                                                                                                                                                                                                     |
| **callback**  Type: _function_  _Required_                             | A function that's executed once the matched element changes. The first argument of the function is an array of [`MutationRecord`s](https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord).                                                                                        |
| **options**  Type: _object_   _Optional_                               | An optional [`MutationObserverInit`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserverInit) object providing options that describe what DOM mutations should be reported. Defaults:  `{ childList: true, subtree: true, characterData: true, attributes: true }` |

| Return value |   |
| ------------ | - |
| N/A          |   |

### Example

A DOM element houses intrinsic data via an attribute. You want to experiment with manipulating the element based on the attribute value but it's subject to dynamic updates from a third party script. Variant code will need to be able to handle when these values change.

```js
function treatment() {
    var priceElement = document.getElementById('foo');

    function transformElement(mutations) {
        // do something to the element
    }

    Mojito.utils.watchElement(element, transformElement, 
        {   
            // only watch for specific attribute changes
            childList: false,
            subtree: false,
            characterData: false,
            attributes: true,
            attributeFilter: ['data-unit-price-val']
        }
    );
}
```

## Mojito.utils.waitForIntersection (added in `2.7.0`)

### Description

This utility executes a callback, once by default, when the selected DOM element becomes visible in the useragent viewport. It implements a wrapper for the [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver).

### Syntax

| Parameter |  |
| - | - |
| **element**  Type: _DOM element_  _Required_ | A function that returns a boolean. `true` if a condition is matched and `false` if a condition not yet matched.                                                                                                                       |
| **callback**  Type: _function_  _Required_          | A function that's executed once the **element** triggers the IntersectionObserver callback. `true`                                                                                                                                                                         |
| **options**  Type: _object_   _Optional_           | An optional object providing options for the IntersectionObserver API ([view reference on MDN](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)). e.g. `threshold`, `rootMargin` and `once`. Default: `{ once: true }`. |

| Return value |   |
| ------------ | - |
| N/A          |   |


### Example

Imagine you're running an experiment far down the page. Only a small fraction of traffic to the page will see the experiment - To reduce the variance, you only want to activate your experiment when it's likely the user will see the change. You can use this utility function to do just that.

```js
// Activate an experiment when the footer moves into the viewport
function(test){
    Mojito.utils.domReady(function () {
        var footer = document.querySelector('footer');
        if (!footer) {
            return;
        }
        Mojito.utils.waitForIntersection(footer, test.activate);
    });
}
```



## All done?

You may want to return to the main portion of the documentation.

-   [Back to experiment setup](js-delivery-setup.md)
-   [Back to home](js-delivery-intro.md)

## Get involved

We'd be keen to see some PRs and your suggestions for additional functionality we can add to the Mojito utilities library!

-   [Open an issue on Github](https://github.com/mint-metrics/mojito-js-delivery/issues/new)
-   [Mint Metrics' website](https://mintmetrics.io/)
