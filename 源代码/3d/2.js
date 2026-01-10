const yin_3d_extensionId = "Yin3DThree3";

let threeDScenes = new Map();
let threeJsLoaded = false;
let cannonJsLoaded = false;

class PurpleYin3DThree3 {
    constructor(runtime) {
        this.runtime = runtime;
        this.currentSceneId = "default";
        this.isIntegrated = false;
        this.showCollisionBoxes = false;
        this.collisionTypes = new Map();
        this.physicsWorlds = new Map();
    }

    getInfo() {
        return {
            id: yin_3d_extensionId,
            name: "[3D扩展]",
            blockIconURI: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjMmQyZDMwIi8+CjxwYXRoIGQ9Ik0zMiAxMkMyMS4wNyAxMiAxMiAyMS4wNyAxMiAzMkMxMiA0Mi45MyAyMS4wNyA1MiAzMiA1MkM0Mi45MyA1MiA1MiA0Mi45MyA1MiAzMkM1MiAyMS4wNyA0Mi45MyAxMiAzMiAxMloiIGZpbGw9IiNBMDUyMkQiLz4KPHBhdGggZD0iTTM0IDI2SDUwVjM4SDM0VjI2WiIgZmlsbD0iI0ZGRjhGMyIvPgo8cGF0aCBkPSJNMTQgMjZIMzBWMzhIMTRWMjZaIiBmaWxsPSIjRkZGOEYzIi8+CjxwYXRoIGQ9Ik0zNCA0Mkg1MFY1NEgzNFY0MloiIGZpbGw9IiNGRkY4RjMiLz4KPHBhdGggZD0iTTE0IDQySDMwVjU0SDE0VjQyWiIgZmlsbD0iI0ZGRjhGMyIvPgo8L3N2Zz4K",
            menuIconURI: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjOEI0NTEzIi8+CjxwYXRoIGQ9Ik0zMiAxMkMyMS4wNyAxMiAxMiAyMS4wNyAxMiAzMkMxMiA0Mi45MyAyMS4wNyA1MiAzMiA1MkM0Mi45MyA1MiA1MiA0Mi45MyA1MiAzMkM1MiAyMS4wNyA0Mi45MyAxMiAzMiAxMloiIGZpbGw9IiNBMDUyMkQiLz4KPHBhdGggZD0iTTM0IDI2SDUwVjM4SDM0VjI2WiIgZmlsbD0iI0ZGRjhGMyIvPgo8cGF0aCBkPSJNMTQgMjZIMzBWMzhIMTRWMjZaIiBmaWxsPSIjRkZGOEYzIi8+CjxwYXRoIGQ9Ik0zNCA0Mkg1MFY1NEgzNFY0MloiIGZpbGw9IiNGRkY4RjMiLz4KPHBhdGggZD0iTTE0IDQySDMwVjU0SDE0VjQyWiIgZmlsbD0iI0ZGRjhGMyIvPgo8L3N2Zz4K",
            color1: "#2d2d30",
            color2: "#454545",
            color3: "#A9A9A9",
            blocks: [
                {
                    blockType: "button",
                    text: "📖 3D扩展使用说明",
                    func: "docs"
                },
                {
                    blockType: "button",
                    text: "版本 1.3.0 - 高级碰撞版",
                    func: "version"
                },
                "---"+"初始化",
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
                "---"+"场景设置",
                {
                    opcode: "set3DContainerStyle",
                    blockType: "command",
                    text: "设置3D容器样式 [sceneId] 位置 [position] 大小 [size] 层级 [zindex]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        position: {
                            type: "string",
                            menu: "positionMenu"
                        },
                        size: {
                            type: "string",
                            menu: "sizeMenu"
                        },
                        zindex: {
                            type: "number",
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: "toggle3DVisibility",
                    blockType: "command",
                    text: "设置3D场景 [sceneId] 可见性 [visible]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        visible: {
                            type: "string",
                            menu: "booleanMenu"
                        }
                    }
                },
                {
                    opcode: "set3DOpacity",
                    blockType: "command",
                    text: "设置3D场景 [sceneId] 透明度 [opacity]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        opacity: {
                            type: "number",
                            defaultValue: 1,
                            min: 0,
                            max: 1
                        }
                    }
                },
                {
                    opcode: "set3DSize",
                    blockType: "command",
                    text: "设置3D场景 [sceneId] 大小 宽度 [width] 高度 [height]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        width: {
                            type: "number",
                            defaultValue: 50
                        },
                        height: {
                            type: "number",
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: "set3DPosition",
                    blockType: "command",
                    text: "设置3D场景 [sceneId] 位置 x [x] y [y]",
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
                        }
                    }
                },
                "---"+"物体",
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
                "---"+"雾",
                {
                    opcode: "setFog",
                    blockType: "command",
                    text: "设置雾 [sceneId] 颜色 [color] 初始距离 [near] 雾效距离 [far]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        color: {
                            type: "string",
                            defaultValue: "#FFFFFF"
                        },
                        near: {
                            type: "number",
                            defaultValue: 10
                        },
                        far: {
                            type: "number",
                            defaultValue: 10
                        }
                    }
                },
                "---"+"碰撞系统优化",
                {
                    opcode: "setCollisionType",
                    blockType: "command",
                    text: "设置对象 [objId] 碰撞类型为 [collisionType]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        collisionType: {
                            type: "string",
                            menu: "collisionTypeMenu"
                        }
                    }
                },
                {
                    opcode: "setCollisionBox",
                    blockType: "command",
                    text: "设置对象 [objId] 碰撞箱大小 x [width] y [height] z [depth]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        width: {
                            type: "number",
                            defaultValue: 1
                        },
                        height: {
                            type: "number",
                            defaultValue: 1
                        },
                        depth: {
                            type: "number",
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: "setCollisionSphere",
                    blockType: "command",
                    text: "设置对象 [objId] 球形碰撞半径 [radius]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        radius: {
                            type: "number",
                            defaultValue: 0.5
                        }
                    }
                },
                {
                    opcode: "setCollisionCylinder",
                    blockType: "command",
                    text: "设置对象 [objId] 圆柱碰撞半径 [radius] 高度 [height]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        radius: {
                            type: "number",
                            defaultValue: 0.5
                        },
                        height: {
                            type: "number",
                            defaultValue: 2
                        }
                    }
                },
                {
                    opcode: "enableCollisionVisualization",
                    blockType: "command",
                    text: "显示碰撞箱 [sceneId] 可见性 [visible]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        visible: {
                            type: "string",
                            menu: "booleanMenu"
                        }
                    }
                },
                {
                    opcode: "setCollisionOffset",
                    blockType: "command",
                    text: "设置碰撞箱偏移 [objId] x [x] y [y] z [z]",
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
                    opcode: "setCollisionGroup",
                    blockType: "command",
                    text: "设置碰撞组 [objId] 组编号 [group] 掩码 [mask]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        group: {
                            type: "number",
                            defaultValue: 1,
                            min: 1,
                            max: 32
                        },
                        mask: {
                            type: "number",
                            defaultValue: 1,
                            min: 1,
                            max: 32
                        }
                    }
                },
                {
                    opcode: "raycastFromCamera",
                    blockType: "reporter",
                    text: "从相机发射射线 [sceneId] 距离 [distance]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        },
                        distance: {
                            type: "number",
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: "raycastFromObject",
                    blockType: "reporter",
                    text: "从对象发射射线 [objId] 方向 x [dx] y [dy] z [dz] 距离 [distance]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        dx: {
                            type: "number",
                            defaultValue: 0
                        },
                        dy: {
                            type: "number",
                            defaultValue: 0
                        },
                        dz: {
                            type: "number",
                            defaultValue: -1
                        },
                        distance: {
                            type: "number",
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: "getCollisionNormal",
                    blockType: "reporter",
                    text: "获取碰撞 [objId1] 和 [objId2] 的法线 [axis]",
                    arguments: {
                        objId1: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        objId2: {
                            type: "string",
                            defaultValue: "obj2"
                        },
                        axis: {
                            type: "string",
                            menu: "axisMenu"
                        }
                    }
                },
                {
                    opcode: "isPointInsideObject",
                    blockType: "Boolean",
                    text: "点 [x] [y] [z] 是否在对象 [objId] 内",
                    arguments: {
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
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        }
                    }
                },
                {
                    opcode: "setCollisionResponse",
                    blockType: "command",
                    text: "设置碰撞响应 [objId] 弹性 [bounce] 摩擦 [friction]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        bounce: {
                            type: "number",
                            defaultValue: 0.3,
                            min: 0,
                            max: 1
                        },
                        friction: {
                            type: "number",
                            defaultValue: 0.3,
                            min: 0,
                            max: 1
                        }
                    }
                },
                "---"+"高级物理",
                {
                    opcode: "loadPhysicsEngine",
                    blockType: "command",
                    text: "加载高级物理引擎 [sceneId]",
                    arguments: {
                        sceneId: {
                            type: "string",
                            defaultValue: "default"
                        }
                    }
                },
                {
                    opcode: "addRigidBody",
                    blockType: "command",
                    text: "添加刚体 [objId] 质量 [mass]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        mass: {
                            type: "number",
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: "setRigidBodyType",
                    blockType: "command",
                    text: "设置刚体类型 [objId] 类型 [bodyType]",
                    arguments: {
                        objId: {
                            type: "string",
                            defaultValue: "obj1"
                        },
                        bodyType: {
                            type: "string",
                            menu: "bodyTypeMenu"
                        }
                    }
                },
                "---"+"对象设置",
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
                "---"+"材质",
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
                "---"+"光",
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
                "---"+"物理",
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
                "---"+"文字",
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
                "---"+"hat",
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
                    items: ["环境光", "平行光", "点光源", "聚光灯"]
                },
                materialTypes: {
                    acceptReporters: true,
                    items: ["标准材质", "物理材质", "基础材质", "线框材质", "发光材质"]
                },
                axisMenu: {
                    acceptReporters: true,
                    items: ["X", "Y", "Z"]
                },
                coordMenu: {
                    acceptReporters: true,
                    items: ["X坐标", "Y坐标", "Z坐标", "X,Y,Z"]
                },
                booleanMenu: {
                    acceptReporters: true,
                    items: ["显示", "隐藏"]
                },
                positionMenu: {
                    acceptReporters: true,
                    items: ["背景层", "前景层", "覆盖层"]
                },
                sizeMenu: {
                    acceptReporters: true,
                    items: ["全屏", "半屏", "小窗口"]
                },
                collisionTypeMenu: {
                    acceptReporters: true,
                    items: ["AABB盒子", "球形", "圆柱形", "精确网格", "胶囊体", "无碰撞"]
                },
                bodyTypeMenu: {
                    acceptReporters: true,
                    items: ["动态刚体", "静态刚体", "运动刚体"]
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
    
    create3DContainer() {
        if (this.isIntegrated) return this.threeDContainer;
        
        let stageContainer = null;
        
        if (this.runtime && this.runtime.renderer && this.runtime.renderer.canvas) {
            const canvas = this.runtime.renderer.canvas;
            stageContainer = canvas.parentElement;
        }
        
        if (!stageContainer) {
            const canvases = document.getElementsByTagName('canvas');
            for (let canvas of canvases) {
                if (canvas.width > 200 && canvas.height > 200) {
                    stageContainer = canvas.parentElement;
                    break;
                }
            }
        }
        
        if (!stageContainer) {
            const possibleSelectors = [
                '.stage-wrapper',
                '.gui_stage-wrapper',
                '.stage',
                '[class*="stage"]',
                '.react-stage'
            ];
            
            for (const selector of possibleSelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    stageContainer = element;
                    break;
                }
            }
        }
        
        if (!stageContainer) {
            stageContainer = document.body;
            console.warn('未找到舞台容器，将3D场景添加到body');
        }
        
        const threeDContainer = document.createElement('div');
        threeDContainer.className = 'scratch-3d-container';
        threeDContainer.id = 'scratch-3d-container-' + Date.now();
        
        threeDContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
        `;
        
        if (stageContainer.style.position === 'static' || !stageContainer.style.position) {
            stageContainer.style.position = 'relative';
        }
        
        stageContainer.appendChild(threeDContainer);
        
        this.stageContainer = stageContainer;
        this.threeDContainer = threeDContainer;
        this.isIntegrated = true;
        
        console.log('3D容器创建成功，已添加到舞台');
        return threeDContainer;
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
        
    initScene(args) {
        const { sceneId } = args;
        
        const container = this.create3DContainer();
        
        this.loadThreeJS(() => {
            if (!threeJsLoaded) {
                console.error('Three.js 加载失败');
                return;
            }

            if (threeDScenes.has(sceneId)) {
                console.warn(`3D场景 ${sceneId} 已存在`);
                return;
            }

            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x87CEEB);

            const width = container.clientWidth || 480;
            const height = container.clientHeight || 360;

            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            camera.position.set(0, 5, 10);
            camera.lookAt(0, 0, 0);

            const renderer = new THREE.WebGLRenderer({ 
                antialias: true,
                alpha: true,
                preserveDrawingBuffer: true
            });
            
            renderer.setSize(width, height);
            renderer.setClearColor(0x000000, 0);
            
            renderer.domElement.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 0;
            `;
            
            container.appendChild(renderer.domElement);

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
                collisionPairs: new Set(),
                showCollisionBoxes: false,
                collisionHelpers: [],
                physicsWorld: null,
                rigidBodies: new Map(),
                octree: null
            };

            threeDScenes.set(sceneId, sceneData);
            this.currentSceneId = sceneId;

            this.setupEventListeners(sceneId);
            this.animateScene(sceneId);
            this.setupResizeObserver(sceneId, container);

            console.log(`3D场景 ${sceneId} 初始化完成`);
        });
    }

    set3DContainerStyle(args) {
        const { sceneId, position, size, zindex } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        const container = sceneData.container;
        
        switch (position) {
            case "背景层":
                container.style.zIndex = "0";
                container.style.pointerEvents = "none";
                break;
            case "前景层":
                container.style.zIndex = "5";
                container.style.pointerEvents = "auto";
                break;
            case "覆盖层":
                container.style.zIndex = "10";
                container.style.pointerEvents = "auto";
                break;
        }
        
        switch (size) {
            case "全屏":
                container.style.width = "100%";
                container.style.height = "100%";
                break;
            case "半屏":
                container.style.width = "50%";
                container.style.height = "50%";
                container.style.left = "25%";
                container.style.top = "25%";
                break;
            case "小窗口":
                container.style.width = "30%";
                container.style.height = "30%";
                container.style.left = "35%";
                container.style.top = "35%";
                break;
        }
        
        if (zindex !== undefined) {
            container.style.zIndex = zindex.toString();
        }
        
        if (sceneData.renderer) {
            const width = container.clientWidth;
            const height = container.clientHeight;
            sceneData.camera.aspect = width / height;
            sceneData.camera.updateProjectionMatrix();
            sceneData.renderer.setSize(width, height);
        }
    }

    toggle3DVisibility(args) {
        const { sceneId, visible } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        const isVisible = visible === "显示";
        sceneData.container.style.display = isVisible ? 'block' : 'none';
    }

    set3DOpacity(args) {
        const { sceneId, opacity } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        sceneData.container.style.opacity = Math.max(0, Math.min(1, opacity));
    }

    setupEventListeners(sceneId) {
        const sceneData = threeDScenes.get(sceneId);
        if (!sceneData) return;

        const onMouseClick = (event) => {
            try {
                sceneData.renderer.domElement.style.pointerEvents = 'auto';
                
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
                
                setTimeout(() => {
                    sceneData.renderer.domElement.style.pointerEvents = 'none';
                }, 100);
            } catch (error) {
                console.error('点击事件处理错误:', error);
                sceneData.renderer.domElement.style.pointerEvents = 'none';
            }
        };

        sceneData.renderer.domElement.addEventListener('click', onMouseClick);
        sceneData.clickHandler = onMouseClick;
    }

    setupResizeObserver(sceneId, container) {
        const sceneData = threeDScenes.get(sceneId);
        if (!sceneData || !container) return;

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

        resizeObserver.observe(container);
        sceneData.resizeObserver = resizeObserver;
    }

    animateScene(sceneId) {
        const sceneData = threeDScenes.get(sceneId);
        if (!sceneData) return;

        const animate = () => {
            if (!threeDScenes.has(sceneId)) return;
            
            requestAnimationFrame(animate);
            
            if (sceneData.physicsEnabled) {
                this.updatePhysics(sceneId);
            }
            
            this.checkAllCollisions(sceneId);
            
            this.updateFollowingObjects(sceneId);
            
            sceneData.renderer.render(sceneData.scene, sceneData.camera);
        };
        animate();
    }

    updatePhysics(sceneId) {
        const sceneData = threeDScenes.get(sceneId);
        if (!sceneData) return;

        if (sceneData.physicsWorld) {
            sceneData.physicsWorld.step(1/60);
            
            sceneData.rigidBodies.forEach((body, objId) => {
                const object = sceneData.objects.get(objId);
                if (object && object.updatePhysics) {
                    object.updatePhysics();
                }
            });
        } else {
            sceneData.objects.forEach((object) => {
                if (object.velocity) {
                    object.mesh.position.x += object.velocity.x * 0.016;
                    object.mesh.position.y += object.velocity.y * 0.016;
                    object.mesh.position.z += object.velocity.z * 0.016;
                    
                    if (object.mesh.position.y > 0) {
                        object.velocity.y -= sceneData.gravity * 0.016;
                    } else {
                        object.mesh.position.y = 0;
                        object.velocity.y = 0;
                    }
                }
            });
        }
    }

    updateFollowingObjects(sceneId) {
        const sceneData = threeDScenes.get(sceneId);
        if (!sceneData) return;

        sceneData.objects.forEach((object, objId) => {
            if (object.followCamera && object.followCamera.active) {
                const { distance } = object.followCamera;
                
                const cameraDirection = new THREE.Vector3();
                sceneData.camera.getWorldDirection(cameraDirection);
                
                const targetPosition = new THREE.Vector3()
                    .copy(sceneData.camera.position)
                    .add(cameraDirection.multiplyScalar(distance));
                
                object.mesh.position.copy(targetPosition);
                object.mesh.lookAt(sceneData.camera.position);
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

    // ========== 优化的碰撞系统 ==========
    
    loadPhysicsEngine(args) {
        const { sceneId } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        if (typeof CANNON === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/cannon.js/0.20.0/cannon.min.js';
            
            script.onload = () => {
                cannonJsLoaded = true;
                this.setupPhysicsWorld(sceneId);
                console.log('Cannon.js 物理引擎加载成功');
            };
            
            script.onerror = () => {
                console.warn('Cannon.js 加载失败，使用简易物理引擎');
            };
            
            document.head.appendChild(script);
        } else {
            this.setupPhysicsWorld(sceneId);
        }
    }
    
    setupPhysicsWorld(sceneId) {
        if (!cannonJsLoaded) return;
        
        const sceneData = threeDScenes.get(sceneId);
        if (!sceneData) return;
        
        const world = new CANNON.World();
        world.gravity.set(0, -9.82, 0);
        world.broadphase = new CANNON.NaiveBroadphase();
        
        sceneData.physicsWorld = world;
        sceneData.rigidBodies = new Map();
        
        console.log(`场景 ${sceneId} 物理引擎初始化完成`);
    }
    
    addRigidBody(args) {
        const { objId, mass } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (!object) continue;
            
            if (!sceneData.physicsWorld) {
                console.warn(`场景 ${sceneId} 未启用物理引擎`);
                return;
            }
            
            const mesh = object.mesh;
            let shape;
            const collisionType = this.collisionTypes.get(objId) || 'AABB盒子';
            
            switch(collisionType) {
                case '球形':
                    shape = new CANNON.Sphere(object.collisionRadius || 1);
                    break;
                case '圆柱形':
                    shape = new CANNON.Cylinder(
                        object.collisionRadius || 1,
                        object.collisionRadius || 1,
                        object.collisionHeight || 2,
                        8
                    );
                    break;
                case '胶囊体':
                    const cylinder = new CANNON.Cylinder(0.5, 0.5, 1, 8);
                    const sphere = new CANNON.Sphere(0.5);
                    const compound = new CANNON.CompoundBody();
                    compound.addShape(cylinder);
                    compound.addShape(sphere, new CANNON.Vec3(0, 0.5, 0));
                    compound.addShape(sphere, new CANNON.Vec3(0, -0.5, 0));
                    shape = compound;
                    break;
                case '精确网格':
                    shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
                    break;
                case 'AABB盒子':
                default:
                    shape = new CANNON.Box(new CANNON.Vec3(
                        (object.collisionWidth || 1) / 2,
                        (object.collisionHeight || 1) / 2,
                        (object.collisionDepth || 1) / 2
                    ));
            }
            
            const body = new CANNON.Body({
                mass: mass,
                position: new CANNON.Vec3(
                    mesh.position.x,
                    mesh.position.y,
                    mesh.position.z
                ),
                shape: shape
            });
            
            if (object.bounce !== undefined) body.restitution = object.bounce;
            if (object.friction !== undefined) body.friction = object.friction;
            if (object.collisionGroup !== undefined) body.collisionFilterGroup = object.collisionGroup;
            if (object.collisionMask !== undefined) body.collisionFilterMask = object.collisionMask;
            
            sceneData.physicsWorld.addBody(body);
            sceneData.rigidBodies.set(objId, body);
            
            object.rigidBody = body;
            object.updatePhysics = () => {
                mesh.position.copy(body.position);
                mesh.quaternion.copy(body.quaternion);
            };
            
            console.log(`为对象 ${objId} 添加刚体，质量: ${mass}`);
            break;
        }
    }
    
    setCollisionType(args) {
        const { objId, collisionType } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                this.collisionTypes.set(objId, collisionType);
                
                if (sceneData.showCollisionBoxes) {
                    this.updateCollisionVisualization(sceneId, objId, collisionType, object);
                }
                
                console.log(`对象 ${objId} 碰撞类型设置为: ${collisionType}`);
                return;
            }
        }
        
        console.warn(`未找到对象: ${objId}`);
    }
    
    setCollisionBox(args) {
        const { objId, width, height, depth } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                object.collisionWidth = width;
                object.collisionHeight = height;
                object.collisionDepth = depth;
                
                this.collisionTypes.set(objId, 'AABB盒子');
                
                if (object.rigidBody && sceneData.physicsWorld) {
                    const body = object.rigidBody;
                    const newShape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2));
                    body.shapes = [newShape];
                    body.updateMassProperties();
                }
                
                if (sceneData.showCollisionBoxes) {
                    this.updateCollisionVisualization(sceneId, objId, 'AABB盒子', object);
                }
                
                return;
            }
        }
    }
    
    setCollisionSphere(args) {
        const { objId, radius } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                object.collisionRadius = radius;
                this.collisionTypes.set(objId, '球形');
                
                if (object.rigidBody && sceneData.physicsWorld) {
                    const body = object.rigidBody;
                    const newShape = new CANNON.Sphere(radius);
                    body.shapes = [newShape];
                    body.updateMassProperties();
                }
                
                if (sceneData.showCollisionBoxes) {
                    this.updateCollisionVisualization(sceneId, objId, '球形', object);
                }
                
                return;
            }
        }
    }
    
    setCollisionCylinder(args) {
        const { objId, radius, height } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                object.collisionRadius = radius;
                object.collisionHeight = height;
                this.collisionTypes.set(objId, '圆柱形');
                
                if (object.rigidBody && sceneData.physicsWorld) {
                    const body = object.rigidBody;
                    const newShape = new CANNON.Cylinder(radius, radius, height, 8);
                    body.shapes = [newShape];
                    body.updateMassProperties();
                }
                
                if (sceneData.showCollisionBoxes) {
                    this.updateCollisionVisualization(sceneId, objId, '圆柱形', object);
                }
                
                return;
            }
        }
    }
    
    enableCollisionVisualization(args) {
        const { sceneId, visible } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        const isVisible = visible === "显示";
        sceneData.showCollisionBoxes = isVisible;
        
        if (sceneData.collisionHelpers) {
            sceneData.collisionHelpers.forEach(helper => {
                sceneData.scene.remove(helper);
            });
            sceneData.collisionHelpers = [];
        }
        
        if (isVisible) {
            sceneData.collisionHelpers = [];
            sceneData.objects.forEach((object, objId) => {
                const collisionType = this.collisionTypes.get(objId) || 'AABB盒子';
                this.updateCollisionVisualization(sceneId, objId, collisionType, object);
            });
        }
        
        console.log(`碰撞箱可视化: ${isVisible ? '开启' : '关闭'}`);
    }
    
    updateCollisionVisualization(sceneId, objId, collisionType, object) {
        const sceneData = threeDScenes.get(sceneId);
        if (!sceneData || !sceneData.showCollisionBoxes) return;
        
        if (object.collisionHelper) {
            sceneData.scene.remove(object.collisionHelper);
            const index = sceneData.collisionHelpers.indexOf(object.collisionHelper);
            if (index > -1) {
                sceneData.collisionHelpers.splice(index, 1);
            }
        }
        
        let helper;
        const color = 0x00ff00;
        
        switch(collisionType) {
            case '球形':
                const radius = object.collisionRadius || 1;
                helper = new THREE.Mesh(
                    new THREE.SphereGeometry(radius, 16, 16),
                    new THREE.MeshBasicMaterial({
                        color: color,
                        wireframe: true,
                        transparent: true,
                        opacity: 0.3
                    })
                );
                break;
                
            case '圆柱形':
                const cylRadius = object.collisionRadius || 0.5;
                const cylHeight = object.collisionHeight || 2;
                helper = new THREE.Mesh(
                    new THREE.CylinderGeometry(cylRadius, cylRadius, cylHeight, 8),
                    new THREE.MeshBasicMaterial({
                        color: color,
                        wireframe: true,
                        transparent: true,
                        opacity: 0.3
                    })
                );
                break;
                
            case 'AABB盒子':
            default:
                const width = object.collisionWidth || 1;
                const height = object.collisionHeight || 1;
                const depth = object.collisionDepth || 1;
                helper = new THREE.Mesh(
                    new THREE.BoxGeometry(width, height, depth),
                    new THREE.MeshBasicMaterial({
                        color: color,
                        wireframe: true,
                        transparent: true,
                        opacity: 0.3
                    })
                );
        }
        
        helper.position.copy(object.mesh.position);
        helper.rotation.copy(object.mesh.rotation);
        
        if (object.collisionOffset) {
            helper.position.add(object.collisionOffset);
        }
        
        sceneData.scene.add(helper);
        sceneData.collisionHelpers.push(helper);
        object.collisionHelper = helper;
    }
    
    setCollisionOffset(args) {
        const { objId, x, y, z } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                object.collisionOffset = new THREE.Vector3(x, y, z);
                
                if (sceneData.showCollisionBoxes && object.collisionHelper) {
                    object.collisionHelper.position.copy(object.mesh.position);
                    object.collisionHelper.position.add(object.collisionOffset);
                }
                
                return;
            }
        }
    }
    
    setCollisionGroup(args) {
        const { objId, group, mask } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                object.collisionGroup = group;
                object.collisionMask = mask;
                
                if (object.rigidBody) {
                    object.rigidBody.collisionFilterGroup = group;
                    object.rigidBody.collisionFilterMask = mask;
                }
                
                return;
            }
        }
    }
    
    setCollisionResponse(args) {
        const { objId, bounce, friction } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                object.bounce = bounce;
                object.friction = friction;
                
                if (object.rigidBody) {
                    object.rigidBody.restitution = bounce;
                    object.rigidBody.friction = friction;
                }
                
                return;
            }
        }
    }

    setRigidBodyType(args) {
        const { objId, bodyType } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (!object || !object.rigidBody) continue;
            
            const body = object.rigidBody;
            
            switch(bodyType) {
                case '静态刚体':
                    body.mass = 0;
                    body.type = CANNON.Body.STATIC;
                    break;
                case '运动刚体':
                    body.mass = 1;
                    body.type = CANNON.Body.KINEMATIC;
                    break;
                case '动态刚体':
                default:
                    body.mass = body.mass || 1;
                    body.type = CANNON.Body.DYNAMIC;
            }
            
            body.updateMassProperties();
            console.log(`对象 ${objId} 刚体类型设置为: ${bodyType}`);
            break;
        }
    }

    // ========== 增强的碰撞检测 ==========
    
    checkCollisionBetween(mesh1, mesh2) {
        const objId1 = this.findObjectIdByMesh(mesh1);
        const objId2 = this.findObjectIdByMesh(mesh2);
        
        if (!objId1 || !objId2) return false;
        
        const type1 = this.collisionTypes.get(objId1) || 'AABB盒子';
        const type2 = this.collisionTypes.get(objId2) || 'AABB盒子';
        
        if (type1 === '无碰撞' || type2 === '无碰撞') {
            return false;
        }
        
        const sceneData = this.findSceneDataByMesh(mesh1);
        if (sceneData) {
            const obj1 = sceneData.objects.get(objId1);
            const obj2 = sceneData.objects.get(objId2);
            
            if (obj1 && obj2 && obj1.collisionGroup && obj2.collisionGroup) {
                if (!(obj1.collisionGroup & obj2.collisionMask) || 
                    !(obj2.collisionGroup & obj1.collisionMask)) {
                    return false;
                }
            }
        }
        
        return this.detectCollision(mesh1, mesh2, type1, type2);
    }
    
    detectCollision(mesh1, mesh2, type1, type2) {
        mesh1.updateMatrixWorld(true);
        mesh2.updateMatrixWorld(true);
        
        const box1 = new THREE.Box3().setFromObject(mesh1);
        const box2 = new THREE.Box3().setFromObject(mesh2);
        
        if (!box1.intersectsBox(box2)) {
            return false;
        }
        
        if (type1 === '球形' || type2 === '球形') {
            return this.sphereCollisionTest(mesh1, mesh2, type1, type2);
        } else if (type1 === '圆柱形' || type2 === '圆柱形') {
            return this.cylinderCollisionTest(mesh1, mesh2, type1, type2);
        } else if (type1 === '精确网格' || type2 === '精确网格') {
            return this.meshCollisionTest(mesh1, mesh2);
        } else {
            return box1.intersectsBox(box2);
        }
    }
    
    sphereCollisionTest(mesh1, mesh2, type1, type2) {
        const pos1 = new THREE.Vector3();
        const pos2 = new THREE.Vector3();
        
        mesh1.getWorldPosition(pos1);
        mesh2.getWorldPosition(pos2);
        
        let radius1 = 1;
        let radius2 = 1;
        
        if (type1 === '球形') {
            const objId = this.findObjectIdByMesh(mesh1);
            const sceneData = this.findSceneDataByMesh(mesh1);
            if (sceneData && objId) {
                const obj = sceneData.objects.get(objId);
                radius1 = obj.collisionRadius || 1;
            }
        } else {
            mesh1.geometry.computeBoundingSphere();
            mesh1.geometry.boundingSphere.clone().applyMatrix4(mesh1.matrixWorld);
            radius1 = mesh1.geometry.boundingSphere.radius;
        }
        
        if (type2 === '球形') {
            const objId = this.findObjectIdByMesh(mesh2);
            const sceneData = this.findSceneDataByMesh(mesh2);
            if (sceneData && objId) {
                const obj = sceneData.objects.get(objId);
                radius2 = obj.collisionRadius || 1;
            }
        } else {
            mesh2.geometry.computeBoundingSphere();
            mesh2.geometry.boundingSphere.clone().applyMatrix4(mesh2.matrixWorld);
            radius2 = mesh2.geometry.boundingSphere.radius;
        }
        
        const distance = pos1.distanceTo(pos2);
        const minDistance = radius1 + radius2;
        
        return distance <= minDistance;
    }
    
    cylinderCollisionTest(mesh1, mesh2, type1, type2) {
        const box1 = new THREE.Box3().setFromObject(mesh1);
        const box2 = new THREE.Box3().setFromObject(mesh2);
        return box1.intersectsBox(box2);
    }
    
    meshCollisionTest(mesh1, mesh2) {
        const box1 = new THREE.Box3().setFromObject(mesh1, true);
        const box2 = new THREE.Box3().setFromObject(mesh2, true);
        return box1.intersectsBox(box2);
    }
    
    findObjectIdByMesh(mesh) {
        for (const [sceneId, sceneData] of threeDScenes) {
            for (const [objId, object] of sceneData.objects) {
                if (object.mesh === mesh) {
                    return objId;
                }
            }
        }
        return null;
    }
    
    findSceneDataByMesh(mesh) {
        for (const [sceneId, sceneData] of threeDScenes) {
            for (const [objId, object] of sceneData.objects) {
                if (object.mesh === mesh) {
                    return sceneData;
                }
            }
        }
        return null;
    }

    // ========== 射线检测 ==========
    
    raycastFromCamera(args) {
        const { sceneId, distance } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return "";
        }
        
        const raycaster = new THREE.Raycaster();
        const camera = sceneData.camera;
        
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        
        const collidableObjects = [];
        sceneData.objects.forEach((object, objId) => {
            const collisionType = this.collisionTypes.get(objId);
            if (collisionType !== '无碰撞') {
                collidableObjects.push(object.mesh);
            }
        });
        
        const intersects = raycaster.intersectObjects(collidableObjects);
        
        if (intersects.length > 0) {
            const intersect = intersects[0];
            const objId = this.findObjectIdByMesh(intersect.object);
            return `{object: ${objId}, distance: ${intersect.distance.toFixed(2)}}`;
        }
        
        return "未命中";
    }
    
    raycastFromObject(args) {
        const { objId, dx, dy, dz, distance } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (!object) continue;
            
            const raycaster = new THREE.Raycaster();
            const direction = new THREE.Vector3(dx, dy, dz).normalize();
            
            const origin = new THREE.Vector3().copy(object.mesh.position);
            raycaster.set(origin, direction);
            
            const collidableObjects = [];
            sceneData.objects.forEach((obj, id) => {
                if (id !== objId) {
                    const collisionType = this.collisionTypes.get(id);
                    if (collisionType !== '无碰撞') {
                        collidableObjects.push(obj.mesh);
                    }
                }
            });
            
            const intersects = raycaster.intersectObjects(collidableObjects, false);
            
            if (intersects.length > 0 && intersects[0].distance <= distance) {
                const intersect = intersects[0];
                const hitObjId = this.findObjectIdByMesh(intersect.object);
                return `{object: ${hitObjId}, distance: ${intersect.distance.toFixed(2)}}`;
            }
            
            break;
        }
        
        return "未命中";
    }
    
    isPointInsideObject(args) {
        const { x, y, z, objId } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (!object) continue;
            
            const point = new THREE.Vector3(x, y, z);
            const mesh = object.mesh;
            
            mesh.updateMatrixWorld(true);
            
            const box = new THREE.Box3().setFromObject(mesh);
            
            if (box.containsPoint(point)) {
                const collisionType = this.collisionTypes.get(objId) || 'AABB盒子';
                
                switch(collisionType) {
                    case '球形':
                        const center = new THREE.Vector3();
                        mesh.getWorldPosition(center);
                        const radius = object.collisionRadius || 1;
                        return point.distanceTo(center) <= radius;
                        
                    case 'AABB盒子':
                    default:
                        return true;
                }
            }
            
            break;
        }
        
        return false;
    }
    
    getCollisionNormal(args) {
        const { objId1, objId2, axis } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const obj1 = sceneData.objects.get(objId1);
            const obj2 = sceneData.objects.get(objId2);
            
            if (obj1 && obj2) {
                const pos1 = new THREE.Vector3();
                const pos2 = new THREE.Vector3();
                
                obj1.mesh.getWorldPosition(pos1);
                obj2.mesh.getWorldPosition(pos2);
                
                const normal = new THREE.Vector3()
                    .subVectors(pos1, pos2)
                    .normalize();
                
                switch(axis) {
                    case "X":
                        return normal.x.toFixed(2);
                    case "Y":
                        return normal.y.toFixed(2);
                    case "Z":
                        return normal.z.toFixed(2);
                    default:
                        return 0;
                }
            }
        }
        
        return 0;
    }

    // ========== 原有方法保持不变 ==========
    
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
            
            if (objData.collisionHelper) {
                sceneData.scene.remove(objData.collisionHelper);
            }
        });
        sceneData.objects.clear();
        sceneData.clickableObjects = [];
        sceneData.collisionPairs.clear();
        sceneData.collisionHelpers = [];
        
        sceneData.lights.forEach((lightData) => {
            sceneData.scene.remove(lightData.light);
        });
        sceneData.lights.clear();
        
        sceneData.nextObjectId = 1;
        sceneData.nextLightId = 1;
        
        this.collisionTypes.clear();
        
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
        
        sceneData.camera.translateZ(distance);
    }

    cameraMoveLeft(args) {
        const { sceneId, distance } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        sceneData.camera.translateX(-distance);
    }

    cameraMoveRight(args) {
        const { sceneId, distance } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        sceneData.camera.translateX(distance);
    }

    cameraMoveUp(args) {
        const { sceneId, distance } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        sceneData.camera.translateY(distance);
    }
    
    cameraMoveDown(args) {
        const { sceneId, distance } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        sceneData.camera.translateY(-distance);
    }

    cameraRotateLeft(args) {
        const { sceneId, angle } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        sceneData.camera.rotation.y += THREE.MathUtils.degToRad(angle);
    }

    cameraRotateRight(args) {
        const { sceneId, angle } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        sceneData.camera.rotation.y -= THREE.MathUtils.degToRad(angle);
    }

    cameraRotateUp(args) {
        const { sceneId, angle } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        sceneData.camera.rotation.x += THREE.MathUtils.degToRad(angle);
    }

    cameraRotateDown(args) {
        const { sceneId, angle } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        sceneData.camera.rotation.x -= THREE.MathUtils.degToRad(angle);
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

    // 创建物体的私有方法
    _createGeometry(args, geometryType) {
        const { sceneId, x, y, z, color } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return '';
        }

        let geometry;
        let size = 1;
        
        switch(geometryType) {
            case 'cube':
                size = args.size || 1;
                geometry = new THREE.BoxGeometry(size, size, size);
                break;
            case 'sphere':
                const radius = args.radius || 1;
                geometry = new THREE.SphereGeometry(radius, 32, 32);
                size = radius;
                break;
            case 'cylinder':
                const cylRadius = args.radius || 0.5;
                const cylHeight = args.height || 2;
                geometry = new THREE.CylinderGeometry(cylRadius, cylRadius, cylHeight, 32);
                size = Math.max(cylRadius, cylHeight/2);
                break;
            case 'cone':
                const coneRadius = args.radius || 1;
                const coneHeight = args.height || 2;
                geometry = new THREE.ConeGeometry(coneRadius, coneHeight, 32);
                size = Math.max(coneRadius, coneHeight/2);
                break;
            case 'torus':
                const torusRadius = args.radius || 2;
                const tube = args.tube || 0.5;
                geometry = new THREE.TorusGeometry(torusRadius, tube, 16, 100);
                size = torusRadius + tube;
                break;
            case 'plane':
                const width = args.width || 10;
                const height = args.height || 10;
                geometry = new THREE.PlaneGeometry(width, height);
                size = Math.max(width, height);
                break;
            default:
                console.error(`未知的几何类型: ${geometryType}`);
                return '';
        }

        const material = new THREE.MeshStandardMaterial({ 
            color: new THREE.Color(color),
            roughness: 0.4,
            metalness: 0.1
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        
        sceneData.scene.add(mesh);
        
        const objectId = `obj${sceneData.nextObjectId++}`;
        sceneData.objects.set(objectId, {
            mesh: mesh,
            type: geometryType,
            material: material,
            geometry: geometry,
            velocity: null,
            collisionWidth: size,
            collisionHeight: size,
            collisionDepth: size
        });
        
        this.collisionTypes.set(objectId, 'AABB盒子');
        
        sceneData.clickableObjects.push(mesh);
        
        return objectId;
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

    setFog(args) {
        const { sceneId, color, near, far } = args;
        const sceneData = threeDScenes.get(sceneId);

        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return '';
        }

        sceneData.scene.fog = new THREE.Fog(color, near, far);
    }

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
        
        object.mesh.lookAt(sceneData.camera.position);
    }

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
        
        const cameraDirection = new THREE.Vector3();
        sceneData.camera.getWorldDirection(cameraDirection);
        
        const targetPosition = new THREE.Vector3()
            .copy(sceneData.camera.position)
            .add(cameraDirection.multiplyScalar(distance));
        
        object.mesh.position.copy(targetPosition);
        object.mesh.lookAt(sceneData.camera.position);
    }

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
        
        object.followCamera = {
            sceneId: sceneId,
            distance: distance,
            active: true
        };
        
        console.log(`开始物体 ${objId} 持续跟随相机`);
    }

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
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            const fontSize = Math.max(32, size * 32);
            const padding = 10;
            
            context.font = `bold ${fontSize}px Arial`;
            const textMetrics = context.measureText(text);
            const textWidth = textMetrics.width;
            
            canvas.width = textWidth + padding * 2;
            canvas.height = fontSize + padding * 2;
            
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            context.font = `bold ${fontSize}px Arial`;
            context.fillStyle = color;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(text, canvas.width / 2, canvas.height / 2);
            
            context.strokeStyle = '#000000';
            context.lineWidth = 2;
            context.strokeText(text, canvas.width / 2, canvas.height / 2);
            
            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            
            const aspectRatio = canvas.width / canvas.height;
            const geometry = new THREE.PlaneGeometry(size * aspectRatio, size);
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide
            });
            
            const textMesh = new THREE.Mesh(geometry, material);
            textMesh.position.set(x, y, z);
            
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

    setTextContent(args) {
        const { objId, text } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object && object.type === 'text') {
                const context = object.context;
                const canvas = object.canvas;
                
                context.clearRect(0, 0, canvas.width, canvas.height);
                
                const fontSize = Math.max(32, object.size * 32);
                context.font = `bold ${fontSize}px Arial`;
                const textMetrics = context.measureText(text);
                const textWidth = textMetrics.width;
                
                const padding = 10;
                const newWidth = textWidth + padding * 2;
                if (newWidth !== canvas.width) {
                    canvas.width = newWidth;
                    canvas.height = fontSize + padding * 2;
                    
                    const aspectRatio = canvas.width / canvas.height;
                    object.geometry.dispose();
                    object.geometry = new THREE.PlaneGeometry(object.size * aspectRatio, object.size);
                    object.mesh.geometry = object.geometry;
                }
                
                context.font = `bold ${fontSize}px Arial`;
                context.fillStyle = object.color;
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText(text, canvas.width / 2, canvas.height / 2);
                
                context.strokeStyle = '#000000';
                context.lineWidth = 2;
                context.strokeText(text, canvas.width / 2, canvas.height / 2);
                
                object.texture.needsUpdate = true;
                object.text = text;
                
                return;
            }
        }
        
        console.warn(`未找到文字对象: ${objId}`);
    }

    setTextSize(args) {
        const { objId, size } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object && object.type === 'text') {
                const context = object.context;
                const canvas = object.canvas;
                
                const fontSize = Math.max(32, size * 32);
                context.font = `bold ${fontSize}px Arial`;
                const textMetrics = context.measureText(object.text);
                const textWidth = textMetrics.width;
                
                const padding = 10;
                canvas.width = textWidth + padding * 2;
                canvas.height = fontSize + padding * 2;
                
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.font = `bold ${fontSize}px Arial`;
                context.fillStyle = object.color;
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText(object.text, canvas.width / 2, canvas.height / 2);
                
                context.strokeStyle = '#000000';
                context.lineWidth = 2;
                context.strokeText(object.text, canvas.width / 2, canvas.height / 2);
                
                const aspectRatio = canvas.width / canvas.height;
                object.geometry.dispose();
                object.geometry = new THREE.PlaneGeometry(size * aspectRatio, size);
                object.mesh.geometry = object.geometry;
                
                object.texture.needsUpdate = true;
                object.size = size;
                
                return;
            }
        }
        
        console.warn(`未找到文字对象: ${objId}`);
    }

    setTextColor(args) {
        const { objId, color } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object && object.type === 'text') {
                const context = object.context;
                const canvas = object.canvas;
                
                const fontSize = Math.max(32, object.size * 32);
                
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.font = `bold ${fontSize}px Arial`;
                context.fillStyle = color;
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText(object.text, canvas.width / 2, canvas.height / 2);
                
                context.strokeStyle = '#000000';
                context.lineWidth = 2;
                context.strokeText(object.text, canvas.width / 2, canvas.height / 2);
                
                object.texture.needsUpdate = true;
                object.color = color;
                
                return;
            }
        }
        
        console.warn(`未找到文字对象: ${objId}`);
    }

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

    objectMoveForward(args) {
        const { objId, distance } = args;
        
        for (const [sceneId, sceneData] of threeDScenes) {
            const object = sceneData.objects.get(objId);
            if (object) {
                const direction = new THREE.Vector3(0, 0, -1);
                direction.applyQuaternion(object.mesh.quaternion);
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
                const direction = new THREE.Vector3(0, 0, 1);
                direction.applyQuaternion(object.mesh.quaternion);
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
                const direction = new THREE.Vector3(-1, 0, 0);
                direction.applyQuaternion(object.mesh.quaternion);
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
                const direction = new THREE.Vector3(1, 0, 0);
                direction.applyQuaternion(object.mesh.quaternion);
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
                const direction = new THREE.Vector3(0, 1, 0);
                direction.applyQuaternion(object.mesh.quaternion);
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
                const direction = new THREE.Vector3(0, -1, 0);
                direction.applyQuaternion(object.mesh.quaternion);
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
                
                for (const pair of sceneData.collisionPairs) {
                    if (pair.includes(objId)) {
                        sceneData.collisionPairs.delete(pair);
                    }
                }
                
                if (object.rigidBody && sceneData.physicsWorld) {
                    sceneData.physicsWorld.removeBody(object.rigidBody);
                    sceneData.rigidBodies.delete(objId);
                }
                
                if (object.collisionHelper) {
                    sceneData.scene.remove(object.collisionHelper);
                    const helperIndex = sceneData.collisionHelpers.indexOf(object.collisionHelper);
                    if (helperIndex > -1) {
                        sceneData.collisionHelpers.splice(helperIndex, 1);
                    }
                }
                
                this.collisionTypes.delete(objId);
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

    set3DSize(args) {
        const { sceneId, width, height } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        sceneData.container.style.width = `${width}%`;
        sceneData.container.style.height = `${height}%`;
        
        const containerWidth = sceneData.container.clientWidth;
        const containerHeight = sceneData.container.clientHeight;
        
        if (containerWidth > 0 && containerHeight > 0) {
            sceneData.camera.aspect = containerWidth / containerHeight;
            sceneData.camera.updateProjectionMatrix();
            sceneData.renderer.setSize(containerWidth, containerHeight);
        }
    }

    set3DPosition(args) {
        const { sceneId, x, y } = args;
        const sceneData = threeDScenes.get(sceneId);
        
        if (!sceneData) {
            console.error(`3D场景 ${sceneId} 不存在`);
            return;
        }
        
        sceneData.container.style.left = `${x}%`;
        sceneData.container.style.top = `${y}%`;
    }
}

// 它修改了Scratch的文件加载系统
class CustomFileLoader {
    supportFileTypes() {
        return ['python', 'json', 'glsl', 'obj', 'mtl', 'stl', 'gltf'];
    }
}

if (typeof Scratch !== 'undefined') {
    Scratch.extensions.register(new PurpleYin3DThree3());
} else {
    window.tempExt = {
        Extension: PurpleYin3DThree3
    };
}
