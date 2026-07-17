import type { ReactNode } from "react";
import type { Language } from "@/lib/i18n";

export type LegalKey = "imprint" | "privacy" | "terms" | "cookies" | "complaints";
export interface LegalDoc { title: string; updated: string; body: ReactNode }

const H = ({ children }: { children: ReactNode }) => (
  <h2 className="display-black text-2xl md:text-3xl mt-10 first:mt-0">{children}</h2>
);
const P = ({ children }: { children: ReactNode }) => (
  <p className="mt-3 text-[15px] leading-relaxed text-black/75">{children}</p>
);
const UL = ({ children }: { children: ReactNode }) => (
  <ul className="mt-3 space-y-1.5 list-disc pl-5 text-[15px] text-black/75">{children}</ul>
);
const Address = () => (
  <address className="not-italic mt-3 text-[15px] text-black/75">
    GastroSafe GmbH<br />
    Chausseestraße 10<br />
    10115 Berlin, Deutschland<br />
    <br />
    E-Mail: legal@gastrosafe.de<br />
    Tel.: +49 30 1234 567<br />
    Handelsregister: Amtsgericht Berlin-Charlottenburg, HRB 000000 B<br />
    USt-IdNr.: DE000000000<br />
    Geschäftsführung: A. Yılmaz<br />
    Verantwortlich i.S.d. § 18 Abs. 2 MStV: A. Yılmaz (Anschrift wie oben)
  </address>
);

const UPDATED = "17.07.2026";

