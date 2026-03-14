import Image from 'next/image';

export function TrustedBy() {
  const logos = [
    { name: 'CRA', path: '/logosya confian/200504_CRA_Positiu_baseline02.png' },
    { name: 'Aantal', path: '/logosya confian/aantalblack-1.png' },
    { name: 'Scroos', path: '/logosya confian/scroos redes sociales.jpg' },
    { name: 'Taxavia', path: '/logosya confian/taxavia.png' },
  ];

  return (
    <section className="bg-white py-12 border-b border-gray-100 overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10 block">
        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">
          Ya confían en nosotros
        </p>

        {/* Marquee Container */}
        <div 
          className="flex w-full overflow-hidden relative group" 
          style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
        >
          {/* We render 2 identical tracks that animate side-by-side to create a seamless infinite loop */}
          {Array.from({ length: 2 }).map((_, i) => (
            <div 
              key={i} 
              className="flex min-w-full shrink-0 animate-marquee group-hover:[animation-play-state:paused] items-center justify-around"
              aria-hidden={i === 1}
            >
              {logos.map((logo, index) => (
                <div
                  key={index}
                  className="flex justify-center items-center w-40 md:w-48 h-20 shrink-0 mx-4 md:mx-8 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 pointer-events-auto"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={logo.path}
                      alt={`${logo.name} logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
