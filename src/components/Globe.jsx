import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

function Globe() {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Crear una esfera (el globo terráqueo)
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const texture = new THREE.TextureLoader().load('path-to-your-globe-texture.jpg'); // Añade tu textura de la Tierra aquí
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);

    scene.add(sphere);
    camera.position.z = 15;

    const animate = function () {
      requestAnimationFrame(animate);
      sphere.rotation.y += 0.005; // Rotación continua
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
}

export default Globe;
