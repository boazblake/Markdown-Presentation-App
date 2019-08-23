import Stream from "mithril-stream"
import MarkdownIt from "markdown-it"
import highlightjs from "markdown-it-highlightjs"
import emoji from "markdown-it-emoji"
import sub from "markdown-it-sub"
import sup from "markdown-it-sup"
import ins from "markdown-it-ins"
import footnote from "markdown-it-footnote"
import deflist from "markdown-it-deflist"
import abbr from "markdown-it-abbr"
import imsize from "markdown-it-imsize"
import arrows from "markdown-it-smartarrows"

const markup = new MarkdownIt({
  html: true, // Enable HTML tags in source
  xhtmlOut: false, // Use '/' to close single tags (<br />).
  // This is only for full CommonMark compatibility.
  breaks: true, // Convert '\n' in paragraphs into <br>
  langPrefix: "lang-", // CSS language prefix for fenced blocks. Can be
  // useful for external highlighters.
  linkify: true, // Autoconvert URL-like text to links

  // Enable some language-neutral replacement + quotes beautification
  typographer: true,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Could be either a String or an Array.
  //
  // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
  // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
  quotes: "“”‘’",

  // Highlighter function. Should return escaped HTML,
  // or '' if the source string is not changed and should be escaped externally.
  // If result starts with <pre... internal wrapper is skipped.
  highlight: function(/*str, lang*/) {
    return ""
  }
})
  .use(highlightjs)
  .use(emoji)
  .use(sub)
  .use(sup)
  .use(ins)
  .use(footnote)
  .use(deflist)
  .use(abbr)
  .use(imsize, { autofill: true })
  .use(arrows)

const SlideModel = {
  title: "",
  contents: "",
  order: 0,
  presentation_id: ""
}

const Slides = []

const Presentations = []

const SlideShowStruct = {
  keys: new Set(),
  values: {},
  items: Stream([])
}

const CurrentPresentation = {
  title: "",
  id: "",
  slideShow: Stream([]),
  Slides
}

const getProfile = (w) => {
  if (w < 668) return "phone"
  if (w < 920) return "tablet"
  return "desktop"
}

const Models = {
  markup,
  profile: getProfile(window.innerWidth),
  SlideShowStruct,
  Presentations,
  CurrentPresentation,
  SlideModel,
  toggleModal: false
}

export default Models
