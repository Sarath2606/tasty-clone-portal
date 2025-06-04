
export const Categories = () => {
  const categories = [
    { name: "Tiffins", icon: "🍱", color: "bg-purple-900" },
    { name: "Salads", icon: "🥗", color: "bg-red-900" },
    { name: "Beverages", icon: "☕", color: "bg-brown-900" },
    { name: "Drinks", icon: "🥤", color: "bg-pink-900" }
  ];

  return (
    <section className="bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Explore Our <span className="text-green-500">Categories</span>
          </h2>
          <p className="text-gray-300 text-lg">
            From delicious tiffins to refreshing drinks, we have something for every taste
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div 
              key={index}
              className={`${category.color} rounded-2xl p-8 text-center hover:scale-105 transition-transform cursor-pointer border border-gray-700`}
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="text-white text-xl font-semibold">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
