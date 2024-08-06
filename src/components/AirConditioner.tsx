import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const AirConditioner = () => {
  const { scene } = useGLTF("/models/whisen/scene.gltf");
  const whisenRef = useRef<THREE.Group>(null!);

  useEffect(() => {
    if (whisenRef.current) {
      whisenRef.current.rotation.set(0, -1.55, 0);
      whisenRef.current.position.set(1.4, 1.2, -3);
      whisenRef.current.scale.set(1.5, 1.5, 1.5);
    }
  }, [scene]);

  return <primitive object={scene} ref={whisenRef} />;
};
export default AirConditioner;
