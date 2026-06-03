import React, { useState } from 'react';

export default function FormRenderer({ layout }) {
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!layout) return null;

  const handleChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting collected input criteria metadata:", formData);
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-xl backdrop-blur-md">
      <h3 className="text-xl font-bold text-teal-400 mb-6 border-b border-slate-800 pb-2">
        {layout.formTitle}
      </h3>

      {submitted ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-center text-sm font-medium">
          🎉 Test submission captured cleanly in layout simulation!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {layout.fields?.map((field) => (
            <div key={field.id} className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
                {field.label} {field.required && <span className="text-red-400">*</span>}
              </label>

              {/* Dynamic execution sorting based on AI schema definitions */}
              {field.type === 'textarea' ? (
                <textarea
                  placeholder={field.placeholder}
                  required={field.required}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500 min-h-[100px] transition-all"
                />
              ) : field.type === 'select' ? (
                <select
                  required={field.required}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
                >
                  <option value="">Select an option...</option>
                  {field.options?.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <div className="flex items-center gap-3 mt-1">
                  <input
                    type="checkbox"
                    id={field.id}
                    required={field.required}
                    onChange={(e) => handleChange(field.id, e.target.checked)}
                    className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-teal-500 focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="text-sm text-slate-400">{field.placeholder || 'Accept'}</span>
                </div>
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500 transition-all"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-slate-950 text-sm font-bold py-3 px-4 rounded-xl shadow-lg transition-all transform active:scale-[0.99] mt-4"
          >
            Submit Form Entry
          </button>
        </form>
      )}
    </div>
  );
}