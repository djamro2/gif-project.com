from images2gif import writeGif
from PIL import Image
import urllib
import cStringIO
import shutil
import os
import sys

def extractFrames(inGif, outFolder):
    inGifHTTP = cStringIO.StringIO(urllib.urlopen(inGif).read())
    frame = Image.open(inGifHTTP)
    nframes = 0
    while frame:
        frame.save( '%s/%s.png' % (outFolder, nframes ) , 'png')
        nframes += 1
        try:
            frame.seek( nframes )
        except EOFError:
            break;
    return True
    
if len(sys.argv) > 0:
    inputGif = sys.argv[1] #the name of the gif to reverse
    print inputGif
    extractFrames(inputGif, 'output') #get all images from the gif
else:
    print "No input gif in arguments!"
