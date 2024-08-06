import { useGLTF, useAnimations } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const Character = () => {
  const { scene, animations } = useGLTF("/models/Soldier.glb");
  const characterRef = useRef<THREE.Group>(null!);
  const { actions } = useAnimations(animations, characterRef);
  const [direction, setDirection] = useState<string | null>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (characterRef.current) {
      characterRef.current.scale.set(0.5, 0.5, 0.5);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "w":
          setDirection("forward");
          break;
        case "a":
          setDirection("left");
          break;
        case "s":
          setDirection("backward");
          break;
        case "d":
          setDirection("right");
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (["w", "a", "s", "d"].includes(event.key)) {
        setDirection(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (actions["Walk"] && actions["Idle"]) {
      if (direction) {
        actions["Walk"].play();
        actions["Walk"].setLoop(THREE.LoopRepeat, Infinity);
        actions["Idle"].stop();
      } else {
        actions["Walk"].stop();
        actions["Idle"].play();
        actions["Idle"].setLoop(THREE.LoopRepeat, Infinity);
      }
    }
  }, [direction, actions]);

  useFrame(() => {
    if (characterRef.current) {
      const speed = 0.03;
      let moveX = 0;
      let moveZ = 0;

      switch (direction) {
        case "forward":
          moveZ -= speed;
          break;
        case "left":
          moveX -= speed;
          break;
        case "backward":
          moveZ += speed;
          break;
        case "right":
          moveX += speed;
          break;
      }

      if (moveX !== 0 || moveZ !== 0) {
        const angle = Math.atan2(-moveX, -moveZ);
        characterRef.current.rotation.y = angle;

        characterRef.current.position.x += moveX;
        characterRef.current.position.z += moveZ;
      }
    }
  });

  useFrame(() => {
    if (characterRef.current) {
      const cameraOffset = new THREE.Vector3(0, 1.2, 1.2);
      const cameraPosition = characterRef.current.position
        .clone()
        .add(cameraOffset.applyQuaternion(characterRef.current.quaternion));
      cameraPosition.y = Math.max(cameraPosition.y, 1);
      camera.position.copy(cameraPosition);
      camera.lookAt(characterRef.current.position);
    }
  });

  return <primitive object={scene} ref={characterRef} />;
};

export default Character;
