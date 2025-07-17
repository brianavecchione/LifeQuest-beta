const SpotifyPlayer = () => {
  return (
    <div className="w-full bg-black/90 backdrop-blur-sm border-t border-border/30 py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <h3 className="text-lg font-semibold text-white mb-4 text-center">
          Your Quest Soundtrack
        </h3>
        <div className="flex justify-center">
          <iframe 
            style={{ borderRadius: '12px' }} 
            src="https://open.spotify.com/embed/playlist/37i9dQZF1DXdfOcg1fm0VG?utm_source=generator&theme=0" 
            width="90%" 
            height="152" 
            frameBorder="0" 
            allowFullScreen={false}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
            className="max-w-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default SpotifyPlayer;