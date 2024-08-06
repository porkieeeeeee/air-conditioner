import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const Stones = () => {
  const { scene } = useGLTF("/models/stone/scene.gltf");
  const stoneRefs = [
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
  ];

  const applyTransformations = (
    ref: React.RefObject<THREE.Group>,
    rotation: THREE.Euler,
    position: THREE.Vector3,
    scale: THREE.Vector3
  ) => {
    if (ref.current) {
      ref.current.rotation.set(rotation.x, rotation.y, rotation.z);
      ref.current.position.set(position.x, position.y, position.z);
      ref.current.scale.set(scale.x, scale.y, scale.z);
    }
  };

  useEffect(() => {
    if (scene) {
      applyTransformations(
        stoneRefs[0],
        new THREE.Euler(0.01, 0.1, -0.01),
        new THREE.Vector3(0.5, -0.143, -1.3),
        new THREE.Vector3(200, 200, 200)
      );
      applyTransformations(
        stoneRefs[1],
        new THREE.Euler(0.01, 0.1, -0.01),
        new THREE.Vector3(0.58, -0.143, -0.03),
        new THREE.Vector3(200, 200, 200)
      );
      applyTransformations(
        stoneRefs[2],
        new THREE.Euler(0.01, 0.1, -0.05),
        new THREE.Vector3(0.65, -0.143, 1.3),
        new THREE.Vector3(200, 200, 200)
      );
      applyTransformations(
        stoneRefs[3],
        new THREE.Euler(0.01, 3.2, -0.05),
        new THREE.Vector3(0.1, -0.143, 3.6),
        new THREE.Vector3(200, 200, 200)
      );
    }
  }, [scene]);

  return (
    <>
      {stoneRefs.map((ref, index) => (
        <primitive key={index} object={scene.clone()} ref={ref} />
      ))}
    </>
  );
};

export default Stones;
