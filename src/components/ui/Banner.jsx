const VARIANTS = {
  correct: 'bg-success-soft text-success-text',
  wrong: 'bg-danger-soft text-danger-text',
  neutral: 'bg-chip text-soft',
}

// Result message under a question
export default function Banner({ variant, children }) {
  return (
    <p className={`mt-4 rounded-lg px-3 py-2 font-medium ${VARIANTS[variant]}`}>
      {children}
    </p>
  )
}
