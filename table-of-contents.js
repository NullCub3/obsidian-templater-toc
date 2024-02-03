// =====================================================================================================================================================================
// FUNCTIONALITY
// =============
//
// DEBUG MESSAGES
// Write useful debugging messages to console (Ctrl+Shiift+i)
const deBug = 0;
//
// TOC LOCATION
// If a TOC already exists it will be updated in the same location.
// If no existing TOC then default location is top of file (below any frontmatter). OR...
//   - Insert TOC below first header instead of top of file
const insertBelowHeader = 1;
//   - Insert TOC at cursor position instead of top of file or below first header (overrides insertBelowHeader=1)
const insertAtCursor = 0;
//
// TOC LINKS STYLE
// Swap to using Wiki-style syntax for TOC links. By default links in TOC use the Markdown syntax.
const useWikilinks = 1;
//
// DISABLE LEVEL PROMPT
// Disable prompt for user to select level depth to use in TOC.
// Set default level depth too (1-6).
const levelDepthPromptDisable = 1;
const levelDepthDefault = "6";
//
// CALLOUT OR HEADER
// Set to 1 to use a standard list with a header style instead of the regular callout style.
const use_header = 1;
//
// MINIMUM HEADER
// The minimum level the table of contents will start at.
const header_begin = 1;
// =====================================================================================================================================================================

// Utility function for debugging
const debugLog = (label, data) => {
  if (typeof deBug !== 'undefined' && deBug === 1) console.log(`${label} \n\n`, data);
};

// Otherwise place in default location at top of file (below frontmatter) or below first header.
let curPosition = this.app.workspace.activeLeaf.view.editor.getCursor().line;
debugLog("Cursor position", curPosition);

const headerTOCstart = `## Table of Contents`;
const calloutTOCstart = `>[!SUMMARY]+ Table of Contents`

// Constants for TOC markers
if (use_header == 1) {
  var markerTOCstart = headerTOCstart;
} else {
  var markerTOCstart = calloutTOCstart;
}
const markerTOCend = '%%ENDTOC%%';

// Get the active file info and its metadata
const activeFile = await this.app.workspace.getActiveFile();
const mdCache = await this.app.metadataCache.getFileCache(activeFile);

// Show file info
debugLog("File Info - activeFile:", activeFile);
//debugLog("File Info - tp.config.active_file", tp.config.active_file); // Matches 'activeFile' above
//debugLog("File Info - app.workspace.activeLeaf.view.file", app.workspace.activeLeaf.view.file); // Matches 'activeFile' above
debugLog("File Info - tp.file.find_tfile", tp.file.find_tfile(tp.file.title)); // Matches 'activeFile' above
debugLog("File Cache - mdCache:", mdCache); // Metadata
debugLog("Filename - tp.config.active_file.name", tp.config.active_file.name); // Filename

// Get the current file content and split it into lines
const fileContent = await tp.file.content;
const fileContentSplit = fileContent.split('\n');

// Check if the file starts with a YAML frontmatter block
// hasYAML is a bool matching evaluation of the two conditionals i.e. will be true if
// (the first line in file = '---') AND (if the next occurrence of '---' is on line > 0, start looking from line 1)
let hasYAML = fileContentSplit[0] === '---' && fileContentSplit.indexOf('---', 1) > 0;
// yamlEndLine equals the left hand side of ':' expression if hasYAML is true, and right hand side if hasYAML is false.
// if hasYAML is true then yamlEndLine = first occurrence of '---' in array holding file lines start looking at index 1
// if hasYAML is false then yamlEndLine = -1
let yamlEndLine = hasYAML ? fileContentSplit.indexOf('---', 1) : -1;
debugLog("First line in file", fileContentSplit[0]); // First line in file
debugLog("First line = '---' in file line array", fileContentSplit.indexOf('---')); // Find first occurrence of '---' in array holding file lines
debugLog("First line = '---' in file line array, start line 2", fileContentSplit.indexOf('---', 1)); // Find first occurrence of '---' in array holding file lines start looking at index 1
debugLog("hasYAML", hasYAML);
debugLog("yamlEndLine", yamlEndLine);

// Find existing TOC start and end positions
let TOCstart = fileContentSplit.indexOf(markerTOCstart);
let TOCend = fileContentSplit.indexOf(markerTOCend, TOCstart); // Start looking for occurrence after the array element holding start marker.
debugLog("TOCstart", TOCstart);
debugLog("TOCend", TOCend);

