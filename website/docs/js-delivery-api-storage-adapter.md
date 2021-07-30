---
id: js-delivery-api-storage-adapter
title: Storage adapter & tracking reference
sidebar_label: Storage adapter & tracking
---
Mojito exposes three key events which you can capture in your Analytics tool:

-   [Exposures](#mojitooptionsstorageadapteronexposure)
-   [Failures (variant code JavaScript errors)](#mojitooptionsstorageadapteronrecipefailure)
-   [Veil timeouts](#mojitooptionsstorageadapteronveiltimeout)

Each event makes the whole `testObject` available to the `storageAdapter` functions, giving you complete tracking flexibility. 

## Container and test object specific tracking

Mojito supports configuring tracking at both the container level and through an override directly inside the test object:

1.  **Container default:** Define a container-wide `storageAdapter` through `Mojito.options.storageAdapter` inside `./lib/shared-code.js`.
2.  **Test object override:** Pass a `storageAdapter` object through the test object, overriding any defaults defined in the container.

This lets you add bespoke tracking for tests that call for it. See the below [examples for how to define your storageAdapter](#examples).

## Mojito.options.storageAdapter.onExposure()

As soon as an experiment is activated, this function runs, designating the moment at which users are exposed to an experiment.

### Syntax

`storageAdapter.onExposure(testObject);`

| Parameter                                          |                                                                                                                                                     |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **testObject** <br /> Type: _object_ <br /> _Required_ | The fully constructed test object is passed into this function in the first position. This allows you to access every value inside the test object. |

## Mojito.options.storageAdapter.onVeilTimeout()

When using veil and the experiment fails to activate within your configured `veilTimeout`, your test will fallback to a recipe you configured.

### Syntax

`storageAdapter.onVeilTimeout(testObject, ultimateRecipe);`

| Parameter                                              |                                                                                                                                                     |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **testObject** <br /> Type: _object_ <br /> _Required_     | The fully constructed test object is passed into this function in the first position. This allows you to access every value inside the test object. |
| **ultimateRecipe** <br /> Type: _string_ <br /> _Required_ | The name of the recipe users were ultimately exposed to.                                                                                            |

## Mojito.options.storageAdapter.onRecipeFailure()

Variant code for each recipe's `js()` is executed within tryCatch. Any errors caught within the tryCatch statement trigger this event, allowing you to track and handle errors that occur.

### Syntax

`storageAdapter.onRecipeFailure(testObject, error);`

| Parameter                                          |                                                                                                                                                     |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **testObject** <br /> Type: _object_ <br /> _Required_ | The fully constructed test object is passed into this function in the first position. This allows you to access every value inside the test object. |
| **error** <br /> Type: _string_ <br /> _Optional_      | The error message or stack, if it exists, for the JS error caught inside the recipe function.                                                       |

## Example storage adapter & test object override

Shared code

```js

Mojito.options.storageAdapter = {

    onExposure: function(obj)
    {
        dataLayer.push({
            'event': 'mojito_exposure 1-0-0',
            'gaExpId': obj.options.gaExperimentId,
            'gaExpVar': obj.chosenRecipe.id,
            'mojito': {
                'waveId': obj.options.id,
                'waveName': obj.options.name,
                'recipe': obj.chosenRecipe.name
            }
        });
    },

    onVeilTimeout: function(obj, ultimateRecipe)
    {},

    onRecipeFailure: function(obj, err)
    {
        dataLayer.push({
            'event': 'mojito_failure 1-0-0',
            'mojito': {
                'waveId': obj.options.id,
                'waveName': obj.options.name,
                'component': obj.chosenRecipe.name || 'trigger',
                'error': err
            }
        });

        // Refresh the page unless we're in a trigger or preview mode
        var preview = document.location.search.indexOf('mojito_' + obj.options.id + '=' + obj.chosenRecipe.id) > -1;
        if (obj.chosenRecipe.name && !obj.options.divertTo && !preview) 
        {
            // Disable the experiment on future page loads, and refresh
            Mojito.Cookies.set('_mojito_' + obj.options.id + (obj.options.state === 'live'?'':'-staging'), '0.0');
            setTimeout(function(){
                window.location.reload();
            }, 500);
        }
    }
};

```

Test object override

```js

Mojito.addTest({
    "id": "w12",
    "name": "Example test",
    "sampleRate": 1,
    "state": "live",
    "gaExperimentId": "dsdy2h872g7d32h782n2",
    "trigger": function (testObject) {
        if (document.location.pathname === "/") {
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
        }
    },
    "options": {
        "storageAdapter": customStorageAdapterObject
    }
});

```

