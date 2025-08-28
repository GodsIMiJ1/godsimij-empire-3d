import React, { useState, useEffect } from "react";
import { WorldItem, Character } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  ArrowLeft, 
  Package, 
  Sword, 
  Shield, 
  Sparkles,
  Search,
  Filter,
  Star
} from "lucide-react";

export default function Inventory() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const worldItems = await WorldItem.list();
    const characters = await Character.list();
    
    setItems(worldItems);
    setCharacter(characters[0] || null);
    setLoading(false);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const rarityColors = {
    common: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    rare: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    epic: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    legendary: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
  };

  const typeIcons = {
    weapon: Sword,
    armor: Shield,
    potion: Sparkles,
    artifact: Star,
    decoration: Package
  };

  const ItemCard = ({ item }) => {
    const IconComponent = typeIcons[item.type] || Package;
    
    return (
      <Card className="hologram glow-border hover:border-purple-400/50 transition-all duration-300">
        <CardHeader className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-sm font-medium">
                  {item.name}
                </CardTitle>
                <p className="text-xs text-purple-300 capitalize">{item.type}</p>
              </div>
            </div>
            <Badge className={rarityColors[item.rarity]}>
              {item.rarity}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2">
            {item.attributes && (
              <div className="grid grid-cols-3 gap-2 text-xs">
                {item.attributes.attack > 0 && (
                  <div className="text-red-400">
                    <Sword className="w-3 h-3 inline mr-1" />
                    {item.attributes.attack}
                  </div>
                )}
                {item.attributes.defense > 0 && (
                  <div className="text-blue-400">
                    <Shield className="w-3 h-3 inline mr-1" />
                    {item.attributes.defense}
                  </div>
                )}
                {item.attributes.magic > 0 && (
                  <div className="text-purple-400">
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    {item.attributes.magic}
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-yellow-400 font-medium text-sm">
                {item.value} Gold
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-purple-300">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium">Loading inventory...</span>
        </div>
      </div>
    );
  }

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
              Inventory
            </h1>
            <p className="text-purple-300">Manage your items and equipment</p>
          </div>
        </div>

        {/* Inventory Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="hologram glow-border">
            <CardContent className="p-4 text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <p className="text-2xl font-bold text-white">{items.length}</p>
              <p className="text-sm text-purple-300">Total Items</p>
            </CardContent>
          </Card>
          <Card className="hologram glow-border">
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <p className="text-2xl font-bold text-white">
                {items.filter(i => i.rarity === 'legendary').length}
              </p>
              <p className="text-sm text-purple-300">Legendary</p>
            </CardContent>
          </Card>
          <Card className="hologram glow-border">
            <CardContent className="p-4 text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <p className="text-2xl font-bold text-white">
                {items.filter(i => i.rarity === 'epic').length}
              </p>
              <p className="text-sm text-purple-300">Epic Items</p>
            </CardContent>
          </Card>
          <Card className="hologram glow-border">
            <CardContent className="p-4 text-center">
              <div className="text-yellow-400 text-2xl font-bold mb-2">₿</div>
              <p className="text-2xl font-bold text-white">
                {items.reduce((sum, item) => sum + (item.value || 0), 0)}
              </p>
              <p className="text-sm text-purple-300">Total Value</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="hologram glow-border mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search items..."
                  className="pl-10 bg-slate-800/50 border-purple-500/30 text-white placeholder-purple-300/50"
                />
              </div>
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="md:w-auto">
                <TabsList className="bg-slate-800/50 border border-purple-500/30">
                  <TabsTrigger value="all" className="data-[state=active]:bg-purple-600/30">All</TabsTrigger>
                  <TabsTrigger value="weapon" className="data-[state=active]:bg-purple-600/30">Weapons</TabsTrigger>
                  <TabsTrigger value="armor" className="data-[state=active]:bg-purple-600/30">Armor</TabsTrigger>
                  <TabsTrigger value="potion" className="data-[state=active]:bg-purple-600/30">Potions</TabsTrigger>
                  <TabsTrigger value="artifact" className="data-[state=active]:bg-purple-600/30">Artifacts</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <Card className="hologram glow-border">
            <CardContent className="p-8 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm || selectedCategory !== "all" ? "No items found" : "Empty Inventory"}
              </h3>
              <p className="text-purple-300 mb-4">
                {searchTerm || selectedCategory !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Start your adventure to collect items and equipment"
                }
              </p>
              {!searchTerm && selectedCategory === "all" && (
                <Button
                  onClick={() => navigate(createPageUrl("World"))}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 glow-border"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Explore World
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
