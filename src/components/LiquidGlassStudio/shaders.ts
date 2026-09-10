/**
 * Liquid Glass Studio GLSL 300 es Shaders
 * Official STEP 9 Production Pipeline from iyinchao/liquid-glass-studio
 * Includes LCH color conversions, Superellipse Squircle G2 curve, Snell's law dispersion,
 * bidirectional glare and physical directional shadow.
 */

export const vertexShader = `#version 300 es
in vec2 a_position;
out vec2 v_uv;

void main() {
    v_uv = (a_position + 1.0) * 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`

export const bgFragmentShader = `#version 300 es
precision highp float;

in vec2 v_uv;
uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform vec2 u_imageResolution;
out vec4 fragColor;

void main() {
    float screenAspect = u_resolution.x / u_resolution.y;
    float imgAspect = u_imageResolution.x / u_imageResolution.y;
    vec2 st = v_uv;

    if (screenAspect > imgAspect) {
        float ratio = imgAspect / screenAspect;
        st.y = (v_uv.y - 0.5) * ratio + 0.5;
    } else {
        float ratio = screenAspect / imgAspect;
        st.x = (v_uv.x - 0.5) * ratio + 0.5;
    }

    st = clamp(st, 0.001, 0.999);
    fragColor = texture(u_image, st);
}
`

export const vBlurFragmentShader = `#version 300 es
precision highp float;

#define MAX_BLUR_RADIUS (32)

in vec2 v_uv;
uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform int u_blurRadius;
uniform float u_blurWeights[MAX_BLUR_RADIUS + 1];

out vec4 fragColor;

void main() {
    vec2 texelSize = 1.0 / u_resolution;
    vec4 color = texture(u_image, v_uv) * u_blurWeights[0];
    int r = clamp(u_blurRadius, 1, MAX_BLUR_RADIUS);
    for (int i = 1; i <= MAX_BLUR_RADIUS; ++i) {
        if (i > r) break;
        float w = u_blurWeights[i];
        vec2 offset = vec2(0.0, float(i) * texelSize.y);
        color += texture(u_image, v_uv + offset) * w;
        color += texture(u_image, v_uv - offset) * w;
    }
    fragColor = color;
}
`

export const hBlurFragmentShader = `#version 300 es
precision highp float;

#define MAX_BLUR_RADIUS (32)

in vec2 v_uv;
uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform int u_blurRadius;
uniform float u_blurWeights[MAX_BLUR_RADIUS + 1];

out vec4 fragColor;

void main() {
    vec2 texelSize = 1.0 / u_resolution;
    vec4 color = texture(u_image, v_uv) * u_blurWeights[0];
    int r = clamp(u_blurRadius, 1, MAX_BLUR_RADIUS);
    for (int i = 1; i <= MAX_BLUR_RADIUS; ++i) {
        if (i > r) break;
        float w = u_blurWeights[i];
        vec2 offset = vec2(float(i) * texelSize.x, 0.0);
        color += texture(u_image, v_uv + offset) * w;
        color += texture(u_image, v_uv - offset) * w;
    }
    fragColor = color;
}
`

