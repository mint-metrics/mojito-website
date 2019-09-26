---
id: js-delivery-hosting
title: Hosting your container
---

You own the full source to your Mojito container, so you have unlimited options to host it, including: 

 - Bundling Mojito JS with your existing libraries & setting a strong cache policy for the library
 - Keeping Mojito JS in a separate library and publishing it to your own web host
 - Or if you're like us, host Mojito JS on AWS/Cloudfront with Bitbucket Pipelines for CI

In any case, you'll benefit from faster page load times & better security by self-hosting Mojito JS.

## Hosting Mojito JS Delivery on AWS S3 / Cloudfront

Mint Metrics host Mojito JS containers on Amazon's infrastructure on behalf of clients. It's fast, cheap and reliable.

### You'll need

 - Amazon AWS account
 - (Optional) For web-based CI, host your [Mojito JS](https://github.com/mint-metrics/mojito-js-delivery) repo on [Atlassian Bitbucket](https://bitbucket.org/product) and deploy containers using [Pipelines Build minutes](https://bitbucket.org/product/features/pipelines)


### Getting set up

1. [Create an S3 Bucket and Cloudfront distribution to serve Mojito JS from](js-delivery-hosting-s3-cf.md)
2. [Configure your build script's `config.js`](js-delivery-hosting-build-script.md)
3. [Add a user to publish Mojito from your repo to S3](js-delivery-hosting-iam.md)
4. [(Optional) Securely add the Mojito user's credentials to Atlassian Bitbucket for publishing](js-delivery-hosting-bitbucket.md)
5. [Installing Mojito JS in your website or application](js-delivery-hosting-snippet.md)

## All done?

 * [Back to experiment setup](js-delivery-setup.md)
 * [Return to home](js-delivery-intro.md)
