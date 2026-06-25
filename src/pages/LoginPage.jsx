import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Target, Eye, HeartHandshake, Route, ShieldCheck,
  User, Lock, LogIn, ChevronLeft, ChevronRight,
} from 'lucide-react'
import Logo from '../components/ui/Logo.jsx'
import Alert from '../components/ui/Alert.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { extractError } from '../utils/format.js'

// Carrusel institucional — identidad de Banco Santander Consumer Perú.
const SLIDES = [
  {
    tag: 'NUESTRA MISIÓN',
    icon: Target,
    titulo: 'Misión',
    desc: 'Contribuir al progreso de las personas y las empresas del Perú, ofreciendo soluciones financieras de consumo con la solidez y confianza del Grupo Santander.',
    pills: ['Solidez', 'Confianza', 'Progreso'],
  },
  {
    tag: 'NUESTRA VISIÓN',
    icon: Eye,
    titulo: 'Visión',
    desc: 'Ser la entidad financiera de consumo más confiable del Perú, reconocida por su servicio excepcional, innovación y cercanía con cada cliente.',
    pills: ['Liderazgo', 'Innovación', 'Cercanía'],
  },
  {
    tag: 'NUESTROS VALORES',
    icon: HeartHandshake,
    titulo: 'Valores',
    desc: 'Actuamos con integridad, dinamismo y orientación al cliente. Somos un equipo comprometido con la excelencia y el desarrollo sostenible.',
    pills: ['Integridad', 'Dinamismo', 'Excelencia'],
  },
  {
    tag: 'FUERZA DE VENTAS',
    icon: Route,
    titulo: 'En el campo',
    desc: 'Tu cartera del día, evaluaciones crediticias y solicitudes en un solo lugar. Santander Consumer Perú te acompaña en cada gestión.',
    pills: ['Cartera', 'Evaluación', 'Cobranza'],
  },
]

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [codigo, setCodigo] = useState('')
  const [password, setPassword] = useState('')
  const [recordar, setRecordar] = useState(true)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [slide, setSlide] = useState(0)

  // Si ya hay sesión, va directo al panel.
  useEffect(() => {
    if (isAuthenticated) navigate('/inicio', { replace: true })
  }, [isAuthenticated, navigate])

  // Auto-rotación del carrusel.
  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 6000)
    return () => clearInterval(id)
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!codigo.trim() || !password) {
      setError('Ingresa tu DNI y contraseña.')
      return
    }
    setLoading(true)
    try {
      await login(codigo.trim(), password)
      navigate('/inicio', { replace: true })
    } catch (err) {
      setError(extractError(err, 'No se pudo iniciar sesión.'))
    } finally {
      setLoading(false)
    }
  }

  const s = SLIDES[slide]
  const SlideIcon = s.icon
  const prev = () => setSlide((v) => (v - 1 + SLIDES.length) % SLIDES.length)
  const next = () => setSlide((v) => (v + 1) % SLIDES.length)

  return (
    <div className="cm-login">
      {/* Cabecera flotante */}
      <div className="cm-login-topbar">
        <Logo size={40} variant="dark" subtitle="CORE FINANCIERO" />
        <span className="cm-login-chip">Sistema interno · Uso exclusivo del personal Santander</span>
      </div>

      {/* ===== Izquierda: carrusel "Nuestra esencia" ===== */}
      <section className="cm-hero">
        <span className="cm-hero-blob b1" />
        <span className="cm-hero-blob b2" />
        <button className="cm-hero-arrow left" onClick={prev} aria-label="Anterior"><ChevronLeft size={22} /></button>
        <button className="cm-hero-arrow right" onClick={next} aria-label="Siguiente"><ChevronRight size={22} /></button>

        <div className="cm-hero-inner">
          <span className="cm-hero-tag">{s.tag}</span>
          <div className="cm-hero-icon"><SlideIcon size={62} strokeWidth={1.5} /></div>
          <h1>{s.titulo}</h1>
          <p>{s.desc}</p>
          <div className="cm-hero-pills">
            {s.pills.map((p) => <span key={p} className="cm-hero-pill">{p}</span>)}
          </div>
        </div>

        <div className="cm-hero-dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`cm-hero-dot ${i === slide ? 'active' : ''}`}
              onClick={() => setSlide(i)}
              aria-label={`Ir al slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ===== Derecha: formulario de acceso ===== */}
      <section className="cm-auth">
        <span className="cm-auth-blob a1" />
        <span className="cm-auth-blob a2" />
        <div className="cm-auth-inner">
          <span className="cm-secure"><ShieldCheck size={15} /> Conexión segura</span>
          <h2>Inicia sesión</h2>
          <p className="cm-auth-lead">Acceso del personal Santander Consumer · ingresa con tu DNI.</p>

          <Alert tipo="error">{error}</Alert>

          <form onSubmit={onSubmit}>
            <div className="cm-field">
              <label htmlFor="codigo">Número de DNI</label>
              <div className="cm-input-wrap">
                <User size={18} />
                <input
                  id="codigo"
                  placeholder="Ej. 12345678"
                  autoComplete="username"
                  inputMode="numeric"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="cm-field">
              <label htmlFor="password">Contraseña</label>
              <div className="cm-input-wrap">
                <Lock size={18} />
                <input
                  id="password"
                  type="password"
                  placeholder="(en desarrollo: tu DNI)"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="cm-auth-row">
              <label className="cm-check">
                <input type="checkbox" checked={recordar} onChange={(e) => setRecordar(e.target.checked)} />
                Recordarme
              </label>
              <button type="button" className="cm-link" onClick={(e) => e.preventDefault()}>
                ¿Olvidó su contraseña?
              </button>
            </div>

            <button type="submit" className="cm-submit" disabled={loading}>
              <LogIn size={18} />
              {loading ? 'Ingresando…' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="cm-auth-hint">
            Demo · DNI/código <strong>0001</strong> · clave <strong>1234</strong>
          </p>
        </div>
      </section>
    </div>
  )
}
