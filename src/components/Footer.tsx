import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Wrench, HelpCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 mt-auto">
      <div className="container mx-auto px-4 py-8">
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
                <Wrench className="w-4 h-4 mr-2" />
                Request a Feature
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
                <HelpCircle className="w-4 h-4 mr-2" />
                Contact Support
              </a>
            </Button>
          </div>
        </div>
        
        {/* Copyright or additional info */}
        <div className="text-center mt-8 pt-6 border-t border-slate-800">
          <p className="text-slate-500 text-sm">
            © 2025 LifeQuest. Turn your daily tasks into epic adventures.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;