import React from 'react';
import DynamicField from './DynamicField';

export default function FormPreview({ formLayout }) {
  if (!formLayout) {
    return (
      <div className="flex-1 min-h-[400px] border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-8 text-center bg-slate-950/20">
        <p className="text-slate-500 text-sm max-w-xs">
          Your active schema preview wrapper will display here. Enter a prompt to the left to see the canvas generate input components.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex-1 flex flex-col animate-fade-in">
      {/* Preview Sheet Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h3 className="text-sm font-mono tracking-wider text-slate-400 uppercase">Live Canvas Environment</h3>
        <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
          Active Prototype
        </span>
      </div>

      {/* Rendered Form Paper container */}
      <div className="p-8 max-w-xl w-full mx-auto space-y-6 flex-1">
        <h1 className="text-xl font-bold border-b border-slate-800 pb-4 text-slate-100">
          {formLayout.formTitle}
        </h1>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          {formLayout.fields.map((field) => (
            <DynamicField key={field.id} field={field} />
          ))}

          <button
            type="button"
            className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium py-2.5 px-4 rounded-lg transition-colors border border-slate-700"
          >
            Submit Form Responses
          </button>
        </form>
      </div>
    </div>
  );
}