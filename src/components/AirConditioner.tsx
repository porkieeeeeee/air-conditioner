import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

interface IAirConditionerProps {
  roomModel: THREE.Group;
}

const AirConditioner = ({ roomModel }: IAirConditionerProps) => {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    const loader = new GLTFLoader();
    loader.load(
      `${process.env.PUBLIC_URL}/models/lg-whisen/scene.gltf`,
      (gltf) => {
        gltf.scene.scale.set(3, 3, 3);
        gltf.scene.position.set(1, 4, 0.1);
        roomModel.add(gltf.scene);
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );
  }, [roomModel]);

  return null;
};

export default AirConditioner;
