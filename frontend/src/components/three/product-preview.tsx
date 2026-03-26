"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

type ProductPreviewProps = {
  title: string;
};

function FloatingCard() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) {
      return;
    }

    meshRef.current.rotation.y = state.clock.elapsedTime * 0.35;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.2;
  });

  return (
    <RoundedBox ref={meshRef} args={[2.6, 1.6, 0.16]} radius={0.12} smoothness={8}>
      <meshStandardMaterial color="#7c5cff" metalness={0.45} roughness={0.25} />
    </RoundedBox>
  );
}

export function ProductPreview3D({ title }: ProductPreviewProps) {
  return (
    <div className="glass-panel relative overflow-hidden rounded-[32px] p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary">
            3D Preview
          </p>
          <h3 className="mt-2 text-xl font-semibold">{title}</h3>
        </div>
      </div>
      <div className="h-[340px] overflow-hidden rounded-[24px] bg-linear-to-br from-white/8 to-secondary/12">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={1.1} />
          <directionalLight position={[4, 4, 3]} intensity={2.4} />
          <pointLight position={[-3, -2, 3]} intensity={1.5} color="#53d1f8" />
          <FloatingCard />
          <OrbitControls enablePan={false} minDistance={3} maxDistance={8} />
        </Canvas>
      </div>
    </div>
  );
}
