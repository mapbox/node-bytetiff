var bytetiff = require('../index.js');

var chunk = [];
for (var i = 0; i < 1e6; i++) chunk.push(Math.floor(Math.random() * 65535));

console.time('to8bit');
for (var i = 0; i < 10; i++) {
    bytetiff.to8bit(chunk, function(){});
}
console.timeEnd('to8bit');
