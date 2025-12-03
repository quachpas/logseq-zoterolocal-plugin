# Logseq Zotero Plugin

![Logseq](https://img.shields.io/badge/Logseq-Plugin-blue?style=flat-square)
![License](https://img.shields.io/github/license/benjypng/logseq-zoterolocal-plugin?style=flat-square)

Connect locally to Zotero 7 (and above) and pull your items into Logseq without needing to sync with Zotero Cloud.

![](/screenshots/demo.gif)

## Features

- **Direct Connection:** Connect to Zotero 7+ without needing to sync with Zotero Cloud.
- **Customizable Templates:** Full control over how your items are imported.
- **Easy Insertion:** Quickly search and insert Zotero items into your graph.
- **Graph Tracking:** Track which items are already in your graph.
- **Fuzzy Search:** Easily find the articles you want to insert.
- **DB Version Support:** Support for Logseq DB version properties.

## Usage

### 1. Create a Zotero template
1.  Go to any page that will hold your Zotero template.
2.  Type `/Insert Zotero template`.
3.  A sample template will be generated (example below). Customize as needed.
    > **Note:** The `<% notes %>` placeholder should not be in the page properties as the content can be very long.
4.  If you change the template name, update it in the plugin settings under "Template Name (MD version)".

```
  accessDate:: <% accessDate %>
  attachments:: <% attachments %>
  citeKey:: <% citeKey %>
  collections:: <% collections %>
  authors:: <% creators %>
  date:: <% date %>
  dateAdded:: <% dateAdded %>
  dateModified:: <% dateModified %>
  DOI:: <% DOI %>
  ISBN:: <% ISBN %>
  ISSN:: <% ISSN %>
  issue:: <% issue %>
  itemTitle:: <% title %>
  itemType:: <% itemType %>
  journalAbbreviation:: <% journalAbbreviation %>
  key:: <% key %>
  language:: <% language %>
  libraryCatalog:: <% libraryCatalog %>
  libraryLink:: <% libraryLink %>
  pages:: <% pages %>
  parentItem:: <% parentItem %>
  publicationTitle:: <% publicationTitle %>
  relations:: <% relations %>
  shortTitle:: <% shortTitle %>
  tags:: <% tags %>
  url:: <% url %>
  version:: <% version %>
  volume:: <% volume %>
```

### 2. Insert Zotero item
1.  Navigate to the page where you want to insert a Zotero item.
2.  Type `/Zotero: Insert full item`.
3.  Perform your search.
4.  Click the desired item.
5.  A new page will be created, and a reference to it will be inserted at your cursor position.

### 3. Insert citation
1.  Ensure that your citation key template is set up in your plugin settings.
2.  Navigate to the page where you want to insert a citation.
3.  Type `/Zotero: Cite (insert citation)`.
4.  Perform your search.
5.  Click the desired item.
6.  The citation will be added to your cursor position.

## Installation

### From Marketplace

1.  Open Logseq.
2.  Go to **Settings** > **Plugins** > **Marketplace**.
3.  Search for `logseq-zoterolocal-plugin`.
4.  Click **Install**.

### Manual Installation

1.  Download the latest release zip file from the [Releases](https://github.com/benjypng/logseq-zoterolocal-plugin/releases) page.
2.  Unzip the file.
3.  Open Logseq and go to **Settings** > **Advanced**.
4.  Enable **Developer mode**.
5.  Go to **Settings** > **Plugins**.
6.  Click **Load unpacked plugin**.
7.  Select the folder where you unzipped the plugin.

## Setup

1.  Close Logseq.
2.  Ensure Zotero 7 is running, and then:
    -   In settings, under `Advanced`, check `Allow other applications on this computer to communicate with Zotero`.
    -   (Optional, if you want citation keys) Install [Better Bibtex](https://github.com/retorquere/zotero-better-bibtex/releases).
    -   In the Better Bibtex section of your Zotero settings, ensure that `Automatically pin citation key after X seconds` is set to `1`.
    -   **Note:** Citation keys need to be **both** set up and pinned in Zotero 7 in order to use citation keys in Logseq. If you have issues setting this up, please seek help at the Zotero or Better Bibtex forums.
    -   Restart Zotero.
3.  Open Logseq, and then plugin settings.
4.  Verify that "Connection to Zotero is working" is checked.
5.  Complete the rest of the plugin settings.

![Plugin Settings](/screenshots/plugin-settings.png)

## Configuration

Go to Logseq Settings > Plugin Settings > logseq-zoterolocal-plugin to configure:

-   **Page Name Template:** Specify the page name for each Zotero import. Available placeholders: `<% citeKey %>`, `<% title %>`.
-   **Template for Cite Key:** Specify the template when using the command `/Zotero: Cite (insert citation)`. Ensure that `<% citeKey %>` placeholder is indicated.
-   **Zotero Tag Name:** Specify the tag name used for Zotero imports (Default: `Zotero`).
-   **Page Properties (DB version):** Indicate the properties to include for each Zotero item (only visible/applicable if you are using the Logseq DB version).
-   **Template Name (MD version):** The template name that holds your template for a Zotero page.
-   **Author Template (MD version):** Specify how authors should be shown in the properties. Available placeholders: `<% firstName %>`, `<% lastName %>`, `<% creatorType %>`.

## Development

If you want to contribute or modify the plugin, follow these steps:

### Prerequisites

-   [Node.js](https://nodejs.org/)
-   [npm](https://www.npmjs.com/)

### Setup

1.  Clone the repository:
    ```bash
    git clone https://github.com/benjypng/logseq-zoterolocal-plugin.git
    cd logseq-zoterolocal-plugin
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Building

To build the project for production:

```bash
npm run build
```

This will generate the distribution files in the `dist` directory.

### Running in Development Mode

To run the plugin in development mode with hot reloading (via Vite):

```bash
npm run dev
```

1.  Run the command above.
2.  Open Logseq.
3.  Load the plugin manually (point to the project root directory).

## Support

If you find this plugin useful, consider supporting the developer:

-   [:gift_heart: Sponsor this project on Github](https://github.com/sponsors/benjypng)
-   [:coffee: Buy me a coffee](https://www.buymeacoffee.com/hkgnp.dev)

## Issues and Contributions

For bug reports, feature requests, or contributions, please visit the [GitHub repository](https://github.com/benjypng/logseq-zoterolocal-plugin).

*Note: This repository is currently not taking in any pull requests.*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
