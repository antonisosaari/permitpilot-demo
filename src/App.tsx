import { useState } from 'react'
import './App.css'

interface Permit {
  id: string
  name: string
  authority: string
  processingTime: string
  fee: string
  description: string
  documents: string[]
}

const PERMIT_DATABASE: Record<string, Permit[]> = {
  ravintola: [
    {
      id: 'elintarvike',
      name: 'Elintarvikehuoneiston hyväksyminen',
      authority: 'Helsingin kaupunki, Ympäristöpalvelut',
      processingTime: '2-4 viikkoa',
      fee: '350-700 €',
      description: 'Pakollinen kaikille elintarvikkeita käsitteleville tiloille.',
      documents: ['Pohjapiirros', 'HACCP-suunnitelma', 'Omavalvontasuunnitelma']
    },
    {
      id: 'anniskelu',
      name: 'Anniskelulupa',
      authority: 'Aluehallintovirasto (AVI)',
      processingTime: '4-8 viikkoa',
      fee: '500-1500 €',
      description: 'Vaaditaan alkoholijuomien anniskeluun ravintolassa.',
      documents: ['Liiketoimintasuunnitelma', 'Vastaavan hoitajan todistus', 'Vuokrasopimus', 'Kaupparekisteriote']
    },
    {
      id: 'rakennuslupa',
      name: 'Rakennuslupa / Toimenpidelupa',
      authority: 'Helsingin kaupunki, Rakennusvalvonta',
      processingTime: '4-12 viikkoa',
      fee: '200-2000 €',
      description: 'Tarvitaan jos tilaa muutetaan (esim. keittiön rakentaminen).',
      documents: ['Pääpiirustukset', 'LVI-suunnitelmat', 'Taloyhtiön suostumus']
    },
    {
      id: 'ulkoalue',
      name: 'Terassilupa',
      authority: 'Helsingin kaupunki, Kaupunkiympäristö',
      processingTime: '2-4 viikkoa',
      fee: '100-500 €',
      description: 'Ulkotarjoilualueen perustaminen julkiselle alueelle.',
      documents: ['Sijaintikartta', 'Terassisuunnitelma', 'Vakuutustodistus']
    }
  ],
  rakennus: [
    {
      id: 'rakennuslupa',
      name: 'Rakennuslupa',
      authority: 'Helsingin kaupunki, Rakennusvalvonta',
      processingTime: '8-16 viikkoa',
      fee: '500-5000 €',
      description: 'Pakollinen uudisrakentamiseen ja merkittäviin muutoksiin.',
      documents: ['Pääpiirustukset', 'Rakennesuunnitelmat', 'Energiaselvitys', 'Naapurien kuuleminen']
    },
    {
      id: 'maisema',
      name: 'Maisematyölupa',
      authority: 'Helsingin kaupunki, Rakennusvalvonta',
      processingTime: '4-8 viikkoa',
      fee: '150-500 €',
      description: 'Puiden kaato tai maanpinnan muuttaminen.',
      documents: ['Maisemasuunnitelma', 'Kartta', 'Valokuvat']
    },
    {
      id: 'purkamis',
      name: 'Purkamislupa',
      authority: 'Helsingin kaupunki, Rakennusvalvonta',
      processingTime: '4-8 viikkoa',
      fee: '200-1000 €',
      description: 'Rakennuksen tai sen osan purkaminen.',
      documents: ['Purkamissuunnitelma', 'Jätteiden käsittelysuunnitelma', 'Asbestikartoitus']
    }
  ],
  tapahtuma: [
    {
      id: 'yleisotilaisuus',
      name: 'Yleisötilaisuusilmoitus',
      authority: 'Poliisi',
      processingTime: '5 vrk (ilmoitus)',
      fee: '0 €',
      description: 'Pakollinen yli 200 hengen tapahtumiin.',
      documents: ['Tapahtumasuunnitelma', 'Turvallisuussuunnitelma', 'Kartta']
    },
    {
      id: 'meluilmoitus',
      name: 'Meluilmoitus',
      authority: 'Helsingin kaupunki, Ympäristöpalvelut',
      processingTime: '30 vrk ennen tapahtumaa',
      fee: '0-200 €',
      description: 'Äänekkäät tapahtumat (konsertit, rakennustyöt).',
      documents: ['Melutasoarvio', 'Aikataulu', 'Kartta']
    },
    {
      id: 'tilapainenkatu',
      name: 'Tilapäinen liikennejärjestely',
      authority: 'Helsingin kaupunki, Kaupunkiympäristö',
      processingTime: '2-4 viikkoa',
      fee: '100-500 €',
      description: 'Kadun sulkeminen tai liikennejärjestelyt.',
      documents: ['Liikennejärjestelysuunnitelma', 'Kartta', 'Aikataulu']
    },
    {
      id: 'elintarvike_tap',
      name: 'Tilapäinen elintarvikemyynti',
      authority: 'Helsingin kaupunki, Ympäristöpalvelut',
      processingTime: '2 viikkoa',
      fee: '100-350 €',
      description: 'Ruokamyynti tapahtumassa.',
      documents: ['Omavalvontasuunnitelma', 'Ruokalista']
    }
  ],
  verkkokauppa: [
    {
      id: 'yritys',
      name: 'Y-tunnus (Kaupparekisteri)',
      authority: 'PRH',
      processingTime: '1-5 arkipäivää',
      fee: '60-380 €',
      description: 'Pakollinen kaikille yrityksille.',
      documents: ['Perustamisilmoitus']
    },
    {
      id: 'tietosuoja',
      name: 'Tietosuojaseloste',
      authority: 'Tietosuojavaltuutetun toimisto',
      processingTime: 'Ei hakemusta',
      fee: '0 €',
      description: 'Pakollinen dokumentti verkkokaupalle (GDPR).',
      documents: ['Tietosuojaseloste', 'Evästekäytäntö']
    },
    {
      id: 'kuluttaja',
      name: 'Kuluttajasuojailmoitukset',
      authority: 'KKV',
      processingTime: 'Ei hakemusta',
      fee: '0 €',
      description: 'Palautus- ja peruutusehdot verkkokaupassa.',
      documents: ['Toimitusehdot', 'Palautusehdot']
    }
  ]
}

