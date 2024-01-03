---
id: example-js-delivery-cross-trigger
title: "Triggering experiments remotely from other A/B tests or code"
sidebar_label: Remotely triggered experiments
---
There may come a time where you need to trigger an experiment remotely. Mojito lets you trigger experiments from outside the test object.

![Cross-experiment triggers](/img/examples/js-delivery-cross-trigger.png)

<!-- https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggTFJcbiAgQShUcmFmZmljKSAtLT58MTAwJXwgQntUZXN0IDF9XG4gIEIgLS0-fDUwJXwgRFtDb250cm9sXVxuICBCIC0tPnw1MCV8IEVbVHJlYXRtZW50XVxuXHRFIC0tPnwxMDAlfCBGe1Rlc3QgMn1cbiAgRiAtLT58NTAlfCBHW0NvbnRyb2xdXG4gIEYgLS0-fDUwJXwgSFtUcmVhdG1lbnRdIiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZX0  -->

Imagine we're working at Booking.com and we want to increase bookings for "Holiday Rentals". One idea might be to show offer banners in SERPs

> **Pre-requisites** 
> You're familiar with [creating a simple A/B test](example-js-delivery-simple-ab).

## Experiment parameters

### Test 1

| Parameter        | Details                                                                          |
| ---------------- | -------------------------------------------------------------------------------- |
| Hypothesis       | Showing a holiday rentals banner to users will increase holiday rental bookings. |
| Targeting        | SERPs                                                                            |
| Traffic / Sample | 100%                                                                             |
| Variants         | Control: 50%, Treatment 50%                                                      |

#### Control

No offer banner.

#### Treatment

Show the offer banner.

![A/B split test 1: Treatment](/img/examples/js-delivery-cross-trigger-control.png)

### Test 2

| Parameter        | Details                                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| Hypothesis       | Highlighting the money-saving benefits of holiday rentals in offer banners will increase holiday rental bookings. |
| Targeting        | SERPs **with Test 1 active**                                                                                      |
| Traffic / Sample | 100%                                                                                                              |
| Variants         | Control: 50%, Treatment 50%                                                                                       |

#### Control

Standard copy.

![A/B split test 2: Control](/img/examples/js-delivery-cross-trigger-control.png)

#### Treatment

Money-saving benefits-led copy.

![A/B split test 2: Treatment](/img/examples/js-delivery-cross-trigger-treatment.png)

## 1. Create your experiments

Using the command line, let's scaffold everything we need for the two experiments:

```sh

npm run new -- --ab ex1 && npm run new -- --ab ex2

```

## 2. Setup your first experiment: EX1

We'll configure the first experiment like so:

config.yml

```yml

state: staging
sampleRate: 0
id: ex1
name: EX1 Booking.com Holiday Rentals SERP offer
recipes:
  '0':
    name: Control
    css: 0.css # We need to hide the banner using CSS on the Control group
  '1':
    name: Treatment
    js: 1.js # This JS in the treatment group will enable the EX2 test
trigger: trigger.js

```

trigger.js

```js

function trigger (test) {
    // We can activate straight away on this page because we're only injecting
    //  - CSS to Hide the banner for the Control Group
    //  - JS to listen for the element to Enable EX2 in the Treatment group
    if (document.location.pathname === '/searchresults.en-gb.html') test.activate();
}

```

0.css

```css

/* This will hide the banner on Booking.com's SERP for the Control group */
div[data-pers-banner-id="3"] {
    display: none;
}

```

1.js

```js

function treatment () {
    // Make sure EX2 is available first
    Mojito.utils.waitUntil(function () {
        return typeof Mojito.testObjects.ex2 !== 'undefined';
    }, function () {
        // Then wait for the offer banner to show up in the DOM
        Mojito.utils.waitForElement('div[data-pers-banner-id="3"]', function () {
            // When the banner is available, it's time to get the dependent EX2 test and activate it
            Mojito.testObjects.ex2.activate();
        });
    });
}

```

Notice how in `1.js`, we call for `Mojito.testObjects.ex2`? From here, we can access any variable on the `EX2` test object - including it's `activate()` function!

As long as we know it's the right time to activate the experiment, it's ready to call the test's `activate()` function. You may like to use some defensive checks to ensure the test object and everything else is ready.

## 3. Configure the second experiment: EX2

EX1 will be calling this experiment. Let's configure it like so:

config.yml

```yml

state: staging
sampleRate: 0
id: ex2
name: EX2 Booking.com Holiday Rentals SERP offer copy
recipes:
  '0':
    name: Control
  '1':
    name: Treatment
    js: 1.js
trigger: trigger.js

```

trigger.js

```js

function trigger () {
    // We can leave this function empty since we'll be activating it externally
}

```

1.js

```js

function treatment () {
    // We'll now change the copy inside the banner
    var content = document.querySelector('div[data-pers-banner-id="3"]');
    content.querySelector('.bui-banner__title').innerText = 'Save money by booking holiday rentals';
    content.querySelector('.bui-button__text').innerText = 'See holiday rental deals';
}

```

In this experiment, we can use an empty trigger function because we call the test's `activate()` function from `EX1`.

## 4. Previewing the experiments

By now, your experiments are ready to build and preview. Give it a:

```sh

npm run deploy

```

> Note: 
> Unless you're reading this at Booking.com, you probably don't have publish access to their domains. Instead, we can paste the minified Mojito container code into the Browser console to see that everything works.

Since we'll be testing on Booking.com's SERP, we need to tag the URL with Mojito preview parameters for:

-   EX1: `mojito_ex1=1`
-   EX2: `mojito_ex2=1`

**This URL:** `https://www.booking.com/searchresults.en-gb.html?mojito_ex1=1&mojito_ex2=1&label=gen173nr-1FCAEoggI46AdIM1gEaA-IAQGYAQm4AQfIAQzYAQHoAQH4AQuIAgGoAgO4Ao3FvfMFwAIB&lang=en-gb&sid=18b02e01ff9c6991030b57e85fc31cfa&sb=1&sb_lp=1&src=index&src_elem=&ssne=Auckland&ssne_untouched=Auckland&dest_id=-1506909&dest_type=city&checkin_year=2020&checkin_month=4&checkin_monthday=8&checkout_year=2020&checkout_month=4&checkout_monthday=11&group_adults=2&group_children=0&no_rooms=1&b_h4u_keep_filters=&from_sf=1`

**Becomes this:** `https://www.booking.com/searchresults.en-gb.html?label=gen173nr-1FCAEoggI46AdIM1gEaA-IAQGYAQm4AQfIAQzYAQHoAQH4AQuIAgGoAgO4Ao3FvfMFwAIB&lang=en-gb&sid=18b02e01ff9c6991030b57e85fc31cfa&sb=1&sb_lp=1&src=index&src_elem=&ssne=Auckland&ssne_untouched=Auckland&dest_id=-1506909&dest_type=city&checkin_year=2020&checkin_month=4&checkin_monthday=8&checkout_year=2020&checkout_month=4&checkout_monthday=11&group_adults=2&group_children=0&no_rooms=1&b_h4u_keep_filters=&from_sf=1`**`&mojito_ex1=1&mojito_ex2=1`**

This forces you into the treatment of both experiments.
