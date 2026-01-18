import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Coffee, Briefcase, Home, Gamepad2, Music, BookOpen, Heart, Dog, Printer, Moon, Sun, Star, Pizza, Film, Calendar, CheckCircle2 } from 'lucide-react';

const categories = {
  'Morning': { color: 'bg-amber-500', icon: Coffee },
  'Development': { color: 'bg-blue-600', icon: Briefcase },
  'Patty Shack': { color: 'bg-orange-500', icon: Briefcase },
  'Personal': { color: 'bg-green-500', icon: Star },
  'Family': { color: 'bg-pink-500', icon: Heart },
  'Music': { color: 'bg-purple-500', icon: Music },
  'Reading': { color: 'bg-indigo-500', icon: BookOpen },
  'Gaming': { color: 'bg-red-500', icon: Gamepad2 },
  '3D Printing': { color: 'bg-cyan-500', icon: Printer },
  'Chores': { color: 'bg-gray-500', icon: Home },
  'Transition': { color: 'bg-slate-400', icon: Clock },
  'Evening': { color: 'bg-violet-600', icon: Moon },
  'Special': { color: 'bg-yellow-500', icon: Star },
};

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
};

const baseSchedule = {
  Monday: [
    { time: '5:45 AM', activity: '🥚 Egg, Inc', duration: 15, category: 'Personal' },
    { time: '6:00 AM', activity: '☕ Wake up + Coffee', duration: 30, category: 'Morning' },
    { time: '6:30 AM', activity: '🚿 Morning Routine', duration: 30, category: 'Morning' },
    { time: '7:00 AM', activity: '🐕 Feed Huskies', duration: 5, category: 'Morning' },
    { time: '7:05 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '7:10 AM', activity: '🍳 Breakfast + Email', duration: 50, category: 'Morning' },
    { time: '8:00 AM', activity: '💻 Development Sprint', duration: 115, category: 'Development' },
    { time: '9:55 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '10:00 AM', activity: '🍔 Patty Shack Ops', duration: 85, category: 'Patty Shack' },
    { time: '11:25 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '11:30 AM', activity: '📈 Business Development', duration: 30, category: 'Development' },
    { time: '12:00 PM', activity: '🍽️ Lunch', duration: 30, category: 'Morning' },
    { time: '12:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '12:35 PM', activity: '🎯 Whatever I Want', duration: 40, category: 'Personal' },
    { time: '1:15 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '1:20 PM', activity: '💻 Development Sprint 2', duration: 90, category: 'Development' },
    { time: '2:50 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '2:55 PM', activity: '🎯 Whatever I Want', duration: 55, category: 'Personal' },
    { time: '3:50 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '3:55 PM', activity: '🖨️ 3D Print Check', duration: 10, category: '3D Printing' },
    { time: '4:05 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '4:10 PM', activity: '🏠 Quick Chores', duration: 15, category: 'Chores' },
    { time: '4:25 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '4:30 PM', activity: '👨‍👩‍👧‍👦 Family Time', duration: 60, category: 'Family' },
    { time: '5:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '5:35 PM', activity: '🍽️ Family Dinner', duration: 55, category: 'Family' },
    { time: '6:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '6:35 PM', activity: '🎮 Logan Time', duration: 30, category: 'Gaming' },
    { time: '7:05 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '7:10 PM', activity: '👨‍👧 Mia Time', duration: 50, category: 'Family' },
    { time: '8:00 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '8:05 PM', activity: '🎸 Music Practice', duration: 30, category: 'Music' },
    { time: '8:35 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '8:40 PM', activity: '💑 Aimee Time', duration: 50, category: 'Family' },
    { time: '9:30 PM', activity: '😴 Bedtime Routine', duration: 30, category: 'Evening' },
  ],
  Tuesday: [
    { time: '5:45 AM', activity: '🥚 Egg, Inc', duration: 15, category: 'Personal' },
    { time: '6:00 AM', activity: '☕ Wake up + Coffee', duration: 30, category: 'Morning' },
    { time: '6:30 AM', activity: '🚿 Morning Routine', duration: 30, category: 'Morning' },
    { time: '7:00 AM', activity: '🐕 Feed Huskies', duration: 5, category: 'Morning' },
    { time: '7:05 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '7:10 AM', activity: '🍳 Breakfast + Email', duration: 50, category: 'Morning' },
    { time: '8:00 AM', activity: '🖨️ 3D Print Design Session', duration: 55, category: '3D Printing' },
    { time: '8:55 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '9:00 AM', activity: '🍔 Patty Shack Check-in', duration: 30, category: 'Patty Shack' },
    { time: '9:30 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '9:35 AM', activity: '💻 HEAVY DEV SPRINT', duration: 145, category: 'Development' },
    { time: '12:00 PM', activity: '🍽️ Lunch', duration: 30, category: 'Morning' },
    { time: '12:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '12:35 PM', activity: '🎯 Whatever I Want', duration: 40, category: 'Personal' },
    { time: '1:15 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '1:20 PM', activity: '💻 HEAVY DEV SPRINT 2', duration: 90, category: 'Development' },
    { time: '2:50 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '2:55 PM', activity: '📈 Business Development', duration: 35, category: 'Development' },
    { time: '3:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '3:35 PM', activity: '🎯 Whatever I Want', duration: 55, category: 'Personal' },
    { time: '4:30 PM', activity: '👨‍👩‍👧‍👦 Family Time', duration: 60, category: 'Family' },
    { time: '5:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '5:35 PM', activity: '🍽️ Family Dinner', duration: 55, category: 'Family' },
    { time: '6:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '6:35 PM', activity: '🎮 Logan Time', duration: 30, category: 'Gaming' },
    { time: '7:05 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '7:10 PM', activity: '👨‍👧 Mia Time', duration: 50, category: 'Family' },
    { time: '8:00 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '8:05 PM', activity: '📚 Reading Time', duration: 30, category: 'Reading' },
    { time: '8:35 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '8:40 PM', activity: '💑 Aimee Time', duration: 50, category: 'Family' },
    { time: '9:30 PM', activity: '😴 Bedtime Routine', duration: 30, category: 'Evening' },
  ],
  Wednesday: [
    { time: '5:45 AM', activity: '🥚 Egg, Inc', duration: 15, category: 'Personal' },
    { time: '6:00 AM', activity: '☕ Wake up + Coffee', duration: 30, category: 'Morning' },
    { time: '6:30 AM', activity: '🚿 Morning Routine', duration: 30, category: 'Morning' },
    { time: '7:00 AM', activity: '🐕 Feed Huskies', duration: 5, category: 'Morning' },
    { time: '7:05 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '7:10 AM', activity: '🍳 Breakfast + Email', duration: 50, category: 'Morning' },
    { time: '8:00 AM', activity: '💻 Development Sprint', duration: 60, category: 'Development' },
    { time: '9:00 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '9:05 AM', activity: '🍔 Patty Shack Midweek Check', duration: 55, category: 'Patty Shack' },
    { time: '10:00 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '10:05 AM', activity: '💻 Development Sprint 2', duration: 115, category: 'Development' },
    { time: '12:00 PM', activity: '🍽️ Lunch', duration: 30, category: 'Morning' },
    { time: '12:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '12:35 PM', activity: '🎯 BONUS Whatever I Want!', duration: 120, category: 'Personal', special: true },
    { time: '2:35 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '2:40 PM', activity: '📈 Business Development', duration: 45, category: 'Development' },
    { time: '3:25 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '3:30 PM', activity: '🖨️ 3D Print Check', duration: 10, category: '3D Printing' },
    { time: '3:40 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '3:45 PM', activity: '🏠 Quick Chores', duration: 15, category: 'Chores' },
    { time: '4:00 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '4:05 PM', activity: '🎯 Whatever I Want', duration: 25, category: 'Personal' },
    { time: '4:30 PM', activity: '👨‍👩‍👧‍👦 Family Time', duration: 60, category: 'Family' },
    { time: '5:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '5:35 PM', activity: '🍽️ Family Dinner', duration: 55, category: 'Family' },
    { time: '6:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '6:35 PM', activity: '🎮 Logan Time', duration: 30, category: 'Gaming' },
    { time: '7:05 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '7:10 PM', activity: '👨‍👧 Mia Time', duration: 50, category: 'Family' },
    { time: '8:00 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '8:05 PM', activity: '🎸 Music Practice', duration: 30, category: 'Music' },
    { time: '8:35 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '8:40 PM', activity: '💑 Aimee Time', duration: 50, category: 'Family' },
    { time: '9:30 PM', activity: '😴 Bedtime Routine', duration: 30, category: 'Evening' },
  ],
  Thursday: [
    { time: '5:45 AM', activity: '🥚 Egg, Inc', duration: 15, category: 'Personal' },
    { time: '6:00 AM', activity: '☕ Wake up + Coffee', duration: 30, category: 'Morning' },
    { time: '6:30 AM', activity: '🚿 Morning Routine', duration: 30, category: 'Morning' },
    { time: '7:00 AM', activity: '🐕 Feed Huskies', duration: 5, category: 'Morning' },
    { time: '7:05 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '7:10 AM', activity: '🍳 Breakfast + Email', duration: 50, category: 'Morning' },
    { time: '8:00 AM', activity: '🖨️ 3D Print Design Session', duration: 55, category: '3D Printing' },
    { time: '8:55 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '9:00 AM', activity: '🍔 Patty Shack Check-in', duration: 30, category: 'Patty Shack' },
    { time: '9:30 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '9:35 AM', activity: '💻 HEAVY DEV SPRINT', duration: 145, category: 'Development' },
    { time: '12:00 PM', activity: '🍽️ Lunch', duration: 30, category: 'Morning' },
    { time: '12:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '12:35 PM', activity: '🎯 Whatever I Want', duration: 40, category: 'Personal' },
    { time: '1:15 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '1:20 PM', activity: '💻 HEAVY DEV SPRINT 2', duration: 90, category: 'Development' },
    { time: '2:50 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '2:55 PM', activity: '📈 Business Development', duration: 35, category: 'Development' },
    { time: '3:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '3:35 PM', activity: '🎯 Whatever I Want', duration: 55, category: 'Personal' },
    { time: '4:30 PM', activity: '👨‍👩‍👧‍👦 Family Time', duration: 60, category: 'Family' },
    { time: '5:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '5:35 PM', activity: '🍽️ Family Dinner', duration: 55, category: 'Family' },
    { time: '6:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '6:35 PM', activity: '🎮 Logan Time', duration: 30, category: 'Gaming' },
    { time: '7:05 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '7:10 PM', activity: '🎤 Mia Voice Lessons', duration: 50, category: 'Family', special: true },
    { time: '8:00 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '8:05 PM', activity: '📚 Reading Time', duration: 30, category: 'Reading' },
    { time: '8:35 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '8:40 PM', activity: '💑 Aimee Time', duration: 50, category: 'Family' },
    { time: '9:30 PM', activity: '😴 Bedtime Routine', duration: 30, category: 'Evening' },
  ],
  Friday: [
    { time: '5:45 AM', activity: '🥚 Egg, Inc', duration: 15, category: 'Personal' },
    { time: '6:00 AM', activity: '☕ Wake up + Coffee', duration: 30, category: 'Morning' },
    { time: '6:30 AM', activity: '🚿 Morning Routine', duration: 30, category: 'Morning' },
    { time: '7:00 AM', activity: '🐕 Feed Huskies', duration: 5, category: 'Morning' },
    { time: '7:05 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '7:10 AM', activity: '🍳 Breakfast + Email', duration: 50, category: 'Morning' },
    { time: '8:00 AM', activity: '💻 Development Sprint', duration: 115, category: 'Development' },
    { time: '9:55 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '10:00 AM', activity: '🍔 Patty Shack Ops (Weekend Prep)', duration: 85, category: 'Patty Shack' },
    { time: '11:25 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '11:30 AM', activity: '📈 Business Development', duration: 30, category: 'Development' },
    { time: '12:00 PM', activity: '🍽️ Lunch', duration: 30, category: 'Morning' },
    { time: '12:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '12:35 PM', activity: '🎯 Whatever I Want', duration: 40, category: 'Personal' },
    { time: '1:15 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '1:20 PM', activity: '💻 Development Sprint 2', duration: 90, category: 'Development' },
    { time: '2:50 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '2:55 PM', activity: '🎯 Whatever I Want', duration: 55, category: 'Personal' },
    { time: '3:50 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '3:55 PM', activity: '🖨️ 3D Print Check', duration: 10, category: '3D Printing' },
    { time: '4:05 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '4:10 PM', activity: '🏠 Quick Chores', duration: 15, category: 'Chores' },
    { time: '4:25 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '4:30 PM', activity: '🎸 Music Practice', duration: 30, category: 'Music' },
    { time: '5:00 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '5:05 PM', activity: '🍕 PIZZA NIGHT!', duration: 85, category: 'Special', special: true },
    { time: '6:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '6:35 PM', activity: '🎮 Logan Time', duration: 30, category: 'Gaming' },
    { time: '7:05 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '7:10 PM', activity: '🎬 FAMILY MOVIE NIGHT!', duration: 140, category: 'Special', special: true },
    { time: '9:30 PM', activity: '😴 Bedtime Routine', duration: 30, category: 'Evening' },
  ],
  Saturday: [
    { time: '6:30 AM', activity: '🥚 Egg, Inc', duration: 15, category: 'Personal' },
    { time: '6:45 AM', activity: '☕ Wake up + Coffee', duration: 45, category: 'Morning' },
    { time: '7:30 AM', activity: '🚿 Morning Routine', duration: 30, category: 'Morning' },
    { time: '8:00 AM', activity: '🐕 Feed Huskies', duration: 5, category: 'Morning' },
    { time: '8:05 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '8:10 AM', activity: '🍳 Breakfast with Family', duration: 50, category: 'Family' },
    { time: '9:00 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '9:05 AM', activity: '🧹 DEEP CLEAN', duration: 45, category: 'Chores' },
    { time: '9:50 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '9:55 AM', activity: '🍔 Patty Shack Weekend Check', duration: 30, category: 'Patty Shack' },
    { time: '10:25 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '10:30 AM', activity: '💻 Vibe Coding (Fun Projects!)', duration: 90, category: 'Development', special: true },
    { time: '12:00 PM', activity: '🍽️ Lunch', duration: 30, category: 'Morning' },
    { time: '12:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '12:35 PM', activity: '🎯 Whatever I Want', duration: 55, category: 'Personal' },
    { time: '1:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '1:35 PM', activity: '📚 Reading Time', duration: 30, category: 'Reading' },
    { time: '2:05 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '2:10 PM', activity: '🖨️ 3D Printing Session', duration: 50, category: '3D Printing' },
    { time: '3:00 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '3:05 PM', activity: '🎯 Whatever I Want', duration: 55, category: 'Personal' },
    { time: '4:00 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '4:05 PM', activity: '👨‍👩‍👧‍👦 Family Activity', duration: 85, category: 'Family' },
    { time: '5:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '5:35 PM', activity: '🍽️ Family Dinner', duration: 55, category: 'Family' },
    { time: '6:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '6:35 PM', activity: '🎮 Logan Time', duration: 30, category: 'Gaming' },
    { time: '7:05 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '7:10 PM', activity: '👨‍👧 Mia Time', duration: 50, category: 'Family' },
    { time: '8:00 PM', activity: '💑 DATE NIGHT!', duration: 120, category: 'Special', special: true },
    { time: '10:00 PM', activity: '😴 Bedtime Routine', duration: 30, category: 'Evening' },
  ],
  Sunday: [
    { time: '7:00 AM', activity: '🥚 Egg, Inc', duration: 15, category: 'Personal' },
    { time: '7:15 AM', activity: '☕ Wake up + Coffee', duration: 45, category: 'Morning' },
    { time: '8:00 AM', activity: '🚿 Morning Routine', duration: 30, category: 'Morning' },
    { time: '8:30 AM', activity: '🐕 Feed Huskies', duration: 5, category: 'Morning' },
    { time: '8:35 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '8:40 AM', activity: '🍳 Breakfast with Family', duration: 50, category: 'Family' },
    { time: '9:30 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '9:35 AM', activity: '💻 Vibe Coding (Fun Projects!)', duration: 115, category: 'Development', special: true },
    { time: '11:30 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '11:35 AM', activity: '📋 Week Planning / Prep', duration: 25, category: 'Development' },
    { time: '12:00 PM', activity: '🍽️ Lunch', duration: 30, category: 'Morning' },
    { time: '12:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '12:35 PM', activity: '🎯 Whatever I Want (BIG!)', duration: 120, category: 'Personal', special: true },
    { time: '2:35 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '2:40 PM', activity: '👨‍👩‍👧‍👦 FAMILY TIME', duration: 140, category: 'Family', special: true },
    { time: '5:00 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '5:05 PM', activity: '🍽️ Family Dinner', duration: 85, category: 'Family' },
    { time: '6:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '6:35 PM', activity: '🎮 Logan Time', duration: 30, category: 'Gaming' },
    { time: '7:05 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '7:10 PM', activity: '👨‍👧 Mia Time', duration: 50, category: 'Family' },
    { time: '8:00 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '8:05 PM', activity: '📋 Prep for Week', duration: 25, category: 'Chores' },
    { time: '8:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { time: '8:35 PM', activity: '🌙 Relax / Wind-down', duration: 55, category: 'Evening' },
    { time: '9:30 PM', activity: '😴 Bedtime Routine', duration: 30, category: 'Evening' },
  ],
};

export default function JustinSchedule() {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [showTransitions, setShowTransitions] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const filteredSchedule = showTransitions 
    ? baseSchedule[selectedDay] 
    : baseSchedule[selectedDay].filter(item => item.category !== 'Transition');

  const calculateStats = () => {
    const stats = {};
    Object.keys(categories).forEach(cat => {
      if (cat !== 'Transition') {
        stats[cat] = { weekly: 0 };
      }
    });

    days.forEach(day => {
      baseSchedule[day].forEach(item => {
        if (item.category !== 'Transition' && stats[item.category]) {
          stats[item.category].weekly += item.duration;
        }
      });
    });

    return stats;
  };

  const stats = calculateStats();

  const getDayTotal = (day) => {
    return baseSchedule[day]
      .filter(item => item.category !== 'Transition')
      .reduce((sum, item) => sum + item.duration, 0);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const themeClasses = darkMode 
    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white'
    : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900';

  const cardClasses = darkMode 
    ? 'bg-slate-800/80 backdrop-blur border border-slate-700' 
    : 'bg-white/90 backdrop-blur shadow-lg border border-gray-200';

  const dayIndex = days.indexOf(selectedDay);

  return (
    <div className={`min-h-screen ${themeClasses} p-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`${cardClasses} rounded-2xl p-6 mb-4`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="w-7 h-7 text-blue-500" />
                Justin's Weekly Schedule
              </h1>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'} mt-1`}>
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Day Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDay(days[(dayIndex - 1 + 7) % 7])}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-200'} transition-colors`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex-1 flex gap-1 overflow-x-auto pb-2">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    selectedDay === day
                      ? 'bg-blue-600 text-white'
                      : darkMode 
                        ? 'bg-slate-700 hover:bg-slate-600' 
                        : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelectedDay(days[(dayIndex + 1) % 7])}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-200'} transition-colors`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Day Info */}
        <div className={`${cardClasses} rounded-2xl p-4 mb-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{selectedDay}</h2>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                {formatDuration(getDayTotal(selectedDay))} scheduled
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Show transitions
              </span>
              <input
                type="checkbox"
                checked={showTransitions}
                onChange={(e) => setShowTransitions(e.target.checked)}
                className="w-4 h-4 rounded"
              />
            </label>
          </div>
        </div>

        {/* Schedule */}
        <div className={`${cardClasses} rounded-2xl p-4 mb-4`}>
          <div className="space-y-2">
            {filteredSchedule.map((item, index) => {
              const catInfo = categories[item.category] || categories['Personal'];
              const Icon = catInfo.icon;
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    item.special 
                      ? darkMode 
                        ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-600/50' 
                        : 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300'
                      : darkMode 
                        ? 'bg-slate-700/50 hover:bg-slate-700' 
                        : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg ${catInfo.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {item.activity}
                      </span>
                      {item.special && <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                      {item.time} • {formatDuration(item.duration)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Stats */}
        <div className={`${cardClasses} rounded-2xl p-4`}>
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Weekly Totals
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(stats)
              .filter(([_, data]) => data.weekly > 0)
              .sort((a, b) => b[1].weekly - a[1].weekly)
              .map(([category, data]) => {
                const catInfo = categories[category];
                return (
                  <div
                    key={category}
                    className={`p-3 rounded-lg ${darkMode ? 'bg-slate-700/50' : 'bg-gray-100'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-3 h-3 rounded ${catInfo.color}`} />
                      <span className="text-sm font-medium truncate">{category}</span>
                    </div>
                    <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatDuration(data.weekly)}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Special Events Legend */}
        <div className={`${cardClasses} rounded-2xl p-4 mt-4`}>
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Weekly Highlights
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span>🍕</span>
              <span>Friday Pizza Night</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🎬</span>
              <span>Friday Movie Night</span>
            </div>
            <div className="flex items-center gap-2">
              <span>💑</span>
              <span>Saturday Date Night</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🎤</span>
              <span>Thursday Mia Voice Lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <span>💻</span>
              <span>Weekend Vibe Coding</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🎯</span>
              <span>Wednesday BONUS Whatever Block</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
