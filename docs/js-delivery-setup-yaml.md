---
id: js-delivery-setup-yaml
title: Setting up experiments with the YAML method
sidebar_label: YAML experiment setup
---

To setup our example experiment, start by defining it on the command line:

```sh
gulp new -ab ex1
```

This will create a scaffold of your experiment under `repo/lib/waves/ex2/config.yml`. Now you can configure the test parameters in YAML:

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
    // (Runs as soon as the container is loaded)
    if (document.referrer.indexOf('google.com') > -1) test.activate();
}
```

`repo/lib/waves/ex2/1.js` contains variant code for variant number `1`:

```js
function treatment(){
    // This code will run once the test activates & the user is bucketed
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

## Next steps

1. [Move on to experiment shared code](js-delivery-setup-shared-parameters.md)
2. [Setup your tracking & utilities](js-delivery-customisation.md)
