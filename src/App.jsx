import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  Calendar, Clock, Moon, Sun, ChevronLeft, ChevronRight, 
  GripVertical, Save, RotateCcw, Check, X, Plus, Trash2,
  Briefcase, Coffee, Home, Heart, Utensils, Car, Dumbbell, 
  Music, Star, Sparkles, Settings, BarChart3, TrendingUp,
  Award, Zap, Cloud, CloudOff, Loader2, Palette, CalendarCheck,
  Download, ExternalLink, RefreshCw
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Supabase Client
const supabaseUrl = 'https://wxqtgvuqfmyjrbiehfnq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4cXRndnVxZm15anJiaWVoZm5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NDkwMTEsImV4cCI6MjA4MzQyNTAxMX0.cxwgLVdINvzDtMwBPXHI8Rnp-xOy-4YDTt8pvhzSQK4';
const supabase = createClient(supabaseUrl, supabaseKey);

// Schedule API
const scheduleApi = {
  async load(userId) {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('schedule_data')
        .eq('user_id', userId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data?.schedule_data || null;
    } catch (e) {
      console.error('Load error:', e);
      return null;
    }
  },
  async save(userId, scheduleData) {
    try {
      const { error } = await supabase
        .from('schedules')
        .upsert({ user_id: userId, schedule_data: scheduleData, updated_at: new Date().toISOString() });
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Save error:', e);
      return false;
    }
  }
};

// Theme System
const themes = {
  ocean: { 
    name: 'Ocean', 
    primary: '#0ea5e9', 
    secondary: '#06b6d4', 
    accent: '#22d3ee',
    gradient: 'from-sky-500 via-cyan-500 to-teal-500'
  },
  sunset: { 
    name: 'Sunset', 
    primary: '#f97316', 
    secondary: '#f59e0b', 
    accent: '#fbbf24',
    gradient: 'from-orange-500 via-amber-500 to-yellow-500'
  },
  forest: { 
    name: 'Forest', 
    primary: '#22c55e', 
    secondary: '#10b981', 
    accent: '#34d399',
    gradient: 'from-green-500 via-emerald-500 to-teal-500'
  },
  berry: { 
    name: 'Berry', 
    primary: '#a855f7', 
    secondary: '#d946ef', 
    accent: '#f0abfc',
    gradient: 'from-purple-500 via-fuchsia-500 to-pink-500'
  },
  rose: { 
    name: 'Rose', 
    primary: '#f43f5e', 
    secondary: '#ec4899', 
    accent: '#fb7185',
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500'
  },
  slate: { 
    name: 'Slate', 
    primary: '#64748b', 
    secondary: '#475569', 
    accent: '#94a3b8',
    gradient: 'from-slate-500 via-gray-500 to-zinc-500'
  }
};

// Categories with icons and colors
const categories = {
  'Work': { icon: Briefcase, accent: '#3b82f6', bg: 'bg-blue-500/20' },
  'Development': { icon: Zap, accent: '#8b5cf6', bg: 'bg-violet-500/20' },
  'Personal': { icon: Star, accent: '#f59e0b', bg: 'bg-amber-500/20' },
  'Family': { icon: Heart, accent: '#ec4899', bg: 'bg-pink-500/20' },
  'Meals': { icon: Utensils, accent: '#22c55e', bg: 'bg-green-500/20' },
  'Morning': { icon: Coffee, accent: '#f97316', bg: 'bg-orange-500/20' },
  'Exercise': { icon: Dumbbell, accent: '#06b6d4', bg: 'bg-cyan-500/20' },
  'Travel': { icon: Car, accent: '#6366f1', bg: 'bg-indigo-500/20' },
  'Music': { icon: Music, accent: '#a855f7', bg: 'bg-purple-500/20' },
  'Home': { icon: Home, accent: '#14b8a6', bg: 'bg-teal-500/20' },
  'Transition': { icon: Clock, accent: '#64748b', bg: 'bg-slate-500/20' },
  'Business': { icon: Briefcase, accent: '#0ea5e9', bg: 'bg-sky-500/20' },
};

