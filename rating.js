export function rate(avg) {
  if (avg >= 70) return { label: 'Excellent', color: 'text-emerald-400', msg: 'Your cognitive performance is strong. Keep it up.' };
  if (avg >= 40) return { label: 'Average', color: 'text-amber-400', msg: 'Decent, but regular training would help you improve.' };
  return { label: 'Poor', color: 'text-red-400', msg: 'Low performance. Please consult the flight surgeon / Dr AI.' };
}