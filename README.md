# videoslicer
slice videos in node.js (version `5.x`+) using ffmpeg

#### arguments
supports two command line arguments right now:

`-i, --input` , the source file path

`-d, --duration` , the length in seconds of the video slices

#### installation
just do a `npm install` (on node 5.x) after you clone this repo, then use as shown in examples

#### examples
slice this input file into 5 second chunks

`node .\slicer.js -d 5 -i 'C:\Users\Stella\Videos\Captures\sweetanime.mp4'`

-------------------------------

Written & tested originally on my Windows machine, but should work on any of Win / OSX / Linux that has FFMPEG installed properly.

please see https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#prerequisites for guidance on making sure ffmpeg is setup properly for your platform.  
