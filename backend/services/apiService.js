// deezer-client.js
const axios = require('axios');
const DEEZER = 'https://api.deezer.com';

/* ------------------------
   Simple in-memory cache
   ------------------------ */
const cache = {};
function setCache(key, value, ttlSeconds = 60) {
  cache[key] = { value, expiresAt: Date.now() + ttlSeconds * 1000 };
}
function getCache(key) {
  const entry = cache[key];
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    delete cache[key];
    return null;
  }
  return entry.value;
}

/* ------------------------
   Helpers
   ------------------------ */
function shuffle(arr) {
  const a = arr ? arr.slice() : [];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function uniqueById(items) {
  const seen = new Set();
  return (items || []).filter(it => {
    if (!it || !it.id) return false;
    if (seen.has(String(it.id))) return false;
    seen.add(String(it.id));
    return true;
  });
}

/* ------------------------
   Curated playlist IDs (optional)
   Replace with playlist IDs you like (numbers)
   ------------------------ */
const CURATED_PLAYLIST_IDS = [
  // Example IDs — replace with real Deezer playlist IDs you prefer
  123456789, // Bollywood Hits (example)
  234567890, // Hindi Top Songs
  345678901, // Punjabi Party
];

const CURATED_ARTIST_IDS = [
  // optional — replace with artist IDs you like
  13,        // e.g., Eminem (example)
  412,       // placeholder IDs — replace with real ones you prefer
  27
];

/* ------------------------
   1) SEARCH SONGS (Deezer)
   fetchSongs(query) -> { tracks: [...] }
   ------------------------ */
const normalizeTrack = (t) => ({
  id: t.id,
  title: t.title,
  artists: t.artist ? [t.artist.name] : [],
  album: t.album?.title || null,
  duration: t.duration,
  preview: t.preview,
  link: t.link,
  image: t.album?.cover_medium || t.album?.cover,
});

const normalizeArtist = (a) => ({
  id: a.id,
  name: a.name,
  picture: a.picture_medium || a.picture || a.picture_big,
  nb_fan: a.nb_fan,
  link: a.link,
  radio: a.radio,
});

const normalizePlaylist = (p) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  nb_tracks: p.nb_tracks,
  picture: p.picture_medium || p.picture || p.picture_big,
  link: p.link,
  creator: p.creator?.name,
});

const fetchSongs = async (query) => {
  const trimmed = String(query || "").trim();
  if (!trimmed) {
    return { tracks: [], artists: [], playlists: [] };
  }

  try {
    const [trackResp, artistResp, playlistResp] = await Promise.all([
      axios.get(`${DEEZER}/search`, {
        params: { q: trimmed, limit: 10 }
      }),
      axios.get(`${DEEZER}/search/artist`, {
        params: { q: trimmed, limit: 12 }
      }),
      axios.get(`${DEEZER}/search/playlist`, {
        params: { q: trimmed, limit: 12 }
      }),
    ]);
    
    console.log("trackResp" , trackResp?.data);
    let tracks = uniqueById((trackResp.data?.data || []).map(normalizeTrack));

    if (!tracks.length) {
      const fallbackTrackResp = await axios.get(`${DEEZER}/search`, {
        params: { q: `track:"${trimmed}"`, limit: 20 }
      });
      tracks = uniqueById((fallbackTrackResp.data?.data || []).map(normalizeTrack));
    }
    const artists = uniqueById((artistResp.data?.data || []).map(normalizeArtist));
    const playlists = uniqueById((playlistResp.data?.data || []).map(normalizePlaylist));

    return { tracks, artists, playlists };
  } catch (error) {
    console.error("Error fetching from Deezer API (fetchSongs):", error.response?.data || error.message);
    throw error;
  }
};

/* ------------------------
   2) FETCH PLAYLIST BY ID
   fetchPlaylist(playlistId) -> { id, title, nb_tracks, image, tracks: [...] }
   ------------------------ */
