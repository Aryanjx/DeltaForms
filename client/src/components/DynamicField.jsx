import React from 'react';

export default function DynamicField({ field }) {
  const { id, label, type, placeholder, required, options } = field;

  // Base input styling properties to avoid duplicating classes across variations
  const baseInputClass = "w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all";

  return (
    <div className="space-y-1.5 text-left">
      <label htmlFor={id} className="block text-sm font-medium text-slate-300">
        {label}
        {required && <span className="text-rose-400 ml-1">*</span>}
      </label>

      {/* Variation 1: Multi-line text boxes */}
      {type === 'textarea' ? (
        <textarea
          id={id}
          className={`${baseInputClass} h-24 resize-none`}
          placeholder={placeholder}
          required={required}
        />
      ) : 

      /* Variation 2: Dropdown menus */
      type === 'select' ? (
        <select
          id={id}
          className={baseInputClass}
          required={required}
          defaultValue=""
        >
          <option value="" disabled hidden>{placeholder || "Select an option..."}</option>
          {options?.map((option, idx) => (
            <option key={idx} value={option} className="bg-slate-900 text-slate-100">
              {option}
            </option>
          ))}
        </select>
      ) : 

      /* Variation 3: Checkbox layouts */
      type === 'checkbox' ? (
        <div className="flex items-center gap-3 py-1">
          <input
            id={id}
            type="checkbox"
            required={required}
            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-teal-500 focus:ring-teal-500/50 focus:ring-offset-slate-950 focus:ring-2"
          />
          <span className="text-sm text-slate-400">Accept Terms / Option</span>
        </div>
      ) : 

      /* Variation 4: Standard native text inputs (text, email, number) */
      (
        <input
          id={id}
          type={type}
          className={baseInputClass}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
}