# Obsidian Templater Table of Contents Script

This is a script that was taken from the following github discussion: [Table of Contents (Headers) · SilentVoid13/Templater · Discussion #888 · GitHub](https://github.com/SilentVoid13/Templater/discussions/888#discussioncomment-7204381)

When set up, you can put this template into your note and it will automatically create a table of contents at the top of your note from the various headings that are in said note.

This script, as the name might imply, requires the Templater Obsidian Plugin, which you can get from here: [GitHub - SilentVoid13/Templater: A template plugin for obsidian](https://github.com/SilentVoid13/Templater)

This script must be set up in the following manner in order to work with Templater:

```markdown
<%*
contents of table-of-contents.js
%>
```

After that you can set a keybind to insert this template into your note, or just insert it manually, and the script will do it's magic.


## Original Description From Script:

FURTHER UPDATES TO PREVIOUS DANTEALI VERSIONS
Templater discussion: https://github.com/SilentVoid13/Templater/discussions/888
After my V2 update (https://github.com/SilentVoid13/Templater/discussions/888#discussioncomment-5523668) cr0Kz merged the two scripts and heavily refactored the code. 
Cr0Kz latest version (as of 20231005): https://github.com/SilentVoid13/Templater/discussions/888#discussioncomment-7024450
This version: https://github.com/SilentVoid13/Templater/discussions/888#discussioncomment-7204381

Additional changes in this version:
 - Added additional code commenting - for my own understanding later when I inevitably come back and forget it all 😉.
   Not as clean and concise as cr0Kz any longer - sorry!
 - Added empty line at top of TOC, otherwise there was no separation between file content and TOC callout.
 - Added debugging (enabled/disabled by constant/switch at top of file) which cr0Kz had in his first version but removed in latest.
   Added additional debug messages to help me with development. Debug console accessible with Ctrl+Shift+I.
 - If a TOC already exists it will always be updated in the current location. If no existing TOC, default location is top of file (below
   any frontmatter). 
   Added switches to allow default location to be changed to: below the first header, or at cursor position.
 - Added switch (at top of file) to change from default Markdown-style links used in TOC to Wiki-style links.
 - Added switch to disable header level depth prompt and const to define default depth. If you know what level you will always want then easy to disable prompt.


