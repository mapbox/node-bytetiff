var gdal = require('gdal');

module.exports = {};
module.exports.scale = scale;


function scale(srcpath, dstpath, callback) {
  
  var src = gdal.open(srcpath);

  var width = src.rasterSize.x;
  var height = src.rasterSize.y;
  var count = src.bands.count();
  var driver = src.driver.description;
  
  var dst = gdal.open(dstpath, mode='w', driver, x_size=width, y_size=height, band_count=count, data_type=gdal.GDT_Byte);

  // TODO: Define based on data type
  var dmin = 0;
  var dmax = 65535;

  src.bands.forEach(function(band) {
    var bidx = band.id;
  
    var data = band.pixels.read(0, 0, width, height);
    var scaled = new Uint8Array(data.length);
  
    for (var i = 0; i < width * height; i += 1) {
      var pix = ~~(255 * (data[i] - dmin ) / dmax);
      scaled[i] = pix;
    }
  
    var dstband = dst.bands.get(bidx);
    dstband.pixels.write(0, 0, width, height, scaled);
    dst.flush();
  });
  
  return callback(null);
}