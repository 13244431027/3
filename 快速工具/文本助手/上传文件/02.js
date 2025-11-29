(function (Scratch) {
    "use strict";
    const fileNames = [];
    const fileContents = [];
    const fileSizes = [];
    const folderNames = [];
    const filePaths = [];
    let waitSec = 5000;

    function saveUploadMemory(name, content, size, folderName = "", path = "") {
        fileNames.push(name);
        fileContents.push(content);
        fileSizes.push(size);
        folderNames.push(folderName);
        filePaths.push(path);
    }

    function getUploadHistory(type, num) {
        if (type == 'name') {
            return fileNames.at(-num) || '';
        } else if (type == 'content') {
            return fileContents.at(-num) || '';
        } else if (type == 'extname') {
            const name = fileNames.at(-num);
            return name ? name.split('.').pop() : '';
        } else if (type == 'size') {
            return fileSizes.at(-num) || '';
        } else if (type == 'path') {
            return filePaths.at(-num) || '';
        } else if (type == 'folder') {
            return folderNames.at(-num) || '';
        }
        return '';
    }

    if (!Scratch.extensions.unsandboxed) {
        throw new Error("File+ extension must be run unsandboxed");
    }

    class FilePlus {
        getInfo() {
            return {
                id: 'CubeFilePlus',
                color1: '#3966A2',
                color2: '#132843',
                menuIconURI: "https://www.emojiall.com/images/120/telegram/telemoji-october-2022/1f4c1.gif",
                name: '文件+',
                blocks: [
                    '---',
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: '上传/下载',
                    },
                    {
                        opcode: "UploadFile",
                        blockType: Scratch.BlockType.REPORTER,
                        text: '上传单个[TYPE]文件并读取为blob',
                        arguments: {
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "image/*",
                            }
                        }
                    },
                    {
                        opcode: "UploadFiles",
                        blockType: Scratch.BlockType.REPORTER,
                        text: '上传多个[TYPE]文件并读取为blob数组',
                        arguments: {
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "image/*",
                            }
                        }
                    },
                    {
                        opcode: "UploadFolder",
                        blockType: Scratch.BlockType.REPORTER,
                        text: '上传文件夹并读取为blob数组',
                    },
                    {
                        opcode: "SetWaitSec",
                        blockType: Scratch.BlockType.COMMAND,
                        text: '设置上传文件夹等待秒数为[NUM]',
                        arguments: {
                            NUM: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 5,
                            }
                        }
                    },
                    '---',
                    {
                        opcode: "DownloadBlob",
                        blockType: Scratch.BlockType.COMMAND,
                        text: '下载blob[BLOB]为[NAME]',
                        arguments: {
                            BLOB: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "",
                            },
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "data.png",
                            }
                        }
                    },
                    '---',
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: '更多信息',
                    },
                    {
                        opcode: "GetUploadHistory",
                        blockType: Scratch.BlockType.REPORTER,
                        text: '获取上次打开第[NUM]个文件的[TYPE]',
                        arguments: {
                            TYPE: {
                                type: Scratch.ArgumentType.MENU,
                                menu: "HISTORY_MENU",
                            },
                            NUM: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1,
                            }
                        }
                    },
                    '---',
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: '转换',
                    },
                    {
                        opcode: "ByteConvert",
                        blockType: Scratch.BlockType.REPORTER,
                        text: '转换[UNITNUM][UNIT1]到[UNIT2]',
                        arguments: {
                            UNITNUM: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1024,
                            },
                            UNIT1: {
                                type: Scratch.ArgumentType.MENU,
                                menu: "BYTE_MENU",
                                defaultValue: 1,
                            },
                            UNIT2: {
                                type: Scratch.ArgumentType.MENU,
                                menu: "BYTE_MENU",
                                defaultValue: 1024,
                            }
                        }
                    },
                    {
                        opcode: "FileConvert",
                        blockType: Scratch.BlockType.REPORTER,
                        text: '转换[DATA][TYPE1]到[TYPE2]',
                        arguments: {
                            DATA: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Hello world!",
                            },
                            TYPE1: {
                                type: Scratch.ArgumentType.MENU,
                                menu: "TYPE_MENU",
                                defaultValue: 'text',
                            },
                            TYPE2: {
                                type: Scratch.ArgumentType.MENU,
                                menu: "TYPE_MENU",
                                defaultValue: 'text',
                            }
                        }
                    },
                ],
                menus: {
                    HISTORY_MENU: {
                        items: [
                            {
                                text: '文件名',
                                value: 'name'
                            },
                            {
                                text: '扩展名',
                                value: 'extname'
                            },
                            {
                                text: '文件大小(字节)',
                                value: 'size'
                            },
                            {
                                text: "blob",
                                value: 'content'
                            },
                            {
                                text: '目录',
                                value: 'path'
                            },
                            {
                                text: '文件夹名',
                                value: 'folder'
                            }
                        ]
                    },
                    BYTE_MENU: {
                        items: [
                            { text: '位', value: 0.125 },
                            { text: '字节', value: 1 },
                            { text: 'KB', value: 1024 },
                            { text: 'MB', value: 1048576 }
                        ]
                    },
                    TYPE_MENU: {
                        items: [
                            {
                                text: '文本',
                                value: 'text'
                            },
                            {
                                text: 'data:URL',
                                value: 'dataurl'
                            },
                            {
                                text: 'blob',
                                value: 'blob'
                            },
                        ]
                    }
                }
            };
        }

        clickinputfile(accept, multiple, directory = false) {
            return new Promise((resolve) => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = accept;
                input.multiple = multiple;
                input.webkitdirectory = directory;
                input.directory = directory;
                input.style.display = 'none';

                const cleanup = () => {
                    window.removeEventListener('focus', onFocus);
                    document.body.removeChild(input);
                };

                const onFileChange = () => {
                    const result = Array.from(input.files || []);
                    cleanup();
                    resolve(result);
                };

                const onFocus = () => {
                    setTimeout(() => {
                        const result = Array.from(input.files || []);
                        cleanup();
                        resolve(result);
                    },waitSec);
                };

                input.addEventListener('change', onFileChange, { once: true });
                window.addEventListener('focus', onFocus, { once: true });
                document.body.appendChild(input);
                input.click();
            });
        }

        async UploadFile(args) {
            try {
                const filelist = await this.clickinputfile(args.TYPE, false);
                const file = filelist[0];
                if (!file) return '';
                const blobURL = URL.createObjectURL(file);
                saveUploadMemory(file.name, blobURL, file.size);
                return blobURL;
            } catch (error) {
                console.error('Upload error:', error);
                return '';
            }
        }

        async UploadFolder(args) {
            try {
                const filelist = await this.clickinputfile(args.TYPE, false, true);
                const blobURLs = [];
                for (const file of filelist) {
                    const blobURL = URL.createObjectURL(file);
                    saveUploadMemory(
                        file.webkitRelativePath || file.name,
                        blobURL,
                        file.size
                    );
                    blobURLs.push(blobURL);
                }
                return JSON.stringify(blobURLs);
            } catch (error) {
                console.error('Folder upload error:', error);
                return '';
            }
        }

        async FileConvert(args) {
            try {
                if (args.TYPE1 === args.TYPE2) return args.DATA;

                let blob;
                if (args.TYPE1 === 'dataurl') {
                    const res = await fetch(args.DATA);
                    blob = await res.blob();
                } else if (args.TYPE1 === 'text') {
                    blob = new Blob([args.DATA], { type: 'text/plain' });
                } else if (args.TYPE1 === 'blob') {
                    const res = await fetch(args.DATA);
                    blob = await res.blob();
                }

                if (args.TYPE2 === 'blob') {
                    return URL.createObjectURL(blob);
                }

                return await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    args.TYPE2 === 'dataurl' ? reader.readAsDataURL(blob) : reader.readAsText(blob);
                });
            } catch (error) {
                console.error('Conversion error:', error);
                return '';
            }
        }

        DownloadBlob(args) {
            try {
                const link = document.createElement('a');
                link.href = args.BLOB;
                link.download = args.NAME;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(args.BLOB);
                }, 100);
            } catch (error) {
                console.error('Download error:', error);
            }
        }

        ByteConvert(args) {
            return (args.UNITNUM * args.UNIT1) / args.UNIT2;
        }

        async UploadFiles(args) {
            const filelist = await this.clickinputfile(args.TYPE, true);
            this.filelist = filelist;
            const files = this.filelist;
            const blobURLs = [];
            for (let i = 0; i < files.length; i++) {
                const blobURL = URL.createObjectURL(files[i]);
                saveUploadMemory(files[i].name, blobURL, files[i].size);
                blobURLs.push(blobURL);
            }
            return JSON.stringify(blobURLs);
        }

        async UploadFolder(args) {
            try {
                const filelist = await this.clickinputfile(args.TYPE, true, true);
                if (!filelist || filelist.length === 0) return '[]';

                const blobURLs = [];
                const folderName = filelist[0].webkitRelativePath?.split('/')[0];

                for (let i = 0; i < filelist.length; i++) {
                    const file = filelist[i];
                    if (!file) continue;

                    const relativePath = file.webkitRelativePath || `${folderName}/${file.name}`;
                    const blobURL = URL.createObjectURL(file);

                    saveUploadMemory(
                        file.name,
                        blobURL,
                        file.size,
                        folderName,
                        relativePath
                    );
                    blobURLs.push(blobURL);
                }
                return JSON.stringify(blobURLs);
            } catch (error) {
                console.error('Folder upload error:', error);
                return '[]';
            }
        }

        GetUploadHistory(args) {
            return getUploadHistory(args.TYPE, args.NUM);
        }

        SetWaitSec(args){
            waitSec = args.NUM*1000;
        }
    }

    Scratch.extensions.register(new FilePlus());
})(Scratch);