#version 300 es
#ifdef GL_ES
precision mediump float;
#endif

// *** 默认变量 *** //
uniform bool byp; // 绕过标志，用于启用或禁用着色器效果
in vec2 vUv; // 传递给片段着色器的纹理坐标
out vec4 fragColor; // 输出片段颜色

uniform sampler2D tDiffuse;
// 取消注释，可以启用计时器
// uniform float time;

// *** 从这里开始编写你的代码 *** //
// 小地图左下xy
uniform float miniPosX;
uniform float miniPosY;
// 小地图长宽
uniform float w;
uniform float h;
uniform float padding;
uniform float zoomFactor; // 缩放因子
// 相机
uniform float camX;
uniform float camY;
// 边界 - 上下左右
uniform float bounds0;
uniform float bounds1;
uniform float bounds2;
uniform float bounds3;

/** 计算两点距离（返回在scratch舞台上的距离） */
float dis(vec2 p1, vec2 p2) {
    return distance(p1 * vec2(640.,360.), p2 * vec2(640.,360.));
}

// 地图pos映射到miniMap pos
vec2 mapToMiniMap(vec2 pos, vec2 mapSize, vec2 minimapSize) {
    return vec2(pos.x - bounds2, pos.y - bounds1) / mapSize * minimapSize;
}

const float epsilon = 0.1;

bool isWhite(vec4 col) {
    if (abs(col.x - 1.0) < epsilon &&  
        abs(col.y - 1.0) < epsilon &&  
        abs(col.z - 1.0) < epsilon) return true;
    return false;
}

void main() {
    if (!byp) {
        // bool inMiniMap = dis(centerPos, vUv) < w * 0.75;
        // 检测是否在小地图内
        vec2 pad = vec2(padding / 640., padding / 360.);
        bool inMiniMap = vUv.x >= miniPosX - pad.x && vUv.x <= miniPosX + w + pad.x &&
        vUv.y >= miniPosY - pad.y && vUv.y <= miniPosY + h + pad.y;
        // 绘制小地图内容
        if (inMiniMap) {
            // 小地图长宽
            vec2 displaySize = vec2(w, h);
            // 小地图左下角
            vec2 miniPos = vec2(miniPosX, miniPosY);

            // 地图长宽
            vec2 mapSize = vec2(bounds3 - bounds2, bounds0 - bounds1);
            vec2 minimapSize = vec2(displaySize.x, mapSize.y / mapSize.x / 3.6 * 6.4 * displaySize.x);
            // 相机坐标
            vec2 player = mapToMiniMap(vec2(camX, camY), mapSize, minimapSize);
            
            vec2 minCam = displaySize * 0.5 / zoomFactor;
            vec2 maxCam = minimapSize - minCam;
            vec2 cam = vec2 (
                max(min(player.x, maxCam.x), minCam.x),
                max(min(player.y, maxCam.y), minCam.y)
            );

            // 矩形框中心
            vec2 centerPos = (miniPos * 2. + displaySize) / 2.;
            // 计算片段在矩形框内的局部坐标
            vec2 localCoord = miniPos + cam + (vUv - centerPos) / zoomFactor;

            // float disToPlayer = dis(miniPos + player, localCoord) * zoomFactor;
            // // 绘制绿色玩家标识圈
            // if (disToPlayer > 3.7 && disToPlayer < 5.) {
            //     fragColor = vec4(0.0, 1.0, 0.0, 1.0); // 绿色，不透明度为1
            // } else {
            // 输出缩放后的纹理颜色
            vec4 mapCol = texture(tDiffuse, localCoord);
            fragColor = mapCol;
            // vec4 defCol = texture(tDiffuse, vUv);
            // if (isWhite(mapCol) || isWhite(defCol)) fragColor = mapCol;
            // else fragColor = defCol;
            // }
        } else {
            // 其他内容
            fragColor = texture(tDiffuse, vUv);
        }
    } else {
        // 如果启用了绕过，使用原始纹理颜色
        fragColor = texture(tDiffuse, vUv);
    }
}