function analyzeInput(input: string): { category: string; permits: Permit[] } {
  const lower = input.toLowerCase()
  
  if (lower.includes('ravintola') || lower.includes('kahvila') || lower.includes('baari') || 
      lower.includes('ruoka') || lower.includes('anniskelu') || lower.includes('pub')) {
    return { category: 'Ravintola-ala', permits: PERMIT_DATABASE.ravintola }
  }
  
  if (lower.includes('rakennu') || lower.includes('laajen') || lower.includes('remon') ||
      lower.includes('tehdas') || lower.includes('halli') || lower.includes('varasto')) {
    return { category: 'Rakentaminen', permits: PERMIT_DATABASE.rakennus }
  }
  
  if (lower.includes('tapahtuma') || lower.includes('festivaali') || lower.includes('konsertti') ||
      lower.includes('messu') || lower.includes('markkin')) {
    return { category: 'Tapahtumat', permits: PERMIT_DATABASE.tapahtuma }
  }
  
  if (lower.includes('verkkokauppa') || lower.includes('nettikauppa') || lower.includes('e-commerce') ||
      lower.includes('myy verkossa')) {
    return { category: 'Verkkokauppa', permits: PERMIT_DATABASE.verkkokauppa }
  }
  
  // Default to restaurant if no match
  return { category: 'Yleinen liiketoiminta', permits: [...PERMIT_DATABASE.verkkokauppa] }
}

