import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Calendar, Clock, Moon, Sun, ChevronLeft, ChevronRight,
  GripVertical, Save, RotateCcw, Check, X, Plus, Trash2,
  Briefcase, Coffee, Home, Heart, Utensils, Car, Dumbbell,
  Music, Star, Sparkles, Settings, BarChart3, TrendingUp,
  Award, Zap, Cloud, CloudOff, Loader2, Palette, CalendarCheck,
  Download, ExternalLink, RefreshCw, Copy, Timer, Layers,
  ChevronUp, ChevronDown, Minus, Bell, BellOff, Target, Search,
  Filter, AlertCircle, Undo2, Redo2, CopyPlus, Upload, FileJson,
  History, Archive, Play, Pause, Square, SkipForward, MessageSquare,
  Keyboard, Volume2, VolumeX, Repeat, LayoutGrid, LineChart,
  Flame, CalendarDays, Eye, EyeOff, Printer, FileText, AlertTriangle,
  Wand2, Clock3, LayoutList
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
  const [editValues, setEditValues] = useState({ activity: '', duration: 0, time: '', notes: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ activity: '', duration: 30, category: 'Personal', notes: '' });
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragNode = useRef(null);
  
  // New state for enhanced features
  const [swipedItemId, setSwipedItemId] = useState(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);
  const swipeStartX = useRef(null);
  const swipeThreshold = 80;

  // Notification state
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved ? JSON.parse(saved) : false;
  });
  const [notificationTiming, setNotificationTiming] = useState(() => {
    const saved = localStorage.getItem('notificationTiming');
    return saved ? parseInt(saved) : 5; // minutes before activity
  });
  const [notifiedActivities, setNotifiedActivities] = useState(new Set());
  const lastNotificationCheck = useRef(null);

  // Weekly Goals state
  const [weeklyGoals, setWeeklyGoals] = useState(() => {
    const saved = localStorage.getItem('weeklyGoals');
    return saved ? JSON.parse(saved) : {};
  });
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [editingGoal, setEditingGoal] = useState({ category: '', hours: 0 });

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Undo/Redo state
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const maxUndoSteps = 20;

  // Clone Week state
  const [showCloneWeekModal, setShowCloneWeekModal] = useState(false);

  // Backup/Restore state
  const [showBackupModal, setShowBackupModal] = useState(false);
  const fileInputRef = useRef(null);

  // Focus Mode / Pomodoro state
  const [focusMode, setFocusMode] = useState(false);
  const [focusActivity, setFocusActivity] = useState(null);
  const [focusTimeRemaining, setFocusTimeRemaining] = useState(0);
  const [focusType, setFocusType] = useState('work'); // 'work' or 'break'
  const [focusPaused, setFocusPaused] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [focusSoundEnabled, setFocusSoundEnabled] = useState(true);
  const focusIntervalRef = useRef(null);

  // Pomodoro settings (in minutes)
  const pomodoroSettings = {
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4
  };

  // Keyboard shortcuts enabled
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // Timeline view state
  const [showTimelineView, setShowTimelineView] = useState(false);
  const timelineStartHour = 5; // 5 AM
  const timelineEndHour = 23; // 11 PM

  // Recurring activities state
  const [showRecurringModal, setShowRecurringModal] = useState(null);
  const [recurringPatterns, setRecurringPatterns] = useState(() => {
    const saved = localStorage.getItem('recurringPatterns');
    return saved ? JSON.parse(saved) : {};
  });

  // Activity Statistics state
  const [activityHistory, setActivityHistory] = useState(() => {
    const saved = localStorage.getItem('activityHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [showInsightsModal, setShowInsightsModal] = useState(false);

  // Print view state
  const [showPrintView, setShowPrintView] = useState(false);

  // Conflict detection state
  const [showConflicts, setShowConflicts] = useState(true);

  // Auto-scheduler state
  const [showAutoScheduler, setShowAutoScheduler] = useState(false);
  const [autoSchedulerRequest, setAutoSchedulerRequest] = useState({
    activityName: '',
    duration: 30,
    category: 'Personal',
    preferredDays: [],
    preferredTimeRange: 'any' // 'morning', 'afternoon', 'evening', 'any'
  });

  // Activity Templates for Quick Add
  const activityTemplates = [
    { emoji: '☕', name: 'Coffee Break', duration: 15, category: 'Personal' },
    { emoji: '📞', name: 'Phone Call', duration: 30, category: 'Work' },
    { emoji: '🏃', name: 'Quick Workout', duration: 30, category: 'Exercise' },
    { emoji: '🥪', name: 'Snack Break', duration: 15, category: 'Meals' },
    { emoji: '🧘', name: 'Meditation', duration: 15, category: 'Personal' },
    { emoji: '📧', name: 'Email Check', duration: 30, category: 'Work' },
    { emoji: '👨‍💻', name: 'Dev Sprint', duration: 60, category: 'Development' },
    { emoji: '📊', name: 'Meeting', duration: 60, category: 'Work' },
    { emoji: '🎸', name: 'Guitar Practice', duration: 30, category: 'Music' },
    { emoji: '🏠', name: 'Family Time', duration: 60, category: 'Family' },
    { emoji: '🍽️', name: 'Meal Prep', duration: 45, category: 'Meals' },
    { emoji: '📚', name: 'Reading', duration: 30, category: 'Personal' },
  ];

  const theme = themes[selectedTheme];

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Save notification settings to localStorage
  useEffect(() => {
    localStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
    localStorage.setItem('notificationTiming', notificationTiming.toString());
  }, [notificationsEnabled, notificationTiming]);

  // Save weekly goals to localStorage
  useEffect(() => {
    localStorage.setItem('weeklyGoals', JSON.stringify(weeklyGoals));
  }, [weeklyGoals]);

  // Undo/Redo functions
  const pushToUndoStack = useCallback((previousSchedule) => {
    setUndoStack(prev => {
      const newStack = [...prev, JSON.stringify(previousSchedule)];
      // Keep only the last maxUndoSteps
      if (newStack.length > maxUndoSteps) {
        return newStack.slice(-maxUndoSteps);
      }
      return newStack;
    });
    // Clear redo stack when a new action is performed
    setRedoStack([]);
  }, [maxUndoSteps]);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;

    const newUndoStack = [...undoStack];
    const previousState = newUndoStack.pop();

    // Push current state to redo stack
    setRedoStack(prev => [...prev, JSON.stringify(schedule)]);

    // Restore previous state
    setSchedule(JSON.parse(previousState));
    setUndoStack(newUndoStack);
    setHasChanges(true);
  }, [undoStack, schedule]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;

    const newRedoStack = [...redoStack];
    const nextState = newRedoStack.pop();

    // Push current state to undo stack
    setUndoStack(prev => [...prev, JSON.stringify(schedule)]);

    // Restore next state
    setSchedule(JSON.parse(nextState));
    setRedoStack(newRedoStack);
    setHasChanges(true);
  }, [redoStack, schedule]);

  // Helper to update schedule with undo support
  const updateScheduleWithUndo = useCallback((newSchedule) => {
    pushToUndoStack(schedule);
    setSchedule(newSchedule);
    setHasChanges(true);
  }, [schedule, pushToUndoStack]);

  // Clone Week functions
  const cloneCurrentWeek = useCallback(() => {
    // This creates a deep copy with new IDs
    const clonedSchedule = {};
    Object.entries(schedule).forEach(([day, activities]) => {
      clonedSchedule[day] = activities.map(activity => ({
        ...activity,
        id: generateId()
      }));
    });
    return clonedSchedule;
  }, [schedule]);

  const cloneDayToAll = useCallback((sourceDay) => {
    pushToUndoStack(schedule);
    const sourceActivities = schedule[sourceDay] || [];
    const newSchedule = { ...schedule };

    days.forEach(day => {
      if (day !== sourceDay) {
        newSchedule[day] = sourceActivities.map(activity => ({
          ...activity,
          id: generateId()
        }));
      }
    });

    setSchedule(newSchedule);
    setHasChanges(true);
    setShowCloneWeekModal(false);
  }, [schedule, pushToUndoStack]);

  const clearAllDays = useCallback(() => {
    if (!confirm('Are you sure you want to clear ALL activities from ALL days? This can be undone.')) return;
    pushToUndoStack(schedule);
    const emptySchedule = {};
    days.forEach(day => {
      emptySchedule[day] = [];
    });
    setSchedule(emptySchedule);
    setHasChanges(true);
    setShowCloneWeekModal(false);
  }, [schedule, pushToUndoStack]);

  // Backup/Restore functions
  const exportBackup = useCallback(() => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      schedule: schedule,
      weeklyGoals: weeklyGoals,
      settings: {
        theme: selectedTheme,
        darkMode: darkMode,
        notificationsEnabled: notificationsEnabled,
        notificationTiming: notificationTiming
      }
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `schedule-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [schedule, weeklyGoals, selectedTheme, darkMode, notificationsEnabled, notificationTiming]);

  const importBackup = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);

        if (!backup.schedule) {
          alert('Invalid backup file: missing schedule data');
          return;
        }

        if (!confirm('This will replace your current schedule. Continue?')) return;

        pushToUndoStack(schedule);

        // Restore schedule
        setSchedule(backup.schedule);

        // Restore goals if present
        if (backup.weeklyGoals) {
          setWeeklyGoals(backup.weeklyGoals);
        }

        // Restore settings if present
        if (backup.settings) {
          if (backup.settings.theme) setSelectedTheme(backup.settings.theme);
          if (typeof backup.settings.darkMode === 'boolean') setDarkMode(backup.settings.darkMode);
          if (typeof backup.settings.notificationsEnabled === 'boolean') {
            setNotificationsEnabled(backup.settings.notificationsEnabled);
          }
          if (backup.settings.notificationTiming) {
            setNotificationTiming(backup.settings.notificationTiming);
          }
        }

        setHasChanges(true);
        setShowBackupModal(false);
        alert('Backup restored successfully!');
      } catch (err) {
        alert('Failed to parse backup file. Please check the file format.');
        console.error('Import error:', err);
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [schedule, pushToUndoStack]);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      setNotificationsEnabled(true);
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        return true;
      }
    }

    alert('Please enable notifications in your browser settings');
    return false;
  };

  // Send notification
  const sendNotification = (title, body, icon = '📅') => {
    if (!notificationsEnabled || Notification.permission !== 'granted') return;

    const notification = new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'schedule-notification',
      requireInteraction: false,
      silent: false
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    setTimeout(() => notification.close(), 10000);
  };

  // Check for upcoming activities and send notifications
  useEffect(() => {
    if (!notificationsEnabled) return;

    const checkUpcomingActivities = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const dayName = days[now.getDay() === 0 ? 6 : now.getDay() - 1];
      const todaySchedule = schedule[dayName] || [];

      // Reset notified activities at midnight
      if (lastNotificationCheck.current) {
        const lastDate = new Date(lastNotificationCheck.current);
        if (lastDate.getDate() !== now.getDate()) {
          setNotifiedActivities(new Set());
        }
      }
      lastNotificationCheck.current = now.getTime();

      todaySchedule.forEach(item => {
        const itemStart = parseTimeToMinutes(item.time);
        const minutesUntilStart = itemStart - currentMinutes;
        const notificationKey = `${item.id}-${now.toDateString()}`;

        // Check if we should notify (within timing window and not already notified)
        if (minutesUntilStart > 0 &&
            minutesUntilStart <= notificationTiming &&
            !notifiedActivities.has(notificationKey)) {

          sendNotification(
            `⏰ Starting in ${minutesUntilStart} min`,
            item.activity,
            item.special ? '⭐' : '📅'
          );

          setNotifiedActivities(prev => new Set([...prev, notificationKey]));
        }

        // Notify when activity starts
        if (minutesUntilStart === 0 && !notifiedActivities.has(`${notificationKey}-start`)) {
          sendNotification(
            '🎯 Activity Starting Now!',
            item.activity,
            item.special ? '⭐' : '🚀'
          );

          setNotifiedActivities(prev => new Set([...prev, `${notificationKey}-start`]));
        }
      });
    };

    // Check every 30 seconds
    const interval = setInterval(checkUpcomingActivities, 30000);
    checkUpcomingActivities(); // Initial check

    return () => clearInterval(interval);
  }, [notificationsEnabled, notificationTiming, schedule, notifiedActivities]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
          e.target.blur();
          setEditingItem(null);
          setShowAddForm(false);
        }
        return;
      }

      // Check for modifier keys
      const isMod = e.metaKey || e.ctrlKey;

      // Undo: Ctrl/Cmd + Z
      if (isMod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
      if ((isMod && e.key === 'z' && e.shiftKey) || (isMod && e.key === 'y')) {
        e.preventDefault();
        redo();
        return;
      }

      // Save: Ctrl/Cmd + S
      if (isMod && e.key === 's') {
        e.preventDefault();
        if (hasChanges) saveSchedule();
        return;
      }

      // New activity: N
      if (e.key === 'n' && !isMod) {
        e.preventDefault();
        setShowAddForm(true);
        return;
      }

      // Quick add: Q
      if (e.key === 'q' && !isMod) {
        e.preventDefault();
        setShowQuickAdd(!showQuickAdd);
        return;
      }

      // Previous day: Left arrow or H
      if ((e.key === 'ArrowLeft' || e.key === 'h') && !isMod) {
        e.preventDefault();
        prevDay();
        return;
      }

      // Next day: Right arrow or L
      if ((e.key === 'ArrowRight' || e.key === 'l') && !isMod) {
        e.preventDefault();
        nextDay();
        return;
      }

      // Go to today: T
      if (e.key === 't' && !isMod) {
        e.preventDefault();
        const today = new Date();
        setSelectedDay(days[today.getDay() === 0 ? 6 : today.getDay() - 1]);
        return;
      }

      // Toggle view: 1, 2, 3
      if (e.key === '1' && !isMod) {
        setView('schedule');
        return;
      }
      if (e.key === '2' && !isMod) {
        setView('dashboard');
        return;
      }
      if (e.key === '3' && !isMod) {
        setView('settings');
        return;
      }

      // Escape: Close modals
      if (e.key === 'Escape') {
        setShowAddForm(false);
        setShowQuickAdd(false);
        setShowCopyModal(null);
        setShowCloneWeekModal(false);
        setShowBackupModal(false);
        setShowKeyboardHelp(false);
        setEditingItem(null);
        setEditingGoal({ category: '', hours: 0 });
        return;
      }

      // Show keyboard help: ?
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShowKeyboardHelp(!showKeyboardHelp);
        return;
      }

      // Focus mode: F
      if (e.key === 'f' && !isMod && currentActivity) {
        e.preventDefault();
        if (focusMode) {
          stopFocusMode();
        } else {
          startFocusMode(currentActivity);
        }
        return;
      }

      // Pause/resume focus: Space (when in focus mode)
      if (e.key === ' ' && focusMode) {
        e.preventDefault();
        setFocusPaused(!focusPaused);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, hasChanges, saveSchedule, showQuickAdd, prevDay, nextDay, focusMode, focusPaused, currentActivity, showKeyboardHelp]);

  // Focus Mode Timer
  useEffect(() => {
    if (focusMode && !focusPaused && focusTimeRemaining > 0) {
      focusIntervalRef.current = setInterval(() => {
        setFocusTimeRemaining(prev => {
          if (prev <= 1) {
            // Timer finished
            handleFocusComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(focusIntervalRef.current);
    } else if (focusIntervalRef.current) {
      clearInterval(focusIntervalRef.current);
    }
  }, [focusMode, focusPaused, focusTimeRemaining]);

  // Focus mode functions
  const startFocusMode = useCallback((activity = null) => {
    setFocusActivity(activity);
    setFocusType('work');
    setFocusTimeRemaining(pomodoroSettings.workDuration * 60);
    setFocusMode(true);
    setFocusPaused(false);
  }, [pomodoroSettings.workDuration]);

  const stopFocusMode = useCallback(() => {
    setFocusMode(false);
    setFocusActivity(null);
    setFocusTimeRemaining(0);
    setFocusPaused(false);
    if (focusIntervalRef.current) {
      clearInterval(focusIntervalRef.current);
    }
  }, []);

  const handleFocusComplete = useCallback(() => {
    // Play sound if enabled
    if (focusSoundEnabled) {
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp+cnZuZl5eXmJmbnp+gnp2bmJWTkY+OjY2Ojo+RlJebnp+fnp2bmJWSkI6MioqKi42PlZmenp2bmJWSkI6MiomJiYqMj5Oam52dnJqXlJGOjIqIh4eHiImLj5OXmp2dnJuZlpOQjYuJh4aGhoaHiYuOkpaZm5ycm5mWk5CNi4mHhoWFhYWGiIqNkJSXmpubmpmXlJGOjImHhoWEhISEhYeJjI+SlZiampqZl5WSkI2LiIaFhIODg4OEhoiLjpGUl5mampqYlpOQjouIhoWEg4ODg4OFh4mMj5KVl5mampqYlpOQjouIhoWEg4KCgoKEhoiLjpGUl5mampqYlpOQjouIhoWEg4KCgoKDhYeKjI+SlZeZmpqZl5WSkI2LiIaFhIOCgoKChIaIi46RlJeZmpqZmJaUkY6MiYeGhIOCgoKCg4WGiYyPkpWYmZqamJaUkY6MiYeGhIOCgoKCg4WGiYyPkpWYmZqamJaUkY6MiYeGhIOCgoKCg4WGiYyPkpWYmZqal5WTkI2KiIWEg4KBgYGBg4WGiYyPkpWYmZqal5WTkI2KiIWEg4KBgYGBg4WGiYyPkpWYmZqal5WTkI2KiIWEg4KBgYGBg4SGiYuOkZSXmZqal5WTkI2KiIWEg4KBgYGBgoSGiIuOkZSXmZqal5WTkI2KiIWEg4KBgYGBgoSGiIuOkZSXmZqal5WTkI2KiIWEg4KBgYGBgoSGiIuOkZSXmZqal5WTkI2KiIWEg4KBgYGBgoSGiIuOkZSXmZqal5WTkI2KiIWEg4KBgYGB');
        audio.volume = 0.5;
        audio.play().catch(() => {});
      } catch (e) {}
    }

    // Send notification
    if (notificationsEnabled && Notification.permission === 'granted') {
      const title = focusType === 'work' ? '🎉 Focus session complete!' : '⏰ Break time over!';
      const body = focusType === 'work'
        ? `Great job! Take a ${pomodoroCount + 1 >= pomodoroSettings.longBreakInterval ? pomodoroSettings.longBreak : pomodoroSettings.shortBreak} minute break.`
        : 'Ready for another focus session?';
      new Notification(title, { body });
    }

    if (focusType === 'work') {
      // Completed a work session
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);

      // Start break
      const isLongBreak = newCount % pomodoroSettings.longBreakInterval === 0;
      setFocusType('break');
      setFocusTimeRemaining((isLongBreak ? pomodoroSettings.longBreak : pomodoroSettings.shortBreak) * 60);
    } else {
      // Completed a break, start new work session
      setFocusType('work');
      setFocusTimeRemaining(pomodoroSettings.workDuration * 60);
    }
  }, [focusType, pomodoroCount, pomodoroSettings, notificationsEnabled, focusSoundEnabled]);

  const skipFocusPhase = useCallback(() => {
    if (focusType === 'work') {
      // Skip to break
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      const isLongBreak = newCount % pomodoroSettings.longBreakInterval === 0;
      setFocusType('break');
      setFocusTimeRemaining((isLongBreak ? pomodoroSettings.longBreak : pomodoroSettings.shortBreak) * 60);
    } else {
      // Skip to work
      setFocusType('work');
      setFocusTimeRemaining(pomodoroSettings.workDuration * 60);
    }
  }, [focusType, pomodoroCount, pomodoroSettings]);

  const formatFocusTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Save recurring patterns to localStorage
  useEffect(() => {
    localStorage.setItem('recurringPatterns', JSON.stringify(recurringPatterns));
  }, [recurringPatterns]);

  // Save activity history to localStorage
  useEffect(() => {
    localStorage.setItem('activityHistory', JSON.stringify(activityHistory));
  }, [activityHistory]);

  // Track activity completions for statistics
  const trackActivityCompletion = useCallback((activity, day) => {
    const entry = {
      id: generateId(),
      activityName: activity.activity,
      category: activity.category,
      plannedDuration: activity.duration,
      day: day,
      date: new Date().toISOString(),
      weekNumber: getWeekNumber(new Date())
    };
    setActivityHistory(prev => [...prev.slice(-500), entry]); // Keep last 500 entries
  }, []);

  // Get week number
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  // Recurring pattern functions
  const setRecurringPattern = useCallback((activityId, pattern) => {
    // pattern: { days: ['Monday', 'Tuesday', ...], enabled: true }
    if (pattern && pattern.days && pattern.days.length > 0) {
      setRecurringPatterns(prev => ({
        ...prev,
        [activityId]: pattern
      }));
    } else {
      setRecurringPatterns(prev => {
        const newPatterns = { ...prev };
        delete newPatterns[activityId];
        return newPatterns;
      });
    }
  }, []);

  const applyRecurringPattern = useCallback((sourceActivity, sourceDay) => {
    const pattern = recurringPatterns[sourceActivity.id];
    if (!pattern || !pattern.enabled) return;

    pushToUndoStack(schedule);
    const newSchedule = { ...schedule };

    pattern.days.forEach(targetDay => {
      if (targetDay === sourceDay) return; // Skip source day

      // Check if activity already exists on target day
      const existsOnDay = newSchedule[targetDay]?.some(
        a => a.activity === sourceActivity.activity && a.time === sourceActivity.time
      );

      if (!existsOnDay) {
        const targetSchedule = newSchedule[targetDay] || [];
        const newActivity = {
          ...sourceActivity,
          id: generateId(),
          recurringSourceId: sourceActivity.id
        };
        newSchedule[targetDay] = [...targetSchedule, newActivity].sort((a, b) =>
          parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time)
        );
      }
    });

    setSchedule(newSchedule);
    setHasChanges(true);
  }, [recurringPatterns, schedule, pushToUndoStack]);

  // Calculate activity insights
  const activityInsights = useMemo(() => {
    const now = new Date();
    const currentWeek = getWeekNumber(now);
    const lastWeek = currentWeek - 1;

    // Filter to recent history (last 4 weeks)
    const recentHistory = activityHistory.filter(entry => {
      const entryDate = new Date(entry.date);
      const weeksDiff = currentWeek - entry.weekNumber;
      return weeksDiff >= 0 && weeksDiff < 4;
    });

    // Category breakdown
    const categoryTotals = {};
    const categoryByWeek = {};
    const activityFrequency = {};
    const dayDistribution = {};

    recentHistory.forEach(entry => {
      // Category totals
      categoryTotals[entry.category] = (categoryTotals[entry.category] || 0) + entry.plannedDuration;

      // Category by week
      if (!categoryByWeek[entry.weekNumber]) {
        categoryByWeek[entry.weekNumber] = {};
      }
      categoryByWeek[entry.weekNumber][entry.category] =
        (categoryByWeek[entry.weekNumber][entry.category] || 0) + entry.plannedDuration;

      // Activity frequency
      activityFrequency[entry.activityName] = (activityFrequency[entry.activityName] || 0) + 1;

      // Day distribution
      dayDistribution[entry.day] = (dayDistribution[entry.day] || 0) + entry.plannedDuration;
    });

    // Find most productive day
    const mostProductiveDay = Object.entries(dayDistribution)
      .sort((a, b) => b[1] - a[1])[0];

    // Find top activities
    const topActivities = Object.entries(activityFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Calculate week-over-week change
    const thisWeekTotal = Object.values(categoryByWeek[currentWeek] || {}).reduce((a, b) => a + b, 0);
    const lastWeekTotal = Object.values(categoryByWeek[lastWeek] || {}).reduce((a, b) => a + b, 0);
    const weekChange = lastWeekTotal > 0 ? ((thisWeekTotal - lastWeekTotal) / lastWeekTotal * 100).toFixed(1) : 0;

    // Calculate streak (consecutive days with completed activities)
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasActivity = activityHistory.some(e => e.date.split('T')[0] === dateStr);
      if (hasActivity) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return {
      categoryTotals,
      categoryByWeek,
      topActivities,
      mostProductiveDay,
      thisWeekTotal,
      lastWeekTotal,
      weekChange,
      streak,
      totalTracked: recentHistory.length
    };
  }, [activityHistory]);

  // Conflict Detection - find overlapping activities
  const scheduleConflicts = useMemo(() => {
    const conflicts = [];

    days.forEach(day => {
      const daySchedule = schedule[day] || [];
      for (let i = 0; i < daySchedule.length; i++) {
        for (let j = i + 1; j < daySchedule.length; j++) {
          const a = daySchedule[i];
          const b = daySchedule[j];

          const aStart = parseTimeToMinutes(a.time);
          const aEnd = aStart + a.duration;
          const bStart = parseTimeToMinutes(b.time);
          const bEnd = bStart + b.duration;

          // Check for overlap
          if (aStart < bEnd && bStart < aEnd) {
            conflicts.push({
              day,
              activity1: a,
              activity2: b,
              overlapMinutes: Math.min(aEnd, bEnd) - Math.max(aStart, bStart)
            });
          }
        }
      }
    });

    return conflicts;
  }, [schedule]);

  // Find available time slots for auto-scheduler
  const findAvailableSlots = useCallback((duration, preferredDays, preferredTimeRange) => {
    const slots = [];
    const daysToCheck = preferredDays.length > 0 ? preferredDays : days;

    // Define time ranges
    const timeRanges = {
      morning: { start: 6 * 60, end: 12 * 60 },    // 6 AM - 12 PM
      afternoon: { start: 12 * 60, end: 17 * 60 }, // 12 PM - 5 PM
      evening: { start: 17 * 60, end: 22 * 60 },   // 5 PM - 10 PM
      any: { start: 6 * 60, end: 22 * 60 }         // 6 AM - 10 PM
    };

    const range = timeRanges[preferredTimeRange] || timeRanges.any;

    daysToCheck.forEach(day => {
      const daySchedule = (schedule[day] || []).slice().sort((a, b) =>
        parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time)
      );

      // Check gaps between activities
      let currentTime = range.start;

      for (const activity of daySchedule) {
        const actStart = parseTimeToMinutes(activity.time);
        const actEnd = actStart + activity.duration;

        // Check if there's a gap before this activity
        if (actStart > currentTime && actStart >= range.start && currentTime < range.end) {
          const gapStart = Math.max(currentTime, range.start);
          const gapEnd = Math.min(actStart, range.end);
          const gapDuration = gapEnd - gapStart;

          if (gapDuration >= duration) {
            slots.push({
              day,
              startMinutes: gapStart,
              endMinutes: gapStart + duration,
              time: formatMinutesToTime(gapStart),
              score: calculateSlotScore(day, gapStart, preferredTimeRange)
            });
          }
        }

        currentTime = Math.max(currentTime, actEnd);
      }

      // Check gap after last activity
      if (currentTime < range.end) {
        const gapDuration = range.end - currentTime;
        if (gapDuration >= duration) {
          slots.push({
            day,
            startMinutes: currentTime,
            endMinutes: currentTime + duration,
            time: formatMinutesToTime(currentTime),
            score: calculateSlotScore(day, currentTime, preferredTimeRange)
          });
        }
      }
    });

    // Sort by score (best slots first)
    return slots.sort((a, b) => b.score - a.score).slice(0, 10);
  }, [schedule]);

  // Calculate slot score for ranking suggestions
  const calculateSlotScore = (day, startMinutes, preferredTimeRange) => {
    let score = 100;

    // Prefer weekdays for work-related, weekends for personal
    const isWeekend = day === 'Saturday' || day === 'Sunday';

    // Time preference bonus
    const hour = Math.floor(startMinutes / 60);
    if (preferredTimeRange === 'morning' && hour >= 6 && hour < 10) score += 20;
    if (preferredTimeRange === 'afternoon' && hour >= 12 && hour < 15) score += 20;
    if (preferredTimeRange === 'evening' && hour >= 17 && hour < 20) score += 20;

    // Avoid very early or very late
    if (hour < 7) score -= 30;
    if (hour > 20) score -= 20;

    // Balanced distribution - prefer days with fewer activities
    const daySchedule = schedule[day] || [];
    score -= daySchedule.length * 5;

    return score;
  };

  // Format minutes to time string
  const formatMinutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  // Add activity from auto-scheduler suggestion
  const addFromSuggestion = useCallback((slot, activityName, duration, category) => {
    pushToUndoStack(schedule);

    const newActivity = {
      id: generateId(),
      time: slot.time,
      activity: activityName,
      duration: duration,
      category: category,
      emoji: getCategoryEmoji(category)
    };

    const daySchedule = schedule[slot.day] || [];
    const newSchedule = {
      ...schedule,
      [slot.day]: [...daySchedule, newActivity].sort((a, b) =>
        parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time)
      )
    };

    setSchedule(newSchedule);
    setHasChanges(true);
    setShowAutoScheduler(false);
    setAutoSchedulerRequest({
      activityName: '',
      duration: 30,
      category: 'Personal',
      preferredDays: [],
      preferredTimeRange: 'any'
    });
  }, [schedule, pushToUndoStack]);

  // Get emoji for category
  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'Work': '💼',
      'Personal': '🌟',
      'Exercise': '🏃',
      'Meals': '🍽️',
      'Family': '👨‍👩‍👧‍👦',
      'Development': '💻',
      'Music': '🎵',
      'Health': '❤️',
      'Learning': '📚',
      'Social': '👥'
    };
    return emojiMap[category] || '📌';
  };

  // Log today's activities for statistics (run once per day)
  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const lastLogged = localStorage.getItem('lastActivityLog');

    if (lastLogged !== todayStr) {
      const dayName = days[today.getDay() === 0 ? 6 : today.getDay() - 1];
      const todaySchedule = schedule[dayName] || [];

      todaySchedule.forEach(activity => {
        trackActivityCompletion(activity, dayName);
      });

      localStorage.setItem('lastActivityLog', todayStr);
    }
  }, [schedule, trackActivityCompletion]);

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

  // Filter schedule with search and category filter
  const filteredSchedule = useMemo(() => {
    let daySchedule = schedule[selectedDay] || [];

    // Filter out transitions if needed
    if (!showTransitions) {
      daySchedule = daySchedule.filter(item => item.category !== 'Transition');
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      daySchedule = daySchedule.filter(item => item.category === categoryFilter);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      daySchedule = daySchedule.filter(item =>
        item.activity.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.time.toLowerCase().includes(query)
      );
    }

    return daySchedule;
  }, [schedule, selectedDay, showTransitions, categoryFilter, searchQuery]);

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

  // Calculate goal progress
  const goalProgress = useMemo(() => {
    const progress = {};
    Object.entries(weeklyGoals).forEach(([category, goalHours]) => {
      const actualMinutes = stats[category]?.weekly || 0;
      const goalMinutes = goalHours * 60;
      const percentage = goalMinutes > 0 ? Math.min(100, (actualMinutes / goalMinutes) * 100) : 0;
      progress[category] = {
        goalMinutes,
        actualMinutes,
        percentage,
        remaining: Math.max(0, goalMinutes - actualMinutes),
        exceeded: actualMinutes > goalMinutes
      };
    });
    return progress;
  }, [weeklyGoals, stats]);

  // Save goal
  const saveGoal = (category, hours) => {
    if (hours <= 0) {
      const newGoals = { ...weeklyGoals };
      delete newGoals[category];
      setWeeklyGoals(newGoals);
    } else {
      setWeeklyGoals({ ...weeklyGoals, [category]: hours });
    }
    setShowGoalEditor(false);
    setEditingGoal({ category: '', hours: 0 });
  };

  // Start editing a goal
  const startGoalEdit = (category) => {
    setEditingGoal({
      category,
      hours: weeklyGoals[category] || Math.round((stats[category]?.weekly || 0) / 60)
    });
    setShowGoalEditor(true);
  };

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

  // Enhanced Drag and drop state
  const [droppedItemId, setDroppedItemId] = useState(null);
  const [isDraggingActive, setIsDraggingActive] = useState(false);
  const dragTimeout = useRef(null);

  // Drag and drop handlers with enhanced animations
  const handleDragStart = (e, index) => {
    dragNode.current = e.target;
    setDraggedItem({ index, item: filteredSchedule[index] });
    setIsDraggingActive(true);
    
    // Add dragging class for CSS animations
    e.target.classList.add('dragging');
    
    // Set drag image with offset for better visual feedback
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      // Create ghost image offset
      const rect = e.target.getBoundingClientRect();
      e.dataTransfer.setDragImage(e.target, rect.width / 2, rect.height / 2);
    }
    
    // Add floating animation after initial lift
    dragTimeout.current = setTimeout(() => {
      if (dragNode.current) {
        dragNode.current.classList.add('floating');
      }
    }, 200);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedItem?.index !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    if (draggedItem?.index !== index) {
      setDragOverIndex(index);
      // Add wiggle animation to drop target
      e.currentTarget.classList.add('drag-hover');
    }
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-hover');
  };

  const handleDragEnd = (e) => {
    // Clear timeout
    if (dragTimeout.current) {
      clearTimeout(dragTimeout.current);
    }
    
    // Remove all drag classes
    if (dragNode.current) {
      dragNode.current.classList.remove('dragging', 'floating');
    }
    
    setIsDraggingActive(false);
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    // Clear timeout
    if (dragTimeout.current) {
      clearTimeout(dragTimeout.current);
    }

    if (!draggedItem || draggedItem.index === dropIndex) {
      handleDragEnd(e);
      return;
    }

    pushToUndoStack(schedule);
    const newDaySchedule = [...schedule[selectedDay]];
    const [removed] = newDaySchedule.splice(draggedItem.index, 1);
    newDaySchedule.splice(dropIndex, 0, removed);

    const recalculated = recalculateTimes(newDaySchedule);
    setSchedule({ ...schedule, [selectedDay]: recalculated });
    setHasChanges(true);

    // Set dropped item for bounce animation
    setDroppedItemId(removed.id);
    setTimeout(() => setDroppedItemId(null), 400);

    // Clean up
    if (dragNode.current) {
      dragNode.current.classList.remove('dragging', 'floating');
    }
    
    setDraggedItem(null);
    setDragOverIndex(null);
    setIsDraggingActive(false);
  };

  // Edit handlers
  const startEdit = (item) => {
    setEditingItem(item.id);
    setEditValues({
      activity: item.activity,
      duration: item.duration,
      time: item.time,
      notes: item.notes || ''
    });
  };

  const saveEdit = (itemId) => {
    pushToUndoStack(schedule);
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
    setEditValues({ activity: '', duration: 0, time: '', notes: '' });
  };

  const deleteItem = (itemId) => {
    if (confirm('Delete this activity?')) {
      pushToUndoStack(schedule);
      const newDaySchedule = schedule[selectedDay].filter(item => item.id !== itemId);
      const recalculated = recalculateTimes(newDaySchedule);
      setSchedule({ ...schedule, [selectedDay]: recalculated });
      setHasChanges(true);
      setEditingItem(null);
    }
  };

  const addNewItem = () => {
    if (!newItem.activity.trim()) return;

    pushToUndoStack(schedule);
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
      category: newItem.category,
      notes: newItem.notes || ''
    };

    setSchedule({
      ...schedule,
      [selectedDay]: [...daySchedule, newActivity]
    });
    setHasChanges(true);
    setShowAddForm(false);
    setNewItem({ activity: '', duration: 30, category: 'Personal', notes: '' });
  };

  // Quick Add from Template
  const quickAddFromTemplate = (template) => {
    pushToUndoStack(schedule);
    const daySchedule = schedule[selectedDay];
    const lastItem = daySchedule[daySchedule.length - 1];
    const newTime = lastItem
      ? formatMinutesToTime(parseTimeToMinutes(lastItem.time) + lastItem.duration)
      : '9:00 AM';

    const newId = generateId();
    const newActivity = {
      id: newId,
      time: newTime,
      activity: `${template.emoji} ${template.name}`,
      duration: template.duration,
      category: template.category
    };

    setSchedule({
      ...schedule,
      [selectedDay]: [...daySchedule, newActivity]
    });
    setHasChanges(true);
    setShowQuickAdd(false);
    setRecentlyAddedId(newId);
    setTimeout(() => setRecentlyAddedId(null), 1000);
  };

  // Find available time gaps
  const findTimeGaps = useCallback(() => {
    const daySchedule = schedule[selectedDay] || [];
    if (daySchedule.length === 0) return [{ start: '9:00 AM', duration: 480 }];
    
    const gaps = [];
    const dayStart = parseTimeToMinutes('6:00 AM');
    const dayEnd = parseTimeToMinutes('10:00 PM');
    
    // Check gap at start of day
    const firstItem = daySchedule[0];
    const firstStart = parseTimeToMinutes(firstItem.time);
    if (firstStart > dayStart) {
      gaps.push({ 
        start: formatMinutesToTime(dayStart), 
        duration: firstStart - dayStart,
        label: 'Morning slot'
      });
    }
    
    // Check gaps between items
    for (let i = 0; i < daySchedule.length - 1; i++) {
      const currentEnd = parseTimeToMinutes(daySchedule[i].time) + daySchedule[i].duration;
      const nextStart = parseTimeToMinutes(daySchedule[i + 1].time);
      if (nextStart > currentEnd && (nextStart - currentEnd) >= 15) {
        gaps.push({ 
          start: formatMinutesToTime(currentEnd), 
          duration: nextStart - currentEnd,
          label: `After ${daySchedule[i].activity.substring(0, 20)}...`
        });
      }
    }
    
    // Check gap at end of day
    const lastItem = daySchedule[daySchedule.length - 1];
    const lastEnd = parseTimeToMinutes(lastItem.time) + lastItem.duration;
    if (lastEnd < dayEnd) {
      gaps.push({ 
        start: formatMinutesToTime(lastEnd), 
        duration: dayEnd - lastEnd,
        label: 'Evening slot'
      });
    }
    
    return gaps.filter(g => g.duration >= 15);
  }, [schedule, selectedDay]);

  // Duplicate Activity
  const duplicateActivity = (item) => {
    pushToUndoStack(schedule);
    const daySchedule = schedule[selectedDay];
    const itemIndex = daySchedule.findIndex(i => i.id === item.id);
    const newId = generateId();

    const duplicated = {
      ...item,
      id: newId,
      activity: `${item.activity} (copy)`
    };

    const newSchedule = [...daySchedule];
    newSchedule.splice(itemIndex + 1, 0, duplicated);

    const recalculated = recalculateTimes(newSchedule);
    setSchedule({ ...schedule, [selectedDay]: recalculated });
    setHasChanges(true);
    setSwipedItemId(null);
    setRecentlyAddedId(newId);
    setTimeout(() => setRecentlyAddedId(null), 1000);
  };

  // Copy Activity to Other Days
  const copyToDay = (item, targetDay) => {
    pushToUndoStack(schedule);
    const targetSchedule = schedule[targetDay] || [];
    const lastItem = targetSchedule[targetSchedule.length - 1];
    const newTime = lastItem
      ? formatMinutesToTime(parseTimeToMinutes(lastItem.time) + lastItem.duration)
      : '9:00 AM';

    const copiedActivity = {
      ...item,
      id: generateId(),
      time: newTime
    };

    const newSchedule = [...targetSchedule, copiedActivity];
    const recalculated = recalculateTimes(newSchedule);

    setSchedule({ ...schedule, [targetDay]: recalculated });
    setHasChanges(true);
    setShowCopyModal(null);
    setSwipedItemId(null);
  };

  // Quick Time Adjust
  const quickTimeAdjust = (item, adjustment) => {
    pushToUndoStack(schedule);
    const newDuration = Math.max(15, Math.min(480, item.duration + adjustment));
    const newDaySchedule = schedule[selectedDay].map(i =>
      i.id === item.id ? { ...i, duration: newDuration } : i
    );
    const recalculated = recalculateTimes(newDaySchedule);
    setSchedule({ ...schedule, [selectedDay]: recalculated });
    setHasChanges(true);
  };

  // Swipe handlers for mobile
  const handleTouchStart = (e, itemId) => {
    swipeStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e, itemId) => {
    if (!swipeStartX.current) return;
    const currentX = e.touches[0].clientX;
    const diff = swipeStartX.current - currentX;
    
    if (diff > swipeThreshold) {
      setSwipedItemId(itemId);
    } else if (diff < -swipeThreshold / 2) {
      setSwipedItemId(null);
    }
  };

  const handleTouchEnd = () => {
    swipeStartX.current = null;
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

                {/* Keyboard Shortcuts Help */}
                <button
                  onClick={() => setShowKeyboardHelp(true)}
                  className={`p-2.5 rounded-xl transition-all hover:scale-110 ${
                    darkMode
                      ? 'bg-white/10 hover:bg-white/20 text-white/60'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
                  }`}
                  title="Keyboard shortcuts (?)"
                >
                  <Keyboard className="w-5 h-5" />
                </button>

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
                  {/* Focus Mode Button */}
                  <button
                    onClick={() => focusMode ? stopFocusMode() : startFocusMode(currentActivity)}
                    className={`p-3 rounded-xl transition-all hover:scale-105 ${
                      focusMode
                        ? 'text-white shadow-lg'
                        : darkMode
                          ? 'bg-white/10 hover:bg-white/20 text-white/70'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                    style={focusMode ? {
                      background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`
                    } : {}}
                    title={focusMode ? 'Stop focus mode (F)' : 'Start focus mode (F)'}
                  >
                    {focusMode ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
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
          <div className="flex items-center gap-2 flex-wrap">
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

            {/* Quick Add Templates Button */}
            <button
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all hover:scale-[1.02] ${
                showQuickAdd
                  ? 'text-white shadow-lg'
                  : darkMode
                    ? 'bg-white/10 hover:bg-white/20 text-white/80'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              style={showQuickAdd ? {
                background: `linear-gradient(to right, ${theme.secondary}, ${theme.primary})`,
                boxShadow: `0 4px 15px ${theme.secondary}40`
              } : {}}
            >
              <Zap className="w-4 h-4" />
              Quick
            </button>

            {/* Undo/Redo Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={undo}
                disabled={undoStack.length === 0}
                className={`p-2 rounded-lg text-sm font-medium transition-all ${
                  undoStack.length === 0
                    ? darkMode
                      ? 'bg-white/5 text-white/20 cursor-not-allowed'
                      : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                    : darkMode
                      ? 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
                }`}
                title={`Undo (${undoStack.length} steps)`}
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={redo}
                disabled={redoStack.length === 0}
                className={`p-2 rounded-lg text-sm font-medium transition-all ${
                  redoStack.length === 0
                    ? darkMode
                      ? 'bg-white/5 text-white/20 cursor-not-allowed'
                      : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                    : darkMode
                      ? 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
                }`}
                title={`Redo (${redoStack.length} steps)`}
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

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
        {/* QUICK ADD TEMPLATES PANEL */}
        {/* ===================================== */}
        {showQuickAdd && (
          <GlassCard darkMode={darkMode} className="mb-4 animate-scale-in" glow glowColor={theme.secondary}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Zap className="w-4 h-4" style={{ color: theme.primary }} />
                  Quick Add Templates
                </h3>
                <button
                  onClick={() => setShowQuickAdd(false)}
                  className={`p-1.5 rounded-lg transition-all ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                >
                  <X className={`w-4 h-4 ${darkMode ? 'text-white/50' : 'text-gray-400'}`} />
                </button>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {activityTemplates.map((template, idx) => (
                  <button
                    key={idx}
                    onClick={() => quickAddFromTemplate(template)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.98] ${
                      darkMode 
                        ? 'bg-white/5 hover:bg-white/10' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    style={{ 
                      borderLeft: `3px solid ${categories[template.category]?.accent || theme.primary}` 
                    }}
                  >
                    <span className="text-2xl">{template.emoji}</span>
                    <span className={`text-xs font-medium text-center leading-tight ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                      {template.name}
                    </span>
                    <span className={`text-[10px] ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                      {template.duration}m
                    </span>
                  </button>
                ))}
              </div>
              
              {/* Time Gap Suggestions */}
              {findTimeGaps().length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className={`text-xs font-medium mb-2 flex items-center gap-1.5 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                    <Timer className="w-3.5 h-3.5" />
                    Available Time Slots
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {findTimeGaps().slice(0, 3).map((gap, idx) => (
                      <div
                        key={idx}
                        className={`px-3 py-1.5 rounded-lg text-xs ${
                          darkMode ? 'bg-white/5 text-white/60' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <span className="font-medium">{gap.start}</span>
                        <span className="mx-1">•</span>
                        <span>{formatDuration(gap.duration)} free</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        )}

        {/* ===================================== */}
        {/* COPY TO DAY MODAL */}
        {/* ===================================== */}
        {showCopyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <GlassCard darkMode={darkMode} className="w-full max-w-sm animate-scale-in">
              <div className="p-5">
                <h3 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Copy className="w-5 h-5" style={{ color: theme.primary }} />
                  Copy to Day
                </h3>
                <p className={`text-sm mb-4 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                  Copy "{showCopyModal.activity.substring(0, 30)}..." to:
                </p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {days.filter(d => d !== selectedDay).map(day => (
                    <button
                      key={day}
                      onClick={() => copyToDay(showCopyModal, day)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] ${
                        darkMode 
                          ? 'bg-white/5 hover:bg-white/10 text-white/80' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowCopyModal(null)}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    darkMode 
                      ? 'bg-white/10 hover:bg-white/20 text-white/70' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </GlassCard>
          </div>
        )}

        {/* ===================================== */}
        {/* CLONE WEEK MODAL */}
        {/* ===================================== */}
        {showCloneWeekModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <GlassCard darkMode={darkMode} className="w-full max-w-md animate-scale-in">
              <div className="p-5">
                <h3 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <CopyPlus className="w-5 h-5" style={{ color: theme.primary }} />
                  Clone Schedule
                </h3>

                <p className={`text-sm mb-4 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                  Copy a day's schedule to all other days, or clear everything.
                </p>

                {/* Clone Source Day to All */}
                <div className="mb-4">
                  <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                    COPY DAY TO ALL OTHERS
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {days.map(day => (
                      <button
                        key={day}
                        onClick={() => cloneDayToAll(day)}
                        className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] ${
                          darkMode
                            ? 'bg-white/5 hover:bg-white/10 text-white/80'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                  <p className={`text-xs mt-2 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                    This will copy the selected day's schedule to all other days.
                  </p>
                </div>

                {/* Danger Zone */}
                <div className={`p-3 rounded-xl border-2 border-dashed ${
                  darkMode ? 'border-red-500/30 bg-red-500/5' : 'border-red-200 bg-red-50'
                }`}>
                  <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                    DANGER ZONE
                  </p>
                  <button
                    onClick={clearAllDays}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      darkMode
                        ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                        : 'bg-red-100 hover:bg-red-200 text-red-700'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All Days
                  </button>
                </div>

                <button
                  onClick={() => setShowCloneWeekModal(false)}
                  className={`w-full mt-4 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    darkMode
                      ? 'bg-white/10 hover:bg-white/20 text-white/70'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}
                >
                  Close
                </button>
              </div>
            </GlassCard>
          </div>
        )}

        {/* ===================================== */}
        {/* BACKUP RESTORE MODAL */}
        {/* ===================================== */}
        {showBackupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <GlassCard darkMode={darkMode} className="w-full max-w-md animate-scale-in">
              <div className="p-5">
                <h3 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Archive className="w-5 h-5" style={{ color: theme.primary }} />
                  Backup & Restore
                </h3>

                <p className={`text-sm mb-4 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                  Export your schedule as a backup file or restore from a previous backup.
                </p>

                {/* Export Backup */}
                <button
                  onClick={() => { exportBackup(); setShowBackupModal(false); }}
                  className={`w-full mb-3 flex items-center justify-between px-4 py-4 rounded-xl transition-all hover:scale-[1.01] ${
                    darkMode
                      ? 'bg-white/5 hover:bg-white/10'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      darkMode ? 'bg-green-500/20' : 'bg-green-100'
                    }`}>
                      <Download className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Export Backup
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                        Download schedule, goals & settings
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-white/40' : 'text-gray-400'}`} />
                </button>

                {/* Import Backup */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full mb-4 flex items-center justify-between px-4 py-4 rounded-xl transition-all hover:scale-[1.01] ${
                    darkMode
                      ? 'bg-white/5 hover:bg-white/10'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                    }`}>
                      <Upload className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Restore from Backup
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                        Import a previously exported file
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-white/40' : 'text-gray-400'}`} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  onChange={importBackup}
                  className="hidden"
                />

                {/* Info */}
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <div className="flex items-start gap-2">
                    <FileJson className={`w-4 h-4 mt-0.5 ${darkMode ? 'text-white/40' : 'text-gray-400'}`} />
                    <p className={`text-xs ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                      Backups include your complete schedule, weekly goals, theme preferences, and notification settings.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowBackupModal(false)}
                  className={`w-full mt-4 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    darkMode
                      ? 'bg-white/10 hover:bg-white/20 text-white/70'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}
                >
                  Close
                </button>
              </div>
            </GlassCard>
          </div>
        )}

        {/* ===================================== */}
        {/* FOCUS MODE PANEL */}
        {/* ===================================== */}
        {focusMode && (
          <div className="fixed bottom-24 left-4 right-4 z-40 max-w-md mx-auto animate-slide-up">
            <GlassCard darkMode={darkMode} glow glowColor={focusType === 'work' ? theme.primary : '#22c55e'}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full animate-pulse`}
                      style={{ backgroundColor: focusType === 'work' ? theme.primary : '#22c55e' }}
                    />
                    <span className={`text-xs font-medium uppercase tracking-wide ${
                      darkMode ? 'text-white/60' : 'text-gray-500'
                    }`}>
                      {focusType === 'work' ? 'Focus Time' : 'Break Time'}
                    </span>
                    {pomodoroCount > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        darkMode ? 'bg-white/10 text-white/50' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {pomodoroCount} completed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setFocusSoundEnabled(!focusSoundEnabled)}
                      className={`p-1.5 rounded-lg transition-all ${
                        darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                      }`}
                      title={focusSoundEnabled ? 'Sound on' : 'Sound off'}
                    >
                      {focusSoundEnabled ? (
                        <Volume2 className={`w-4 h-4 ${darkMode ? 'text-white/50' : 'text-gray-400'}`} />
                      ) : (
                        <VolumeX className={`w-4 h-4 ${darkMode ? 'text-white/30' : 'text-gray-300'}`} />
                      )}
                    </button>
                    <button
                      onClick={stopFocusMode}
                      className={`p-1.5 rounded-lg transition-all ${
                        darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                      }`}
                      title="Stop focus mode"
                    >
                      <X className={`w-4 h-4 ${darkMode ? 'text-white/50' : 'text-gray-400'}`} />
                    </button>
                  </div>
                </div>

                {/* Timer Display */}
                <div className="text-center mb-4">
                  <div
                    className="text-5xl font-bold tracking-tight"
                    style={{ color: focusType === 'work' ? theme.primary : '#22c55e' }}
                  >
                    {formatFocusTime(focusTimeRemaining)}
                  </div>
                  {focusActivity && (
                    <p className={`text-sm mt-2 truncate ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                      {focusActivity.activity}
                    </p>
                  )}
                </div>

                {/* Progress Bar */}
                <div className={`h-2 rounded-full overflow-hidden mb-4 ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${((focusType === 'work' ? pomodoroSettings.workDuration * 60 : (pomodoroCount % pomodoroSettings.longBreakInterval === 0 ? pomodoroSettings.longBreak : pomodoroSettings.shortBreak) * 60) - focusTimeRemaining) / (focusType === 'work' ? pomodoroSettings.workDuration * 60 : (pomodoroCount % pomodoroSettings.longBreakInterval === 0 ? pomodoroSettings.longBreak : pomodoroSettings.shortBreak) * 60) * 100}%`,
                      backgroundColor: focusType === 'work' ? theme.primary : '#22c55e'
                    }}
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setFocusPaused(!focusPaused)}
                    className="p-3 rounded-xl text-white shadow-lg transition-all hover:scale-105"
                    style={{
                      background: focusType === 'work'
                        ? `linear-gradient(to right, ${theme.primary}, ${theme.accent})`
                        : 'linear-gradient(to right, #22c55e, #16a34a)'
                    }}
                  >
                    {focusPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
                  </button>
                  <button
                    onClick={skipFocusPhase}
                    className={`p-3 rounded-xl transition-all ${
                      darkMode
                        ? 'bg-white/10 hover:bg-white/20 text-white/70'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                    title={focusType === 'work' ? 'Skip to break' : 'Skip to work'}
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                  <button
                    onClick={stopFocusMode}
                    className={`p-3 rounded-xl transition-all ${
                      darkMode
                        ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                        : 'bg-red-100 hover:bg-red-200 text-red-600'
                    }`}
                    title="Stop"
                  >
                    <Square className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* ===================================== */}
        {/* KEYBOARD SHORTCUTS HELP */}
        {/* ===================================== */}
        {showKeyboardHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <GlassCard darkMode={darkMode} className="w-full max-w-lg animate-scale-in max-h-[80vh] overflow-y-auto">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Keyboard className="w-5 h-5" style={{ color: theme.primary }} />
                    Keyboard Shortcuts
                  </h3>
                  <button
                    onClick={() => setShowKeyboardHelp(false)}
                    className={`p-1.5 rounded-lg transition-all ${
                      darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X className={`w-4 h-4 ${darkMode ? 'text-white/50' : 'text-gray-400'}`} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Navigation */}
                  <div>
                    <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                      NAVIGATION
                    </p>
                    <div className="space-y-1">
                      {[
                        { keys: ['←', 'H'], desc: 'Previous day' },
                        { keys: ['→', 'L'], desc: 'Next day' },
                        { keys: ['T'], desc: 'Go to today' },
                        { keys: ['1'], desc: 'Schedule view' },
                        { keys: ['2'], desc: 'Dashboard view' },
                        { keys: ['3'], desc: 'Settings view' },
                      ].map(({ keys, desc }) => (
                        <div key={desc} className="flex items-center justify-between">
                          <span className={`text-sm ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>{desc}</span>
                          <div className="flex gap-1">
                            {keys.map(k => (
                              <kbd key={k} className={`px-2 py-1 rounded text-xs font-mono ${
                                darkMode ? 'bg-white/10 text-white/80' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {k}
                              </kbd>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                      ACTIONS
                    </p>
                    <div className="space-y-1">
                      {[
                        { keys: ['N'], desc: 'New activity' },
                        { keys: ['Q'], desc: 'Quick add templates' },
                        { keys: ['F'], desc: 'Start/stop focus mode' },
                        { keys: ['Space'], desc: 'Pause/resume focus (when active)' },
                        { keys: ['Esc'], desc: 'Close modal / Cancel edit' },
                      ].map(({ keys, desc }) => (
                        <div key={desc} className="flex items-center justify-between">
                          <span className={`text-sm ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>{desc}</span>
                          <div className="flex gap-1">
                            {keys.map(k => (
                              <kbd key={k} className={`px-2 py-1 rounded text-xs font-mono ${
                                darkMode ? 'bg-white/10 text-white/80' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {k}
                              </kbd>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Edit */}
                  <div>
                    <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                      EDIT
                    </p>
                    <div className="space-y-1">
                      {[
                        { keys: ['Ctrl', 'Z'], desc: 'Undo' },
                        { keys: ['Ctrl', 'Shift', 'Z'], desc: 'Redo' },
                        { keys: ['Ctrl', 'S'], desc: 'Save changes' },
                        { keys: ['?'], desc: 'Show this help' },
                      ].map(({ keys, desc }) => (
                        <div key={desc} className="flex items-center justify-between">
                          <span className={`text-sm ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>{desc}</span>
                          <div className="flex gap-1">
                            {keys.map(k => (
                              <kbd key={k} className={`px-2 py-1 rounded text-xs font-mono ${
                                darkMode ? 'bg-white/10 text-white/80' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {k}
                              </kbd>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowKeyboardHelp(false)}
                  className={`w-full mt-4 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    darkMode
                      ? 'bg-white/10 hover:bg-white/20 text-white/70'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}
                >
                  Close
                </button>
              </div>
            </GlassCard>
          </div>
        )}

        {/* ===================================== */}
        {/* RECURRING ACTIVITY MODAL */}
        {/* ===================================== */}
        {showRecurringModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <GlassCard darkMode={darkMode} className="w-full max-w-md animate-scale-in">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Repeat className="w-5 h-5" style={{ color: theme.primary }} />
                    Recurring Activity
                  </h3>
                  <button
                    onClick={() => setShowRecurringModal(null)}
                    className={`p-1.5 rounded-lg transition-all ${
                      darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X className={`w-4 h-4 ${darkMode ? 'text-white/50' : 'text-gray-400'}`} />
                  </button>
                </div>

                <p className={`text-sm mb-4 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                  Set "{showRecurringModal.activity.substring(0, 30)}..." to repeat on specific days.
                </p>

                {/* Day Selection */}
                <div className="mb-4">
                  <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                    REPEAT ON
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {days.map(day => {
                      const isSelected = recurringPatterns[showRecurringModal.id]?.days?.includes(day);
                      const isSourceDay = day === selectedDay;
                      return (
                        <button
                          key={day}
                          onClick={() => {
                            const currentPattern = recurringPatterns[showRecurringModal.id] || { days: [], enabled: true };
                            const newDays = isSelected
                              ? currentPattern.days.filter(d => d !== day)
                              : [...currentPattern.days, day];
                            setRecurringPattern(showRecurringModal.id, { ...currentPattern, days: newDays });
                          }}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            isSelected
                              ? 'text-white shadow-md'
                              : isSourceDay
                                ? darkMode
                                  ? 'bg-white/20 text-white/80 ring-2 ring-white/30'
                                  : 'bg-gray-200 text-gray-700 ring-2 ring-gray-400'
                                : darkMode
                                  ? 'bg-white/5 hover:bg-white/10 text-white/60'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                          }`}
                          style={isSelected ? { background: theme.primary } : {}}
                        >
                          {day.slice(0, 3)}
                          {isSourceDay && <span className="ml-1 text-xs opacity-60">(source)</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Select */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => {
                      setRecurringPattern(showRecurringModal.id, {
                        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                        enabled: true
                      });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      darkMode
                        ? 'bg-white/5 hover:bg-white/10 text-white/60'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    Weekdays
                  </button>
                  <button
                    onClick={() => {
                      setRecurringPattern(showRecurringModal.id, {
                        days: ['Saturday', 'Sunday'],
                        enabled: true
                      });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      darkMode
                        ? 'bg-white/5 hover:bg-white/10 text-white/60'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    Weekends
                  </button>
                  <button
                    onClick={() => {
                      setRecurringPattern(showRecurringModal.id, { days: [...days], enabled: true });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      darkMode
                        ? 'bg-white/5 hover:bg-white/10 text-white/60'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    Every Day
                  </button>
                  <button
                    onClick={() => {
                      setRecurringPattern(showRecurringModal.id, null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      darkMode
                        ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                        : 'bg-red-100 hover:bg-red-200 text-red-600'
                    }`}
                  >
                    Clear
                  </button>
                </div>

                {/* Apply Button */}
                {recurringPatterns[showRecurringModal.id]?.days?.length > 0 && (
                  <button
                    onClick={() => {
                      applyRecurringPattern(showRecurringModal, selectedDay);
                      setShowRecurringModal(null);
                      setSwipedItemId(null);
                    }}
                    className="w-full mb-3 px-4 py-3 rounded-xl text-sm font-medium text-white shadow-lg transition-all hover:scale-[1.02]"
                    style={{
                      background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`
                    }}
                  >
                    Apply to Selected Days Now
                  </button>
                )}

                <button
                  onClick={() => { setShowRecurringModal(null); setSwipedItemId(null); }}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    darkMode
                      ? 'bg-white/10 hover:bg-white/20 text-white/70'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}
                >
                  Close
                </button>
              </div>
            </GlassCard>
          </div>
        )}

        {/* ===================================== */}
        {/* ACTIVITY INSIGHTS MODAL */}
        {/* ===================================== */}
        {showInsightsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <GlassCard darkMode={darkMode} className="w-full max-w-lg animate-scale-in max-h-[85vh] overflow-y-auto">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <LineChart className="w-5 h-5" style={{ color: theme.primary }} />
                    Activity Insights
                  </h3>
                  <button
                    onClick={() => setShowInsightsModal(false)}
                    className={`p-1.5 rounded-lg transition-all ${
                      darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X className={`w-4 h-4 ${darkMode ? 'text-white/50' : 'text-gray-400'}`} />
                  </button>
                </div>

                {/* Streak & Overview */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className={`text-xs font-medium ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                        STREAK
                      </span>
                    </div>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {activityInsights.streak} days
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className={`w-5 h-5 ${
                        parseFloat(activityInsights.weekChange) >= 0 ? 'text-green-500' : 'text-red-500'
                      }`} />
                      <span className={`text-xs font-medium ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                        VS LAST WEEK
                      </span>
                    </div>
                    <p className={`text-2xl font-bold ${
                      parseFloat(activityInsights.weekChange) >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}>
                      {parseFloat(activityInsights.weekChange) >= 0 ? '+' : ''}{activityInsights.weekChange}%
                    </p>
                  </div>
                </div>

                {/* This Week Summary */}
                <div className={`p-4 rounded-xl mb-4 ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                    THIS WEEK
                  </p>
                  <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatDuration(activityInsights.thisWeekTotal)} scheduled
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                    Last week: {formatDuration(activityInsights.lastWeekTotal)}
                  </p>
                </div>

                {/* Most Productive Day */}
                {activityInsights.mostProductiveDay && (
                  <div className={`p-4 rounded-xl mb-4 ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                      MOST ACTIVE DAY
                    </p>
                    <div className="flex items-center gap-3">
                      <CalendarDays className="w-8 h-8" style={{ color: theme.primary }} />
                      <div>
                        <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {activityInsights.mostProductiveDay[0]}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                          {formatDuration(activityInsights.mostProductiveDay[1])} average
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top Activities */}
                {activityInsights.topActivities.length > 0 && (
                  <div className="mb-4">
                    <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                      TOP ACTIVITIES
                    </p>
                    <div className="space-y-2">
                      {activityInsights.topActivities.map(([name, count], i) => (
                        <div
                          key={name}
                          className={`flex items-center gap-3 p-3 rounded-xl ${
                            darkMode ? 'bg-white/5' : 'bg-gray-50'
                          }`}
                        >
                          <span className={`text-lg font-bold w-6 ${darkMode ? 'text-white/30' : 'text-gray-300'}`}>
                            {i + 1}
                          </span>
                          <span className={`flex-1 text-sm truncate ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                            {name}
                          </span>
                          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {count}x
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category Breakdown */}
                {Object.keys(activityInsights.categoryTotals).length > 0 && (
                  <div className="mb-4">
                    <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                      TIME BY CATEGORY (Last 4 Weeks)
                    </p>
                    <div className="space-y-2">
                      {Object.entries(activityInsights.categoryTotals)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 6)
                        .map(([category, minutes]) => {
                          const catInfo = categories[category];
                          const maxMins = Math.max(...Object.values(activityInsights.categoryTotals));
                          const percentage = (minutes / maxMins) * 100;
                          return (
                            <div key={category} className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${catInfo?.accent}20` }}
                              >
                                {catInfo?.icon && <catInfo.icon className="w-4 h-4" style={{ color: catInfo.accent }} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`text-sm truncate ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                                    {category}
                                  </span>
                                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {formatDuration(minutes)}
                                  </span>
                                </div>
                                <div className={`h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                      width: `${percentage}%`,
                                      backgroundColor: catInfo?.accent
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {activityInsights.totalTracked === 0 && (
                  <div className={`text-center py-8 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                    <LineChart className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="font-medium mb-1">No data yet</p>
                    <p className="text-sm opacity-75">
                      Insights will appear after tracking activities for a few days
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setShowInsightsModal(false)}
                  className={`w-full mt-4 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    darkMode
                      ? 'bg-white/10 hover:bg-white/20 text-white/70'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}
                >
                  Close
                </button>
              </div>
            </GlassCard>
          </div>
        )}

        {/* ===================================== */}
        {/* PRINT VIEW MODAL */}
        {/* ===================================== */}
        {showPrintView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-auto rounded-2xl shadow-2xl animate-scale-in">
              {/* Print Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between no-print">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Printer className="w-5 h-5 text-blue-500" />
                  Print Preview
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-all flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                  <button
                    onClick={() => setShowPrintView(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Printable Content */}
              <div className="p-8 print-content" id="print-schedule">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Weekly Schedule</h1>
                  <p className="text-gray-500 text-sm mt-1">
                    Week of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                {/* Schedule Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {days.map(day => {
                    const daySchedule = schedule[day] || [];
                    const isToday = day === days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
                    return (
                      <div key={day} className={`border rounded-lg overflow-hidden ${isToday ? 'border-blue-400 border-2' : 'border-gray-200'}`}>
                        <div className={`p-2 text-center font-bold text-sm ${isToday ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'}`}>
                          {day.slice(0, 3)}
                        </div>
                        <div className="p-2 min-h-[200px]">
                          {daySchedule.length === 0 ? (
                            <p className="text-xs text-gray-400 text-center italic">No activities</p>
                          ) : (
                            <div className="space-y-1">
                              {daySchedule.map((item, idx) => (
                                <div key={idx} className="text-xs p-1.5 rounded bg-gray-50 border-l-2" style={{ borderLeftColor: categories[item.category]?.accent || '#888' }}>
                                  <div className="font-medium text-gray-800 truncate">
                                    {item.emoji} {item.activity.substring(0, 20)}{item.activity.length > 20 ? '...' : ''}
                                  </div>
                                  <div className="text-gray-500">
                                    {item.time} • {item.duration}min
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Statistics Summary */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="font-bold text-gray-700 mb-3">Weekly Summary</h4>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-500 text-xs">Total Activities</p>
                      <p className="font-bold text-gray-900">{stats.totalActivities}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-500 text-xs">Total Time</p>
                      <p className="font-bold text-gray-900">{formatDuration(stats.totalTime)}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-500 text-xs">Categories Used</p>
                      <p className="font-bold text-gray-900">{Object.keys(stats.categoryBreakdown).length}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-500 text-xs">Avg Per Day</p>
                      <p className="font-bold text-gray-900">{formatDuration(Math.round(stats.totalTime / 7))}</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
                  Generated from Schedule App • {new Date().toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================== */}
        {/* CONFLICT WARNINGS MODAL */}
        {/* ===================================== */}
        {scheduleConflicts.length > 0 && showConflicts && view === 'schedule' && (
          <div className={`fixed bottom-24 left-4 right-4 z-40 max-w-md mx-auto animate-slide-up`}>
            <GlassCard darkMode={darkMode} glow className="border-2 border-amber-500/50">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Schedule Conflicts ({scheduleConflicts.length})
                      </h4>
                      <button
                        onClick={() => setShowConflicts(false)}
                        className={`p-1 rounded-lg transition-all ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                      >
                        <X className={`w-4 h-4 ${darkMode ? 'text-white/50' : 'text-gray-400'}`} />
                      </button>
                    </div>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                      Overlapping activities detected:
                    </p>
                    <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                      {scheduleConflicts.slice(0, 3).map((conflict, i) => (
                        <div
                          key={i}
                          className={`text-xs p-2 rounded-lg cursor-pointer transition-all ${
                            darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                          onClick={() => setSelectedDay(conflict.day)}
                        >
                          <span className="font-medium" style={{ color: theme.primary }}>{conflict.day}:</span>
                          <span className={darkMode ? 'text-white/70' : 'text-gray-600'}>
                            {' '}{conflict.activity1.activity.substring(0, 15)}... & {conflict.activity2.activity.substring(0, 15)}...
                          </span>
                          <span className="text-amber-500 ml-1">({conflict.overlapMinutes}min overlap)</span>
                        </div>
                      ))}
                      {scheduleConflicts.length > 3 && (
                        <p className={`text-xs ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                          +{scheduleConflicts.length - 3} more conflicts
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* ===================================== */}
        {/* AUTO-SCHEDULER MODAL */}
        {/* ===================================== */}
        {showAutoScheduler && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <GlassCard darkMode={darkMode} className="w-full max-w-lg animate-scale-in max-h-[90vh] overflow-y-auto">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Wand2 className="w-5 h-5" style={{ color: theme.primary }} />
                    Smart Scheduler
                  </h3>
                  <button
                    onClick={() => setShowAutoScheduler(false)}
                    className={`p-1.5 rounded-lg transition-all ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                  >
                    <X className={`w-4 h-4 ${darkMode ? 'text-white/50' : 'text-gray-400'}`} />
                  </button>
                </div>

                <p className={`text-sm mb-4 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                  Tell me what you want to schedule and I'll find the best time slots.
                </p>

                {/* Activity Name */}
                <div className="mb-4">
                  <label className={`text-xs font-medium mb-1.5 block ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                    ACTIVITY NAME
                  </label>
                  <input
                    type="text"
                    value={autoSchedulerRequest.activityName}
                    onChange={(e) => setAutoSchedulerRequest(prev => ({ ...prev, activityName: e.target.value }))}
                    placeholder="e.g., Morning workout, Team meeting..."
                    className={`w-full px-4 py-3 rounded-xl text-sm transition-all ${
                      darkMode
                        ? 'bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-white/30'
                        : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400'
                    } focus:outline-none`}
                  />
                </div>

                {/* Duration & Category */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className={`text-xs font-medium mb-1.5 block ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                      DURATION
                    </label>
                    <select
                      value={autoSchedulerRequest.duration}
                      onChange={(e) => setAutoSchedulerRequest(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      className={`w-full px-4 py-3 rounded-xl text-sm transition-all ${
                        darkMode
                          ? 'bg-white/5 border border-white/10 text-white'
                          : 'bg-gray-50 border border-gray-200 text-gray-900'
                      } focus:outline-none`}
                    >
                      <option value={15}>15 min</option>
                      <option value={30}>30 min</option>
                      <option value={45}>45 min</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className={`text-xs font-medium mb-1.5 block ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                      CATEGORY
                    </label>
                    <select
                      value={autoSchedulerRequest.category}
                      onChange={(e) => setAutoSchedulerRequest(prev => ({ ...prev, category: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl text-sm transition-all ${
                        darkMode
                          ? 'bg-white/5 border border-white/10 text-white'
                          : 'bg-gray-50 border border-gray-200 text-gray-900'
                      } focus:outline-none`}
                    >
                      {Object.keys(categories).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preferred Time */}
                <div className="mb-4">
                  <label className={`text-xs font-medium mb-1.5 block ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                    PREFERRED TIME
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'any', label: 'Any Time', icon: Clock3 },
                      { value: 'morning', label: 'Morning', icon: Sun },
                      { value: 'afternoon', label: 'Afternoon', icon: Clock },
                      { value: 'evening', label: 'Evening', icon: Moon },
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setAutoSchedulerRequest(prev => ({ ...prev, preferredTimeRange: value }))}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                          autoSchedulerRequest.preferredTimeRange === value
                            ? 'text-white shadow-md'
                            : darkMode
                              ? 'bg-white/5 hover:bg-white/10 text-white/60'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                        }`}
                        style={autoSchedulerRequest.preferredTimeRange === value ? { background: theme.primary } : {}}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferred Days */}
                <div className="mb-4">
                  <label className={`text-xs font-medium mb-1.5 block ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                    PREFERRED DAYS (leave empty for any)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {days.map(day => {
                      const isSelected = autoSchedulerRequest.preferredDays.includes(day);
                      return (
                        <button
                          key={day}
                          onClick={() => {
                            setAutoSchedulerRequest(prev => ({
                              ...prev,
                              preferredDays: isSelected
                                ? prev.preferredDays.filter(d => d !== day)
                                : [...prev.preferredDays, day]
                            }));
                          }}
                          className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                            isSelected
                              ? 'text-white shadow-md'
                              : darkMode
                                ? 'bg-white/5 hover:bg-white/10 text-white/60'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                          }`}
                          style={isSelected ? { background: theme.primary } : {}}
                        >
                          {day.slice(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Suggestions */}
                {autoSchedulerRequest.activityName && (
                  <div className="mb-4">
                    <label className={`text-xs font-medium mb-2 block ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                      SUGGESTED TIME SLOTS
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {findAvailableSlots(
                        autoSchedulerRequest.duration,
                        autoSchedulerRequest.preferredDays,
                        autoSchedulerRequest.preferredTimeRange
                      ).slice(0, 6).map((slot, i) => (
                        <button
                          key={i}
                          onClick={() => addFromSuggestion(
                            slot,
                            autoSchedulerRequest.activityName,
                            autoSchedulerRequest.duration,
                            autoSchedulerRequest.category
                          )}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                            darkMode
                              ? 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
                              : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${theme.primary}20` }}
                          >
                            <Clock3 className="w-5 h-5" style={{ color: theme.primary }} />
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {slot.day} at {slot.time}
                            </p>
                            <p className={`text-xs ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                              {autoSchedulerRequest.duration} min • Score: {slot.score}
                            </p>
                          </div>
                          <Plus className={`w-5 h-5 ${darkMode ? 'text-white/40' : 'text-gray-400'}`} />
                        </button>
                      ))}
                      {findAvailableSlots(
                        autoSchedulerRequest.duration,
                        autoSchedulerRequest.preferredDays,
                        autoSchedulerRequest.preferredTimeRange
                      ).length === 0 && (
                        <p className={`text-center py-4 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                          No available slots found. Try adjusting your preferences.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setShowAutoScheduler(false)}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    darkMode
                      ? 'bg-white/10 hover:bg-white/20 text-white/70'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                  }`}
                >
                  Close
                </button>
              </div>
            </GlassCard>
          </div>
        )}

        {/* ===================================== */}
        {/* SETTINGS VIEW */}
        {/* ===================================== */}
        {view === 'settings' && (
          <>
          {/* Notifications Settings */}
          <GlassCard darkMode={darkMode} className="mb-4">
            <div className="p-5">
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Bell className="w-5 h-5" style={{ color: theme.primary }} />
                Notifications
              </h3>

              {/* Notification Permission Status */}
              <div className={`flex items-center justify-between p-4 rounded-xl mb-4 ${
                darkMode ? 'bg-white/5' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  {notificationsEnabled && Notification.permission === 'granted' ? (
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-green-500" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center">
                      <BellOff className={`w-5 h-5 ${darkMode ? 'text-white/40' : 'text-gray-400'}`} />
                    </div>
                  )}
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {notificationsEnabled && Notification.permission === 'granted'
                        ? 'Notifications Enabled'
                        : 'Notifications Disabled'}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                      Get reminded before activities start
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (notificationsEnabled) {
                      setNotificationsEnabled(false);
                    } else {
                      requestNotificationPermission();
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    notificationsEnabled
                      ? darkMode
                        ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                        : 'bg-red-100 hover:bg-red-200 text-red-700'
                      : 'text-white shadow-lg'
                  }`}
                  style={!notificationsEnabled ? {
                    background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`
                  } : {}}
                >
                  {notificationsEnabled ? 'Disable' : 'Enable'}
                </button>
              </div>

              {/* Notification Timing */}
              {notificationsEnabled && (
                <div className="space-y-3 animate-fade-in">
                  <p className={`text-sm font-medium ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                    Notify me before activity starts:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[1, 5, 10, 15, 30].map(mins => (
                      <button
                        key={mins}
                        onClick={() => setNotificationTiming(mins)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          notificationTiming === mins
                            ? 'text-white shadow-lg'
                            : darkMode
                              ? 'bg-white/5 hover:bg-white/10 text-white/60'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                        }`}
                        style={notificationTiming === mins ? {
                          background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`
                        } : {}}
                      >
                        {mins} min
                      </button>
                    ))}
                  </div>

                  {/* Test Notification */}
                  <button
                    onClick={() => sendNotification('Test Notification', 'Notifications are working correctly!')}
                    className={`mt-3 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                      darkMode
                        ? 'bg-white/5 hover:bg-white/10 text-white/60'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                    Test Notification
                  </button>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Theme Settings */}
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

          {/* Data Management Section */}
          <GlassCard darkMode={darkMode} className="mb-4">
            <div className="p-5">
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <History className="w-5 h-5" style={{ color: theme.primary }} />
                Data Management
              </h3>

              <div className="space-y-3">
                {/* Clone Week */}
                <button
                  onClick={() => setShowCloneWeekModal(true)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    darkMode
                      ? 'bg-white/5 hover:bg-white/10'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CopyPlus className={`w-5 h-5 ${darkMode ? 'text-white/70' : 'text-gray-600'}`} />
                    <div className="text-left">
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Clone Schedule
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                        Copy a day to all others or clear all
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-white/40' : 'text-gray-400'}`} />
                </button>

                {/* Backup & Restore */}
                <button
                  onClick={() => setShowBackupModal(true)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    darkMode
                      ? 'bg-white/5 hover:bg-white/10'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Archive className={`w-5 h-5 ${darkMode ? 'text-white/70' : 'text-gray-600'}`} />
                    <div className="text-left">
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Backup & Restore
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                        Export or import your schedule data
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-white/40' : 'text-gray-400'}`} />
                </button>
              </div>

              {/* Undo/Redo Info */}
              {(undoStack.length > 0 || redoStack.length > 0) && (
                <div className={`mt-4 p-3 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className={`w-4 h-4 ${darkMode ? 'text-white/40' : 'text-gray-400'}`} />
                      <span className={`text-xs ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                        History: {undoStack.length} undo, {redoStack.length} redo steps
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={undo}
                        disabled={undoStack.length === 0}
                        className={`p-1.5 rounded-lg transition-all ${
                          undoStack.length === 0
                            ? 'opacity-30 cursor-not-allowed'
                            : darkMode
                              ? 'hover:bg-white/10'
                              : 'hover:bg-gray-200'
                        }`}
                      >
                        <Undo2 className={`w-3.5 h-3.5 ${darkMode ? 'text-white/60' : 'text-gray-500'}`} />
                      </button>
                      <button
                        onClick={redo}
                        disabled={redoStack.length === 0}
                        className={`p-1.5 rounded-lg transition-all ${
                          redoStack.length === 0
                            ? 'opacity-30 cursor-not-allowed'
                            : darkMode
                              ? 'hover:bg-white/10'
                              : 'hover:bg-gray-200'
                        }`}
                      >
                        <Redo2 className={`w-3.5 h-3.5 ${darkMode ? 'text-white/60' : 'text-gray-500'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
          </>
        )}

        {/* ===================================== */}
        {/* DASHBOARD VIEW */}
        {/* ===================================== */}
        {view === 'dashboard' && (
          <>
          {/* Weekly Goals Section */}
          <GlassCard darkMode={darkMode} className="mb-4" glow glowColor={theme.accent}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Target className="w-5 h-5" style={{ color: theme.accent }} />
                  Weekly Goals
                </h3>
                <button
                  onClick={() => setShowGoalEditor(!showGoalEditor)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    showGoalEditor
                      ? 'text-white shadow-md'
                      : darkMode
                        ? 'bg-white/5 hover:bg-white/10 text-white/60'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                  style={showGoalEditor ? {
                    background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`
                  } : {}}
                >
                  <Plus className="w-3.5 h-3.5" />
                  {showGoalEditor ? 'Done' : 'Set Goals'}
                </button>
              </div>

              {/* Goal Editor */}
              {showGoalEditor && (
                <div className={`mb-4 p-4 rounded-xl animate-scale-in ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                    Set weekly time goals by category:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categoryList.map(cat => {
                      const catInfo = categories[cat];
                      const hasGoal = weeklyGoals[cat];
                      const Icon = catInfo.icon;
                      return (
                        <button
                          key={cat}
                          onClick={() => startGoalEdit(cat)}
                          className={`p-3 rounded-xl text-left transition-all hover:scale-[1.02] ${
                            hasGoal
                              ? ''
                              : darkMode
                                ? 'bg-white/5 hover:bg-white/10'
                                : 'bg-white hover:bg-gray-100'
                          }`}
                          style={hasGoal ? {
                            backgroundColor: `${catInfo.accent}20`,
                            borderLeft: `3px solid ${catInfo.accent}`
                          } : {}}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="w-4 h-4" style={{ color: catInfo.accent }} />
                            <span className={`text-xs font-medium truncate ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                              {cat}
                            </span>
                          </div>
                          <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {hasGoal ? `${weeklyGoals[cat]}h / week` : 'Set goal'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Active Goals Progress */}
              {Object.keys(weeklyGoals).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(goalProgress)
                    .sort((a, b) => b[1].percentage - a[1].percentage)
                    .map(([category, progress]) => {
                      const catInfo = categories[category];
                      const Icon = catInfo?.icon || Star;
                      return (
                        <div
                          key={category}
                          className={`p-4 rounded-xl transition-all ${
                            darkMode ? 'bg-white/5' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${catInfo?.accent}20` }}
                              >
                                <Icon className="w-4 h-4" style={{ color: catInfo?.accent }} />
                              </div>
                              <div>
                                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {category}
                                </p>
                                <p className={`text-xs ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                                  {formatDuration(progress.actualMinutes)} / {formatDuration(progress.goalMinutes)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-lg font-bold ${
                                progress.exceeded
                                  ? 'text-green-500'
                                  : progress.percentage >= 80
                                    ? darkMode ? 'text-white' : 'text-gray-900'
                                    : progress.percentage >= 50
                                      ? 'text-yellow-500'
                                      : 'text-orange-500'
                              }`}>
                                {Math.round(progress.percentage)}%
                              </p>
                              {progress.exceeded && (
                                <p className="text-xs text-green-500 flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Goal reached!
                                </p>
                              )}
                            </div>
                          </div>
                          {/* Progress Bar */}
                          <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(100, progress.percentage)}%`,
                                backgroundColor: progress.exceeded ? '#22c55e' : catInfo?.accent
                              }}
                            />
                          </div>
                          {!progress.exceeded && progress.remaining > 0 && (
                            <p className={`text-xs mt-2 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                              {formatDuration(progress.remaining)} remaining this week
                            </p>
                          )}
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className={`text-center py-6 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                  <Target className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="font-medium mb-1">No goals set yet</p>
                  <p className="text-sm opacity-75">
                    Click "Set Goals" to track your weekly time targets
                  </p>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Goal Editor Modal */}
          {editingGoal.category && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <GlassCard darkMode={darkMode} className="w-full max-w-sm animate-scale-in">
                <div className="p-5">
                  <h3 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Target className="w-5 h-5" style={{ color: categories[editingGoal.category]?.accent }} />
                    Set {editingGoal.category} Goal
                  </h3>

                  <div className="mb-4">
                    <label className={`block text-xs font-medium mb-2 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                      Hours per week
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setEditingGoal({ ...editingGoal, hours: Math.max(0, editingGoal.hours - 1) })}
                        className={`p-2 rounded-lg transition-all ${
                          darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <Minus className={`w-4 h-4 ${darkMode ? 'text-white' : 'text-gray-600'}`} />
                      </button>
                      <input
                        type="number"
                        value={editingGoal.hours}
                        onChange={(e) => setEditingGoal({ ...editingGoal, hours: Math.max(0, parseInt(e.target.value) || 0) })}
                        className={`w-20 text-center px-3 py-2 rounded-xl border-2 transition-all outline-none text-lg font-bold ${
                          darkMode
                            ? 'bg-white/5 border-white/10 text-white focus:border-white/30'
                            : 'bg-white border-gray-200 text-gray-900 focus:border-gray-300'
                        }`}
                        min="0"
                        max="168"
                      />
                      <button
                        onClick={() => setEditingGoal({ ...editingGoal, hours: Math.min(168, editingGoal.hours + 1) })}
                        className={`p-2 rounded-lg transition-all ${
                          darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <Plus className={`w-4 h-4 ${darkMode ? 'text-white' : 'text-gray-600'}`} />
                      </button>
                    </div>
                    <p className={`text-xs mt-2 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                      Current: {formatDuration(stats[editingGoal.category]?.weekly || 0)} this week
                    </p>
                  </div>

                  {/* Quick Presets */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[5, 10, 15, 20, 30, 40].map(h => (
                      <button
                        key={h}
                        onClick={() => setEditingGoal({ ...editingGoal, hours: h })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          editingGoal.hours === h
                            ? 'text-white shadow-md'
                            : darkMode
                              ? 'bg-white/5 hover:bg-white/10 text-white/60'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                        }`}
                        style={editingGoal.hours === h ? {
                          background: categories[editingGoal.category]?.accent
                        } : {}}
                      >
                        {h}h
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {weeklyGoals[editingGoal.category] && (
                      <button
                        onClick={() => saveGoal(editingGoal.category, 0)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          darkMode
                            ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                            : 'bg-red-100 hover:bg-red-200 text-red-700'
                        }`}
                      >
                        Remove
                      </button>
                    )}
                    <button
                      onClick={() => { setEditingGoal({ category: '', hours: 0 }); }}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        darkMode
                          ? 'bg-white/5 hover:bg-white/10 text-white/70'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveGoal(editingGoal.category, editingGoal.hours)}
                      disabled={editingGoal.hours <= 0}
                      className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                      style={{
                        background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`
                      }}
                    >
                      Save Goal
                    </button>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {/* Analytics Section */}
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
          </>
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

                {/* Notes (Optional) */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                    Notes (Optional)
                  </label>
                  <textarea
                    value={newItem.notes}
                    onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                    placeholder="Add notes, reminders, or details..."
                    rows={2}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none resize-none ${
                      darkMode
                        ? 'bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-white/30'
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-300'
                    }`}
                  />
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
        {/* SEARCH & FILTER BAR */}
        {/* ===================================== */}
        {view === 'schedule' && (
          <GlassCard darkMode={darkMode} className="mb-4">
            <div className="p-4">
              {/* Search Input */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all ${
                  darkMode
                    ? 'bg-white/5 border-white/10 focus-within:border-white/30'
                    : 'bg-white border-gray-200 focus-within:border-gray-300'
                }`}>
                  <Search className={`w-4 h-4 flex-shrink-0 ${darkMode ? 'text-white/40' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search activities..."
                    className={`flex-1 bg-transparent outline-none text-sm ${
                      darkMode ? 'text-white placeholder-white/40' : 'text-gray-900 placeholder-gray-400'
                    }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className={`p-1 rounded-full transition-all ${
                        darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                      }`}
                    >
                      <X className={`w-3.5 h-3.5 ${darkMode ? 'text-white/50' : 'text-gray-400'}`} />
                    </button>
                  )}
                </div>
                {/* Timeline Toggle */}
                <button
                  onClick={() => setShowTimelineView(!showTimelineView)}
                  className={`p-2.5 rounded-xl transition-all ${
                    showTimelineView
                      ? 'text-white shadow-lg'
                      : darkMode
                        ? 'bg-white/5 hover:bg-white/10 text-white/60'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                  style={showTimelineView ? {
                    background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`
                  } : {}}
                  title={showTimelineView ? 'List view' : 'Timeline view'}
                >
                  {showTimelineView ? <GripVertical className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
                </button>

                {/* Insights Button */}
                <button
                  onClick={() => setShowInsightsModal(true)}
                  className={`p-2.5 rounded-xl transition-all ${
                    darkMode
                      ? 'bg-white/5 hover:bg-white/10 text-white/60'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                  title="Activity insights"
                >
                  <LineChart className="w-5 h-5" />
                </button>

                {/* Smart Scheduler Button */}
                <button
                  onClick={() => setShowAutoScheduler(true)}
                  className={`p-2.5 rounded-xl transition-all ${
                    darkMode
                      ? 'bg-white/5 hover:bg-white/10 text-white/60'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                  title="Smart scheduler - find best time slots"
                >
                  <Wand2 className="w-5 h-5" />
                </button>

                {/* Print View Button */}
                <button
                  onClick={() => setShowPrintView(true)}
                  className={`p-2.5 rounded-xl transition-all ${
                    darkMode
                      ? 'bg-white/5 hover:bg-white/10 text-white/60'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                  title="Print schedule"
                >
                  <Printer className="w-5 h-5" />
                </button>

                {/* Conflict Warning Indicator */}
                {scheduleConflicts.length > 0 && (
                  <button
                    onClick={() => setShowConflicts(true)}
                    className="p-2.5 rounded-xl transition-all bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 relative"
                    title={`${scheduleConflicts.length} scheduling conflict(s)`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">
                      {scheduleConflicts.length}
                    </span>
                  </button>
                )}

                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2.5 rounded-xl transition-all ${
                    showFilters || categoryFilter !== 'all'
                      ? 'text-white shadow-lg'
                      : darkMode
                        ? 'bg-white/5 hover:bg-white/10 text-white/60'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                  style={showFilters || categoryFilter !== 'all' ? {
                    background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`
                  } : {}}
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>

              {/* Category Filter Pills */}
              {showFilters && (
                <div className="flex flex-wrap gap-2 mb-3 animate-fade-in">
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      categoryFilter === 'all'
                        ? 'text-white shadow-md'
                        : darkMode
                          ? 'bg-white/5 hover:bg-white/10 text-white/60'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                    style={categoryFilter === 'all' ? {
                      background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`
                    } : {}}
                  >
                    All
                  </button>
                  {categoryList.map(cat => {
                    const catInfo = categories[cat];
                    return (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                          categoryFilter === cat
                            ? 'text-white shadow-md'
                            : darkMode
                              ? 'bg-white/5 hover:bg-white/10 text-white/60'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                        }`}
                        style={categoryFilter === cat ? {
                          background: catInfo.accent
                        } : {}}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Active Filter Badge */}
              {(searchQuery || categoryFilter !== 'all') && (
                <div className={`flex items-center gap-2 mb-3 text-xs ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                  <span>Showing {filteredSchedule.length} activities</span>
                  {(searchQuery || categoryFilter !== 'all') && (
                    <button
                      onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }}
                      className={`px-2 py-1 rounded-lg transition-all ${
                        darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </GlassCard>
        )}

        {/* ===================================== */}
        {/* TIMELINE VIEW */}
        {/* ===================================== */}
        {view === 'schedule' && showTimelineView && (
          <GlassCard darkMode={darkMode} className="mb-4">
            <div className="p-4">
              <div className="relative" style={{ minHeight: `${(timelineEndHour - timelineStartHour) * 60}px` }}>
                {/* Hour markers */}
                {Array.from({ length: timelineEndHour - timelineStartHour + 1 }, (_, i) => {
                  const hour = timelineStartHour + i;
                  const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                  const ampm = hour >= 12 ? 'PM' : 'AM';
                  return (
                    <div
                      key={hour}
                      className="absolute left-0 right-0 flex items-start"
                      style={{ top: `${i * 60}px` }}
                    >
                      <span className={`text-xs w-16 flex-shrink-0 ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>
                        {hour12} {ampm}
                      </span>
                      <div className={`flex-1 border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`} />
                    </div>
                  );
                })}

                {/* Current time indicator */}
                {(() => {
                  const now = currentTime;
                  const currentMins = now.getHours() * 60 + now.getMinutes();
                  const startMins = timelineStartHour * 60;
                  const top = currentMins - startMins;
                  if (top >= 0 && top <= (timelineEndHour - timelineStartHour) * 60) {
                    return (
                      <div
                        className="absolute left-16 right-0 flex items-center z-10"
                        style={{ top: `${top}px` }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <div
                          className="flex-1 h-0.5"
                          style={{ backgroundColor: theme.primary }}
                        />
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Activity blocks */}
                {filteredSchedule.map((item) => {
                  const catInfo = categories[item.category] || categories['Personal'];
                  const startMins = parseTimeToMinutes(item.time);
                  const timelineStartMins = timelineStartHour * 60;
                  const top = startMins - timelineStartMins;
                  const height = Math.max(item.duration, 20);

                  if (top < 0 || top > (timelineEndHour - timelineStartHour) * 60) return null;

                  return (
                    <div
                      key={item.id}
                      className={`absolute left-16 right-2 rounded-lg px-3 py-2 cursor-pointer transition-all hover:scale-[1.02] overflow-hidden ${
                        item.special ? 'ring-2 ring-amber-400' : ''
                      }`}
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        backgroundColor: `${catInfo.accent}20`,
                        borderLeft: `4px solid ${catInfo.accent}`
                      }}
                      onClick={() => startEdit(item)}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.activity}
                        </span>
                        {item.notes && <MessageSquare className="w-3 h-3 flex-shrink-0 opacity-50" />}
                        {recurringPatterns[item.id] && <Repeat className="w-3 h-3 flex-shrink-0 opacity-50" />}
                      </div>
                      {height > 35 && (
                        <p className={`text-xs truncate ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                          {item.time} • {formatDuration(item.duration)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        )}

        {/* ===================================== */}
        {/* SCHEDULE LIST */}
        {/* ===================================== */}
        {view === 'schedule' && !showTimelineView && (
          <GlassCard darkMode={darkMode} className="mb-4">
            <div className="p-4">
              {/* Empty State */}
              {filteredSchedule.length === 0 && (
                <div className={`text-center py-8 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="font-medium mb-1">No activities found</p>
                  <p className="text-sm opacity-75">
                    {searchQuery || categoryFilter !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'Add some activities to get started'}
                  </p>
                </div>
              )}
              <div className="space-y-2">
                {filteredSchedule.map((item, index) => {
                  const catInfo = categories[item.category] || categories['Personal'];
                  const Icon = catInfo.icon;
                  const isTransition = item.category === 'Transition';
                  const isDragging = draggedItem?.index === index;
                  const isDragOver = dragOverIndex === index && !isDragging;
                  const isEditing = editingItem === item.id;
                  const isCurrent = isCurrentActivity(item);
                  const isDropped = droppedItemId === item.id;
                  const isBeingDraggedOver = isDraggingActive && !isDragging;
                  const isSwiped = swipedItemId === item.id;
                  const isRecentlyAdded = recentlyAddedId === item.id;
                  
                  // Calculate if this item should shift
                  const shouldShiftDown = isDraggingActive && draggedItem && 
                    index > draggedItem.index && dragOverIndex !== null && 
                    index <= dragOverIndex && !isDragging;
                  const shouldShiftUp = isDraggingActive && draggedItem && 
                    index < draggedItem.index && dragOverIndex !== null && 
                    index >= dragOverIndex && !isDragging;
                  
                  return (
                    <div
                      key={item.id}
                      className="relative overflow-hidden rounded-xl"
                    >
                      {/* Swipe Action Buttons (revealed on swipe) */}
                      <div 
                        className={`absolute inset-y-0 right-0 flex items-center gap-1 pr-2 transition-all duration-300 ${
                          isSwiped ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                        }`}
                        style={{ width: '180px' }}
                      >
                        {/* Quick Time Adjust */}
                        <button
                          onClick={() => quickTimeAdjust(item, -15)}
                          className="p-2 rounded-lg bg-orange-500/80 text-white hover:bg-orange-500 transition-all"
                          title="Subtract 15 min"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => quickTimeAdjust(item, 15)}
                          className="p-2 rounded-lg bg-green-500/80 text-white hover:bg-green-500 transition-all"
                          title="Add 15 min"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        
                        {/* Duplicate */}
                        <button
                          onClick={() => duplicateActivity(item)}
                          className="p-2 rounded-lg bg-blue-500/80 text-white hover:bg-blue-500 transition-all"
                          title="Duplicate"
                        >
                          <Layers className="w-4 h-4" />
                        </button>
                        
                        {/* Copy to Day */}
                        <button
                          onClick={() => setShowCopyModal(item)}
                          className="p-2 rounded-lg bg-purple-500/80 text-white hover:bg-purple-500 transition-all"
                          title="Copy to day"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {/* Recurring */}
                        <button
                          onClick={() => setShowRecurringModal(item)}
                          className={`p-2 rounded-lg transition-all ${
                            recurringPatterns[item.id]
                              ? 'bg-blue-500 text-white'
                              : 'bg-cyan-500/80 text-white hover:bg-cyan-500'
                          }`}
                          title="Set recurring"
                        >
                          <Repeat className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Main Item Content */}
                      <div
                        draggable={!isTransition && !isEditing && !isSwiped}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragLeave={handleDragLeave}
                        onDragEnd={handleDragEnd}
                        onDrop={(e) => handleDrop(e, index)}
                        onTouchStart={(e) => !isTransition && handleTouchStart(e, item.id)}
                        onTouchMove={(e) => !isTransition && handleTouchMove(e, item.id)}
                        onTouchEnd={handleTouchEnd}
                        onClick={() => isSwiped && setSwipedItemId(null)}
                        className={`
                          draggable-item group relative flex items-center gap-3 p-4 rounded-xl
                          transition-all duration-300
                          ${isDragOver 
                            ? 'drop-target-glow ring-2 ring-dashed scale-[1.02]'
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
                          }
                          ${!isTransition && !isEditing ? 'cursor-grab active:cursor-grabbing' : ''}
                          ${isDragging ? 'opacity-40 scale-[0.98] shadow-none' : ''}
                          ${isDropped ? 'animate-drop-bounce' : ''}
                          ${isRecentlyAdded ? 'animate-scale-in ring-2' : ''}
                          ${shouldShiftDown ? 'translate-y-2' : ''}
                          ${shouldShiftUp ? '-translate-y-2' : ''}
                          ${isBeingDraggedOver && !isDragOver ? 'transition-transform duration-200' : ''}
                          ${isSwiped ? '-translate-x-[180px]' : 'translate-x-0'}
                        `}
                        style={{
                          ...(isDragOver ? { 
                            borderColor: theme.primary,
                            backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                            transform: 'scale(1.02)',
                          } : {}),
                          ...(isEditing ? { borderColor: theme.primary } : {}),
                          ...(isCurrent ? { 
                            borderColor: catInfo.accent,
                            boxShadow: `0 0 20px ${catInfo.accent}30`
                          } : {}),
                          ...(isRecentlyAdded ? { borderColor: theme.primary } : {}),
                          zIndex: isDragging ? 1000 : 'auto',
                        }}
                      >
                        {/* Drop indicator line above item */}
                        {isDragOver && draggedItem && draggedItem.index > index && (
                          <div 
                            className="absolute -top-1 left-4 right-4 h-1 rounded-full"
                            style={{ 
                              background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)`,
                              boxShadow: `0 0 8px ${theme.primary}80`
                            }}
                          />
                      )}
                      
                      {/* Drop indicator line below item */}
                      {isDragOver && draggedItem && draggedItem.index < index && (
                        <div 
                          className="absolute -bottom-1 left-4 right-4 h-1 rounded-full"
                          style={{ 
                            background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)`,
                            boxShadow: `0 0 8px ${theme.primary}80`
                          }}
                        />
                      )}
                      
                      {/* Drag Handle */}
                      {!isTransition && !isEditing && (
                        <div className={`
                          opacity-0 group-hover:opacity-100 transition-all duration-200
                          ${isDraggingActive ? 'opacity-100' : ''}
                          ${darkMode ? 'text-white/30 group-hover:text-white/60' : 'text-gray-400 group-hover:text-gray-600'}
                        `}>
                          <GripVertical className="w-5 h-5" />
                        </div>
                      )}
                      {(isTransition || isEditing) && <div className="w-5" />}
                      
                      {/* Category Icon */}
                      <div 
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          isCurrent ? 'animate-pulse' : ''
                        } ${isDragOver ? 'scale-110' : ''}`}
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

                          {/* Notes Field */}
                          <div className="flex items-start gap-2">
                            <MessageSquare className={`w-4 h-4 mt-2.5 ${darkMode ? 'text-white/40' : 'text-gray-400'}`} />
                            <textarea
                              value={editValues.notes}
                              onChange={(e) => setEditValues({ ...editValues, notes: e.target.value })}
                              placeholder="Add notes..."
                              rows={2}
                              className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all outline-none text-xs resize-none ${
                                darkMode
                                  ? 'bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-white/30'
                                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-300'
                              }`}
                            />
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
                            {item.notes && (
                              <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${darkMode ? 'text-white/40' : 'text-gray-400'}`} title="Has notes" />
                            )}
                            {recurringPatterns[item.id] && (
                              <Repeat className={`w-3.5 h-3.5 flex-shrink-0 ${darkMode ? 'text-blue-400/60' : 'text-blue-500/60'}`} title="Recurring activity" />
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
                            {item.notes && (
                              <>
                                <span>•</span>
                                <span className="truncate max-w-[100px]" title={item.notes}>
                                  {item.notes.length > 20 ? item.notes.substring(0, 20) + '...' : item.notes}
                                </span>
                              </>
                            )}
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
