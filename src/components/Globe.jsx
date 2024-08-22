import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

function Globe() {
  const mountRef = useRef(null);

  useEffect(() => {
    let width = mountRef.current.clientWidth;
    let height = mountRef.current.clientHeight;

    // Crear escena, cámara y renderizador
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Shaders GLSL (Vertex Shader y Fragment Shader)
    const vertexShader = `
      varying vec2 vUv;
      varying float noise;
      varying float qnoise;
      varying float displacement;

      uniform float time;
      uniform float pointscale;
      uniform float decay;
      uniform float complex;
      uniform float waves;
      uniform float eqcolor;
      uniform bool fragment;

      float turbulence(vec3 p) {
        float t = -0.1;
        for (float f = 1.0; f <= 3.0; f++) {
          float power = pow(2.0, f);
          t += abs(pnoise(vec3(power * p), vec3(10.0, 10.0, 10.0)) / power);
        }
        return t;
      }

      void main() {
        vUv = uv;
        noise = (1.0 * -waves) * turbulence(decay * abs(normal + time));
        qnoise = (2.0 * -eqcolor) * turbulence(decay * abs(normal + time));
        float b = pnoise(complex * (position) + vec3(1.0 * time), vec3(100.0));

        if (fragment == true) {
          displacement = -sin(noise) + normalize(b * 0.5);
        } else {
          displacement = -sin(noise) + cos(b * 0.5);
        }

        vec3 newPosition = (position) + (normal * displacement);
        gl_Position = (projectionMatrix * modelViewMatrix) * vec4(newPosition, 1.0);
        gl_PointSize = (pointscale);
      }
    `;

    const fragmentShader = `
      varying float qnoise;
      uniform float time;
      uniform bool redhell;

      void main() {
        float r, g, b;

        if (!redhell == true) {
          r = cos(qnoise + 0.5);
          g = cos(qnoise - 0.5);
          b = 0.0;
        } else {
          r = cos(qnoise + 0.5);
          g = cos(qnoise - 0.5);
          b = abs(qnoise);
        }
        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `;

    // Uniforms para los shaders
    const uniforms = {
      time: { value: 0.0 },
      pointscale: { value: 1.0 },
      decay: { value: 0.5 },
      complex: { value: 0.4 },
      waves: { value: 5.0 },
      eqcolor: { value: 10.0 },
      fragment: { value: true },
      redhell: { value: true }
    };

    // Material con shaders
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      wireframe: false
    });

    // Geometría y Mesh
    const geometry = new THREE.IcosahedronBufferGeometry(3, 7);
    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);

    // Configurar cámara
    camera.position.z = 10;

    // Animación
    const animate = function () {
      requestAnimationFrame(animate);

      // Animar valores uniformes
      uniforms.time.value += 0.01;

      mesh.rotation.x += 0.005;
      mesh.rotation.y += 0.005;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup cuando el componente se desmonte
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div style={{ width: '100%', height: '100vh' }} ref={mountRef}></div>;
}

export default Globe;
