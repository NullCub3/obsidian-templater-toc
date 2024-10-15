const config = {
  // =============
  // FUNCTIONALITY
  // =============

  // DEBUG MESSAGES
  // Write useful debugging messages to console (Ctrl+Shiift+i)
  debug: false,

  // TOC LOCATION
  // If a TOC already exists it will be updated in the same location.
  // If no existing TOC then default location is top of file (below any frontmatter). OR...
  //   - Insert TOC below first header instead of top of file
  insertBelowHeader: true,
  //   - Insert TOC at cursor position instead of top of file or below first header (overrides insertBelowHeader=true)
  insertAtCursor: false,

  // TOC LINKS STYLE
  // Use Wiki-style syntax for TOC links instead of Markdown-style links
  useWikilinks: true,

  // DISABLE LEVEL PROMPT
  // Disable prompt for user to select level depth to use in TOC
  levelDepthPromptDisable: true,
  // Set default level depth too (1-6).
  levelDepthDefault: 6,

  // MINIMUM HEADER
  // The minimum header number the table of contents will start after
  // e.g header_begin: 2 means H2 and H1 headers won't be included in the TOC
  header_begin: 1,

  // CALLOUT OR HEADER
  // Set to true to use a standard list with a header style instead of the regular callout style.
  use_header: true,

  // HEADER STYLE
  // Set to desired header name/style (when using headers)
  headerTOCstart: "## Table of Contents",

  // CALLOUT STYLE
  // Set to desired callout name/style (when using callouts)
  calloutTOCstart: `> [!SUMMARY]+ Table of Contents`,

  // TOC END STRING
  // Set to desired string to mark the end of the TOC section.
  markerTOCend: '%%ENDTOC%%'
}

function default_config() {
  return config;
}

module.exports = default_config;
