'use client'
import { useState } from 'react'

type Field = { blockType: string; name?: string; label?: string; required?: boolean; placeholder?: string; message?: any; options?: { label: string; value: string }[]; defaultValue?: string }

/** Renders a form-builder form and posts to /api/form-submissions. */
export function FormRenderer({ form }: { form: any }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')
  const m = form?.messages ?? {}
  if (!form || typeof form !== 'object') return null

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('sending')
    const fd = new FormData(e.currentTarget)
    const submissionData = (form.fields as Field[])
      .filter((f) => f.name)
      .map((f) => ({ field: f.name!, value: String(fd.get(f.name!) ?? '') }))
    try {
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: form.id, submissionData }),
      })
      if (res.ok) {
        if (form.confirmationType === 'redirect' && form.redirect?.url) { window.location.href = form.redirect.url; return }
        setState('done')
      } else {
        const j = await res.json().catch(() => null)
        setErrMsg(res.status === 403 ? j?.errors?.[0]?.message || 'Not allowed.' : res.status < 500 ? m.validationError || 'One or more fields have an error. Please check and try again.' : m.mailFailed || 'There was an error trying to send your message. Please try again later.')
        setState('error')
      }
    } catch {
      setErrMsg(m.mailFailed || 'There was an error trying to send your message. Please try again later.')
      setState('error')
    }
  }

  const text = (n: any): string => (typeof n?.text === 'string' ? n.text : Array.isArray(n?.children) ? n.children.map(text).join(n.type === 'root' ? '\n' : '') : '')
  const done = typeof form.confirmationMessage === 'string' ? form.confirmationMessage : form.confirmationMessage?.root ? (form.confirmationMessage.root.children as any[]).map(text).filter(Boolean) : []
  if (state === 'done')
    return <div className="form-done wpcf7-response-output">{Array.isArray(done) && done.length ? done.map((t, i) => <p key={i}>{t}</p>) : <p>{(done as string) || 'Thank you for your message. It has been sent.'}</p>}</div>

  // Markup mirrors Contact Form 7 so the theme's .wpcf7 styles apply unchanged.
  return (
    <div className="wpcf7 js" id={`wpcf7-f${form.id}`}>
      <form onSubmit={onSubmit} className={`wpcf7-form cms-form ${state === 'sending' ? 'submitting' : 'init'}`} noValidate={false}>
        {(form.fields as Field[]).map((f, i) => {
          if (f.blockType === 'message') return null
          const id = `f-${form.id}-${f.name ?? i}`
          const common = {
            id, name: f.name, required: f.required, placeholder: f.placeholder ?? f.label, defaultValue: f.defaultValue,
            onInvalid: (e: React.FormEvent<any>) => { const t = e.currentTarget as HTMLInputElement; t.setCustomValidity(t.validity.valueMissing ? m.invalidRequired || 'Please fill out this field.' : t.validity.typeMismatch ? m.invalidEmail || 'Please enter a valid email address.' : '') },
            onInput: (e: React.FormEvent<any>) => (e.currentTarget as HTMLInputElement).setCustomValidity(''),
          }
          const cls = (t: string) => `wpcf7-form-control wpcf7-${t}${f.required ? ' wpcf7-validates-as-required' : ''}`
          return (
            <p key={id}>
              <label htmlFor={id}>
                {f.label}
                {f.required ? ' *' : ''}
                <br />
                <span className="wpcf7-form-control-wrap" data-name={f.name}>
                  {f.blockType === 'textarea' ? (
                    <textarea rows={4} cols={40} className={cls('textarea')} {...common} />
                  ) : f.blockType === 'select' ? (
                    <select className={cls('select')} {...common}>
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  ) : f.blockType === 'checkbox' ? (
                    <input type="checkbox" className={cls('checkbox')} id={id} name={f.name} value="true" />
                  ) : (
                    <input type={f.blockType === 'email' ? 'email' : f.blockType === 'number' ? 'number' : 'text'} className={cls(f.blockType === 'email' ? 'email' : 'text')} {...common} />
                  )}
                </span>
              </label>
            </p>
          )
        })}
        <p>
          <input type="submit" className="wpcf7-form-control wpcf7-submit has-spinner" value={state === 'sending' ? 'Sending…' : form.submitButtonLabel || 'Submit'} disabled={state === 'sending'} />
        </p>
        {state === 'error' && <div className="wpcf7-response-output" style={{ color: '#c0392b' }}>{errMsg || 'Something went wrong. Please try again.'}</div>}
      </form>
    </div>
  )
}
