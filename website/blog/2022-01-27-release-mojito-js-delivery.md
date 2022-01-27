---
title: "Release: Mojito JS Delivery v2.4.0"
author: Robert Kingston
authorURL: "http://twitter.com/robkingston"
authorFBID: 609714465
authorTwitter: robkingston
---

Today we released a new minor version of Mojito JS Delivery v2.4.0. The changes won't have a significant bearing on the contents of the split testing containers built by the updated project but it includes a significant change to the test suite and targets. 

The changes for this version include:

<!--truncate-->

## Move from PhantomJS to Puppeteer for running the test suite

PhantomJS has served us well over the years, being a sturdy and reliable target for running our test suite. However the project and its dependencies are not actively maintained.

In contrast to this, Puppeteer (and the popular fork Playwright) are very actively maintained by Google and Microsoft. 

## Bumping packages, test suite targets and pipeline runners

To keep the library up to date and remove any glaring security vulnerabilities, we decided to upgrade many older packages.

As of this release we've upgraded the BitBucket Pipeline's runner image to `atlassian/default-image:3` and the GitHub Actions test suite now runs tests against node versions `12.x`, `14.x`, `16.x`. This ensures future development supports the versions of node that users are running locally.


