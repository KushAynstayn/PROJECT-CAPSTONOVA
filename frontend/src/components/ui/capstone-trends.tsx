// src/components/CapstoneTrends.tsx
const CapstoneTrends = () => {
  return (
    <section className="container mx-auto px-6 py-10 bg-red-900/20 my-10 rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-8">Capstone Trends</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
        <div className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700">Web Applications</div>
        <div className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700">Mobile Applications</div>
        <div className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700">Transaction Systems</div>
        <div className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700">Inventory Systems</div>
      </div>
    </section>
  );
};
export default CapstoneTrends;