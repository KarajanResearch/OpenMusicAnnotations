# performs tasks on oma.DigitalAudio objects
#
# Martin Aigner, 2020

# digitalAudioAdded triggers audiowaveform after file upload
# installing audiowaveform: https://github.com/bbc/audiowaveform


import os
import sys
import subprocess

# configuration

# directory containing the wav files
digital_audio_directory = ""


# takes a list of digitalAudio IDs and performs audiowaveform for each
def task_audiowaveform(difference):
    print("New wav files:", difference)
    for audio_id in difference:
        input_filename = digital_audio_directory + str(audio_id) + "/" + str(audio_id) + ".wav"
        output_filename = digital_audio_directory + str(audio_id) + "/" + str(audio_id) + "-peaks.json"
        print(input_filename)
        print(output_filename)

        cmd = ["/usr/bin/audiowaveform", "-i", input_filename, "-o", output_filename, "-z", "32", "-b", "8", "--split-channels"]
        cmdstring = " ".join(cmd)
        print(cmdstring)

        #cli_output = os.popen(cmdstring)
        #print(cli_output)
        subprocess.call(cmd)




# takes a list of digitalAudio IDs and performs MusicBrainz stuff for each
def task_musicbrainz(difference):
    print("Musicbrainz for files:", difference)


# convention: path is [digitalAudio.id]/[digitalAudio.id].wav for audio
# convention: path is [digitalAudio.id]/[digitalAudio.id]-peaks.js for audiowaveform
def update():
    print("digitalAudio.update")
    directory = digital_audio_directory
    wav_files = []
    peak_files = []
    for r, d, f in os.walk(directory):
        for file in f:
            if '.wav' in file:
                try:
                    wav_files.append(int(file.split(".wav")[0]))
                except ValueError:
                    print("fix filename", os.path.join(r, file))
            if '-peaks.json' in file:
                try:
                    peak_files.append(int(file.split("-peaks.json")[0]))
                except ValueError:
                    print("fix filename", os.path.join(r, file))

    # compare lists of wav files and peaks files
    difference = [x for x in wav_files if x not in peak_files]

    if not difference:
        return print("No new files")
    else:
        # perform tasks on new files
        task_audiowaveform(difference)
        # task_musicbrainz(difference)


# main script entry point
if __name__ == "__main__":
    # execute only if run as a script

    if len(sys.argv) < 2:
        print("usage: digitalAudio.py Development|Production")
    print('Number of arguments:', len(sys.argv), 'arguments.')

    #setting path
    environment = str(sys.argv[1])
    if environment == "Development":
        digital_audio_directory = "/home/martin/Workspace/oma/efs-local/digitalAudio/"
    if environment == "Production":
        digital_audio_directory = "/home/ubuntu/efs-oma-digital/digitalAudio/"

    if (digital_audio_directory == ""):
        print("cannot set directory")
    update()

