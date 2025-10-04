const fs = require("node:fs")

const rows = fs
    .readFileSync("./input/core_6000.tsv", 'utf8')
    .split("\n")
    .map(line => line.split('\t'))
    .map((line, index) => `<tr id="${index - 1}">${line.map(item => `<td>${item}</td>`).join('')}</tr>`)
    .join("\n")


const template = `
<!DOCTYPE html>
<html lang="en">

<head>
    <link rel="stylesheet" href="index.css">
</head>

<body>
    <table>
        ${rows}
    </table>    
</body>
</html>
`


fs.writeFileSync("index.html", template, 'utf8')