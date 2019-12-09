---
id: js-delivery-setup-js
title: Setting up experiments with the JS method
sidebar_label: JS experiment setup
---

Get started by creating a file in your repository: 

`repo/lib/waves/ex1/test-object.js`

Define experiment parameters in an object that's passed into `Mojito.addTest()`, like so:

```js
Mojito.addTest({
    id: 'ex1',
    name:'Google message straight JS',
    sampleRate: 1,
    state: 'live',
    trigger:function(test){
        // Only activate and bucket users into the experiment if they come from Google
        // (Runs as soon as Mojito.addTest is called)
        if (document.referrer.indexOf('google.com') > -1) test.activate();
    },
    recipes:{
        '0': {
            name: 'Control'
        },
        '1':{
            name: 'Treatment',
            js: function() {
                // This code will run once the test activates & the user is bucketed
                alert('Hi Google user!');
            }
        }
    }
});
```

That's all there is to this experiment. Many of the parameter keys and values are self explanatory, and we'll explore them in [more detail](js-delivery-setup-shared-parameters.md) after looking at the **YAML** approach.

## Test activation & execution order

This test object will execute the trigger function as soon as `Mojito.addTest()` fires. Normally, you'll want to delay activation of your experiment until the page is ready, such as with: `Mojito.utils.domReady(test.activate)`. Learn about the [test execution order](js-delivery-api-execution-order.md) here and [use our utilities functions to delay activation](js-delivery-utilities.md) using Mutation Observers, DOM Ready, Polling functions and more.

## Next steps

1. [Setup a test using the YAML / CLI method](js-delivery-setup-yaml.md)
2. [Move on to experiment shared code](js-delivery-setup-shared-parameters.md)
3. [Setup your tracking & utilities](js-delivery-customisation.md)
