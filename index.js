#!/usr/bin/env node

const express = require("express"),
      expressLayouts = require('express-ejs-layouts'),
      app = express(),
      { readdirSync, readFileSync,realpathSync } = require('fs'),
      S = require('string'),
      asciidoctor = require('asciidoctor')(),
      path = require("path")
;

const base = path.dirname(realpathSync(__filename))
app.set('views', path.join(base, 'views'));
app.set('view engine', 'ejs')
app.use(expressLayouts)

app.get("/", (req,res) => {
    const list = readdirSync(".", { withFileTypes: true })
        .filter ( file => S(file.name).endsWith(".adoc") )
        .map(file => file.name)
    
    res.render("_list.ejs",{list})
})

app.get("/:fileName", (req,res) => {
    const fileName = req.params["fileName"]
    const content = asciidoctor.convert(readFileSync(fileName))
    
    res.render("_content.ejs", {content})
})

app.listen(3000, () => {
    console.log("Started")
})
