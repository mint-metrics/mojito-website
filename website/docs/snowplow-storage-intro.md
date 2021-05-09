---
id: snowplow-storage-intro
title: Mojito Snowplow Storage overview
sidebar_label: Introduction
---
This component allows you to collect experiment events and perform the necessary data modelling for [Mojito R Analytics](r-analytics-intro.md) reports and other tools. 

There are two parts to this component:

1.  **Events** (`./events`): Self-describing events emitted from experiments, comprised of JSON schemas and Snowplow JSON Paths / Redshift tables
2.  **Data models** `./redshift-datamodels`: SQL data models for attributing `conversions` back to variant `exposures` in reporting

## Prerequisites

To make use of this out of the box, you'll need:

-   Snowplow running with Redshift as a storage target
-   Snowplow's SQL Runner app

It's possible to do this without the above, but you'll need some heavy modification.

## Getting started

[Add the events to your Iglu](https://discourse.snowplowanalytics.com/t/introductory-guide-to-creating-your-own-self-describing-events-and-contexts-tutorial/1377) and [setup your data modelling steps in SQL Runner](https://github.com/snowplow/sql-runner/wiki/Guide-for-analysts):

1.  [Add JSON schema to your Iglu](https://github.com/mint-metrics/mojito-snowplow-storage/tree/master/events/jsonschema)
    -   This is required for event validation and shredding during enrichment
2.  (Redshift only) [Put the JSON paths files in your JSON paths folder](https://github.com/mint-metrics/mojito-snowplow-storage/tree/master/events/jsonpaths)
    -   If running Redshift, this maps the JSON keys to your table fields
3.  (Redshift only) [Create the tables in Redshift for loading shredded events](https://github.com/mint-metrics/mojito-snowplow-storage/tree/master/events/sql)
    -   If running Redshift, this is the table definition that shredded events will populate
4.  Setup SQL Runner to load your report tables each day ([Redshift data models](snowplow-storage-data-models.md))
    -   This step creates the data model used for reporting

## Future work

We intend to support GCP/BigQuery in the future as we need, but for now, we only support Redshift.

## Get involved

Let us know if you encounter any issues and reach out to us if you need a hand getting set up.

-   [Open an issue on Github](https://github.com/mint-metrics/mojito-snowplow-storage/issues/new)
-   [Mint Metrics' website](https://mintmetrics.io/)
