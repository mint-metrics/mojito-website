---
id: example-js-delivery-spillover-protection
title: Protect split tests from spillover when restarting & ramping up
sidebar_label: Restart/Ramp-up spillover protection
---

Ramping-up experiments (or performing canary releases) is a popular way of managing risks and bugs in experimentation before exposing all your traffic. A typical ramp-up process looks like this:

1. Launch an experiment to 10% of traffic
2. Check guardrail metrics & for any errors from your experiment
3. If everything looks good, you may either:
   - `A`) Ramp-up the existing experiment to 100% traffic without re-assigning users
   - `B`) Restart & re-assign users in the experiment at 100% traffic

Choosing option `A`, and ramping from 10%->100%, can [impact your split test results through Simpson's Paradox (see Section #6)](http://ai.stanford.edu/people/ronnyk/2009-ExPpitfalls.pdf). Meanwhile option `B` - restarting the experiment and re-assigning subjects - can cause spillover where users in the `Control` group are exposed to the intervention in the `Treatment` group and vice versa. This dilutes the results of your experiment and mutes any effect you hope to measure.

Restarting without acknowledging the prior run, means you'll treat all users as part of the same population to draw from:

![Spillover dilutes the effect of your treatment group's intervention on users](/img/examples/js-delivery-spillover-problem.png)

Users from the initial 10% run *will* be randomly assigned to your new 100% run, but those users who swapped variants between runs may dilute your results. It's important because the 10% of users who get reassigned skew toward your most loyal, frequent users.

## Option: `C` Vermeer spillover protection

[Lukas Vermeer, director of Experimentation at Booking.com](https://www.lukasvermeer.nl/) advocates a third and perhaps superior way to ramp experiments. Users assigned during the initial 10% run, can be excluded during the ramped-up run. It only costs a small amount of statistical power.

![Spillover dilutes the effect of your treatment group's intervention on users](/img/examples/js-delivery-spillover-protection.png)

In this case, none of the users in the 10% run will be included within the 100% ramp.

> **Prerequisites**:
> You understand [how hash-based user assignment in split tests](example-hash-function-split-test-assignment) work.

### 1. Before the experiment

Define a custom `decisionAdapter` inside your shared code - it needs to:

1. Hash a user ID defined at `Mojito.options.userId`
2. Recognise & apply the `excludeSampleRate` parameter during the test sample rate decision (when `test.options.decisionIdx === 1`)

Here's what we recommend:

```js
// Fetch or generate a user ID for use in your test bucketing decisions
Mojito.options.userId = Mojito.utils.getMojitoUserId();

// Override the default decision adapter with this custom one
Mojito.options.decisionAdapter = function (test) {
    // Calculate decision from userId MD5 digest
    test.options.digest = test.options.digest || Mojito.utils.md5(Mojito.options.userId + test.options.id);
    var startPos = test.options.decisionIdx * 8,
        endPos = startPos + 8,
        digest = test.options.digest,
        decision = parseInt(digest.substring(startPos, endPos), 16) / 0xFFFFFFFF;

    // Ramp-up spillover protection - By Lukas Vermeer https://lukasvermeer.nl/
    // Exclude users below a test's excludeSampleRate threshold to avoid spillover after ramp-up/restart
    if (test.options.decisionIdx === 1 && test.options.excludeSampleRate && decision < test.options.excludeSampleRate) {
        return -1;
    }

    return decision;
};
```

### 2. Canary release to 10%

When you launch your experiment, you'll need to set it live for:

1. Set the sample to 10%: `sampleRate: 0.1`
2. Disable cookies for your test's state (i.e. Generate a decision from your userId every time the test activates): `options.cookieDuration: -1`

Your experiment YAML might resemble this:

```yml
state: live
sampleRate: 0.1
id: ex3
name: Homepage button
recipes:
  '0':
    name: Control
  '1':
    name: Treatment
    css: 1.css
trigger: trigger.js
options:
   cookieDuration: -1
```

### 3. 100% ramp-up

When it comes time to ramp up, you'll need to:

1. Set the sample rate to 100% (effectively 90%): `sampleRate: 1`
2. Exclude the first 10% of users: `excludeSampleRate: 0.1`
3. (Optional) Re-enable cookies, by removing the `options.cookieDuration: -1` parameter

```yml
state: live
sampleRate: 1
excludeSampleRate: 0.1
id: ex3
name: Homepage button
recipes:
  '0':
    name: Control
  '1':
    name: Treatment
    css: 1.css
trigger: trigger.js
```

## Wrapping up

Those are some options for managing split test spillover during ramp-up. Each have their trade-offs, and in an ideal world, you would launch every experiment to 100% of traffic - and use Real-time data to decide whether to pull them or not.

Short of living in an ideal world, you have Mojito, which provides you with the control you need to manage your assignment around these risks.
