const ReleaseCard = ({ release, navigate }) => (
  <div 
    onClick={() => navigate('/playlist', { state: { playlist: release } })}
    className="bg-transparent text-center hover:bg-gray-800 rounded-lg p-2 transition-colors group cursor-pointer"
  >
    <div className="aspect-square overflow-hidden rounded-full mx-auto" style={{ width: "100%", maxWidth: "180px", height: "auto" }}>
      <img
        loading="lazy"
        src={release.imageUrl}
        alt={release.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="p-2">
      <h2 className="font-bold text-sm truncate">{release.title}</h2>
    </div>
  </div>
);

export default ReleaseCard;