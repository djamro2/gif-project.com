from images2gif import writeGif
from PIL import Image
import urllib
import cStringIO
import shutil
import os
import sys

def extractFrames(inGif, outFolder):

    #find the total number of frames
    frameAtNum = Image.open(inGif)
    frameNums = 0
    while frameAtNum:
        frameNums += 1
        try:
            frameAtNum.seek(frameNums)
        except EOFError:
            break;

    frame = Image.open(inGif)
    nframes = 0
    while frame:
        frame.save( '%s/%s.png' % (outFolder, int(frameNums - nframes) ) , 'png')
        nframes += 1
        try:
            frame.seek( nframes )
        except EOFError:
            break;

    return True
    
extractFrames('localgif-reverse.gif', 'output') #get all images from the gif
