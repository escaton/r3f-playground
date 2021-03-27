import { FC, MouseEvent, useMemo, useRef, useState } from 'react';
import { Canvas, MeshProps, useFrame } from 'react-three-fiber';
import { mergeUniforms, Mesh, ShaderMaterial } from 'three';

import * as shaders from './shaders';

import './App.css';

const rgb = <T extends any>(...args: T[]): T[] => args;

type RGBFunc = (x: number, y: number, t: number) => number;

var R: RGBFunc = function (x, y, t) {
    return Math.floor(192 + 64 * Math.cos((x * x - y * y) / 300 + t));
};

var G: RGBFunc = function (x, y, t) {
    return Math.floor(
        192 +
            64 *
                Math.sin(
                    (x * x * Math.cos(t / 4) + y * y * Math.sin(t / 3)) / 300
                )
    );
};

var B: RGBFunc = function (x, y, t) {
    return Math.floor(
        192 +
            64 *
                Math.sin(
                    5 * Math.sin(t / 9) +
                        ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100
                )
    );
};

function App() {
    const onClick = ({currentTarget}: MouseEvent<HTMLDivElement>) => {
        currentTarget.requestFullscreen();
    }
    return (
        <div className="App" onClick={onClick}>
            <Canvas>
                <Gradient />
            </Canvas>
        </div>
    );
}

const Gradient: FC = () => {
    const meshRef = useRef<Mesh>(null!);

    const j = useRef(0);
    const t = useRef(0);
    const x = useRef(Math.random() * 32);
    const y = useRef(Math.random() * 32);
    const vCheck = useRef(false);

    useFrame(() => {
        const material = Array.isArray(meshRef.current.material)
            ? (meshRef.current.material[0] as ShaderMaterial)
            : (meshRef.current.material as ShaderMaterial);
        material.uniforms.u_randomisePosition.value = [j.current, j.current];
        material.uniforms.u_time.value = t.current;
        material.uniforms.u_color1.value = [
            R(x.current, y.current, t.current / 2),
            G(x.current, y.current, t.current / 2),
            B(x.current, y.current, t.current / 2),
        ];
        meshRef.current.rotation.z = -t.current/60;

        j.current += 0.01;
        t.current += 0.05;

        if (t.current % 0.1 === 0) {
            if (vCheck.current === false) {
                x.current -= 1;
                if (x.current <= 0) {
                    vCheck.current = true;
                }
            } else {
                x.current += 1;
                if (x.current >= 32) {
                    vCheck.current = false;
                }
            }
        }
    });

    const uniforms = useMemo(
        () => ({
            u_bg: { type: 'v3', value: rgb(162, 138, 241) },
            u_bgMain: { type: 'v3', value: rgb(162, 138, 241) },
            u_color1: { type: 'v3', value: rgb(162, 138, 241) },
            u_color2: { type: 'v3', value: rgb(82, 31, 241) },
            u_time: { type: 'f', value: 0 },
            u_randomisePosition: {
                type: 'v2',
                value: [1, 2],
            },
        }),
        []
    );

    return (
        <mesh
            ref={meshRef}
            position={[0, 0, -280]}
            scale={[4, 4, 4]}
            rotation={[0, 0, 1]}
        >
            <planeGeometry args={[400, 400, 100, 100]} />
            <shaderMaterial
                // uniforms-u_bg-value={[162, 138, 241]}
                // uniforms-u_bgMain-value={[162, 138, 241]}
                // uniforms-u_color1-value={[162, 138, 241]}
                // uniforms-u_color2-value={[82, 31, 241]}
                // uniforms-u_time-value={0}
                // uniforms-u_randomisePosition-value={[1,2]}
                uniforms={uniforms}
                fragmentShader={shaders.snoise + shaders.fragment}
                vertexShader={shaders.snoise + shaders.vertex}
            ></shaderMaterial>
        </mesh>
    );
};

// const Box: FC<Partial<MeshProps>> = (props) => {
//     // This reference will give us direct access to the mesh
//     const mesh = useRef<Mesh>(null!);

//     // Set up state for the hovered and active state
//     const [hovered, setHover] = useState(false);
//     const [active, setActive] = useState(false);

//     // Rotate mesh every frame, this is outside of React without overhead

//     const rotationSpeed = Math.PI;

//     useFrame((_, delta) => {
//         const rotate = delta*rotationSpeed;
//         // console.log(delta, rotate)
//         mesh.current.rotation.x = mesh.current.rotation.y += hovered ? rotate/2 : rotate;
//     });

//     return (
//         <mesh
//             {...props}
//             ref={mesh}
//             scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
//             onClick={(event) => setActive(!active)}
//             onPointerOver={(event) => setHover(true)}
//             onPointerOut={(event) => setHover(false)}
//         >
//             <boxBufferGeometry args={[1, 1, 1]} />
//             <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
//         </mesh>
//     );
// };

export default App;
