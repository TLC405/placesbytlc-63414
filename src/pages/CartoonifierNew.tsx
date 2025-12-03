import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Sparkles, Download, RefreshCw, Image, ArrowLeft } from "lucide-react";
import { RoleGuard } from "@/components/RoleGuard";

export default function CartoonifierNew() {
  const navigate = useNavigate();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [cartoonImage, setCartoonImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setCartoonImage(null);
      setProgress(0);
    };
    reader.readAsDataURL(file);
  };

  const generateCartoon = async () => {
    if (!originalImage) return;

    setProcessing(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const base64Data = originalImage.split(",")[1];

      const { data, error } = await supabase.functions.invoke("teefeeme-cartoonify", {
        body: { image: base64Data },
      });

      clearInterval(progressInterval);

      if (error) throw error;

      if (data?.cartoonImage) {
        setProgress(100);
        setCartoonImage(`data:image/png;base64,${data.cartoonImage}`);
        toast.success("Cartoon Generated!", {
          description: "Your cartoon is ready to download",
        });
      } else {
        throw new Error("No cartoon image returned");
      }
    } catch (error: any) {
      clearInterval(progressInterval);
      setProgress(0);
      toast.error("Generation Failed", {
        description: error.message || "Please try again",
      });
    } finally {
      setProcessing(false);
    }
  };

  const downloadCartoon = () => {
    if (!cartoonImage) return;

    const link = document.createElement("a");
    link.href = cartoonImage;
    link.download = `tlc-cartoon-${Date.now()}.png`;
    link.click();
    toast.success("Downloaded!");
  };

  const reset = () => {
    setOriginalImage(null);
    setCartoonImage(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <RoleGuard allowedRoles={['admin','alpha','beta','delta','moderator']} featureName="Cartoonifier">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="surface-raised border-b sticky top-0 z-50">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Image className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">
                    Cartoonifier
                  </h1>
                  <p className="text-sm text-muted-foreground">Transform your photos into cartoon art</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-10 max-w-4xl space-y-8">
          {/* Main Card */}
          <Card className="surface-raised shadow-lg">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Original Image */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Upload className="w-4 h-4 text-primary" />
                    Upload Your Photo
                  </h3>
                  <div
                    className="relative aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors bg-muted/30 flex items-center justify-center overflow-hidden cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {originalImage ? (
                      <img
                        src={originalImage}
                        alt="Original"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center space-y-2 p-6">
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">
                          Click to select image
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* Cartoon Result */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    Your Cartoon
                  </h3>
                  <div className="relative aspect-square rounded-lg border bg-muted/30 flex items-center justify-center overflow-hidden">
                    {cartoonImage ? (
                      <img
                        src={cartoonImage}
                        alt="Cartoon"
                        className="w-full h-full object-cover animate-fade-in"
                      />
                    ) : (
                      <div className="text-center space-y-2 p-6">
                        <Sparkles className="w-12 h-12 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">
                          Result appears here
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {processing && (
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Processing...</span>
                    <span className="text-primary font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <Button
                  onClick={generateCartoon}
                  disabled={!originalImage || processing}
                  className="min-w-[160px]"
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Cartoon
                    </>
                  )}
                </Button>

                {cartoonImage && (
                  <Button onClick={downloadCartoon} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}

                {(originalImage || cartoonImage) && (
                  <Button onClick={reset} variant="ghost">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Info */}
          <p className="text-center text-sm text-muted-foreground">
            Powered by TLC AI Systems
          </p>
        </main>
      </div>
    </RoleGuard>
  );
}
