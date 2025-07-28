import React from "react"; 
import GenreTile from "./GenreTile";
const GenresSection = ({ genres }) => (
  <section className="my-10">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold">Browse Genres</h2>
      <a href="#" className="text-purple-500 hover:text-purple-400 font-medium">
        View All
      </a>
    </div>

    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {genres.map((genre, index) => (
        <GenreTile key={index} genre={genre} />
      ))}
    </div>
  </section>
);
export default GenresSection;