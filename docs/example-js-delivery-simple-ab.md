---
id: example-js-delivery-simple-ab
title: Build a simple A/B test in Mojito
sidebar_label: A simple A/B test
---

Let's imagine we're working for Bing and we want to test showing no image on the homepage to 50% of users. What's needed is a simple A/B test.

![How an A/B test is structured](/img/examples/js-delivery-simple-ab.png)
<!-- https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggTFJcbiAgQShUcmFmZmljKSAtLT58MTAwJXwgQntFeHBlcmltZW50fVxuICBCIC0tPnw1MCV8IERbQ29udHJvbF1cbiAgQiAtLT58NTAlfCBFW1RyZWF0bWVudF1cblx0XHQiLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ -->


> **Pre-requisites** 
> 1) You've [cloned Mojito JS Delivery locally](https://github.com/mint-metrics/mojito-js-delivery), with npm, Node and Gulp installed. 
> 2) You've setup [tracking through your storageAdapter, or used our example one](/docs/js-delivery-api-storage-adapter#example-storage-adapter--test-object-override).

## Experiment parameters

| Parameter | Details |
|------------------|---------------------------------------------------------------------------|
| Hypothesis | Defaulting the homepage to `no_image` will increase the rate of searches. |
| Targeting | All homepage users |
| Traffic / Sample | 100% |
| Variants | Control: 50%, Treatment 50% |

### Control

Show the Bing homepage with images.

![Control](/img/examples/js-delivery-simple-ab-control.jpg)

### Treatment

Disable the homepage image.

![Treatment](/img/examples/js-delivery-simple-ab-treatment.png)

## 1. Create a new test 

Start by creating your test's scaffolding. You can do this on the command line, like so:

```sh
gulp new --ab ex1
```

The command will output all your experiment files under `lib/waves/ex1` (where `ex1` can be replaced by the parameter you pass into the generator command above):

 - `config.yml`: The experiment configuration YAML - where you define your experiment's parameters.
 - `1.js`: Recipe #1's variant code - the JS responsible for changing the look and feel of the treatment page.
 - `trigger.js`: The activation trigger function - which dictates when your experiment will run.

## 2. Set your experiment parameters

Let's give the experiment a proper name and set its traffic allocation to 100% of traffic. Note: Your experiment will not accept traffic until you change the state from `staging` to `live` (we'll do that later):

 - `name`: `Bing Homepage without image`
 - `sampleRate`: `1`
 - Recipe `1`: `Treatment (no image)`

By default, traffic to recipes will be evenly defined amongst them - so we don't need to set the `sampleRate` parameter for each recipe. Refer to the API reference for more details about the parameters.

Your experiment config should now look like this:

```yml
state: staging
sampleRate: 1
id: ex1
name: Bing Homepage without image
recipes:
  '0':
    name: Control
  '1':
    name: Treatment (no image)
    js: 1.js
trigger: trigger.js
```

## 3. Write your variant code function

Bing makes it easy to switch images off on its home page. We only need to apply the `no_image` CSS class to the `div.hp_body` element:

![How to transform the Bing Homepage so it shows no background image.](/img/examples/js-delivery-simple-ab-dom.png)

This is quite easy to do in JavaScript. We just need to change our Treatment recipe's code in `1.js`, like so:

```js
function js () {
    var elem = document.querySelector('div.hp_body');
    if (elem) elem.classList.add('no_image');
}
```

> Note: The classList API is not supported well by older browsers, so you may need to create a [default exclusion rule](js-delivery-customisation#default-exclusion-rule) in your container `shared-code.js`.

## 4. Define your trigger properly

Your experiment will currently activate on all pages when `DOMContentLoaded` fires.

```js
function trigger(test) {
    Mojito.utils.domReady(test.activate);
}
```

Recall that we want to run this experiment only on the home page (`/`). We just need to add an `if` statement for conditional activation:

```js
// A good way to activate
function trigger(test) {
    if (document.location.pathname === '/') Mojito.utils.domReady(test.activate);
}
```

Even better, we can activate the experiment as soon as the background element is ready in the DOM. Simple replace `Mojito.utils.domReady` with `Mojito.utils.waitForElement`, so we can wait until `div.hp_body` is available:

```js
// A better way to activate
function trigger(test) {
    if (document.location.pathname === '/') Mojito.utils.waitForElement('div.hp_body', test.activate);
}
```

Mutation observers are a great way to activate an experiment that treads between flicker (or FOOC) and race conditions (where you might attempt to interact with an element before it's loaded). Also, if there happens to be a version of the home page without the `div.hp_body` element, your experiment won't activate.

## 5. Build, test & publish your container

Congratulations! Your experiment is now set up. It's ready to build and publish to staging, so you may QA it:

```sh
# Build your container file
gulp build

# (If you'e set up S3 publishing) Publish the container to AWS S3
gulp publish
```

### Preview your experiment

> **NB**: You must have Mojito installed on the page or [use a Chrome Extension like Requestly to inject Mojito](example-js-delivery-requestly-staging) into the page for testing.

1. Browse to [www.bing.com](https://www.bing.com/). 

2. Using the [Mojito Chrome Inspector](https://chrome.google.com/webstore/detail/mojito-chrome-inspector/pogeofjajfmbkkbkpddgjfnadkajidpl), open dev tools, browse to the `Mojito` tab and force your new experiment to the treatment.

![Preview your split test variant in Mojito Chrome Inspector](/img/examples/js-delivery-simple-ab-preview.png)

3. Refresh the page, your treatment will be enabled.

## 6. Launch your experiment

When you've tested it's working, you can launch it by setting its `state` to `live`, and buildin/publishing the container:

```yml
state: live
sampleRate: 1
id: ex1
name: Bing Homepage without image
recipes:
  '0':
    name: Control
  '1':
    name: Treatment (no image)
    js: 1.js
trigger: trigger.js
```

Now you can build and publish your experiment again, to send it live for all your visitors:

```sh
# Build your container file & publish to AWS S3 (if configured)
gulp build && gulp publish
```