const categoryList = Object.keys(categories).filter(c => c !== 'Transition');
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const durationPresets = [15, 30, 45, 60, 90, 120];

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Initial Schedule Data
const initialSchedule = {
  Monday: [
    { id: generateId(), time: '5:45 AM', activity: '☀️ Wake Up & Get Ready', duration: 45, category: 'Morning' },
    { id: generateId(), time: '6:30 AM', activity: '🥚 Egg, Inc Time', duration: 30, category: 'Personal' },
    { id: generateId(), time: '7:00 AM', activity: '👨‍💻 TAG Dev Sprint', duration: 60, category: 'Development' },
    { id: generateId(), time: '8:00 AM', activity: '🍳 Breakfast & Kids Ready', duration: 60, category: 'Family' },
    { id: generateId(), time: '9:00 AM', activity: '⌨️ KeyPerfect Dev', duration: 120, category: 'Development' },
    { id: generateId(), time: '11:00 AM', activity: '🏪 Patty Shack Ops', duration: 120, category: 'Business' },
    { id: generateId(), time: '1:00 PM', activity: '🥗 Lunch Break', duration: 60, category: 'Meals' },
    { id: generateId(), time: '2:00 PM', activity: '📊 Business Admin', duration: 120, category: 'Work' },
    { id: generateId(), time: '4:00 PM', activity: '🏠 Family Time', duration: 120, category: 'Family' },
    { id: generateId(), time: '6:00 PM', activity: '🍝 Dinner', duration: 60, category: 'Meals' },
    { id: generateId(), time: '7:00 PM', activity: '🎸 Guitar Practice', duration: 60, category: 'Music' },
    { id: generateId(), time: '8:00 PM', activity: '👨‍👩‍👧‍👦 Evening with Family', duration: 90, category: 'Family' },
    { id: generateId(), time: '9:30 PM', activity: '😴 Wind Down & Sleep', duration: 30, category: 'Personal' },
  ],
  Tuesday: [
    { id: generateId(), time: '5:45 AM', activity: '☀️ Wake Up & Get Ready', duration: 45, category: 'Morning' },
    { id: generateId(), time: '6:30 AM', activity: '🥚 Egg, Inc Time', duration: 30, category: 'Personal' },
    { id: generateId(), time: '7:00 AM', activity: '👨‍💻 TAG Dev Sprint', duration: 60, category: 'Development' },
    { id: generateId(), time: '8:00 AM', activity: '🍳 Breakfast & Kids Ready', duration: 60, category: 'Family' },
    { id: generateId(), time: '9:00 AM', activity: '🏪 Patty Shack Visits', duration: 180, category: 'Business' },
    { id: generateId(), time: '12:00 PM', activity: '🥗 Lunch', duration: 60, category: 'Meals' },
    { id: generateId(), time: '1:00 PM', activity: '⌨️ KeyPerfect Dev', duration: 180, category: 'Development' },
    { id: generateId(), time: '4:00 PM', activity: '🏠 Family Time', duration: 120, category: 'Family' },
    { id: generateId(), time: '6:00 PM', activity: '🍝 Dinner', duration: 60, category: 'Meals' },
    { id: generateId(), time: '7:00 PM', activity: '🖨️ 3D Printing Project', duration: 90, category: 'Personal' },
    { id: generateId(), time: '8:30 PM', activity: '👨‍👩‍👧‍👦 Evening with Family', duration: 60, category: 'Family' },
    { id: generateId(), time: '9:30 PM', activity: '😴 Wind Down & Sleep', duration: 30, category: 'Personal' },
  ],
  Wednesday: [
    { id: generateId(), time: '5:45 AM', activity: '☀️ Wake Up & Get Ready', duration: 45, category: 'Morning' },
    { id: generateId(), time: '6:30 AM', activity: '🥚 Egg, Inc Time', duration: 30, category: 'Personal' },
    { id: generateId(), time: '7:00 AM', activity: '👨‍💻 TAG Dev Sprint', duration: 60, category: 'Development' },
    { id: generateId(), time: '8:00 AM', activity: '🍳 Breakfast & Kids Ready', duration: 60, category: 'Family' },
    { id: generateId(), time: '9:00 AM', activity: '⌨️ KeyPerfect Dev', duration: 120, category: 'Development' },
    { id: generateId(), time: '11:00 AM', activity: '🏪 Patty Shack Ops', duration: 120, category: 'Business' },
    { id: generateId(), time: '1:00 PM', activity: '🥗 Lunch Break', duration: 60, category: 'Meals' },
    { id: generateId(), time: '2:00 PM', activity: '🎯 BONUS Dev Block', duration: 120, category: 'Development', special: true },
    { id: generateId(), time: '4:00 PM', activity: '🏠 Family Time', duration: 120, category: 'Family' },
    { id: generateId(), time: '6:00 PM', activity: '🍝 Dinner', duration: 60, category: 'Meals' },
    { id: generateId(), time: '7:00 PM', activity: '🎸 Guitar Practice', duration: 60, category: 'Music' },
    { id: generateId(), time: '8:00 PM', activity: '👨‍👩‍👧‍👦 Evening with Family', duration: 90, category: 'Family' },
    { id: generateId(), time: '9:30 PM', activity: '😴 Wind Down & Sleep', duration: 30, category: 'Personal' },
  ],
  Thursday: [
    { id: generateId(), time: '5:45 AM', activity: '☀️ Wake Up & Get Ready', duration: 45, category: 'Morning' },
    { id: generateId(), time: '6:30 AM', activity: '🥚 Egg, Inc Time', duration: 30, category: 'Personal' },
    { id: generateId(), time: '7:00 AM', activity: '👨‍💻 TAG Dev Sprint', duration: 60, category: 'Development' },
    { id: generateId(), time: '8:00 AM', activity: '🍳 Breakfast & Kids Ready', duration: 60, category: 'Family' },
    { id: generateId(), time: '9:00 AM', activity: '⌨️ KeyPerfect Dev', duration: 120, category: 'Development' },
    { id: generateId(), time: '11:00 AM', activity: '🏪 Patty Shack Ops', duration: 120, category: 'Business' },
    { id: generateId(), time: '1:00 PM', activity: '🥗 Lunch Break', duration: 60, category: 'Meals' },
    { id: generateId(), time: '2:00 PM', activity: '📊 Business Admin', duration: 120, category: 'Work' },
    { id: generateId(), time: '4:00 PM', activity: '🎤 Mia Voice Lessons', duration: 60, category: 'Family', special: true },
    { id: generateId(), time: '5:00 PM', activity: '🏠 Family Time', duration: 60, category: 'Family' },
    { id: generateId(), time: '6:00 PM', activity: '🍝 Dinner', duration: 60, category: 'Meals' },
    { id: generateId(), time: '7:00 PM', activity: '🎸 Guitar Practice', duration: 60, category: 'Music' },
    { id: generateId(), time: '8:00 PM', activity: '👨‍👩‍👧‍👦 Evening with Family', duration: 90, category: 'Family' },
    { id: generateId(), time: '9:30 PM', activity: '😴 Wind Down & Sleep', duration: 30, category: 'Personal' },
  ],
  Friday: [
    { id: generateId(), time: '5:45 AM', activity: '☀️ Wake Up & Get Ready', duration: 45, category: 'Morning' },
    { id: generateId(), time: '6:30 AM', activity: '🥚 Egg, Inc Time', duration: 30, category: 'Personal' },
    { id: generateId(), time: '7:00 AM', activity: '👨‍💻 TAG Dev Sprint', duration: 60, category: 'Development' },
    { id: generateId(), time: '8:00 AM', activity: '🍳 Breakfast & Kids Ready', duration: 60, category: 'Family' },
    { id: generateId(), time: '9:00 AM', activity: '⌨️ KeyPerfect Dev', duration: 120, category: 'Development' },
    { id: generateId(), time: '11:00 AM', activity: '🏪 Patty Shack Ops', duration: 120, category: 'Business' },
    { id: generateId(), time: '1:00 PM', activity: '🥗 Lunch Break', duration: 60, category: 'Meals' },
    { id: generateId(), time: '2:00 PM', activity: '📊 Week Review', duration: 120, category: 'Work' },
    { id: generateId(), time: '4:00 PM', activity: '🏠 Family Time', duration: 120, category: 'Family' },
    { id: generateId(), time: '6:00 PM', activity: '🍕 PIZZA NIGHT!', duration: 60, category: 'Meals', special: true },
    { id: generateId(), time: '7:00 PM', activity: '🎬 FAMILY MOVIE NIGHT!', duration: 150, category: 'Family', special: true },
    { id: generateId(), time: '9:30 PM', activity: '😴 Wind Down & Sleep', duration: 30, category: 'Personal' },
  ],
  Saturday: [
    { id: generateId(), time: '7:00 AM', activity: '☀️ Sleep In & Relax', duration: 60, category: 'Personal' },
    { id: generateId(), time: '8:00 AM', activity: '🍳 Family Breakfast', duration: 60, category: 'Meals' },
    { id: generateId(), time: '9:00 AM', activity: '🥚 Egg, Inc Time', duration: 30, category: 'Personal' },
    { id: generateId(), time: '9:30 AM', activity: '👨‍💻 Vibe Coding Session', duration: 150, category: 'Development', special: true },
    { id: generateId(), time: '12:00 PM', activity: '🥗 Lunch', duration: 60, category: 'Meals' },
    { id: generateId(), time: '1:00 PM', activity: '🏠 Family Activities', duration: 180, category: 'Family' },
    { id: generateId(), time: '4:00 PM', activity: '🎸 Extended Guitar Time', duration: 90, category: 'Music' },
    { id: generateId(), time: '5:30 PM', activity: '💃 Get Ready for Date', duration: 30, category: 'Personal' },
    { id: generateId(), time: '6:00 PM', activity: '💑 DATE NIGHT with Aimee!', duration: 180, category: 'Family', special: true },
    { id: generateId(), time: '9:00 PM', activity: '🏠 Home & Relax', duration: 60, category: 'Personal' },
    { id: generateId(), time: '10:00 PM', activity: '😴 Sleep', duration: 30, category: 'Personal' },
  ],
  Sunday: [
    { id: generateId(), time: '7:30 AM', activity: '☀️ Sleep In & Relax', duration: 90, category: 'Personal' },
    { id: generateId(), time: '9:00 AM', activity: '🍳 Family Breakfast', duration: 60, category: 'Meals' },
    { id: generateId(), time: '10:00 AM', activity: '⛪ Church & Spiritual', duration: 180, category: 'Family' },
    { id: generateId(), time: '1:00 PM', activity: '🥗 Sunday Lunch', duration: 60, category: 'Meals' },
    { id: generateId(), time: '2:00 PM', activity: '🏠 Rest & Family Time', duration: 120, category: 'Family' },
    { id: generateId(), time: '4:00 PM', activity: '👨‍💻 Week Prep Coding', duration: 120, category: 'Development' },
    { id: generateId(), time: '6:00 PM', activity: '🍝 Family Dinner', duration: 60, category: 'Meals' },
    { id: generateId(), time: '7:00 PM', activity: '📋 Week Planning', duration: 60, category: 'Work' },
    { id: generateId(), time: '8:00 PM', activity: '👨‍👩‍👧‍👦 Evening with Family', duration: 60, category: 'Family' },
    { id: generateId(), time: '9:00 PM', activity: '😴 Early Sleep for Monday', duration: 30, category: 'Personal' },
  ]
};

