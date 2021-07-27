---
id: example-js-delivery-divert
title: Divert all traffic to the winning variant in Mojito
sidebar_label: Divert traffic to a winning variant
---
When an experiment you run is wildly successful, you may want to send 100% of eligible traffic to the variant after completion. Usually we [recommend hard-coding successful recipes](#why-you-should-prefer-to-hard-code-your-winning-variants-over-using-divert), but when developer resources are scarce and the feature is delivering lots of value, you can use Mojito to divert traffic to the winner temporarily.

![Publish a variant to all traffic](/img/examples/js-delivery-divert.png)

<!-- https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggTFJcbiAgQShUcmFmZmljKSAtLT58MTAwJXwgQntFeHBlcmltZW50fVxuICBCIC0tPnwwJXwgRFtDb250cm9sXVxuICBCIC0tPnwxMDAlfCBFW1RyZWF0bWVudF1cblx0XHQiLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9fQ  -->

Consider the following circumstances:

-   You ran an experiment that increased sales by a large amount and it's time to switch the experiment off
-   The business requires the new feature to be implemented but can't spare the development resources (yet)
-   The business wants to run a follow-up experiment further refining the variants, and has not settled on an execution for production

These scenarios may call for temporary hosting via Mojito.

## 1. Your experiment whilst live

Consider the winning recipe was the `Green` button for the following experiment. 

It's live and distributing all traffic, evenly (`33.3`/`33.3`/`33.3`), amongst three recipes:

```yml

id: ex4
name: Button colours
state: live
sampleRate: 1
recipes:
  '0':
    name: Red
  '1':
    name: Green
    css: green.css
  '2':
    name: Blue
    css: blue.css
trigger: trigger.js

```

And after running the experiment, it's wildly successful and you're instructed to urgently roll out the feature...

## 2. Stop the experiment & divert all traffic to the winning variant

Stopping and diverting traffic just needs the `divertTo` flag in the experiment. 

Simply add the `divertTo` with the winning recipe `id`. Since `Green` won, we send all traffic to the `Green` variant (recipe ID `1`), like so:

```yml

id: ex4
name: Button colours
state: live
sampleRate: 1
divertTo: '1'
recipes:
  '0':
    name: Red
  '1':
    name: Green
    css: green.css
  '2':
    name: Blue
    css: blue.css
trigger: trigger.js

```

Mojito's `divertTo` flag is a special flag for full featue roll outs. It enables:

1.  Bypassing a user's prior bucketing (users who would have seen `Red` or `Blue` buttons before, will now see `Green` when divert is enabled) - This is intended to maximise the value of your feature
2.  Prevents exposure tracking from firing during `divert` mode - So your experiment results won't be invalidated through SRM failure

This allows you to expose as many users as possible to your feature without impacting your experiment results.

## Why not divert traffic by changing the recipe sample rates?

You may feel another approah would be set the recipe `sampleRate` variables. But we **don't recommend** this:

```yml

id: ex4
name: Button colours
state: live
sampleRate: 1
recipes:
  '0':
    name: Red
    sampleRate: 0
  '1':
    name: Green
    css: green.css
    sampleRate: 1
  '2':
    name: Blue
    css: blue.css
    sampleRate: 0
trigger: trigger.js

```

Users who had previously been exposed to `Red` or `Blue` variants before you changed the `sampleRate` properties, will continue to see `Red` or `Blue`. Mojito persists the variants you were originally exposed to. This is by design, since most experiments assign treatments to user-level units.

Just changing the sample rates won't stop the tracking from firing. Therfore, through this approach, you may trigger an SRM failure in your reports.

## Why you should prefer to hard-code your winning variants over using divert

Keep in mind, that when diverting experiments to 100% of traffic, they may: 

-   Impact your site performance unecessarily (as each experiment takes up space in your container)
-   Make it harder to reason about what content is from the CMS / Mojito
-   When using [`Mojito.options.exclude`, not all traffic will see your variants](js-delivery-customisation#default-exclusion-rule)

Ultimately, it's up to you to decide when and where to use this feature.
