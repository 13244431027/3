const yin_3d_extensionId = "Yin3DThree2";

let threeDScenes = new Map();
let threeJsLoaded = false;

class PurpleYin3DThree {
    constructor(runtime) {
        this.runtime = runtime;
        this.currentSceneId = "default";
        this.isIntegrated = false;
    }

    getInfo() {
        return {
            id: yin_3d_extensionId,
            name: "[3D扩展]",
            blockIconURI: "data:image/png;base64,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",
            menuIconURI: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAW+SURBVFhHrVdpUJVVGL7oD2f44cA4LiirKYiGAgoGCIhLAo6FxiqxugQoGmpaGosSIqgzlsoMBepkQrKIQYgMOVKKMzhDDRiESo7UGJSILLK6vPW8zvvNvd6LIfLjgXPOd5bnfd7lnKsaM2YMzZ5tTWFhIVRQcJb6+rqIaFADT5/207NnA1rjowGVvb0d7dnzCSUlxZOzsxMZG08jX981tG9fIrW2/qm1AERA6MXxkUIVGRlOsbGbuDMw8Iju3/+LUlM/o61bY2nChAlkZ2dLmzZFU2npd9Tf3621weuqozp5MostlwHZrLy8lMzMTMnQ0JA2b46hhQsdycjIiNas8aH9+5Pp3r1mLSWw9lXJqB48aCVTUxNqb/9bGczJOU0GBgZUV/czLV++jM6dy+dxHHrgQAqTmDlzBi1a5EK7dn1EZWUlrJ6sFwyHjAp/nJze4kPRzszMoKlTjejGjV+4Hx39AcXERHFb3eJjxz4nlUpF1tazaOnSJawOYictbT/HzuPHvcpcYCh1mAAk3rlzB+Xnf8uy37lzS5lw+vQpll/6QErKPlqwYD6TxP+urgd8KMZXr36XpkyZQitWvM2BXFX1o87MEjJMoLAwj/T19cnR0YFlVp8I18A6cRGIzpkzmx4+/IeD0sTEmBoa6jTWAOvWRbBCIAN3QZ3Dh9Opra1FQx0m0N3dTuPHj6fp0y1o2bKlnBXV1VX05EkfT3J1XUTnzxfy4ba286inp0PZwN/fl3bv/pjbsnFU1EYKDX2fs2fLls00ONhDCQmfko/POzR58mRWFGlfU1P9nAAA6+GCkpIiWr8+kq1ETYiL20re3l6cDWvXBioHSzwgCAMD/ZVxzHFwWMBt7IU6I3Ljf29vJ12+XMGunjXLilSyEQJNgg0TYQ1iAdaNHTuW5fTze49VuHbtJ7YKcxsbfyULC3POAmSHerzAbQhocZ+cdfDgAfL0XME1RyXssrO/5LSSxQKogSyxsXmTFdq4cT23zc3N2NpTp7Jp/nx7WrzYnYKCArTWw31ZWZlKH0aiuHV2tnFfccGLwQZgUxcXZ25DVgQr2lAHlicmxhMqKdQBtm37kMehji5lQRAKqaezQgBKgBmCDX1URw+PxcpE9Y0kOAFcYihaKFgggEC2tJzJ41Ds7NkcljsiIozjTNYJmIAwQj1A5EJaLFL/BheJGgLUAKTXrVsN7Ba5K2pra2jHjm1cCzjQ/lMH+4m71cEE5ENeXi5PXrVqpYZMgLioo+M+9yFlQIAft1GIpk2bSjdv1muswb5wnRijC4oLAATGxIkTeXMwDw8P5SCTvHd3d6OiogK2LCQkmMeEPJRATKiPIajhGrSHggYB+BYRffHi99TU1Ejbt8dxYUINgE+9vDxZob17E5Q1ohTqRXBwELdBAJkDojJvKCgEZCP1YMMYIh44evQIH66np8ebI/rPnPmaHj16yHNRjq2sLLkPy3EnyN4vgxaBjIyjfLuhLdF+924Ty5+enkpz59pQZeUPHGTIkkmTJtHKld58C4IAANfJvv8HDRcAUr3wTkC/vr6Wgw9ZgD4I4P5HG8pg3okTX7HFUgtkr+FAiwCsRkpdvVrJUY1LCtkh33XVA6Qfgi05OUmZN1xoEFAPqCVLPMjNzZUvFIzJiwcPEQSmrGlu/p3LMt6R6EsGDBc6CeTmfsNyIodv3/5N40Eh9QBj+AZ34RWFb696OKDlAgB+xUMCgYbfDHLxHD/+BT8oUKbxUsI4yGLNSA4HdBKA3PPmzaXr169xH7EQH7+H6wDegFAAChUXP3ePKDcSaBGQzTZsWMf3gvoYgBcyfk1duFDM/ZFaLhiSwKFDaZzf6mP4rTBu3DglDV/HcoFOFwAtLX9o1AP8MoLsKNPoj8bhwJAEkNuoavhxUlFRxiX40qVy/jZahwM6CcgBqAcgMWPGG3TlymWNb6OFlxLAWw6ySzaM9uFEg/QvdvlBOYWgXtIAAAAASUVORK5CYII=",
            color1: "#8B4513",
            color2: "#A0522D",
            blocks: [
                {
                    blockType: "button",
                    text: "📖 3D扩展使用说明",
                    func: "docs"
                },
                {
                    blockType: "button",
                    text: "版本 1.2.0 - 舞台集成版",
                    func: "version"
                },
                "---",
                {
                    opcode: "initScene",
                    blockType: "command",
                    text: "初始化3D场景 [sceneId]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        }
                    }
                },
                {
                    opcode: "setBackground",
                    blockType: "command",
                    text: "设置3D场景 [sceneId] 背景颜色 [color]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        color: {
                            type: "string",
                            defaultValue: "#87CEEB"
                        }
                    }
                },
                {
                    opcode: "clearScene",
                    blockType: "command",
                    text: "清空3D场景 [sceneId]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        }
                    }
                },
                {
                    opcode: "setCamera",
                    blockType: "command",
                    text: "设置相机位置 [sceneId] x [x] y [y] z [z]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        x: {
                            type: "number",
                            defaultValue: 0
                        },
                        y: {
                            type: "number",
                            defaultValue: 5
                        },
                        z: {
                            type: "number",
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: "setCameraLookAt",
                    blockType: "command",
                    text: "设置相机看向 [sceneId] x [x] y [y] z [z]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        x: {
                            type: "number",
                            defaultValue: 0
                        },
                        y: {
                            type: "number",
                            defaultValue: 0
                        },
                        z: {
                            type: "number",
                            defaultValue: 0
                        }
                    }
                },
                // 新增的相机移动控制积木
                {
                    opcode: "cameraMoveForward",
                    blockType: "command",
                    text: "相机前移 [sceneId] 距离 [distance]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        distance: {
                            type: "number",
                            defaultValue: 0.1
                        }
                    }
                },
                {
                    opcode: "cameraMoveBackward",
                    blockType: "command",
                    text: "相机后移 [sceneId] 距离 [distance]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        distance: {
                            type: "number",
                            defaultValue: 0.1
                        }
                    }
                },
                {
                    opcode: "cameraMoveLeft",
                    blockType: "command",
                    text: "相机左移 [sceneId] 距离 [distance]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        distance: {
                            type: "number",
                            defaultValue: 0.1
                        }
                    }
                },
                {
                    opcode: "cameraMoveRight",
                    blockType: "command",
                    text: "相机右移 [sceneId] 距离 [distance]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        distance: {
                            type: "number",
                            defaultValue: 0.1
                        }
                    }
                },
                {
                    opcode: "cameraMoveUp",
                    blockType: "command",
                    text: "相机上移 [sceneId] 距离 [distance]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        distance: {
                            type: "number",
                            defaultValue: 0.1
                        }
                    }
                },
                {
                    opcode: "cameraMoveDown",
                    blockType: "command",
                    text: "相机下移 [sceneId] 距离 [distance]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        distance: {
                            type: "number",
                            defaultValue: 0.1
                        }
                    }
                },
                {
                    opcode: "cameraRotateLeft",
                    blockType: "command",
                    text: "相机左转 [sceneId] 角度 [angle]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        angle: {
                            type: "number",
                            defaultValue: 15
                        }
                    }
                },
                {
                    opcode: "cameraRotateRight",
                    blockType: "command",
                    text: "相机右转 [sceneId] 角度 [angle]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        angle: {
                            type: "number",
                            defaultValue: 15
                        }
                    }
                },
                {
                    opcode: "cameraRotateUp",
                    blockType: "command",
                    text: "相机向上转 [sceneId] 角度 [angle]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        angle: {
                            type: "number",
                            defaultValue: 15
                        }
                    }
                },
                {
                    opcode: "cameraRotateDown",
                    blockType: "command",
                    text: "相机向下转 [sceneId] 角度 [angle]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        angle: {
                            type: "number",
                            defaultValue: 15
                        }
                    }
                },
                {
                    opcode: "getCameraPosition",
                    blockType: "reporter",
                    text: "获取相机 [sceneId] 的 [axis] 坐标",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        axis: {
                            type: "string",
                            menu: "axisMenu"
                        }
                    }
                },
                {
                    opcode: "getCameraPositionAll",
                    blockType: "reporter",
                    text: "获取相机 [sceneId] 的坐标 [coordType]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        coordType: {
                            type: "string",
                            menu: "coordMenu"
                        }
                    }
                },
                "---",
                {
                    opcode: "createCube",
                    blockType: "reporter",
                    text: "创建立方体 [sceneId] 位置 x [x] y [y] z [z] 大小 [size] 颜色 [color]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        x: {
                            type: "number",
                            defaultValue: 0
                        },
                        y: {
                            type: "number",
                            defaultValue: 0
                        },
                        z: {
                            type: "number",
                            defaultValue: 0
                        },
                        size: {
                            type: "number",
                            defaultValue: 1
                        },
                        color: {
                            type: "string",
                            defaultValue: "#FF0000"
                        }
                    }
                },
                {
                    opcode: "createSphere",
                    blockType: "reporter",
                    text: "创建球体 [sceneId] 位置 x [x] y [y] z [z] 半径 [radius] 颜色 [color]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        x: {
                            type: "number",
                            defaultValue: 0
                        },
                        y: {
                            type: "number",
                            defaultValue: 0
                        },
                        z: {
                            type: "number",
                            defaultValue: 0
                        },
                        radius: {
                            type: "number",
                            defaultValue: 1
                        },
                        color: {
                            type: "string",
                            defaultValue: "#00FF00"
                        }
                    }
                },
                {
                    opcode: "createCylinder",
                    blockType: "reporter",
                    text: "创建圆柱体 [sceneId] 位置 x [x] y [y] z [z] 半径 [radius] 高度 [height] 颜色 [color]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        x: {
                            type: "number",
                            defaultValue: 0
                        },
                        y: {
                            type: "number",
                            defaultValue: 0
                        },
                        z: {
                            type: "number",
                            defaultValue: 0
                        },
                        radius: {
                            type: "number",
                            defaultValue: 0.5
                        },
                        height: {
                            type: "number",
                            defaultValue: 2
                        },
                        color: {
                            type: "string",
                            defaultValue: "#0000FF"
                        }
                    }
                },
                {
                    opcode: "createCone",
                    blockType: "reporter",
                    text: "创建圆锥体 [sceneId] 位置 x [x] y [y] z [z] 半径 [radius] 高度 [height] 颜色 [color]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        x: {
                            type: "number",
                            defaultValue: 0
                        },
                        y: {
                            type: "number",
                            defaultValue: 0
                        },
                        z: {
                            type: "number",
                            defaultValue: 0
                        },
                        radius: {
                            type: "number",
                            defaultValue: 1
                        },
                        height: {
                            type: "number",
                            defaultValue: 2
                        },
                        color: {
                            type: "string",
                            defaultValue: "#FFFF00"
                        }
                    }
                },
                {
                    opcode: "createTorus",
                    blockType: "reporter",
                    text: "创建圆环 [sceneId] 位置 x [x] y [y] z [z] 半径 [radius] 管径 [tube] 颜色 [color]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        x: {
                            type: "number",
                            defaultValue: 0
                        },
                        y: {
                            type: "number",
                            defaultValue: 0
                        },
                        z: {
                            type: "number",
                            defaultValue: 0
                        },
                        radius: {
                            type: "number",
                            defaultValue: 2
                        },
                        tube: {
                            type: "number",
                            defaultValue: 0.5
                        },
                        color: {
                            type: "string",
                            defaultValue: "#FF00FF"
                        }
                    }
                },
                {
                    opcode: "createPlane",
                    blockType: "reporter",
                    text: "创建平面 [sceneId] 位置 x [x] y [y] z [z] 宽度 [width] 高度 [height] 颜色 [color]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        x: {
                            type: "number",
                            defaultValue: 0
                        },
                        y: {
                            type: "number",
                            defaultValue: 0
                        },
                        z: {
                            type: "number",
                            defaultValue: 0
                        },
                        width: {
                            type: "number",
                            defaultValue: 10
                        },
                        height: {
                            type: "number",
                            defaultValue: 10
                        },
                        color: {
                            type: "string",
                            defaultValue: "#888888"
                        }
                    }
                },
                "---",
                {
                    opcode: "setPosition",
                    blockType: "command",
                    text: "设置对象 [objId] 位置 x [x] y [y] z [z]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        x: {
                            type: "number",
                            defaultValue: 0
                        },
                        y: {
                            type: "number",
                            defaultValue: 0
                        },
                        z: {
                            type: "number",
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: "setRotation",
                    blockType: "command",
                    text: "设置对象 [objId] 旋转 x [rx] y [ry] z [rz]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        rx: {
                            type: "number",
                            defaultValue: 0
                        },
                        ry: {
                            type: "number",
                            defaultValue: 0
                        },
                        rz: {
                            type: "number",
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: "setScale",
                    blockType: "command",
                    text: "设置对象 [objId] 缩放 x [sx] y [sy] z [sz]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        sx: {
                            type: "number",
                            defaultValue: 1
                        },
                        sy: {
                            type: "number",
                            defaultValue: 1
                        },
                        sz: {
                            type: "number",
                            defaultValue: 1
                        }
                    }
                },
                // 新增的物体移动控制积木
                {
                    opcode: "objectMoveForward",
                    blockType: "command",
                    text: "物体 [objId] 前移 距离 [distance]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        distance: {
                            type: "number",
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: "objectMoveBackward",
                    blockType: "command",
                    text: "物体 [objId] 后移 距离 [distance]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        distance: {
                            type: "number",
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: "objectMoveLeft",
                    blockType: "command",
                    text: "物体 [objId] 左移 距离 [distance]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        distance: {
                            type: "number",
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: "objectMoveRight",
                    blockType: "command",
                    text: "物体 [objId] 右移 距离 [distance]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        distance: {
                            type: "number",
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: "objectMoveUp",
                    blockType: "command",
                    text: "物体 [objId] 上移 距离 [distance]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        distance: {
                            type: "number",
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: "objectMoveDown",
                    blockType: "command",
                    text: "物体 [objId] 下移 距离 [distance]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        distance: {
                            type: "number",
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: "objectRotateLeft",
                    blockType: "command",
                    text: "物体 [objId] 左转 角度 [angle]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        angle: {
                            type: "number",
                            defaultValue: 15
                        }
                    }
                },
                {
                    opcode: "objectRotateRight",
                    blockType: "command",
                    text: "物体 [objId] 右转 角度 [angle]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        angle: {
                            type: "number",
                            defaultValue: 15
                        }
                    }
                },
                {
                    opcode: "objectRotateUp",
                    blockType: "command",
                    text: "物体 [objId] 向上转 角度 [angle]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        angle: {
                            type: "number",
                            defaultValue: 15
                        }
                    }
                },
                {
                    opcode: "objectRotateDown",
                    blockType: "command",
                    text: "物体 [objId] 向下转 角度 [angle]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        angle: {
                            type: "number",
                            defaultValue: 15
                        }
                    }
                },
                {
                    opcode: "deleteObject",
                    blockType: "command",
                    text: "删除3D对象 [objId]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        }
                    }
                },
                "---",
                {
                    opcode: "setMaterial",
                    blockType: "command",
                    text: "设置对象 [objId] 材质 [materialType]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        materialType: {
                            type: "string",
                            menu: "materialTypes"
                        }
                    }
                },
                {
                    opcode: "setColor",
                    blockType: "command",
                    text: "设置对象 [objId] 颜色 [color]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        color: {
                            type: "string",
                            defaultValue: "#FF0000"
                        }
                    }
                },
                {
                    opcode: "setOpacity",
                    blockType: "command",
                    text: "设置对象 [objId] 透明度 [opacity]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        opacity: {
                            type: "number",
                            defaultValue: 1
                        }
                    }
                },
                "---",
                {
                    opcode: "addLight",
                    blockType: "reporter",
                    text: "添加光源 [sceneId] 类型 [lightType] 强度 [intensity] 颜色 [color]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        lightType: {
                            type: "string",
                            menu: "lightTypes"
                        },
                        intensity: {
                            type: "number",
                            defaultValue: 1
                        },
                        color: {
                            type: "string",
                            defaultValue: "#FFFFFF"
                        }
                    }
                },
                {
                    opcode: "setLightPosition",
                    blockType: "command",
                    text: "设置光源 [lightId] 位置 x [x] y [y] z [z]",
                    arguments: {
                        lightId: {
                            type: "string",
                            defaultValue: "light1"
                        },
                        x: {
                            type: "number",
                            defaultValue: 0
                        },
                        y: {
                            type: "number",
                            defaultValue: 5
                        },
                        z: {
                            type: "number",
                            defaultValue: 0
                        }
                    }
                },
                "---",
                {
                    opcode: "enablePhysics",
                    blockType: "command",
                    text: "启用物理引擎 [sceneId] 重力 [gravity]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        gravity: {
                            type: "number",
                            defaultValue: 9.8
                        }
                    }
                },
                {
                    opcode: "checkCollision",
                    blockType: "Boolean",
                    text: "对象 [objId1] 和 [objId2] 是否碰撞",
                    arguments: {
                        objId1: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        objId2: {
                            type: "string",
                            defaultValue: "obj2"
                        }
                    }
                },
                {
                    opcode: "applyForce",
                    blockType: "command",
                    text: "对对象 [objId] 施加力 x [fx] y [fy] z [fz]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        fx: {
                            type: "number",
                            defaultValue: 0
                        },
                        fy: {
                            type: "number",
                            defaultValue: 0
                        },
                        fz: {
                            type: "number",
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: "setVelocity",
                    blockType: "command",
                    text: "设置对象 [objId] 速度 x [vx] y [vy] z [vz]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        vx: {
                            type: "number",
                            defaultValue: 0
                        },
                        vy: {
                            type: "number",
                            defaultValue: 0
                        },
                        vz: {
                            type: "number",
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: "objectLookAtCamera",
                    blockType: "command",
                    text: "物体 [objId] 看向相机 [sceneId]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        }
                    }
                },
                {
                    opcode: "objectFollowCamera",
                    blockType: "command",
                    text: "物体 [objId] 跟随相机 [sceneId] 距离 [distance]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        distance: {
                            type: "number",
                            defaultValue: 3
                        }
                    }
                },
                {
                    opcode: "startObjectFollowCamera",
                    blockType: "command",
                    text: "开始物体 [objId] 持续跟随相机 [sceneId] 距离 [distance]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        distance: {
                            type: "number",
                            defaultValue: 3
                        }
                    }
                },
                {
                    opcode: "stopObjectFollowCamera",
                    blockType: "command",
                    text: "停止物体 [objId] 跟随相机",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        }
                    }
                },
                "---",
                {
                    opcode: "createText",
                    blockType: "reporter",
                    text: "创建文字 [sceneId] 内容 [text] 位置 x [x] y [y] z [z] 大小 [size] 颜色 [color]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        text: {
                            type: "string",
                            defaultValue: "Hello 3D"
                        },
                        x: {
                            type: "number",
                            defaultValue: 0
                        },
                        y: {
                            type: "number",
                            defaultValue: 0
                        },
                        z: {
                            type: "number",
                            defaultValue: 0
                        },
                        size: {
                            type: "number",
                            defaultValue: 1
                        },
                        color: {
                            type: "string",
                            defaultValue: "#FFFFFF"
                        }
                    }
                },
                {
                    opcode: "setTextContent",
                    blockType: "command",
                    text: "设置文字 [objId] 内容 [text]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "text1"
                        },
                        text: {
                            type: "string",
                            defaultValue: "新文字"
                        }
                    }
                },
                {
                    opcode: "setTextSize",
                    blockType: "command",
                    text: "设置文字 [objId] 大小 [size]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "text1"
                        },
                        size: {
                            type: "number",
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: "setTextColor",
                    blockType: "command",
                    text: "设置文字 [objId] 颜色 [color]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "text1"
                        },
                        color: {
                            type: "string",
                            defaultValue: "#FFFFFF"
                        }
                    }
                },
                {
                    opcode: "textMoveUp",
                    blockType: "command",
                    text: "文字 [objId] 上移 距离 [distance]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "text1"
                        },
                        distance: {
                            type: "number",
                            defaultValue: 0.2
                        }
                    }
                },
                {
                    opcode: "textMoveDown",
                    blockType: "command",
                    text: "文字 [objId] 下移 距离 [distance]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "text1"
                        },
                        distance: {
                            type: "number",
                            defaultValue: 0.2
                        }
                    }
                },
                {
                    opcode: "textMoveLeft",
                    blockType: "command",
                    text: "文字 [objId] 左移 距离 [distance]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "text1"
                        },
                        distance: {
                            type: "number",
                            defaultValue: 0.2
                        }
                    }
                },
                {
                    opcode: "textMoveRight",
                    blockType: "command",
                    text: "文字 [objId] 右移 距离 [distance]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "text1"
                        },
                        distance: {
                            type: "number",
                            defaultValue: 0.2
                        }
                    }
                },
                {
                    opcode: "textMoveForward",
                    blockType: "command",
                    text: "文字 [objId] 前移 距离 [distance]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "text1"
                        },
                        distance: {
                            type: "number",
                            defaultValue: 0.2
                        }
                    }
                },
                {
                    opcode: "textMoveBackward",
                    blockType: "command",
                    text: "文字 [objId] 后移 距离 [distance]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "text1"
                        },
                        distance: {
                            type: "number",
                            defaultValue: 0.2
                        }
                    }
                },
                "---",
                {
                    opcode: "whenObjectClicked",
                    blockType: "hat",
                    text: "当3D对象 [objId] 被点击时",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        }
                    }
                },
                {
                    opcode: "whenObjectsCollide",
                    blockType: "hat",
                    text: "当对象 [objId1] 和 [objId2] 碰撞时",
                    arguments: {
                        objId1: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        objId2: {
                            type: "string",
                            defaultValue: "obj2"
                        }
                    }
                },
                {
                    opcode: "getObjectPosition",
                    blockType: "reporter",
                    text: "获取对象 [objId] 的 [axis] 坐标",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        axis: {
                            type: "string",
                            menu: "axisMenu"
                        }
                    }
                },
                {
                    opcode: "getDistance",
                    blockType: "reporter",
                    text: "获取对象 [objId1] 和 [objId2] 的距离",
                    arguments: {
                        objId1: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        objId2: {
                            type: "string",
                            defaultValue: "obj2"
                        }
                    }
                }
            ],
            menus: {
                lightTypes: {
                    acceptReporters: true,
                    items: [
                        "环境光",
                        "平行光", 
                        "点光源",
                        "聚光灯"
                    ]
                },
                materialTypes: {
                    acceptReporters: true,
                    items: [
                        "标准材质",
                        "物理材质", 
                        "基础材质",
                        "线框材质",
                        "发光材质"
                    ]
                },
                axisMenu: {
                    acceptReporters: true,
                    items: [
                        "X",
                        "Y",
                        "Z"
                    ]
                },
                coordMenu: {
                    acceptReporters: true,
                    items: [
                        "X坐标",
                        "Y坐标", 
                        "Z坐标",
                        "X,Y,Z"
                    ]
                }
            }
        };
    }

    docs() {
        window.open("https://learn.ccw.site/article/26e8ee07-9c21-4f9e-bedc-7788bc989323", "_blank");
    }

    version() {
        window.open("https://learn.ccw.site/article/26e8ee07-9c21-4f9e-bedc-7788bc989323", "_blank");
    }

    integrateWithStage() {
        if (this.isIntegrated) return;
        
        const stageWrapper = document.querySelector('.stage-wrapper') || 
                           document.querySelector('[class*="stage-wrapper"]') ||
                           document.querySelector('[class*="stage"]') ||
                           document.getElementById('stage');
        
        if (!stageWrapper) {
            console.warn('未找到Scratch舞台容器，延迟集成...');
            setTimeout(() => this.integrateWithStage(), 500);
            return;
        }

        stageWrapper.style.position = 'relative';
        stageWrapper.style.overflow = 'hidden';
        
        this.stageWrapper = stageWrapper;
        this.isIntegrated = true;
        console.log('3D扩展已集成到Scratch舞台容器');
    }

    loadThreeJS(callback) {
        if (typeof THREE !== 'undefined') {
            threeJsLoaded = true;
            callback();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = () => {
            threeJsLoaded = true;
            callback();
        };
        script.onerror = () => {
            console.error('Failed to load Three.js');
            setTimeout(() => this.loadThreeJS(callback), 1000);
        };
        document.head.appendChild(script);
    }

    // 在类中添加字体加载相关的方法
    getDefaultFont(callback) {
        // 如果已经加载过字体，直接返回
        if (this.defaultFont) {
            callback(this.defaultFont);
            return;
        }
        
        // 使用CDN加载字体
        const loader = new THREE.FontLoader();
        const fontUrl = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_regular.typeface.json';
        
        loader.load(fontUrl, (font) => {
            this.defaultFont = font;
            callback(font);
        }, undefined, (error) => {
            console.error('字体加载失败:', error);
            // 返回一个基本的字体对象作为备用
            callback(this.createBasicFont());
        });
    }

    // 创建基本字体（备用）
    createBasicFont() {
        return {
            data: {
                familyName: "Arial",
                ascender: 1,
                descender: 0,
                underlinePosition: 0,
                underlineThickness: 0,
                boundingBox: { yMin: 0, yMax: 1, xMin: 0, xMax: 1 },
                resolution: 1,
                glyphs: {}
            }
        };
    }

    initScene(args) {
        const { sceneId } = args;
        
        this.integrateWithStage();
        
        this.loadThreeJS(() => {
            if (!threeJsLoaded) {
                console.error('Three.js 加载失败');
                return;
            }

            if (threeDScenes.has(sceneId)) {
                console.warn(`3D场景 ${sceneId} 已存在`);
                return;
            }

            const container = document.createElement('div');
            container.className = 'scratch-3d-container';
            container.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 50%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
            `;

            this.stageWrapper.appendChild(container);

            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x87CEEB);

            const width = this.stageWrapper.clientWidth || 480;
            const height = this.stageWrapper.clientHeight || 360;

            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            camera.position.set(0, 5, 10);
            camera.lookAt(0, 0, 0);

            const renderer = new THREE.WebGLRenderer({ 
                antialias: true,
                alpha: true
            });
            renderer.setSize(width, height);
            container.appendChild(renderer.domElement);

            renderer.domElement.style.pointerEvents = 'auto';

            const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(10, 10, 5);
            scene.add(directionalLight);

            const sceneData = {
                scene,
                camera,
                renderer,
                container,
                objects: new Map(),
                lights: new Map(),
                nextObjectId: 1,
                nextLightId: 1,
                raycaster: new THREE.Raycaster(),
                mouse: new THREE.Vector2(),
                clickableObjects: [],
                physicsEnabled: false,
                gravity: 9.8,
                collisionPairs: new Set()
            };

            threeDScenes.set(sceneId, sceneData);
            this.currentSceneId = sceneId;

            this.setupEventListeners(sceneId);
            this.animateScene(sceneId);
            this.setupResizeObserver(sceneId);

            console.log(`3D场景 ${sceneId} 初始化完成`);
        });
    }

    setupEventListeners(sceneId) {
        const sceneData = threeDScenes.get(sceneId);
        if (!sceneData) return;

        const onMouseClick = (event) => {
            try {
                const rect = sceneData.renderer.domElement.getBoundingClientRect();
                sceneData.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                sceneData.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                sceneData.raycaster.setFromCamera(sceneData.mouse, sceneData.camera);
                
                const intersects = sceneData.raycaster.intersectObjects(sceneData.clickableObjects);
                
                if (intersects.length > 0) {
                    const object = intersects[0].object;
                    for (const [objId, objData] of sceneData.objects) {
                        if (objData.mesh === object) {
                            if (this.runtime && this.runtime.startHats) {
                                this.runtime.startHats('yin3dthree_whenObjectClicked', {
                                    OBJID: objId
                                });
                            }
                            break;
                        }
                    }
                }
            } catch (error) {
                console.error('点击事件处理错误:', error);
            }
        };

        sceneData.renderer.domElement.addEventListener('click', onMouseClick);
        sceneData.clickHandler = onMouseClick;
    }

    setupResizeObserver(sceneId) {
        const sceneData = threeDScenes.get(sceneId);
        if (!sceneData || !this.stageWrapper) return;

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) {
                    sceneData.camera.aspect = width / height;
                    sceneData.camera.updateProjectionMatrix();
                    sceneData.renderer.setSize(width, height);
                }
            }
        });

        resizeObserver.observe(this.stageWrapper);
        sceneData.resizeObserver = resizeObserver;
    }

    animateScene(sceneId) {
        const sceneData = threeDScenes.get(sceneId);
        if (!sceneData) return;

        const animate = () => {
            if (!threeDScenes.has(sceneId)) return;
            
            requestAnimationFrame(animate);
            
            // 物理模拟
            if (sceneData.physicsEnabled) {
                this.updatePhysics(sceneId);
            }
            
            // 碰撞检测
            this.checkAllCollisions(sceneId);
            
            sceneData.renderer.render(sceneData.scene, sceneData.camera);
        };
        animate();
    }

    updatePhysics(sceneId) {
        const sceneData = threeDScenes.get(sceneId);
        if (!sceneData) return;

        sceneData.objects.forEach((object) => {
            if (object.velocity) {
                object.mesh.position.x += object.velocity.x * 0.016;
                object.mesh.position.y += object.velocity.y * 0.016;
                object.mesh.position.z += object.velocity.z * 0.016;
                
                // 简单重力
                if (object.mesh.position.y > 0) {
                    object.velocity.y -= sceneData.gravity * 0.016;
                } else {
                    object.mesh.position.y = 0;
                    object.velocity.y = 0;
                }
            }
        });
    }

    checkAllCollisions(sceneId) {
        const sceneData = threeDScenes.get(sceneId);
        if (!sceneData) return;

        const objects = Array.from(sceneData.objects.entries());
        
        for (let i = 0; i < objects.length; i++) {
            for (let j = i + 1; j < objects.length; j++) {
                const [id1, obj1] = objects[i];
                const [id2, obj2] = objects[j];
                
                if (this.checkCollisionBetween(obj1.mesh, obj2.mesh)) {
                    const collisionKey = `${id1}-${id2}`;
                    if (!sceneData.collisionPairs.has(collisionKey)) {
                        sceneData.collisionPairs.add(collisionKey);
                        if (this.runtime && this.runtime.startHats) {
                            this.runtime.startHats('yin3dthree_whenObjectsCollide', {
                                OBJID1: id1,
                                OBJID2: id2
                            });
                        }
                    }
                } else {
                    sceneData.collisionPairs.delete(`${id1}-${id2}`);
                }
            }
        }
    }

    checkCollisionBetween(mesh1, mesh2) {
        const box1 = new THREE.Box3().setFromObject(mesh1);
        const box2 = new THREE.Box3().setFromObject(mesh2);
        return box1.intersectsBox(box2);
    }

    // 新增的相机移动方法
    cameraMoveForward(args) {
        const { sceneId, distance } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        sceneData.camera.translateZ(-distance);
    }

    cameraMoveBackward(args) {
        const { sceneId, distance } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        // 后移就是Z轴正方向
        sceneData.camera.translateZ(distance);
    }

    cameraMoveLeft(args) {
        const { sceneId, distance } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        // 左移是X轴负方向
        sceneData.camera.translateX(-distance);
    }

    cameraMoveRight(args) {
        const { sceneId, distance } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        // 右移是X轴正方向
        sceneData.camera.translateX(distance);
    }

    cameraMoveUp(args) {
        const { sceneId, distance } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        // 右移是X轴正方向
        sceneData.camera.translateY(distance);
    }
    
    cameraMoveDown(args) {
        const { sceneId, distance } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        // 右移是X轴正方向
        sceneData.camera.translateY(-distance);
    }

    cameraRotateLeft(args) {
        const { sceneId, angle } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        // 绕Y轴左转
        sceneData.camera.rotation.y += THREE.MathUtils.degToRad(angle);
    }

    cameraRotateRight(args) {
        const { sceneId, angle } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        // 绕Y轴右转
        sceneData.camera.rotation.y -= THREE.MathUtils.degToRad(angle);
    }

    cameraRotateUp(args) {
        const { sceneId, angle } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        // 绕Y轴左转
        sceneData.camera.rotation.x += THREE.MathUtils.degToRad(angle);
    }

    cameraRotateDown(args) {
        const { sceneId, angle } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        // 绕Y轴左转
        sceneData.camera.rotation.x -= THREE.MathUtils.degToRad(angle);
    }

    // 新增的物体移动方法
    objectMoveForward(args) {
        const { objId, distance } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                // 按照物体的本地坐标系前方向移动
                const direction = new THREE.Vector3(0, 0, -1);
                direction.applyQuaternion(object.mesh.quaternion); // 应用物体的旋转
                object.mesh.position.add(direction.multiplyScalar(distance * 0.1));
                return;
            }
        }
        console.warn(`未找到3D对象: ${objId}`);
    }

    objectMoveBackward(args) {
        const { objId, distance } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                // 按照物体的本地坐标系后方向移动
                const direction = new THREE.Vector3(0, 0, 1);
                direction.applyQuaternion(object.mesh.quaternion); // 应用物体的旋转
                object.mesh.position.add(direction.multiplyScalar(distance * 0.1));
                return;
            }
        }
        console.warn(`未找到3D对象: ${objId}`);
    }

    objectMoveLeft(args) {
        const { objId, distance } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                // 按照物体的本地坐标系左方向移动
                const direction = new THREE.Vector3(-1, 0, 0);
                direction.applyQuaternion(object.mesh.quaternion); // 应用物体的旋转
                object.mesh.position.add(direction.multiplyScalar(distance * 0.1));
                return;
            }
        }
        console.warn(`未找到3D对象: ${objId}`);
    }

    objectMoveRight(args) {
        const { objId, distance } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                // 按照物体的本地坐标系右方向移动
                const direction = new THREE.Vector3(1, 0, 0);
                direction.applyQuaternion(object.mesh.quaternion); // 应用物体的旋转
                object.mesh.position.add(direction.multiplyScalar(distance * 0.1));
                return;
            }
        }
        console.warn(`未找到3D对象: ${objId}`);
    }

    objectMoveUp(args) {
        const { objId, distance } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                // 按照物体的本地坐标系上方向移动
                const direction = new THREE.Vector3(0, 1, 0);
                direction.applyQuaternion(object.mesh.quaternion); // 应用物体的旋转
                object.mesh.position.add(direction.multiplyScalar(distance * 0.1));
                return;
            }
        }
        console.warn(`未找到3D对象: ${objId}`);
    }

    objectMoveDown(args) {
        const { objId, distance } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                // 按照物体的本地坐标系下方向移动
                const direction = new THREE.Vector3(0, -1, 0);
                direction.applyQuaternion(object.mesh.quaternion); // 应用物体的旋转
                object.mesh.position.add(direction.multiplyScalar(distance * 0.1));
                return;
            }
        }
        console.warn(`未找到3D对象: ${objId}`);
    }

    objectRotateLeft(args) {
        const { objId, angle } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                // 绕Y轴左转
                object.mesh.rotation.y += THREE.MathUtils.degToRad(angle);
                return;
            }
        }
        
        console.warn(`未找到3D对象: ${objId}`);
    }

    objectRotateRight(args) {
        const { objId, angle } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                object.mesh.rotation.y -= THREE.MathUtils.degToRad(angle);
                return;
            }
        }
        
        console.warn(`未找到3D对象: ${objId}`);
    }

    objectRotateUp(args) {
        const { objId, angle } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                object.mesh.rotation.x -= THREE.MathUtils.degToRad(angle);
                return;
            }
        }
        
        console.warn(`未找到3D对象: ${objId}`);
    }

    objectRotateDown(args) {
        const { objId, angle } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                object.mesh.rotation.x += THREE.MathUtils.degToRad(angle);
                return;
            }
        }
        
        console.warn(`未找到3D对象: ${objId}`);
    }

    // 原有的其他方法保持不变
    setBackground(args) {
        const { sceneId, color } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        sceneData.scene.background = new THREE.Color(color);
    }

    clearScene(args) {
        const { sceneId } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        sceneData.objects.forEach((objData) => {
            sceneData.scene.remove(objData.mesh);
        });
        sceneData.objects.clear();
        sceneData.clickableObjects = [];
        sceneData.collisionPairs.clear();
        
        console.log(`3D场景 ${sceneId} 已清空`);
    }

    setCamera(args) {
        const { sceneId, x, y, z } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        sceneData.camera.position.set(x, y, z);
    }

    setCameraLookAt(args) {
        const { sceneId, x, y, z } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        sceneData.camera.lookAt(x, y, z);
    }

    createCube(args) {
        return this._createGeometry(args, 'cube');
    }

    createSphere(args) {
        return this._createGeometry(args, 'sphere');
    }

    createCylinder(args) {
        return this._createGeometry(args, 'cylinder');
    }

    createCone(args) {
        return this._createGeometry(args, 'cone');
    }

    createTorus(args) {
        return this._createGeometry(args, 'torus');
    }

    createPlane(args) {
        return this._createGeometry(args, 'plane');
    }

    _createGeometry(args, type) {
        const { sceneId, x, y, z, color } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return '';
        }

        let geometry;
        switch (type) {
            case 'cube':
                geometry = new THREE.BoxGeometry(args.size, args.size, args.size);
                break;
            case 'sphere':
                geometry = new THREE.SphereGeometry(args.radius, 32, 32);
                break;
            case 'cylinder':
                geometry = new THREE.CylinderGeometry(args.radius, args.radius, args.height, 32);
                break;
            case 'cone':
                geometry = new THREE.ConeGeometry(args.radius, args.height, 32);
                break;
            case 'torus':
                geometry = new THREE.TorusGeometry(args.radius, args.tube, 16, 100);
                break;
            case 'plane':
                geometry = new THREE.PlaneGeometry(args.width, args.height);
                break;
            default:
                return '';
        }

        const material = new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.3,
            roughness: 0.4
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        
        if (type === 'plane') {
            mesh.rotation.x = -Math.PI / 2;
        }
        
        mesh.position.set(x, y, z);
        sceneData.scene.add(mesh);
        
        const objectId = `obj${sceneData.nextObjectId++}`;
        sceneData.objects.set(objectId, {
            mesh: mesh,
            type: type,
            material: material,
            velocity: null
        });

        sceneData.clickableObjects.push(mesh);
        
        return objectId;
    }

    // 物体看向相机
    objectLookAtCamera(args) {
        const { objId, sceneId } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        const object = sceneData.objects.get(objId);
        if (!object) {
            console.warn(`未找到3D对象: ${objId}`);
            return;
        }
        
        // 让物体看向相机位置
        object.mesh.lookAt(sceneData.camera.position);
    }

    // 物体跟随相机（单次）
    objectFollowCamera(args) {
        const { objId, sceneId, distance } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        const object = sceneData.objects.get(objId);
        if (!object) {
            console.warn(`未找到3D对象: ${objId}`);
            return;
        }
        
        // 计算相机前方的位置
        const cameraDirection = new THREE.Vector3();
        sceneData.camera.getWorldDirection(cameraDirection);
        
        // 物体位置 = 相机位置 + 相机前方方向 * 距离
        const targetPosition = new THREE.Vector3()
            .copy(sceneData.camera.position)
            .add(cameraDirection.multiplyScalar(distance));
        
        object.mesh.position.copy(targetPosition);
        
        // 让物体看向相机
        object.mesh.lookAt(sceneData.camera.position);
    }

    // 开始持续跟随
    startObjectFollowCamera(args) {
        const { objId, sceneId, distance } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        const object = sceneData.objects.get(objId);
        if (!object) {
            console.warn(`未找到3D对象: ${objId}`);
            return;
        }
        
        // 存储跟随状态
        object.followCamera = {
            sceneId: sceneId,
            distance: distance,
            active: true
        };
        
        console.log(`开始物体 ${objId} 持续跟随相机`);
    }

    // 停止跟随
    stopObjectFollowCamera(args) {
        const { objId } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object && object.followCamera) {
                object.followCamera.active = false;
                delete object.followCamera;
                console.log(`停止物体 ${objId} 跟随相机`);
                return;
            }
        }
        
        console.warn(`未找到3D对象或未在跟随状态: ${objId}`);
    }

    createText(args) {
        const { sceneId, text, x, y, z, size, color } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return '';
        }

        try {
            // 创建Canvas来渲染文字
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            // 设置Canvas大小（根据文字长度和大小动态调整）
            const fontSize = Math.max(32, size * 32); // 基础字体大小
            const padding = 10;
            
            // 测量文字宽度
            context.font = `bold ${fontSize}px Arial`;
            const textMetrics = context.measureText(text);
            const textWidth = textMetrics.width;
            
            canvas.width = textWidth + padding * 2;
            canvas.height = fontSize + padding * 2;
            
            // 清除Canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            // 绘制文字
            context.font = `bold ${fontSize}px Arial`;
            context.fillStyle = color;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(text, canvas.width / 2, canvas.height / 2);
            
            // 添加边框（可选）
            context.strokeStyle = '#000000';
            context.lineWidth = 2;
            context.strokeText(text, canvas.width / 2, canvas.height / 2);
            
            // 创建纹理
            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            
            // 创建平面几何体显示文字
            const aspectRatio = canvas.width / canvas.height;
            const geometry = new THREE.PlaneGeometry(size * aspectRatio, size);
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide
            });
            
            const textMesh = new THREE.Mesh(geometry, material);
            textMesh.position.set(x, y, z);
            
            // 让文字始终面向相机
            textMesh.lookAt(sceneData.camera.position);
            
            sceneData.scene.add(textMesh);
            
            const objectId = `text${sceneData.nextObjectId++}`;
            sceneData.objects.set(objectId, {
                mesh: textMesh,
                type: 'text',
                text: text,
                size: size,
                color: color,
                geometry: geometry,
                material: material,
                texture: texture,
                canvas: canvas,
                context: context
            });

            sceneData.clickableObjects.push(textMesh);
            
            return objectId;
        } catch (error) {
            console.error('创建文字失败:', error);
            return '';
        }
    }

    // 设置文字内容
    setTextContent(args) {
        const { objId, text } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object && object.type === 'text') {
                // 更新Canvas内容
                const context = object.context;
                const canvas = object.canvas;
                
                // 清除Canvas
                context.clearRect(0, 0, canvas.width, canvas.height);
                
                // 重新测量文字
                const fontSize = Math.max(32, object.size * 32);
                context.font = `bold ${fontSize}px Arial`;
                const textMetrics = context.measureText(text);
                const textWidth = textMetrics.width;
                
                // 调整Canvas大小（如果需要）
                const padding = 10;
                const newWidth = textWidth + padding * 2;
                if (newWidth !== canvas.width) {
                    canvas.width = newWidth;
                    canvas.height = fontSize + padding * 2;
                    
                    // 更新几何体大小
                    const aspectRatio = canvas.width / canvas.height;
                    object.geometry.dispose();
                    object.geometry = new THREE.PlaneGeometry(object.size * aspectRatio, object.size);
                    object.mesh.geometry = object.geometry;
                }
                
                // 绘制新文字
                context.font = `bold ${fontSize}px Arial`;
                context.fillStyle = object.color;
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText(text, canvas.width / 2, canvas.height / 2);
                
                // 更新边框
                context.strokeStyle = '#000000';
                context.lineWidth = 2;
                context.strokeText(text, canvas.width / 2, canvas.height / 2);
                
                // 更新纹理
                object.texture.needsUpdate = true;
                object.text = text;
                
                return;
            }
        }
        
        console.warn(`未找到文字对象: ${objId}`);
    }

    // 设置文字大小
    setTextSize(args) {
        const { objId, size } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object && object.type === 'text') {
                // 更新Canvas
                const context = object.context;
                const canvas = object.canvas;
                
                const fontSize = Math.max(32, size * 32);
                context.font = `bold ${fontSize}px Arial`;
                const textMetrics = context.measureText(object.text);
                const textWidth = textMetrics.width;
                
                const padding = 10;
                canvas.width = textWidth + padding * 2;
                canvas.height = fontSize + padding * 2;
                
                // 重绘文字
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.font = `bold ${fontSize}px Arial`;
                context.fillStyle = object.color;
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText(object.text, canvas.width / 2, canvas.height / 2);
                
                context.strokeStyle = '#000000';
                context.lineWidth = 2;
                context.strokeText(object.text, canvas.width / 2, canvas.height / 2);
                
                // 更新几何体
                const aspectRatio = canvas.width / canvas.height;
                object.geometry.dispose();
                object.geometry = new THREE.PlaneGeometry(size * aspectRatio, size);
                object.mesh.geometry = object.geometry;
                
                // 更新纹理
                object.texture.needsUpdate = true;
                object.size = size;
                
                return;
            }
        }
        
        console.warn(`未找到文字对象: ${objId}`);
    }

    // 设置文字颜色
    setTextColor(args) {
        const { objId, color } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object && object.type === 'text') {
                // 更新Canvas
                const context = object.context;
                const canvas = object.canvas;
                
                const fontSize = Math.max(32, object.size * 32);
                
                // 重绘文字
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.font = `bold ${fontSize}px Arial`;
                context.fillStyle = color;
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText(object.text, canvas.width / 2, canvas.height / 2);
                
                context.strokeStyle = '#000000';
                context.lineWidth = 2;
                context.strokeText(object.text, canvas.width / 2, canvas.height / 2);
                
                // 更新纹理
                object.texture.needsUpdate = true;
                object.color = color;
                
                return;
            }
        }
        
        console.warn(`未找到文字对象: ${objId}`);
    }

    // 文字移动方法
    textMoveUp(args) {
        const { objId, distance } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object && object.type === 'text') {
                object.mesh.position.y += distance * 0.1;
                return;
            }
        }
        
        console.warn(`未找到文字对象: ${objId}`);
    }

    textMoveDown(args) {
        const { objId, distance } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object && object.type === 'text') {
                object.mesh.position.y -= distance * 0.1;
                return;
            }
        }
        
        console.warn(`未找到文字对象: ${objId}`);
    }

    textMoveLeft(args) {
        const { objId, distance } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object && object.type === 'text') {
                object.mesh.position.x -= distance * 0.1;
                return;
            }
        }
        
        console.warn(`未找到文字对象: ${objId}`);
    }

    textMoveRight(args) {
        const { objId, distance } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object && object.type === 'text') {
                object.mesh.position.x += distance * 0.1;
                return;
            }
        }
        
        console.warn(`未找到文字对象: ${objId}`);
    }

    textMoveForward(args) {
        const { objId, distance } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object && object.type === 'text') {
                object.mesh.position.z -= distance * 0.1;
                return;
            }
        }
        
        console.warn(`未找到文字对象: ${objId}`);
    }

    textMoveBackward(args) {
        const { objId, distance } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object && object.type === 'text') {
                object.mesh.position.z += distance * 0.1;
                return;
            }
        }
        
        console.warn(`未找到文字对象: ${objId}`);
    }

    setPosition(args) {
        const { objId, x, y, z } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                object.mesh.position.set(x, y, z);
                return;
            }
        }
        
        console.warn(`未找到3D对象: ${objId}`);
    }

    setRotation(args) {
        const { objId, rx, ry, rz } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                object.mesh.rotation.set(
                    THREE.MathUtils.degToRad(rx),
                    THREE.MathUtils.degToRad(ry),
                    THREE.MathUtils.degToRad(rz)
                );
                return;
            }
        }
    }

    setScale(args) {
        const { objId, sx, sy, sz } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                object.mesh.scale.set(sx, sy, sz);
                return;
            }
        }
    }

    deleteObject(args) {
        const { objId } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                sceneData.scene.remove(object.mesh);
                
                const index = sceneData.clickableObjects.indexOf(object.mesh);
                if (index > -1) {
                    sceneData.clickableObjects.splice(index, 1);
                }
                
                // 清理碰撞对
                for (const pair of sceneData.collisionPairs) {
                    if (pair.includes(objId)) {
                        sceneData.collisionPairs.delete(pair);
                    }
                }
                
                sceneData.objects.delete(objId);
                console.log(`删除3D对象: ${objId}`);
                return;
            }
        }
    }

    setMaterial(args) {
        const { objId, materialType } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                let newMaterial;
                const currentColor = object.material.color;
                
                switch (materialType) {
                    case '标准材质':
                        newMaterial = new THREE.MeshStandardMaterial({ 
                            color: currentColor 
                        });
                        break;
                    case '物理材质':
                        newMaterial = new THREE.MeshPhysicalMaterial({ 
                            color: currentColor 
                        });
                        break;
                    case '基础材质':
                        newMaterial = new THREE.MeshBasicMaterial({ 
                            color: currentColor 
                        });
                        break;
                    case '线框材质':
                        newMaterial = new THREE.MeshBasicMaterial({ 
                            color: currentColor,
                            wireframe: true 
                        });
                        break;
                    case '发光材质':
                        newMaterial = new THREE.MeshBasicMaterial({ 
                            color: currentColor,
                            emissive: 0x444444 
                        });
                        break;
                    default:
                        console.error(`未知的材质类型: ${materialType}`);
                        return;
                }
                
                object.mesh.material = newMaterial;
                object.material = newMaterial;
                return;
            }
        }
    }

    setColor(args) {
        const { objId, color } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                object.material.color = new THREE.Color(color);
                return;
            }
        }
    }

    setOpacity(args) {
        const { objId, opacity } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                object.material.transparent = true;
                object.material.opacity = Math.max(0, Math.min(1, opacity));
                return;
            }
        }
    }

    addLight(args) {
        const { sceneId, lightType, intensity, color } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return '';
        }

        let light;
        const lightColor = new THREE.Color(color);
        
        if (lightType === "环境光") {
            light = new THREE.AmbientLight(lightColor, intensity);
        } else if (lightType === "平行光") {
            light = new THREE.DirectionalLight(lightColor, intensity);
            light.position.set(5, 5, 5);
        } else if (lightType === "点光源") {
            light = new THREE.PointLight(lightColor, intensity);
            light.position.set(0, 5, 0);
        } else if (lightType === "聚光灯") {
            light = new THREE.SpotLight(lightColor, intensity);
            light.position.set(0, 5, 0);
            light.angle = Math.PI / 6;
        } else {
            console.error(`未知的光源类型: ${lightType}`);
            return '';
        }
        
        sceneData.scene.add(light);
        
        const lightId = `light${sceneData.nextLightId++}`;
        sceneData.lights.set(lightId, {
            light: light,
            type: lightType
        });
        
        return lightId;
    }

    setLightPosition(args) {
        const { lightId, x, y, z } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const lightData = sceneData.lights.get(lightId);
            if (lightData) {
                lightData.light.position.set(x, y, z);
                return;
            }
        }
    }

    enablePhysics(args) {
        const { sceneId, gravity } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        sceneData.physicsEnabled = true;
        sceneData.gravity = gravity;
    }

    checkCollision(args) {
        const { objId1, objId2 } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const obj1 = sceneData.objects.get(objId1);
            const obj2 = sceneData.objects.get(objId2);
            
            if (obj1 && obj2) {
                return this.checkCollisionBetween(obj1.mesh, obj2.mesh);
            }
        }
        
        return false;
    }
    
    getCameraPosition(args) {
        const { sceneId, axis } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return 0;
        }
        
        const camera = sceneData.camera;
        
        switch (axis) {
            case "X":
                return camera.position.x;
            case "Y":
                return camera.position.y;
            case "Z":
                return camera.position.z;
            default:
                return 0;
        }
    }

    getCameraPositionAll(args) {
        const { sceneId, coordType } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return "0,0,0";
        }
        
        const camera = sceneData.camera;
        const x = camera.position.x;
        const y = camera.position.y;
        const z = camera.position.z;
        
        switch (coordType) {
            case "X坐标":
                return x;
            case "Y坐标":
                return y;
            case "Z坐标":
                return z;
            case "X,Y,Z":
                return `${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)}`;
            default:
                return "0,0,0";
        }
    }

    applyForce(args) {
        const { objId, fx, fy, fz } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                if (!object.velocity) {
                    object.velocity = new THREE.Vector3();
                }
                object.velocity.x += fx;
                object.velocity.y += fy;
                object.velocity.z += fz;
                return;
            }
        }
    }

    setVelocity(args) {
        const { objId, vx, vy, vz } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                if (!object.velocity) {
                    object.velocity = new THREE.Vector3();
                }
                object.velocity.set(vx, vy, vz);
                return;
            }
        }
    }

    getObjectPosition(args) {
        const { objId, axis } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                if (axis === "X") return object.mesh.position.x;
                if (axis === "Y") return object.mesh.position.y;
                if (axis === "Z") return object.mesh.position.z;
            }
        }
        
        return 0;
    }

    getDistance(args) {
        const { objId1, objId2 } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const obj1 = sceneData.objects.get(objId1);
            const obj2 = sceneData.objects.get(objId2);
            
            if (obj1 && obj2) {
                const pos1 = new THREE.Vector3();
                const pos2 = new THREE.Vector3();
                obj1.mesh.getWorldPosition(pos1);
                obj2.mesh.getWorldPosition(pos2);
                return pos1.distanceTo(pos2);
            }
        }
        
        return 0;
    }

    whenObjectClicked(args) {
        return false;
    }

    whenObjectsCollide(args) {
        return false;
    }
}

if (typeof Scratch !== 'undefined') {
    Scratch.extensions.register(new PurpleYin3DThree());
} else {
    window.tempExt = {
        Extension: PurpleYin3DThree2
    };
}
