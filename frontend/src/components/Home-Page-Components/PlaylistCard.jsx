const PlaylistCard = ({ playlist, navigate }) => (
  <div
    onClick={() => navigate('/playlist', { state: { playlist } })}
    className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors group cursor-pointer"
  >
    <div className="aspect-square overflow-hidden">
      <img
        loading="lazy"
        src={playlist.imageUrl}
        alt={playlist.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="p-2">
      <h3 className="font-bold text-xs sm:text-sm truncate">{playlist.title}</h3>
      <p className="text-gray-400 text-[8px] font-thin sm:text-xs mt-1 line-clamp-2">{playlist.description}</p>
    </div>
  </div>
);

export default PlaylistCard;