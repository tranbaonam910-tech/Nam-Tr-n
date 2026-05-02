import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ELEMENTS: Record<string, { name: string, electrons: number, nucleusSize: number, color: string, symbol: string }> = {
  Hydrogen: { name: 'Hydro', electrons: 1, nucleusSize: 0.2, color: '#ff3366', symbol: 'H' },
  Helium: { name: 'Heli', electrons: 2, nucleusSize: 0.3, color: '#ffaa00', symbol: 'He' },
  Carbon: { name: 'Carbon', electrons: 6, nucleusSize: 0.5, color: '#00e5ff', symbol: 'C' },
  Oxygen: { name: 'Oxy', electrons: 8, nucleusSize: 0.6, color: '#00ffaa', symbol: 'O' },
  Iron: { name: 'Sắt', electrons: 26, nucleusSize: 1.0, color: '#bb77ff', symbol: 'Fe' },
};

function AtomModel({ elementDef }: { elementDef: any }) {
  const groupRef = useRef<THREE.Group>(null);
  const electronsRef = useRef<THREE.Group[]>([]);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.1;
      groupRef.current.rotation.x = time * 0.05;
    }
    // animate electrons moving along their orbits
    electronsRef.current.forEach((ref, index) => {
      if (ref) {
         // Different speeds so they don't sync up perfectly
         const speed = 1 + (index % 3) * 0.5;
         ref.rotation.z = time * speed + index; 
      }
    });
  });

  const orbits = [];
  for(let i = 0; i < elementDef.electrons; i++) {
    // Determine shell level (roughly based on 2, 8, 18, 32 rule)
    const shellLevel = i < 2 ? 1 : i < 10 ? 2 : 3;
    const radius = 1.2 + shellLevel * 0.8;
    
    // Deterministic spread angles
    const trackRotX = i * (Math.PI / 4) + (shellLevel * 0.2);
    const trackRotY = i * (Math.PI / 3) + (shellLevel * 0.5);
    const initialOffset = i * 2.5;

    orbits.push(
      <group key={i} rotation={[trackRotX, trackRotY, 0]}>
         <mesh>
            <torusGeometry args={[radius, 0.015, 32, 100]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.15} side={THREE.DoubleSide} />
         </mesh>
         <group ref={el => { if(el) electronsRef.current[i] = el }} rotation={[0, 0, initialOffset]}>
            <mesh position={[radius, 0, 0]}>
               <sphereGeometry args={[0.06, 16, 16]} />
               <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[radius, 0, 0]}>
               <sphereGeometry args={[0.12, 16, 16]} />
               <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
            </mesh>
         </group>
      </group>
    );
  }

  return (
    <group ref={groupRef}>
      {/* Nucleus */}
      <Sphere args={[elementDef.nucleusSize, 64, 64]}>
        <MeshDistortMaterial color={elementDef.color} attach="material" distort={0.4} speed={1.5} roughness={0.2} metalness={0.8} />
      </Sphere>
      {orbits}
    </group>
  );
}

export default function ThreeDViewer() {
  const [selectedKey, setSelectedKey] = useState<keyof typeof ELEMENTS>('Carbon');
  
  const currentElement = ELEMENTS[selectedKey];

  return (
    <div className="w-full h-[500px] mt-6 rounded-2xl overflow-hidden glass-panel border border-brand-blue/30 relative flex flex-col md:flex-row">
      <div className="absolute top-4 left-4 z-10 w-full pr-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start max-w-full gap-4">
           <div>
              <h3 className="font-bold text-white text-2xl flex items-center gap-2">
                 {currentElement.name} 
                 <span className="text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-md text-lg">{currentElement.symbol}</span>
              </h3>
              <p className="text-sm text-slate-300 mt-1">Mô Hình 3D Tương Tác • {currentElement.electrons} Electron</p>
           </div>
           
           <div className="bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/50 flex gap-1 shadow-lg overflow-x-auto max-w-full mr-4 custom-scrollbar">
             {Object.keys(ELEMENTS).map(key => (
                <button
                   key={key}
                   onClick={() => setSelectedKey(key)}
                   className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap min-w-16 flex-shrink-0 ${selectedKey === key ? 'bg-brand-blue text-slate-900 shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                   {key}
                </button>
             ))}
           </div>
        </div>
      </div>
      <Canvas camera={{ position: [0, 0, 6] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color={currentElement.color} />
        <AtomModel elementDef={currentElement} key={selectedKey} />
        <OrbitControls enableZoom={true} autoRotate={true} autoRotateSpeed={1.0} />
      </Canvas>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
