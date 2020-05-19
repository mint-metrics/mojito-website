/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Project Logo" />
      </div>
    );

    const ProjectTitle = () => (
      <h2 className="projectTitle">
        <small>A professional, open split testing stack for speed &amp; security</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <Logo img_src={`${baseUrl}img/logo.png`} />
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            <Button href={docUrl('home')}>Get started</Button>
            <Button href="https://mintmetrics.io/mojito/introducing-mojito-open-source-self-hosted-experimentation-stack/">Read intro blog post</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl} = siteConfig;

    const Block = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const FeatureCallout = () => (
      <div
        className="productShowcaseSection paddingBottom"
        style={{textAlign: 'center'}}>
        <h2>Key features</h2>
      </div>
    );

    const TryOut = () => (
      <Block id="try">
        {[
          {
            content:
              'To make your landing page more attractive, use illustrations! Check out ' +
              '[**unDraw**](https://undraw.co/) which provides you with customizable illustrations which are free to use. ' +
              'The illustrations you see on this page are from unDraw.',
            image: `${baseUrl}img/undraw_code_review.svg`,
            imageAlign: 'left',
            title: 'Wonderful SVG Illustrations',
          },
        ]}
      </Block>
    );

    const Description = () => (
      <Block background="dark">
        {[
          {
            content:
              'This is another description of how this project is useful',
            image: `${baseUrl}img/undraw_note_list.svg`,
            imageAlign: 'right',
            title: 'Description',
          },
        ]}
      </Block>
    );

    const ExperimentDefinition = () => (
      <Block layout="twoColumn" background="light">
        {[
          {
            content:
              `Keep your experiment config in one place so you can perform effective code review & QA over git. Read our <a href="${baseUrl}docs/js-delivery-test-object">test object schema</a>.`,
            title: 'Define experiments in YAML & JS',
          },
          {
            image: `${baseUrl}img/experiment-definition.png`,
            imageAlign: 'right',
          },
        ]}
      </Block>
    );

    const SingleTag = () => (
      <Block layout="twoColumn" background="light">
        {[
          {
            image: `${baseUrl}img/snippet.png`,
            imageAlign: 'right',
          },
          {
            content:
              'Accelerate your test launch velocity & free your experimentation program from your monolithic web application deployments.',
            title: 'One tag for experimenting everywhere',
          },
        ]}
      </Block>
    );

    const ErrorHandling = () => (
      <Block layout="twoColumn" background="light">
        {[
          {
            content:
              'Any errors thrown from tests will fire events so you can track & handle problems before they hurt the user experience.',
            title: 'Protect your users & applications from nasty bugs',
          },
          {
            image: `${baseUrl}img/undraw_cancel.svg`,
            imageAlign: 'right',
          },
        ]}
      </Block>
    );

    const SelfHosted = () => (
      <Block layout="twoColumn" background="light">
        {[
          {
            image: `${baseUrl}img/undraw_maintenance.svg`,
            imageAlign: 'right',
          },
          {
            content:
              'Keep your application secure from 3rd party scripts & trackers. Avoid those "surprise" updates to your split testing container & stop your users\' PII data from leaking to prying eyes.',
            title: 'Host experiments from your own environment',
          },
        ]}
      </Block>
    );

    const LightFootprint = () => (
      <Block layout="twoColumn" background="light">
        {[
          {
            content:
              'Switching to Mojito from a SaaS tool can reduce page load times because it\'s an order of magnitude lighter and can be served from your own domain. * Tested 2019-05-07',
            title: 'Improve your page speed with a small ~5.5kb library',
          },
          {
            image: `${baseUrl}img/speedtest.png`,
            imageAlign: 'right',
          },
        ]}
      </Block>
    );

    const TemplateableReports = () => (
      <Block layout="twoColumn" background="light">
        {[
          {
            image: `${baseUrl}img/reports.png`,
            imageAlign: 'right',
          },
          {
            content:
              'Build custom HTML reports using all data in your data warehouse. Plus, you can keep your experiment results even if you decide to decide to change testing tools.',
            title: 'Own your data with powerful Rmarkdown reports',
          },
        ]}
      </Block>
    );

    const CompareTable = () => (
      <Block background="light">
        {[
          {
            image: `${baseUrl}img/undraw_youtube_tutorial.svg`,
            imageAlign: 'right',
          },
          {
            content:
              'Avoid test flicker with custom triggers that activate your experiment right when you need them.',
            image: `${baseUrl}img/undraw_youtube_tutorial.svg`,
            imageAlign: 'right',
            title: 'Expressive JavaScript triggers',
          },
        ]}
      </Block>
    );

    const Features = () => (
      <Block layout="fourColumn">
        {[
          {
            content: 'VS Code, Vim, Sublime, R Studio? Your team can run experiments with their favourite tools',
            image: `${baseUrl}img/undraw_version_control_9bpv.svg`,
            imageAlign: 'bottom',
            title: 'Build, test & launch experiments with git',
          },
          {
            content: 'Keep your site fast with a split testing library that\'s an order of magnitude smaller than SaaS solutions',
            image: `${baseUrl}img/undraw_code_review.svg`,
            imageAlign: 'bottom',
            title: 'Front-end library ~5.5kb gzipped & minified',
          },
          {
            content: 'Protect your users & applications from bugs with gradual ramp-up, error tracking & error handling',
            image: `${baseUrl}img/undraw_security_o890.svg`,
            imageAlign: 'bottom',
            title: 'Launch confidently with error tracking & handling',
          },
          {
            content: 'Launch experiments from your CLI or CI tools into environments you control',
            image: `${baseUrl}img/undraw_uploading_go67.svg`,
            imageAlign: 'bottom',
            title: 'Self-host experiments from your environment',
          },
        ]}
      </Block>
    );

    const Demo = () => (
      <Block background="light">
        {[
          {
            content:
              "<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/VtxnN6ngGzg' frameborder='0' allowfullscreen></iframe></div>",
          },
        ]}
      </Block>
    );

    const QuickStart = () => (
      <Block background="light">
        {[
          {
            content:
              '<h2>Quick start</h2>\
              <p>You\'ll need <a href="https://nodejs.org/en/">Node</a>, <a href="https://www.npmjs.com/get-npm">npm</a> and <a href="https://gulpjs.com/">Gulp CLI</a> installed.</p>\
              <pre style="max-width: 900px;margin-left: auto;margin-right: auto;"><code class="hljs css language-shell" style="text-align: left;">\
<span class="comment"># Download Mojito JS Delivery</span><br />\
<span class="command">git clone https://github.com/mint-metrics/mojito-js-delivery.git</span><br />\
<span class="comment">cd mojito-js-delivery</span><br />\
<span class="comment">npm install</span><br />\
<br />\
<span class="comment"># Create your first test</span><br />\
<span class="comment">gulp new --demo w1</span><br />\
<span class="comment">gulp set --live w1</span><br />\
<br />\
<span class="comment"># Build your container into dist/mojito.js</span><br />\
<span class="comment">gulp build</span>\
</code></pre>',
          },
        ]}
      </Block>
    );

    const Showcase = () => {
      if ((siteConfig.users || []).length === 0) {
        return null;
      }

      const showcase = siteConfig.users
        .filter(user => user.pinned)
        .map(user => (
          <a href={user.infoLink} key={user.infoLink}>
            <img src={user.image} alt={user.caption} title={user.caption} />
          </a>
        ));

      const pageUrl = page => baseUrl + (language ? `${language}/` : '') + page;

      return (
        <div className="productShowcaseSection paddingBottom">
          <h2>Who is using Mojito?</h2>
          <p>Mojito powers experimentation at these companies</p>
          <div className="logos">{showcase}</div>
          <div className="more-users">
            <a className="button" href={pageUrl('users.html')}>
              More {siteConfig.title} Users
            </a>
          </div>
        </div>
      );
    };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Features />
          <ExperimentDefinition />
          <SingleTag />
          <ErrorHandling />
          <SelfHosted />
          <LightFootprint />
          <TemplateableReports />
          <Demo />
          <QuickStart />
        </div>
      </div>
    );
  }
}

Index.title = 'Open source A/B split testing tool - Mojito';

module.exports = Index;
