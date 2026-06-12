uniform float uTime;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;
varying float vDisplacement;

void main() {
  // flat face normal using derivatives
  vec3 dX = dFdx(vPosition);
  vec3 dY = dFdy(vPosition);
  vec3 flatNormal = normalize(cross(dX, dY));

  // Valleys: Abyssal cosmic black-blue
  vec3 deepBlue  = vec3(6.0 / 255.0, 10.0 / 255.0, 24.0 / 255.0);
  vec3 lightCyan = vec3(12.0 / 255.0, 85.0 / 255.0, 90.0 / 255.0);
  vec3 moonLight  = vec3(0.0 / 255.0, 240.0 / 255.0, 255.0 / 255.0);

  float t = vDisplacement * 0.8 + 0.5;
  vec3 color = mix(lightCyan, deepBlue, t);

  // calculating view direction
  vec3 viewDir = normalize(cameraPosition - vPosition);

  // fresnel effect
  float fresnel = 1.0 - max(dot(flatNormal, viewDir), 0.0);
  fresnel = pow(fresnel, 4.0);
  color = mix(color, moonLight, fresnel * 0.4);

  // ambient lighting
  vec3 lightDir = normalize(vec3(5.0, 10.0, 5.0));
  float lighting = max(dot(flatNormal, lightDir), 0.0);
  color += vec3(0.15) * lighting;

  gl_FragColor = vec4(color, 1.0);
}
