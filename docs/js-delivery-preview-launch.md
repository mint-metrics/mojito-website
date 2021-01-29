---
id: js-delivery-preview-launch
title: Previewing & launching experiments with Mojito JS Delivery
sidebar_label: Preview & launch a test
---

## Building the JS container

Whenever you make changes to experiments in Mojito, you need to build/publish your container.

1. (Optional) Customise your Mojito container name in [`repo/config.js`](https://github.com/mint-metrics/mojito-js-delivery/blob/master/config.example.js)
2. If you haven't done so already, install the necessary NPM packages: ```npm install```
3. Build your Mojito container: ```gulp build```

## Previewing experiments

You can force  either our Chrome Extension or manually through URL parameters.

### 1. Mojito Chrome Inspector

![Mojito Chrome Extension for preview mode](/img/js-delivery/chrome-preview-tool.png)

The extension works in the background to detect Mojito and any experiments on the page. It was designed with performance in mind and to keep tucked out of the way, in Developer tools. 

The extension lets you:

 - New: Dark mode support
 - Detect your Mojito container running on the page
 - See all the available tests in a container & if they're running
 - Preview (force-view) recipes for a test

#### Add it to Chrome

[Visit the Chrome Web Store to install](https://chrome.google.com/webstore/detail/mojito-chrome-inspector/pogeofjajfmbkkbkpddgjfnadkajidpl) the official extension.

[![Add to Chrome](/img/js-delivery/chrome-web-store.png)](https://chrome.google.com/webstore/detail/mojito-chrome-inspector/pogeofjajfmbkkbkpddgjfnadkajidpl)

### 2. Force URL parameters

To preview a variant of an experiment, you can force it by URL query parameters:

`mojito_{id}={variant_id}`

Token | &nbsp;
-- | --
`{id}` | Experiment id to be previewed
`{variant_id}` | Recipe/variant id to render

#### Example

`https://mywebsite.com/?mojito_ex2=1`

This forces the treatment variant of our [simple experiment](js-delivery-setup.md#yaml-setup) to be displayed on `mywebsite.com`.

### Notes

- Forced variants **will** respect experiment trigger activation conditions

- Forced variants **will not** respect an experiment's `state`, i.e. forcing works in both live and staging mode

- Multiple experiments can be forced at the same time by stringing URL parameters, e.g. `https://mywebsite.com/?mojito_w1=1&mojito_w2=1`

- Forcing variants will cookie you to that variant across pages and sessions, except when a test's `state` is in `divert` mode. To return to the control variant, you can:

    - Force the control variant using URL parameters as above,

    - Or delete the cookie: `_mojito_{id}-staging`

## Launch & takedown

For most of the time you'll be building an experiment and QAing it in `staging` mode. But when it's ready to launch, you'll need to set it to allow traffic to be bucketed:

### Launch

To launch an experiment, set its `state` parameter to `live` and check that `sampleRate` is set to a value greater than 0. E.g. `0.1` for 10% or `1` for 100%. All of this can be handled on the command line:

```sh
# Launch "ex1" to 10% of traffic, build and publish to production
gulp set --live ex1 --traffic 0.1
gulp build
gulp publish --production
```

### Takedown

To takedown an experiment, set its `state` parameter to `staging` (to keep the test in the container) or `inactive` (to archive the test from the container).

```sh
# Takedown "ex1", build and publish with the updated logic
gulp set --inactive ex1
gulp build
gulp publish --production
```

[Read more about experiment parameters](js-delivery-setup.md#experiment-parameters).

Following any changes, you’ll need to [build](#building-the-js-container) and publish your container.

## Next steps

To use Mojito in a production site, you'll likely need to host the container on a CDN before including it in your site's header. [Find out more about hosting and publishing](js-delivery-hosting.md).

You might also want to check out [Mojito's JS utilities](js-delivery-utilities.md) that are handy to get around some common experiment setup issues. 