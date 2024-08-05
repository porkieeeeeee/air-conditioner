import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface IStoneProps {
  position: [number, number, number];
}

const Stone = ({ position }: IStoneProps) => {
  const { scene } = useGLTF("/models/stone/scene.gltf");
  const stoneRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (stoneRef.current) {
      stoneRef.current.rotation.set(-0.01, 0.1, 0);
      stoneRef.current.position.set(...position);
      stoneRef.current.scale.set(200, 200, 200);
    }
  }, [position]);

  return <primitive object={scene} ref={stoneRef} />;
};

export default Stone;
