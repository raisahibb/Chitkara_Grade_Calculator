import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  GraduationCap, 
  Lock, 
  Info, 
  CheckCircle2, 
  Layout, 
  Trophy, 
  ChevronRight,
  BookOpen,
  Award,
  Linkedin,
  Instagram
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/* =====================
   HOOKS
   ===================== */
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn('Error reading localStorage', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn('Error setting localStorage', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

/* =====================
   HELPERS — ALL LOGIC UNCHANGED
   ===================== */
function clampVal(raw: string, max: number): string {
  if (raw === '' || raw === '-') return '';
  const n = Number(raw);
  if (isNaN(n)) return '';
  return String(Math.min(Math.max(n, 0), max));
}

function getGradeInfo(finalScore: number) {
  if (finalScore >= 80) return { letter: 'O',  point: 10, gradeKey: 'grade-o',     badgeClass: 'grade-badge-o',     textColor: '#00d4aa', desc: 'Outstanding'  };
  if (finalScore >= 70) return { letter: 'A+', point:  9, gradeKey: 'grade-aplus', badgeClass: 'grade-badge-aplus', textColor: '#00d4aa', desc: 'Excellent'     };
  if (finalScore >= 60) return { letter: 'A',  point:  8, gradeKey: 'grade-a',     badgeClass: 'grade-badge-a',     textColor: '#4ade80', desc: 'Very Good'     };
  if (finalScore >= 55) return { letter: 'B+', point:  7, gradeKey: 'grade-bplus', badgeClass: 'grade-badge-bplus', textColor: '#4ade80', desc: 'Good'          };
  if (finalScore >= 50) return { letter: 'B',  point:  6, gradeKey: 'grade-b',     badgeClass: 'grade-badge-b',     textColor: '#facc15', desc: 'Above Average' };
  if (finalScore >= 45) return { letter: 'C',  point:  5, gradeKey: 'grade-c',     badgeClass: 'grade-badge-c',     textColor: '#facc15', desc: 'Average'       };
  if (finalScore >= 40) return { letter: 'P',  point:  4, gradeKey: 'grade-p',     badgeClass: 'grade-badge-p',     textColor: '#fb923c', desc: 'Pass'          };
  return                       { letter: 'F',  point:  0, gradeKey: 'grade-f',     badgeClass: 'grade-badge-f',     textColor: '#f87171', desc: 'Fail'          };
}

function calculateSubjectStats(subject: any) {
  let finalScore = 0;
  let tooltips: string[] = [];

  if (subject.type === 'standard') {
    const fa  = Math.min(Number(subject.fa)  || 0, 20);
    const st1 = Math.min(Number(subject.st1) || 0, 40);
    const st2 = Math.min(Number(subject.st2) || 0, 40);
    const et  = Math.min(Number(subject.et)  || 0, 60);
    const faS  = fa;
    const stS  = ((st1 + st2) / 2 / 40) * 30;
    const etS  = (et / 60) * 50;
    finalScore = faS + stS + etS;
    tooltips = ['FA: 20%', 'ST Avg: 30%', 'ET: 50%'];
  } else if (subject.type === 'ip') {
    const cert = subject.submitted ? 5 : 0;
    const pr1  = Math.min(Number(subject.pr1) || 0, 20);
    const pr2  = Math.min(Number(subject.pr2) || 0, 25);
    const ete  = Math.min(Number(subject.ete) || 0, 50);
    finalScore = cert + pr1 + pr2 + ete;
    tooltips = ['Cert: 5%', 'PR-1: 20%', 'PR-2: 25%', 'ETE: 50%'];
  } else if (subject.type === 'es') {
    const fa1 = Math.min(Number(subject.fa1) || 0, 20);
    const fa2 = Math.min(Number(subject.fa2) || 0, 20);
    const et  = Math.min(Number(subject.et)  || 0, 50);
    const etS = (et / 50) * 60;
    finalScore = fa1 + fa2 + etS;
    tooltips = ['FA-1: 20%', 'FA-2: 20%', 'ET: 60%'];
  }

  return { finalScore, grade: getGradeInfo(finalScore), tooltips };
}

function getClassification(cgpa: number) {
  if (cgpa >= 8.0) return 'Outstanding';
  if (cgpa >= 7.0) return 'Excellent';
  if (cgpa >= 6.0) return 'Very Good';
  if (cgpa >= 5.5) return 'Good';
  if (cgpa >= 5.0) return 'Above Average';
  if (cgpa >= 4.5) return 'Average';
  if (cgpa >= 4.0) return 'Pass';
  if (cgpa > 0)   return 'Fail';
  return 'N/A';
}

/* =====================
   COMPONENTS
   ===================== */
function ProgressRing({ value, max = 10, color, glow, label }: { value: number; max?: number; color: string; glow: string; label: string }) {
  const size = 110;
  const sw = 9;
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const pct = max > 0 ? value / max : 0;
  const offset = circ - pct * circ;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[110px] h-[110px]">
        <svg width="134" height="134" className="rotate-[-90deg] absolute -top-3 -left-3">
          <circle cx="67" cy="67" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={sw} />
          <motion.circle 
            cx="67" cy="67" r={r} fill="none" 
            stroke={color} strokeWidth={sw}
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-bold" style={{ color, textShadow: `0 0 16px ${glow}` }}>
            {value.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="mt-2 text-[10px] tracking-widest uppercase opacity-40 text-center">{label}</div>
    </div>
  );
}

function Tooltip({ tips }: { tips: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Info className="w-4 h-4 text-white/30 hover:text-teal cursor-help transition-colors" />
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            className="absolute left-1/2 bottom-full mb-3 -translate-x-1/2 w-48 bg-bg/95 border border-white/10 rounded-xl p-3 z-50 shadow-2xl backdrop-blur-md"
          >
            <p className="text-[10px] text-teal tracking-wider uppercase mb-1.5 font-bold">Formula</p>
            <ul className="space-y-1">
              {tips.map((t, i) => (
                <li key={i} className="text-xs text-white/70 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-teal/50" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-bg/95" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button 
      onClick={onChange} 
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${checked ? 'bg-teal' : 'bg-white/10'}`}
    >
      <motion.div 
        animate={{ x: checked ? 22 : 2 }}
        initial={false}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
      />
    </button>
  );
}

const SubjectCard = ({ subject, index, onUpdate, onToggle }: any) => {
  const { finalScore, grade, tooltips } = calculateSubjectStats(subject);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`subject-card ${grade.gradeKey}`}
    >
      <div className="mb-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-sans font-semibold text-sm leading-snug text-white/90 flex-1">
            {subject.name}
          </h3>
          <Lock className="w-4 h-4 text-white/20 mt-0.5 flex-shrink-0" />
        </div>
        <div className="flex items-center gap-3 mt-3">
          <span className="credits-badge">
            <BookOpen className="w-2.5 h-2.5 mr-1" />
            {subject.credits} CR
          </span>
          <Tooltip tips={tooltips} />
        </div>
      </div>

      {/* Inputs */}
      <div className="mb-4">
        {subject.type === 'standard' && (
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { field: 'fa',  label: 'FA',  max: 20 },
              { field: 'st1', label: 'ST1', max: 40 },
              { field: 'st2', label: 'ST2', max: 40 },
              { field: 'et',  label: 'ET',  max: 60 },
            ].map(({ field, label, max }) => (
              <div key={field}>
                <span className="field-label">{label} /{max}</span>
                <input 
                  type="number" 
                  className="input-field py-2 text-base" 
                  placeholder="—" 
                  value={subject[field]}
                  onChange={e => onUpdate(subject.id, field, clampVal(e.target.value, max))} 
                />
              </div>
            ))}
          </div>
        )}

        {subject.type === 'ip' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-black/20 rounded-xl p-3 border border-white/6">
              <span className="field-label mb-0">Certificate Submitted?</span>
              <Toggle checked={subject.submitted} onChange={() => onToggle(subject.id, 'submitted')} />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { field: 'pr1', label: 'PR-1', max: 20 },
                { field: 'pr2', label: 'PR-2', max: 25 },
              ].map(({ field, label, max }) => (
                <div key={field}>
                  <span className="field-label">{label} /{max}</span>
                  <input 
                    type="number" 
                    className="input-field py-2 text-base" 
                    placeholder="—" 
                    value={subject[field]}
                    onChange={e => onUpdate(subject.id, field, clampVal(e.target.value, max))} 
                  />
                </div>
              ))}
              <div className="col-span-2">
                <span className="field-label">ETE /50</span>
                <input 
                  type="number" 
                  className="input-field py-2 text-base" 
                  placeholder="—" 
                  value={subject.ete}
                  onChange={e => onUpdate(subject.id, 'ete', clampVal(e.target.value, 50))} 
                />
              </div>
            </div>
          </div>
        )}

        {subject.type === 'es' && (
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <span className="field-label">FA-1 /20</span>
              <input 
                type="number" 
                className="input-field py-2 text-base" 
                placeholder="—" 
                value={subject.fa1}
                onChange={e => onUpdate(subject.id, 'fa1', clampVal(e.target.value, 20))} 
              />
            </div>
            <div>
              <span className="field-label">FA-2 /20</span>
              <input 
                type="number" 
                className="input-field py-2 text-base" 
                placeholder="—" 
                value={subject.fa2}
                onChange={e => onUpdate(subject.id, 'fa2', clampVal(e.target.value, 20))} 
              />
            </div>
            <div className="col-span-2">
              <span className="field-label">End Term /50</span>
              <input 
                type="number" 
                className="input-field py-2 text-base" 
                placeholder="—" 
                value={subject.et}
                onChange={e => onUpdate(subject.id, 'et', clampVal(e.target.value, 50))} 
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/6 pt-3 mt-auto">
        <div className="flex gap-4">
          <span className="text-xs text-white/50">
            Score <strong className="text-white ml-0.5">{finalScore.toFixed(1)}</strong>
          </span>
          <span className="text-xs text-white/50">
            GP <strong className="text-white ml-0.5">{grade.point.toFixed(2)}</strong>
          </span>
        </div>
        <span className={`grade-badge ${grade.badgeClass}`}>{grade.letter}</span>
      </div>
    </motion.div>
  );
};

/* =====================
   MAIN APP
   ===================== */
export default function App() {
  // Prevent scroll from changing number inputs globally
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (document.activeElement && (document.activeElement as HTMLInputElement).type === 'number') {
        (document.activeElement as HTMLInputElement).blur();
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);
  const [subjects, setSubjects] = useLocalStorage('chitkara_calc_subjects_v2', [
    { id: 1, name: 'Machine Learning Systems for Real World', credits: 3, type: 'standard', fa: '', st1: '', st2: '', et: '' },
    { id: 2, name: 'Front-end Frameworks and Libraries',      credits: 3, type: 'standard', fa: '', st1: '', st2: '', et: '' },
    { id: 3, name: 'Object Oriented Software Engineering',    credits: 4, type: 'standard', fa: '', st1: '', st2: '', et: '' },
    { id: 4, name: 'Computer System Architecture',            credits: 3, type: 'standard', fa: '', st1: '', st2: '', et: '' },
    { id: 5, name: 'Integrated Project-II',                   credits: 2, type: 'ip',       submitted: false, pr1: '', pr2: '', ete: '' },
    { id: 6, name: 'Data Structures using Java',              credits: 5, type: 'standard', fa: '', st1: '', st2: '', et: '' },
    { id: 7, name: 'Environmental Sciences',                  credits: 2, type: 'es',       fa1: '', fa2: '', et: '' },
  ]);

  const [prevTab, setPrevTab] = useLocalStorage<'quick' | 'semwise'>('chitkara_calc_prevTab_v2', 'quick');
  const [quickCgpa, setQuickCgpa] = useLocalStorage('chitkara_calc_quickCgpa_v2', '');
  
  const [semWise, setSemWise] = useLocalStorage('chitkara_calc_semWise_v2', [
    { id: 1, name: 'Semester 1', sgpa: '' },
    { id: 2, name: 'Semester 2', sgpa: '' },
    { id: 3, name: 'Semester 3', sgpa: '' },
  ]);

  const updateSemWise = (id: number, field: string, value: string) =>
    setSemWise(semWise.map(s => s.id === id ? { ...s, [field]: value } : s));

  const updateSubject = (id: number, field: string, value: string) => 
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  
  const toggleSubject = (id: number, field: string) => 
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: !s[field] } : s));

  const semStats = useMemo(() => {
    let tc = 0, tp = 0;
    subjects.forEach(sub => {
      const cr = sub.credits;
      const { grade } = calculateSubjectStats(sub);
      tc += cr; tp += cr * grade.point;
    });
    return { sgpa: tc > 0 ? tp / tc : 0, totalCredits: tc };
  }, [subjects]);

  const cumStats = useMemo(() => {
    if (prevTab === 'quick') {
      const pastCgpa = Number(quickCgpa) || 0;
      if (pastCgpa > 0 && semStats.sgpa > 0) return { cgpa: (pastCgpa * 3 + semStats.sgpa) / 4 };
      if (pastCgpa > 0) return { cgpa: pastCgpa };
      return { cgpa: semStats.sgpa };
    } else {
      let sum = semStats.sgpa > 0 ? semStats.sgpa : 0;
      let count = semStats.sgpa > 0 ? 1 : 0;
      semWise.forEach(s => {
        const g = Number(s.sgpa) || 0;
        if (g > 0) { sum += g; count++; }
      });
      return { cgpa: count > 0 ? sum / count : 0 };
    }
  }, [semStats, prevTab, quickCgpa, semWise]);

  const cgpaThroughSem3 = useMemo(() => {
    let sum = 0, count = 0;
    semWise.forEach(s => {
      const g = Number(s.sgpa) || 0;
      if (g > 0) { sum += g; count++; }
    });
    return count > 0 ? sum / count : 0;
  }, [semWise]);

  return (
    <div className="relative min-h-screen">
      <div className="bg-scene">
        <div className="orb orb-teal" />
        <div className="orb orb-purple" />
        <div className="orb orb-gold" />
      </div>
      <div className="bg-noise" />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        
        {/* HEADER */}
        <header className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <GraduationCap className="w-4 h-4 text-teal" />
            <span className="text-xs font-bold tracking-widest uppercase text-white/60">Academic Tracker</span>
          </motion.div>
          <h1 className="font-display font-extrabold text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-transparent bg-clip-text bg-linear-to-br from-teal via-emerald-300 to-teal mb-6">
            Grade Calculator
          </h1>
          <p className="text-xs md:text-sm font-medium tracking-[0.4em] uppercase text-white/40 max-w-lg mx-auto mb-6">
            Semester 4 &bull; Chitkara University
          </p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-[10px] tracking-widest uppercase opacity-30 font-bold">Connect</span>
            <div className="w-8 h-[1px] bg-white/10" />
            <a href="https://www.linkedin.com/in/raisahib08/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-white/50 hover:text-[#0077b5] transition-all hover:scale-110">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/_raisahib08/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-white/50 hover:text-[#E1306C] transition-all hover:scale-110">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 items-start">
          
          {/* LEFT CONTENT */}
          <div className="min-w-0">
            <div className="flex items-center gap-6 mb-10">
              <h2 className="text-2xl md:text-3xl font-display font-bold">Curriculum</h2>
              <div className="h-[1px] flex-1 bg-linear-to-r from-white/20 to-transparent" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {subjects.map((sub, idx) => (
                <SubjectCard 
                  key={sub.id} 
                  subject={sub} 
                  index={idx}
                  onUpdate={updateSubject} 
                  onToggle={toggleSubject} 
                />
              ))}
            </div>

            {/* PREVIOUS SEMESTERS */}
            <section className="mt-20 pt-16 border-t border-white/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <h2 className="text-2xl md:text-3xl font-display font-bold">Earlier Semesters</h2>
                <div className="flex p-1 bg-white/5 rounded-full border border-white/10">
                  {[['quick', 'Quick Entry'], ['semwise', 'Detailed']].map(([key, label]) => (
                    <button 
                      key={key} 
                      onClick={() => setPrevTab(key as any)} 
                      className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${
                        prevTab === key ? 'bg-teal text-bg shadow-lg shadow-teal/20' : 'text-white/40 hover:text-white/60'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {prevTab === 'quick' ? (
                  <motion.div 
                    key="quick"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="glass-card p-8 max-w-xl"
                  >
                    <div className="mb-6 max-w-xs">
                      <span className="field-label">CGPA till Sem 3</span>
                      <div className="relative">
                        <input 
                          type="number" 
                          step="0.01" 
                          className="input-field pr-12" 
                          placeholder="8.45"
                          value={quickCgpa}
                          onChange={e => setQuickCgpa(e.target.value)} 
                        />
                        <Layout className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-teal/5 border border-teal/10 rounded-xl">
                      <Info className="w-4 h-4 text-teal mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-teal/70 leading-relaxed">
                        Enter your overall cumulative CGPA as seen on your grade card for Semesters 1 to 3 combined.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="detailed"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-5"
                  >
                    {semWise.map(sem => (
                      <div key={sem.id} className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-display font-bold text-white/90">{sem.name}</span>
                          <Lock className="w-4 h-4 text-white/20" />
                        </div>
                        <div>
                          <span className="field-label">SGPA</span>
                          <input 
                            type="number" 
                            step="0.01" 
                            className="input-field" 
                            placeholder="—"
                            value={sem.sgpa}
                            onChange={e => updateSemWise(sem.id, 'sgpa', e.target.value)} 
                          />
                        </div>
                      </div>
                    ))}
                    <div className="md:col-span-3 flex items-center justify-between p-5 rounded-2xl bg-teal/5 border border-teal/15">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-teal" />
                        <span className="text-sm font-medium text-white/50 tracking-wide uppercase">Calculated CGPA (Sem 1-3)</span>
                      </div>
                      <span className="font-display font-extrabold text-2xl text-teal text-glow-teal">{cgpaThroughSem3.toFixed(2)}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>

          {/* RIGHT PANEL - FLOATING RESULTS */}
          <aside className="lg:sticky lg:top-12 z-20">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 border-teal/10 shadow-[0_0_80px_rgba(0,0,0,0.5)]"
            >
              <h3 className="text-center text-xl font-display font-bold mb-10 tracking-tight">Performance</h3>
              
              <div className="flex items-center justify-center gap-8 mb-10">
                <ProgressRing 
                  value={semStats.sgpa} 
                  color="#00d4aa" 
                  glow="rgba(0,212,170,0.5)" 
                  label="Sem 4 SGPA" 
                />
                <ProgressRing 
                  value={cumStats.cgpa} 
                  color="#f5c842" 
                  glow="rgba(245,200,66,0.5)" 
                  label="Total CGPA" 
                />
              </div>

              <div className="space-y-3 mb-10">
                <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5">
                  <span className="text-xs text-white/40 uppercase tracking-widest font-bold">Credits</span>
                  <div className="flex items-center gap-2">
                    <span className="text-teal font-bold">{semStats.totalCredits}</span>
                    <span className="text-[10px] text-white/20 uppercase font-black tracking-tighter">Current</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-6 border-t border-white/5">
                <p className="text-[10px] tracking-[0.2em] uppercase opacity-40 mb-4 font-black">Classification</p>
                <motion.div 
                  key={getClassification(cumStats.cgpa)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="classification-badge group cursor-default"
                >
                  <Award className="w-5 h-5 mr-3 text-teal group-hover:scale-110 transition-transform" />
                  {getClassification(cumStats.cgpa)}
                </motion.div>
              </div>
            </motion.div>

            {/* Quick Link/CTA */}
            <div className="mt-6 flex flex-col gap-3">
              <a 
                href="#" 
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300 group"
              >
                <span className="text-xs font-bold tracking-widest uppercase">View Grade Card</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </aside>

        </main>

        {/* FOOTER */}
        <footer className="mt-32 pt-10 border-t border-white/5 text-center pb-12">
          <p className="text-[10px] tracking-[0.3em] uppercase opacity-40 mb-6">
            Crafted with Laptop Owned by <span className="text-teal opacity-100 font-bold">Rai Sahib</span>
          </p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-[10px] tracking-widest uppercase opacity-30 font-bold">Connect</span>
            <div className="w-8 h-[1px] bg-white/10" />
            <a href="https://www.linkedin.com/in/raisahib08/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-white/50 hover:text-[#0077b5] transition-all hover:scale-110">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/_raisahib08/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-white/50 hover:text-[#E1306C] transition-all hover:scale-110">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
