---
id: js-delivery-test-object
title: Test object parameter reference in Mojito JS Delivery
sidebar_label: Test object parameters
---

The test object contains everything an experiment needs to run, including the trigger, tracking information and recipe code (or variants). When you pass all this information into the ```Mojito.addTest()``` function, Mojito will execute all the logic in your experiment based on its order of execution.

## Example test objects in `JS` & `YAML` formats

<!--DOCUSAURUS_CODE_TABS-->
<!--JavaScript-->
```js
Mojito.addTest({
    "id": "w12",
    "name": "Example test",
    "divertTo": "1",
    "sampleRate": 1,
    "state": "live",
    "gaExperimentId": "dsdy2h872g7d32h782n2",
    "trigger": function (testObject) {
        if (document.location.pathname === "/") {
            // Activate the test at DOM Content Loaded
            Mojito.utils.domReady(testObject.activate);
        }
    },
    "recipes": {
        "0": {
            "name": "control"
        },
        "1": {
            "name": "treatment",
            "js": function(testObject) {
                alert("You're in an experiment...");
            },
            "css": "body{display:none;}"
        }
    }
});
```

<!--YAML-->
```yml
id: w12
name: Example test
divertTo: "1"
sampleRate: 1
state: live
gaExperimentId: dsdy2h872g7d32h782n2
trigger: trigger.js
recipes:
    "0":
        name: control
    "1":
        name: treatment
        js: 1.js
        css: 1.css
```

<!--YAML trigger.js-->
```js
function trigger(testObject) {
    if (document.location.pathname === "/") {
        // Activate the test at DOM Content Loaded
        Mojito.utils.domReady(testObject.activate);
    }
}
```

<!--YAML 1.js-->
```js
function(testObject) {
    alert("You're in an experiment...");
}
```

<!--YAML 1.css-->
```css
body {
    display:none;
}
```
<!--END_DOCUSAURUS_CODE_TABS-->


## Test object: Root level

Parameter | Description
--|--
**css** <br> Type: *string* <br> *Optional* | Shared CSS for the test object that is applied to all recipes. <br>`JS format`: Expects a JS string of CSS styles. <br>`YAML format`: Expects a relative path to a CSS file.
**divertTo** <br> Type: *string* <br> *Optional* | Enable divert mode to send all eligible traffic into a particular recipe's key.
**id** <br> Type: *string* <br> *Required* | A canonical test object ID by which subjects' assignments are recorded against. 
**js** <br> Type: *function/object* <br> *Optional* | Shared JS function or object for the test object that is applied to all recipes. <br>`JS format`: Expects a valid JavaScript function on this key. <br>`YAML format`: Expects a relative path to a JS file with that function/object.
**name** <br> Type: *string* <br> *Required* | The name of the test object that's useful in tracking.
[**recipes**](#recipes-object) <br> Type: *object* <br> *Required* | An object containing the definition of available recipes. [See object definition](#recipes-object)
**sampleRate** <br> Type: *number* <br> *Required* | The percentage of traffic to assign into the experiment between 0 and 1 (where 1 is 100%)
**state** <br> Type: *string* <br> *Required* | A test object's state. Can be either: <br> `live` - in the container, accepting traffic into the experiment <br>`staging` - built into the container but not accepting traffic without a preview URL <br>`inactive` - not parsed or built into the container
**trigger** <br> Type: *function* <br> *Required* | A JavaScript function executed as soon as the test object is loaded and can be used to conditionally activate an experiment. <br>`JS format`: Expects a valid JavaScript function on this key. <br>`YAML format`: Expects a relative path to a JS file with that function.

## Recipes object

Parameter | Description
--|--
[**{{recipeId}}**](#recipe-objects-sub-level) <br> Type: *string* <br> *Required* | The canonical key that references a test object within the cookies and preview URLs. [See object definition](#recipe-objects-sub-level). E.g. A `recipeID` of `a` would be accesible through a preview URL like: `https://www.example.com/?mojito_w12=a`

## Recipe objects sub-level

Parameter | Description
--|--
**css** <br> Type: *string* <br> *Optional* | CSS that is applied as soon as the subject is bucketed. <br>`JS format`: Expects a JS string of CSS styles. <br>`YAML format`: Expects a relative path to a CSS file.
**js** <br> Type: *function* <br> *Optional* | A JavaScript function that runs as soon as a subject is assigned into the test. <br>`JS format`: Expects a valid JavaScript function on this key. <br>`YAML format`: Expects a relative path to a JS file with that function.
**name** <br> Type: *string* <br> *Required* | The name of the recipe used in tracking & reporting.
**sampleRate** <br> Type: *number* <br> *Optional* | Allows users to set the proportion of traffic allocated to each recipe. This property expects a value between `0` and `1` and requires all recipes' provided sample rates to add up to `1`.