/* ── DE ─────────────────────────────────────────────────────────────── */
const de: Record<LegalKey, LegalDoc> = {
  imprint: {
    title: "Impressum",
    updated: UPDATED,
    body: (
      <>
        <H>Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)</H>
        <Address />
        <H>Streitbeilegung</H>
        <P>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
          bereit: <a className="underline" href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer">ec.europa.eu/consumers/odr</a>.
          Zur Teilnahme an einem Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle sind wir weder verpflichtet noch bereit.
        </P>
        <H>Haftung für Inhalte</H>
        <P>
          Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen
          Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind
          wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
          gespeicherte fremde Informationen zu überwachen.
        </P>
      </>
    ),
  },
  privacy: {
    title: "Datenschutzerklärung",
    updated: UPDATED,
    body: (
      <>
        <P>
          Diese Datenschutzerklärung gilt für die Nutzung der GastroSafe-Plattform und der
          Website gastrosafe.de. Sie erfüllt die Anforderungen der DSGVO (VO (EU) 2016/679)
          sowie des BDSG.
        </P>
        <H>1. Verantwortlicher</H>
        <Address />
        <H>2. Datenschutzbeauftragter</H>
        <P>Sie erreichen unseren Datenschutzbeauftragten unter dsb@gastrosafe.de.</P>
        <H>3. Verarbeitete Daten und Zwecke</H>
        <UL>
          <li>Stammdaten (Name, E-Mail, Rolle, Standort) – zur Vertragserfüllung, Art. 6 Abs. 1 lit. b DSGVO.</li>
          <li>Nutzungsdaten (Aufgaben, HACCP-Nachweise, Temperaturen) – zur Erbringung der Compliance-Dokumentation, Art. 6 Abs. 1 lit. b und c DSGVO.</li>
          <li>Log- und Sicherheitsdaten – berechtigtes Interesse an Betriebssicherheit, Art. 6 Abs. 1 lit. f DSGVO.</li>
          <li>Kontaktformular-Daten – Bearbeitung Ihrer Anfrage, Art. 6 Abs. 1 lit. b/f DSGVO.</li>
        </UL>
        <H>4. Empfänger und Auftragsverarbeitung</H>
        <P>
          Wir setzen sorgfältig ausgewählte Auftragsverarbeiter (Hosting in der EU,
          E-Mail-Versand, Support) auf Basis von Art. 28 DSGVO ein. Eine Übermittlung in
          Drittländer findet nur mit geeigneten Garantien (Standardvertragsklauseln)
          statt.
        </P>
        <H>5. Speicherdauer</H>
        <P>
          Compliance-Nachweise werden mindestens 2 Jahre gespeichert, um den Anforderungen
          der Lebensmittelaufsicht zu genügen. Handels- und steuerrechtliche
          Aufbewahrungsfristen (bis 10 Jahre) bleiben unberührt.
        </P>
        <H>6. Ihre Rechte</H>
        <UL>
          <li>Auskunft (Art. 15 DSGVO)</li>
          <li>Berichtigung (Art. 16 DSGVO)</li>
          <li>Löschung (Art. 17 DSGVO)</li>
          <li>Einschränkung (Art. 18 DSGVO)</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Widerspruch (Art. 21 DSGVO)</li>
          <li>Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO) – für uns zuständig: Berliner Beauftragte für Datenschutz und Informationsfreiheit.</li>
        </UL>
        <H>7. Cookies und Tracking</H>
        <P>
          Wir verwenden ausschließlich technisch notwendige Cookies. Alle nicht
          notwendigen Cookies (z. B. Analytics) werden erst nach Ihrer Einwilligung nach
          § 25 Abs. 1 TDDDG gesetzt. Details unter „Cookies".
        </P>
      </>
    ),
  },
  terms: {
    title: "Allgemeine Geschäftsbedingungen (AGB)",
    updated: UPDATED,
    body: (
      <>
        <H>§ 1 Geltungsbereich</H>
        <P>
          Diese AGB gelten für alle Verträge über die Nutzung der Software-as-a-Service
          Lösung „GastroSafe" zwischen der GastroSafe GmbH („Anbieter") und dem Kunden.
          Der Kunde handelt als Unternehmer i.S.d. § 14 BGB.
        </P>
        <H>§ 2 Leistungsumfang</H>
        <P>
          Der Anbieter stellt GastroSafe als webbasierte Anwendung zur Verfügung. Der
          konkrete Funktionsumfang richtet sich nach dem gewählten Tarif. Eine Garantie
          der Rechtskonformität einzelner Nachweise wird nicht übernommen; die
          Verantwortung für lebensmittelrechtliche Pflichten verbleibt beim Kunden.
        </P>
        <H>§ 3 Vertragslaufzeit und Kündigung</H>
        <P>
          Die Mindestlaufzeit beträgt einen Monat und verlängert sich automatisch um
          jeweils einen Monat, sofern nicht mit einer Frist von 14 Tagen zum Laufzeitende
          gekündigt wird. Das Recht zur außerordentlichen Kündigung bleibt unberührt.
        </P>
        <H>§ 4 Vergütung, Zahlungsbedingungen</H>
        <P>
          Es gelten die Preise der Preisliste zum Zeitpunkt des Vertragsschlusses. Alle
          Preise verstehen sich zzgl. gesetzlicher Umsatzsteuer. Rechnungen sind innerhalb
          von 14 Tagen ohne Abzug fällig.
        </P>
        <H>§ 5 Pflichten des Kunden</H>
        <UL>
          <li>Wahrheitsgemäße Angaben bei Registrierung und Pflege der Daten.</li>
          <li>Sichere Aufbewahrung der Zugangsdaten.</li>
          <li>Einhaltung des einschlägigen Lebensmittel- und Datenschutzrechts.</li>
        </UL>
        <H>§ 6 Verfügbarkeit</H>
        <P>
          Der Anbieter strebt eine Verfügbarkeit von 99,5 % im Jahresmittel an. Geplante
          Wartungsarbeiten werden vorab angekündigt.
        </P>
        <H>§ 7 Haftung</H>
        <P>
          Der Anbieter haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie
          bei Verletzung von Leben, Körper und Gesundheit. Bei einfacher Fahrlässigkeit
          ist die Haftung auf den typischerweise vorhersehbaren Schaden begrenzt. Die
          Haftung nach dem Produkthaftungsgesetz bleibt unberührt.
        </P>
        <H>§ 8 Schlussbestimmungen</H>
        <P>
          Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist,
          soweit gesetzlich zulässig, Berlin.
        </P>
      </>
    ),
  },
  cookies: {
    title: "Cookie-Richtlinie",
    updated: UPDATED,
    body: (
      <>
        <P>
          Wir setzen Cookies und ähnliche Technologien nur ein, soweit dies technisch
          erforderlich ist oder Sie eingewilligt haben (§ 25 TDDDG, Art. 6 Abs. 1 lit. a
          DSGVO). Sie können Ihre Einwilligung jederzeit widerrufen.
        </P>
        <H>Kategorien</H>
        <UL>
          <li><strong>Notwendig:</strong> Sprachauswahl (gs-lang), Anmeldestatus, CSRF-Schutz. Rechtsgrundlage: § 25 Abs. 2 Nr. 2 TDDDG.</li>
          <li><strong>Präferenzen:</strong> UI-Einstellungen; nur mit Einwilligung.</li>
          <li><strong>Statistik:</strong> Anonymisierte Nutzungsanalyse; nur mit Einwilligung.</li>
          <li><strong>Marketing:</strong> Aktuell nicht eingesetzt.</li>
        </UL>
        <H>Verwaltung</H>
        <P>
          Sie können Ihre Einwilligung im Cookie-Banner am unteren Bildschirmrand
          jederzeit ändern oder widerrufen. Über Ihren Browser lassen sich Cookies
          zusätzlich blockieren oder löschen.
        </P>
      </>
    ),
  },
  complaints: {
    title: "Beschwerdeverfahren",
    updated: UPDATED,
    body: (
      <>
        <P>
          Wir nehmen Beschwerden ernst. Diese Richtlinie beschreibt, wie Sie Kritik,
          Anregungen oder Beschwerden – auch anonym – an uns richten können.
        </P>
        <H>1. Kontaktwege</H>
        <UL>
          <li>E-Mail: beschwerde@gastrosafe.de</li>
          <li>Post: GastroSafe GmbH, Chausseestraße 10, 10115 Berlin</li>
          <li>Telefon: +49 30 1234 567</li>
        </UL>
        <H>2. Bearbeitungsfristen</H>
        <UL>
          <li>Eingangsbestätigung innerhalb von 3 Werktagen.</li>
          <li>Sachliche Rückmeldung innerhalb von 14 Tagen.</li>
          <li>Bei komplexen Fällen: Zwischenstand nach spätestens 30 Tagen.</li>
        </UL>
        <H>3. Eskalation</H>
        <P>
          Sind Sie mit dem Ergebnis nicht einverstanden, können Sie den Fall an die
          Geschäftsführung (leitung@gastrosafe.de) eskalieren. Datenschutzbeschwerden
          können Sie zusätzlich direkt bei der Berliner Beauftragten für Datenschutz und
          Informationsfreiheit einreichen.
        </P>
        <H>4. Hinweisgeberschutz</H>
        <P>
          Meldungen nach dem Hinweisgeberschutzgesetz (HinSchG) nehmen wir vertraulich
          unter hinweis@gastrosafe.de entgegen. Die Identität der hinweisgebenden Person
          wird geschützt; Repressalien sind untersagt.
        </P>
      </>
    ),
  },
};