function App() {
  const [step, setStep] = useState<'input' | 'analysis' | 'result'>('input')
  const [input, setInput] = useState('')
  const [analysis, setAnalysis] = useState<{ category: string; permits: Permit[] } | null>(null)
  const [selectedPermit, setSelectedPermit] = useState<Permit | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    // Simulate AI analysis
    setTimeout(() => {
      const result = analyzeInput(input)
      setAnalysis(result)
      setStep('analysis')
      setIsAnalyzing(false)
    }, 1500)
  }

  const handleGenerateApplication = (permit: Permit) => {
    setSelectedPermit(permit)
    setStep('result')
  }

  const handleReset = () => {
    setStep('input')
    setInput('')
    setAnalysis(null)
    setSelectedPermit(null)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">📋</span>
          <h1>PermitPilot</h1>
        </div>
        <p className="tagline">AI-avustaja pk-yritysten lupahakemuksiin</p>
      </header>

      <main className="main">
        {step === 'input' && (
          <div className="step-input">
            <div className="hero">
              <h2>Kerro mitä haluat tehdä</h2>
              <p>Kuvaile liiketoimintaideasi tai projektisi, niin selvitämme tarvittavat luvat.</p>
            </div>

            <div className="input-section">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Esim. 'Haluan avata ravintolan Helsingin keskustaan, jossa on anniskelua ja terassi'"
                rows={4}
              />
              <button 
                className="btn-primary" 
                onClick={handleAnalyze}
                disabled={input.length < 10 || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <span className="spinner"></span>
                    Analysoidaan...
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    Analysoi tarvittavat luvat
                  </>
                )}
              </button>
            </div>

            <div className="examples">
              <h3>Kokeile näillä esimerkeillä:</h3>
              <div className="example-buttons">
                <button onClick={() => setInput('Haluan avata ravintolan Helsinkiin jossa on anniskelua ja terassi')}>
                  🍽️ Ravintola
                </button>
                <button onClick={() => setInput('Rakennan laajennuksen tehtaaseeni Vantaalla')}>
                  🏗️ Rakennus
                </button>
                <button onClick={() => setInput('Järjestän musiikkifestivaalin Helsingin keskustassa')}>
                  🎵 Tapahtuma
                </button>
                <button onClick={() => setInput('Perustan verkkokaupan jossa myyn vaatteita')}>
                  🛒 Verkkokauppa
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'analysis' && analysis && (
          <div className="step-analysis">
            <div className="analysis-header">
              <button className="btn-back" onClick={handleReset}>
                ← Takaisin
              </button>
              <div className="analysis-summary">
                <span className="category-badge">{analysis.category}</span>
                <h2>Löysimme {analysis.permits.length} tarvittavaa lupaa</h2>
                <p className="user-input">"{input}"</p>
              </div>
            </div>

            <div className="permits-list">
              {analysis.permits.map((permit, index) => (
                <div key={permit.id} className="permit-card">
                  <div className="permit-number">{index + 1}</div>
                  <div className="permit-content">
                    <h3>{permit.name}</h3>
                    <p className="permit-description">{permit.description}</p>
                    <div className="permit-meta">
                      <span className="meta-item">
                        <span className="meta-icon">🏛️</span>
                        {permit.authority}
                      </span>
                      <span className="meta-item">
                        <span className="meta-icon">⏱️</span>
                        {permit.processingTime}
                      </span>
                      <span className="meta-item">
                        <span className="meta-icon">💰</span>
                        {permit.fee}
                      </span>
                    </div>
                    <div className="permit-documents">
                      <strong>Tarvittavat liitteet:</strong>
                      <ul>
                        {permit.documents.map((doc, i) => (
                          <li key={i}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                    <button 
                      className="btn-generate"
                      onClick={() => handleGenerateApplication(permit)}
                    >
                      📄 Generoi hakemus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="timeline-section">
              <h3>📅 Suositeltu aikataulu</h3>
              <div className="timeline">
                {analysis.permits.map((permit, index) => (
                  <div key={permit.id} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <strong>Vaihe {index + 1}:</strong> {permit.name}
                      <span className="timeline-time">{permit.processingTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'result' && selectedPermit && (
          <div className="step-result">
            <button className="btn-back" onClick={() => setStep('analysis')}>
              ← Takaisin lupaluetteloon
            </button>

            <div className="application-preview">
              <div className="application-header">
                <h2>📄 {selectedPermit.name}</h2>
                <span className="status-badge">Luonnos valmis</span>
              </div>

              <div className="application-document">
                <div className="doc-header">
                  <img src="https://www.hel.fi/static/public/hela/Helsinki-logo.png" alt="" className="doc-logo" 
                       onError={(e) => { e.currentTarget.style.display = 'none' }} />
                  <div>
                    <h3>{selectedPermit.authority}</h3>
                    <p>Hakemus: {selectedPermit.name}</p>
                  </div>
                </div>

                <div className="doc-section">
                  <h4>1. Hakijan tiedot</h4>
                  <div className="form-grid">
                    <div className="form-field">
                      <label>Yrityksen nimi</label>
                      <input type="text" placeholder="[Yrityksen nimi Oy]" />
                    </div>
                    <div className="form-field">
                      <label>Y-tunnus</label>
                      <input type="text" placeholder="[1234567-8]" />
                    </div>
                    <div className="form-field">
                      <label>Yhteyshenkilö</label>
                      <input type="text" placeholder="[Etunimi Sukunimi]" />
                    </div>
                    <div className="form-field">
                      <label>Sähköposti</label>
                      <input type="email" placeholder="[email@yritys.fi]" />
                    </div>
                  </div>
                </div>

                <div className="doc-section">
                  <h4>2. Toiminnan kuvaus</h4>
                  <textarea 
                    rows={4}
                    defaultValue={`Haemme ${selectedPermit.name.toLowerCase()}a seuraavalle toiminnalle:\n\n${input}\n\nToiminta on tarkoitus aloittaa [päivämäärä].`}
                  />
                </div>

                <div className="doc-section">
                  <h4>3. Toimipaikan tiedot</h4>
                  <div className="form-grid">
                    <div className="form-field full-width">
                      <label>Osoite</label>
                      <input type="text" placeholder="[Katuosoite, 00100 Helsinki]" />
                    </div>
                  </div>
                </div>

                <div className="doc-section">
                  <h4>4. Liitteet</h4>
                  <div className="attachments-list">
                    {selectedPermit.documents.map((doc, i) => (
                      <div key={i} className="attachment-item">
                        <span className="attachment-icon">📎</span>
                        <span>{doc}</span>
                        <span className="attachment-status pending">Odottaa</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="doc-footer">
                  <p><em>Tämä on AI-generoitu luonnos. Tarkista tiedot ennen lähettämistä.</em></p>
                </div>
              </div>

              <div className="action-buttons">
                <button className="btn-secondary">
                  💾 Tallenna luonnos
                </button>
                <button className="btn-primary">
                  📤 Lataa PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>PermitPilot Demo — AI-avustaja pk-yritysten lupahakemuksiin</p>
        <p className="disclaimer">Tämä on demo. Tarkista aina viralliset vaatimukset viranomaiselta.</p>
      </footer>
    </div>
  )
}

export default App
