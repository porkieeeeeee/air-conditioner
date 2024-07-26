import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import styled from "@emotion/styled";

const AirConditioner = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
        renderer.setSize(window.innerWidth, window.innerHeight);

        renderer.setClearColor(0xffffff);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        const loader = new GLTFLoader();
        loader.load(
            `${process.env.PUBLIC_URL}/models/lg-whisen/scene.gltf`,
            (gltf) => {
                gltf.scene.scale.set(5, 5, 5);
                // gltf.scene.position.y += 10;
                scene.add(gltf.scene);
                renderer.render(scene, camera);
            },
            undefined,
            (error) => {
                console.error(error);
            }
        );

        camera.position.z = 5;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            if (canvasRef.current) {
                canvasRef.current = null;
            }
        };
    }, []);

    return <Container ref={canvasRef} />;
};

const Container = styled.canvas`
    display: block;
    width: 100%;
    height: 100%;
`;

export default AirConditioner;
