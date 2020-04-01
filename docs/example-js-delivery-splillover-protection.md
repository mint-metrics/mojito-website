---
id: example-js-delivery-spillover-protection
title: Protect split tests from spillover when restarting & ramping up
sidebar_label: Restart/Ramp-up spillover protection
---

Ramping-up experiments (or canary releases) is a popular way of managing risks of experimentation and catching bugs before the wider population is assigned. A typical ramp-up process looks like this:

1. Launch an experiment to 10% of traffic
2. Check guardrail metrics & for any errors from your experiment
3. If everything looks good, either:
   - `A`) Ramp-up the existing experiment to 100% traffic without re-assigning users
   - `B`) Restart & re-assign users in the experiment at 100% traffic

Choosing option `B`, and ramping from 10%->100%, can [impact your split test results through Simpson's Paradox (see Section #6)](http://ai.stanford.edu/people/ronnyk/2009-ExPpitfalls.pdf). Meanwhile option `A`, restarting the experiment and re-assigning subjects, can cause spillover where users in the `Control` group are exposed to the intervention in the `Treatment` group and vice versa. This will no-doubt dilute the results of your experiment and mute any effect you hope to measure.

Restarting without acknowledging the prior run, means you'll treat all users as part of the same population to draw from:

![Spillover dilutes the effect of your treatment group's intervention on users](/img/examples/js-delivery-spillover-problem.png)

Users in the 10% run *will* be randomly assigned to your new 100% run, but let's face it - Anyone who swapped groups between runs may dilute your results.

## Another option: `C` Spillover assignment protection

[Lukas Vermeer, director of Experimentation at Booking.com](https://www.lukasvermeer.nl/) advocates a third and perhaps superior option to use for ramping experiments. Users assigned during the initial 10% run, can be excluded during the ramped-up run. All it takes is a slight 


We'll illust problem with Mojito's `decisionAdapter`

