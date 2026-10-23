// White panel that sits on the dark page. Add padding and spacing via className.
export default function Panel({ className = '', ...props }) {
  return <div className={`rounded-xl bg-panel ${className}`.trim()} {...props} />
}
