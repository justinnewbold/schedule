import { scheduleApi } from "./supabase";
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock, Coffee, Briefcase, Home, Gamepad2, Music, BookOpen, Heart, Printer, Moon, Sun, Star, Calendar, CheckCircle2, GripVertical, Save, RotateCcw, Edit2, Check, X, Cloud, CloudOff, Loader2, Plus, Trash2, Play } from 'lucide-react';

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

const categoryList = Object.keys(categories).filter(c => c !== 'Transition');

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const initialSchedule = {
  Monday: [
    { id: 'mon-1', time: '5:45 AM', activity: '🥚 Egg, Inc', duration: 15, category: 'Personal' },
    { id: 'mon-2', time: '6:00 AM', activity: '☕ Wake up + Coffee', duration: 30, category: 'Morning' },
    { id: 'mon-3', time: '6:30 AM', activity: '🚿 Morning Routine', duration: 30, category: 'Morning' },
    { id: 'mon-4', time: '7:00 AM', activity: '🐕 Feed Huskies', duration: 5, category: 'Morning' },
    { id: 'mon-5', time: '7:05 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'mon-6', time: '7:10 AM', activity: '🍳 Breakfast + Email', duration: 50, category: 'Morning' },
    { id: 'mon-7', time: '8:00 AM', activity: '💻 Development Sprint', duration: 115, category: 'Development' },
    { id: 'mon-8', time: '9:55 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'mon-9', time: '10:00 AM', activity: '🍔 Patty Shack Ops', duration: 85, category: 'Patty Shack' },
    { id: 'mon-10', time: '11:25 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'mon-11', time: '11:30 AM', activity: '📈 Business Development', duration: 30, category: 'Development' },
    { id: 'mon-12', time: '12:00 PM', activity: '🍽️ Lunch', duration: 30, category: 'Morning' },
    { id: 'mon-13', time: '12:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'mon-14', time: '12:35 PM', activity: '🎯 Whatever I Want', duration: 40, category: 'Personal' },
    { id: 'mon-15', time: '1:15 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'mon-16', time: '1:20 PM', activity: '💻 Development Sprint 2', duration: 90, category: 'Development' },
    { id: 'mon-17', time: '2:50 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'mon-18', time: '2:55 PM', activity: '🎯 Whatever I Want', duration: 55, category: 'Personal' },
    { id: 'mon-19', time: '3:50 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'mon-20', time: '3:55 PM', activity: '🖨️ 3D Print Check', duration: 10, category: '3D Printing' },
    { id: 'mon-21', time: '4:05 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'mon-22', time: '4:10 PM', activity: '🏠 Quick Chores', duration: 15, category: 'Chores' },
    { id: 'mon-23', time: '4:25 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'mon-24', time: '4:30 PM', activity: '👨‍👩‍👧‍👦 Family Time', duration: 60, category: 'Family' },
    { id: 'mon-25', time: '5:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'mon-26', time: '5:35 PM', activity: '🍽️ Family Dinner', duration: 55, category: 'Family' },
    { id: 'mon-27', time: '6:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'mon-28', time: '6:35 PM', activity: '🎮 Logan Time', duration: 30, category: 'Gaming' },
    { id: 'mon-29', time: '7:05 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'mon-30', time: '7:10 PM', activity: '👨‍👧 Mia Time', duration: 50, category: 'Family' },
    { id: 'mon-31', time: '8:00 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'mon-32', time: '8:05 PM', activity: '🎸 Music Practice', duration: 30, category: 'Music' },
    { id: 'mon-33', time: '8:35 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'mon-34', time: '8:40 PM', activity: '💑 Aimee Time', duration: 50, category: 'Family' },
    { id: 'mon-35', time: '9:30 PM', activity: '😴 Bedtime Routine', duration: 30, category: 'Evening' },
  ],
  Tuesday: [
    { id: 'tue-1', time: '5:45 AM', activity: '🥚 Egg, Inc', duration: 15, category: 'Personal' },
    { id: 'tue-2', time: '6:00 AM', activity: '☕ Wake up + Coffee', duration: 30, category: 'Morning' },
    { id: 'tue-3', time: '6:30 AM', activity: '🚿 Morning Routine', duration: 30, category: 'Morning' },
    { id: 'tue-4', time: '7:00 AM', activity: '🐕 Feed Huskies', duration: 5, category: 'Morning' },
    { id: 'tue-5', time: '7:05 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'tue-6', time: '7:10 AM', activity: '🍳 Breakfast + Email', duration: 50, category: 'Morning' },
    { id: 'tue-7', time: '8:00 AM', activity: '🖨️ 3D Print Design Session', duration: 55, category: '3D Printing' },
    { id: 'tue-8', time: '8:55 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'tue-9', time: '9:00 AM', activity: '🍔 Patty Shack Check-in', duration: 30, category: 'Patty Shack' },
    { id: 'tue-10', time: '9:30 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'tue-11', time: '9:35 AM', activity: '💻 HEAVY DEV SPRINT', duration: 145, category: 'Development' },
    { id: 'tue-12', time: '12:00 PM', activity: '🍽️ Lunch', duration: 30, category: 'Morning' },
    { id: 'tue-13', time: '12:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'tue-14', time: '12:35 PM', activity: '🎯 Whatever I Want', duration: 40, category: 'Personal' },
    { id: 'tue-15', time: '1:15 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'tue-16', time: '1:20 PM', activity: '💻 HEAVY DEV SPRINT 2', duration: 90, category: 'Development' },
    { id: 'tue-17', time: '2:50 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'tue-18', time: '2:55 PM', activity: '📈 Business Development', duration: 35, category: 'Development' },
    { id: 'tue-19', time: '3:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'tue-20', time: '3:35 PM', activity: '🎯 Whatever I Want', duration: 55, category: 'Personal' },
    { id: 'tue-21', time: '4:30 PM', activity: '👨‍👩‍👧‍👦 Family Time', duration: 60, category: 'Family' },
    { id: 'tue-22', time: '5:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'tue-23', time: '5:35 PM', activity: '🍽️ Family Dinner', duration: 55, category: 'Family' },
    { id: 'tue-24', time: '6:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'tue-25', time: '6:35 PM', activity: '🎮 Logan Time', duration: 30, category: 'Gaming' },
    { id: 'tue-26', time: '7:05 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'tue-27', time: '7:10 PM', activity: '👨‍👧 Mia Time', duration: 50, category: 'Family' },
    { id: 'tue-28', time: '8:00 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'tue-29', time: '8:05 PM', activity: '📚 Reading Time', duration: 30, category: 'Reading' },
    { id: 'tue-30', time: '8:35 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'tue-31', time: '8:40 PM', activity: '💑 Aimee Time', duration: 50, category: 'Family' },
    { id: 'tue-32', time: '9:30 PM', activity: '😴 Bedtime Routine', duration: 30, category: 'Evening' },
  ],
  Wednesday: [
    { id: 'wed-1', time: '5:45 AM', activity: '🥚 Egg, Inc', duration: 15, category: 'Personal' },
    { id: 'wed-2', time: '6:00 AM', activity: '☕ Wake up + Coffee', duration: 30, category: 'Morning' },
    { id: 'wed-3', time: '6:30 AM', activity: '🚿 Morning Routine', duration: 30, category: 'Morning' },
    { id: 'wed-4', time: '7:00 AM', activity: '🐕 Feed Huskies', duration: 5, category: 'Morning' },
    { id: 'wed-5', time: '7:05 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'wed-6', time: '7:10 AM', activity: '🍳 Breakfast + Email', duration: 50, category: 'Morning' },
    { id: 'wed-7', time: '8:00 AM', activity: '💻 Development Sprint', duration: 60, category: 'Development' },
    { id: 'wed-8', time: '9:00 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'wed-9', time: '9:05 AM', activity: '🍔 Patty Shack Midweek Check', duration: 55, category: 'Patty Shack' },
    { id: 'wed-10', time: '10:00 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'wed-11', time: '10:05 AM', activity: '💻 Development Sprint 2', duration: 115, category: 'Development' },
    { id: 'wed-12', time: '12:00 PM', activity: '🍽️ Lunch', duration: 30, category: 'Morning' },
    { id: 'wed-13', time: '12:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'wed-14', time: '12:35 PM', activity: '🎯 BONUS Whatever I Want!', duration: 120, category: 'Personal', special: true },
    { id: 'wed-15', time: '2:35 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'wed-16', time: '2:40 PM', activity: '📈 Business Development', duration: 45, category: 'Development' },
    { id: 'wed-17', time: '3:25 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'wed-18', time: '3:30 PM', activity: '🖨️ 3D Print Check', duration: 10, category: '3D Printing' },
    { id: 'wed-19', time: '3:40 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'wed-20', time: '3:45 PM', activity: '🏠 Quick Chores', duration: 15, category: 'Chores' },
    { id: 'wed-21', time: '4:00 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'wed-22', time: '4:05 PM', activity: '🎯 Whatever I Want', duration: 25, category: 'Personal' },
    { id: 'wed-23', time: '4:30 PM', activity: '👨‍👩‍👧‍👦 Family Time', duration: 60, category: 'Family' },
    { id: 'wed-24', time: '5:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'wed-25', time: '5:35 PM', activity: '🍽️ Family Dinner', duration: 55, category: 'Family' },
    { id: 'wed-26', time: '6:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'wed-27', time: '6:35 PM', activity: '🎮 Logan Time', duration: 30, category: 'Gaming' },
    { id: 'wed-28', time: '7:05 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'wed-29', time: '7:10 PM', activity: '👨‍👧 Mia Time', duration: 50, category: 'Family' },
    { id: 'wed-30', time: '8:00 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'wed-31', time: '8:05 PM', activity: '🎸 Music Practice', duration: 30, category: 'Music' },
    { id: 'wed-32', time: '8:35 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'wed-33', time: '8:40 PM', activity: '💑 Aimee Time', duration: 50, category: 'Family' },
    { id: 'wed-34', time: '9:30 PM', activity: '😴 Bedtime Routine', duration: 30, category: 'Evening' },
  ],
  Thursday: [
    { id: 'thu-1', time: '5:45 AM', activity: '🥚 Egg, Inc', duration: 15, category: 'Personal' },
    { id: 'thu-2', time: '6:00 AM', activity: '☕ Wake up + Coffee', duration: 30, category: 'Morning' },
    { id: 'thu-3', time: '6:30 AM', activity: '🚿 Morning Routine', duration: 30, category: 'Morning' },
    { id: 'thu-4', time: '7:00 AM', activity: '🐕 Feed Huskies', duration: 5, category: 'Morning' },
    { id: 'thu-5', time: '7:05 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'thu-6', time: '7:10 AM', activity: '🍳 Breakfast + Email', duration: 50, category: 'Morning' },
    { id: 'thu-7', time: '8:00 AM', activity: '🖨️ 3D Print Design Session', duration: 55, category: '3D Printing' },
    { id: 'thu-8', time: '8:55 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'thu-9', time: '9:00 AM', activity: '🍔 Patty Shack Check-in', duration: 30, category: 'Patty Shack' },
    { id: 'thu-10', time: '9:30 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'thu-11', time: '9:35 AM', activity: '💻 HEAVY DEV SPRINT', duration: 145, category: 'Development' },
    { id: 'thu-12', time: '12:00 PM', activity: '🍽️ Lunch', duration: 30, category: 'Morning' },
    { id: 'thu-13', time: '12:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'thu-14', time: '12:35 PM', activity: '🎯 Whatever I Want', duration: 40, category: 'Personal' },
    { id: 'thu-15', time: '1:15 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'thu-16', time: '1:20 PM', activity: '💻 HEAVY DEV SPRINT 2', duration: 90, category: 'Development' },
    { id: 'thu-17', time: '2:50 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'thu-18', time: '2:55 PM', activity: '📈 Business Development', duration: 35, category: 'Development' },
    { id: 'thu-19', time: '3:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'thu-20', time: '3:35 PM', activity: '🎯 Whatever I Want', duration: 55, category: 'Personal' },
    { id: 'thu-21', time: '4:30 PM', activity: '👨‍👩‍👧‍👦 Family Time', duration: 60, category: 'Family' },
    { id: 'thu-22', time: '5:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'thu-23', time: '5:35 PM', activity: '🍽️ Family Dinner', duration: 55, category: 'Family' },
    { id: 'thu-24', time: '6:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'thu-25', time: '6:35 PM', activity: '🎮 Logan Time', duration: 30, category: 'Gaming' },
    { id: 'thu-26', time: '7:05 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'thu-27', time: '7:10 PM', activity: '🎤 Mia Voice Lessons', duration: 50, category: 'Family', special: true },
    { id: 'thu-28', time: '8:00 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'thu-29', time: '8:05 PM', activity: '📚 Reading Time', duration: 30, category: 'Reading' },
    { id: 'thu-30', time: '8:35 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'thu-31', time: '8:40 PM', activity: '💑 Aimee Time', duration: 50, category: 'Family' },
    { id: 'thu-32', time: '9:30 PM', activity: '😴 Bedtime Routine', duration: 30, category: 'Evening' },
  ],
  Friday: [
    { id: 'fri-1', time: '5:45 AM', activity: '🥚 Egg, Inc', duration: 15, category: 'Personal' },
    { id: 'fri-2', time: '6:00 AM', activity: '☕ Wake up + Coffee', duration: 30, category: 'Morning' },
    { id: 'fri-3', time: '6:30 AM', activity: '🚿 Morning Routine', duration: 30, category: 'Morning' },
    { id: 'fri-4', time: '7:00 AM', activity: '🐕 Feed Huskies', duration: 5, category: 'Morning' },
    { id: 'fri-5', time: '7:05 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'fri-6', time: '7:10 AM', activity: '🍳 Breakfast + Email', duration: 50, category: 'Morning' },
    { id: 'fri-7', time: '8:00 AM', activity: '💻 Development Sprint', duration: 115, category: 'Development' },
    { id: 'fri-8', time: '9:55 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'fri-9', time: '10:00 AM', activity: '🍔 Patty Shack Ops (Weekend Prep)', duration: 85, category: 'Patty Shack' },
    { id: 'fri-10', time: '11:25 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'fri-11', time: '11:30 AM', activity: '📈 Business Development', duration: 30, category: 'Development' },
    { id: 'fri-12', time: '12:00 PM', activity: '🍽️ Lunch', duration: 30, category: 'Morning' },
    { id: 'fri-13', time: '12:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'fri-14', time: '12:35 PM', activity: '🎯 Whatever I Want', duration: 40, category: 'Personal' },
    { id: 'fri-15', time: '1:15 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'fri-16', time: '1:20 PM', activity: '💻 Development Sprint 2', duration: 90, category: 'Development' },
    { id: 'fri-17', time: '2:50 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'fri-18', time: '2:55 PM', activity: '🎯 Whatever I Want', duration: 55, category: 'Personal' },
    { id: 'fri-19', time: '3:50 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'fri-20', time: '3:55 PM', activity: '🖨️ 3D Print Check', duration: 10, category: '3D Printing' },
    { id: 'fri-21', time: '4:05 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'fri-22', time: '4:10 PM', activity: '🏠 Quick Chores', duration: 15, category: 'Chores' },
    { id: 'fri-23', time: '4:25 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'fri-24', time: '4:30 PM', activity: '🎸 Music Practice', duration: 30, category: 'Music' },
    { id: 'fri-25', time: '5:00 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'fri-26', time: '5:05 PM', activity: '🍕 PIZZA NIGHT!', duration: 85, category: 'Special', special: true },
    { id: 'fri-27', time: '6:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'fri-28', time: '6:35 PM', activity: '🎮 Logan Time', duration: 30, category: 'Gaming' },
    { id: 'fri-29', time: '7:05 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'fri-30', time: '7:10 PM', activity: '🎬 FAMILY MOVIE NIGHT!', duration: 140, category: 'Special', special: true },
    { id: 'fri-31', time: '9:30 PM', activity: '😴 Bedtime Routine', duration: 30, category: 'Evening' },
  ],
  Saturday: [
    { id: 'sat-1', time: '6:30 AM', activity: '🥚 Egg, Inc', duration: 15, category: 'Personal' },
    { id: 'sat-2', time: '6:45 AM', activity: '☕ Wake up + Coffee', duration: 45, category: 'Morning' },
    { id: 'sat-3', time: '7:30 AM', activity: '🚿 Morning Routine', duration: 30, category: 'Morning' },
    { id: 'sat-4', time: '8:00 AM', activity: '🐕 Feed Huskies', duration: 5, category: 'Morning' },
    { id: 'sat-5', time: '8:05 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'sat-6', time: '8:10 AM', activity: '🍳 Breakfast with Family', duration: 50, category: 'Family' },
    { id: 'sat-7', time: '9:00 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'sat-8', time: '9:05 AM', activity: '🧹 DEEP CLEAN', duration: 45, category: 'Chores' },
    { id: 'sat-9', time: '9:50 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'sat-10', time: '9:55 AM', activity: '🍔 Patty Shack Weekend Check', duration: 30, category: 'Patty Shack' },
    { id: 'sat-11', time: '10:25 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'sat-12', time: '10:30 AM', activity: '💻 Vibe Coding (Fun Projects!)', duration: 90, category: 'Development', special: true },
    { id: 'sat-13', time: '12:00 PM', activity: '🍽️ Lunch', duration: 30, category: 'Morning' },
    { id: 'sat-14', time: '12:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'sat-15', time: '12:35 PM', activity: '🎯 Whatever I Want', duration: 55, category: 'Personal' },
    { id: 'sat-16', time: '1:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'sat-17', time: '1:35 PM', activity: '📚 Reading Time', duration: 30, category: 'Reading' },
    { id: 'sat-18', time: '2:05 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'sat-19', time: '2:10 PM', activity: '🖨️ 3D Printing Session', duration: 50, category: '3D Printing' },
    { id: 'sat-20', time: '3:00 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'sat-21', time: '3:05 PM', activity: '🎯 Whatever I Want', duration: 55, category: 'Personal' },
    { id: 'sat-22', time: '4:00 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'sat-23', time: '4:05 PM', activity: '👨‍👩‍👧‍👦 Family Activity', duration: 85, category: 'Family' },
    { id: 'sat-24', time: '5:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'sat-25', time: '5:35 PM', activity: '🍽️ Family Dinner', duration: 55, category: 'Family' },
    { id: 'sat-26', time: '6:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'sat-27', time: '6:35 PM', activity: '🎮 Logan Time', duration: 30, category: 'Gaming' },
    { id: 'sat-28', time: '7:05 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'sat-29', time: '7:10 PM', activity: '👨‍👧 Mia Time', duration: 50, category: 'Family' },
    { id: 'sat-30', time: '8:00 PM', activity: '💑 DATE NIGHT!', duration: 120, category: 'Special', special: true },
    { id: 'sat-31', time: '10:00 PM', activity: '😴 Bedtime Routine', duration: 30, category: 'Evening' },
  ],
  Sunday: [
    { id: 'sun-1', time: '7:00 AM', activity: '🥚 Egg, Inc', duration: 15, category: 'Personal' },
    { id: 'sun-2', time: '7:15 AM', activity: '☕ Wake up + Coffee', duration: 45, category: 'Morning' },
    { id: 'sun-3', time: '8:00 AM', activity: '🚿 Morning Routine', duration: 30, category: 'Morning' },
    { id: 'sun-4', time: '8:30 AM', activity: '🐕 Feed Huskies', duration: 5, category: 'Morning' },
    { id: 'sun-5', time: '8:35 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'sun-6', time: '8:40 AM', activity: '🍳 Breakfast with Family', duration: 50, category: 'Family' },
    { id: 'sun-7', time: '9:30 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'sun-8', time: '9:35 AM', activity: '💻 Vibe Coding (Fun Projects!)', duration: 115, category: 'Development', special: true },
    { id: 'sun-9', time: '11:30 AM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'sun-10', time: '11:35 AM', activity: '📋 Week Planning / Prep', duration: 25, category: 'Development' },
    { id: 'sun-11', time: '12:00 PM', activity: '🍽️ Lunch', duration: 30, category: 'Morning' },
    { id: 'sun-12', time: '12:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'sun-13', time: '12:35 PM', activity: '🎯 Whatever I Want (BIG!)', duration: 120, category: 'Personal', special: true },
    { id: 'sun-14', time: '2:35 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'sun-15', time: '2:40 PM', activity: '👨‍👩‍👧‍👦 FAMILY TIME', duration: 140, category: 'Family', special: true },
    { id: 'sun-16', time: '5:00 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'sun-17', time: '5:05 PM', activity: '🍽️ Family Dinner', duration: 85, category: 'Family' },
    { id: 'sun-18', time: '6:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'sun-19', time: '6:35 PM', activity: '🎮 Logan Time', duration: 30, category: 'Gaming' },
    { id: 'sun-20', time: '7:05 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'sun-21', time: '7:10 PM', activity: '👨‍👧 Mia Time', duration: 50, category: 'Family' },
    { id: 'sun-22', time: '8:00 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'sun-23', time: '8:05 PM', activity: '📋 Prep for Week', duration: 25, category: 'Chores' },
    { id: 'sun-24', time: '8:30 PM', activity: '⏳ Transition', duration: 5, category: 'Transition' },
    { id: 'sun-25', time: '8:35 PM', activity: '🌙 Relax / Wind-down', duration: 55, category: 'Evening' },
    { id: 'sun-26', time: '9:30 PM', activity: '😴 Bedtime Routine', duration: 30, category: 'Evening' },
  ],
};

// Helper to parse time string to minutes since midnight
const parseTime = (timeStr) => {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

// Helper to format minutes since midnight to time string
const formatTime = (totalMinutes) => {
  let hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  if (hours === 0) hours = 12;
  else if (hours > 12) hours -= 12;
  return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Helper to recalculate times after reorder
const recalculateTimes = (items, startTime = '5:45 AM') => {
  let currentMinutes = parseTime(startTime);
  return items.map(item => {
    const newItem = { ...item, time: formatTime(currentMinutes) };
    currentMinutes += item.duration;
    return newItem;
  });
};

// Duration preset options
const durationPresets = [5, 10, 15, 30, 45, 60, 90, 120];

// Day start times
const dayStartTimes = {
  Monday: '5:45 AM',
  Tuesday: '5:45 AM',
  Wednesday: '5:45 AM',
  Thursday: '5:45 AM',
  Friday: '5:45 AM',
  Saturday: '6:30 AM',
  Sunday: '7:00 AM',
};

export default function JustinSchedule() {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [showTransitions, setShowTransitions] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [schedule, setSchedule] = useState(initialSchedule);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');
  
  // Edit state
  const [editingItem, setEditingItem] = useState(null);
  const [editValues, setEditValues] = useState({ activity: '', duration: 0, time: '' });
  
  // Add new item state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ activity: '', duration: 30, category: 'Personal' });
  
  // Drag state
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragNode = useRef(null);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Load saved schedule from Supabase (with localStorage fallback)
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
          if (saved) {
            setSchedule(JSON.parse(saved));
          }
          setSyncStatus('idle');
        }
      } catch (e) {
        console.error('Failed to load from cloud, using localStorage:', e);
        const saved = localStorage.getItem('justinSchedule');
        if (saved) {
          try {
            setSchedule(JSON.parse(saved));
          } catch (e2) {
            console.error('Failed to load schedule');
          }
        }
        setSyncStatus('error');
      }
      
      setIsSyncing(false);
    };
    
    loadSchedule();
  }, []);

  // Get current activity based on time
  const getCurrentActivity = () => {
    const now = currentTime;
    const dayName = days[now.getDay() === 0 ? 6 : now.getDay() - 1]; // Adjust for Sunday = 0
    const todaySchedule = schedule[dayName];
    
    if (!todaySchedule) return null;
    
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    for (let i = 0; i < todaySchedule.length; i++) {
      const item = todaySchedule[i];
      const itemStart = parseTime(item.time);
      const itemEnd = itemStart + item.duration;
      
      if (currentMinutes >= itemStart && currentMinutes < itemEnd) {
        const minutesRemaining = itemEnd - currentMinutes;
        const nextItem = todaySchedule[i + 1] || null;
        return { 
          current: item, 
          minutesRemaining, 
          next: nextItem,
          dayName,
          isToday: dayName === days[now.getDay() === 0 ? 6 : now.getDay() - 1]
        };
      }
    }
    
    return null;
  };

  const currentActivity = getCurrentActivity();

  const saveSchedule = async () => {
    setIsSyncing(true);
    setSyncStatus('syncing');
    
    localStorage.setItem('justinSchedule', JSON.stringify(schedule));
    
    try {
      const success = await scheduleApi.save(schedule, 'justin');
      if (success) {
        setSyncStatus('synced');
        setHasChanges(false);
      } else {
        setSyncStatus('error');
      }
    } catch (e) {
      console.error('Failed to save to cloud:', e);
      setSyncStatus('error');
    }
    
    setIsSyncing(false);
  };

  const resetSchedule = async () => {
    if (confirm('Reset schedule to default? This cannot be undone.')) {
      setSchedule(initialSchedule);
      localStorage.removeItem('justinSchedule');
      setHasChanges(false);
      
      setIsSyncing(true);
      try {
        await scheduleApi.delete('justin');
        setSyncStatus('idle');
      } catch (e) {
        console.error('Failed to delete from cloud:', e);
      }
      setIsSyncing(false);
    }
  };

  // Start editing an item
  const startEdit = (item) => {
    setEditingItem(item.id);
    setEditValues({
      activity: item.activity,
      duration: item.duration,
      time: item.time
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingItem(null);
    setEditValues({ activity: '', duration: 0, time: '' });
  };

  // Save edit
  const saveEdit = (itemId) => {
    const updatedSchedule = { ...schedule };
    const dayItems = [...updatedSchedule[selectedDay]];
    const itemIndex = dayItems.findIndex(i => i.id === itemId);
    
    if (itemIndex !== -1) {
      dayItems[itemIndex] = {
        ...dayItems[itemIndex],
        activity: editValues.activity,
        duration: editValues.duration,
        time: editValues.time
      };
      
      updatedSchedule[selectedDay] = recalculateTimes(dayItems, dayStartTimes[selectedDay]);
      setSchedule(updatedSchedule);
      setHasChanges(true);
    }
    
    setEditingItem(null);
    setEditValues({ activity: '', duration: 0, time: '' });
  };

  // Delete an item
  const deleteItem = (itemId) => {
    if (confirm('Delete this activity?')) {
      const updatedSchedule = { ...schedule };
      const dayItems = updatedSchedule[selectedDay].filter(i => i.id !== itemId);
      updatedSchedule[selectedDay] = recalculateTimes(dayItems, dayStartTimes[selectedDay]);
      setSchedule(updatedSchedule);
      setHasChanges(true);
    }
  };

  // Add new item
  const addNewItem = () => {
    if (!newItem.activity.trim()) {
      alert('Please enter an activity name');
      return;
    }
    
    const updatedSchedule = { ...schedule };
    const dayItems = [...updatedSchedule[selectedDay]];
    
    // Generate unique ID
    const dayPrefix = selectedDay.slice(0, 3).toLowerCase();
    const maxId = dayItems.reduce((max, item) => {
      const match = item.id.match(new RegExp(`${dayPrefix}-(\\d+)`));
      return match ? Math.max(max, parseInt(match[1])) : max;
    }, 0);
    
    const newActivity = {
      id: `${dayPrefix}-${maxId + 1}`,
      time: '', // Will be calculated
      activity: newItem.activity,
      duration: newItem.duration,
      category: newItem.category,
    };
    
    dayItems.push(newActivity);
    updatedSchedule[selectedDay] = recalculateTimes(dayItems, dayStartTimes[selectedDay]);
    setSchedule(updatedSchedule);
    setHasChanges(true);
    setShowAddForm(false);
    setNewItem({ activity: '', duration: 30, category: 'Personal' });
  };

  // Get display items
  const getDisplayItems = () => {
    const items = schedule[selectedDay];
    return showTransitions ? items : items.filter(item => item.category !== 'Transition');
  };

  // Drag handlers
  const handleDragStart = (e, index) => {
    const items = getDisplayItems();
    const item = items[index];
    
    if (item.category === 'Transition' || editingItem) return;
    
    setDraggedItem({ index, item });
    dragNode.current = e.target;
    dragNode.current.addEventListener('dragend', handleDragEnd);
    
    setTimeout(() => {
      e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = () => {
    if (dragNode.current) {
      dragNode.current.style.opacity = '1';
      dragNode.current.removeEventListener('dragend', handleDragEnd);
    }
    setDraggedItem(null);
    setDragOverIndex(null);
    dragNode.current = null;
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    const items = getDisplayItems();
    
    if (items[index].category === 'Transition') return;
    
    if (draggedItem && draggedItem.index !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.index === dropIndex) {
      setDragOverIndex(null);
      return;
    }

    const displayItems = getDisplayItems();
    const fullItems = [...schedule[selectedDay]];
    
    const draggedFullIndex = fullItems.findIndex(i => i.id === displayItems[draggedItem.index].id);
    const dropFullIndex = fullItems.findIndex(i => i.id === displayItems[dropIndex].id);
    
    const [removed] = fullItems.splice(draggedFullIndex, 1);
    const adjustedDropIndex = draggedFullIndex < dropFullIndex ? dropFullIndex - 1 : dropFullIndex;
    fullItems.splice(adjustedDropIndex + 1, 0, removed);
    
    const updatedItems = recalculateTimes(fullItems, dayStartTimes[selectedDay]);
    
    setSchedule(prev => ({
      ...prev,
      [selectedDay]: updatedItems
    }));
    
    setHasChanges(true);
    setDragOverIndex(null);
  };

  const filteredSchedule = getDisplayItems();

  const calculateStats = () => {
    const stats = {};
    Object.keys(categories).forEach(cat => {
      if (cat !== 'Transition') {
        stats[cat] = { weekly: 0 };
      }
    });

    days.forEach(day => {
      schedule[day].forEach(item => {
        if (item.category !== 'Transition' && stats[item.category]) {
          stats[item.category].weekly += item.duration;
        }
      });
    });

    return stats;
  };

  const stats = calculateStats();

  const getDayTotal = (day) => {
    return schedule[day]
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

  // Check if an item is the current activity
  const isCurrentActivity = (item) => {
    if (!currentActivity) return false;
    const todayName = days[currentTime.getDay() === 0 ? 6 : currentTime.getDay() - 1];
    return selectedDay === todayName && currentActivity.current?.id === item.id;
  };

  const themeClasses = darkMode 
    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white'
    : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900';

  const cardClasses = darkMode 
    ? 'bg-slate-800/80 backdrop-blur border border-slate-700' 
    : 'bg-white/90 backdrop-blur shadow-lg border border-gray-200';

  const inputClasses = darkMode
    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400';

  const dayIndex = days.indexOf(selectedDay);

  return (
    <div className={`min-h-screen ${themeClasses} p-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Current Activity Banner */}
        {currentActivity && currentActivity.current && (
          <div className={`${darkMode ? 'bg-gradient-to-r from-green-900/80 to-emerald-900/80 border-green-600' : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-400'} border rounded-2xl p-4 mb-4`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${categories[currentActivity.current.category]?.color || 'bg-green-500'} flex items-center justify-center animate-pulse`}>
                <Play className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className={`text-xs font-medium ${darkMode ? 'text-green-400' : 'text-green-700'} uppercase tracking-wide`}>
                  NOW: {currentActivity.minutesRemaining}m remaining
                </p>
                <p className="text-lg font-bold">{currentActivity.current.activity}</p>
                {currentActivity.next && (
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    Up next: {currentActivity.next.activity}
                  </p>
                )}
              </div>
              <div className={`text-right ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                <p className="text-sm">{currentActivity.current.time}</p>
                <p className="text-xs">{formatDuration(currentActivity.current.duration)}</p>
              </div>
            </div>
          </div>
        )}

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
            <div className="flex items-center gap-2">
              {/* Sync Status Indicator */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                syncStatus === 'synced' 
                  ? darkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700'
                  : syncStatus === 'syncing'
                    ? darkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700'
                    : syncStatus === 'error'
                      ? darkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-700'
                      : darkMode ? 'bg-slate-700 text-slate-400' : 'bg-gray-200 text-gray-500'
              }`}>
                {isSyncing ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : syncStatus === 'synced' ? (
                  <Cloud className="w-3 h-3" />
                ) : syncStatus === 'error' ? (
                  <CloudOff className="w-3 h-3" />
                ) : (
                  <Cloud className="w-3 h-3" />
                )}
                <span>{
                  isSyncing ? 'Syncing...' 
                  : syncStatus === 'synced' ? 'Synced' 
                  : syncStatus === 'error' ? 'Offline' 
                  : 'Local'
                }</span>
              </div>
              
              {hasChanges && (
                <>
                  <button
                    onClick={saveSchedule}
                    disabled={isSyncing}
                    className="p-2 rounded-lg bg-green-600 hover:bg-green-500 disabled:bg-green-800 disabled:cursor-not-allowed text-white transition-colors flex items-center gap-1"
                    title="Save changes"
                  >
                    {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={resetSchedule}
                    disabled={isSyncing}
                    className="p-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:bg-red-800 disabled:cursor-not-allowed text-white transition-colors flex items-center gap-1"
                    title="Reset to default"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
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
              {days.map((day) => {
                const isToday = day === days[currentTime.getDay() === 0 ? 6 : currentTime.getDay() - 1];
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap relative ${
                      selectedDay === day
                        ? 'bg-blue-600 text-white'
                        : darkMode 
                          ? 'bg-slate-700 hover:bg-slate-600' 
                          : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {day.slice(0, 3)}
                    {isToday && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                    )}
                  </button>
                );
              })}
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
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-xl font-bold">{selectedDay}</h2>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                {formatDuration(getDayTotal(selectedDay))} scheduled
                {hasChanges && <span className="ml-2 text-yellow-500">• Unsaved changes</span>}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 ${
                  showAddForm 
                    ? 'bg-blue-600 text-white' 
                    : darkMode 
                      ? 'bg-slate-700 hover:bg-slate-600' 
                      : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <Plus className="w-4 h-4" />
                Add Activity
              </button>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  Transitions
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
        </div>

        {/* Add New Activity Form */}
        {showAddForm && (
          <div className={`${cardClasses} rounded-2xl p-4 mb-4`}>
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-500" />
              Add New Activity
            </h3>
            <div className="space-y-3">
              <div>
                <label className={`block text-xs mb-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Activity Name</label>
                <input
                  type="text"
                  value={newItem.activity}
                  onChange={(e) => setNewItem({ ...newItem, activity: e.target.value })}
                  placeholder="e.g., 🎯 New Task"
                  className={`w-full px-3 py-2 rounded-lg border ${inputClasses}`}
                />
              </div>
              <div>
                <label className={`block text-xs mb-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Duration</label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {durationPresets.map((d) => (
                    <button
                      key={d}
                      onClick={() => setNewItem({ ...newItem, duration: d })}
                      className={`px-2 py-1 rounded text-xs ${
                        newItem.duration === d 
                          ? 'bg-blue-500 text-white' 
                          : darkMode 
                            ? 'bg-slate-700 hover:bg-slate-600' 
                            : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {d}m
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={newItem.duration}
                  onChange={(e) => setNewItem({ ...newItem, duration: parseInt(e.target.value) || 0 })}
                  className={`w-24 px-2 py-1 rounded border ${inputClasses} text-sm`}
                  min="1"
                  max="480"
                />
                <span className={`ml-2 text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>minutes</span>
              </div>
              <div>
                <label className={`block text-xs mb-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Category</label>
                <div className="flex flex-wrap gap-1">
                  {categoryList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNewItem({ ...newItem, category: cat })}
                      className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                        newItem.category === cat 
                          ? `${categories[cat].color} text-white` 
                          : darkMode 
                            ? 'bg-slate-700 hover:bg-slate-600' 
                            : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className={`px-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={addNewItem}
                  className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add to End
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Schedule with Drag & Drop and Inline Editing */}
        <div className={`${cardClasses} rounded-2xl p-4 mb-4`}>
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
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isDragOver 
                      ? 'border-2 border-blue-500 border-dashed'
                      : isEditing
                        ? darkMode
                          ? 'bg-slate-600 border-2 border-blue-500'
                          : 'bg-blue-50 border-2 border-blue-500'
                        : isCurrent
                          ? darkMode
                            ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-2 border-green-500 shadow-lg shadow-green-500/20'
                            : 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400'
                          : item.special 
                            ? darkMode 
                              ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-600/50' 
                              : 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300'
                            : darkMode 
                              ? 'bg-slate-700/50 hover:bg-slate-700' 
                              : 'bg-gray-100 hover:bg-gray-200'
                  } ${!isTransition && !isEditing ? 'cursor-grab active:cursor-grabbing' : ''} ${isDragging ? 'opacity-50' : ''}`}
                >
                  {/* Drag Handle */}
                  {!isTransition && !isEditing && (
                    <div className={`${darkMode ? 'text-slate-500' : 'text-gray-400'} hover:text-blue-500 transition-colors`}>
                      <GripVertical className="w-5 h-5" />
                    </div>
                  )}
                  {(isTransition || isEditing) && <div className="w-5" />}
                  
                  <div className={`w-10 h-10 rounded-lg ${catInfo.color} flex items-center justify-center flex-shrink-0 ${isCurrent ? 'animate-pulse' : ''}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  {isEditing ? (
                    // Edit Mode
                    <div className="flex-1 flex flex-col gap-2">
                      <input
                        type="text"
                        value={editValues.activity}
                        onChange={(e) => setEditValues({ ...editValues, activity: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border ${inputClasses} text-sm font-medium`}
                        placeholder="Activity name"
                        autoFocus
                      />
                      <div className="flex gap-2 items-center flex-wrap">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <input
                            type="text"
                            value={editValues.time}
                            onChange={(e) => setEditValues({ ...editValues, time: e.target.value })}
                            className={`w-24 px-2 py-1 rounded border ${inputClasses} text-xs`}
                            placeholder="e.g. 9:00 AM"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Duration:</span>
                          {durationPresets.slice(0, 4).map(d => (
                            <button
                              key={d}
                              onClick={() => setEditValues({ ...editValues, duration: d })}
                              className={`px-2 py-1 rounded text-xs ${
                                editValues.duration === d 
                                  ? 'bg-blue-500 text-white' 
                                  : darkMode 
                                    ? 'bg-slate-600 hover:bg-slate-500' 
                                    : 'bg-gray-200 hover:bg-gray-300'
                              }`}
                            >
                              {d}m
                            </button>
                          ))}
                          <input
                            type="number"
                            value={editValues.duration}
                            onChange={(e) => setEditValues({ ...editValues, duration: parseInt(e.target.value) || 0 })}
                            className={`w-16 px-2 py-1 rounded border ${inputClasses} text-xs`}
                            min="1"
                            max="480"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="px-3 py-1 rounded-lg text-sm bg-red-600 hover:bg-red-500 text-white flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                        <button
                          onClick={cancelEdit}
                          className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${
                            darkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEdit(item.id)}
                          className="px-3 py-1 rounded-lg text-sm bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1"
                        >
                          <Check className="w-4 h-4" />
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div 
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => !isTransition && startEdit(item)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">
                          {item.activity}
                        </span>
                        {item.special && <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-green-500 text-white font-medium animate-pulse">
                            NOW
                          </span>
                        )}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                        {item.time} • {formatDuration(item.duration)}
                      </div>
                    </div>
                  )}
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
