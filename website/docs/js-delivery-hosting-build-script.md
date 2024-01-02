---
id: js-delivery-hosting-build-script
title: 2. Configure your Mojito container's npm build script
sidebar_label: 2. Configure build script
---
Settings for the build script are managed inside the [`config.js`](https://github.com/mint-metrics/mojito-js-delivery/blob/master/config.js) located in the repository root directory. Four parameters are currently supported and it affects where you publish the container to:

```js

module.exports = {
	containerName: "containerfilename",
	s3BucketDev: "mojito-example/jsdev",
	s3BucketPRD: "mojito-example/js",
	s3Region: "ap-southeast-2"
};

```

-   `containerName`: The file name given to your container - e.g. "google"
-   `s3BucketDev`: The path in S3 that contains your development container
-   `s3BucketPRD`: The path in S3, where your production container is hosted within
-   `s3Region`: The AWS region your S3 bucket is located in

These values can affect the URI of your container:

```html

<script type="text/javascript" src="//{{cloudfront-cname}}.cloudfront.net/{{environment}}/{{containerName}}.js"></script>

```

## Back to...

[AWS S3 / Cloudfront setup](js-delivery-hosting-s3-cf.md) or [installing your snippet](js-delivery-hosting-snippet.md).
