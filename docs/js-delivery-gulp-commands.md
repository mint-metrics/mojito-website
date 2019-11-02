---
id: js-delivery-gulp-commands
title: Gulp CLI reference for Mojito JS Delivery
sidebar_label: Gulp commands / CLI
---

You can build your container, perform unit tests, manage experiments and even publish your container to your S3 buckets all from your terminal. 

It's the quickest way to manage your container. 

## gulp test

Run your Mojito library against a set of unit tests to confirm it's working as expected.

### Commands

 - `gulp test`

Flags | Description
--|--
N/A | &nbsp;

### Example: Upgrading Mojito library

Imagine you upgraded your Mojito library to the latest version and you want to check it's working correctly against the full test suite. Running `test` will run the `lib/mojito.js` library through all available tests.

```shell
$ gulp test
[14:58:40] Using gulpfile ~/Documents/mojito-js-delivery/gulpfile.js
[14:58:40] Starting 'test'...
Excluded from test by Mojito.options.excluded value.


  Mojito wave functions
    ✓ Plain test activates
    ✓ Plain test accessible via .getTest()
    ✓ Exposure event fired
    ✓ Users can return to test bypassing sample rate
    ✓ Staging mode test not activated
    ✓ Manual exposure event fires when called
    ✓ Manual exposure event does not fire when it is not called
    ✓ Divert mode sends users to correct recipe
    ✓ Error captured by storage adapter
    ✓ Exclude users through sample rate
    ✓ Exclude users through container setting
    ✓ CSS Injection on recipe level
    ✓ CSS Injection on test level

  Mojito utils functions
    ✓ observeSelector on existing elements
    ✓ observeSelector on dynamic elements
    ✓ observeSelector timeout (1011ms)
    ✓ waitForElement on existing elements
    ✓ waitForElement on dynamic elements
    ✓ waitUntil (1001ms)
    ✓ waitUntil timeout (1511ms)
    ✓ watchElement changes


  21 passing (4s)

[14:58:44] Finished 'test' after 4.05 s
```

## gulp scripts

`scripts` builds the Mojito container using all the available tests inside `lib/waves/*`. Any JS test objects named `test-object.js` or YML test definitions that are not `inactive` state will be parsed and added to the container in ascending order.

The output of this script will save your mojito container into both minified and unminified files under `dist/{{scriptname}}.js` and `dist/{{scriptname}}.pretty.js`, where `{{scriptname}}` is the configured name you used in your repository's `config.js` `containerName` variable.

### Commands

 - `gulp scripts` or `gulp` (default task)


Flags | Description
--|--
N/A | &nbsp;

### Example: Build your container to a new test

Imagine you've just created a new experiment (Wave ID: `w2`) and you want to build it into your Mojito container. Running `gulp scripts` will build the container and provide a summary of the experiments inside it.

```shell
$ gulp scripts
[15:16:04] Using gulpfile ~/Documents/mojito-js-delivery/gulpfile.js
[15:16:04] Starting 'scripts'...
[15:16:05] Finished 'scripts' after 699 ms
Mojito container built with 2 tests (4.78 KB):
  Live (1) - aa1
  Staging (1) - w2
  Inactive (1)
```

In the output above, you can see `w2` has been included in your Mojito container with state set to `staging`.


## gulp set

Sets the `state` of an experiment and/or can `divert` an experiment's traffic to a particular `recipe`.

### Commands

 - `gulp set --live [waveid]`
 - `gulp set --staging [waveid]`
 - `gulp set --inactive [waveid]`
 - `gulp set --divert [waveid] --recipe [recipeid]`

Flags | Description
--|--
--live [waveid (required)] | Change a given `wave ID`'s state to `live`, so new users can be assigned into the test. Live tests will be built into the container.
--staging [waveid (required)] | Change a given `wave ID`'s state to `staging`, so new users won't be assigned into the test. Staging tests will be built into the container.
--inactive [waveid (required)] | Change a given `wave ID`'s state to `inactive`. The experiment will not be built into the container, placing it in an archived state.
--divert [waveid (required)] --recipe [recipeid (required)] | Set the `divertTo` flag of a particular `wave ID`, so all users will be diverted into the specified test's `recipe ID`. This does not affect the `state` of an experiment.

### Example: Sending a test live

You've completed code review/QA on your experiment (Wave ID: `aa1`) and now you want to send it live so users will be bucketed into the test. 

To set your `aa1` experiment to state `live` issue the command:

