
import React, { useState, useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { Character } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, User, Palette, Zap } from "lucide-react";

export default function AvatarCreator() {
  const navigate = useNavigate();
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const [character, setCharacter] = useState({
    name: "",
    class: "warrior",
    avatar_config: {
      skin_color: "#ffdbac",
      hair_color: "#4a4a4a",
      hair_style: "short",
      eye_color: "#2196f3",
      body_type: "medium"
    }
  });
  const [saving, setSaving] = useState(false);
  const [existingCharacter, setExistingCharacter] = useState(null);

  useEffect(() => {
    const loadExistingCharacter = async () => {
      const characters = await Character.list();
      if (characters[0]) {
        setExistingCharacter(characters[0]);
        setCharacter({
          ...characters[0],
          avatar_config: characters[0].avatar_config || {
            skin_color: "#ffdbac",
            hair_color: "#4a4a4a",
            hair_style: "short",
            eye_color: "#2196f3",
            body_type: "medium"
          }
        });
      }
    };
    loadExistingCharacter();
  }, []);

  const initThreeJS = useCallback(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1e293b);
    
    const camera = new THREE.PerspectiveCamera(
      75, 
      mountRef.current.clientWidth / mountRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.set(0, 1.5, 2);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x8b5cf6, 0.8);
    pointLight1.position.set(2, 3, 2);
    pointLight1.castShadow = true;
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 0.6);
    pointLight2.position.set(-2, 1, 2);
    scene.add(pointLight2);

    // Create avatar
    let avatarGroup;
    const createAvatar = (config) => {
      if (avatarGroup) {
        scene.remove(avatarGroup);
      }

      avatarGroup = new THREE.Group();
      
      // Head
      const headGeometry = new THREE.SphereGeometry(0.15, 32, 32);
      const headMaterial = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(config.skin_color) 
      });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.set(0, 1.6, 0);
      head.castShadow = true;
      avatarGroup.add(head);

      // Hair
      const hairGeometry = new THREE.SphereGeometry(0.16, 16, 16);
      const hairMaterial = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(config.hair_color) 
      });
      const hair = new THREE.Mesh(hairGeometry, hairMaterial);
      hair.position.set(0, 1.75, 0);
      hair.castShadow = true;
      avatarGroup.add(hair);

      // Eyes
      const eyeGeometry = new THREE.SphereGeometry(0.02, 8, 8);
      const eyeMaterial = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(config.eye_color),
        emissive: new THREE.Color(config.eye_color),
        emissiveIntensity: 0.3
      });
      
      const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      leftEye.position.set(-0.05, 1.65, 0.13);
      avatarGroup.add(leftEye);

      const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      rightEye.position.set(0.05, 1.65, 0.13);
      avatarGroup.add(rightEye);

      // Body
      const bodyGeometry = new THREE.CylinderGeometry(0.12, 0.15, 0.8);
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x4a5568 });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.set(0, 1, 0);
      body.castShadow = true;
      avatarGroup.add(body);

      // Arms
      const armGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6);
      const armMaterial = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(config.skin_color) 
      });
      
      const leftArm = new THREE.Mesh(armGeometry, armMaterial);
      leftArm.position.set(-0.25, 1.2, 0);
      leftArm.rotation.z = 0.3;
      leftArm.castShadow = true;
      avatarGroup.add(leftArm);

      const rightArm = new THREE.Mesh(armGeometry, armMaterial);
      rightArm.position.set(0.25, 1.2, 0);
      rightArm.rotation.z = -0.3;
      rightArm.castShadow = true;
      avatarGroup.add(rightArm);

      // Legs
      const legGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.8);
      const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2d3748 });
      
      const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
      leftLeg.position.set(-0.08, 0.4, 0);
      leftLeg.castShadow = true;
      avatarGroup.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
      rightLeg.position.set(0.08, 0.4, 0);
      rightLeg.castShadow = true;
      avatarGroup.add(rightLeg);

      scene.add(avatarGroup);
      return avatarGroup;
    };

    createAvatar(character.avatar_config);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (avatarGroup) {
        avatarGroup.rotation.y = Math.sin(Date.now() * 0.0005) * 0.1;
      }

      camera.lookAt(0, 1.2, 0);
      renderer.render(scene, camera);
    };

    animate();

    // Store references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      updateAvatar: (config) => createAvatar(config),
      cleanup: () => {
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
    };
  }, [character.avatar_config]);

  useEffect(() => {
    const cleanup = initThreeJS();
    return () => {
      if (cleanup) cleanup();
      if (sceneRef.current?.cleanup) {
        sceneRef.current.cleanup();
      }
    };
  }, [initThreeJS]);

  useEffect(() => {
    // Update avatar when config changes
    if (sceneRef.current?.updateAvatar) {
      sceneRef.current.updateAvatar(character.avatar_config);
    }
  }, [character.avatar_config]);

  const handleInputChange = (field, value) => {
    setCharacter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarConfigChange = (field, value) => {
    setCharacter(prev => ({
      ...prev,
      avatar_config: {
        ...prev.avatar_config,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!character.name) return;
    
    setSaving(true);
    try {
      if (existingCharacter) {
        await Character.update(existingCharacter.id, character);
      } else {
        await Character.create(character);
      }
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Error saving character:", error);
    }
    setSaving(false);
  };

  const classColors = {
    warrior: "from-red-500 to-orange-500",
    mage: "from-purple-500 to-blue-500",
    rogue: "from-green-500 to-yellow-500",
    healer: "from-cyan-500 to-teal-500"
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white neon-glow mb-1">
              Avatar Creator
            </h1>
            <p className="text-purple-300">Design your digital identity</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 3D Preview */}
          <Card className="hologram glow-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" />
                Avatar Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                ref={mountRef}
                className="h-96 rounded-lg bg-gradient-to-b from-slate-800 to-slate-900 overflow-hidden"
                style={{ minHeight: '384px' }}
              />
              <div className="mt-4 text-center">
                <Badge className={`bg-gradient-to-r ${classColors[character.class]} text-white px-4 py-1`}>
                  {character.class.charAt(0).toUpperCase() + character.class.slice(1)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Customization Panel */}
          <Card className="hologram glow-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-cyan-400" />
                Customization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-purple-200">Character Name</Label>
                  <Input
                    id="name"
                    value={character.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your character name"
                    className="bg-slate-800/50 border-purple-500/30 text-white placeholder-purple-300/50"
                  />
                </div>

                <div>
                  <Label className="text-purple-200">Class</Label>
                  <Select value={character.class} onValueChange={(value) => handleInputChange('class', value)}>
                    <SelectTrigger className="bg-slate-800/50 border-purple-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-purple-500/30">
                      <SelectItem value="warrior">⚔️ Warrior</SelectItem>
                      <SelectItem value="mage">🔮 Mage</SelectItem>
                      <SelectItem value="rogue">🗡️ Rogue</SelectItem>
                      <SelectItem value="healer">✨ Healer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Appearance */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Appearance
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-purple-200 text-sm">Skin Color</Label>
                    <div className="flex gap-2 mt-1">
                      {['#ffdbac', '#f4c2a1', '#d08b5b', '#8d5524', '#4a4a4a'].map(color => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            character.avatar_config.skin_color === color 
                              ? 'border-purple-400 scale-110' 
                              : 'border-slate-600 hover:border-purple-300'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => handleAvatarConfigChange('skin_color', color)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-purple-200 text-sm">Hair Color</Label>
                    <div className="flex gap-2 mt-1">
                      {['#4a4a4a', '#8b4513', '#daa520', '#ff4500', '#9370db'].map(color => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            character.avatar_config.hair_color === color 
                              ? 'border-cyan-400 scale-110' 
                              : 'border-slate-600 hover:border-cyan-300'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => handleAvatarConfigChange('hair_color', color)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <Label className="text-purple-200 text-sm">Eye Color</Label>
                    <div className="flex gap-2 mt-1">
                      {['#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#f44336'].map(color => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 transition-all glow-border ${
                            character.avatar_config.eye_color === color 
                              ? 'border-yellow-400 scale-110' 
                              : 'border-slate-600 hover:border-yellow-300'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => handleAvatarConfigChange('eye_color', color)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSave}
                disabled={!character.name || saving}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 glow-border"
              >
                {saving ? "Creating..." : existingCharacter ? "Update Character" : "Create Character"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
