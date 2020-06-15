---
title: Release: Mojito JS Delivery v2.3.0
author: Robert Kingston
authorURL: http://twitter.com/robkingston
authorFBID: 609714465
authorTwitter: robkingston
---

The focus of this release was a series of optimisations that allowed us to cut minified container weights by a huge 0.29KB for Mojito JS Delivery. Despite the large savings, we've retained the same behaviour in the library as before.

Here's a comprehensive summary of the changes you'll find:

<!--truncate-->

### New features

* YAML now supports the new ```private``` key pair, allowing you to store private information about a test that won't be published with your container (e.g. test categorisation/tags/editor URLs/ unit testing URLs etc). We're yet to determine how this is used, so expect the key-values under ```private``` to change in time.
* Suggested default options for use in Shared Code, like our default exclusion rule and storage adapter ([See our recommended shared code options](https://github.com/mint-metrics/mojito-js-delivery/commit/a7b2e2f9ee002e0d297ffcdd599b0ed0f652a96d))

### Code quality & optimisations

* Minified and pretty containers now publish to AWS in parallel, speeding up publish times by 40%
* Streamline the ```Test``` constructor function, roughly cutting it in half whilst maintaining the same behaviour
* Remove Mojito's ```Utils.keys()``` function and instead use the native ```Object.keys()``` function
* Remove ```Utils.arrayIndexOf()``` function and replace with the native ```.indexOf()``` prototype
* Modernise ```Utils.domReady()``` and drop support for old versions of IE
* Clean-up the library's default options & centralise all the options in one variable at the top of the library (```defaultOptions```)
* Partial library lint, to bring the core library in line with our ES Lint rules
* Bumping the libraries and dependencies

Check out [the release over on GitHub](https://github.com/mint-metrics/mojito-js-delivery/releases).

## YAML private key

Anything specified under ```private``` for a test's ```config.yml``` will not be published in your container. E.g.:

```yml
state: staging
sampleRate: 0
id: w1
name: w1 some test
private:
  previewUrl: https://mojito.mx/
recipes:
  '0':
    name: Control
  '1':
    name: Treatment
trigger: trigger.js
```

This will translate to the following JS:

```js
Mojito.addTest({
  "state": "staging",
  "sampleRate": 0,
  "id": "w1",
  "name": "w1 some test",
  "recipes": {
    "0": {
      "name": "Control"
    },
    "1": {
      "name": "Treatment"
    }
  },
  "trigger": function trigger(test) {
    Mojito.utils.domReady(test.activate);
  }
});
```

We expect this private key will be home to:

* Test taxonomies, like tags or other categorisations
* Editor / Preview / Unit testing URLs
* Experiment notes or even results
* Links to other related test data / assets
* Build dependencies (e.g. hardcoding a remote JSON into the test build)

While none of this has been planned, we look forward to fleshing this out with our clients and the community.

## Next release

For the next release, we'll look to further improve build/publish times and perhaps even introduce our new MD5 decisionAdapter as the default decisionAdapter. If there's anything you'd like to see in the library, let us know by opening an issue.

