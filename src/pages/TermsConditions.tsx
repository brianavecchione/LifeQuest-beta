import React, { useEffect } from 'react';
import LandingNavbar from '@/components/LandingNavbar';

const TermsConditions = () => {
  // Add landing-page class to body for proper spacing
  useEffect(() => {
    document.body.classList.add('landing-page');
    
    // Cleanup when component unmounts
    return () => {
      document.body.classList.remove('landing-page');
    };
  }, []);

  return (
    <div className="text-white">
      <LandingNavbar />
      
      <div className="relative z-10 container mx-auto px-4 pt-36 pb-12">{/* Added more padding at the top */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
            Terms & Conditions
          </h1>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 space-y-8">
            <div>
              <p className="text-slate-300 mb-6">
                <strong>Effective Date:</strong> July 17, 2025
              </p>
              <p className="text-slate-300 mb-6">
                Welcome to LifeQuest. These Terms & Conditions ("Terms") govern your use of our productivity platform and services. By accessing or using LifeQuest, you agree to be bound by these Terms.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-300">
                By creating an account or using LifeQuest, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">2. Description of Service</h2>
              <p className="text-slate-300 mb-4">
                LifeQuest is a gamified productivity platform that helps users track and complete daily tasks, build habits, and achieve personal goals through game-like elements including experience points, achievements, and progress tracking.
              </p>
              <p className="text-slate-300">
                We reserve the right to modify, suspend, or discontinue any aspect of the service at any time, with or without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">3. User Responsibilities</h2>
              <div className="space-y-4 text-slate-300">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Account Security</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>You are responsible for maintaining the confidentiality of your account</li>
                    <li>You must provide accurate and complete information</li>
                    <li>You must promptly update any changes to your information</li>
                    <li>You are responsible for all activities under your account</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Appropriate Use</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Use the service only for lawful purposes</li>
                    <li>Respect other users and maintain a positive community</li>
                    <li>Do not share inappropriate or harmful content</li>
                    <li>Report any bugs or security vulnerabilities responsibly</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">4. Acceptable Use Policy</h2>
              <p className="text-slate-300 mb-4">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                <li>Interfere with or disrupt the service or servers</li>
                <li>Upload malicious code, viruses, or harmful software</li>
                <li>Harvest or collect user information without consent</li>
                <li>Impersonate others or provide false information</li>
                <li>Use automated systems to access the service without permission</li>
                <li>Reverse engineer, decompile, or attempt to extract source code</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">5. Account Termination</h2>
              <div className="space-y-4 text-slate-300">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">By You</h3>
                  <p>You may terminate your account at any time by contacting us or using the account deletion feature in your settings.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">By Us</h3>
                  <p>We may suspend or terminate your account if you violate these Terms, engage in fraudulent activity, or for any other reason at our sole discretion. We will provide reasonable notice when possible.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Effect of Termination</h3>
                  <p>Upon termination, your right to use the service will cease immediately. We may retain certain information as required by law or for legitimate business purposes.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">6. Intellectual Property</h2>
              <div className="space-y-4 text-slate-300">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Our Rights</h3>
                  <p>The LifeQuest platform, including its design, features, and content, is owned by us and protected by intellectual property laws. You may not copy, modify, or distribute our intellectual property without permission.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Your Content</h3>
                  <p>You retain ownership of the content you create (such as quest descriptions and personal notes). By using our service, you grant us a license to use, store, and display your content solely to provide the service.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">7. Disclaimer of Warranties</h2>
              <p className="text-slate-300">
                LifeQuest is provided "as is" and "as available" without warranties of any kind. We do not guarantee that the service will be uninterrupted, error-free, or meet your specific requirements. We disclaim all warranties, express or implied, including warranties of merchantability and fitness for a particular purpose.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">8. Limitation of Liability</h2>
              <p className="text-slate-300">
                To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses, resulting from your use of the service. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">9. Indemnification</h2>
              <p className="text-slate-300">
                You agree to indemnify and hold us harmless from any claims, damages, losses, or expenses (including legal fees) arising from your use of the service, violation of these Terms, or infringement of any rights of another party.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">10. Governing Law</h2>
              <p className="text-slate-300">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which LifeQuest operates, without regard to conflict of law principles. Any disputes shall be resolved in the courts of that jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">11. Changes to Terms</h2>
              <p className="text-slate-300">
                We may update these Terms from time to time to reflect changes in our service or legal requirements. We will notify you of material changes by posting the updated Terms on our platform and updating the "Effective Date." Your continued use after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">12. Severability</h2>
              <p className="text-slate-300">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue to be valid and enforceable to the fullest extent permitted by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-amber-400 mb-4">13. Contact Information</h2>
              <p className="text-slate-300">
                If you have any questions about these Terms & Conditions, please contact us at:
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

export default TermsConditions;