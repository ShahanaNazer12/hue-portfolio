'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function AdminLogin() {
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false); const router=useRouter();
  async function submit(e) { e.preventDefault(); setLoading(true); setError(''); try { const res=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})}); const data=await res.json(); if(!res.ok) throw new Error(data.error||'Login failed'); router.replace('/admin/dashboard'); router.refresh(); } catch(err){setError(err.message)} finally{setLoading(false)} }
  return <main className="admin-auth"><a className="brand" href="/">Shahana Sherin K<span>.</span></a><form className="form-card auth-card" onSubmit={submit}><p className="eyebrow">PRIVATE AREA</p><h1>Welcome back.</h1><p>Sign in to manage your portfolio projects.</p><label>Admin email<input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} /></label><label>Password<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} /></label>{error&&<p className="status error">{error}</p>}<button className="button primary" disabled={loading}>{loading?'Signing in…':'Sign in ↗'}</button><a className="back-link" href="/">← Back to portfolio</a></form></main>
}
