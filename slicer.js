var fs = require('fs');
var path = require('path');
var cli = require('commander');
var ffmpeg = require('fluent-ffmpeg');

function safeMkdirSync(dir) {
    try { fs.accessSync(dir) }
    catch (e) { fs.mkdirSync(dir) }
}

function saveSlice(file, start, length, outDir) {
    var extension = path.extname(file);
    var end = start + length;
    ffmpeg(file).seekInput(start).duration(length)
        .save(path.join(outDir, `${start}_to_${end}${extension}`));
}

function slice(file, duration) {
    var extension = path.extname(file);
    var outputDir = path.basename(file).replace(extension, '') + ' slices';
    safeMkdirSync(outputDir);
    ffmpeg.ffprobe(file, (err, data) => {
        var vidLength = data.streams[0].duration;
        var sliceCount = Math.floor(vidLength / duration);
        console.log(`slicing ${path.basename(file)} into ${sliceCount} slices`);
        for (var i=0; i < sliceCount; i++) {
            saveSlice(file, i * duration, duration, outputDir);
        }
    });
}

// cli tool mode - otherwise, it's being used as a module
if (!module.parent) {
    cli.option('-d, --duration [seconds]', 'length of video slices in seconds')
        .option('-i, --input [file]', 'video input file')
        .parse(process.argv);

    slice(cli.input, parseInt(cli.duration));
}

exports.slice = slice;
exports.saveSlice = saveSlice;
