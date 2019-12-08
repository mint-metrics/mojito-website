---
id: js-delivery-setup
title: Setting up experiments with Mojito JS Delivery
sidebar_label: Setup experiments
---

There are two approaches to setup experiments in Mojito. The **gulp** builder supports both methods when building the JS container.

1. **[Straight JS](#straight-js-setup)**: define experiment parameters, trigger code and variant code in a single JS file: `test-object.js`

2. **[YAML / CLI *(recommended)*](#yaml-setup)**: define experiment parameters in a YAML file: `config.yml`. All JS and CSS are separated into individual files.

## Let's setup a test with both methods, using these parameters

Parameter | &nbsp;
--- | ---
Trigger | Activate when users enter your site from google
Control variant | No change
Treatment variant | Alert the user with a simple message


For the purposes of this guide, it's beneficial to first demonstrate a **straight JS** setup, as it better reflects how Mojito works under the hood.

## Straight JS setup

Start by creating a file in your repo: 

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
        if (document.referrer.indexOf('google.com') > -1) test.activate();
    },
    recipes:{
        '0': {
            name: 'Control'
        },
        '1':{
            name: 'Treatment',
            js: function() {
                // As soon as the user is bucketed into the experiment, this code will run
                alert('Hi Google user!');
            }
        }
    }
});
```

That's all there is to this experiment. Many of the parameter keys and values are self explanatory, and we'll explore them in [more detail](#experiment-parameters) after looking at the **YAML** approach.

## YAML setup

To setup the example experiment above, start by defining it on the command line:

```sh
gulp new -ab ex1
```

This will create a scaffold for your experiment under `repo/lib/waves/ex2/config.yml`. Now you can configure the test in YAML:

```yml
state: live
sampleRate: 1
id: ex1
name: Google message straight JS
recipes:
  '0':
    name: Control
  '1':
    name: Treatment
    js: 1.js
trigger: trigger.js
```

*Look familiar?*

Each key here maps directly to a key in the object we saw in the straight JS setup. Values are also mapped identically, except any JS/CSS are declared as file names that point to files which you'll create in the same directory as `config.yml`.

`repo/lib/waves/ex2/trigger.js` contains trigger/activation code:

```js
function trigger(test){
    // Only activate and bucket users into the experiment if they come from Google
    if (document.referrer.indexOf('google.com') > -1) test.activate();
}
```

`repo/lib/waves/ex2/1.js` contains variant code for variant number `1`:

```js
function treatment(){
    // As soon as the user is bucketed into the experiment, this code will run
    alert('Hi Google user!');
}
```

Your experiment directory should look like:

```
ex1/
  |-- 1.js
  |-- config.yml
  |-- trigger.js
```

With these files defined, the gulp builder will construct an experiment object resembling what we saw in the straight JS setup and stitch it into the container along with `mojito.js`.

### Experiment shared code

JS and CSS can have a shared scope within an experiment. E.g. two treatment variants might have some stying commonalities. We can cut down on repeated code by sharing common elements.

#### Shared JS

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

#### Experiment shared CSS

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

Learn more [about the test object keys here](js-delivery-test-object) or review the [`config-template.yml` template on Github](https://github.com/mint-metrics/mojito-js-delivery/blob/master/config-template.yml)

Full details and explanations of other parameters can be found in .

## Why we recommend the YAML format

- **Easiest to read & setup**: YAML abtracts away JS syntax from your experiment configuration

- **Easier to develop experiments**: Separating JS & CSS is good practice; great for debugging & syntax highlighting

- **Automatic variant code minification**: The YAML build path minifies & lints variant code to minimise your container weight

- **Superior code portability**: Send your developers winning variant code for permanent implementation (it's easier to unpack the actual variant code from experiment code)

## Next steps

Now that you've setup an experiment or two, you'll want to customise your Mojito container.

Next, [configure your container settings & tracking](js-delivery-customisation.md).