export const mainFragmentShader = `#version 300 es
precision highp float;

#define PI (3.14159265359)
#define MAX_ELEMENTS (24)

const float N_R = 1.0 - 0.02;
const float N_G = 1.0;
const float N_B = 1.0 + 0.02;

in vec2 v_uv;
uniform sampler2D u_blurredBg;
uniform sampler2D u_bg;
uniform vec2 u_resolution;
uniform float u_dpr;

// Cursor spring positions
uniform vec2 u_mouse;
uniform vec2 u_mouseSpring;
uniform float u_cursorRadius;
uniform float u_cursorEnabled;
uniform float u_mergeRate;

// Official Studio physical parameters
uniform float u_refThickness;
uniform float u_refDistance;
uniform float u_refFactor;
uniform float u_refDispersion;
uniform float u_refFresnelRange;
uniform float u_refFresnelFactor;
uniform float u_refFresnelHardness;
uniform float u_glareRange;
uniform float u_glareConvergence;
uniform float u_glareOppositeFactor;
uniform float u_glareFactor;
uniform float u_glareHardness;
uniform float u_glareAngle;
uniform int u_blurEdge;
uniform vec4 u_tint;

// Physical shadow
uniform float u_shadowExpand;
uniform float u_shadowFactor;
uniform vec2 u_shadowPosition;

// Shape controls
uniform float u_shapeRoundness;

// Registered DOM elements
uniform int u_elementCount;
uniform vec4 u_elements[MAX_ELEMENTS]; // center.x, center.y, width, height (in pixels)
uniform float u_elementRadius[MAX_ELEMENTS];
uniform float u_elementActive[MAX_ELEMENTS];

out vec4 fragColor;

// ========================================================
// Math & Color Space Libs (from liquid-glass-studio)
// ========================================================

float safeAsin(float x) {
    return asin(clamp(x, -1.0, 1.0));
}

float vec2ToAngle(vec2 v) {
    float angle = atan(v.y, v.x);
    if (angle < 0.0) angle += 2.0 * PI;
    return angle;
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

const vec3 D65_WHITE = vec3(0.95045592705, 1.0, 1.08905775076);
const mat3 RGB_TO_XYZ_M = mat3(
    0.4124, 0.3576, 0.1805,
    0.2126, 0.7152, 0.0722,
    0.0193, 0.1192, 0.9505
);
const mat3 XYZ_TO_RGB_M = mat3(
    3.2406255, -1.537208, -0.4986286,
    -0.9689307, 1.8757561, 0.0415175,
    0.0557101, -0.2040211, 1.0569959
);

float UNCOMPAND_SRGB(float a) {
    return a > 0.04045 ? pow((a + 0.055) / 1.055, 2.4) : a / 12.92;
}
float COMPAND_RGB(float a) {
    return a <= 0.0031308 ? 12.92 * a : 1.055 * pow(a, 0.41666666666) - 0.055;
}
vec3 SRGB_TO_RGB(vec3 srgb) {
    return vec3(UNCOMPAND_SRGB(srgb.x), UNCOMPAND_SRGB(srgb.y), UNCOMPAND_SRGB(srgb.z));
}
vec3 RGB_TO_SRGB(vec3 rgb) {
    return vec3(COMPAND_RGB(rgb.x), COMPAND_RGB(rgb.y), COMPAND_RGB(rgb.z));
}
vec3 RGB_TO_XYZ(vec3 rgb) {
    return rgb * RGB_TO_XYZ_M;
}
vec3 SRGB_TO_XYZ(vec3 srgb) {
    return RGB_TO_XYZ(SRGB_TO_RGB(srgb));
}
float XYZ_TO_LAB_F(float x) {
    return x > 0.00885645167 ? pow(x, 0.333333333) : 7.78703703704 * x + 0.13793103448;
}
vec3 XYZ_TO_LAB(vec3 xyz) {
    vec3 xyz_scaled = xyz / D65_WHITE;
    xyz_scaled = vec3(
        XYZ_TO_LAB_F(xyz_scaled.x),
        XYZ_TO_LAB_F(xyz_scaled.y),
        XYZ_TO_LAB_F(xyz_scaled.z)
    );
    return vec3(
        116.0 * xyz_scaled.y - 16.0,
        500.0 * (xyz_scaled.x - xyz_scaled.y),
        200.0 * (xyz_scaled.y - xyz_scaled.z)
    );
}
vec3 SRGB_TO_LAB(vec3 srgb) {
    return XYZ_TO_LAB(SRGB_TO_XYZ(srgb));
}
vec3 LAB_TO_LCH(vec3 Lab) {
    return vec3(Lab.x, sqrt(dot(Lab.yz, Lab.yz)), atan(Lab.z, Lab.y) * 57.2957795131);
}
vec3 SRGB_TO_LCH(vec3 srgb) {
    return LAB_TO_LCH(SRGB_TO_LAB(srgb));
}
vec3 XYZ_TO_RGB_FUNC(vec3 xyz) {
    return xyz * XYZ_TO_RGB_M;
}
vec3 XYZ_TO_SRGB(vec3 xyz) {
    return RGB_TO_SRGB(XYZ_TO_RGB_FUNC(xyz));
}
float LAB_TO_XYZ_F(float x) {
    return x > 0.206897 ? x * x * x : 0.12841854934 * (x - 0.137931034);
}
vec3 LAB_TO_XYZ(vec3 Lab) {
    float w = (Lab.x + 16.0) / 116.0;
    return D65_WHITE * vec3(LAB_TO_XYZ_F(w + Lab.y / 500.0), LAB_TO_XYZ_F(w), LAB_TO_XYZ_F(w - Lab.z / 200.0));
}
vec3 LAB_TO_SRGB(vec3 lab) {
    return XYZ_TO_SRGB(LAB_TO_XYZ(lab));
}
vec3 LCH_TO_LAB(vec3 LCh) {
    return vec3(LCh.x, LCh.y * cos(LCh.z * 0.01745329251), LCh.y * sin(LCh.z * 0.01745329251));
}
vec3 LCH_TO_SRGB(vec3 lch) {
    return LAB_TO_SRGB(LCH_TO_LAB(lch));
}

// ========================================================
// SDF Functions (Squircle & Smooth Minimum)
// ========================================================

float sdCircle(vec2 p, float r) {
    return length(p) - r;
}

float superellipseCornerSDF(vec2 p, float r, float n) {
    p = abs(p);
    float v = pow(pow(p.x, n) + pow(p.y, n), 1.0 / n);
    return v - r;
}

float roundedRectSDF(vec2 p, vec2 center, float width, float height, float cornerRadius, float n) {
    p -= center;
    float cr = cornerRadius;
    vec2 d = abs(p) - vec2(width, height) * 0.5;

    float dist;
    if (d.x > -cr && d.y > -cr) {
        vec2 cornerCenter = sign(p) * (vec2(width, height) * 0.5 - vec2(cr));
        vec2 cornerP = p - cornerCenter;
        dist = superellipseCornerSDF(cornerP, cr, n);
    } else {
        dist = min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
    }
    return dist;
}

float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

// Combined Scene SDF in normalized screen height units
float mainSDF(vec2 pPixels) {
    float d = 1e6;

    for (int i = 0; i < MAX_ELEMENTS; i++) {
        if (i >= u_elementCount) break;
        if (u_elementActive[i] < 0.5) continue;

        vec2 center = u_elements[i].xy;
        vec2 size = u_elements[i].zw;
        float radius = u_elementRadius[i];

        // Apple Squircle G2 curvature rounded rect
        float bDist = roundedRectSDF(pPixels, center, size.x, size.y, radius, u_shapeRoundness);
        d = min(d, bDist);
    }

    if (u_cursorEnabled > 0.5) {
        float dCursor = sdCircle(pPixels - u_mouseSpring, u_cursorRadius * u_dpr);
        d = smin(d, dCursor, u_mergeRate * u_resolution.y);
    }

    // Convert pixel distance to normalized screen height units to match Studio shaders
    return d / u_resolution.y;
}

vec2 getNormal(vec2 p) {
    float eps = 1.0;
    float dx = (mainSDF(p + vec2(eps, 0.0)) - mainSDF(p - vec2(eps, 0.0))) * (u_resolution.y / (2.0 * eps));
    float dy = (mainSDF(p + vec2(0.0, eps)) - mainSDF(p - vec2(0.0, eps))) * (u_resolution.y / (2.0 * eps));
    vec2 grad = vec2(dx, dy);
    float len = length(grad);
    return len > 0.0001 ? grad / len : vec2(0.0);
}

vec4 getTextureDispersion(
    sampler2D tex1,
    sampler2D tex2,
    float mixRate,
    vec2 offset,
    float factor
) {
    vec4 pixel = vec4(1.0);

    vec2 uvR = clamp(v_uv + offset * (1.0 - (N_R - 1.0) * factor), 0.001, 0.999);
    vec2 uvG = clamp(v_uv + offset * (1.0 - (N_G - 1.0) * factor), 0.001, 0.999);
    vec2 uvB = clamp(v_uv + offset * (1.0 - (N_B - 1.0) * factor), 0.001, 0.999);

    float bgR = texture(tex1, uvR).r;
    float bgG = texture(tex1, uvG).g;
    float bgB = texture(tex1, uvB).b;

    float blurR = texture(tex2, uvR).r;
    float blurG = texture(tex2, uvG).g;
    float blurB = texture(tex2, uvB).b;

    pixel.r = mix(bgR, blurR, mixRate);
    pixel.g = mix(bgG, blurG, mixRate);
    pixel.b = mix(bgB, blurB, mixRate);

    return pixel;
}

// ========================================================
// Main Fragment Execution (STEP 9 Production Pipeline)
// ========================================================

void main() {
    vec2 u_resolution1x = u_resolution.xy / u_dpr;
    float merged = mainSDF(gl_FragCoord.xy);
    vec4 outColor = vec4(0.0);

    if (merged < 0.005) {
        float nmerged = -1.0 * (merged * u_resolution1x.y);

        // 1. Calculate refraction edge factor:
        float x_R_ratio = 1.0 - nmerged / u_refThickness;
        float thetaI = safeAsin(pow(x_R_ratio, 2.0));
        float thetaT = safeAsin(1.0 / u_refFactor * sin(thetaI));
        float edgeFactor = -1.0 * tan(thetaT - thetaI);
        if (nmerged >= u_refThickness) {
            edgeFactor = 0.0;
        }

        if (edgeFactor <= 0.0) {
            outColor = texture(u_blurredBg, v_uv);
            outColor = mix(outColor, vec4(u_tint.rgb, 1.0), u_tint.a * 0.8);
        } else {
            float edgeH = nmerged / u_refThickness;
            vec2 normal = getNormal(gl_FragCoord.xy);

            // 2. High-precision RGB dispersion with wavelength refraction
            vec4 blurredPixel = getTextureDispersion(
                u_bg,
                u_blurredBg,
                u_blurEdge > 0 ? 1.0 : edgeH,
                -normal * edgeFactor * u_refDistance * u_dpr * vec2(
                    u_resolution.y / (u_resolution1x.x * u_dpr),
                    1.0
                ),
                u_refDispersion
            );

            // Base tint
            outColor = mix(blurredPixel, vec4(u_tint.rgb, 1.0), u_tint.a * 0.8);

            // 3. Add High-angle Fresnel rim reflection (LCH boosted)
            float fresnelFactor = clamp(
                pow(
                    1.0 + merged * u_resolution1x.y / 1500.0 * pow(500.0 / u_refFresnelRange, 2.0) + u_refFresnelHardness,
                    5.0
                ),
                0.0,
                1.0
            );

            vec3 fresnelTintLCH = SRGB_TO_LCH(
                mix(vec3(1.0), vec3(u_tint.rgb), u_tint.a * 0.5)
            );
            fresnelTintLCH.x += 20.0 * fresnelFactor * u_refFresnelFactor;
            fresnelTintLCH.x = clamp(fresnelTintLCH.x, 0.0, 100.0);

            outColor = mix(
                outColor,
                vec4(LCH_TO_SRGB(fresnelTintLCH), 1.0),
                fresnelFactor * u_refFresnelFactor * 0.7 * length(normal)
            );

            // 4. Add Directional Glare with LCH Specular Luminance
            float glareGeoFactor = clamp(
                pow(
                    1.0 + merged * u_resolution1x.y / 1500.0 * pow(500.0 / u_glareRange, 2.0) + u_glareHardness,
                    5.0
                ),
                0.0,
                1.0
            );

            float glareAngle = (vec2ToAngle(normalize(normal)) - PI / 4.0 + u_glareAngle) * 2.0;
            int glareFarside = 0;
            if (
                glareAngle > PI * (2.0 - 0.5) && glareAngle < PI * (4.0 - 0.5) ||
                glareAngle < PI * (0.0 - 0.5)
            ) {
                glareFarside = 1;
            }

            float glareAngleFactor =
                (0.5 + sin(glareAngle) * 0.5) *
                (glareFarside == 1 ? 1.2 * u_glareOppositeFactor : 1.2) *
                u_glareFactor;
            glareAngleFactor = clamp(pow(glareAngleFactor, 0.1 + u_glareConvergence * 2.0), 0.0, 1.0);

            vec3 glareTintLCH = SRGB_TO_LCH(
                mix(blurredPixel.rgb, vec3(u_tint.rgb), u_tint.a * 0.5)
            );
            glareTintLCH.x += 150.0 * glareAngleFactor * glareGeoFactor;
            glareTintLCH.y += 30.0 * glareAngleFactor * glareGeoFactor;
            glareTintLCH.x = clamp(glareTintLCH.x, 0.0, 120.0);

            outColor = mix(
                outColor,
                vec4(LCH_TO_SRGB(glareTintLCH), 1.0),
                glareAngleFactor * glareGeoFactor * length(normal)
            );
        }
    } else {
        // Outside the shape: evaluate physical directional shadow beneath glass
        vec2 shadowCoord = gl_FragCoord.xy - u_shadowPosition * u_dpr;
        float shadowMerged = mainSDF(shadowCoord);
        float shadowN = -1.0 * (shadowMerged * u_resolution1x.y);

        vec4 bgCol = texture(u_bg, v_uv);
        if (shadowMerged < 0.0 && u_shadowFactor > 0.0) {
            float sDist = smoothstep(0.0, u_shadowExpand, shadowN);
            float sFactor = (1.0 - sDist) * u_shadowFactor;
            bgCol.rgb = mix(bgCol.rgb, vec3(0.0), sFactor);
        }
        outColor = bgCol;
    }

    // 5. Smooth anti-aliased edge blend
    outColor = mix(outColor, texture(u_bg, v_uv), smoothstep(-0.001, 0.001, merged));

    fragColor = outColor;
}
`
