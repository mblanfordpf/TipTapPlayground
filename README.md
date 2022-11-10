# Starting point

`npm i` then `npm run dev`

**Note: for some reason I thought it would be a good idea to do this with Vue 3, but I've not really done enough work with Vue 3 to really make use of it, and there may be bugginess as a result that could have been avoided... :(**

# Background

This is a very basic, proof-of-concept example of creating an editor with the ability to add merge tags through buttons and through typing the prefix `{{` in the editor. We are using the TipTap library, with a number of extensions/plugins, plus one I have added (this is currently a lightly modified version of the Mention extension).

# Output

The editor can output content as HTML, JSON or text. If we're v-modelling the value though, that would need to be HTML as formatting within the editor is HTML-based. Or we'd need some way to convert back and forth between HTML and plain text. In its current form it is passing the data back and forth as HTML.

I'm not completely clear on how we want to store the output in the database and how this will need to be formatted to incorporate eg. paragraphs, but consideration will obviously need to be given to the need to both interpret that data for creating an SMS and for returning it to the editor for editing.

# Other notes

As mentioned, this is a hastily-constructed (using the TipTap docs), exploratory, barebones version that will require a lot of refinement and a better thought-out approach, but hopefully it can at least serve to demonstrate the suitability of TipTap for our purposes (and possibly highlight some issues for further discussion/thought). 
