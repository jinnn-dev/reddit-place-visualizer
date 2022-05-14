var PATH = "N:\\2022_place_canvas_history_converted.csv"

var fs = require('fs');

// open file
fs.open(PATH, 'r', function(err, fd) {
    if (err) {
        console.error(err);
        return;
    }
    // read 5 bytes from file
    fs.read(fd, Buffer.alloc(5), 0, 5, null, function(err, bytesRead, buffer) {
        
        // Get first two bytes
        var x = buffer.readUIntLE(0,2);
        var y = buffer.readUIntLE(2,2);
        var color = buffer.readUintLE(4,1);
        console.log(x,y,color);

    });
});

