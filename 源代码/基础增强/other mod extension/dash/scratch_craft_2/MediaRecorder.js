(function (Scratch) {
    "use strict";

    if (!Scratch.extensions.unsandboxed) {
        throw new Error(
            "MediaRecorder:\nThis extension must run unsandboxed!\nPlease enable the unsandboxed mode when loading the extension."
        );
    }

    class MediaRecorderExtension {
        constructor() {
            this.mediaRecorder = null;
            this.chunks = [];
            this.recording = false;
        }

        getInfo() {
            return {
                id: "MediaRecord",
                name: "MediaRecorder",
                color1: "#29beb8",
                blocks: [
                    {
                        opcode: "startRecording",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Start recording"
                    },
                    {
                        opcode: "stopRecording",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Stop recording"
                    },
                    {
                        opcode: "saveRecording",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Save recording"
                    }
                ]
            };
        }

        async startRecording(args) {
            if (this.recording) return;

            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        cursor: "always"
                    },
                    audio: true
                });

                const mimeTypes = [
                    'video/webm;codecs=vp9,opus',
                    'video/mp4;codecs=h264,aac'
                ];

                const supportedMimeType = navigator.mediaRecorder.isTypeSupported(mimeTypes[0])
                    ? mimeTypes[0]
                    : mimeTypes[1];

                this.mediaRecorder = new MediaRecorder(stream, { mimeType: supportedMimeType });

                this.mediaRecorder.ondataavailable = event => {
                    if (event.data.size > 0) {
                        this.chunks.push(event.data);
                    }
                };

                this.mediaRecorder.onstop = () => {
                    this.recording = false;
                    this.chunks = [];
                };

                this.mediaRecorder.start();
                this.recording = true;
            } catch (err) {
                console.error('MediaRecorder:\nFailed to initialize recording: ', err);
            }
        }

        stopRecording(args) {
            if (this.mediaRecorder) {
                this.mediaRecorder.stop();
                this.recording = false;
            }
        }

        async saveRecording(args) {
            if (!this.recording) return;

            const that = this;
            this.mediaRecorder.onstop = async () => {
                const blob = new Blob(that.chunks, { type: 'video/mp4' });
                that.chunks = [];

                const url = URL.createObjectURL(blob);
                try {
                    await Scratch.download(url, "recording.mp4");
                } catch (err) {
                    console.error("MediaRecorder:\nFailed to download recording: ", err);
                }
                URL.revokeObjectURL(url);
            };
        }
    }

    Scratch.extensions.register(new MediaRecorderExtension());
})(Scratch);
