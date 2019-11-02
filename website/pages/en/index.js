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
        {siteConfig.title}
        <small>{siteConfig.tagline}</small>
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
            <Button href={docUrl('home')}>View docs</Button>
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

    const Experiments = () => (
      <Block layout="twoColumn" background="light">
        {[
          {
            content:
              'Keep your experiment configuration readable, auditable and unobfuscated for effective code review and QA.',
            title: 'Define experiments in YAML or JS',
          },
          {
            image: `${baseUrl}img/undraw_youtube_tutorial.svg`,
            imageAlign: 'right',
          },
        ]}
      </Block>
    );

    const SingleTag = () => (
      <Block layout="twoColumn" background="light">
        {[
          {
            image: `${baseUrl}img/undraw_youtube_tutorial.svg`,
            imageAlign: 'right',
          },
          {
            content:
              'Avoid costly, time consuming deployments of your web app and use Mojito to run experiments everywhere.',
            title: 'Install one tag to run experiments everywhere',
          },
        ]}
      </Block>
    );

    const ErrorHandling = () => (
      <Block layout="twoColumn" background="light">
        {[
          {
            content:
              'Any errors occuring within the variant code fires events so you can track and handle issues to protect your users and applications.',
            title: 'Error tracking & handling to protect your mission-critical apps',
          },
          {
            image: `${baseUrl}img/undraw_youtube_tutorial.svg`,
            imageAlign: 'right',
          },
        ]}
      </Block>
    );

    const SelfHosted = () => (
      <Block layout="twoColumn" background="light">
        {[
          {
            image: `${baseUrl}img/undraw_youtube_tutorial.svg`,
            imageAlign: 'right',
          },
          {
            content:
              'Secure your web app by removing 3rd party scripts & trackers - no more "surprise" updates to your split testing container code.',
            title: 'Host experiment code from your secure environments',
          },
        ]}
      </Block>
    );

    const LightFootprint = () => (
      <Block layout="twoColumn" background="light">
        {[
          {
            content:
              'Improve page load times with a testing tool that\'s an order of magnitude lighter than competing SaaS solutions.',
            title: 'Less than 5kb for the base library',
          },
          {
            image: `${baseUrl}img/undraw_youtube_tutorial.svg`,
            imageAlign: 'right',
          },
        ]}
      </Block>
    );

    const TemplateableReports = () => (
      <Block layout="twoColumn" background="light">
        {[
          {
            image: `${baseUrl}img/undraw_youtube_tutorial.svg`,
            imageAlign: 'right',
          },
          {
            content:
              'Generate custom HTML reports from all the event data in your data warehouse. Say goodbye to data silos!',
            title: 'Templatable Rmarkdown reports that you own',
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
            content: 'VS Code, Vim, Sublime, R Studio? Let your developers build experiments using their favourite tools',
            image: `${baseUrl}img/undraw_version_control_9bpv.svg`,
            imageAlign: 'bottom',
            title: 'Build, test & launch experiments with git',
          },
          {
            content: 'An order of magnitude smaller than SaaS solutions\' libraries - keep your site fast',
            image: `${baseUrl}img/undraw_code_review.svg`,
            imageAlign: 'bottom',
            title: 'Front-end library >5kb gzipped & minified',
          },
          {
            content: 'Use gradual ramp-up & error tracking to protect your mission-critical applications from bugs',
            image: `${baseUrl}img/undraw_security_o890.svg`,
            imageAlign: 'bottom',
            title: 'Launch confidently with error tracking & handling',
          },
          {
            content: 'Launch experiments from your CLI or CI tools into your own environments',
            image: `${baseUrl}img/undraw_uploading_go67.svg`,
            imageAlign: 'bottom',
            title: 'Host experiments securely in your environments',
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
          <Experiments />
          <SingleTag />
          <ErrorHandling />
          <SelfHosted />
          <LightFootprint />
          <TemplateableReports />
          <Demo />
          <Showcase />
        </div>
      </div>
    );
  }
}

Index.title = 'Open source A/B split testing tool - Mojito';

module.exports = Index;
