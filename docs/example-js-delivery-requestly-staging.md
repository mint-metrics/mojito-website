---
id: example-js-delivery-requestly-staging
title: Create & access your staging environment for A/B test QA with Requestly
sidebar_label: Setup a Mojito staging environment
---

Building experiments requires publishing experimental code to your website. In order to protect your mission-critical apps, it's recommended you publish and test code in a `STAGING` environment before you publish it into `PRODUCTION`. Doing so lets you catch heinous bugs before your users may encounter them.

![Example environemnts in Bitbucket](/img/examples/js-delivery-requestly-environments.png)

Here you can see an example of us testing some tracking updates in `STAGING` before merging into master and rolling them out to `PRODUCTION`.

> **Pre-requisites**: 
> 1. You know how to [create a simple experiment](example-js-delivery-simple-ab) in Mojito. 
> 2. You're hoting Mojito JS Delivery [using AWS S3](js-delivery-hosting) or some other hosting mechanism in Mojito.

## How it works

You'll have two environments you can publish to:

| Environment | Use-case |
|------------------|---------------------------------------------------------------------------|
| `STAGING` | Any authorised users can publish here, and the `development` git branch publishes to staging upon commits made to it. It allows testing of code before it passes through formal QA/Code review. |
| `PRODUCTION` | Only users with permission to publish to production can make code changes here. The `master` git branch also publishes to this environment upon any commits made here. Only experiments that have passed your testing should be deployed here. |

Mojito JS Delivery provides these two environments to manage the safe deployment of your code. Based on your configuration of `./config.js` in your Mojito repository, you'll be able to publish and load your two containers from two separate URLs:

 - Staging: `https://s3.amazonaws.com/cohorts-js/jsdev/mintmetrics.js` (Note the `jsdev/` directory?)
 - Production: `https://d1xafqim8ep2fx.cloudfront.net/js/mintmetrics.js`

### Swap out your production URL with the staging ones for testing

Using requestly, you can switch on/off `STAGING` mode when you setup a redirect rule.

<img alt="Requestly Chrome toggle" width="300px" src="/img/examples/js-delivery-requestly-toggle.png">

## Setup Requestly

1. Install the [Chrome Requestly extension](https://chrome.google.com/webstore/detail/requestly-redirect-url-mo/mdnleldcmiljblolnjhpnblkcekpdkpa?hl=en)

2. Open Requestly & add a new rule of type, "Redirect Request"

<img alt="Requestly Rule type" width="300px" src="/img/examples/js-delivery-requestly-rule-type.png">

3. Add a `Name`, `Description` and configure request redirect rule, like so:

![How to set up a Requestly redirect rule](/img/examples/js-delivery-requestly-rule.png)

4. Hit `Save` and you're ready to test your Mojito staging code over the top of your production site.

### Pro tip

Mark the rule as a favourite, so you can readily access staging environments from whichever page you're on:

<img alt="Requestly Chrome toggle" width="300px" src="/img/examples/js-delivery-requestly-toggle.png">

