import React from 'react';

export default function FormHistory({ forms, activeFormId, onSelect, onDelete }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Saved Form History</h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">{forms.length} saved</span>
      </div>

      {forms.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-5 text-sm text-slate-500 dark:text-slate-400">
          No stored layouts yet. Generate one from the AI Blueprint Engine to see it appear here.
        </div>
      ) : (
        <div className="space-y-3">
          {forms.map((form) => (
            <div
              key={form._id}
              className={`w-full rounded-3xl border transition-all ${activeFormId === form._id ? 'border-teal-500 bg-teal-500/10 shadow-sm' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950'}`}
            >
              <button
                type="button"
                onClick={() => onSelect(form)}
                className="w-full text-left p-4 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-100">{form.formTitle}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{new Date(form.createdAt).toLocaleString()}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">View</span>
              </button>
              <div className="border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => onDelete(form._id)}
                  className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
