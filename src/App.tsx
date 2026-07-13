import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  GraduationCap, 
  Lock, 
  Unlock,
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
import studentsData from './students.json';

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

  // Re-initialize if the storage key changes (e.g. version bump)
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      } else {
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.warn('Error reading localStorage on key change', error);
    }
  }, [key]);

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
   HELPERS — ALL LOGIC UNCHANGED OR ADAPTED
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

  if (subject.type === 'numerical_aptitude') {
    const fa1 = Math.min(Number(subject.fa1) || 0, 20);
    const fa2 = Math.min(Number(subject.fa2) || 0, 20);
    const st1 = Math.min(Number(subject.st1) || 0, 30);
    const st2 = Math.min(Number(subject.st2) || 0, 30);
    const et  = Math.min(Number(subject.et)  || 0, 50);

    const faAvg = (fa1 + fa2) / 2;
    const stAvg = (st1 + st2) / 2;
    finalScore = faAvg + stAvg + et;
    
    tooltips = [
      'FA Avg: 20%',
      'ST Avg: 30%',
      'End Term: 50%'
    ];
  } else if (subject.type === 'art_communication') {
    const ca1 = Math.min(Number(subject.ca1) || 0, 30);
    const ca2 = Math.min(Number(subject.ca2) || 0, 70);
    finalScore = ca1 + ca2;
    tooltips = [
      'CA1 (Group Discussion): 30%',
      'CA2 (Personal Interview): 70%'
    ];
  } else if (subject.type === 'business_communication') {
    const ca1 = Math.min(Number(subject.ca1) || 0, 30);
    const ca2 = Math.min(Number(subject.ca2) || 0, 70);
    finalScore = ca1 + ca2;
    tooltips = [
      'CA1 (MCQs): 30%',
      'CA2 (Impromptu): 70%'
    ];
  } else if (subject.type === 'programming_abstractions') {
    const st1 = Math.min(Number(subject.st1) || 0, 40);
    const st2 = Math.min(Number(subject.st2) || 0, 40);
    const et  = Math.min(Number(subject.et)  || 0, 60);
    
    const stAvg = (st1 + st2) / 2;
    finalScore = stAvg + et;
    
    tooltips = [
      'ST Avg: 40%',
      'End Term: 60%'
    ];
  } else if (subject.type === 'backend_eng') {
    const abstract = Math.min(Number(subject.abstract) || 0, 20);
    const midterm  = Math.min(Number(subject.midterm)  || 0, 30);
    const endterm  = Math.min(Number(subject.endterm)  || 0, 50);
    finalScore = abstract + midterm + endterm;
    tooltips = [
      'Project Abstract & Synopsis: 20%',
      'Mid-Term Project Evaluation: 30%',
      'End Term Project Evaluation: 50%'
    ];
  } else if (subject.type === 'applied_ai') {
    const fa1 = Math.min(Number(subject.fa1) || 0, 25);
    const fa2 = Math.min(Number(subject.fa2) || 0, 25);
    const et  = Math.min(Number(subject.et)  || 0, 50);
    finalScore = fa1 + fa2 + et;
    tooltips = [
      'FA1: 25% (Slide 5, Comm 10, Report 5, Tech 5)',
      'FA2: 25% (Slide 5, Comm 10, Report 5, Tech 5)',
      'End Term: 50% (Slide 10, Comm 15, Report 10, Tech 15)'
    ];
  } else if (subject.type === 'standard') {
    const fa  = Math.min(Number(subject.fa)  || 0, 20);
    const st1 = Math.min(Number(subject.st1) || 0, 40);
    const st2 = Math.min(Number(subject.st2) || 0, 40);
    const et  = Math.min(Number(subject.et)  || 0, 60);
    const faS  = fa;
    const stS  = ((st1 + st2) / 2 / 40) * 30;
    const etS  = (et / 60) * 50;
    finalScore = faS + stS + etS;
    tooltips = ['FA: 20%', 'ST Avg: 30%', 'ET: 50%'];
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
            className="absolute left-1/2 bottom-full mb-3 -translate-x-1/2 w-56 bg-bg/95 border border-white/10 rounded-xl p-3.5 z-50 shadow-2xl backdrop-blur-md"
          >
            <p className="text-[10px] text-teal tracking-wider uppercase mb-1.5 font-bold">Evaluation Pattern</p>
            <ul className="space-y-1">
              {tips.map((t, i) => (
                <li key={i} className="text-xs text-white/70 flex items-start gap-2 leading-tight">
                  <div className="w-1 h-1 rounded-full bg-teal/50 mt-1.5 flex-shrink-0" />
                  <span>{t}</span>
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

const SubjectCard = ({ subject, index, onUpdate, disabled }: any) => {
  const { finalScore, grade, tooltips } = calculateSubjectStats(subject);
  
  const parts = subject.name.split(' – ');
  let displayCode = null;
  let displayName = subject.name;
  
  if (parts.length > 1 && !parts[0].includes(' ')) {
    displayCode = parts[0];
    displayName = parts.slice(1).join(' – ');
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`subject-card h-full flex flex-col ${grade.gradeKey} ${disabled ? 'opacity-30 grayscale pointer-events-none' : ''}`}
    >
      <div className="mb-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-sans font-semibold text-sm leading-snug text-white/90 flex-1 min-h-[36px]">
            {displayName}
          </h3>
          {subject.section !== 'overall' && (
            <Lock className="w-3.5 h-3.5 text-white/10 shrink-0 mt-0.5" />
          )}
        </div>
        <div className="flex items-center gap-3 mt-2">
          {displayCode && (
            <span className="credits-badge">
              {displayCode}
            </span>
          )}
          <span className="credits-badge">
            <BookOpen className="w-2.5 h-2.5 mr-1" />
            {subject.credits} CR
          </span>
          <Tooltip tips={tooltips} />
        </div>
      </div>

      {/* Inputs */}
      <div className="mb-4">
        {subject.type === 'numerical_aptitude' && (
          <div className="grid grid-cols-2 gap-2">
            {[
              { field: 'fa1', label: 'FA1', max: 20 },
              { field: 'fa2', label: 'FA2', max: 20 },
              { field: 'st1', label: 'ST1', max: 30 },
              { field: 'st2', label: 'ST2', max: 30 },
            ].map(({ field, label, max }) => (
              <div key={field}>
                <span className="field-label">{label} /{max}</span>
                <input 
                  type="number" 
                  className="input-field py-2 text-base" 
                  placeholder="—" 
                  value={subject[field] || ''}
                  onChange={e => onUpdate(subject.id, field, clampVal(e.target.value, max))} 
                />
              </div>
            ))}
            <div className="col-span-2 mt-1">
              <span className="field-label">End Term /50</span>
              <input 
                type="number" 
                className="input-field py-2 text-base" 
                placeholder="—" 
                value={subject.et || ''}
                onChange={e => onUpdate(subject.id, 'et', clampVal(e.target.value, 50))} 
              />
            </div>
          </div>
        )}

        {(subject.type === 'art_communication' || subject.type === 'business_communication') && (
          <div className="grid grid-cols-1 gap-2">
            {[
              { field: 'ca1', label: subject.type === 'art_communication' ? 'CA1 (GD)' : 'CA1 (MCQ)', max: 30 },
              { field: 'ca2', label: subject.type === 'art_communication' ? 'CA2 (PI)' : 'CA2 (Impromptu)', max: 70 },
            ].map(({ field, label, max }) => (
              <div key={field}>
                <span className="field-label">{label} /{max}</span>
                <input 
                  type="number" 
                  className="input-field py-2 text-base" 
                  placeholder="—" 
                  value={subject[field] || ''}
                  onChange={e => onUpdate(subject.id, field, clampVal(e.target.value, max))} 
                />
              </div>
            ))}
          </div>
        )}

        {subject.type === 'programming_abstractions' && (
          <div className="grid grid-cols-2 gap-2">
            {[
              { field: 'st1', label: 'ST1', max: 40 },
              { field: 'st2', label: 'ST2', max: 40 },
            ].map(({ field, label, max }) => (
              <div key={field}>
                <span className="field-label">{label} /{max}</span>
                <input 
                  type="number" 
                  className="input-field py-2 text-base" 
                  placeholder="—" 
                  value={subject[field] || ''}
                  onChange={e => onUpdate(subject.id, field, clampVal(e.target.value, max))} 
                />
              </div>
            ))}
            <div className="col-span-2 mt-1">
              <span className="field-label">End Term /60</span>
              <input 
                type="number" 
                className="input-field py-2 text-base" 
                placeholder="—" 
                value={subject.et || ''}
                onChange={e => onUpdate(subject.id, 'et', clampVal(e.target.value, 60))} 
              />
            </div>
          </div>
        )}

        {subject.type === 'backend_eng' && (
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <span className="field-label">Project Abstract & Synopsis /20</span>
              <input 
                type="number" 
                className="input-field py-2 text-base" 
                placeholder="—" 
                value={subject.abstract || ''}
                onChange={e => onUpdate(subject.id, 'abstract', clampVal(e.target.value, 20))} 
              />
            </div>
            <div>
              <span className="field-label">Mid-Term /30</span>
              <input 
                type="number" 
                className="input-field py-2 text-base" 
                placeholder="—" 
                value={subject.midterm || ''}
                onChange={e => onUpdate(subject.id, 'midterm', clampVal(e.target.value, 30))} 
              />
            </div>
            <div>
              <span className="field-label">End Term /50</span>
              <input 
                type="number" 
                className="input-field py-2 text-base" 
                placeholder="—" 
                value={subject.endterm || ''}
                onChange={e => onUpdate(subject.id, 'endterm', clampVal(e.target.value, 50))} 
              />
            </div>
          </div>
        )}

        {subject.type === 'applied_ai' && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="field-label">FA1 /25</span>
              <input 
                type="number" 
                className="input-field py-2 text-base" 
                placeholder="—" 
                value={subject.fa1 || ''}
                onChange={e => onUpdate(subject.id, 'fa1', clampVal(e.target.value, 25))} 
              />
            </div>
            <div>
              <span className="field-label">FA2 /25</span>
              <input 
                type="number" 
                className="input-field py-2 text-base" 
                placeholder="—" 
                value={subject.fa2 || ''}
                onChange={e => onUpdate(subject.id, 'fa2', clampVal(e.target.value, 25))} 
              />
            </div>
            <div className="col-span-2 mt-1">
              <span className="field-label">End Term /50</span>
              <input 
                type="number" 
                className="input-field py-2 text-base" 
                placeholder="—" 
                value={subject.et || ''}
                onChange={e => onUpdate(subject.id, 'et', clampVal(e.target.value, 50))} 
              />
            </div>
          </div>
        )}

        {subject.type === 'standard' && (
          <div className="grid grid-cols-2 gap-2">
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
                  value={subject[field] || ''}
                  onChange={e => onUpdate(subject.id, field, clampVal(e.target.value, max))} 
                />
              </div>
            ))}
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

  // Semester 5 Subject List
  const [subjects, setSubjects] = useLocalStorage('chitkara_calc_subjects_v7', [
    // Overall Semester (July – December)
    { id: 1, name: '25UNI0110 – Numerical Aptitude & Logical Reasoning-I', credits: 3, type: 'numerical_aptitude', section: 'overall', fa1: '', fa2: '', st1: '', st2: '', et: '' },
    { id: 2, name: '25UNI0113 – Art of Communication-II', credits: 3, type: 'art_communication', section: 'overall', ca1: '', ca2: '' },
    { id: 3, name: '24UNI0133 – Business & Professional Communication', credits: 3, type: 'business_communication', section: 'overall', ca1: '', ca2: '' },

    // Phase 1 (July – September)
    { id: 4, name: '26CS022 – Programming Abstractions', credits: 5, type: 'programming_abstractions', section: 'phase1', st1: '', st2: '', et: '' },
    { id: 5, name: '25CS022 – Back-end Engineering', credits: 4, type: 'backend_eng', section: 'phase1', abstract: '', midterm: '', endterm: '' },
    { id: 6, name: '26CS023 – Applied AI and Prototype Development', credits: 3, type: 'applied_ai', section: 'phase1', fa1: '', fa2: '', et: '' },

    // Phase 2 (October – December)
    { id: 7, name: 'Algorithm Design & Implementation', credits: 4, type: 'standard', section: 'phase2', fa: '', st1: '', st2: '', et: '' },
    { id: 8, name: 'Professional Practices – System Design', credits: 3, type: 'standard', section: 'phase2', fa: '', st1: '', st2: '', et: '' },
  ]);

  // Self-Correcting Migration Check: Resets state if outdated fields/subjects exist from testing
  useEffect(() => {
    setSubjects((prev: any[]) => {
      const isSem5 = prev.some(s => s.name.includes('25UNI0110') || s.name.includes('Numerical Aptitude'));
      const hasOldKeys = prev.some(s => s.type === 'csa' || s.type === 'ip' || s.type === 'es');
      if (!isSem5 || hasOldKeys || prev.length !== 8) {
        return [
          { id: 1, name: '25UNI0110 – Numerical Aptitude & Logical Reasoning-I', credits: 2, type: 'numerical_aptitude', section: 'overall', fa1: '', fa2: '', st1: '', st2: '', et: '' },
          { id: 2, name: '25UNI0113 – Art of Communication-II', credits: 2, type: 'art_communication', section: 'overall', ca1: '', ca2: '' },
          { id: 3, name: '24UNI0133 – Business & Professional Communication', credits: 2, type: 'business_communication', section: 'overall', ca1: '', ca2: '' },
          { id: 4, name: '26CS022 – Programming Abstractions', credits: 4, type: 'programming_abstractions', section: 'phase1', st1: '', st2: '', et: '' },
          { id: 5, name: '25CS022 – Back-end Engineering', credits: 4, type: 'backend_eng', section: 'phase1', abstract: '', midterm: '', endterm: '' },
          { id: 6, name: '26CS023 – Applied AI and Prototype Development', credits: 4, type: 'applied_ai', section: 'phase1', fa1: '', fa2: '', et: '' },
          { id: 7, name: 'Algorithm Design & Implementation', credits: 4, type: 'standard', section: 'phase2', fa: '', st1: '', st2: '', et: '' },
          { id: 8, name: 'Professional Practices – System Design', credits: 3, type: 'standard', section: 'phase2', fa: '', st1: '', st2: '', et: '' },
        ];
      }
      return prev;
    });
  }, [setSubjects]);

  // Phase 2 Lock State persistence
  const [phase2Unlocked, setPhase2Unlocked] = useLocalStorage('chitkara_calc_phase2_unlocked', false);
  const [commChoice, setCommChoice] = useLocalStorage('chitkara_calc_comm_choice_v5', 2); // 2 = Art, 3 = Business

  const [prevTab, setPrevTab] = useLocalStorage<'quick' | 'semwise'>('chitkara_calc_prevTab_v5', 'quick');
  const [quickCgpa, setQuickCgpa] = useLocalStorage('chitkara_calc_quickCgpa_v5', '');
  
  const [semWise, setSemWise] = useLocalStorage('chitkara_calc_semWise_v5', [
    { id: 1, name: 'Semester 1', sgpa: '' },
    { id: 2, name: 'Semester 2', sgpa: '' },
    { id: 3, name: 'Semester 3', sgpa: '' },
    { id: 4, name: 'Semester 4', sgpa: '' },
  ]);

  const [rollNumber, setRollNumber] = useState(() => sessionStorage.getItem('chitkara_roll_no') || '');
  const [rollInput, setRollInput] = useState('');
  const [rollError, setRollError] = useState('');
  
  useEffect(() => {
    if (rollNumber) sessionStorage.setItem('chitkara_roll_no', rollNumber);
  }, [rollNumber]);

  const updateSemWise = (id: number, field: string, value: string) => {
    const cleanValue = value.replace(/[^\d.]/g, '');
    setSemWise(semWise.map(s => s.id === id ? { ...s, [field]: cleanValue } : s));
  };

  const updateSubject = (id: number, field: string, value: string) => {
    const cleanValue = value.replace(/[^\d.]/g, '');
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: cleanValue } : s));
  };

  const semStats = useMemo(() => {
    let tc = 0, tp = 0;
    subjects.forEach(sub => {
      // Skip locked phase 2 subjects from calculations
      if (sub.section === 'phase2' && !phase2Unlocked) {
        return;
      }
      
      // Skip unselected communication choice
      if (sub.id === 2 && commChoice !== 2) return;
      if (sub.id === 3 && commChoice !== 3) return;

      const cr = sub.credits;
      const { grade } = calculateSubjectStats(sub);
      tc += cr; tp += cr * grade.point;
    });
    return { sgpa: tc > 0 ? tp / tc : 0, totalCredits: tc };
  }, [subjects, phase2Unlocked, commChoice]);

  const cumStats = useMemo(() => {
    if (prevTab === 'quick') {
      const pastCgpa = Number(quickCgpa) || 0;
      if (pastCgpa > 0 && semStats.sgpa > 0) return { cgpa: (pastCgpa * 4 + semStats.sgpa) / 5 };
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

  const cgpaThroughSem4 = useMemo(() => {
    let sum = 0, count = 0;
    semWise.forEach(s => {
      const g = Number(s.sgpa) || 0;
      if (g > 0) { sum += g; count++; }
    });
    return count > 0 ? sum / count : 0;
  }, [semWise]);

  // Background sync to Firestore
  useEffect(() => {
    if (!rollNumber) return;
    
    const timeout = setTimeout(async () => {
      try {
        const { doc, setDoc } = await import('firebase/firestore');
        const { db } = await import('./firebase');
        
        await setDoc(doc(db, 'student_data', rollNumber), {
          rollNumber,
          name: (studentsData as Record<string, string>)[rollNumber] || 'Unknown',
          subjects,
          semWise,
          quickCgpa,
          phase2Unlocked,
          commChoice,
          lastUpdated: new Date().toISOString(),
          computedTotalCgpa: cumStats.cgpa
        }, { merge: true });
      } catch (e) {
        // Run silently in the background
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [rollNumber, subjects, semWise, quickCgpa, phase2Unlocked, commChoice, cumStats]);

  return (
    <div className="relative min-h-screen">
      
      {/* Floating User Name - iPhone Glass Style */}
      <AnimatePresence>
        {rollNumber && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-xl bg-black/40 border border-white/10 shadow-2xl"
          >
            <div className="w-2 h-2 rounded-full bg-[#00eab8] animate-pulse shadow-[0_0_8px_#00eab8]"></div>
            <span className="text-white/90 text-xs sm:text-sm font-semibold tracking-wide truncate max-w-[150px] sm:max-w-[200px]">
              {(studentsData as Record<string, string>)[rollNumber] || 'Guest Student'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!rollNumber && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="glass-card p-10 w-full max-w-md flex flex-col items-center border-teal/20"
            >
              <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center text-teal mb-5 border border-teal/20 shadow-inner">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">Welcome!</h2>
              <p className="text-white/50 text-center text-sm mb-6">Please enter your University Roll Number to continue.</p>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const val = rollInput.trim();
                  if (!/^2\d1198\d{4}$/.test(val)) {
                    setRollError('Invalid Roll Number. Expected format: 2*1198****');
                    return;
                  }
                  
                  const sName = (studentsData as Record<string, string>)[val];
                  if (!sName) {
                    setRollError('Roll number not valid (Not found in database)');
                    return;
                  }

                  setRollError('');
                  setRollNumber(val);
                }}
                className="w-full flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1">
                  <input 
                    type="text" 
                    name="roll"
                    required
                    placeholder="e.g. 2111980000"
                    value={rollInput}
                    onChange={(e) => {
                      setRollError('');
                      const val = e.target.value.trim();
                      setRollInput(val);
                      const sName = (studentsData as Record<string, string>)[val];
                      if (val.length === 10 && /^2\d1198\d{4}$/.test(val)) {
                        if (!sName) {
                          setRollError('Roll number not valid');
                        }
                      }
                    }}
                    className={`input-field text-center py-4 ${rollError ? 'border-red-500 ring-4 ring-red-500/20' : ''}`}
                    autoFocus
                  />
                  <p className="text-teal/70 text-xs text-center font-bold tracking-wider mt-2">
                    It will help us to find in which batch you are !!
                  </p>
                </div>
                
                <AnimatePresence>
                  {rollError && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-400 text-xs font-bold text-center mt-[-4px]"
                    >
                      {rollError}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Live Name Validation Display */}
                <AnimatePresence>
                  {(() => {
                    const val = rollInput.trim();
                    const sName = (studentsData as Record<string, string>)[val];
                    if (val.length === 10 && /^2\d1198\d{4}$/.test(val) && sName) {
                      return (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center justify-center gap-2 bg-teal/10 border border-teal/20 text-teal font-bold px-4 py-2 rounded-xl mt-[-4px]"
                        >
                          <CheckCircle2 className="w-5 h-5 text-teal" />
                          <span>{sName}</span>
                        </motion.div>
                      );
                    }
                    return null;
                  })()}
                </AnimatePresence>

                <button 
                  type="submit" 
                  className="w-full py-4 bg-teal text-bg hover:bg-[#00eab8] font-bold rounded-xl tracking-wider uppercase transition-all shadow-md shadow-teal/20 hover:scale-105 active:scale-95 cursor-pointer mt-2"
                >
                  Continue
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
            Semester 5 &bull; Chitkara University
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

        <main className="flex flex-col gap-14 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          
          {/* CONTENT CONTAINERS */}
          <div className="min-w-0 flex flex-col gap-14">
            
            {/* OVERALL SEMESTER */}
            <section className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h2 className="text-2xl md:text-3xl font-display font-bold whitespace-nowrap">
                  Overall Semester <span className="text-white/30 text-lg md:text-xl font-normal hidden sm:inline-block ml-2">(July – December)</span>
                </h2>
                
                <div className="h-[1px] flex-1 bg-linear-to-r from-white/20 to-white/5 hidden xl:block" />
                
                <div className="flex p-1 bg-white/5 rounded-full border border-white/10 w-fit shrink-0">
                  {[[2, 'Art of Comm'], [3, 'Business Comm']].map(([key, label]) => (
                    <button 
                      key={key as number} 
                      onClick={() => setCommChoice(key as number)} 
                      className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                        commChoice === key ? 'bg-teal text-bg shadow-lg shadow-teal/20' : 'text-white/40 hover:text-white/60'
                      }`}
                    >
                      {label as string}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {subjects
                  .filter(sub => {
                    if (sub.section !== 'overall') return false;
                    if (sub.id === 2 && commChoice !== 2) return false;
                    if (sub.id === 3 && commChoice !== 3) return false;
                    return true;
                  })
                  .sort((a, b) => {
                    const order: any = { 'art_communication': 1, 'business_communication': 2, 'numerical_aptitude': 3 };
                    return (order[a.type] || 99) - (order[b.type] || 99);
                  })
                  .map((sub, idx) => (
                    <SubjectCard 
                      key={sub.id} 
                      subject={sub} 
                      index={idx}
                      onUpdate={updateSubject}
                    />
                  ))}
              </div>
            </section>

            {/* PHASE 1 */}
            <section className="space-y-6">
              <div className="flex items-center gap-6">
                <h2 className="text-2xl md:text-3xl font-display font-bold">Phase 1 (July – September)</h2>
                <div className="h-[1px] flex-1 bg-linear-to-r from-white/20 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {subjects.filter(sub => sub.section === 'phase1').map((sub, idx) => (
                  <SubjectCard 
                    key={sub.id} 
                    subject={sub} 
                    index={idx}
                    onUpdate={updateSubject} 
                  />
                ))}
              </div>
            </section>

            {/* PHASE 2 */}
            <section className="space-y-6">
              <div className="flex items-center gap-6">
                <h2 className="text-2xl md:text-3xl font-display font-bold">Phase 2 (October – December)</h2>
                <div className="h-[1px] flex-1 bg-linear-to-r from-white/20 to-transparent" />
              </div>
              
              <AnimatePresence mode="wait">
                {!phase2Unlocked ? (
                  <motion.div
                    key="locked"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-card p-8 flex flex-col items-center justify-center text-center border-dashed border-2 border-white/10 py-10"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-4 text-teal shadow-inner"
                    >
                      <Lock className="w-6 h-6" />
                    </motion.div>
                    <h3 className="text-lg font-display font-bold text-white/95">🔒 Phase 2 Locked</h3>
                    <p className="text-xs text-white/40 mt-0.5 mb-6 font-medium">October – December</p>
                    <button
                      onClick={() => setPhase2Unlocked(true)}
                      className="px-6 py-2.5 bg-teal text-bg hover:bg-[#00eab8] font-bold rounded-xl tracking-wider uppercase transition-all duration-300 shadow-md shadow-teal/20 hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      Unlock Phase 2
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="unlocked"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="glass-card p-5 flex items-center justify-between border-red-500/20 bg-red-500/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-center text-red-400">
                          <Unlock className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white/90">Phase 2 Unlocked</h4>
                          <p className="text-xs text-white/40 font-medium">October – December subjects are active</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPhase2Unlocked(false)}
                        className="px-5 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-xs font-bold uppercase text-red-400 hover:text-red-300 tracking-wider transition-all cursor-pointer"
                      >
                        Lock Phase 2
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {subjects.filter(sub => sub.section === 'phase2').map((sub, idx) => (
                        <SubjectCard 
                          key={sub.id} 
                          subject={sub} 
                          index={idx}
                          onUpdate={updateSubject} 
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>

          {/* 50/50 SPLIT FOR PREVIOUS SEMESTERS AND PERFORMANCE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch pt-10 border-t border-white/10">
            {/* PREVIOUS SEMESTERS */}
            <section className="flex flex-col h-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <h2 className="text-2xl md:text-3xl font-display font-bold">Earlier Semesters</h2>
                <div className="flex p-1 bg-white/5 rounded-full border border-white/10 w-fit">
                  {[['quick', 'Quick Entry'], ['semwise', 'Detailed']].map(([key, label]) => (
                    <button 
                      key={key} 
                      onClick={() => setPrevTab(key as any)} 
                      className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
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
                    className="glass-card p-6 md:p-8 w-full h-full flex flex-col justify-center"
                  >
                    <div className="mb-6 max-w-xs">
                      <span className="field-label">CGPA till Sem 4</span>
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
                      <p className="text-xs text-teal/70 leading-relaxed">
                        Enter your overall cumulative CGPA as seen on your grade card for Semesters 1 to 4 combined.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="detailed"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5"
                  >
                    {semWise.map(sem => (
                      <div key={sem.id} className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-display font-bold text-white/95 text-sm">{sem.name}</span>
                          <Lock className="w-3.5 h-3.5 text-white/20" />
                        </div>
                        <div>
                          <span className="field-label">SGPA</span>
                          <input 
                            type="number" 
                            step="0.01" 
                            className="input-field py-2 text-base" 
                            placeholder="—"
                            value={sem.sgpa}
                            onChange={e => updateSemWise(sem.id, 'sgpa', e.target.value)} 
                          />
                        </div>
                      </div>
                    ))}
                    <div className="sm:col-span-2 md:col-span-4 flex items-center justify-between p-5 rounded-2xl bg-teal/5 border border-teal/15">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-teal" />
                        <span className="text-xs font-semibold text-white/50 tracking-wide uppercase">Calculated CGPA (Sem 1-4)</span>
                      </div>
                      <span className="font-display font-extrabold text-2xl text-teal text-glow-teal">{cgpaThroughSem4.toFixed(2)}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* BOTTOM COLUMN: FLOATING RESULTS */}
            <section className="flex flex-col h-full">
              <aside className="w-full h-full">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-8 border-teal/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] h-full flex flex-col justify-center"
              >
                <h3 className="text-center text-xl font-display font-bold mb-10 tracking-tight">Performance</h3>
                
                <div className="flex items-center justify-center gap-8 mb-10">
                  <ProgressRing 
                    value={semStats.sgpa} 
                    color="#00d4aa" 
                    glow="rgba(0,212,170,0.5)" 
                    label="Sem 5 SGPA" 
                  />
                  <ProgressRing 
                    value={cumStats.cgpa} 
                    color="#f5c842" 
                    glow="rgba(245,200,66,0.5)" 
                    label="Total CGPA" 
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5">
                    <span className="text-xs text-white/40 uppercase tracking-widest font-bold">Credits</span>
                    <div className="flex items-center gap-2">
                      <span className="text-teal font-bold">{semStats.totalCredits}</span>
                      <span className="text-[10px] text-white/20 uppercase font-black tracking-tighter">Current</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </aside>
          </section>

          </div>



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
