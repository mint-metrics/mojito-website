---
id: js-delivery-hosting-snippet
title: 5. Install your Mojito JS snippet
sidebar_label: 5. Snippet installation
---
We typically install Mojito JS synchronously in the head of all pages with a script tag:

```html
<script type="text/javascript">
(function() {
    if (!window.Mojito || !Mojito.testObjects || !Object.keys(Mojito.testObjects).length) {
        var po = document.createElement('script');
        po.type = 'text/javascript';
        po.async = false;

        var stags = document.getElementsByTagName('script');
        var s = stags[stags.length - 1];
        s.parentNode.insertBefore(po, s);
        po.src = '//{{cloudfront-cname}}.cloudfront.net/{{environment}}/{{container-name}}.js';
    }
})();
</script>
```

Just replace the placeholder text in the snippet abover with your own values:

-   `{{cloudfront-cname}}`: The Cloudfront distribution URL you just set up
-   `{{environment}}`: The path to your [production environment as configured](js-delivery-hosting-build-script.md) in your [`config.js`](https://github.com/mint-metrics/mojito-js-delivery/blob/master/config.js) file.
-   `{{container-name}}`: The [container name you chose when configuring](js-delivery-hosting-build-script.md) your [`config.js`](https://github.com/mint-metrics/mojito-js-delivery/blob/master/config.js) file.

## Can I install it asynchronously?

Theoretically, Mojito can be [installed asynchronously via the async attribute](https://www.w3schools.com/tags/att_script_async.asp). But this is untested and you may encounter race conditions between your JS executing and the available elements on the page:

```html
<script type="text/javascript">
(function() {
    if (!window.Mojito || !Mojito.testObjects || !Object.keys(Mojito.testObjects).length) {
        var po = document.createElement('script');
        po.type = 'text/javascript';
        po.async = true;

        var stags = document.getElementsByTagName('script');
        var s = stags[stags.length - 1];
        s.parentNode.insertBefore(po, s);
        po.src = '//{{cloudfront-cname}}.cloudfront.net/{{environment}}/{{container-name}}.js';
    }
})();
</script>
```

If you try this, let us know how it works. Good luck!

## All done?

Now you're all set, you may want to return to the main portion of the documentation.

-   [Back to hosting](js-delivery-hosting.md)
-   [Back to home](js-delivery-intro.md)
