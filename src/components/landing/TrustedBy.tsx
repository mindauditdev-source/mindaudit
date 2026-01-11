export function TrustedBy() {
  // Placeholder names for the layout
  const brands = [
    { name: 'ACME Co', icon: '■' },
    { name: 'GlobalFit', icon: '●' },
    { name: 'Nexus Tec', icon: '▲' },
    { name: 'Starlight', icon: '◆' },
    { name: 'TwinFlow', icon: '▌' },
  ];

  return (
    <section className="bg-white py-12 border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">
          EMPRESAS MODERNAS DE TODA ESPAÑA QUE CONFÍAN EN NOSOTROS
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {brands.map((brand, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-800 font-bold text-lg">
              <span className="text-2xl text-gray-400">{brand.icon}</span>
              {brand.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
