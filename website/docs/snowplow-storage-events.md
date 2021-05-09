---
id: snowplow-storage-events
title: Mojito Snowplow Storage Events & JavaScript tags
sidebar_label: Events & tags
---
For most experiment reports, we're interested in collecting just three events:

1.  Exposures (or assignments)
2.  Failures (errors in experiment variants, shared code or triggers)
3.  Conversions (e.g. clicks, page views, purchases or leads)

From these three events, we can calculate everything we need for powering our reports.

## 1. Recipe exposures (assignment/decision events)

These events are tracked approximately when users get assigned or bucketed into a test group. We use this to establish the time and group each user is in, so any future conversions can be attributed to the test.

Our initial self describing events tracked many fields (like whether the exposure was a users' first, namespaces, recipe IDs and other frivalous details) all of which we never used in reports. Since then, our events evolved into simpler schemas focussing on the core fields needed for experiments. This saves data warehouse space and analysts' time worrying about useless fields.

### Fields reference

| Parameter                                        | Description                                                                                                                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **waveId** <br /> Type: _string_ <br /> _Required_   | A canonical ID of the test used in cookies and in experiment in reports (one day, the Wave ID may become part of the PRNG seed for deterministic assignment) |
| **waveName** <br /> Type: _string_ <br /> _Required_ | This is a descriptive name used for the experiment in any tracking.                                                                                          |
| **recipe** <br /> Type: _string_ <br /> _Required_   | This is the name of the recipe a user has been assigned and exposed to.                                                                                      |

### Add to Snowplow

-   [Mojito Exposure JSON Schema](https://github.com/mint-metrics/mojito-snowplow-storage/blob/master/events/jsonschema/io.mintmetrics.mojito/mojito_exposure/jsonschema/1-0-0)
-   [Mojito Exposure SQL table definition](https://github.com/mint-metrics/mojito-snowplow-storage/blob/master/events/sql/io.mintmetrics.mojito/mojito_exposure_1.sql)
-   [Mojito Exposure JSON Paths](https://github.com/mint-metrics/mojito-snowplow-storage/blob/master/events/jsonpaths/io.mintmetrics.mojito/mojito_exposure_1.json)

```js

your_snowplow_tracker("trackSelfDescribingEvent", {
    schema: "iglu:io.mintmetrics.mojito/mojito_exposure/jsonschema/1-0-0",
    data: {
        "waveId": "ex1",
        "waveName": "Example 1",
        "recipe": "Control"
    }
});

```

## 2. Recipe failures (error tracking)

Whenever you deploy new code to your site, there's a chance that the code will break. Sometimes your variants break due to browsers executing your code differently, other deployments breaking tests mid-way through or other unexpected issues. Errors can mean the difference between your treatment working or breaking. 

**Pro tip:** If you use [Snowplow's UA Parser enrichment](https://github.com/snowplow/snowplow/wiki/ua-parser-enrichment), be sure to use our `recipe_errors` data model (TBC) for some basic debugging information at the ready. It works great in Superset & R!

### Fields reference

| Parameter                                         | Description                                                                                                |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **waveId** <br /> Type: _string_ <br /> _Required_    | This is the canonical way of identifying a test in cookies and in your internal dataset.                   |
| **waveName** <br /> Type: _string_ <br /> _Required_  | This is a descriptive name used for the experiment in any tracking.                                        |
| **component** <br /> Type: _string_ <br /> _Required_ | This is the component such as the recipe name or shared code that a user has been assigned and exposed to. |
| **error** <br /> Type: _string_ <br /> _Optional_     | If there was an error message or stack passed back, it can be captured in this field.                      |

### Add to Snowplow

-   [Mojito Failure JSON Schema](https://github.com/mint-metrics/mojito-snowplow-storage/blob/master/events/jsonschema/io.mintmetrics.mojito/mojito_failure/jsonschema/1-0-0)
-   [Mojito Failure SQL table definition](https://github.com/mint-metrics/mojito-snowplow-storage/blob/master/events/sql/io.mintmetrics.mojito/mojito_failure_1.sql)
-   [Mojito Failure JSON Paths](https://github.com/mint-metrics/mojito-snowplow-storage/blob/master/events/jsonpaths/io.mintmetrics.mojito/mojito_failure_1.json)

```js

your_snowplow_tracker("trackSelfDescribingEvent", {
    schema: "iglu:io.mintmetrics.mojito/mojito_failure/jsonschema/1-0-0",
    data: {
        "waveId": "ex1",
        "waveName": "Example 1",
        "component": "Control",
        "error": "Something is undefined."
    }
});

```

## 3. Conversions (every other event)

No specific conversion events exist for Mojito. 

Instead, we treat any of Snowplow's rich, high-fidelity events as conversions. Common events we track include:

-   Transactions (and revenue)
-   Leads
-   Events
-   Page views

Even though we select all conversion events into the conversion tables, our reports ensure proper causality and attribution. Only conversions after a subject's first exposure are attributed to the experiment. Then, we can say: Treatment (`Cause`) -&gt; Conversion (`Effect`).

Snowplow data is insanely rich. You'll be able to perform much deeper analysis than you can in non-analytical split tetsing tools.

## Why not use contexts for exposure tracking?

Many in the Snowplow community use custom contexts attached to every event tracked by the client. I think this is wasteful.

If you're running Dense Compute Redshift nodes, space is a premium. Passing a context alongside every event uses more space in your contexts table than is necessary. You can always perform the experiment-conversion-attribution server-side, just like on Mojito, and save disk space.

Besides, perhaps the test cookies were set on one domain and not transferred to the domain the conversion took place on. Or perhaps you want to stitch together different Snowplow User IDs and need to attribute conversions across devices.

By performing attribution server-side, you're not limited by your data collection setup.