// Helper Functions
const formatDuration = (mins) => {
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return remainingMins > 0 ? `${hrs}h ${remainingMins}m` : `${hrs}h`;
};

const parseTimeToMinutes = (timeStr) => {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let [, hours, minutes, period] = match;
  hours = parseInt(hours);
  minutes = parseInt(minutes);
  if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
  if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const formatMinutesToTime = (totalMinutes) => {
  let hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Calendar Sync Utilities
const getNextDayDate = (dayName) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  const todayIndex = today.getDay();
  const targetIndex = days.indexOf(dayName);
  let daysUntil = targetIndex - todayIndex;
  if (daysUntil < 0) daysUntil += 7;
  if (daysUntil === 0) daysUntil = 0; // If it's today, use today
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysUntil);
  return targetDate;
};

const formatDateForCalendar = (date) => {
  return date.toISOString().split('T')[0].replace(/-/g, '');
};

const formatTimeForCalendar = (timeStr, date) => {
  const minutes = parseTimeToMinutes(timeStr);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const dateStr = formatDateForCalendar(date);
  return `${dateStr}T${hours.toString().padStart(2, '0')}${mins.toString().padStart(2, '0')}00`;
};

const generateICSFile = (schedule, selectedDay = null) => {
  const daysToExport = selectedDay ? [selectedDay] : Object.keys(schedule);
  let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Justin's Schedule App//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Schedule App
`;

  daysToExport.forEach(day => {
    const activities = schedule[day] || [];
    const dayDate = getNextDayDate(day);
    
    activities.forEach(item => {
      const startTime = formatTimeForCalendar(item.time, dayDate);
      const endMinutes = parseTimeToMinutes(item.time) + item.duration;
      const endTime = formatTimeForCalendar(formatMinutesToTime(endMinutes), dayDate);
      const uid = `${item.id}-${day}@schedule.newbold.cloud`;
      
      icsContent += `BEGIN:VEVENT
DTSTART:${startTime}
DTEND:${endTime}
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
UID:${uid}
SUMMARY:${item.activity.replace(/[,;]/g, '')}
DESCRIPTION:Category: ${item.category}${item.special ? ' (Special Event)' : ''}
CATEGORIES:${item.category}
STATUS:CONFIRMED
END:VEVENT
`;
    });
  });

  icsContent += 'END:VCALENDAR';
  return icsContent;
};

const downloadICSFile = (schedule, selectedDay = null) => {
  const icsContent = generateICSFile(schedule, selectedDay);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = selectedDay ? `schedule-${selectedDay.toLowerCase()}.ics` : 'schedule-full-week.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const generateGoogleCalendarLink = (item, day) => {
  const dayDate = getNextDayDate(day);
  const startTime = formatTimeForCalendar(item.time, dayDate);
  const endMinutes = parseTimeToMinutes(item.time) + item.duration;
  const endTime = formatTimeForCalendar(formatMinutesToTime(endMinutes), dayDate);
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: item.activity,
    dates: `${startTime}/${endTime}`,
    details: `Category: ${item.category}${item.special ? '\\n⭐ Special Event' : ''}\\n\\nCreated from Schedule App`,
    ctz: 'America/Denver'
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// Glass Card Component
const GlassCard = ({ children, className = '', darkMode, glow, glowColor }) => (
  <div 
    className={`rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
      darkMode 
        ? 'bg-white/5 border-white/10 shadow-xl shadow-black/20' 
        : 'bg-white/70 border-gray-200 shadow-lg shadow-gray-200/50'
    } ${glow ? 'ring-1' : ''} ${className}`}
    style={glow ? { 
      boxShadow: `0 0 30px ${glowColor}20, 0 10px 40px ${glowColor}10`,
      borderColor: `${glowColor}30`
    } : {}}
  >
    {children}
  </div>
);

// Mini Chart Component for Categories
const CategoryMiniChart = ({ stats, darkMode }) => {
  const total = Object.values(stats).reduce((sum, s) => sum + s.weekly, 0) || 1;
  const sortedStats = Object.entries(stats)
    .filter(([_, data]) => data.weekly > 0)
    .sort((a, b) => b[1].weekly - a[1].weekly)
    .slice(0, 5);

  return (
    <div className="flex items-center gap-1">
      {sortedStats.map(([category, data], i) => {
        const height = Math.max(20, (data.weekly / total) * 100);
        return (
          <div 
            key={category}
            className="w-6 rounded-t-lg transition-all duration-500 hover:scale-110"
            style={{ 
              height: `${height}px`,
              backgroundColor: categories[category]?.accent || '#64748b',
              opacity: 1 - (i * 0.15)
            }}
            title={`${category}: ${formatDuration(data.weekly)}`}
          />
        );
      })}
    </div>
  );
};

// Animated Progress Ring
const ProgressRing = ({ progress, size = 80, strokeWidth = 6, color }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-gray-200 dark:text-white/10"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000"
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
    </svg>
  );
};

// Main Component
export default function JustinSchedule() {
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date();
    return days[today.getDay() === 0 ? 6 : today.getDay() - 1];
  });
  const [showTransitions, setShowTransitions] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('ocean');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [schedule, setSchedule] = useState(initialSchedule);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [view, setView] = useState('schedule');
  const [editingItem, setEditingItem] = useState(null);
  const [editValues, setEditValues] = useState({ activity: '', duration: 0, time: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ activity: '', duration: 30, category: 'Personal' });
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragNode = useRef(null);

  const theme = themes[selectedTheme];

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load schedule from cloud
  useEffect(() => {
    const loadSchedule = async () => {
      setIsSyncing(true);
      setSyncStatus('syncing');
      try {
        const cloudData = await scheduleApi.load('justin');
        if (cloudData) {
          setSchedule(cloudData);
          localStorage.setItem('justinSchedule', JSON.stringify(cloudData));
          setSyncStatus('synced');
        } else {
          const saved = localStorage.getItem('justinSchedule');
          if (saved) setSchedule(JSON.parse(saved));
          setSyncStatus('idle');
        }
      } catch (e) {
        const saved = localStorage.getItem('justinSchedule');
        if (saved) setSchedule(JSON.parse(saved));
        setSyncStatus('error');
      }
      setIsSyncing(false);
    };
    loadSchedule();
  }, []);

  // Get current activity
  const getCurrentActivity = useCallback(() => {
    const now = currentTime;
    const dayName = days[now.getDay() === 0 ? 6 : now.getDay() - 1];
    const todaySchedule = schedule[dayName];
    if (!todaySchedule) return null;

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    for (let i = 0; i < todaySchedule.length; i++) {
      const item = todaySchedule[i];
      const itemStart = parseTimeToMinutes(item.time);
      const itemEnd = itemStart + item.duration;
      
      if (currentMinutes >= itemStart && currentMinutes < itemEnd) {
        const elapsed = currentMinutes - itemStart;
        const remaining = itemEnd - currentMinutes;
        const progress = (elapsed / item.duration) * 100;
        return { ...item, remaining, progress, dayName };
      }
    }
    return null;
  }, [currentTime, schedule]);

  const currentActivity = getCurrentActivity();

  // Check if item is current
  const isCurrentActivity = useCallback((item) => {
    if (!currentActivity) return false;
    const today = days[currentTime.getDay() === 0 ? 6 : currentTime.getDay() - 1];
    return selectedDay === today && item.id === currentActivity.id;
  }, [currentActivity, currentTime, selectedDay]);

  // Filter schedule
  const filteredSchedule = useMemo(() => {
    const daySchedule = schedule[selectedDay] || [];
    return showTransitions ? daySchedule : daySchedule.filter(item => item.category !== 'Transition');
  }, [schedule, selectedDay, showTransitions]);

  // Calculate stats
  const stats = useMemo(() => {
    const result = {};
    Object.keys(categories).forEach(cat => {
      result[cat] = { daily: 0, weekly: 0 };
    });

    Object.entries(schedule).forEach(([day, items]) => {
      items.forEach(item => {
        if (result[item.category]) {
          result[item.category].weekly += item.duration;
          if (day === selectedDay) {
            result[item.category].daily += item.duration;
          }
        }
      });
    });

    return result;
  }, [schedule, selectedDay]);

  // Recalculate times
  const recalculateTimes = useCallback((daySchedule) => {
    if (!daySchedule.length) return daySchedule;
    let currentMins = parseTimeToMinutes(daySchedule[0].time);
    return daySchedule.map((item, i) => ({
      ...item,
      time: i === 0 ? item.time : formatMinutesToTime(currentMins),
    })).map((item, i, arr) => {
      if (i > 0) {
        currentMins = parseTimeToMinutes(arr[i - 1].time) + arr[i - 1].duration;
        return { ...item, time: formatMinutesToTime(currentMins) };
      }
      return item;
    });
  }, []);

  // Save schedule
  const saveSchedule = async () => {
    setIsSyncing(true);
    setSyncStatus('syncing');
    const success = await scheduleApi.save('justin', schedule);
    if (success) {
      localStorage.setItem('justinSchedule', JSON.stringify(schedule));
      setHasChanges(false);
      setSyncStatus('synced');
    } else {
      setSyncStatus('error');
    }
    setIsSyncing(false);
  };

  // Reset schedule
  const resetSchedule = () => {
    if (confirm('Reset to default schedule?')) {
      setSchedule(initialSchedule);
      setHasChanges(true);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    dragNode.current = e.target;
    setDraggedItem({ index, item: filteredSchedule[index] });
    setTimeout(() => e.target.style.opacity = '0.5', 0);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem?.index !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.index === dropIndex) return;

    const newDaySchedule = [...schedule[selectedDay]];
    const [removed] = newDaySchedule.splice(draggedItem.index, 1);
    newDaySchedule.splice(dropIndex, 0, removed);

    const recalculated = recalculateTimes(newDaySchedule);
    setSchedule({ ...schedule, [selectedDay]: recalculated });
    setHasChanges(true);
    setDraggedItem(null);
    setDragOverIndex(null);
    if (dragNode.current) dragNode.current.style.opacity = '1';
  };

  // Edit handlers
  const startEdit = (item) => {
    setEditingItem(item.id);
    setEditValues({ 
      activity: item.activity, 
      duration: item.duration,
      time: item.time 
    });
  };

  const saveEdit = (itemId) => {
    const newDaySchedule = schedule[selectedDay].map(item =>
      item.id === itemId ? { ...item, ...editValues } : item
    );
    const recalculated = recalculateTimes(newDaySchedule);
    setSchedule({ ...schedule, [selectedDay]: recalculated });
    setHasChanges(true);
    setEditingItem(null);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditValues({ activity: '', duration: 0, time: '' });
  };

  const deleteItem = (itemId) => {
    if (confirm('Delete this activity?')) {
      const newDaySchedule = schedule[selectedDay].filter(item => item.id !== itemId);
      const recalculated = recalculateTimes(newDaySchedule);
      setSchedule({ ...schedule, [selectedDay]: recalculated });
      setHasChanges(true);
      setEditingItem(null);
    }
  };

  const addNewItem = () => {
    if (!newItem.activity.trim()) return;
    
    const daySchedule = schedule[selectedDay];
    const lastItem = daySchedule[daySchedule.length - 1];
    const newTime = lastItem 
      ? formatMinutesToTime(parseTimeToMinutes(lastItem.time) + lastItem.duration)
      : '9:00 AM';

    const newActivity = {
      id: generateId(),
      time: newTime,
      activity: newItem.activity,
      duration: newItem.duration,
      category: newItem.category
    };

    setSchedule({
      ...schedule,
      [selectedDay]: [...daySchedule, newActivity]
    });
    setHasChanges(true);
    setShowAddForm(false);
    setNewItem({ activity: '', duration: 30, category: 'Personal' });
  };

  // Day navigation
  const prevDay = () => {
    const idx = days.indexOf(selectedDay);
    setSelectedDay(days[idx === 0 ? 6 : idx - 1]);
  };

  const nextDay = () => {
    const idx = days.indexOf(selectedDay);
    setSelectedDay(days[(idx + 1) % 7]);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20 animate-pulse`}
          style={{ background: `radial-gradient(circle, ${theme.primary}, transparent)` }}
        />
        <div 
          className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20 animate-pulse`}
          style={{ background: `radial-gradient(circle, ${theme.secondary}, transparent)`, animationDelay: '1s' }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* ===================================== */}
        {/* HEADER */}
        {/* ===================================== */}
        <GlassCard darkMode={darkMode} className="mb-6" glow glowColor={theme.primary}>
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className={`text-2xl font-bold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                  Justin's Schedule
                </h1>
                <p className={`text-sm ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Sync Status */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                  syncStatus === 'synced' 
                    ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                    : syncStatus === 'syncing'
                      ? darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                      : syncStatus === 'error'
                        ? darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                        : darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600'
                }`}>
                  {syncStatus === 'syncing' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : syncStatus === 'synced' ? (
                    <Cloud className="w-3.5 h-3.5" />
                  ) : syncStatus === 'error' ? (
                    <CloudOff className="w-3.5 h-3.5" />
                  ) : (
                    <Cloud className="w-3.5 h-3.5" />
                  )}
                  {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'synced' ? 'Synced' : syncStatus === 'error' ? 'Offline' : 'Local'}
                </div>

                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2.5 rounded-xl transition-all hover:scale-110 ${
                    darkMode 
                      ? 'bg-white/10 hover:bg-white/20 text-yellow-400' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Current Time */}
            <div className="flex items-center justify-center mb-4">
              <div 
                className={`text-5xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {/* Current Activity Banner */}
            {currentActivity && (
              <div 
                className={`p-4 rounded-xl border-2 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
                style={{ borderColor: categories[currentActivity.category]?.accent }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <ProgressRing 
                      progress={currentActivity.progress} 
                      size={60} 
                      strokeWidth={5}
                      color={categories[currentActivity.category]?.accent}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium uppercase tracking-wide mb-1`} style={{ color: categories[currentActivity.category]?.accent }}>
                      Now
                    </p>
                    <p className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {currentActivity.activity}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                      {currentActivity.remaining} min remaining
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        {/* ===================================== */}
        {/* DAY SELECTOR */}
        {/* ===================================== */}
        <GlassCard darkMode={darkMode} className="mb-6">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={prevDay}
                className={`p-2 rounded-lg transition-all hover:scale-110 ${
                  darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className={`w-5 h-5 ${darkMode ? 'text-white/70' : 'text-gray-600'}`} />
              </button>

              <div className="flex gap-1.5 overflow-x-auto py-1 px-2 no-scrollbar">
                {days.map((day) => {
                  const isToday = day === days[currentTime.getDay() === 0 ? 6 : currentTime.getDay() - 1];
                  const isSelected = day === selectedDay;
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        isSelected
                          ? 'text-white shadow-lg'
                          : darkMode
                            ? 'text-white/60 hover:text-white hover:bg-white/10'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      style={isSelected ? {
                        background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`,
                        boxShadow: `0 4px 15px ${theme.primary}40`
                      } : {}}
                    >
                      {day.slice(0, 3)}
                      {isToday && <span className="ml-1">•</span>}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={nextDay}
                className={`p-2 rounded-lg transition-all hover:scale-110 ${
                  darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                }`}
              >
                <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-white/70' : 'text-gray-600'}`} />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* ===================================== */}
        {/* ACTION BAR */}
        {/* ===================================== */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white flex items-center gap-2 transition-all hover:scale-[1.02] shadow-lg"
              style={{ 
                background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`,
                boxShadow: `0 4px 15px ${theme.primary}40`
              }}
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
            
            {hasChanges && (
              <>
                <button
                  onClick={saveSchedule}
                  disabled={isSyncing}
                  className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                    darkMode 
                      ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400' 
                      : 'bg-green-100 hover:bg-green-200 text-green-700'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={resetSchedule}
                  className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                    darkMode 
                      ? 'bg-white/5 hover:bg-white/10 text-white/70' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </>
            )}
          </div>
        </div>

        {/* ===================================== */}
        {/* SETTINGS VIEW */}
        {/* ===================================== */}
        {view === 'settings' && (
          <GlassCard darkMode={darkMode} className="mb-4">
            <div className="p-5">
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Palette className="w-5 h-5" style={{ color: theme.primary }} />
                Theme Settings
              </h3>
              
              <div className="flex flex-wrap gap-3">
                {Object.entries(themes).map(([key, t]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTheme(key)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                      selectedTheme === key
                        ? 'ring-2 ring-offset-2'
                        : ''
                    } ${
                      darkMode 
                        ? 'bg-white/5 hover:bg-white/10 ring-offset-slate-900' 
                        : 'bg-gray-100 hover:bg-gray-200 ring-offset-white'
                    }`}
                    style={selectedTheme === key ? { ringColor: t.primary } : {}}
                  >
                    <div 
                      className="w-8 h-8 rounded-full"
                      style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})` }}
                    />
                    <span className={`text-xs ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
          
          {/* Calendar Sync Section */}
          <GlassCard darkMode={darkMode} className="mb-4">
            <div className="p-5">
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <CalendarCheck className="w-5 h-5" style={{ color: theme.primary }} />
                Calendar Sync
              </h3>
              
              <p className={`text-sm mb-4 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                Export your schedule to Google Calendar or download as an ICS file to import into any calendar app.
              </p>
              
              {/* Export Options */}
              <div className="space-y-3">
                {/* Download ICS - Full Week */}
                <button
                  onClick={() => downloadICSFile(schedule)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    darkMode 
                      ? 'bg-white/5 hover:bg-white/10' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Download className={`w-5 h-5 ${darkMode ? 'text-white/70' : 'text-gray-600'}`} />
                    <div className="text-left">
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Download Full Week
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                        Export all 7 days as ICS file
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-white/40' : 'text-gray-400'}`} />
                </button>
                
                {/* Download ICS - Selected Day */}
                <button
                  onClick={() => downloadICSFile(schedule, selectedDay)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    darkMode 
                      ? 'bg-white/5 hover:bg-white/10' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className={`w-5 h-5 ${darkMode ? 'text-white/70' : 'text-gray-600'}`} />
                    <div className="text-left">
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Download {selectedDay}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                        Export selected day only
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-white/40' : 'text-gray-400'}`} />
                </button>
              </div>
              
              {/* Google Calendar Quick Links */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className={`text-xs font-medium mb-3 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                  QUICK ADD TO GOOGLE CALENDAR
                </p>
                <div className="flex flex-wrap gap-2">
                  {(schedule[selectedDay] || []).slice(0, 5).map((item) => (
                    <a
                      key={item.id}
                      href={generateGoogleCalendarLink(item, selectedDay)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                        darkMode 
                          ? 'bg-white/5 hover:bg-white/10 text-white/70' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                      }`}
                      style={{ borderLeft: `3px solid ${categories[item.category]?.accent || '#64748b'}` }}
                    >
                      <ExternalLink className="w-3 h-3" />
                      {item.activity.slice(0, 20)}{item.activity.length > 20 ? '...' : ''}
                    </a>
                  ))}
                  {(schedule[selectedDay] || []).length > 5 && (
                    <span className={`text-xs ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                      +{(schedule[selectedDay] || []).length - 5} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* ===================================== */}
        {/* DASHBOARD VIEW */}
        {/* ===================================== */}
        {view === 'dashboard' && (
          <GlassCard darkMode={darkMode} className="mb-4">
            <div className="p-5">
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <TrendingUp className="w-5 h-5" style={{ color: theme.primary }} />
                Weekly Analytics
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Time Distribution */}
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                    Time Distribution
                  </p>
                  <div className="flex items-center justify-center">
                    <CategoryMiniChart stats={stats} darkMode={darkMode} />
                  </div>
                </div>
                
                {/* Top Categories */}
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                    Top Activities
                  </p>
                  <div className="space-y-2">
                    {Object.entries(stats)
                      .filter(([_, data]) => data.weekly > 0)
                      .sort((a, b) => b[1].weekly - a[1].weekly)
                      .slice(0, 4)
                      .map(([category, data], i) => (
                        <div key={category} className="flex items-center gap-2">
                          <span className={`text-lg font-bold w-6 ${darkMode ? 'text-white/30' : 'text-gray-300'}`}>
                            {i + 1}
                          </span>
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: categories[category]?.accent }}
                          />
                          <span className={`flex-1 text-sm truncate ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                            {category}
                          </span>
                          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {formatDuration(data.weekly)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              
              {/* All Categories Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(stats)
                  .filter(([_, data]) => data.weekly > 0)
                  .sort((a, b) => b[1].weekly - a[1].weekly)
                  .map(([category, data]) => {
                    const catInfo = categories[category];
                    const Icon = catInfo?.icon || Star;
                    return (
                      <div
                        key={category}
                        className={`p-3 rounded-xl transition-all hover:scale-[1.02] ${
                          darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${catInfo?.accent}20` }}
                          >
                            <Icon className="w-4 h-4" style={{ color: catInfo?.accent }} />
                          </div>
                          <span className={`text-sm font-medium truncate ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                            {category}
                          </span>
                        </div>
                        <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {formatDuration(data.weekly)}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                          per week
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          </GlassCard>
        )}

        {/* ===================================== */}
        {/* ADD ACTIVITY FORM */}
        {/* ===================================== */}
        {showAddForm && (
          <GlassCard darkMode={darkMode} className="mb-4" glow glowColor={theme.primary}>
            <div className="p-5">
              <h3 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${theme.primary}20` }}
                >
                  <Plus className="w-4 h-4" style={{ color: theme.primary }} />
                </div>
                Add New Activity
              </h3>
              
              <div className="space-y-4">
                {/* Activity Name */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                    Activity Name
                  </label>
                  <input
                    type="text"
                    value={newItem.activity}
                    onChange={(e) => setNewItem({ ...newItem, activity: e.target.value })}
                    placeholder="e.g., 🎯 New Task"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${
                      darkMode 
                        ? 'bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-white/30' 
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-300'
                    }`}
                  />
                </div>
                
                {/* Duration */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                    Duration
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {durationPresets.map((d) => (
                      <button
                        key={d}
                        onClick={() => setNewItem({ ...newItem, duration: d })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          newItem.duration === d 
                            ? 'text-white shadow-lg' 
                            : darkMode 
                              ? 'bg-white/5 hover:bg-white/10 text-white/70' 
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                        }`}
                        style={newItem.duration === d ? { 
                          background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`
                        } : {}}
                      >
                        {d}m
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={newItem.duration}
                      onChange={(e) => setNewItem({ ...newItem, duration: parseInt(e.target.value) || 0 })}
                      className={`w-24 px-3 py-2 rounded-lg border-2 transition-all outline-none text-sm ${
                        darkMode 
                          ? 'bg-white/5 border-white/10 text-white focus:border-white/30' 
                          : 'bg-white border-gray-200 text-gray-900 focus:border-gray-300'
                      }`}
                      min="1"
                      max="480"
                    />
                    <span className={`text-sm ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>minutes</span>
                  </div>
                </div>
                
                {/* Category */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categoryList.map((cat) => {
                      const catInfo = categories[cat];
                      return (
                        <button
                          key={cat}
                          onClick={() => setNewItem({ ...newItem, category: cat })}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                            newItem.category === cat 
                              ? 'text-white shadow-lg' 
                              : darkMode 
                                ? 'bg-white/5 hover:bg-white/10 text-white/70' 
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                          }`}
                          style={newItem.category === cat ? { 
                            background: `linear-gradient(to right, ${catInfo.accent}, ${catInfo.accent}dd)`
                          } : {}}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      darkMode 
                        ? 'bg-white/5 hover:bg-white/10 text-white/70' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addNewItem}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-white shadow-lg flex items-center gap-2 transition-all hover:scale-[1.02]"
                    style={{ 
                      background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`,
                      boxShadow: `0 4px 15px ${theme.primary}40`
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add to End
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* ===================================== */}
        {/* SCHEDULE LIST */}
        {/* ===================================== */}
        {view === 'schedule' && (
          <GlassCard darkMode={darkMode} className="mb-4">
            <div className="p-4">
              <div className="space-y-2">
                {filteredSchedule.map((item, index) => {
                  const catInfo = categories[item.category] || categories['Personal'];
                  const Icon = catInfo.icon;
                  const isTransition = item.category === 'Transition';
                  const isDragging = draggedItem?.index === index;
                  const isDragOver = dragOverIndex === index;
                  const isEditing = editingItem === item.id;
                  const isCurrent = isCurrentActivity(item);
                  
                  return (
                    <div
                      key={item.id}
                      draggable={!isTransition && !isEditing}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`group relative flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                        isDragOver 
                          ? 'ring-2 ring-dashed'
                          : isEditing
                            ? 'ring-2'
                            : isCurrent
                              ? 'ring-2 shadow-lg'
                              : item.special 
                                ? darkMode 
                                  ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 hover:from-yellow-500/20 hover:to-amber-500/20' 
                                  : 'bg-gradient-to-r from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100'
                                : darkMode 
                                  ? 'bg-white/5 hover:bg-white/10' 
                                  : 'bg-gray-50 hover:bg-gray-100'
                      } ${!isTransition && !isEditing ? 'cursor-grab active:cursor-grabbing' : ''} ${isDragging ? 'opacity-50 scale-95' : ''}`}
                      style={{
                        ...(isDragOver ? { borderColor: theme.primary } : {}),
                        ...(isEditing ? { borderColor: theme.primary } : {}),
                        ...(isCurrent ? { 
                          borderColor: catInfo.accent,
                          boxShadow: `0 0 20px ${catInfo.accent}30`
                        } : {}),
                      }}
                    >
                      {/* Drag Handle */}
                      {!isTransition && !isEditing && (
                        <div className={`opacity-0 group-hover:opacity-100 transition-opacity ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>
                          <GripVertical className="w-5 h-5" />
                        </div>
                      )}
                      {(isTransition || isEditing) && <div className="w-5" />}
                      
                      {/* Category Icon */}
                      <div 
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                          isCurrent ? 'animate-pulse' : ''
                        }`}
                        style={{ 
                          background: `linear-gradient(135deg, ${catInfo.accent}40, ${catInfo.accent}20)`,
                        }}
                      >
                        <Icon className="w-6 h-6" style={{ color: catInfo.accent }} />
                      </div>
                      
                      {isEditing ? (
                        /* ===================================== */
                        /* EDIT MODE */
                        /* ===================================== */
                        <div className="flex-1 flex flex-col gap-3">
                          <input
                            type="text"
                            value={editValues.activity}
                            onChange={(e) => setEditValues({ ...editValues, activity: e.target.value })}
                            className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all outline-none text-sm font-medium ${
                              darkMode 
                                ? 'bg-white/5 border-white/10 text-white focus:border-white/30' 
                                : 'bg-white border-gray-200 text-gray-900 focus:border-gray-300'
                            }`}
                            placeholder="Activity name"
                            autoFocus
                          />
                          
                          <div className="flex gap-3 items-center flex-wrap">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" style={{ color: theme.primary }} />
                              <input
                                type="text"
                                value={editValues.time}
                                onChange={(e) => setEditValues({ ...editValues, time: e.target.value })}
                                className={`w-28 px-3 py-2 rounded-lg border-2 transition-all outline-none text-xs ${
                                  darkMode 
                                    ? 'bg-white/5 border-white/10 text-white focus:border-white/30' 
                                    : 'bg-white border-gray-200 text-gray-900 focus:border-gray-300'
                                }`}
                                placeholder="e.g. 9:00 AM"
                              />
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {durationPresets.slice(0, 4).map(d => (
                                <button
                                  key={d}
                                  onClick={() => setEditValues({ ...editValues, duration: d })}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    editValues.duration === d 
                                      ? 'text-white' 
                                      : darkMode 
                                        ? 'bg-white/5 hover:bg-white/10 text-white/70' 
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                  }`}
                                  style={editValues.duration === d ? { 
                                    background: theme.primary
                                  } : {}}
                                >
                                  {d}m
                                </button>
                              ))}
                              <input
                                type="number"
                                value={editValues.duration}
                                onChange={(e) => setEditValues({ ...editValues, duration: parseInt(e.target.value) || 0 })}
                                className={`w-20 px-3 py-1.5 rounded-lg border-2 transition-all outline-none text-xs ${
                                  darkMode 
                                    ? 'bg-white/5 border-white/10 text-white focus:border-white/30' 
                                    : 'bg-white border-gray-200 text-gray-900 focus:border-gray-300'
                                }`}
                                min="1"
                                max="480"
                              />
                            </div>
                          </div>
                          
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => deleteItem(item.id)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                                darkMode 
                                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' 
                                  : 'bg-red-100 hover:bg-red-200 text-red-700'
                              }`}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                            <button
                              onClick={cancelEdit}
                              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                                darkMode 
                                  ? 'bg-white/5 hover:bg-white/10 text-white/70' 
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                              }`}
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                            <button
                              onClick={() => saveEdit(item.id)}
                              className="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-1.5 transition-all hover:scale-[1.02]"
                              style={{ 
                                background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`
                              }}
                            >
                              <Check className="w-4 h-4" />
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* ===================================== */
                        /* VIEW MODE */
                        /* ===================================== */
                        <div 
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => !isTransition && startEdit(item)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {item.activity}
                            </span>
                            {item.special && (
                              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                            )}
                            {isCurrent && (
                              <span 
                                className="px-2 py-0.5 rounded-full text-xs font-bold text-white animate-pulse"
                                style={{ backgroundColor: catInfo.accent }}
                              >
                                NOW
                              </span>
                            )}
                          </div>
                          <div className={`flex items-center gap-3 text-sm ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {item.time}
                            </span>
                            <span>•</span>
                            <span>{formatDuration(item.duration)}</span>
                          </div>
                        </div>
                      )}

                      {/* Current Activity Progress Bar */}
                      {isCurrent && !isEditing && currentActivity && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl overflow-hidden">
                          <div 
                            className="h-full transition-all duration-1000"
                            style={{ 
                              width: `${currentActivity.progress}%`,
                              backgroundColor: catInfo.accent
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        )}

        {/* ===================================== */}
        {/* WEEKLY HIGHLIGHTS */}
        {/* ===================================== */}
        <GlassCard darkMode={darkMode} className="mb-4">
          <div className="p-5">
            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <Award className="w-5 h-5 text-amber-400" />
              Weekly Highlights
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { emoji: '🍕', text: 'Friday Pizza Night', day: 'Friday' },
                { emoji: '🎬', text: 'Friday Movie Night', day: 'Friday' },
                { emoji: '💑', text: 'Saturday Date Night', day: 'Saturday' },
                { emoji: '🎤', text: 'Mia Voice Lessons', day: 'Thursday' },
                { emoji: '💻', text: 'Weekend Vibe Coding', day: 'Sat/Sun' },
                { emoji: '🎯', text: 'Wed BONUS Block', day: 'Wednesday' },
              ].map((item, i) => (
                <div 
                  key={i}
                  className={`p-3 rounded-xl transition-all hover:scale-[1.02] cursor-pointer ${
                    darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedDay(item.day === 'Sat/Sun' ? 'Saturday' : item.day)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                        {item.text}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                        {item.day}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ===================================== */}
      {/* BOTTOM NAVIGATION (Mobile) */}
      {/* ===================================== */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 ${
        darkMode ? 'bg-slate-900/80' : 'bg-white/80'
      } backdrop-blur-xl border-t ${darkMode ? 'border-white/10' : 'border-gray-200'} safe-area-bottom`}>
        <div className="max-w-4xl mx-auto px-4 py-2">
          <div className="flex items-center justify-around">
            {[
              { icon: Calendar, label: 'Schedule', view: 'schedule' },
              { icon: BarChart3, label: 'Dashboard', view: 'dashboard' },
              { icon: Settings, label: 'Settings', view: 'settings' },
            ].map(({ icon: Icon, label, view: v }) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  view === v 
                    ? 'text-white' 
                    : darkMode 
                      ? 'text-white/50 hover:text-white/70' 
                      : 'text-gray-500 hover:text-gray-700'
                }`}
                style={view === v ? { color: theme.primary } : {}}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
