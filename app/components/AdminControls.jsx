import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Settings, Lock, Database, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminControls = ({ chatID, isPermanent, onSettingsChange }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const { toast } = useToast();

  const verifyPassword = () => {
    const isValid = password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    setIsPasswordVerified(isValid);
    
    if (isValid) {
      toast({
        title: "Success",
        description: "Admin access granted",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Invalid admin password"
      });
      setPassword('');
    }
  };

  const handleStorageToggle = async () => {
    if (!isPasswordVerified) return;

    setLoading(true);
    try {
      const action = isPermanent ? 'makeTemporary' : 'makePermanent';
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action, 
          chatID, 
          password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast({
        title: "Success",
        description: data.message
      });
      onSettingsChange?.();
      setOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setLoading(false);
      setPassword('');
      setIsPasswordVerified(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setPassword('');
    setIsPasswordVerified(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          
          className="bg-[#18181b] hover:bg-[#27272a] transition-all duration-200"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="dark border-border bg-[#09090b] text-foreground w-[95%] md:w-full max-w-lg mx-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Database className="h-5 w-5" />
            Storage Settings
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Configure chat storage persistence. Permanent storage prevents automatic deletion.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium flex items-center gap-2 text-foreground">
                <Lock className="h-4 w-4" />
                Admin Password
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setIsPasswordVerified(false);
                  }}
                  className="bg-[#18181b] border-input focus-visible:ring-primary"
                  disabled={isPasswordVerified}
                />
                <Button
                  onClick={verifyPassword}
                  disabled={!password || isPasswordVerified}
                  variant={isPasswordVerified ? "success" : "secondary"}
                  className="gap-2 whitespace-nowrap"
                >
                  {isPasswordVerified ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Verified
                    </>
                  ) : (
                    "Verify"
                  )}
                </Button>
              </div>
            </div>
            
            <div className={`flex items-center justify-between space-x-2 bg-[#18181b] p-4 rounded-lg ${!isPasswordVerified && 'opacity-50'}`}>
              <div className="space-y-0.5">
                <label className="text-sm font-medium text-foreground">Permanent Storage</label>
                <p className="text-xs text-muted-foreground">
                  {isPermanent ? "Chat will be stored permanently" : "Chat will be deleted after 24 hours"}
                </p>
              </div>
              <Switch
                checked={isPermanent}
                onCheckedChange={handleStorageToggle}
                disabled={loading || !isPasswordVerified}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="bg-[#18181b] hover:bg-[#27272a] w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminControls; 