import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const Privacy: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-ink text-ftext font-body px-4 py-20">
      <div className="container mx-auto max-w-3xl">
        <button onClick={onBack} className="flex items-center gap-2 text-muted hover:text-accent transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Zurück zur Startseite
        </button>

        <h1 className="font-syne font-extrabold uppercase text-4xl mb-10">Datenschutzerklärung</h1>

        <div className="space-y-8 text-muted leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-ftext mb-2">1. Datenschutz auf einen Blick</h2>
            <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-ftext mb-2">2. Verantwortliche Stelle</h2>
            <p>JPR Consulting GmbH<br />Letteallee 91<br />13409 Berlin<br />E-Mail: info@workwithjpr.com</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-ftext mb-2">3. Datenerfassung auf dieser Website</h2>
            <h3 className="text-lg font-semibold text-ftext mt-4 mb-2">Kontaktformular</h3>
            <p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage bei uns gespeichert. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-ftext mb-2">4. Hosting</h2>
            <p>Diese Website wird bei Vercel Inc. gehostet. Details zum Datenschutz von Vercel finden Sie unter: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">vercel.com/legal/privacy-policy</a></p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-ftext mb-2">5. Ihre Rechte</h2>
            <p>Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten. Kontaktieren Sie uns hierzu unter info@workwithjpr.com.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-ftext mb-2">6. Google Fonts</h2>
            <p>Diese Seite nutzt Google Fonts. Die Google Fonts werden lokal eingebunden, es findet keine Verbindung zu Google-Servern statt.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-ftext mb-2">7. Cookies und Einwilligungsverwaltung</h2>
            <p>Beim ersten Besuch dieser Website wird ein Cookie-Banner angezeigt. Sie können wählen, ob Sie nur technisch notwendige Funktionen oder auch Analyse- und Marketing-Tools zulassen möchten. Ihre Entscheidung wird in Ihrem Browser (localStorage) gespeichert und bei jedem weiteren Besuch berücksichtigt. Sie können Ihre Einwilligung jederzeit widerrufen, indem Sie die gespeicherten Daten in Ihrem Browser löschen.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-ftext mb-2">8. Google Analytics</h2>
            <p>Diese Website nutzt Google Analytics 4 (Mess-ID: G-0EETZ8V1K4), einen Webanalysedienst der Google Ireland Limited. Google Analytics wird <strong className="text-ftext">nur geladen, wenn Sie über das Cookie-Banner aktiv zugestimmt haben</strong>. Ohne Ihre Einwilligung findet kein Tracking statt.</p>
            <p className="mt-2">Die IP-Anonymisierung ist aktiviert (anonymize_ip). Ihre IP-Adresse wird innerhalb der EU gekürzt, bevor sie an Google-Server übermittelt wird. Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO.</p>
            <p className="mt-2">Sie können Ihre Einwilligung jederzeit über das Cookie-Banner widerrufen oder das Browser-Add-on zur Deaktivierung von Google Analytics nutzen: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">tools.google.com/dlpage/gaoptout</a></p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-ftext mb-2">9. Facebook Pixel</h2>
            <p>Diese Website nutzt das Facebook Pixel (ID: 842051572153086) von Meta Platforms Ireland Limited. Das Pixel wird <strong className="text-ftext">nur geladen, wenn Sie über das Cookie-Banner aktiv zugestimmt haben</strong>. Ohne Ihre Einwilligung findet kein Tracking durch Facebook statt.</p>
            <p className="mt-2">Das Facebook Pixel erfasst anonymisierte Daten über Ihr Nutzungsverhalten, um die Effektivität von Werbeanzeigen zu messen. Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO. Weitere Informationen: <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">facebook.com/privacy/policy</a></p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-ftext mb-2">10. Calendly</h2>
            <p>Für die Online-Terminbuchung binden wir den Dienst Calendly (Calendly LLC, USA) als Iframe ein. Wenn Sie den Buchungsbereich nutzen, werden Daten direkt an Calendly übermittelt. Dies umfasst die von Ihnen eingegebenen Kontaktdaten sowie technische Daten (IP-Adresse, Browser). Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung). Weitere Informationen: <a href="https://calendly.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">calendly.com/privacy</a></p>
          </div>

          <p className="text-sm text-dim pt-8">Stand: März 2026</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
