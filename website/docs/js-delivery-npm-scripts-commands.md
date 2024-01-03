---
id: js-delivery-npm-scripts-commands
title: npm Scripts CLI reference for Mojito JS Delivery
sidebar_label: "npm Scripts commands (>=2.5.0)"
---

You can build your container, perform unit tests, manage experiments and even publish your container to your S3 buckets all from your terminal. 

It's the quickest way to manage your container. 

## test

Run your Mojito library against the test suite to confirm it's working as expected.

### Commands

-   `npm run test`

| Flags | Description |
| ----- | ----------- |
| N/A   |             |

### Example: Upgrading Mojito library

Imagine you upgraded your Mojito library to the latest version and you want to check it's working correctly against the full test suite. Running `test` will run the `lib/mojito.js` library through all available tests.

```sh

$ npm run test

> mojito-js-delivery@2.5.0 test
> node scripts/command.js --command test

  Mojito wave functions
    ✓ Plain test activates
    ✓ Plain test accessible via .getTest()
    ✓ Exposure event fired
    ✓ Users can return to test bypassing sample rate
    ✓ Test object can only be activated once
    ✓ Staging mode test not activated
    ✓ Manual exposure event fires when called
    ✓ Manual exposure event does not fire when it is not called
    ✓ Divert mode sends users to correct recipe
    ✓ Error captured by storage adapter
    ✓ Exclude users through sample rate
    ✓ Exclude users through container setting
    ✓ CSS Injection on recipe level
    ✓ CSS Injection on test level
    ✓ Mojito.options.decisionAdapter was called
    ✓ Choose a specific recipe by decisionAdapter
    ✓ User excluded by due to chosen recipe missing
    ✓ Activate tests with recipes' sampleRates set
    ✓ Preview mode is working
    ✓ Recipes with different and same sample rates
    ✓ Prevent test trigger errors from stopping later test objects from running
    ✓ Tests fail when recipe-level sample rates are not set for all recipes

  Mojito utils functions
    ✓ domReady event fired
    ✓ ObserveSelector on existing elements
    ✓ Multi observers on the same elements
    ✓ ObserveSelector on dynamic elements
    ✓ ObserveSelector timeout
    ✓ WaitForElement on existing elements
    ✓ WaitForElement on dynamic elements
    ✓ WaitUntil
    ✓ WaitUntil timeout
    ✓ WatchElement changes

  32 passing (4s)

```

## build

The `build` command builds the Mojito container using all the available tests inside `lib/waves/*`. Any JS test objects named `test-object.js` or YML test definitions that are not `inactive` state will be parsed and added to the container in ascending order.

The output of this script will save your mojito container into both minified and unminified files under `dist/{{scriptname}}.js` and `dist/{{scriptname}}.pretty.js`, where `{{scriptname}}` is the configured name you used in your repository's `config.js` `containerName` variable.

### Commands

-   `npm run build`

| Flags | Description |
| ----- | ----------- |
| N/A   |             |

### Example: Build a new test into your container

Imagine you've just created a new experiment (Wave ID: `ex1`) and you want to build it into your Mojito container. Running `npm run build` will build the container and provide a summary of the experiments inside it.

```sh

$ npm run build

> mojito-js-delivery@2.5.0 build
> node scripts/command.js --command build

┌─────┬──────────────┬───────┬────────────┬────────────────┐
│ ID  │ Name         │ State │ Size (raw) │ % of container │
├─────┼──────────────┼───────┼────────────┼────────────────┤
│ ex1 │ ex1 scaffold │ live  │ 0.49kb     │           1.0% │
├─────┼──────────────┼───────┼────────────┼────────────────┤
│ -   │ Shared code  │ -     │ 6.83kb     │          14.0% │
├─────┼──────────────┼───────┼────────────┼────────────────┤
│ -   │ Library code │ -     │ 41.16kb    │          84.1% │
└─────┴──────────────┴───────┴────────────┴────────────────┘

Container size (raw): 48.97kb
Container size (minified & gzipped): 7.42kb
Experiments: 1

```

In the output above, you can see `w2` has been included in your Mojito container with state set to `staging`.


## deploy

The `deploy` command builds the Mojito container as above and publishes it to Amazon S3.

### Commands

-   `npm run deploy`

| Flags | Description |
| ----- | ----------- |
| N/A   |             |

### Example: Deploy your latest container changes locally

While developing experiments, you may be testing your code by publishing the container changes to your dev environment. 

```sh

$ npm run deploy

> mojito-js-delivery@2.5.0 deploy
> node scripts/command.js --command deploy

┌─────┬──────────────┬───────┬────────────┬────────────────┐
│ ID  │ Name         │ State │ Size (raw) │ % of container │
├─────┼──────────────┼───────┼────────────┼────────────────┤
│ aa1 │ AA1 Test     │ live  │ 0.30kb     │           0.6% │
├─────┼──────────────┼───────┼────────────┼────────────────┤
│ -   │ Shared code  │ -     │ 6.83kb     │          14.0% │
├─────┼──────────────┼───────┼────────────┼────────────────┤
│ -   │ Library code │ -     │ 41.16kb    │          84.4% │
└─────┴──────────────┴───────┴────────────┴────────────────┘

Container size (raw): 48.78kb
Container size (minified & gzipped): 7.37kb
Experiments: 1
Published: ./dist/assets/js/mojito.js
Published: ./dist/assets/js/mojito.pretty.js

```

As you can see, it built and published the container in one command.


## set

Sets the `state` of an experiment and/or can `divert` an experiment's traffic to a particular `recipe`.

### Commands

-   `npm run set -- live --waveId [waveid] --traffic [samplerate]`
-   `npm run set -- staging --waveId [waveid]`
-   `npm run set -- inactive --waveId [waveid]`
-   `npm run set -- divert --waveId [waveid] --recipe [recipeid]`

