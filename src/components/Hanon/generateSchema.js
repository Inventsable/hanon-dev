#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

async function init() {
  const root = `${path.resolve("./")}/assets/layouts/`;
  let layouts = await readDir(root);
  let valids = layouts.filter(entry => {
    return /\.svg$/.test(entry)
  })
  let blueprint = require('./blueprint');
  blueprint.forEach(keyboard => {
    let name = exists(`${root}${keyboard.count}-${keyboard.startsWith.toUpperCase()}.svg`)
      ? `${keyboard.count}-${keyboard.startsWith.toUpperCase()}.svg`
      : `${keyboard.count}.svg`
    let data = getDataFromSVG(`${root}${name}`)
    keyboard['keys'] = data.keys;
    keyboard['viewBox'] = data.viewBox;
  })
  fs.writeFileSync(`${path.resolve("./")}/schema.json`, JSON.stringify(blueprint))
  console.log('Done!')
  return null;
}

init();

function getDataFromSVG(thispath) {
  let file = readFile(thispath),
    keys = [];
  let viewBox = file.match(/viewBox\=\"([^\"]*)\"/)[1],
    points = file.match(/[^i]d\=\"([^\"]*)\"/gm),
    classes = file.match(/class\=\"([^\"]*)\"/gm)
  classes = classes.map(cl => {
    return `hanon-${/\-1/.test(cl.replace(/^class\=\"/, "").replace(/\"$/, "")) ? 'white' : 'black'}`
  })
  points = points.map(cl => {
    return cl.replace(/^\s*d\=\"/, "").replace(/\"$/, "");
  })
  classes.forEach((item, i) => {
    keys.push({
      points: points[i],
      class: classes[i]
    })
  })
  return {
    length: classes.length,
    viewBox: viewBox,
    keys: keys
  }
}

function readFile(thispath) {
  return fs.readFileSync(path.resolve(thispath), "utf8");
}
function exists(thispath) {
  return fs.existsSync(thispath);
}
async function readDir(thispath) {
  return new Promise((resolve, reject) => {
    fs.readdir(
      path.resolve(thispath),
      { encoding: "utf-8" },
      (err, files) => {
        if (err) reject(err);
        resolve(files);
      }
    );
  });
}