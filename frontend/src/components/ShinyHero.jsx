import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// ...imports up top stay the same

useEffect(() => {
  // ...scene/camera/renderer setup stays the same

  const paintMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#1f3aff"),
    metalness: 0.75,
    roughness: 0.35,
    clearcoat: 0.65,
    clearcoatRoughness: 0.18,
    sheen: 0.35,
    sheenColor: new THREE.Color("#c8d0ff"),
    envMapIntensity: 0.9,
  });

  const buildText = (font) => {
    console.log("[ShinyHero] Font loaded OK");
    if (textRef.current) {
      scene.remove(textRef.current);
      textRef.current.geometry.dispose();
    }
    const geo = new TextGeometry("WASHUP", {
      font,
      size: 5,
      height: 0.6,
      curveSegments: 18,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 6,
    });
    geo.computeBoundingBox?.();
    geo.center();
    const mesh = new THREE.Mesh(geo, paintMat);
    mesh.rotation.x = -0.08;
    scene.add(mesh);
    textRef.current = mesh;
  };

  const buildFallback = (err) => {
    console.warn("[ShinyHero] Font failed to load → using fallback box", err);
    const g = new THREE.BoxGeometry(12, 3.2, 0.8);
    const m = new THREE.Mesh(g, paintMat);
    scene.add(m);
    textRef.current = m;
  };

  // 🔴 THIS is the path your server must serve
  const fontUrl = process.env.PUBLIC_URL + "/fonts/helvetiker_bold.typeface.json";

  // try local first; if it fails, try CDN once
  const loader = new FontLoader();
  loader.load(
    fontUrl,
    (font) => buildText(font),
    undefined,
    () => {
      // second chance: CDN
      loader.load(
        "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json",
        (font) => buildText(font),
        undefined,
        (err) => buildFallback(err)
      );
    }
  );

  // ...rest of your listeners / animate() / cleanup stays the same
}, []);
