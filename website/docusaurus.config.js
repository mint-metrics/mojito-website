module.exports={
  "title": "Mojito",
  "tagline": "Build, launch & report on experiments via Git & CI",
  "url": "https://mojito.mx",
  "baseUrl": "/",
  "organizationName": "mojito",
  "projectName": "mojito-site",
  "scripts": [
    "https://buttons.github.io/buttons.js",
    "//d1xafqim8ep2fx.cloudfront.net/js/mintmetrics.js"
  ],
  "favicon": "img/android-icon-192x192.png",
  "customFields": {
    "repoUrl": "https://github.com/mint-metrics/mojito",
    "users": [
      {
        "caption": "Mint Metrics",
        "image": "/img/user-logos/mintmetrics.png",
        "infoLink": "https://mintmetrics.io/",
        "pinned": true
      }
    ]
  },
  "onBrokenLinks": "log",
  "onBrokenMarkdownLinks": "log",
  "presets": [
    [
      "@docusaurus/preset-classic",
      {
        "docs": {
          "homePageId": "home",
          "showLastUpdateAuthor": true,
          "showLastUpdateTime": true,
          "editUrl": "https://github.com/mint-metrics/mojito-website/edit/master/docs/",
          "path": "./docs",
          "sidebarPath": "./sidebars.json"
        },
        "blog": {
          "path": "blog"
        },
        "theme": {
          "customCss": "../src/css/customTheme.css"
        }
      }
    ]
  ],
  "plugins": [],
  "themeConfig": {
    "navbar": {
      "title": "Mojito",
      "logo": {
        "src": "img/dark.svg"
      },
      "items": [
        {
          "to": "docs/",
          "label": "Get started",
          "position": "left"
        },
        {
          "to": "docs/example-home",
          "label": "Examples",
          "position": "left"
        },
        {
          "to": "docs/api-intro",
          "label": "API reference",
          "position": "left"
        },
        {
          "href": "https://www.github.com/mint-metrics/mojito",
          "label": "Github",
          "position": "left"
        }
      ]
    },
    "footer": {
      "links": [
        {
          "title": "Community",
          "items": [
            {
              "label": "Twitter",
              "to": "https://twitter.com/mintmetrics_io"
            }
          ]
        }
      ],
      "copyright": "Copyright © 2021 Mint Metrics Pty Ltd",
      "logo": {
        "src": "img/dark.svg"
      }
    },
    "algolia": {
      "apiKey": "fb512391b69cbe072f0ed74c938f64bc",
      "indexName": "mojito_mint_metrics",
      "algoliaOptions": {}
    }
  }
}