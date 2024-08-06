import { useGLTF, useAnimations } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Character = () => {
  const { scene, animations } = useGLTF("/models/Soldier.glb");
  const characterRef = useRef<THREE.Group>(null!);
  const { actions } = useAnimations(animations, characterRef);
  const [direction, setDirection] = useState<string | null>(null);

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
      const speed = 0.05;
      switch (direction) {
        case "forward":
          characterRef.current.position.z -= speed;
          break;
        case "left":
          characterRef.current.position.x -= speed;
          break;
        case "backward":
          characterRef.current.position.z += speed;
          break;
        case "right":
          characterRef.current.position.x += speed;
          break;
      }
    }
  });

  return <primitive object={scene} ref={characterRef} />;
};

export default Character;
