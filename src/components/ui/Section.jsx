export default function Section({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-lg font-semibold text-ink">{title}</h2>
      {children}
    </section>
  )
}
