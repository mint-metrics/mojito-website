---
id: js-delivery-api-decision-adapter
title: Customise your decision adapter & bucketing
sidebar_label: Customise decsion adapter
---

Mojito gives users control over the decision/bucketing engine that assigns subjects to tests and recipes. This is especially useful in an ITP 2.3 world devoid of lasting client-set cookies.

The decision adapter lets you:

 - Bucket subjects consistently across devices (e.g. assigning tests by a customer ID)
 - Work around ITP 2.3 restrictions (e.g. by using a server-set cookie ID)
 - Implement your own, preferred PRNG or hash function

It gives you unprecedented control over how subjects are assigned.

## Mojito.options.decisionAdapter

The `decisionAdapter` is called when subjects are bucketed and assigned a recipe ([see `Assign subject by sample rate` on the execution flowchart](js-delivery-api-execution-order#split-test-object-execution-flowchart)). This can happen up to three times per experiment ([as described below](#expect-to-handle-multiple-decisions-per-test)).

### Syntax

`Mojito.options.decisionAdapter = function (test) {...};`

Parameter | &nbsp;
--|--
**test** <br> Type: *object* <br> *Required* | The fully constructed test object is passed into this function in the first position. You can access everything within the test object or store values behind new/existing keys for later use.

Return value | &nbsp;
--|--
Type: *float* | The decision returned (must be between 0 and 1)


## Example: Set a new default decision adapter

Inside your `./lib/shared-code.js` you could define a container-wide adapter like so:

```js
/**
 * My Custom Decision Adapter
 * @param {Object} test: The full test object to access within the decisionAdapter
 * @returns {Float}: The decision - a number between 0 and 1
 */
Mojito.options.decisionAdapter = function (test)
{
    return Math.random();
};
```

It must return a value between 0 and 1. E.g. Consider an experiment with a 50-50 split between `Control` and `Treatment` groups - if the decision adapter returns a value of `0.3`, then the user would be assigned the `Control`. Whereas a value of `0.7` would bucket them into the `Treatment` group.

## Expect to handle multiple decisions per test

When using a random seed to deterministically generate a random number, remember that some tests can require up to three calls to your decision adapter per test:

1. **Test sample rate decision**: Whether or not the user will be included in the test
2. **Recipe / bucketing decision**: Which group a user is assigned to
3. (Optional) **Recipe-level sample rates**: When using recipes-specific sample rates with similar size sample rates

### Using seeds & generating new random numbers for each decision

Mojito tracks the number of decisions made per test by bumping its `decisionIdx` each time its run. This allows you to generate new seeds, or use a different part of an existing seed. 

Given the following seed, you may take the first 8 characters for decision 1, the next 8 for decision 2 and so on:

```js
md5('userId' + test.options.id); // 'userIdw3'
> '70c223cd4186e356a988f254e924b084'
'70c223cd' + '4186e356' + 'a988f254' + 'e924b084'
```

 - Decision 1: `0x70c223cd`
 - Decision 2: `0x4186e356`
 - Decision 3: `0xa988f254`

In hex, each of these "decisions" still provides 4,294,967,295 possible numbers. This should be ample granularity for most experiments.

You could also generate fresh seeds every call by appending `decisionIdx` to the input:

```js
// 1. Bucketing decision
md5('userId' + test.options.id + test.options.decisionIdx); // 'userIdw30'
> '47d261bbaef165542985016faf8dbee8'
...
// 2. Recipe chosen decision
md5('userId' + test.options.id + test.options.decisionIdx); // 'userIdw31'
> 'ef071e91cb77b27ac5ee3821441f623e'
...
// 3. Recipe same sample rates
md5('userId' + test.options.id + test.options.decisionIdx); // 'userIdw32'
> '465c91027a4063c011aef06ed1507a11'
```

## Cache expensive values on your test object

For performance reasons, it can be useful to save the output of expensive funtions to the test object for subsequent decisions:

```js
Mojito.options.decisionAdapter = function (test)
{
    // Check for an existing seed, else create a new one
    var seed = test.options.seed;
    if (!seed)
    {
        seed  = md5(userdId + test.options.id);
        // Store the seed in the test object for later use
        test.options.seed = seed;
    }

    // Return the decision
    return seededRandom(seed, test.options.decisionIdx);
};
```


