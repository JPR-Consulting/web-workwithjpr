import React from 'react';
import { ExternalLink } from 'lucide-react';

const PortfolioSection: React.FC = () => {
  const projects = [
    {
      title: 'COLOMBINA — Catering & Kochkurse',
      type: 'Gastronomie & Events',
      desc: 'Kolumbianische Kochkurse und Catering in Berlin. Conversion-optimierte Landing Pages mit Buchungssystem, eigenem Mini-CMS und DSGVO-konformem Cookie-Consent.',
      tags: ['Landing Pages', 'Buchungssystem', 'CMS', 'Cookie-Consent', 'Conversion-Optimierung'],
      url: 'https://colombina-kochkurse.vercel.app',
      image: '/portfolio/colombina.webp',
      result: 'Von der bestehenden Website zur buchbaren Plattform mit selbst pflegbaren Kursterminen — Struktur, Buchung und CMS an einem Tag umgesetzt.',
    },
    {
      title: 'Muay Thai Subyen e.V.',
      type: 'Sport & Verein',
      desc: 'Berlins einziges durch die Thailand Sports Authority zertifiziertes Muay Thai Gym. Dark-Theme mit Neon-Akzenten, Trainingsplan und Mitgliederverwaltung.',
      tags: ['Website', 'Mitgliederverwaltung', 'Online-Verträge', 'Online-Buchung', 'Google-Sichtbarkeit'],
      url: 'https://www.muaythai-subyen.de',
      image: '/portfolio/muay-thai-subyen.webp',
      result: 'Das Online-Buchungssystem bringt rund 5 neue Interessenten pro Woche. Außerdem optimiert für Google und KI-Suche, damit die Seite besser gefunden wird. Alles in einer Woche umgesetzt.',
    },
    {
      title: 'ropeFX — Industriekletterer Berlin',
      type: 'Handwerk & Dienstleistung',
      desc: 'FISAT-zertifiziertes Höhenarbeitsunternehmen. Klare Darstellung aller Services, von Fassadenreinigung bis Drohneninspektion.',
      tags: ['Website', 'Google-Sichtbarkeit', 'Google-Optimierung', 'Kundengewinnung'],
      url: 'https://ropefx.com',
      image: '/portfolio/ropefx.webp',
      result: 'Regelmäßige Anfragen über die Website seit Launch',
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3">Portfolio</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4">Unsere Arbeit</h2>
          <p className="text-gray-400 text-lg">Aktuelle Projekte für lokale Unternehmen in Berlin.</p>
        </div>

        <div className="space-y-12">
          {projects.map((p, idx) => (
            <div
              key={p.title}
              className="group rounded-2xl border border-white/10 bg-zinc-900/50 overflow-hidden hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className={`grid grid-cols-1 lg:grid-cols-2 ${idx % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                {/* Screenshot */}
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative block overflow-hidden bg-zinc-800 ${idx % 2 === 1 ? 'lg:col-start-2' : ''}`}
                >
                  <div className="aspect-[16/10]">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <span className="text-white text-sm font-semibold flex items-center gap-1.5">
                      Live ansehen <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </a>

                {/* Content */}
                <div className={`p-8 lg:p-10 flex flex-col justify-center ${idx % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <span className="inline-block self-start px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-semibold mb-4">
                    {p.type}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold mb-3">{p.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-5">{p.desc}</p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {p.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-500">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mb-5">
                    <p className="text-emerald-400 text-sm">&#10003; {p.result}</p>
                  </div>

                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold text-sm transition-colors self-start"
                  >
                    Live ansehen <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
