# genUI
genUI: Javascript UI library focused on modularity and simplicity.

## Purpose
With most UI libraries out there, it's all or nothing: either stick to their themes, styling and everything, or make your own.

But not with genUI. genUI is focused on modularity and simplicity, but can also be customised as much as you want.

## How to use
Each genUI file aims to be completely standalone. Simply drop a link to it in your .html file and that's it. No CSS includes - all css is dynamically added on initialisation.

Typically to include the APIs in your projects, you'll typically have to do something like this:

```javascript
var contextMenuManager=new _contextMenuManager();
```

To find sample code on how to use genUI, or to explore the full range of options available to you, just take a peep in the JS file. Everything is self-contained within one file. Less hassle for you.

I'm leaving the source code unminified so the files themselves may be non-negligible for large scale distribution. There's loooots of comments in them. You may want to minify them. (I may make a script to produce minified versions en masse in the future :3

## File descriptions
These libraries fall under a few categories. (I should really sort them.)

/Javascript: Standardised functions which do cool things. Typically no or little HTML.

/Components: Larger components including significant amounts of HTML and CSS.

/External: Interfaces for / wrappers around  third party APIs like firebase.

/Third party: Not my work. Just stuff I find useful. Mostly minified.

I'll make more README.md's when I feel up to it. But yeah, take a look around or email me below vvv

## Contact
steeven.liu2@gmail.com. All comments, feedback, constructive criticism, and offerings of tea and incense are welcome.
