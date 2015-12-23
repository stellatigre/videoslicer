var os = require('os');
var fs = require('fs');
var path = require('path');
var async = require('async');
var cli = require('commander');
var ffmpeg = require('fluent-ffmpeg');

function safeMkdirSync(dir) {
    try { fs.accessSync(dir) }
    catch (e) { fs.mkdirSync(dir) }
}

function saveSlice(file, start, length, outDir, callback) {
    var extension = path.extname(file);
    var end = start + length;
    ffmpeg(file).seekInput(start).duration(length)
        .save(path.join(outDir, `${start}_to_${end}${extension}`))
        .on('end', ()=> {
            console.log(`saved slice ${start}_to_${end}`);
            callback();
        });
}

function slice(file, duration) {
    var extension = path.extname(file);
    var outputDir = path.basename(file).replace(extension, '') + ' slices';
    safeMkdirSync(outputDir);
    ffmpeg.ffprobe(file, (err, data) => {
        var vidLength = data.streams[0].duration;
        var sliceCount = Math.floor(vidLength / duration);
        renderSlices(file, duration, sliceCount, outputDir);
    });
}

function renderSlices(file, duration, sliceCount, outputDir) {
    console.log(`slicing ${path.basename(file)} into ${sliceCount} slices`);
    var sliceRange = Array.apply(0, Array(sliceCount)).map((_, y) => y + 1);

    // only spawn as many ffmpeg processes at a time as we have cpus
    // otherwise it will render the computer unresponsive on larger files
    async.eachLimit(sliceRange, os.cpus().length, (i, cb) => {
        saveSlice(file, i * duration, duration, outputDir, cb);
    }, () => {
        console.log("done!");
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
