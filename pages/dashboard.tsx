import React, { useState, useEffect } from "react";
import { Character, Companion, WorldItem } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  User, 
  Bot, 
  Zap, 
  Heart, 
  Shield, 
  Sword, 
  Brain,
  Plus,
  Sparkles,
  Globe
} from "lucide-react";

export default function Dashboard() {
  const [character, setCharacter] = useState(null);
  const [companion, setCompanion] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const characters = await Character.list();
    const companions = await Companion.list();
    const worldItems = await WorldItem.list();
    
    setCharacter(characters[0] || null);
    setCompanion(companions[0] || null);
    setItems(worldItems);
    setLoading(false);
  };

  const getExperiencePercent = (exp) => {
    const nextLevel = character?.level * 100 || 100;
    return ((exp || 0) / nextLevel) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-purple-300">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium">Loading your realm...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white neon-glow mb-2">
              Welcome to NexusRealm
            </h1>
            <p className="text-purple-300">Your immersive AI-powered adventure awaits</p>
          </div>
          <div className="flex gap-3">
            <Link to={createPageUrl("World")}>
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 border border-purple-500/30 glow-border">
                <Globe className="w-4 h-4 mr-2" />
                Enter World
              </Button>
            </Link>
          </div>
        </div>

        {!character && !companion && (
          <Card className="hologram glow-border mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Get Started
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-200 mb-4">
                Welcome, new traveler! Create your avatar and AI companion to begin your journey.
              </p>
              <div className="flex gap-3">
                <Link to={createPageUrl("AvatarCreator")}>
                  <Button variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20">
                    <User className="w-4 h-4 mr-2" />
                    Create Avatar
                  </Button>
                </Link>
                <Link to={createPageUrl("Companion")}>
                  <Button variant="outline" className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20">
                    <Bot className="w-4 h-4 mr-2" />
                    Get Companion
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Character Stats */}
          <Card className="hologram glow-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" />
                {character?.name || "Create Character"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {character ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      Level {character.level}
                    </Badge>
                    <Badge className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border border-purple-500/30">
                      {character.class}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-purple-200">
                      <span>Experience</span>
                      <span>{character.experience} / {character.level * 100}</span>
                    </div>
                    <Progress 
                      value={getExperiencePercent(character.experience)} 
                      className="h-2 bg-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-purple-200">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span className="text-sm">{character.health}</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-200">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">{character.mana}</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-200">
                      <Sword className="w-4 h-4 text-orange-400" />
                      <span className="text-sm">{character.strength}</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-200">
                      <Brain className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">{character.intelligence}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-purple-300">
                  <p className="mb-4">No character created yet</p>
                  <Link to={createPageUrl("AvatarCreator")}>
                    <Button variant="outline" className="border-purple-500/50 hover:bg-purple-500/20">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Character
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Companion Stats */}
          <Card className="hologram glow-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                {companion?.name || "AI Companion"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {companion ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                      Level {companion.level}
                    </Badge>
                    <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30">
                      {companion.type}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-cyan-200">
                      <span>Loyalty</span>
                      <span>{companion.loyalty}/100</span>
                    </div>
                    <Progress 
                      value={companion.loyalty} 
                      className="h-2 bg-slate-800"
                    />
                  </div>

                  <div className="text-sm text-cyan-200">
                    <p className="font-medium mb-1">Personality:</p>
                    <p className="text-xs opacity-80">{companion.personality}</p>
                  </div>

                  <Link to={createPageUrl("Companion")}>
                    <Button variant="outline" size="sm" className="w-full border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20">
                      Interact
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center text-cyan-300">
                  <p className="mb-4">No AI companion yet</p>
                  <Link to={createPageUrl("Companion")}>
                    <Button variant="outline" className="border-cyan-500/50 hover:bg-cyan-500/20">
                      <Plus className="w-4 h-4 mr-2" />
                      Get Companion
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="hologram glow-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Inventory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-purple-200">
                  <span>Items Owned:</span>
                  <span className="font-bold">{items.length}</span>
                </div>
                <div className="flex justify-between text-purple-200">
                  <span>Rare Items:</span>
                  <span className="font-bold text-purple-400">
                    {items.filter(item => item.rarity === 'rare' || item.rarity === 'epic').length}
                  </span>
                </div>
                <div className="flex justify-between text-purple-200">
                  <span>Total Value:</span>
                  <span className="font-bold text-yellow-400">
                    {items.reduce((sum, item) => sum + (item.value || 0), 0)} Gold
                  </span>
                </div>
                <Link to={createPageUrl("Inventory")}>
                  <Button variant="outline" size="sm" className="w-full border-green-500/50 text-green-300 hover:bg-green-500/20 mt-4">
                    View Inventory
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="hologram glow-border">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-purple-300 py-8">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Your adventures will appear here as you explore NexusRealm</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
