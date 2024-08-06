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

  const [isDragging, setIsDragging] = useState(false);
  const [previousMousePosition, setPreviousMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [cameraRadius, setCameraRadius] = useState(3);
  const [cameraAngle, setCameraAngle] = useState({ theta: 0 });
  const [cameraForwardDirection, setCameraForwardDirection] = useState(
    new THREE.Vector3()
  );

  useEffect(() => {
    if (characterRef.current) {
      characterRef.current.scale.set(0.5, 0.5, 0.5);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection);
      cameraDirection.y = 0;
      cameraForwardDirection.copy(cameraDirection.normalize());

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

    const handleMouseDown = (event: MouseEvent) => {
      setIsDragging(true);
      setPreviousMousePosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        const sensitivity = 0.005;
        setCameraAngle((prev) => ({
          theta: prev.theta - deltaX * sensitivity,
        }));

        setPreviousMousePosition({ x: event.clientX, y: event.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleWheel = (event: WheelEvent) => {
      const delta = event.deltaY > 0 ? 0.1 : -0.1;
      setCameraRadius((prev) => Math.max(1, prev + delta));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isDragging, previousMousePosition]);

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
      let moveDirection = new THREE.Vector3();

      switch (direction) {
        case "forward":
          moveDirection.copy(cameraForwardDirection).multiplyScalar(speed);
          break;
        case "backward":
          moveDirection
            .copy(cameraForwardDirection)
            .negate()
            .multiplyScalar(speed);
          break;
        case "left":
          moveDirection
            .set(cameraForwardDirection.z, 0, -cameraForwardDirection.x)
            .normalize()
            .multiplyScalar(speed);
          break;
        case "right":
          moveDirection
            .set(-cameraForwardDirection.z, 0, cameraForwardDirection.x)
            .normalize()
            .multiplyScalar(speed);
          break;
      }

      if (moveDirection.length() > 0) {
        characterRef.current.position.add(moveDirection);

        const angle = Math.atan2(-moveDirection.x, -moveDirection.z);
        characterRef.current.rotation.y = angle;
      }

      camera.position.x =
        characterRef.current.position.x +
        cameraRadius * Math.sin(cameraAngle.theta);
      camera.position.z =
        characterRef.current.position.z +
        cameraRadius * Math.cos(cameraAngle.theta);
      camera.position.y = characterRef.current.position.y + 1;
      camera.lookAt(characterRef.current.position);
    }
  });

  return <primitive object={scene} ref={characterRef} />;
};

export default Character;