const fetchPlaylist = async (playlistId) => {
  try {
    if (!playlistId) throw new Error('playlistId is required');
    const response = await axios.get(`${DEEZER}/playlist/${encodeURIComponent(playlistId)}`);

    const p = response.data;
    const tracks = (p.tracks?.data || []).map(t => ({
      id: t.id,
      title: t.title,
      artists: t.artist ? [t.artist.name] : [],
      album: t.album?.title || null,
      duration: t.duration,
      preview: t.preview,
      link: t.link,
      image: t.album?.cover_medium
    }));

    return {
      id: p.id,
      title: p.title,
      description: p.description,
      nb_tracks: p.nb_tracks,
      image: p.picture_medium,
      link: p.link,
      tracks
    };
  } catch (error) {
    console.error("Error fetching Deezer playlist (fetchPlaylist):", error.response?.data || error.message);
    throw error;
  }
};

/* ------------------------
   3) FETCH HOME PLAYLISTS (randomized)
   fetchHomePlaylists(count = 12, ttlSeconds = 90) ->
     { playlists: [...], sourceCounts: { chart, genre, curated } }
   ------------------------ */
/* ------------------------
   FETCH HOME PLAYLISTS (Indian-focused)
   fetchHomePlaylists(count = 12, ttlSeconds = 90)
   ------------------------ */
const INDIAN_PLAYLIST_KEYWORDS = ['Bollywood', 'Hindi', 'Punjabi', 'Tamil', 'Telugu', 'Indie India', 'Indian Classics', 'India Top 50'];

const fetchHomePlaylists = async (count = 12, ttlSeconds = 90) => {
  const clamped = Math.max(6, Math.min(50, Number(count || 12)));
  const cacheKey = `home_playlists_indian_${clamped}`;

  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    // 1) chart playlists (keep some popular picks)
    const chartResp = await axios.get(`${DEEZER}/chart/0/playlists`);
    const chartPlaylists = (chartResp.data?.data || []).map(p => ({
      id: p.id,
      title: p.title,
      picture: p.picture_medium,
      nb_tracks: p.nb_tracks,
      link: p.link
    }));

    // 2) Keyword-based Indian playlist searches
    const keywordPromises = INDIAN_PLAYLIST_KEYWORDS.map(k =>
      axios.get(`${DEEZER}/search/playlist`, { params: { q: k, limit: 8 } })
        .then(r => (r.data?.data || []).map(p => ({
          id: p.id, title: p.title, picture: p.picture_medium, nb_tracks: p.nb_tracks, link: p.link, source: k
        })))
        .catch(() => [])
    );
    const keywordLists = await Promise.all(keywordPromises);
    const keywordPlaylists = keywordLists.flat();

    // 3) Curated playlists (use if you provided IDs)
    const curatedPromises = (CURATED_PLAYLIST_IDS || []).slice(0, 12).map(id =>
      axios.get(`${DEEZER}/playlist/${id}`)
        .then(r => {
          const p = r.data;
          return { id: p.id, title: p.title, picture: p.picture_medium, nb_tracks: p.nb_tracks, link: p.link };
        })
        .catch(() => null)
    );
    const curatedResolved = (await Promise.all(curatedPromises)).filter(Boolean);

    // Combine: prefer curated first, then keyword results, then chart
    let combined = [...curatedResolved, ...keywordPlaylists, ...chartPlaylists];
    combined = uniqueById(combined);
    combined = shuffle(combined);
    const result = combined.slice(0, clamped);

    const response = {
      playlists: result,
      sourceCounts: { chart: chartPlaylists.length, keyword: keywordPlaylists.length, curated: curatedResolved.length }
    };

    setCache(cacheKey, response, Number(ttlSeconds || 90));
    return response;
  } catch (error) {
    console.error("Error fetching home playlists (Indian) :", error.response?.data || error.message);
    throw error;
  }
};


/* ------------------------
   4) FETCH ARTIST DETAIL + TOP TRACKS
   fetchArtist(artistId, topLimit = 10)
   ------------------------ */
const fetchArtist = async (artistId, topLimit = 10) => {
  try {
    if (!artistId) throw new Error('artistId is required');
    console.log("artistId" , artistId);
    const artistResp = await axios.get(`${DEEZER}/artist/${encodeURIComponent(artistId)}`);
    const topResp = await axios.get(`${DEEZER}/artist/${encodeURIComponent(artistId)}/top`, {
      params: { limit: Math.max(1, Math.min(50, Number(topLimit) || 10)) }
    });

    const a = artistResp.data;
    const topTracks = (topResp.data?.data || []).map(normalizeTrack);

    return {
      id: a.id,
      name: a.name,
      genres: a.genres || [],
      nb_fan: a.nb_fan,
      picture: a.picture_medium || a.picture || a.picture_big,
      link: a.link,
      radio: a.radio,
      topTracks
    };
  } catch (error) {
    console.error("Error fetching Deezer artist (fetchArtist):", error.response?.data || error.message);
    throw error;
  }
};

