'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useTemplate } from '@/context/TemplateContext';
import { THEMES } from '@/data/themes';
import { isFirebaseConfigured, submitContactMessage } from '@/lib/firebase';
import { staggerItem } from '@/components/shared/StaggerChildren';
import styles from '@/styles/contact-form.module.css';

const DARK_TEMPLATES = new Set(['noir', 'term', 'neon', 'ember', 'midnight', 'horizon', 'glass']);

export default function ContactForm() {
  const { current } = useTemplate();
  const theme = THEMES[current];
  const isDark = DARK_TEMPLATES.has(current);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      setErrorMsg('Please fill in name, email, and message.');
      return;
    }

    if (!isFirebaseConfigured()) {
      setStatus('error');
      setErrorMsg('Contact form is not configured. Please configure Firebase.');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    const result = await submitContactMessage({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() });

    if (result.ok) {
      setStatus('success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } else {
      setStatus('error');
      setErrorMsg(result.error ?? 'Failed to send. Please try again.');
    }
  };

  return (
    <motion.div
      variants={staggerItem}
      className={`${styles.wrapper} ${isDark ? '' : styles.wrapperLight}`}
      style={{ ['--form-accent' as string]: theme.accent }}
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={`${styles.field}`}>
          <label htmlFor="cf-name" className={styles.label}>Name</label>
          <input
            id="cf-name"
            type="text"
            className={styles.input}
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={status === 'sending'}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="cf-email" className={styles.label}>Email</label>
          <input
            id="cf-email"
            type="email"
            className={styles.input}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'sending'}
            required
          />
        </div>
        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label htmlFor="cf-subject" className={styles.label}>Subject</label>
          <input
            id="cf-subject"
            type="text"
            className={styles.input}
            placeholder="What's this about?"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={status === 'sending'}
          />
        </div>
        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label htmlFor="cf-message" className={styles.label}>Message</label>
          <textarea
            id="cf-message"
            className={styles.textarea}
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={status === 'sending'}
            required
          />
        </div>
        {status === 'success' && (
          <div className={`${styles.feedback} ${styles.feedbackSuccess}`}>
            Message sent successfully. I&apos;ll get back to you soon.
          </div>
        )}
        {status === 'error' && (
          <div className={`${styles.feedback} ${styles.feedbackError}`}>
            {errorMsg}
          </div>
        )}
        <div className={styles.submitWrap}>
          <button type="submit" className={styles.submit} disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send Message'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
