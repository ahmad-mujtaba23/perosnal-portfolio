import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TechItem } from './types';
import { DEFAULT_CATEGORY_COLORS } from './types';
import { getLogoSrc, getMonogram } from './skill-logo';

function splitExperience(text: string): string[] {
  return text
    .split(/\.\s+|;\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(s => {
      const ended = s.endsWith('.') ? s : s + '.';
      return ended.charAt(0).toUpperCase() + ended.slice(1);
    });
}

export interface InfoPanelProps {
  item: TechItem | null;
  onClose: () => void;
  categoryColors?: Record<string, string>;
  logoOverrides?: Record<string, string>;
}

export default function InfoPanel({ item, onClose, categoryColors, logoOverrides }: InfoPanelProps) {
  const colors = { ...DEFAULT_CATEGORY_COLORS, ...categoryColors };

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key={item.slug}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 32 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}
        >
          <div style={{
            flex: 1,
            minHeight: 0,
            background: 'var(--color-surface, #141414)',
            border: '1px solid var(--color-border, #2a2a2a)',
            borderRadius: 16,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>

            {/* Category accent bar */}
            <div style={{
              position: 'absolute',
              left: 0, top: 0, bottom: 0,
              width: 3,
              background: colors[item.category] ?? 'var(--color-accent, #2dd4bf)',
              borderRadius: '16px 0 0 16px',
            }} />

            {/* Header */}
            <div style={{ flexShrink: 0, padding: '22px 22px 18px 32px', position: 'relative' }}>
              <button
                onClick={onClose}
                aria-label="Close panel"
                style={{
                  position: 'absolute',
                  top: 14, right: 14,
                  background: 'transparent',
                  border: '1px solid var(--color-border, #2a2a2a)',
                  borderRadius: 7,
                  width: 28, height: 28,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted, #666)',
                  transition: 'color 150ms ease, border-color 150ms ease',
                }}
                onMouseEnter={e => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.color = 'var(--color-text, #fff)';
                  b.style.borderColor = 'var(--color-accent, #2dd4bf)';
                }}
                onMouseLeave={e => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.color = 'var(--color-text-muted, #666)';
                  b.style.borderColor = 'var(--color-border, #2a2a2a)';
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="1" y1="1" x2="9" y2="9" />
                  <line x1="9" y1="1" x2="1" y2="9" />
                </svg>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 10,
                  background: '#ffffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
                }}>
                  <LogoOrMonogram item={item} size={27} logoOverrides={logoOverrides} />
                </div>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.58rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: colors[item.category] ?? 'var(--color-accent, #2dd4bf)',
                    marginBottom: 4,
                    lineHeight: 1,
                  }}>
                    {item.category}
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-display, sans-serif)',
                    fontSize: '1.8rem',
                    fontWeight: 900,
                    letterSpacing: '-0.025em',
                    color: 'var(--color-text, #fff)',
                    margin: 0,
                    lineHeight: 1.05,
                  }}>
                    {item.name}
                  </h3>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{
              height: 1,
              background: 'var(--color-border, #2a2a2a)',
              marginLeft: 32,
              opacity: 0.55,
              flexShrink: 0,
            }} />

            {/* Scrollable content */}
            <div style={{
              flex: 1, minHeight: 0, overflowY: 'auto',
              padding: '16px 22px 16px 32px',
              display: 'flex', flexDirection: 'column', gap: 20,
            }}>
              <InfoRow label="What it is" text={item.description} />
              {item.whyUsed && <InfoRow label="Why it's used" text={item.whyUsed} />}
              {item.myExperience && (
                <ExperienceRow
                  label="My experience"
                  text={item.myExperience}
                  accentColor={colors[item.category] ?? 'var(--color-accent, #2dd4bf)'}
                />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InfoRow({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <div style={{
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: '0.72rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--color-text-muted, #666)',
        marginBottom: 6,
      }}>
        {label}
      </div>
      <p style={{
        fontFamily: 'var(--font-body, sans-serif)',
        fontSize: '0.81rem',
        lineHeight: 1.65,
        color: 'var(--color-text, #fff)',
        margin: 0,
      }}>
        {text}
      </p>
    </div>
  );
}

function ExperienceRow({ label, text, accentColor }: { label: string; text: string; accentColor: string }) {
  const sentences = splitExperience(text);

  return (
    <div>
      <div style={{
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: '0.72rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: accentColor,
        marginBottom: 9,
      }}>
        {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {sentences.map((sentence, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              paddingLeft: 12, paddingTop: 7, paddingBottom: 7, paddingRight: 8,
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '0 6px 6px 0',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute',
              left: 0, top: 0, bottom: 0,
              width: 2,
              background: accentColor,
              opacity: 0.5,
            }} />
            <p style={{
              fontFamily: 'var(--font-body, sans-serif)',
              fontSize: '0.79rem',
              lineHeight: 1.6,
              color: 'var(--color-text, #fff)',
              margin: 0,
            }}>
              {sentence}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LogoOrMonogram({ item, size, logoOverrides }: { item: TechItem; size: number; logoOverrides?: Record<string, string> }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.55rem', fontWeight: 700, color: '#333', letterSpacing: '0.04em' }}>
        {getMonogram(item.name)}
      </span>
    );
  }
  return (
    <img
      src={getLogoSrc(item.slug, logoOverrides)}
      alt={item.name}
      style={{ width: size, height: size, display: 'block' }}
      onError={() => setError(true)}
      draggable={false}
    />
  );
}
