import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import AirConditioner from "./AirConditioner";

const Room = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [room, setRoom] = useState<THREE.Group | null>(null);
    const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
    const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const scene = new THREE.Scene();
        const cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const rend = new THREE.WebGLRenderer({ canvas: canvasRef.current });

        rend.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        rend.setClearColor(0xffffff);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        const loader = new GLTFLoader();
        loader.load(
            `${process.env.PUBLIC_URL}/models/room/scene.gltf`,
            (gltf) => {
                gltf.scene.scale.set(0.65, 0.65, 0.65);
                gltf.scene.rotation.y = -0.25 * Math.PI;
                gltf.scene.position.set(2, -1.5, -2);
                scene.add(gltf.scene);
                setRoom(gltf.scene);
                rend.render(scene, cam);
            },
            undefined,
            (error) => {
                console.error(error);
            }
        );

        cam.position.set(2.4, 0.1, 2.4);

        const controls = new OrbitControls(cam, rend.domElement);
        controls.enableRotate = false;
        controls.enableZoom = false;
        controls.enablePan = false;

        const renderLoop = () => {
            requestAnimationFrame(renderLoop);
            rend.render(scene, cam);
        };

        renderLoop();

        setCamera(cam);
        setRenderer(rend);

        return () => {
            if (canvasRef.current) {
                canvasRef.current = null;
            }
        };
    }, []);

    const handleAirConditionerClick = () => {
        alert("Air Conditioner clicked!");
    };

    return (
        <Container ref={canvasRef}>
            {room && camera && <AirConditioner roomModel={room} camera={camera} onClick={handleAirConditionerClick} />}
        </Container>
    );
};

const Container = styled.canvas`
    position: relative;
    display: block;
    width: 100% !important;
    height: 100% !important;
    touch-action: auto !important;
`;

export default Room;
