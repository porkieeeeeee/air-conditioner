import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

interface IAirConditionerProps {
    roomModel: THREE.Group;
    camera: THREE.PerspectiveCamera;
    onClick: () => void;
}

const AirConditioner = ({ roomModel, camera, onClick }: IAirConditionerProps) => {
    const airConditionerRef = useRef<THREE.Group | null>(null);
    const raycasterRef = useRef(new THREE.Raycaster());
    const mouseRef = useRef(new THREE.Vector2());

    useEffect(() => {
        const loader = new GLTFLoader();
        loader.load(
            `${process.env.PUBLIC_URL}/models/lg-whisen/scene.gltf`,
            (gltf) => {
                gltf.scene.scale.set(3, 3, 3);
                gltf.scene.position.set(1, 4, 0.1);
                roomModel.add(gltf.scene);
                airConditionerRef.current = gltf.scene;
            },
            undefined,
            (error) => {
                console.error(error);
            }
        );
    }, [roomModel]);

    useEffect(() => {
        const onClickHandler = (event: MouseEvent) => {
            mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener("click", onClickHandler);

        return () => {
            window.removeEventListener("click", onClickHandler);
        };
    }, []);

    useEffect(() => {
        const checkIntersection = () => {
            if (airConditionerRef.current) {
                raycasterRef.current.setFromCamera(mouseRef.current, camera);

                const intersects = raycasterRef.current.intersectObject(airConditionerRef.current, true);
                if (intersects.length > 0) {
                    onClick();
                }
            }
            requestAnimationFrame(checkIntersection);
        };

        checkIntersection();
    }, [camera, onClick]);

    return null;
};

export default AirConditioner;
