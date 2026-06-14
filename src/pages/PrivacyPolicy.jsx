export default function PrivacyPolicy() {
  return (
    <div style={{ padding: '20px', maxWidth: 700, margin: '0 auto' }}>
      <h1 className="page-title">Privacy Policy</h1>
      <p className="page-subtitle">KrishiMitra+ — Last updated June 2026</p>

      <div className="card">
        <h3>Information We Collect</h3>
        <p>We collect your name, phone number, location (village/district/state), farm details, and skills information that you provide during registration, to connect farmers and agricultural workers.</p>

        <h3 style={{ marginTop: 16 }}>How We Use Your Information</h3>
        <p>Your information is used solely to match farmers with workers, provide crop disease detection results, and improve our services. We do not sell your data to third parties.</p>

        <h3 style={{ marginTop: 16 }}>Google Sign-In</h3>
        <p>If you sign in with Google, we receive your name and email address to create your account. We do not access any other Google account data.</p>

        <h3 style={{ marginTop: 16 }}>Data Storage</h3>
        <p>Your data is securely stored using Supabase. You may request deletion of your account and data at any time by contacting us.</p>

        <h3 style={{ marginTop: 16 }}>Contact</h3>
        <p>For questions about this policy, contact: krishimitraplus@gmail.com</p>
      </div>
    </div>
  )
}