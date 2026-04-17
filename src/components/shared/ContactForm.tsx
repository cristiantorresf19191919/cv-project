'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useTemplate } from '@/context/TemplateContext';
import { useLanguage } from '@/context/LanguageContext';
import { THEMES } from '@/data/themes';
import { isFirebaseConfigured, submitContactMessage } from '@/lib/firebase';
import { staggerItem } from '@/components/shared/StaggerChildren';
import styles from '@/styles/contact-form.module.css';

const DARK_TEMPLATES = new Set(['noir', 'term', 'neon', 'ember', 'midnight', 'horizon', 'glass', 'aurora', 'retro', 'cosmic']);

export default function ContactForm() {
  const { current } = useTemplate();
  const { t } = useLanguage();
  const theme = THEMES[current];
  const isDark = DARK_TEMPLATES.has(current);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      setErrorMsg(t.formErrorRequired);
      return;
    }

    if (!isFirebaseConfigured()) {
      setStatus('error');
      setErrorMsg(t.formErrorConfig);
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
      setErrorMsg(result.error ?? t.formErrorGeneric);
    }
  };

  return (
    <motion.div
      variants={staggerItem}
      className={`${styles.wrapper} ${isDark ? '' : styles.wrapperLight}`}
      style={{ ['--form-accent' as string]: theme.accent }}
      data-pdf-hide
    >
      <div className={styles.formHeader}>
        <div className={styles.formIcon}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className={styles.formTitle}>{t.formTitle}</h3>
        <p className={styles.formSubtitle}>{t.formSubtitle}</p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={`${styles.field} ${focused === 'name' ? styles.fieldFocused : ''}`}>
          <label htmlFor="cf-name" className={styles.label}>{t.formName}</label>
          <input
            id="cf-name"
            type="text"
            className={styles.input}
            placeholder={t.formNamePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setFocused('name')}
            onBlur={() => setFocused(null)}
            disabled={status === 'sending'}
            required
          />
        </div>
        <div className={`${styles.field} ${focused === 'email' ? styles.fieldFocused : ''}`}>
          <label htmlFor="cf-email" className={styles.label}>{t.formEmail}</label>
          <input
            id="cf-email"
            type="email"
            className={styles.input}
            placeholder={t.formEmailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused('email')}
            onBlur={() => setFocused(null)}
            disabled={status === 'sending'}
            required
          />
        </div>
        <div className={`${styles.field} ${styles.fieldFull} ${focused === 'subject' ? styles.fieldFocused : ''}`}>
          <label htmlFor="cf-subject" className={styles.label}>{t.formSubject}</label>
          <input
            id="cf-subject"
            type="text"
            className={styles.input}
            placeholder={t.formSubjectPlaceholder}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            onFocus={() => setFocused('subject')}
            onBlur={() => setFocused(null)}
            disabled={status === 'sending'}
          />
        </div>
        <div className={`${styles.field} ${styles.fieldFull} ${focused === 'message' ? styles.fieldFocused : ''}`}>
          <label htmlFor="cf-message" className={styles.label}>{t.formMessage}</label>
          <textarea
            id="cf-message"
            className={styles.textarea}
            placeholder={t.formMessagePlaceholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setFocused('message')}
            onBlur={() => setFocused(null)}
            disabled={status === 'sending'}
            required
          />
        </div>
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${styles.feedback} ${styles.feedbackSuccess}`}
          >
            <svg viewBox="0 0 24 24" fill="none" className={styles.feedbackIcon}>
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t.formSuccess}
          </motion.div>
        )}
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${styles.feedback} ${styles.feedbackError}`}
          >
            {errorMsg}
          </motion.div>
        )}
        <div className={styles.submitWrap}>
          <button type="submit" className={styles.submit} disabled={status === 'sending'}>
            {status === 'sending' ? (
              <>
                <svg className={styles.submitSpinner} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="50 20" />
                </svg>
                {t.formSending}
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" className={styles.submitIcon}>
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {t.formSend}
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
