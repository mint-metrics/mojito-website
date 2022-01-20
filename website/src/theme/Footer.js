import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const Footer = () =>
{
  const { siteConfig } = useDocusaurusContext();
  const {baseUrl} = siteConfig;
  const docsUrl = 'docs';
  const docUrl = (doc, language) =>
  {
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  };

  return (
    <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={baseUrl} className="nav-home">
            <img
                src='/img/dark.svg'
                alt={siteConfig.title}
                width="66"
                height="58"
              />
          </a>
          <div>
            <h5>Docs</h5>
            <a href={docUrl('', siteConfig.language)}>
              Overview of Mojito
            </a>
            <a href={docUrl('js-delivery-intro', siteConfig.language)}>
              Mojito JS library
            </a>
            <a href={docUrl('snowplow-storage-intro', siteConfig.language)}>
              Mojito Storage docs
            </a>
            <a href={docUrl('r-analytics-intro', siteConfig.language)}>
              Mojito Analytics docs
            </a>
          </div>
          <div>
            <h5>More</h5>
            <a href={`${baseUrl}blog`}>Blog</a>
            <a href="https://mintmetrics.io/">Mint Metrics</a>
            <a href="https://github.com/mint-metrics/mojito">GitHub</a>
            <a href="https://twitter.com/mintmetrics_io">Twitter</a>
          </div>
        </section>
        <section className="copyright">Copyright © 2022 Mint Metrics Pty Ltd</section>
      </footer>
  );
};

export default Footer;