import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import { Mesh, ShaderMaterial } from 'three';

import { R, G, B } from './utils';
import * as shaders from './shaders';

import './App.css';

const rgb = <T extends any>(...args: T[]): T[] => args;

function App() {
    const appRef = useRef<HTMLDivElement>(null!);
    const onClick = () => {
        appRef.current.requestFullscreen();
    };

    const [isFS, setIsFS] = useState(false);

    useEffect(() => {
        const onFullscreenChange = () => {
            setIsFS(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', onFullscreenChange);
        onFullscreenChange();

        if (appRef.current.requestFullscreen === undefined) {
            setIsFS(true);
        }

        return () =>
            document.removeEventListener(
                'fullscreenchange',
                onFullscreenChange
            );
    }, []);

    return (
        <div className="App" ref={appRef}>
            <Canvas>
                <Gradient />
            </Canvas>
            {/* <div
                className="go-to-fs"
                style={{ opacity: isFS ? 0 : 0.5 }}
                onClick={onClick}
            >
                fullscreen
            </div> */}
            <div className="plus" onClick={onClick}/>
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

    useFrame((_, delta) => {
        const material = Array.isArray(meshRef.current.material)
            ? (meshRef.current.material[0] as ShaderMaterial)
            : (meshRef.current.material as ShaderMaterial);
        material.uniforms.u_randomisePosition.value = [j.current, j.current];
        material.uniforms.u_time.value = t.current;
        // material.uniforms.u_color1.value = [
        //     R(x.current, y.current, t.current / 2),
        //     G(x.current, y.current, t.current / 2),
        //     B(x.current, y.current, t.current / 2),
        // ];
        meshRef.current.rotation.z = 6 + -t.current / 60;

        // j.current += 0.01;
        j.current += delta * 0.7;
        // t.current += 0.05;
        t.current += delta * 3;

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
            u_bg: { type: 'v3', value: rgb(0x42, 0x33, 0xfe) },
            u_bgMain: { type: 'v3', value: rgb(0xec, 0xa6, 0x4e) },
            u_color1: { type: 'v3', value: rgb(0xff, 0xcc, 0) },
            // u_color2: { type: 'v3', value: rgb(0xff, 0x65, 0x01) },
            u_color2: { type: 'v3', value: rgb(0x48, 0xcc, 0xe0) },
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
            scale={[3, 3, 3]}
            rotation={[0, 0, 0]}
        >
            <planeGeometry args={[400, 400, 100, 100]} />
            <shaderMaterial
                uniforms={uniforms}
                fragmentShader={shaders.snoise + shaders.fragment}
                vertexShader={shaders.snoise + shaders.vertex}
            ></shaderMaterial>
        </mesh>
    );
};

export default App;
