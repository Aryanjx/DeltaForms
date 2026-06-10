import React from 'react';
import FormHistory from './FormHistory';
import FormRenderer from './FormRenderer';

export default function HistoryPage({
  forms,
  activeForm,
  onSelect,
  onDelete,
  onBack,
  themeMode,
  onToggleTheme
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <div className="p-6 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600 dark:text-teal-400">Your Form History</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              View saved AI-generated forms, preview them instantly, and remove old layouts you no longer want.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={onToggleTheme}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 transition-all"
            >
              {themeMode === 'dark' ? '☀️ Light mode' : '🌙 Dark mode'}
            </button>
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-semibold transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_0.95fr] gap-8">
          <div className="space-y-4">
            <FormHistory forms={forms} activeFormId={activeForm?._id} onSelect={onSelect} onDelete={onDelete} />
          </div>

          <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">Selected Form Preview</h2>
              {activeForm ? (
                <FormRenderer layout={activeForm} />
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-6 text-slate-500 dark:text-slate-400 text-sm">
                  Select a form from the history list to preview it here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
