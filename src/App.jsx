white/5 hover:bg-white/10 ring-offset-slate-900' : 'bg-gray-100 hover:bg-gray-200 ring-offset-white'
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
            </div>
          </GlassCard>
        )}

        {/* ============================================ */}
        {/* DASHBOARD VIEW */}
        {/* ============================================ */}
        {view === 'dashboard' && (
          <GlassCard darkMode={darkMode} className="mb-4">
            <div className="p-5">
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <TrendingUp className="w-5 h-5" style={{ color: theme.primary }} />
                Weekly Analytics
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Category Distribution */}
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

        {/* ============================================ */}
        {/* ADD ACTIVITY FORM */}
        {/* ============================================ */}
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

        {/* ============================================ */}
        {/* SCHEDULE LIST */}
        {/* ============================================ */}
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
                        /* ============================================ */
                        /* EDIT MODE */
                        /* ============================================ */
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
                        /* ============================================ */
                        /* VIEW MODE */
                        /* ============================================ */
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

        {/* ============================================ */}
        {/* WEEKLY HIGHLIGHTS */}
        {/* ============================================ */}
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

      {/* ============================================ */}
      {/* BOTTOM NAVIGATION (Mobile) */}
      {/* ============================================ */}
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
