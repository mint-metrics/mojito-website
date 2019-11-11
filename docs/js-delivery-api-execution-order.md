---
id: js-delivery-api-execution-order
title: Mojito test activation conditions & order of execution
sidebar_label: Test activation & execution order
mermaid_chart_source: https://mermaidjs.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVERcbnN1YmdyYXBoIFwiQ29udGFpbmVyIGNvZGVcIlxuQShNb2ppdG8gbGliIHJ1bnMpIC0tPiBCKFNoYXJlZCBjb2RlIHJ1bnMpIFxuZW5kXG5cbnN1YmdyYXBoIFwiRWFjaCB0ZXN0IG9iamVjdFwiXG5CIC0tPiBEKFwiVGVzdCBsb2FkcyAmIHRyaWdnZXIoKSBleGVjdXRlc1wiKVxuRCAtLT4gfFwi4pyUIFRlc3QgYWN0aXZhdGUoKSBjYWxsZWRcInwgRShcIkNoZWNrOiBGb3JjZWQgaW50byByZWNpcGVcIilcbkUgLS0-IHxcIuKclyBOb3QgZm9yY2VkIGludG8gcmVjaXBlXCJ8IEYoXCJDaGVjazogUHJldmlvdXNseSBidWNrZXRlZFwiKVxuRiAtLT4gfFwi4pyXIE5vdCBwcmV2aW91c2x5IGJ1Y2tldGVkXCJ8IEcoXCJDaGVjazogVGVzdCBzdGF0ZSBpcyAnbGl2ZSdcIilcbkcgLS0-IHxcIuKclCBUZXN0IGlzIGxpdmVcInwgSChcIkFzc2lnbiBTdWJqZWN0IGJ5IHNhbXBsZSByYXRlXCIpXG5cbkUgLS0-IHxcIuKclCBGb3JjZWQgYnkgcHJldmlldyBtb2RlXCJ8IElcbkUgLS0-IHxcIuKclCBGb3JjZWQgYnkgZGl2ZXJ0XCJ8IE4oXCJDaGVjazogVGVzdCBzdGF0ZSBpcyAnbGl2ZSdcIilcbk4gLS0-IHxcIuKclCBSdW4gZGl2ZXJ0ZWQgcmVjaXBlXCJ8IEtcbk4gLS0-IHxcIuKclyBUZXN0IGlzIG5vdCBsaXZlXCJ8IFpcbkYgLS0-IHxcIuKclCBQcmV2aW91c2x5IGFzc2lnbmVkIHJlY2lwZVwifCBJXG5IIC0tPiB8XCLinJQgQnVja2V0ZWQgaW50byB0ZXN0XCJ8IEkoQXNzaWdubWVudCBzdG9yZWQgaW4gY29va2llKVxuXG5zdWJncmFwaCBcIiBcIlxuSSAtLT4gSihFeHBvc3VyZSB0cmFja2luZyBydW5zKVxuSiAtLT4gSyhTaGFyZWQgQ1NTICYgSlMgcnVucylcbksgLS0-IEwoUmVjaXBlIENTUyAmIEpTIHJ1bnMpXG5lbmRcblxuRCAtLT4gfFwi4pyXIFRlc3QgYWN0aXZhdGUoKSBub3QgY2FsbGVkXCJ8IFooQ29tcGxldGUpXG5HIC0tPiB8XCLinJcgVGVzdCBpcyBub3QgbGl2ZVwifCBaXG5IIC0tPiB8XCLinJcgRXhjbHVkZWQgYnkgc2FtcGxlIHJhdGVcInwgWlxuTCAtLT4gWlxuZW5kXG5cblxuY2xhc3NEZWYgcnVuVXNlciBmaWxsOiNhZmEsc3Ryb2tlOiNhZmE7XG5jbGFzcyBCIHJ1blVzZXI7XG5jbGFzcyBEIHJ1blVzZXI7XG5jbGFzcyBLIHJ1blVzZXI7XG5jbGFzcyBMIHJ1blVzZXI7XG4iLCJtZXJtYWlkIjp7InRoZW1lIjoibmV1dHJhbCJ9fQ
build_notes: Save as an SVG and add "style='font-size: 14px !important;'" to the svg node as an attribute.
---

Mojito runs experiments as the browser executes your JavaScript snippet. This article should help you reason about:

 - When your experiments activate within a page load
 - Conditions required for activation
 - In which order the Mojito library, shared code & experiments fire in

And of course, [Mojito's open source code](https://github.com/mint-metrics/mojito-js-delivery/blob/master/lib/mojito.js) is a useful canonical reference, too.

## Split test object execution flowchart

This is a simplified flowchart of how Mojito runs your experiment code.

**Legend:**

 - _Grey:_ Library code
 - _Green:_ User code

[Open diagram in full screen](/img/js-delivery/api/execution-order.png).


![Mojito JS Delivery split test activation and order of execution flowchart.](/img/js-delivery/api/execution-order.png)


## Fix timing issues and avoid race conditions

Experiment triggers fire as soon as the test object loads. If you `activate` your experiment too soon, elements that your test depends on may not have loaded, causing it to fail.

Therefore, your test's `trigger` function may need to delay activation until everything you need on the page has loaded.

We recommend delaying activation until the page is ready to be transformed, by using Mojito utilities, like:

 - [`Mojito.utils.domReady()`](js-delivery-utilities#mojitoutilsdomready)
 - [`Mojito.utils.waitForElement()`](js-delivery-utilities#mojitoutilswaitforelement)
 - [`Mojito.utils.waitUntil()`](/js-delivery-utilities#mojitoutilswaituntil)

See [more utilities here](/js-delivery-utilities)


## Order of experiments inside your container

Assuming you have a couple of experiments in your container, they will be loaded from your `./lib/waves/` folder in alphabetical order. Like so:

1. `Mojito library code`
2. `Shared code`
3. Test objects:
    1. `aa3`
    2. `w1`
    3. `w5`

This order is useful to keep in mind if/when you need to access variables from one test object in another.


## External activation & cross-experiment activation

When a test object loads, it exposes its `activate()` function so you may trigger it from an external JS or another test object. As you can see in the execution order flowchart above, this lets you bypass the test's `trigger()` function logic:

```js
Mojito.testObjects.w1.activate();
```

This is useful for building tests that are dependant on one another:

 - W12:
    - Control
    - Treatment (Runs `Mojito.testObjects.w13.activate();`):
        - W13 :
            - Control
            - Treatment

Experiments can only be activated once per page unless you directly call/access the experiments' `js` and `css` files.

### Wait until the experiment has loaded

Until the test object has loaded, you will not be able to activate it externally. As above, we recommend using a polling function to wait until the experiment has loaded:

```js
Mojito.utils.waitUntil(function() {
    return !!Mojito.testObjects.w1;
}, Mojito.testObjects.w1.activate);
```

