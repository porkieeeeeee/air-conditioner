import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ThreeScene = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current!,
            antialias: true,
        });

        // sRGB 인코딩 설정
        renderer.outputEncoding = THREE.sRGBEncoding;

        const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 15); // 카메라 위치 설정

        // OrbitControls를 추가합니다.
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // 부드러운 회전을 위한 damping 활성화
        controls.dampingFactor = 0.25;

        const loader = new GLTFLoader();
        loader.load(
            `${process.env.PUBLIC_URL}/models/scene.gltf`, // public 디렉토리에서 가져오기
            (gltf) => {
                scene.add(gltf.scene);
                scene.background = new THREE.Color("black");

                const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 색상과 강도
                scene.add(ambientLight);

                const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
                dirLight.position.set(0, 5, 5); // 위치 설정
                scene.add(dirLight);

                const animate = () => {
                    requestAnimationFrame(animate);
                    controls.update(); // OrbitControls 업데이트를 추가
                    renderer.render(scene, camera);
                };
                animate();
            },
            undefined,
            (error) => {
                console.error("Error loading GLTF model:", error);
            }
        );

        renderer.setSize(window.innerWidth, window.innerHeight);

        return () => {
            // 클린업
            renderer.dispose();
        };
    }, []);

    return <canvas ref={canvasRef} style={{ display: "block", width: "100vw", height: "100vh" }} />;
};

export default ThreeScene;
