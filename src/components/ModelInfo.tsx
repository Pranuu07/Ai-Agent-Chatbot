
import { Info, Download, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ModelInfo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Info className="h-4 w-4" />
          <span className="sr-only">Model Setup Info</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Model Information</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Alert>
            <Download className="h-4 w-4" />
            <AlertDescription>
              <strong>Available Models:</strong> Gemini 2.0 Flash and Groq Llama - Cloud-based models ready to use
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Current Available Models</h3>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">Gemini 2.0 Flash</h4>
                <p className="text-sm text-muted-foreground">Google's latest and most capable model with fast processing</p>
              </div>
              
              <div>
                <h4 className="font-medium">Groq Llama</h4>
                <p className="text-sm text-muted-foreground">High-speed inference model optimized for performance</p>
              </div>
            </div>
            
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertDescription>
                <strong>Note:</strong> Both models are cloud-based and require no local installation. API keys are configured on the backend.
              </AlertDescription>
            </Alert>
          </div>
          
          {/* Commented out local model section
          <div className="space-y-4 opacity-50">
            <h3 className="text-lg font-semibold">Local Models (Not Available)</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">Phi3 Mini (Local) - Disabled</h4>
                <p className="text-sm text-muted-foreground">Local processing requires Ollama installation</p>
              </div>
            </div>
          </div>
          */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