```shell
$ gulp set --live aa1
[15:15:34] Using gulpfile ~/Documents/mojito-js-delivery/gulpfile.js
[15:15:34] Starting 'set'...
[15:15:34] Finished 'set' after 11 ms
Test aa1 has been changed to live successfully.
```

Then, when you next run `gulp scripts`, and build your container, your `aa1` test will readily bucket users into the test.

### Example: Divert all traffic to a particular recipe

You just finished running your experiment (Wave ID: `w1`) and the Treatment group (Recipe ID: `1`) lifted conversion rates massively. Now the business is busy productionising the experiment and hardcoding it into your app. However your business wants to take advantage of the higher conversion rate of the treatment whilst it gets developed into the monolithic web app. 

Set the test to force eligible users into the Treatment group, bypassing the usual assignment: 

```shell
$ gulp set --divert w1 --recipe 1
[15:14:02] Using gulpfile ~/Documents/mojito-js-delivery/gulpfile.js
[15:14:02] Starting 'set'...
[15:14:02] Finished 'set' after 11 ms
Test w1 has been diverted to 1 (Treatment) successfully.
```

Note that the test needs to be `live` before you can divert traffic into it.

### Example: Stop and archive a test

Your experiment (Wave ID: `w1`) has served it's purpose well and it's now time to switch off. 

Simply set it to `inactive`, like so: 

```shell
$ gulp set --inactive w1
[15:15:57] Using gulpfile ~/Documents/mojito-js-delivery/gulpfile.js
[15:15:57] Starting 'set'...
[15:15:57] Finished 'set' after 11 ms
Test w1 has been changed to inactive successfully.
```

And when you next run `gulp scripts`, your `w1` test object will no longer show up in your container, freeing up space inside your container.


## gulp new

Creates the scaffolding for a new `wave`, `demo` or `aa` test. Generates all the required files such as `lib/waves/{{waveid}}/config.yml`, `lib/waves/{{waveid}}/trigger.js`, `lib/waves/{{waveid}}/1.js` and `lib/waves/{{waveid}}/1.css` depending on the type of experiment.

### Commands

 - `gulp new --aa [waveid]`
 - `gulp new --demo [waveid]`
 - `gulp new --wave [waveid]` 


Flags | Description
--|--
--aa [waveid (required)] | Scaffolds files for new A/A test for a given `waveid`, so you can check your instrumentation.
--demo [waveid (required)] | Scaffolds a new demo test with a given `waveid`, just so we can show you how Mojito tests work.
--wave [waveid (required)] | Scaffolds a standard test config file with a given `waveid`, so you can speed up your test development by using safe defaults.


### Example: Running an A/A test

You're a new Mojito user and you want to check you have proper random assignment by running an A/A test.

Call `gulp new` with the `--aa` flag and an appropriate `waveid`:

```shell
$ gulp new --aa aa1
[15:13:07] Using gulpfile ~/Documents/mojito-js-delivery/gulpfile.js
[15:13:07] Starting 'new'...
[15:13:07] Finished 'new' after 7.3 ms
Test aa1 has been created successfully.
```

To launch this, you can then just run:

```shell
gulp set --live aa1
gulp scripts && gulp publish
```

Easy, right?


## gulp publish

Publishes the built containers inside `dist/*.js` to the Amazon S3 paths configured under your repository's `config.js` folder. Defaults to publishing into your staging environment.

### Commands

 - `gulp publish`
 - `gulp publish --production`

Flags | Description
--|--
--production (optional) | Publish the `dist/*.js` files into your production S3 path, rather than your staging S3 path.
--awsk (optional) | Your AWS access key ID for the bucket. Defaults to your AWS credentials in your current environment. We recommend [using environment variables or AWS credentials files](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).
--awss (optional) | Your AWS secret access key for the bucket. Defaults to your AWS credentials in your current environment.  We recommend [using environment variables or AWS credentials files](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).


### Example: Publishing a test to your staging container

You're building an experiment and you want to check it's working properly in your staging container before you roll it out to production.

Assuming you've built your container with `gulp scripts`, you can go ahead and use `gulp publish` to upload it to S3:

```shell
$ gulp publish
[16:26:08] Using gulpfile ~/Documents/mojito-js-delivery/gulpfile.js
[16:26:08] Starting 'publish'...
[16:26:16] [update] mojito.js
[16:26:23] [update] mojito.pretty.js
[16:26:23] Finished 'publish' after 14 s
```

Once published, it will be immediately available from your S3 container's URL.
