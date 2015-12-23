# videoslicer
slice videos in node (version `5.x`+) using ffmpeg

#### arguments
supports two command line arguments right now:

`-i, --input` , the source file path

`-d, --duration` , the length in seconds of the video slices

#### examples
slice this input file into 5 second chunks

`node .\slicer.js -d 5 -i 'C:\Users\Stella\Videos\Captures\sweetanime.mp4'`

-------------------------------

Written & tested originally on my Windows machine, but should work on any of Win / OSX / Linux that has FFMPEG installed properly.
