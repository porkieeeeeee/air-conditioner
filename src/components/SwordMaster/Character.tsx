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
  const [cameraRadius] = useState(3);
  const [cameraAngle, setCameraAngle] = useState({ theta: 0 });

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

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
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
      let moveX = 0;
      let moveZ = 0;

      // 카메라의 방향을 기준으로 이동 방향 설정
      const cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection);
      cameraDirection.y = 0; // y축 방향 제거
      cameraDirection.normalize(); // 방향 벡터 정규화

      switch (direction) {
        case "forward":
          moveX += cameraDirection.x * speed;
          moveZ += cameraDirection.z * speed;
          break;
        case "backward":
          moveX -= cameraDirection.x * speed;
          moveZ -= cameraDirection.z * speed;
          break;
        case "left":
          const leftDirection = new THREE.Vector3(
            -cameraDirection.z,
            0,
            cameraDirection.x
          ).normalize();
          moveX += leftDirection.x * speed;
          moveZ += leftDirection.z * speed;
          break;
        case "right":
          const rightDirection = new THREE.Vector3(
            cameraDirection.z,
            0,
            -cameraDirection.x
          ).normalize();
          moveX += rightDirection.x * speed;
          moveZ += rightDirection.z * speed;
          break;
      }

      if (moveX !== 0 || moveZ !== 0) {
        characterRef.current.position.x += moveX;
        characterRef.current.position.z += moveZ;

        const angle = Math.atan2(-moveX, -moveZ);
        characterRef.current.rotation.y = angle; // 캐릭터 회전
      }

      // 카메라 위치 업데이트
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
