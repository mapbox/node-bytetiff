var pixels = require('geo-pixel-stream'),
    queue = require('queue-async'),
    _ = require('underscore');

module.exports = {};
module.exports.scale = scale;
module.exports.to8bit = to8bit;

function scale(srcpath, dstpath, callback) {
  var readers = pixels.createReadStreams(srcpath),
      metadata = _(readers[0].metadata).extend({ type: 'Byte' }),
      writers = pixels.createWriteStreams(dstpath, metadata),
      q = queue(1);

  readers.forEach(function(inputBand, i) {
    q.defer(function(next) {
      inputBand
        .pipe(pixels.createTransformStream(to8bit))
        .pipe(writers[i])
        .on('finish', next);
    });
  });

  q.await(callback);
}

// TODO: Define lookup table lazily based on data type
var lookup = new Uint8Array(65536);
for (var i = 0; i < 65535; i++) {
  lookup[i] = ~~(255 * (i - 0) / 65535 + 0.5);
}

function to8bit(data, done) {
  var scaled = new Uint8Array(data.length);

  for (var i = 0; i < data.length; i++) {
    scaled[i] = lookup[data[i]];
  }

  done(null, scaled);
}