/* ── EN ─────────────────────────────────────────────────────────────── */
const en: Record<LegalKey, LegalDoc> = {
  imprint: {
    title: "Imprint",
    updated: UPDATED,
    body: (
      <>
        <H>Information according to § 5 DDG (German Digital Services Act)</H>
        <address className="not-italic mt-3 text-[15px] text-black/75">
          GastroSafe GmbH<br />
          Chausseestraße 10<br />
          10115 Berlin, Germany<br />
          <br />
          Email: legal@gastrosafe.de<br />
          Phone: +49 30 1234 567<br />
          Commercial register: Amtsgericht Berlin-Charlottenburg, HRB 000000 B<br />
          VAT ID: DE000000000<br />
          Managing director: A. Yılmaz<br />
          Responsible under § 18 (2) MStV: A. Yılmaz (address above)
        </address>
        <H>Online dispute resolution</H>
        <P>
          The European Commission provides an ODR platform:{" "}
          <a className="underline" href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer">
            ec.europa.eu/consumers/odr
          </a>. We are neither obliged nor willing to participate in dispute resolution
          proceedings before a consumer arbitration board.
        </P>
        <H>Liability for content</H>
        <P>
          As a service provider, we are responsible for our own content on these pages
          under § 7 (1) DDG. According to §§ 8 to 10 DDG, we are not obliged to monitor
          transmitted or stored third-party information.
        </P>
      </>
    ),
  },
  privacy: {
    title: "Privacy notice (GDPR)",
    updated: UPDATED,
    body: (
      <>
        <P>
          This notice governs use of the GastroSafe platform and gastrosafe.de. It meets
          the requirements of the GDPR (Regulation (EU) 2016/679) and the German BDSG.
        </P>
        <H>1. Controller</H>
        <address className="not-italic mt-3 text-[15px] text-black/75">
          GastroSafe GmbH · Chausseestraße 10 · 10115 Berlin, Germany · legal@gastrosafe.de
        </address>
        <H>2. Data protection officer</H>
        <P>You can reach our DPO at dsb@gastrosafe.de.</P>
        <H>3. Data we process and purposes</H>
        <UL>
          <li>Master data (name, email, role, location) — contract performance, Art. 6(1)(b) GDPR.</li>
          <li>Usage data (tasks, HACCP records, temperatures) — compliance documentation, Art. 6(1)(b) and (c) GDPR.</li>
          <li>Log and security data — legitimate interest in operational security, Art. 6(1)(f) GDPR.</li>
          <li>Contact form data — handling your enquiry, Art. 6(1)(b)/(f) GDPR.</li>
        </UL>
        <H>4. Recipients and processors</H>
        <P>
          We use carefully selected processors (EU hosting, email, support) under Art. 28
          GDPR. Transfers to third countries only occur with appropriate safeguards
          (standard contractual clauses).
        </P>
        <H>5. Retention</H>
        <P>
          Compliance records are retained for at least 2 years to satisfy food-authority
          requirements. Commercial and tax retention obligations (up to 10 years) apply
          in addition.
        </P>
        <H>6. Your rights</H>
        <UL>
          <li>Access (Art. 15 GDPR)</li>
          <li>Rectification (Art. 16 GDPR)</li>
          <li>Erasure (Art. 17 GDPR)</li>
          <li>Restriction (Art. 18 GDPR)</li>
          <li>Portability (Art. 20 GDPR)</li>
          <li>Objection (Art. 21 GDPR)</li>
          <li>Complaint with a supervisory authority (Art. 77 GDPR) — competent for us: Berlin Commissioner for Data Protection and Freedom of Information.</li>
        </UL>
        <H>7. Cookies and tracking</H>
        <P>
          We only use strictly necessary cookies by default. Any non-necessary cookies
          (e.g. analytics) are only set after your consent under § 25(1) TDDDG. See
          "Cookies" for details.
        </P>
      </>
    ),
  },
  terms: {
    title: "Terms and Conditions",
    updated: UPDATED,
    body: (
      <>
        <H>§ 1 Scope</H>
        <P>
          These T&Cs govern all contracts for the use of the SaaS solution "GastroSafe"
          between GastroSafe GmbH ("Provider") and the customer, who acts as an
          entrepreneur within the meaning of § 14 BGB.
        </P>
        <H>§ 2 Scope of services</H>
        <P>
          The Provider makes GastroSafe available as a web application. The specific
          feature set depends on the chosen plan. No guarantee of legal compliance of
          individual records is given; responsibility for food-law obligations remains
          with the customer.
        </P>
        <H>§ 3 Term and termination</H>
        <P>
          The minimum term is one month and renews automatically for one month, unless
          terminated with 14 days' notice to the end of the term. The right to
          extraordinary termination remains unaffected.
        </P>
        <H>§ 4 Fees and payment</H>
        <P>
          The price list valid at the time of contract conclusion applies. All prices
          are exclusive of statutory VAT. Invoices are payable within 14 days net.
        </P>
        <H>§ 5 Customer obligations</H>
        <UL>
          <li>Truthful information on registration and data upkeep.</li>
          <li>Secure storage of access credentials.</li>
          <li>Compliance with applicable food and data protection law.</li>
        </UL>
        <H>§ 6 Availability</H>
        <P>The Provider targets 99.5% availability on annual average. Planned maintenance is announced in advance.</P>
        <H>§ 7 Liability</H>
        <P>
          The Provider is liable without limitation for intent and gross negligence and
          for injury to life, body and health. For simple negligence, liability is
          limited to typically foreseeable damage. Liability under the German Product
          Liability Act remains unaffected.
        </P>
        <H>§ 8 Final provisions</H>
        <P>
          German law applies, excluding the UN CISG. Place of jurisdiction is Berlin, as
          far as legally permissible.
        </P>
      </>
    ),
  },
  cookies: {
    title: "Cookie Policy",
    updated: UPDATED,
    body: (
      <>
        <P>
          We only use cookies and similar technologies where technically required or
          where you have consented (§ 25 TDDDG, Art. 6(1)(a) GDPR). You may withdraw
          consent at any time.
        </P>
        <H>Categories</H>
        <UL>
          <li><strong>Necessary:</strong> language preference (gs-lang), login state, CSRF protection. Legal basis: § 25(2)(2) TDDDG.</li>
          <li><strong>Preferences:</strong> UI settings; consent only.</li>
          <li><strong>Statistics:</strong> anonymised usage analytics; consent only.</li>
          <li><strong>Marketing:</strong> not currently used.</li>
        </UL>
        <H>Managing your choices</H>
        <P>
          You can change or withdraw your consent at any time via the cookie banner at
          the bottom of the screen. Cookies can additionally be blocked or deleted in
          your browser.
        </P>
      </>
    ),
  },
  complaints: {
    title: "Complaints procedure",
    updated: UPDATED,
    body: (
      <>
        <P>
          We take complaints seriously. This policy explains how you can send us
          criticism, suggestions or complaints — including anonymously.
        </P>
        <H>1. How to reach us</H>
        <UL>
          <li>Email: beschwerde@gastrosafe.de</li>
          <li>Post: GastroSafe GmbH, Chausseestraße 10, 10115 Berlin</li>
          <li>Phone: +49 30 1234 567</li>
        </UL>
        <H>2. Response times</H>
        <UL>
          <li>Acknowledgement within 3 working days.</li>
          <li>Substantive reply within 14 days.</li>
          <li>For complex cases: status update no later than 30 days.</li>
        </UL>
        <H>3. Escalation</H>
        <P>
          If you are not satisfied with the outcome, you can escalate the matter to
          management (leitung@gastrosafe.de). Data protection complaints can also be
          submitted directly to the Berlin Commissioner for Data Protection and Freedom
          of Information.
        </P>
        <H>4. Whistleblower protection</H>
        <P>
          Reports under the German Whistleblower Protection Act (HinSchG) can be sent
          confidentially to hinweis@gastrosafe.de. The identity of the reporting person
          is protected; reprisals are prohibited.
        </P>
      </>
    ),
  },
};

export function legalContent(lang: Language): Record<LegalKey, LegalDoc> {
  return lang === "de" ? de : en;
}
