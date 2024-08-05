import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const House = () => {
  const { scene } = useGLTF("/models/house/scene.gltf");
  const houseRef = useRef<THREE.Group>(null!);

  useEffect(() => {
    if (houseRef.current) {
      houseRef.current.rotation.set(0, -3.12, 0);
      houseRef.current.position.set(0, 0, -3);
      houseRef.current.scale.set(0.5, 0.5, 0.5);
    }
  }, [scene]);

  return <primitive object={scene} ref={houseRef} />;
};

export default House;
