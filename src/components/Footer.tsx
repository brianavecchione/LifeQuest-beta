import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto relative z-10 pb-4">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div 
          className="bg-[#1F2C40]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl"
          style={{
            boxShadow: '0 8px 32px rgba(31, 44, 64, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="container mx-auto px-6 py-8">
            {/* Contact Section */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-amber-400 mb-4">Get in Touch</h3>
              <p className="text-slate-300 mb-6 max-w-md mx-auto">
                Questions or feedback? We'd love to hear from you!
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* Email Button */}
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-amber-500/30 bg-amber-600/10 text-amber-400 hover:bg-amber-600/20 hover:text-amber-300"
                >
                  <a href="mailto:contact@getlifequest.com">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Us
                  </a>
                </Button>
                
                {/* Request Feature Button */}
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-amber-500/30 bg-amber-600/10 text-amber-400 hover:bg-amber-600/20 hover:text-amber-300"
                >
                  <a href="https://tally.so/r/m66jGA" target="_blank" rel="noopener noreferrer">
                    🔧 Request a Feature
                  </a>
                </Button>
                
                {/* Contact Support Button */}
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-amber-500/30 bg-amber-600/10 text-amber-400 hover:bg-amber-600/20 hover:text-amber-300"
                >
                  <a href="https://tally.so/r/wb1jM6" target="_blank" rel="noopener noreferrer">
                    📩 Contact Support
                  </a>
                </Button>
              </div>
            </div>
            
            {/* Copyright and Legal Links */}
            <div className="text-center mt-8 pt-6 border-t border-slate-800">
              <p className="text-slate-500 text-sm mb-3">
                © 2025 LifeQuest. All rights reserved.
              </p>
              <div className="flex items-center justify-center gap-6">
                <a 
                  href="/privacy-policy" 
                  className="text-slate-400 hover:text-amber-400 text-sm transition-colors duration-200"
                >
                  Privacy Policy
                </a>
                <a 
                  href="/terms-conditions" 
                  className="text-slate-400 hover:text-amber-400 text-sm transition-colors duration-200"
                >
                  Terms & Conditions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;