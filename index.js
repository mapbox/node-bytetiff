var pixels = require('@mapbox/geo-pixel-stream'),
    queue = require('queue-async'),
    _ = require('underscore');

module.exports = {};
module.exports.scale = scale;

function scale(srcpath, dstpath, callback) {
  var readers = pixels.createReadStreams(srcpath),
      metadata = _(readers[0].metadata).extend({ type: 'Byte' }),
      writers = pixels.createWriteStreams(dstpath, metadata),
      q = queue(1);

  function to8bit(data, done) {
    // TODO: Define based on data type
    var i, dmin = 0, dmax = 65535,
        scaled = new Uint8Array(data.length);

    for (i = 0; i < data.length; i++) {
      scaled[i] = ~~(255 * (data[i] - dmin) / dmax + 0.5);
    }

    done(null, scaled);
  }

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
