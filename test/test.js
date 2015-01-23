
var fs = require('fs');
var path = require('path');
var tape = require('tape');
var bytetiff = require('../index.js');
var gdal = require('gdal');


tape('scale', function(assert) {
  
  var srcpath = path.join(__dirname, 'fixtures', '16bit.tif');
  var dstpath = path.join(__dirname, 'fixtures', 'scaled.tif');
  
  // This file was produced with gdal_translate
  var ctrlpath = path.join(__dirname, 'fixtures', '8bit.tif');
  
  bytetiff.scale(srcpath, dstpath, function(error) {
    
    ctrl = gdal.open(ctrlpath);
    dst = gdal.open(dstpath);
    
    ctrl.bands.forEach(function(band) {
      var bidx = band.id;
      
      var ctrlData = band.pixels.read(0, 0, 100, 100);
      
      var dstband = dst.bands.get(bidx);
      dstData = dstband.pixels.read(0, 0, 100, 100);
      
      for (var i = 0; i < 100 * 100; i += 1) {
        assert.equal(ctrlData[i], dstData[i]);
      }
      
    });
    
    assert.end();
  });
  
});


tape('teardown', function (test) {
  
  var dstpath = path.join(__dirname, 'fixtures', 'scaled.tif');
  fs.unlink(dstpath);
  
  test.end();
});