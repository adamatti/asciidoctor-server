#!/usr/bin/env node

const express = require("express"),
      expressLayouts = require('express-ejs-layouts'),
      app = express(),
      { readdirSync, readFileSync,realpathSync,existsSync } = require('fs'),
      S = require('string'),
      asciidoctor = require('asciidoctor')(),
      path = require("path"),
      PORT = process.env.PORT || 3000
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
    
    if (!existsSync(fileName)){
        console.log(`File not found [file: ${fileName}]`)
        res.status(404).send("File not found").end()
        return
    }

    const content = asciidoctor.convert(readFileSync(fileName))
    res.render("_content.ejs", {content})
})

app.listen(PORT, () => {
    console.log(`Started [port: ${PORT}]`)
})
