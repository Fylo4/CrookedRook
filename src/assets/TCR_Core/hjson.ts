var Hjson = require('hjson');

export function downloadHjson(data: any, name: string = "download.hjson") {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(Hjson.stringify(data, undefined, 2));
    let newA = document.createElement("a");
    newA.setAttribute("href", dataStr);
    newA.setAttribute("download", name);
    newA.click();
    document.removeChild(newA);
}