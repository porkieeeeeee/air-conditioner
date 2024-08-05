import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useState } from "react";
import * as THREE from "three";
import styled from "@emotion/styled";

const Background = () => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  const handleTextureLoader = () => {
    const loader = new THREE.TextureLoader();

    loader.load(
      "/models/grass/textures/tex_u1_v1_baseColor.jpeg",
      (loadedTexture) => {
        loadedTexture.wrapS = THREE.RepeatWrapping;
        loadedTexture.wrapT = THREE.RepeatWrapping;
        loadedTexture.repeat.set(10, 10);
        loadedTexture.offset.set(0, 0);
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        console.error("에러🥵🥵:", error);
      }
    );
  };

  useEffect(() => {
    handleTextureLoader();
  }, []);

  return (
    <StyleCanvas camera={{ position: [0, 5, 10], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      <mesh position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      <OrbitControls />
    </StyleCanvas>
  );
};

const StyleCanvas = styled(Canvas)`
  width: 100%;
  height: 100vh;
`;

export default Background;
