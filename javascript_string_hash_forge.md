---
title: JavaScript String Hashing using "node-forge"
keywords: sample
summary: "JavaScript based string hashing"
permalink: javascript_string_hash.html
folder: JavaScript Forge
references: [
    # Place a list of references used to create and/or understand this example.
    {
        url: "https://github.com/digitalbazaar/forge",
        description: "node-forge"
    }
]
authors: [
    {
        name: "Tobias Hirzel",
        url: ""
    }
]
# List all reviewers that reviewed this version of the example. When the example is updated all old reviews
# must be removed from the list below and the code has to be reviewed again. The complete review process
# is documented in the main repository of CryptoExamples
current_reviews: [

]
# Indicates when this example was last updated/created. Reviews don't change this.
last_updated: "2018-09-017"
tags: [JavaScript, Node.js, node-forge hash, SHA, SHA-512]
---

## Use cases

- Verifying if a string has been changed

## node version

- 8.11.2

## JavaScript Version

- ECMAScript 6 and higher

## Installation

- [node-forge](https://github.com/digitalbazaar/forge")
- [Winston logger](https://github.com/winstonjs/winston)

## Example Code for JavaScript String Hashing using SHA-512, BASE64 and UTF-8 encoding

```js
{% include_relative src/allinone/ExampleHash.js %}
```

{% include links.html %}