| Flags                                                          | Description                                                                                                                                                                                                                                                                                                     |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| -- live --waveId [waveid (required)], --traffic [samplerate] \(optional) | Change a given `wave ID`'s state to `live`, so new users can be assigned into the test. Live tests will be built into the container. Optionally, you can specify the sample rate of traffic to set the experiment live to between 0 and 1. The default traffic sample rate is set to 1 otherwise. |
| -- staging --waveId [waveid (required)]                                  | Change a given `wave ID`'s state to `staging`, so new users won't be assigned into the test. Staging tests will be built into the container.                                                                                                                                                      |
| -- inactive --waveId [waveid (required)]                                 | Change a given `wave ID`'s state to `inactive`. The experiment will not be built into the container, placing it in an archived state.                                                                                                                                                             |
| -- divert --waveId [waveid (required)], --recipe [recipeid (required)]   | Set the `divertTo` flag of a particular `wave ID`, so all users will be diverted into the specified test's `recipe ID`. This does not affect the `state` of an experiment.                                                                                                          |

### Example: Sending a test live

You've completed code review/QA on your experiment (Wave ID: `ex1`) and now you want to send it live so 10% of users will be bucketed into the test. 

To set your `ex1` experiment to state `live` for 10% of users issue the command:

```shell

$ npm run set -- live --waveId ex1 --traffic 0.1

> mojito-js-delivery@2.5.0 set
> node scripts/command.js --command set "live" "--waveId" "ex1"

Test ex1 has been changed to live successfully: ./lib/waves/ex1/config.yml

```

Then, when you next run `npm run build`, and build your container, your `ex1` test will readily bucket users into the test.

### Example: Divert all traffic to a particular recipe

You just finished running your experiment (Wave ID: `ex1`) and the Treatment group (Recipe ID: `1`) lifted conversion rates massively. Now the business is busy hardcoding it into your app. However your business wants to take advantage of the higher conversion rate of the treatment whilst it gets developed into the monolithic web app. 

Set the test to force eligible users into the Treatment group, bypassing the usual assignment: 

```shell

$ npm run set -- divert --waveId ex1 --recipe 1

> mojito-js-delivery@2.5.0 set
> node scripts/command.js --command set "divert" "--waveId" "ex1" "--recipe" "1"

Test ex1 has been diverted to 1 (Treatment) successfully: ./lib/waves/ex1/config.yml

```

Note that the test needs to be `live` before you can divert traffic into it.

### Example: Stop and archive a test

Your experiment (Wave ID: `ex1`) has served it's purpose well and it's now time to switch off. 

Simply set it to `inactive`, like so: 

```shell

$ npm run set -- inactive --waveId ex1

> mojito-js-delivery@2.5.0 set
> node scripts/command.js --command set "inactive" "--waveId" "ex1"

Test ex1 has been changed to inactive successfully: ./lib/waves/ex1/config.yml

```

And when you next run `npm run build`, your `ex1` test object will no longer show up in your container, freeing up space inside your container.

## new

Creates the scaffolding for a new `ab`, `aa` or `demo` test. Generates all the required files such as `lib/waves/{{waveid}}/config.yml`, `lib/waves/{{waveid}}/trigger.js`, `lib/waves/{{waveid}}/1.js` and `lib/waves/{{waveid}}/1.css` depending on the type of experiment.

### Commands

-   `npm run new -- --ab [waveid]` 
-   `npm run new -- --aa [waveid]`
-   `npm run new -- --demo [waveid]`

| Flags                      | Description                                                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| -- --ab [waveid (required)]   | Scaffolds a standard test config file with a given `waveid`, so you can speed up your test development by using safe defaults. |
| -- --aa [waveid (required)]   | Scaffolds files for new A/A test for a given `waveid`, so you can check your instrumentation.                                  |
| -- --demo [waveid (required)] | Scaffolds a new demo test with a given `waveid`, just so we can show you how Mojito tests work.                                |

### Example: Running an A/A test

You're a new Mojito user and you want to check you have proper random assignment by running an A/A test.

Call `npm run new --` with the `--aa` flag and an appropriate `waveid`:

```shell

$ npm run new -- --aa aa1

> mojito-js-delivery@2.5.0 new
> node scripts/command.js --command new "--aa" "aa1"

Test aa1 has been created successfully.

```

To launch this, you can then just run:

```shell

npm run set -- live --waveId aa1
npm run deploy

```

Easy, right?

## publish

Publishes the built containers inside `dist/*.js` to the Amazon S3 paths configured under your repository's `config.js` folder. Defaults to publishing into your staging environment.

### Commands

-   `npm run publish`
-   `npm run publish --production`

| Flags                   | Description                                                                                                                                                                                                                                              |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| --production (optional) | Publish the `dist/*.js` files into your production S3 path, rather than your staging S3 path.                                                                                                                                                     |
| --awsk (optional)       | Your AWS access key ID for the bucket. Defaults to your AWS credentials in your current environment. We recommend [using environment variables or AWS credentials files](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).      |
| --awss (optional)       | Your AWS secret access key for the bucket. Defaults to your AWS credentials in your current environment.  We recommend [using environment variables or AWS credentials files](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html). |

### Example: Publishing a test to your staging container

You're building an experiment and you want to check it's working properly in your staging container before you roll it out to production.

Assuming you've built your container with `npm run build`, you can go ahead and use `npm run publish` to upload it to S3:

```shell

$ npm run publish

> mojito-js-delivery@2.5.0 publish
> node scripts/command.js --command publish

Published: ./dist/assets/js/tfeb.js
Published: ./dist/assets/js/tfeb.pretty.js

```

Once published, it will be available from your S3 container's URL.
