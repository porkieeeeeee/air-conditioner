import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const Trees = () => {
  const { scene } = useGLTF("/models/tree/scene.gltf");
  const treeRefs = [
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
        treeRefs[0],
        new THREE.Euler(0, 0, 0),
        new THREE.Vector3(1.5, 1, -6.4),
        new THREE.Vector3(1, 1, 1)
      );
      applyTransformations(
        treeRefs[1],
        new THREE.Euler(0, 0, 0),
        new THREE.Vector3(-2.2, 1, -5.3),
        new THREE.Vector3(1, 1, 1)
      );
      applyTransformations(
        treeRefs[2],
        new THREE.Euler(0, 0, 0),
        new THREE.Vector3(2.4, 1, -4),
        new THREE.Vector3(1, 1, 1)
      );
      applyTransformations(
        treeRefs[3],
        new THREE.Euler(0, 0, 0),
        new THREE.Vector3(-3, 1, -3),
        new THREE.Vector3(1, 1, 1)
      );
    }
  }, [scene]);

  return (
    <>
      {treeRefs.map((ref, index) => (
        <primitive key={index} object={scene.clone()} ref={ref} />
      ))}
    </>
  );
};

export default Trees;
