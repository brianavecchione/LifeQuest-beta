import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useGuest } from '@/contexts/GuestContext';
import { LogIn, X } from 'lucide-react';

const GuestModeIndicator = () => {
  const { isGuestMode, disableGuestMode } = useGuest();
  const navigate = useNavigate();

  if (!isGuestMode) return null;

  const handleSignUp = () => {
    disableGuestMode();
    navigate('/auth');
  };

  const handleDismiss = () => {
    // Keep guest mode but hide the banner temporarily
  };

  return (
    <Card className="mx-4 mb-4 bg-gradient-to-r from-amber-900/50 to-yellow-900/50 border-amber-600/50 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">👤</span>
              <div>
                <h3 className="text-amber-200 font-semibold text-sm">Guest Mode Active</h3>
                <p className="text-amber-300/80 text-xs">
                  You're exploring with sample data. Progress won't be saved.
                </p>
              </div>
            </div>
          </div>
           
          {/* Sign Up button - hidden temporarily but code preserved for later */}
          {false && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-1 h-auto"
                onClick={handleSignUp}
              >
                <LogIn className="w-3 h-3 mr-1" />
                Sign Up to Save
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestModeIndicator;
