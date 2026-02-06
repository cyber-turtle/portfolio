'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(1);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const uniforms = {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uSpeed: { value: 0.2 }
        };

        const fragmentShader = `
            uniform float uTime;
            uniform vec2 uResolution;
            uniform vec2 uMouse;
            uniform float uSpeed;

            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

            float snoise(vec2 v) {
                const vec4 C = vec4(0.211324865405187,
                                    0.366025403784439,
                                    -0.577350269189626,
                                    0.024390243902439);
                vec2 i  = floor(v + dot(v, C.yy) );
                vec2 x0 = v - i + dot(i, C.xx);
                vec2 i1;
                i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                vec4 x12 = x0.xyxy + C.xxzz;
                x12.xy -= i1;
                i = mod289(i);
                vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                        + i.x + vec3(0.0, i1.x, 1.0 ));
                vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                m = m*m ;
                m = m*m ;
                vec3 x = 2.0 * fract(p * C.www) - 1.0;
                vec3 h = abs(x) - 0.5;
                vec3 ox = floor(x + 0.5);
                vec3 a0 = x - ox;
                m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
                vec3 g;
                g.x  = a0.x  * x0.x  + h.x  * x0.y;
                g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                return 130.0 * dot(m, g);
            }

            void main() {
                vec2 st = gl_FragCoord.xy / uResolution.xy;
                st.x *= uResolution.x / uResolution.y;

                vec2 mouse = uMouse * uResolution.x / uResolution.y;
                float dist = distance(st, mouse);
                float mouseEffect = smoothstep(0.5, 0.0, dist) * 0.5;

                float time = uTime * uSpeed;
                
                vec2 q = vec2(0.);
                q.x = snoise(st + vec2(time * 0.1));
                q.y = snoise(st + vec2(1.0));

                vec2 r = vec2(0.);
                r.x = snoise(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * time);
                r.y = snoise(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * time);

                float f = snoise(st + r + mouseEffect);

                vec3 color1 = vec3(0.1, 0.0, 0.3);
                vec3 color2 = vec3(0.8, 1.0, 0.0);
                vec3 color3 = vec3(1.0, 0.0, 0.6);
                vec3 color4 = vec3(0.0, 0.8, 1.0);

                vec3 color = mix(color1, color2, clamp(f*f*4.0, 0.0, 1.0));
                color = mix(color, color3, clamp(length(q), 0.0, 1.0));
                color = mix(color, color4, clamp(r.x, 0.0, 1.0));

                float grain = (fract(sin(dot(st.xy * uTime, vec2(12.9898,78.233))) * 43758.5453) - 0.5) * 0.05;
                
                gl_FragColor = vec4(color + grain, 1.0);
            }
        `;

        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            fragmentShader: fragmentShader,
            vertexShader: `
                void main() {
                    gl_Position = vec4( position, 1.0 );
                }
            `
        });

        const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
        scene.add(plane);

        const clock = new THREE.Clock();
        let animationId: number;

        function animate() {
            uniforms.uTime.value = clock.getElapsedTime();
            renderer.render(scene, camera);
            animationId = requestAnimationFrame(animate);
        }
        animate();

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            uniforms.uResolution.value.set(width, height);
        };

        const handleMouseMove = (e: MouseEvent) => {
            uniforms.uMouse.value.set(e.clientX / window.innerWidth, 1.0 - e.clientY / window.innerHeight);
        };

        const handleHyperdrive = (e: CustomEvent) => {
             // Access the detail directly if we passed data, or just toggle/set specific value
             // For this impl, we'll assume the event payload tells us what to do or we just toggle
             // But simpler is to listen for specific states
             if (e.detail?.active) {
                 uniforms.uSpeed.value = 4.0;
             } else {
                 uniforms.uSpeed.value = 0.2;
             }
        };

        window.addEventListener('resize', handleResize);
        document.addEventListener('mousemove', handleMouseMove);
        // @ts-ignore
        window.addEventListener('toggle-hyperdrive', handleHyperdrive);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousemove', handleMouseMove);
            // @ts-ignore
            window.removeEventListener('toggle-hyperdrive', handleHyperdrive);
            cancelAnimationFrame(animationId);
            renderer.dispose();
            material.dispose();
            // geometry is shared/simple, but good practice to dispose if complex
            plane.geometry.dispose(); 
        };
    }, []);

    return <canvas ref={canvasRef} id="webgl-canvas" className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" />;
}
