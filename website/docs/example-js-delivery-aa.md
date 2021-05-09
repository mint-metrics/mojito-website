---
id: example-js-delivery-aa
title: Run an AA test in Mojito
sidebar_label: Run an AA test
---
An AA test runs identical variants against each other so experimenters may detect issues with sample ratio mismatch (SRM), other non-random differences between the groups or general instrumention issues. 

While it's uncommon to detect issues outside of Type-1 and Type-2 errors it's [generally a good practice to run AA tests](https://cxl.com/blog/aa-testing-waste-time/). Running an AA test helps establish trust in your instrumention and decisioning. We have found AA tests most useful when implementing custom `decisionAdapter` functions in Mojito.

A typical AA test will have two groups:

-   Control group: No change
-   Treatment group: No change

&gt; **Pre-requisites**: 
&gt; You're [familiar with creating a simple experiment](example-js-delivery-simple-ab) in Mojito. 

## Experiment parameters

| Parameter        | Details                     |
| ---------------- | --------------------------- |
| Targeting        | All pages                   |
| Traffic / Sample | 100%                        |
| Variants         | Control: 50%, Treatment 50% |

## 1. Create the test

Mojito lets you create AA test through the CLI, through its dedicated `--aa` flag:

```sh

gulp new --aa aa1

```

Of course, the AA flag does not generate special experiment configuration - just an empty scaffold for you to define your AA test within.

The command will output all your experiment config under `lib/waves/aa1` (where `aa1` can be replaced by the parameter you pass into the generator command above):

-   `config.yml`: The experiment configuration YAML
-   `trigger.js`: The conditional activation trigger 

## 2. Configure your experiment

Let's give the experiment a proper name and set its traffic allocation to 100% of traffic:

-   `name`: `AA test 1`
-   `sampleRate`: `1`

As usual, traffic will be evenly distributed amongst recipes (50-50, in this case) - so we don't need to set the `sampleRate` parameter for each recipe in this instance.

Your experiment config should now look like this:

```yml

state: staging
sampleRate: 1
id: aa1
name: AA test 1
recipes:
  '0':
    name: Control
  '1':
    name: Treatment
trigger: trigger.js

```

## 3. Launch the test & publish your container

You've created an AA test, now let's send it live and publish it to your site:

```sh

# Set the test live
gulp set --live aa1

# Build your container file
gulp build

# (If you'e set up S3 publishing) Publish the container to AWS S3
gulp publish

```

Your experiment will start as soon as users start downloading your Mojito container.
