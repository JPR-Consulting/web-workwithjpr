import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const Imprint: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-ink text-ftext font-body px-4 py-20">
      <div className="container mx-auto max-w-3xl">
        <button onClick={onBack} className="flex items-center gap-2 text-muted hover:text-accent transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Zurück zur Startseite
        </button>

        <h1 className="font-syne font-extrabold uppercase text-4xl mb-10">Impressum</h1>

        <div className="space-y-8 text-muted leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-ftext mb-2">Angaben gemäß § 5 TMG</h2>
            <p>JPR Consulting GmbH<br />Letteallee 91<br />13409 Berlin</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-ftext mb-2">Vertreten durch</h2>
            <p>Geschäftsführer: Jan Rojek</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-ftext mb-2">Kontakt</h2>
            <p>E-Mail: info@workwithjpr.com</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-ftext mb-2">Registereintrag</h2>
            <p>Eintragung im Handelsregister<br />Registergericht: Amtsgericht Charlottenburg<br />Registernummer: HRB 207244 B</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-ftext mb-2">EU-Streitschlichtung</h2>
            <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">https://ec.europa.eu/consumers/odr/</a></p>
            <p className="mt-2">Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-ftext mb-2">Haftung für Inhalte</h2>
            <p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Imprint;
