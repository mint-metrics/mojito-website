---
id: js-delivery-upgrading
title: Upgrade your Mojito split testing container to the latest version
sidebar_label: Upgrade Mojito
---
An open-source split testing tool has real benefits - like being able to choose which updates to install, when. No third-parties will be making unwanted modifications to your site's JS.

Here's two upgrade paths for your Mojito A/B testing repo:

## Upgrading via git (recommended)

This is our recommended upgrade path for Mojito because it allows for easy upgrades all from the command line:

1.  Navigate to your Mojito container's git repo on your local machine and checkout a new branch. It's best to merge your upgrade into its own branch, where you can properly test it, before you eventually merge it into your staging/production branches.

```shell

$ git branch upgrading-mojito 
$ git checkout upgrading-mojito

```

2.  Check your remotes to see that you haven't already set an `upstream` remote:

```shell

$ git remote -v 
origin  git@github.com:kingo55/mojito-js-delivery.git (fetch)
origin  git@github.com:kingo55/mojito-js-delivery.git (push)

```

3.  Add `git@github.com:mint-metrics/mojito-js-delivery.git` as your upstream remote:

```shell

$ git remote add upstream git@github.com:mint-metrics/mojito-js-delivery.git
$ git remote -v
origin  git@github.com:kingo55/mojito-js-delivery.git (fetch)
origin  git@github.com:kingo55/mojito-js-delivery.git (push)
upstream        git@github.com:mint-metrics/mojito-js-delivery.git (fetch)
upstream        git@github.com:mint-metrics/mojito-js-delivery.git (push)

```

4.  Fetch any updates from `upstream` to ensure you're looking at the most up to date version of Mojito.

```shell

$ git fetch upstream
From github.com:mint-metrics/mojito-js-delivery
 * [new branch]      master                  -> upstream/master

```

5.  Finally, merge the changes from `upstream/master` into your current branch.

    -   Note: If you get an error such as "fatal: refusing to merge unrelated histories" you likely need to run the merge command with unrelated histories allowed: `git merge upstream/master --allow-unrelated-histories`

```shell

$ git merge upstream/master 
Already up to date.

```

6.  You may encounter some merge conflicts, but you can handle those easily within your favourite IDE. Just be sure not to overwrite any changes to your active experiments, shared code or config files.

### Useful git resources

An understanding of git will certainly come in handy as you manage and maintain your Mojito split testing repo. Atlassian's guides to `git` are amongst the clearest I've found:

-   [Working with forks and upstream repos](https://www.atlassian.com/git/tutorials/git-forks-and-upstreams)
-   [Managing merge conflicts in git](https://www.atlassian.com/git/tutorials/using-branches/merge-conflicts)

## Upgrading manually

If you can establish the files that have changed, you can also just download the latest repo from `git@github.com:mint-metrics/mojito-js-delivery.git` and copy the files over to your own Mojito repo. Usually, you will want to make sure the following files are not modified or removed in anyway:

```text

config.js
lib/shared-code.js
lib/waves/*

```

You can still compare the changes with git but this approach is largely untested and may be more prone to user error. Whilst this approach works, we don't normally recommend it.

## Getting stuck?

Reach out to us through an [issue on Github](https://github.com/mint-metrics/mojito-js-delivery/issues/new) or via [the Mint Metrics' site](https://mintmetrics.io/contact/).
