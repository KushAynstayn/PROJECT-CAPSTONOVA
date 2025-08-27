// src/components/AboutSection.tsx
const AboutSection = () => {
  return (
    <section className="container mx-auto px-6 py-10">
      <div className="flex flex-col lg:flex-row items-center gap-10">
        <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-4">About Project Capstonova</h2>
            <p className="text-gray-400">
                Project Capstonova is a smart, secure platform designed to streamline capstone project management at its core... (add the rest of your text here).
            </p>
        </div>
        <div className="lg:w-1/2 h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
          {/* TODO: Add the illustration from your prototype */}
          <p>Illustration Area</p>
        </div>
      </div>
    </section>
  );
};
export default AboutSection;