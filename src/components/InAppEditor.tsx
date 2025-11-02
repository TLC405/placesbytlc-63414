import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit3, X, Check, Wand2 } from "lucide-react";
import { toast } from "sonner";

export const InAppEditor = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      toast.success("🎨 Edit Mode Activated! Click any element to modify it.");
      document.body.classList.add('edit-mode');
    } else {
      toast.info("Edit Mode Deactivated");
      document.body.classList.remove('edit-mode');
    }
  };

  return (
    <>
      {/* Floating Edit Button */}
      <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2">
        <Button
          onClick={toggleEditMode}
          size="lg"
          className={`rounded-full w-14 h-14 shadow-2xl transition-all duration-300 ${
            isEditing 
              ? 'bg-green-500 hover:bg-green-600 animate-pulse' 
              : 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
          }`}
          title={isEditing ? "Exit Edit Mode" : "Enter Edit Mode"}
        >
          {isEditing ? (
            <Check className="w-6 h-6" />
          ) : (
            <Edit3 className="w-6 h-6" />
          )}
        </Button>

        {isEditing && (
          <Button
            onClick={() => setShowHelp(true)}
            size="sm"
            variant="secondary"
            className="rounded-full shadow-lg"
          >
            <Wand2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Edit Mode Indicator */}
      {isEditing && (
        <div className="fixed top-6 right-6 z-[999] bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
          <Edit3 className="w-4 h-4" />
          <span className="text-sm font-bold">EDIT MODE ACTIVE</span>
        </div>
      )}

      {/* Help Dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-500" />
              How to Use In-App Editor
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Step 1: Activate</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Click the purple edit button to enter edit mode
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Step 2: Select</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Hover over any element - it will highlight with a blue border
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Step 3: Edit</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Click the element to edit text, colors, or properties
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Step 4: Save</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Click the green check button to save your changes
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Mode Styles */}
      <style>{`
        .edit-mode * {
          cursor: pointer !important;
        }
        
        .edit-mode *:hover {
          outline: 2px dashed #3b82f6 !important;
          outline-offset: 2px !important;
          background-color: rgba(59, 130, 246, 0.05) !important;
        }
        
        .edit-mode button:hover,
        .edit-mode a:hover {
          outline-color: #8b5cf6 !important;
        }
      `}</style>
    </>
  );
};
