import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ITreeProps {
  position: [number, number, number];
}

const Tree = ({ position }: ITreeProps) => {
  const { scene } = useGLTF("/models/tree/scene.gltf");
  const treeRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (treeRef.current) {
      treeRef.current.position.set(...position);
      treeRef.current.scale.set(1, 1, 1);
    }
  }, [position]);

  return <primitive object={scene} ref={treeRef} />;
};

export default Tree;
