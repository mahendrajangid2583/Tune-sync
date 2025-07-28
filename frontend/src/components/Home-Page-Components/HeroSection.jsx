import React from "react";

const HeroSection = ({ searchQuery, setSearchQuery, toggleSearchPage }) => (
  <section className="my-8 rounded-xl overflow-hidden">
    <div
  className="bg-gradient-to-r from-purple-900 to-indigo-900 py-16 px-4 text-center relative sm:py-20"
  style={{
    backgroundImage:
      "linear-gradient(rgba(76, 29, 149, 0.7), rgba(30, 27, 75, 0.9)), url('/api/placeholder/1200/500')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
    Your Music, Your Way
  </h1>
  <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto mb-6">
    Stream millions of songs and podcasts. Discover new artists and create
    the perfect playlist for every moment.
  </p>
  <div
    className="max-w-xs sm:max-w-md md:max-w-xl mx-auto flex rounded-full overflow-hidden bg-gray-800"
    onClick={(e) => {
      e.stopPropagation();
      toggleSearchPage();
    }}
  >
    <input
      type="text"
      placeholder="Search for songs, artists, or podcasts..."
      className="flex-1 py-3 px-4 bg-transparent text-white focus:outline-none text-sm"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    <button className="bg-purple-600 px-4 py-3 font-medium hover:bg-purple-700 transition-colors text-sm">
      Search
    </button>
  </div>
</div>
  </section>
);

export default HeroSection;