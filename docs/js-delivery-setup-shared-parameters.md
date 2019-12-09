---
id: js-delivery-setup-shared-parameters
title: Experiment shared code & other test parameters
sidebar_label: Parameters & shared code
---

Your JS and CSS can have a shared scope within an experiment. E.g. two treatment variants might have some stying commonalities. We can reduce repeated code by sharing common elements across variants.

In the examples below, we'll use the [YAML method](js-delivery-setup-yaml.md). However the same keys and methods will work for the [JS method](js-delivery-setup-js.md).

## Shared JS

Setup instructions:

1. Create a JS file containing shared code in an experiment's directory e.g. `repo/lib/waves/mytest/shared.js`
2. In `config.yml`, point the root level `js` key to the file
3. Any variant can now reference code within the shared JS through `{{testObject}}.options.js()`

As an example, you should have:

`repo/lib/waves/mytest/shared.js`:

```js
function shared()
{
    return {
        sharedFn: function() {
            //do something
        },
        sharedVal: 'something'
        ...
    }
}
```

`repo/lib/waves/mytest/config.yml`:

```yml
js: shared.js
id: mytest
name: My example test
sampleRate: 1
state: staging
trigger: trigger.js
recipes:
  0:
    name: Control
  1:
    name: Treatment1
    js: treatment1.js
  2:
    name: Treatment2
    js: treatment2.js
```

`repo/lib/waves/mytest/treatment1.js`:

```js
// pass in the 'test' object into the treatment function
function treatment1(test) {
    // call shared functions using dot notation
    var sharedObject = test.options.js();
    sharedObject.sharedFn();
    // ... other transformations
}
```

`repo/lib/waves/mytest/treatment2.js`:

```js
// pass in the 'test' object into the treatment function
function treatment2(test) {
    // call shared functions using dot notation
    var sharedObject = test.options.js();
    sharedObject.sharedFn();
    // ... other transformations
}
```

## Shared CSS

Setup instructions:

1. Create a CSS file containing shared CSS in an experiment's directory
2. In `config.yml`, point the root level `css` key to the file

Shared CSS is injected into the document when the test is activated, regardless of the variant (including the "Control"), so be sure to scope your shared CSS properly.

`repo/lib/waves/mytest/shared.css`:

```css
.myClass {
    color: blue;
    padding: 10px 10px;
}
```

`repo/lib/waves/mytest/config.yml`:

```yml
css: shared.css
id: mytest
name: My example test
sampleRate: 1
state: staging
trigger: trigger.js
recipes:
  0:
    name: Control
  1:
    name: Treatment2
    js: treatment1.js
  2:
    name: Treatment2
    js: treatment2.js
```

## Experiment parameters

Important experiment parameters to understand are:

Parameter key | Values | Description
--- | --- | ---
`state` | `live` or `staging` or `inactive` | Controls the status of the experiment. `staging` means the experiment is disabled from normal visitors but able to be [previewed](js-delivery-preview-launch.md). `inactive` means the experiment will be ignored during build but remain in your repo for reference.
`sampleRate` | Float between `0` and `1` | Controls portion of overall traffic to be allocated to the experiment. `0` = 0%, `1` = 100%.
`id` | A string | Identifier used for analytics/reporting and forcing variants in preview mode.
`recipe` | A nested list | Defines experiment variants and their parameters. <br> `{recipeId}`: *A string: variant indentifier*<br> &nbsp;&nbsp;&nbsp;&nbsp;`name: {recipeName}` *A string: descriptive variant name*<br>&nbsp;&nbsp;&nbsp;&nbsp;`js: {recipe.js}` *Variant JS filename(optional)*<br>&nbsp;&nbsp;&nbsp;&nbsp;`css: {recipe.css}` *Variant CSS filename (optional)*<br>&nbsp;&nbsp;&nbsp;&nbsp;`sampleRate: {float between 0 and 1}` *Controls portion of experiment traffic to allocate to variant (optional)*
`trigger` | `{trigger.js}` | Experiment trigger JS filename.
`divertTo` | `{recipeId}` | Allows diverting 100% of traffic to a specific variant. Handy when you have found a winner and want to temporarily divert traffic to it.

Learn more [about the test object keys here](js-delivery-test-object.md) or review the [`config-template.yml` template on Github](https://github.com/mint-metrics/mojito-js-delivery/blob/master/config-template.yml)

## Next steps

Time to [make sure you're tracking it effectively](js-delivery-customisation.md).
