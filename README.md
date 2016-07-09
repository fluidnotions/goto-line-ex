## Go to Line Ex

A visual source code plugin for navigate from current line or from line containing keyword.

#Settings
A keyword to find to calculate starting postition, there are 2 possibilities:
- `goto-line-ex.keyword`: to define the same keyword for all files
- `goto-line-ex.keywordAssociations`: to define the keyword by extension ({"ext": "keyword"})

#Commands
    goto-line-ex.fromHere    // go to line (positive or negative) from current position
    goto-line-ex.fromKeyword // go to line (positive or negative) from keyword position