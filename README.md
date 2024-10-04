# 林士旋 - 家譜

This repository holds the codes to generate lineage graph for our ancestor 林士旋.

---

## Dependencies

This project is intentionally kept dependency-free and in vanilla JavaScript
to afford best maintainability for future maintainers. (All that required is D3
library version 7, which is included as a local copy)

## View the graph locally

For privacy reason, the lineage data itself is kept as a secret in an unlisted
google sheet. (Which is shared with clan members to amend and maintain)

To use this tool and view the graph locally, you need to supply this google
sheet's id to the webpage via a search string parameter.

This can be done either entering the id manually in the url as
`?id=unlisted-google-sheet-id` or first export this id as an environment variable:

```bash
export LIN_GENELOGY_DATASOURCE_ID=unlisted-google-sheet-id
```

...and launch the webpage locally by running:

```bash
npm start
```

## Folder structure

All the important assets are placed under `public` folder, which should be
used as web root for a web-server.

- `scripts` holds all JavaScripts used in the project:
- `scripts/app.js` is the main entry point of our app
- `scripts/vendors` folder holds all 3rd party JavaScripts used by our project

```
└── public
    ├── index.html
    ├── scripts
    │   ├── app.js
    │   ├── ...
    │   └── vendors
    │       └── ...
    └── styles.css
```
