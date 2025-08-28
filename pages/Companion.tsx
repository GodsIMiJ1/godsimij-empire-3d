
import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { Character, WorldItem } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Map, Compass, Zap, Heart } from "lucide-react";
import { useNavigate } => "react-router-dom";
import { createPageUrl } from "@/utils";

export default function World() {
  const navigate = useNavigate();
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const [character, setCharacter] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorldData();
  }, []);

  useEffect(() => {
    if (!loading && character) {
      const initThreeJS = () => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0f172a);
        
        const camera = new THREE.PerspectiveCamera(
          75, 
          mountRef.current.clientWidth / mountRef.current.clientHeight, 
          0.1, 
          1000
        );
        camera.position.set(5, 3, 5);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        mountRef.current.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x8b5cf6, 1, 50);
        pointLight1.position.set(0, 10, 0);
        pointLight1.castShadow = true;
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x06b6d4, 0.8, 30);
        pointLight2.position.set(10, 5, 10);
        scene.add(pointLight2);

        // Create floating island
        const createFloatingIsland = (x, y, z) => {
          const group = new THREE.Group();
          
          // Island base
          const baseGeometry = new THREE.CylinderGeometry(2, 1.5, 1, 8);
          const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x4a5568 });
          const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
          baseMesh.position.y = -0.5;
          baseMesh.receiveShadow = true;
          group.add(baseMesh);

          // Grass top
          const grassGeometry = new THREE.CylinderGeometry(2, 2, 0.2, 8);
          const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x48bb78 });
          const grassMesh = new THREE.Mesh(grassGeometry, grassMaterial);
          grassMesh.receiveShadow = true;
          group.add(grassMesh);

          // Crystals
          const crystalGeometry = new THREE.ConeGeometry(0.2, 1, 6);
          const crystalMaterial1 = new THREE.MeshStandardMaterial({ 
            color: 0x8b5cf6, 
            emissive: 0x8b5cf6, 
            emissiveIntensity: 0.3 
          });
          const crystal1 = new THREE.Mesh(crystalGeometry, crystalMaterial1);
          crystal1.position.set(1, 0.5, 1);
          crystal1.castShadow = true;
          group.add(crystal1);

          const crystalMaterial2 = new THREE.MeshStandardMaterial({ 
            color: 0x06b6d4, 
            emissive: 0x06b6d4, 
            emissiveIntensity: 0.3 
          });
          const crystal2 = new THREE.Mesh(crystalGeometry, crystalMaterial2);
          crystal2.position.set(-1, 0.3, -1);
          crystal2.scale.set(0.75, 0.7, 0.75);
          crystal2.castShadow = true;
          group.add(crystal2);

          group.position.set(x, y, z);
          return group;
        };

        // Add floating islands
        const island1 = createFloatingIsland(0, 0, 0);
        const island2 = createFloatingIsland(8, -2, 5);
        const island3 = createFloatingIsland(-6, 1, -8);
        scene.add(island1, island2, island3);

        // Create player avatar
        const createAvatar = () => {
          const group = new THREE.Group();
          
          const bodyGeometry = new THREE.CapsuleGeometry(0.3, 1.2);
          const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: character?.avatar_config?.skin_color || 0xffdbac,
            emissive: 0x8b5cf6,
            emissiveIntensity: 0.1
          });
          const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
          body.position.y = 1;
          body.castShadow = true;
          group.add(body);

          const pos = character?.position;
          group.position.set(pos?.x || 0, pos?.y || 1, pos?.z || 0);
          return group;
        };

        const avatar = createAvatar();
        scene.add(avatar);

        // Create portals
        const createPortal = (x, y, z) => {
          const portalGeometry = new THREE.TorusGeometry(1, 0.1, 8, 24);
          const portalMaterial = new THREE.MeshStandardMaterial({
            color: 0x9c27b0,
            emissive: 0x9c27b0,
            emissiveIntensity: 0.5
          });
          const portal = new THREE.Mesh(portalGeometry, portalMaterial);
          portal.position.set(x, y, z);
          return portal;
        };

        const portal1 = createPortal(0, 2, 3);
        const portal2 = createPortal(8, 0, 8);
        scene.add(portal1, portal2);

        // Stars
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
        const starsVertices = [];
        for (let i = 0; i < 5000; i++) {
          const x = (Math.random() - 0.5) * 2000;
          const y = (Math.random() - 0.5) * 2000;
          const z = (Math.random() - 0.5) * 2000;
          starsVertices.push(x, y, z);
        }
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);

        // Mouse controls
        let mouseX = 0, mouseY = 0;
        const onMouseMove = (event) => {
          mouseX = (event.clientX / window.innerWidth) * 2 - 1;
          mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        document.addEventListener('mousemove', onMouseMove);

        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate);

          // Animate floating islands
          island1.position.y = Math.sin(Date.now() * 0.0005) * 0.1;
          island2.position.y = -2 + Math.sin(Date.now() * 0.0005 + 1) * 0.1;
          island3.position.y = 1 + Math.sin(Date.now() * 0.0005 + 2) * 0.1;

          // Animate portals
          portal1.rotation.z += 0.02;
          portal2.rotation.z += 0.02;

          // Animate avatar
          avatar.rotation.y = Math.sin(Date.now() * 0.002) * 0.1;

          // Camera follows mouse slightly
          camera.position.x = 5 + mouseX * 2;
          camera.position.y = 3 + mouseY * 2;
          camera.lookAt(0, 0, 0);

          renderer.render(scene, camera);
        };

        animate();
        sceneRef.current = { 
          scene, 
          camera, 
          renderer, 
          cleanup: () => {
            document.removeEventListener('mousemove', onMouseMove);
            if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
              mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
          }
        };

        // Handle resize
        const handleResize = () => {
          if (!mountRef.current) return;
          camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          document.removeEventListener('mousemove', onMouseMove);
        };
      };

      const cleanupThreeJSListeners = initThreeJS();
      
      return () => {
        if (cleanupThreeJSListeners) cleanupThreeJSListeners();
        if (sceneRef.current?.cleanup) {
          sceneRef.current.cleanup();
        }
        sceneRef.current = null; // Clear the ref after cleanup
      };
    }
  }, [loading, character]);

  const loadWorldData = async () => {
    setLoading(true);
    const characters = await Character.list();
    const worldItems = await WorldItem.list();
    
    setCharacter(characters[0] || null);
    setItems(worldItems);
    setLoading(false);
  };

  const exploreArea = (areaName) => {
    console.log(`Exploring ${areaName}...`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-purple-300">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium">Loading world...</span>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <Card className="hologram glow-border max-w-md">
          <CardHeader>
            <CardTitle className="text-white text-center">Character Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-purple-300 mb-4">
              You need to create a character before entering the world.
            </p>
            <Button 
              onClick={() => navigate(createPageUrl("AvatarCreator"))}
              className="bg-gradient-to-r from-purple-600 to-cyan-600"
            >
              Create Character
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top HUD */}
      <div className="p-4 border-b border-purple-500/20 bg-slate-900/50 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(createPageUrl("Dashboard"))}
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h2 className="text-white font-bold text-lg neon-glow">NexusRealm</h2>
              <p className="text-purple-300 text-sm">Floating Nexus Islands</p>
            </div>
          </div>

          {/* Character Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400" />
              <div className="w-20">
                <Progress 
                  value={character.health} 
                  className="h-2 bg-slate-800"
                />
              </div>
              <span className="text-red-300 text-sm">{character.health}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <div className="w-20">
                <Progress 
                  value={character.mana} 
                  className="h-2 bg-slate-800"
                />
              </div>
              <span className="text-blue-300 text-sm">{character.mana}</span>
            </div>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              Level {character.level}
            </Badge>
          </div>
        </div>
      </div>

      {/* 3D World */}
      <div className="flex-1 relative">
        <div 
          ref={mountRef} 
          className="w-full h-full"
          style={{ minHeight: '400px' }}
        />

        {/* World UI Overlay */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
          {/* Action Panel */}
          <Card className="hologram glow-border">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => exploreArea("Crystal Caverns")}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                >
                  <Compass className="w-4 h-4 mr-2" />
                  Explore
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(createPageUrl("Inventory"))}
                  className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20"
                >
                  <Map className="w-4 h-4 mr-2" />
                  Inventory
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mini Map */}
          <Card className="hologram glow-border w-32 h-32">
            <CardContent className="p-2 h-full">
              <div className="relative w-full h-full bg-slate-800/50 rounded">
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-purple-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-2 right-2 w-1 h-1 bg-cyan-400 rounded-full"></div>
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-green-400 rounded-full"></div>
                <div className="absolute top-4 left-4 w-1 h-1 bg-yellow-400 rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
