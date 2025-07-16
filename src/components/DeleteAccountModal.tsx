import React, { useState } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'warning' | 'confirm' | 'processing' | 'success'>('warning');
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleClose = () => {
    if (step !== 'processing') {
      setStep('warning');
      setConfirmationText('');
      onClose();
    }
  };

  const handleFirstConfirmation = () => {
    setStep('confirm');
  };

  const handleDeleteAccount = async () => {
    if (confirmationText.toUpperCase() !== 'DELETE') {
      toast({
        title: "Confirmation Error",
        description: "Please type 'DELETE' to confirm account deletion.",
        variant: "destructive"
      });
      return;
    }

    setIsDeleting(true);
    setStep('processing');

    try {
      // Get current session for authorization
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found');
      }

      // Call the delete account Edge Function
      const { data, error } = await supabase.functions.invoke('delete-account', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      // Show success state
      setStep('success');
      
      // Auto-redirect after 3 seconds
      setTimeout(async () => {
        await signOut();
        // Redirect will be handled by the auth context
      }, 3000);

    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Deletion Failed",
        description: "Failed to delete account. Please try again or contact support.",
        variant: "destructive"
      });
      setStep('warning');
      setIsDeleting(false);
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'warning':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                Delete Account
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-red-400 mb-2">⚠️ This action cannot be undone</h4>
                <p className="text-slate-300 text-sm">
                  Deleting your account will permanently remove:
                </p>
                <ul className="list-disc list-inside text-slate-300 text-sm mt-2 space-y-1">
                  <li>All your quests and quest history</li>
                  <li>Achievements and badges</li>
                  <li>Streaks and progress tracking</li>
                  <li>XP, levels, and gold</li>
                  <li>Inventory items and rewards</li>
                  <li>Party memberships and data</li>
                  <li>All settings and preferences</li>
                </ul>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-400 mb-2">📧 Need help instead?</h4>
                <p className="text-slate-300 text-sm">
                  If you're having issues with the app, consider reaching out to support first. 
                  Most problems can be resolved without deleting your account.
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleFirstConfirmation}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                I understand, continue
              </Button>
            </div>
          </>
        );

      case 'confirm':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-400">
                <Trash2 className="w-5 h-5" />
                Final Confirmation
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <p className="text-slate-300 text-sm mb-3">
                  This is your final chance to cancel. Type <strong className="text-red-400">DELETE</strong> below to confirm:
                </p>
                <Input
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setStep('warning')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={confirmationText.toUpperCase() !== 'DELETE'}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50"
              >
                Delete Account
              </Button>
            </div>
          </>
        );

      case 'processing':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-amber-400">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-400"></div>
                Processing Deletion
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-8">
              <div className="text-center">
                <p className="text-slate-300 mb-4">
                  Deleting your account and all associated data...
                </p>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-sm text-slate-400">
                    This may take a few moments. Please do not close this window.
                  </p>
                </div>
              </div>
            </div>
          </>
        );

      case 'success':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-400">
                ✅ Account Deleted
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-8">
              <div className="text-center">
                <p className="text-slate-300 mb-4">
                  Your account has been successfully deleted.
                </p>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <p className="text-sm text-green-400">
                    Thanks for questing with us! You'll be redirected shortly.
                  </p>
                </div>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountModal;