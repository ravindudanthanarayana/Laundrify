import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      el.clientWidth / 400,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(el.clientWidth, 400);
    el.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({
      color: 0x00aaff,
      metalness: 0.7,
      roughness: 0.3,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(3, 2, 4);
    scene.add(light);

    camera.position.z = 4;

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => el.removeChild(renderer.domElement);
  }, []);

  return <div ref={mountRef}></div>;
};

export default ThreeScene;