// Remove existing TOC if it exists
// Removes the TOC section from array of file lines
// array.splice(X,Y) removes Y elements starting at position X.
if (TOCstart !== -1 && TOCend !== -1) {
  //fileContentSplit.splice(TOCstart, TOCend - TOCstart + 1);
  // Updated to also remove empty line at start/end of TOC which we added
  fileContentSplit.splice(TOCstart - 1, TOCend - TOCstart + 2);
}

// Initialize an empty array to hold new TOC lines
let newTOC = [];

// Get header limit from user
let header_limit = levelDepthDefault;
if (levelDepthPromptDisable == 0) header_limit = await tp.system.prompt("Show Contents Down to Which Header Level (1-6)?", levelDepthDefault);

const mdCacheListItems = mdCache.headings;
debugLog("Headers", mdCacheListItems);

if (use_header == 1) {
  var lineBegin = ``;
  newTOC.push(``);
  debugLog("Used Header", lineBegin);
} else {
  var lineBegin = `> `;
  debugLog("Didn't Use Header", lineBegin);
}

// Parse headings and create new TOC
if (mdCacheListItems && mdCacheListItems.length > 0) {
  // Generate new TOC
  mdCacheListItems.forEach(item => {
    var header_url = item.heading.replace(/\[\[|\]\]/g, '');
    var header_url = header_url.replace(/\|/g, ' ');
    var header_text = item.heading.replace(/\[\[[^\|]*\||\[\[|\]\]/g, '');
    var header_level = item.level;
    var indent_num = header_level - header_begin - 1
    debugLog("Indent Number", indent_num);

    if (header_text == `Table of Contents`) {
    } else if (header_level <= header_begin) {
    } else if (header_level <= header_limit) {
      if (useWikilinks == 1) {
        // Wiki-style
        let file_title = tp.file.title;
        //let header_url = header_text;         
        let header_link = `[[${file_title}#${header_url}|${header_text}]]`
        newTOC.push(`${lineBegin}${'    '.repeat(indent_num) + '- ' + header_link}`);
      } else {
        // Markdown-style 
        let file_title = tp.file.title.replace(/ /g, '%20');    // Replace spaces with '%20'
        let header_url = header_text.replace(/:/g, '').replace(/ /g, '%20');    // Remove ':', Replace spaces in urls with '%20'
        let header_link = `[${header_text}](${file_title}.md#${header_url})`;
        newTOC.push(`${lineBegin}${'    '.repeat(indent_num) + '- ' + header_link}`);
      }
    }
  });
}

// Determine where to insert the new TOC
// Order of definitions below ensures that TOC is placed in priority order of:
//   - Directly below frontmatter, or top of file if no frontmatter
//   - Directly below first header
//   - At cursor position if no existing TOC (if feature enabled at top of file)
//   - ALWAYS update existing TOC location if it exists
// Insert below frontmatter or top of file.
let insertPosition = hasYAML ? yamlEndLine + 2 : 0;    // Use +1 if not adding additional empty line to TOC before start marker
debugLog("insertPosition - frontmatter", insertPosition);
// Insert below first header
if (insertBelowHeader == 1) {
  let firstHeaderFind = '#'.repeat(mdCacheListItems[0].level) + ' ' + mdCacheListItems[0].heading;
  debugLog("First Header String", firstHeaderFind);
  insertPosition = fileContentSplit.indexOf(firstHeaderFind) + 2;  // Use +1 if not adding additional empty line to TOC before start marker
  debugLog("insertPosition - header", insertPosition);
}
// Insert at cursor position if feature enabled
if (insertAtCursor == 1) insertPosition = curPosition;
debugLog("insertPosition - cursor", insertPosition);
// Insert at existing TOC location
if (TOCstart !== -1) insertPosition = TOCstart;
debugLog("insertPosition - existing", insertPosition);

// Add or remove TOC based on newTOC's content
// Note the '...newTOC' used to insert TOC. This is called the 'spread operator' and expands
//    the item to individual values.
if (newTOC.length > 0) {
  // Insert the new TOC into the file content
  //fileContentSplit.splice(insertPosition, 0, markerTOCstart, ...newTOC, "", markerTOCend);
  // Updated with an empty line before start marker, we need to adjust insert location to compensate
  fileContentSplit.splice(insertPosition - 1, 0, "", markerTOCstart, ...newTOC, "", markerTOCend);
} else if (TOCstart !== -1 && TOCend !== -1) {
  // Remove the markers when there are no headers
  fileContentSplit.splice(TOCstart, TOCend - TOCstart + 1);
}

debugLog("TOC:", newTOC);
// Update the file with the new content
await app.vault.modify(activeFile, fileContentSplit.join('\n'));
