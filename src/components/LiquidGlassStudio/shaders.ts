/**
 * Liquid Glass Studio GLSL 300 es Shaders
 * Snell's law refraction, RGB dispersion, SDF smin fluid fusion, Fresnel and Glare
 * Adapted from iyinchao/liquid-glass-studio
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

    // object-fit: cover correct derivation
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

export const blurFragmentShader = `#version 300 es
precision highp float;

in vec2 v_uv;
uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform vec2 u_direction;
uniform float u_blurRadius;
out vec4 fragColor;

// 9-tap Gaussian blur weights
const float weights[5] = float[](0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);

void main() {
    vec2 texOffset = (u_direction * u_blurRadius) / u_resolution;
    vec4 col = texture(u_image, v_uv) * weights[0];
    for (int i = 1; i < 5; i++) {
        vec2 offset = float(i) * texOffset;
        col += texture(u_image, v_uv + offset) * weights[i];
        col += texture(u_image, v_uv - offset) * weights[i];
    }
    fragColor = col;
}
`

export const mainFragmentShader = `#version 300 es
precision highp float;

in vec2 v_uv;
uniform sampler2D u_bg;
uniform sampler2D u_blurredBg;
uniform vec2 u_resolution;

// Spring Mouse Cursor Drop
uniform vec2 u_springMouse;
uniform float u_cursorRadius;
uniform float u_cursorEnabled;
uniform float u_mergeRate;

// Physical Optical Parameters
uniform float u_refFactor;
uniform float u_refThickness;
uniform float u_dispersion;
uniform float u_fresnelFactor;
uniform float u_glareAngle;
uniform float u_glareConvergence;
uniform float u_glareOpposite;
uniform float u_overLight;

// Registered Elements (up to 24 buttons / cards)
#define MAX_ELEMENTS 24
uniform int u_elementCount;
uniform vec4 u_elements[MAX_ELEMENTS]; // x, y, halfW, halfH in WebGL pixel coords
uniform float u_elementRadius[MAX_ELEMENTS];
uniform float u_elementActive[MAX_ELEMENTS];

out vec4 fragColor;

// 2D SDF for rounded rectangle
float sdRoundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + vec2(r);
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

// 2D SDF for circle
float sdCircle(vec2 p, float r) {
    return length(p) - r;
}

// Inigo Quilez smooth minimum (fluid drop bridging)
float smin(float a, float b, float k) {
    if (k <= 0.001) return min(a, b);
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * k * 0.25;
}

// Safe arcsin
float safeAsin(float x) {
    return asin(clamp(x, -1.0, 1.0));
}

// Scene Distance Field
float sceneSDF(vec2 p) {
    float d = 1e6;
    for (int i = 0; i < MAX_ELEMENTS; i++) {
        if (i >= u_elementCount) break;
        if (u_elementActive[i] < 0.5) continue;
        vec2 center = u_elements[i].xy;
        vec2 halfSize = u_elements[i].zw;
        float r = u_elementRadius[i];
        float bDist = sdRoundedBox(p - center, halfSize, r);
        d = min(d, bDist);
    }

    if (u_cursorEnabled > 0.5) {
        float dCursor = sdCircle(p - u_springMouse, u_cursorRadius);
        d = smin(d, dCursor, u_mergeRate);
    }

    return d;
}

// Normal gradient using central differences
vec2 getNormal(vec2 p) {
    float eps = 1.0;
    float dx = sceneSDF(p + vec2(eps, 0.0)) - sceneSDF(p - vec2(eps, 0.0));
    float dy = sceneSDF(p + vec2(0.0, eps)) - sceneSDF(p - vec2(0.0, eps));
    vec2 n = vec2(dx, dy);
    float len = length(n);
    return len > 1e-4 ? n / len : vec2(0.0);
}

void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = fragCoord / u_resolution;
    float d = sceneSDF(fragCoord);

    // Outside the glass: render background + subtle elevation contact drop shadow
    if (d > 0.0) {
        float shadowDist = 20.0;
        float shadow = smoothstep(0.0, shadowDist, d);
        vec4 bg = texture(u_bg, uv);
        fragColor = bg * (0.86 + 0.14 * shadow);
        return;
    }

    // Inside the glass
    float depth = -d;
    vec2 normal = getNormal(fragCoord);

    // Snell's Law Bezel Refraction
    float x_R_ratio = clamp(1.0 - depth / max(u_refThickness, 1.0), 0.0, 1.0);
    float thetaI = safeAsin(pow(x_R_ratio, 2.0));
    float thetaT = safeAsin((1.0 / max(u_refFactor, 1.001)) * sin(thetaI));
    float edgeFactor = -1.0 * tan(thetaT - thetaI);

    // Physical RGB Chromatic Dispersion
    float disp = u_dispersion * 0.06;
    float nR = 1.0 - disp;
    float nG = 1.0;
    float nB = 1.0 + disp;

    // UV displacement vector based on surface normal & edge factor
    vec2 dispVec = normal * (edgeFactor * u_refThickness / u_resolution);

    vec2 uvR = clamp(uv + dispVec * nR, 0.001, 0.999);
    vec2 uvG = clamp(uv + dispVec * nG, 0.001, 0.999);
    vec2 uvB = clamp(uv + dispVec * nB, 0.001, 0.999);

    // Sample background textures with dispersion
    vec4 blurR = texture(u_blurredBg, uvR);
    vec4 blurG = texture(u_blurredBg, uvG);
    vec4 blurB = texture(u_blurredBg, uvB);

    vec4 sharpR = texture(u_bg, uvR);
    vec4 sharpG = texture(u_bg, uvG);
    vec4 sharpB = texture(u_bg, uvB);

    // Frosted blend: near edge has higher crisp refraction, inner core is velvety smooth
    float blurMix = mix(0.70, 0.95, smoothstep(0.0, u_refThickness, depth));
    vec3 glassRgb = vec3(
        mix(sharpR.r, blurR.r, blurMix),
        mix(sharpG.g, blurG.g, blurMix),
        mix(sharpB.b, blurB.b, blurMix)
    );

    // Directional Glare & Light Convergence
    vec2 lightDir = normalize(vec2(cos(u_glareAngle), sin(u_glareAngle)));
    float NdotL = dot(normal, lightDir);

    float glare = pow(max(NdotL, 0.0), max(u_glareConvergence, 1.0)) * 0.75;
    float oppositeGlare = pow(max(-NdotL, 0.0), max(u_glareConvergence * 0.45, 2.0)) * u_glareOpposite * 0.35;

    // Fresnel Rim Highlight (high angle reflection at curved boundaries)
    float fresnel = pow(x_R_ratio, 2.6) * u_fresnelFactor;

    // Specular highlight component
    float specular = glare + oppositeGlare + fresnel;

    // Translucent glass body tint
    vec3 tint = u_overLight > 0.5 ? vec3(1.0, 1.0, 1.0) : vec3(0.92, 0.96, 1.0);
    float tintAlpha = u_overLight > 0.5 ? 0.08 : 0.06;

    vec3 finalRgb = mix(glassRgb, tint, tintAlpha) + vec3(specular);

    // Subtle edge rim definition
    float edgeDarken = smoothstep(0.0, 2.0, depth);
    finalRgb *= (0.88 + 0.12 * edgeDarken);

    fragColor = vec4(finalRgb, 1.0);
}
`
