import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import * as THREE from 'three';
import styles from './MacbookScene.module.css';

function useScrollRotation() {
  const [rotation, setRotation] = useState({ y: -0.3, x: 0.08 });

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const progress = Math.min(window.scrollY / 700, 1);
          setRotation({
            y: -0.3 + progress * 1.4,
            x: 0.08 - progress * 0.14,
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return rotation;
}

// Mesh name → part mapping (confirmed from runtime logs):
// Rectangle004 → screen display
// Rectangle003 → bottom chassis / body
// Object026    → keyboard surface
// Sphere001    → trackpad
// Cylinder007  → Touch Bar strip
// Object027    → hinge strip
// Plane006     → speaker grille area
// Object028    → front edge strip
// Object025    → webcam area

function MacbookMesh({ rotation }: { rotation: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null);

  // Load geometry + all textures — all inside Suspense so nothing renders until ready
  const obj = useLoader(OBJLoader, '/models/macbook/macbook.obj');
  const [
    screenTex,
    keyboardTex,
    touchpadTex,
    cameraTex,
    dotsTex,
  ] = useLoader(THREE.TextureLoader, [
    '/models/macbook/home_screen_diff.jpg',
    '/models/macbook/keyboard_diff.jpg',
    '/models/macbook/touchpad_diff.jpg',
    '/models/macbook/camera_diff.jpg',
    '/models/macbook/dots_mask.jpg',
  ]);

  const { size } = useThree();
  const scale = (size.width / 500) * 0.009;

  useEffect(() => {
    // OBJ UV origin is top-left; Three.js default is bottom-left
    [screenTex, keyboardTex, touchpadTex, cameraTex, dotsTex].forEach((t) => {
      t.flipY = false;
      t.needsUpdate = true;
    });

    obj.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      const name = mesh.name;

      let mat: THREE.MeshStandardMaterial;

      switch (name) {
        case 'Rectangle004':
          mat = new THREE.MeshStandardMaterial({
            map: screenTex,
            color: new THREE.Color('#ffffff'),
            metalness: 0.0,
            roughness: 0.05,
            envMapIntensity: 0.3,
          });
          break;
        case 'Rectangle003':
          mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#6e7080'),
            metalness: 0.88,
            roughness: 0.18,
            envMapIntensity: 1.3,
          });
          break;
        case 'Object026':
          mat = new THREE.MeshStandardMaterial({
            map: keyboardTex,
            color: new THREE.Color('#ffffff'),
            metalness: 0.1,
            roughness: 0.75,
            envMapIntensity: 0.6,
          });
          break;
        case 'Sphere001':
          mat = new THREE.MeshStandardMaterial({
            map: touchpadTex,
            color: new THREE.Color('#ffffff'),
            metalness: 0.55,
            roughness: 0.28,
            envMapIntensity: 1.0,
          });
          break;
        case 'Cylinder007':
          mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#111118'),
            metalness: 0.15,
            roughness: 0.9,
          });
          break;
        case 'Object027':
          mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#8a8a9a'),
            metalness: 0.9,
            roughness: 0.14,
            envMapIntensity: 1.3,
          });
          break;
        case 'Plane006':
        case 'Object028':
          mat = new THREE.MeshStandardMaterial({
            map: dotsTex,
            color: new THREE.Color('#6e7080'),
            metalness: 0.75,
            roughness: 0.3,
            envMapIntensity: 1.0,
          });
          break;
        case 'Object025':
          mat = new THREE.MeshStandardMaterial({
            map: cameraTex,
            color: new THREE.Color('#ffffff'),
            metalness: 0.2,
            roughness: 0.8,
          });
          break;
        default:
          mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#9090a0'),
            metalness: 0.85,
            roughness: 0.18,
            envMapIntensity: 1.2,
          });
      }

      mesh.material = mat;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
  }, [obj, screenTex, keyboardTex, touchpadTex, cameraTex, dotsTex]);

  // Smooth lerp toward scroll-driven target rotation
  const targetY = useRef(rotation.y);
  const targetX = useRef(rotation.x);
  useEffect(() => {
    targetY.current = rotation.y;
    targetX.current = rotation.x;
  }, [rotation]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += (targetY.current - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x += (targetX.current - groupRef.current.rotation.x) * 0.05;
    groupRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.04 - 0.2;
  });

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={obj} />
    </group>
  );
}

function Scene() {
  const rotation = useScrollRotation();

  return (
    <>
      <ambientLight intensity={1.0} />
      <directionalLight position={[6, 8, 5]} intensity={2.0} castShadow />
      <directionalLight position={[-5, 3, -4]} intensity={0.7} color="#a5b4fc" />
      <pointLight position={[0, 5, 3]} intensity={1.0} color="#e0e7ff" />
      <pointLight position={[3, -2, 2]} intensity={0.4} color="#c7d2fe" />
      <pointLight position={[-3, 2, 4]} intensity={0.5} color="#ffffff" />

      <Suspense fallback={null}>
        <MacbookMesh rotation={rotation} />
      </Suspense>
    </>
  );
}

export function MacbookScene() {
  return (
    <div className={styles.wrap}>
      <Canvas
        camera={{ position: [0, 0.4, 9], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
      <p className={styles.hint}>Scroll to rotate</p>
    </div>
  );
}
