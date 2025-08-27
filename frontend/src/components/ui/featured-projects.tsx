// src/components/FeaturedProjects.tsx
const FeaturedProjects = () => {
  return (
    <section className="container mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">Featured Capstone Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* TODO: Map over actual project data here */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">Project Card 1</div>
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">Project Card 2</div>
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">Project Card 3</div>
      </div>
    </section>
  );
};
export default FeaturedProjects;