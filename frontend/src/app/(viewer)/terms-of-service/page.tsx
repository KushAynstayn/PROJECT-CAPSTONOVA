// src/app/terms-of-service/page.tsx

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-black text-gray-300 py-24">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-4xl font-bold text-center text-white">
          Terms of Service
        </h1>
        <p className="mb-6 text-center text-sm text-gray-400">
          Last Updated: October 21, 2025
        </p>

        <div className="space-y-8">
          <p className="text-lg">
            Welcome to Project Capstonova! By accessing or using our website and
            services, you agree to be bound by these Terms of Service ("Terms").
          </p>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-yellow-400">
              1. Our Service
            </h2>
            <p>
              Project Capstonova is an academic capstone project developed by
              students at <strong>Cebu Technological University</strong>. Our system
              provides a platform for{" "}
              <strong>
                uploading capstone projects, searching capstone projects, archiving capstone projects securely, analyzing capstone
                trends, and generating suggestions for future capstone ideas
              </strong>
              . As this is an academic project, the service is provided "as-is"
              and may be modified or discontinued at any time.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-yellow-400">
              2. User Accounts
            </h2>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>
                <strong>Eligibility:</strong> You must be a student, faculty
                member, or authorized user to create an account.
              </li>
              <li>
                <strong>Responsibility:</strong> You are responsible for keeping
                your password secret and for all activity that occurs under your
                account.
              </li>
              <li>
                <strong>Purpose:</strong> Accounts are for academic and
                non-commercial use only.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-yellow-400">
              3. User-Generated Content
            </h2>
            <p className="mb-2">
              If our system allows you to submit content (such as project files,
              abstracts, or suggestions):
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>
                <strong>Ownership:</strong> You retain ownership of the
                intellectual property rights in the content you submit.
              </li>
              <li>
                <strong>License:</strong> By submitting content, you grant
                Project Capstonova a temporary, non-exclusive, worldwide,
                royalty-free license to use, host, display, and distribute your
                content{" "}
                <strong>
                  solely for the purpose of operating, demonstrating, and
                  evaluating this academic project.
                </strong>
              </li>
              <li>
                <strong>Responsibility:</strong> You agree not to upload any
                content that is illegal, plagiarized, or infringes on the rights
                of others.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-yellow-400">
              4. Acceptable Use
            </h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Use the service for any illegal or commercial purpose.</li>
              <li>
                Attempt to hack, reverse-engineer, or compromise the system's
                security.
              </li>
              <li>Upload viruses or malicious code.</li>
              <li>Harass other users or submit spam.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-yellow-400">
              5. Disclaimer of Warranties
            </h2>
            <p>
              Project Capstonova is a student project. The service is provided
              "as-is" without any warranties, express or implied. We do not
              guarantee that the service will be secure, error-free, or always
              available.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-yellow-400">
              6. Limitation of Liability
            </h2>
            <p>
              As this is a non-commercial academic project, the student
              developers and <strong>Cebu Technological University</strong> will not be
              liable for any damages or losses (including data loss) arising
              from your use of this service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-yellow-400">
              7. Governing Law
            </h2>
            <p>
              These Terms shall be governed by the rules and policies of{" "}
              <strong>Cebu Technological University</strong>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}