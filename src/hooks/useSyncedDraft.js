import { useEffect, useRef, useState } from 'react'

/**
 * A text box whose value also lives in the URL.
 *
 * Typing updates `draft` at once (so the box never lags) and `onCommit(draft)` writes it to the
 * URL after you stop typing for `delay` ms. If the URL changes by itself (Back button, a Reset
 * button, a pasted link) the box shows the new value.
 *
 *   const [text, setText] = useSyncedDraft(urlValue, (v) => writeToUrl(v))
 */
export function useSyncedDraft(urlValue, onCommit, delay = 300) {
  const [draft, setDraft] = useState(urlValue)
  const [prevUrl, setPrevUrl] = useState(urlValue)
  const [written, setWritten] = useState(urlValue) // last value this box wrote to the URL

  // The URL changed. If we didn't write it ourselves, show it.
  if (urlValue !== prevUrl) {
    setPrevUrl(urlValue)
    if (urlValue !== written) {
      setDraft(urlValue)
      setWritten(urlValue)
    }
  }

  const commit = useRef(onCommit)
  useEffect(() => {
    commit.current = onCommit
  })

  useEffect(() => {
    if (draft === urlValue) return undefined
    const id = setTimeout(() => {
      setWritten(draft)
      commit.current(draft)
    }, delay)
    return () => clearTimeout(id)
  }, [draft, urlValue, delay])

  return [draft, setDraft]
}
