import * as THREE from "three";

declare module "three" {
    export interface WebGLRenderer {
        outputEncoding: typeof THREE.sRGBEncoding;
    }
}

declare module "three" {
    export namespace sRGBEncoding {
        const value: number;
    }
}
