// src/app/privacy-policy/page.tsx

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-black text-gray-300 py-24">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-4xl font-bold text-center text-white">
          Privacy Policy
        </h1>
        <p className="mb-6 text-center text-sm text-gray-400">
          Last Updated: October 21, 2025
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-yellow-400">
              1. Introduction
            </h2>
            <p>
              Welcome to Project Capstonova. We are students at{" "}
              <strong>Cebu Technological University</strong> committed to protecting
              your privacy. This policy applies to our academic project and is
              not intended for a commercial service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-yellow-400">
              2. Information We Collect
            </h2>
            <p className="mb-2">
              We may collect the following types of information:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>
                <strong>Personal Information:</strong> Your name, email address,
                student/faculty ID number, and other details you provide when you
                register for an account.
              </li>
              <li>
                <strong>Usage Data:</strong> We collect anonymized or aggregated
                data about how you interact with our service (e.g., search
                queries, pages visited). This data is used for our "Data
                Analytics" feature to study capstone research trends.
              </li>
              <li>
                <strong>User Content:</strong> Any files or text you voluntarily
                upload, such as project abstracts or suggestions.
              </li>
              <li>
                <strong>Cookies:</strong> We may use session cookies to keep you
                logged in and understand site usage.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-yellow-400">
              3. How We Use Your Information
            </h2>
            <p className="mb-2">
              We use your information for academic purposes only:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>
                To provide and maintain the core functions of the Project
                Capstonova system.
              </li>
              <li>
                To create anonymized and aggregated datasets for analysis, which
                is a key part of our project's "Data Analytics" feature.
              </li>
              <li>
                To communicate with you about your account or respond to your
                suggestions.
              </li>
              <li>
                To fulfill our project requirements for our advisers and panel.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-yellow-400">
              4. How We Share Your Information
            </h2>
            <p className="mb-2">Your privacy is a priority.</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>
                <strong>We will never sell your personal data.</strong>
              </li>
              <li>
                <strong>Academic Demonstration:</strong> We may share
                <strong>anonymized and aggregated data</strong> (e.g., "most
                common search terms") with our project adviser, evaluation
                panel, or in our final project documentation.
              </li>
              <li>
                <strong>No Third Parties:</strong> We will not share your
                personal information with any third-party advertisers or
                marketers.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-yellow-400">
              5. Data Security
            </h2>
            <p>
              We implement reasonable security measures (such as password
              hashing and access controls) to protect your information. However,
              as this is a student project, we cannot guarantee absolute
              security.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-yellow-400">
              6. Data Retention
            </h2>
            <p>
              We will only store your personal data for the duration of our
              capstone project. All personal data will be securely deleted after{" "} 
              <strong>
                the end of school year.
              </strong>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-yellow-400">
              7. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy or wish to have
              your data removed, please contact us at{" "}
              <strong>
                projectcapstonova@ctu.edu.ph
              </strong>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}