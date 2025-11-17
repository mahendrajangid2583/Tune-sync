const arrayFromObjectMap = (maybeObject) => {
  if (!maybeObject || typeof maybeObject !== "object") {
    return [];
  }

  return Object.keys(maybeObject).map((key) => maybeObject[key]);
};

const extractArtists = (artistsField) => {
  if (!artistsField) return "";
  if (Array.isArray(artistsField)) {
    return artistsField.filter(Boolean).join(", ");
  }
  if (Array.isArray(artistsField.primary)) {
    return artistsField.primary
      .map((artist) => artist?.name)
      .filter(Boolean)
      .join(", ");
  }
  if (Array.isArray(artistsField.contributors)) {
    return artistsField.contributors
      .map((artist) => artist?.name)
      .filter(Boolean)
      .join(", ");
  }
  return artistsField.name || artistsField.artist || "";
};

const extractImage = (track) => {
  if (!track) return null;
  if (track.coverImage) return track.coverImage;
  if (track.imageUrl) return track.imageUrl;
  if (track.albumCover) return track.albumCover;
  if (track.picture) return track.picture;
  if (typeof track.image === "string") return track.image;
  if (track.image?.cover) return track.image.cover;
  if (Array.isArray(track.image)) {
    return track.image[track.image.length - 1];
  }
  if (track.image && typeof track.image === "object") {
    const values = arrayFromObjectMap(track.image);
    const last = values[values.length - 1];
    return typeof last === "string" ? last : last?.url;
  }
  if (track.album?.cover_medium) return track.album.cover_medium;
  if (track.album?.cover) return track.album.cover;
  return null;
};

const extractAudioSource = (track) => {
  if (!track) return null;
  if (track.preview) return track.preview;
  if (track.audioSrc) return track.audioSrc;
  if (track.streamUrl) return track.streamUrl;
  if (Array.isArray(track.downloadUrl) && track.downloadUrl.length > 0) {
    return track.downloadUrl[track.downloadUrl.length - 1]?.url;
  }
  if (track.downloadUrl && typeof track.downloadUrl === "object") {
    const values = arrayFromObjectMap(track.downloadUrl);
    const last = values[values.length - 1];
    return typeof last === "string" ? last : last?.url;
  }
  return null;
};

export const buildPlayerSong = (track, fallbackImage) => {
  if (!track) return null;

  const title =
    track.title || track.name || track.song || track.label || "Unknown Title";
  const artists = extractArtists(track.artists) || track.artist || "Unknown";
  const coverImage = extractImage(track) || fallbackImage;
  const audioSrc = extractAudioSource(track);
  const duration =
    track.duration ||
    (typeof track.runtime === "number" ? Math.floor(track.runtime / 1000) : 30);
  const id = track.id || track._id || track.songId || track.permalink || null;

  return {
    title,
    artists,
    coverImage,
    image: track.image || track.imageUrl || track.albumCover || track.picture || null,
    imageUrl: track.imageUrl || null,
    albumCover: track.albumCover || track.album?.cover_medium || track.album?.cover || null,
    picture: track.picture || null,
    audioSrc,
    duration,
    id,
  };
};

export const formatTrackArtists = (track) => {
  return extractArtists(track?.artists) || "Unknown Artist";
};

