---
id: js-delivery-setup
title: Setting up experiments with Mojito JS Delivery
sidebar_label: Two supported methods
---
There are two approaches to setup experiments in Mojito. The **gulp** builder supports both methods when building the JS container.

1.  **[Straight JS](js-delivery-setup-js.md)**: define experiment parameters, trigger code and variant code in a single JS file: `test-object.js`

2.  **[YAML / CLI _(recommended)_](js-delivery-setup-yaml.md)**: define experiment parameters in a YAML file: `config.yml`. All JS and CSS are separated into individual files.

## Why we recommend YAML / CLI

-   **Easiest to read & setup**: YAML makes your experiment configuration easy to read & manage

-   **Easier to develop experiments**: Separating JS & CSS is good practice; great for debugging & syntax highlighting

-   **Automatic variant code minification**: The YAML build path minifies & lints your variant code to minimise container weight

-   **Superior code portability**: Send winning variant code to your developers for permanent implementation - your code is separated, linted and ready to share

## We'll setup the following test using both methods:

The parameters of the test will be:

| Parameter         |                                                 |
| ----------------- | ----------------------------------------------- |
| Trigger           | Activate when users enter your site from google |
| Control variant   | No change                                       |
| Treatment variant | Alert the user with a simple message            |

Even though we recommend the YAML method, you may find it beneficial to see a **straight JS** setup, as it better reflects how Mojito works under the hood.

## Next steps

1.  [Setup a test using the JS method](js-delivery-setup-js.md)
2.  [Setup a test using the YAML / CLI method](js-delivery-setup-yaml.md)
