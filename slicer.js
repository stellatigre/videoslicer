var path = require('path');
var cli = require('commander');
var ffmpeg = require('fluent-ffmpeg');

function saveSlice(file, start, length) {
    var end = start + length;
    ffmpeg(file).seekInput(start).duration(length)
        .save(`chunk-${start}_to_${end}.mp4`);
}

function slice(file, duration) {
    ffmpeg.ffprobe(file, (err, data) => {
        var vidLength = data.streams[0].duration;
        var sliceCount = Math.floor(vidLength / duration);
        console.log(`slicing ${path.basename(file)} into ${sliceCount} slices`);
        for (var i=0; i < sliceCount; i++) {
            saveSlice(file, i * duration, duration);
        }
    });
}

cli.option('-d, --duration [seconds]', 'length of video slices in seconds')
    .option('-i, --input [file]', 'video input file')
    .parse(process.argv);

slice(cli.input, parseInt(cli.duration));
