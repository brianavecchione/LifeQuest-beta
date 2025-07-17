import React, { useEffect } from 'react';
import LandingNavbar from '@/components/LandingNavbar';

const PrivacyPolicy = () => {
  // Add landing-page class to body for proper spacing
  useEffect(() => {
    document.body.classList.add('landing-page');
    
    // Cleanup when component unmounts
    return () => {
      document.body.classList.remove('landing-page');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      <LandingNavbar />
      
      <div className="relative z-10 container mx-auto px-4 py-24 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 space-y-8">
            <div>
              <p className="text-slate-300 mb-6">
                <strong>Effective Date:</strong> January 17, 2025
              </p>
              <p className="text-slate-300 mb-6">
                At LifeQuest, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our productivity platform.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">1. Information We Collect</h2>
              <div className="space-y-4 text-slate-300">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Email address (for account creation and authentication)</li>
                    <li>Display name (optional, for personalization)</li>
                    <li>Profile information you choose to provide</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Usage Data</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Quest completion data and progress tracking</li>
                    <li>Feature usage and interaction patterns</li>
                    <li>App performance and error logs</li>
                    <li>Device and browser information</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                <li>Provide and maintain the LifeQuest service</li>
                <li>Track your progress and display personalized achievements</li>
                <li>Send important service updates and notifications</li>
                <li>Improve our platform and develop new features</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Ensure platform security and prevent abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">3. Third-Party Services</h2>
              <div className="space-y-4 text-slate-300">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Authentication</h3>
                  <p>We use Google OAuth for secure authentication. When you sign in with Google, we receive your email address and basic profile information according to Google's privacy practices.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Data Storage</h3>
                  <p>Your data is securely stored using Supabase, which maintains SOC 2 Type 2 compliance and follows industry-standard security practices.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Analytics</h3>
                  <p>We may use privacy-focused analytics tools to understand how our platform is used and to improve user experience. These tools collect aggregated, non-personally identifiable data.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">4. Data Security</h2>
              <p className="text-slate-300">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">5. Your Rights</h2>
              <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data and account</li>
                <li><strong>Portability:</strong> Request your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from non-essential communications</li>
              </ul>
              <p className="text-slate-300 mt-4">
                To exercise these rights, please contact us at <a href="mailto:contact@getlifequest.com" className="text-amber-400 hover:text-amber-300">contact@getlifequest.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">6. Data Retention</h2>
              <p className="text-slate-300">
                We retain your personal information only as long as necessary to provide our services and fulfill the purposes outlined in this policy. When you delete your account, we will delete your personal data within 30 days, except where retention is required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">7. Children's Privacy</h2>
              <p className="text-slate-300">
                LifeQuest is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">8. Changes to This Privacy Policy</h2>
              <p className="text-slate-300">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top. Your continued use of LifeQuest after any changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">9. Contact Us</h2>
              <p className="text-slate-300">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                <p className="text-slate-300">
                  <strong>Email:</strong> <a href="mailto:contact@getlifequest.com" className="text-amber-400 hover:text-amber-300">contact@getlifequest.com</a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;