/* ------------------------
   5) FETCH HOME ARTISTS (randomized)
   fetchHomeArtists(count = 10, ttlSeconds = 90) ->
     { artists: [...], sourceCounts: { chart, genre, curated } }
   ------------------------ */
const fetchHomeArtists = async (count = 10, ttlSeconds = 90) => {
  const clamped = Math.max(6, Math.min(50, Number(count || 10)));
  const cacheKey = `home_artists_${clamped}`;

  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    // 1) Chart artists (global)
    const chartResp = await axios.get(`${DEEZER}/chart/0/artists`);
    const chartArtists = (chartResp.data?.data || []).map(a => ({
      id: a.id,
      name: a.name,
      picture: a.picture_medium,
      link: a.link
    }));

    // 2) Pick up to 2 random genres and fetch artists for them
    const genresResp = await axios.get(`${DEEZER}/genre`);
    const genres = (genresResp.data?.data || []).filter(g => g && g.id && g.id !== 0);
    const randomGenres = shuffle(genres).slice(0, 2);

    const genrePromises = randomGenres.map(g =>
      // Some Deezer installs support /genre/{id}/artists — if not, use /chart/{genreId}/artists
      axios.get(`${DEEZER}/genre/${g.id}/artists`).then(r => (r.data?.data || []).map(a => ({
        id: a.id, name: a.name, picture: a.picture_medium, link: a.link, genre: g.name
      }))).catch(() =>
        axios.get(`${DEEZER}/chart/${g.id}/artists`).then(r => (r.data?.data || []).map(a => ({
          id: a.id, name: a.name, picture: a.picture_medium, link: a.link, genre: g.name
        }))).catch(() => [])
      )
    );
    const genreLists = await Promise.all(genrePromises);
    const genreArtists = genreLists.flat();

    // 3) Curated artist list — fetch details
    const curatedPromises = (CURATED_ARTIST_IDS || []).slice(0, 10).map(id =>
      axios.get(`${DEEZER}/artist/${id}`).then(r => {
        const a = r.data;
        return { id: a.id, name: a.name, picture: a.picture_medium, link: a.link };
      }).catch(() => null)
    );
    const curatedResolved = (await Promise.all(curatedPromises)).filter(Boolean);

    // Combine and dedupe
    let combined = [...chartArtists, ...genreArtists, ...curatedResolved];
    combined = uniqueById(combined);
    combined = shuffle(combined);

    // Trim to requested count
    let result = combined.slice(0, clamped);

    // Optional enhancement: fetch a single top-track preview for each artist (lightweight)
    // We'll do this for up to first N artists to avoid too many requests
    const previewFetchLimit = Math.min(8, result.length); // keep small
    const previewPromises = result.slice(0, previewFetchLimit).map(async (artist) => {
      try {
        const topResp = await axios.get(`${DEEZER}/artist/${artist.id}/top`, { params: { limit: 3 } });
        const top = (topResp.data?.data || []);
        const firstWithPreview = top.find(t => t.preview) || null;
        return { id: artist.id, trackPreview: firstWithPreview ? firstWithPreview.preview : null };
      } catch (err) {
        return { id: artist.id, trackPreview: null };
      }
    });

    const previews = await Promise.all(previewPromises);
    const previewMap = new Map(previews.map(p => [String(p.id), p.trackPreview]));

    // attach preview if available
    result = result.map(a => ({ ...a, trackPreview: previewMap.get(String(a.id)) || null }));

    const response = { artists: result, sourceCounts: { chart: chartArtists.length, genre: genreArtists.length, curated: curatedResolved.length } };

    // cache and return
    setCache(cacheKey, response, Number(ttlSeconds || 90));

    return response;
  } catch (error) {
    console.error("Error fetching home artists (fetchHomeArtists):", error.response?.data || error.message);
    throw error;
  }
};

module.exports = { fetchSongs, fetchPlaylist, fetchHomePlaylists, fetchArtist, fetchHomeArtists };
