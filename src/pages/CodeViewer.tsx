import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, FileCode, Search, Copy, Check, ExternalLink, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const projectStructure = {
  "src/pages": [
    "PremiumDashboard.tsx", "Quizzes.tsx", "QuizLove.tsx", "QuizMBTI.tsx",
    "CartoonifierNew.tsx", "PeriodTracker.tsx", "AdminPanel.tsx", "NotFound.tsx"
  ],
  "src/components": [
    "Header.tsx", "PlaceCard.tsx", "SearchBar.tsx", "FilterBar.tsx",
    "DetailedCupid.tsx", "ActivityTracker.tsx", "DarkModeToggle.tsx"
  ],
  "src/hooks": [
    "useGoogleMaps.ts", "useGeolocation.ts", "usePlacesSearch.ts", "use-mobile.tsx"
  ],
  "src/lib": [
    "googleMaps.ts", "midpointCalculator.ts", "utils.ts", "storage.ts", "secureStorage.ts"
  ]
};

export default function CodeViewer() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const repoUrl = "https://github.com/lovable-dev/placesbytlc";
  const rawBaseUrl = "https://raw.githubusercontent.com/lovable-dev/placesbytlc/main";

  const handleCopyLink = (file: string, folder: string) => {
    const link = `${rawBaseUrl}/${folder}/${file}`;
    navigator.clipboard.writeText(link);
    setCopiedFile(file);
    toast.success("Link copied!");
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const filteredStructure = Object.entries(projectStructure).reduce((acc, [folder, files]) => {
    const filtered = files.filter(file => 
      file.toLowerCase().includes(searchQuery.toLowerCase()) ||
      folder.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[folder] = filtered;
    }
    return acc;
  }, {} as typeof projectStructure);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="surface-raised border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Code2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">
                    Source Code
                  </h1>
                  <p className="text-sm text-muted-foreground">React, TypeScript & Lovable</p>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => window.open(repoUrl, "_blank")}>
              <ExternalLink className="w-4 h-4 mr-2" />
              GitHub
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-4xl space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search files and folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="structure" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="structure">File Structure</TabsTrigger>
            <TabsTrigger value="tech">Tech Stack</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="structure" className="mt-6">
            <Card className="surface-raised">
              <CardContent className="p-0">
                <ScrollArea className="h-[500px] p-4">
                  {Object.entries(filteredStructure).map(([folder, files]) => (
                    <div key={folder} className="mb-6">
                      <h3 className="font-semibold text-sm mb-2 flex items-center gap-2 text-muted-foreground">
                        <FileCode className="w-4 h-4" />
                        {folder}
                      </h3>
                      <div className="space-y-1 ml-6">
                        {files.map((file) => (
                          <div 
                            key={file}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <code className="text-sm">{file}</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyLink(file, folder)}
                            >
                              {copiedFile === file ? (
                                <Check className="w-4 h-4 text-success" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tech" className="mt-6">
            <Card className="surface-raised">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Frontend</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                    <li>• React 18 with TypeScript</li>
                    <li>• Vite build tool</li>
                    <li>• React Router for navigation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Styling</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                    <li>• Tailwind CSS</li>
                    <li>• shadcn/ui components</li>
                    <li>• Lucide icons</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Backend</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                    <li>• Supabase database & auth</li>
                    <li>• Edge Functions</li>
                    <li>• Google Maps API</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="mt-6">
            <Card className="surface-raised">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Core Features</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                    <li>• Smart place discovery</li>
                    <li>• Geolocation & midpoint calculation</li>
                    <li>• Date planning tools</li>
                    <li>• Dark mode support</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Fun Features</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                    <li>• Love language quiz</li>
                    <li>• MBTI personality test</li>
                    <li>• Period tracker</li>
                    <li>• Cartoon generator</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info Card */}
        <Card className="surface-raised border-dashed">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center">
              Open source • Built with Lovable
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
