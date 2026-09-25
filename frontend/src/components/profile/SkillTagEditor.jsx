import { useState } from 'react';
import { X } from 'lucide-react';


export function SkillTagEditor({ skills, onChange }) {
  const [input, setInput] = useState('');


  function addSkill(e) {
    e.preventDefault();
    const value = input.trim();
    if (value && !skills.includes(value)) {
      onChange([...skills, value]);
    }
    setInput('');
  }


  function removeSkill(skill) {
    onChange(skills.filter((s) => s !== skill));
  }


  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <span
            key={skill}
            className="flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-1 text-xs text-brand-600"
          >
            {skill}
            <button type="button" onClick={() => removeSkill(skill)}>
              <X className="size-3" />
            </button>
          </span>
        ))}
      </div>
      <form onSubmit={addSkill} className="mt-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a skill and press Enter"
          className="w-full rounded-control border border-border-muted px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
      </form>
    </div>
  );
}


