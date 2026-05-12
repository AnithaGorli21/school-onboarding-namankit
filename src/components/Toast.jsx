export const feedbackStyles = {
  toast: {
    position: 'fixed',
    bottom: 28,
    right: 28,
    padding: '13px 22px',
    borderRadius: 6,
    fontSize: 13.5,
    fontWeight: 600,
    color: 'var(--tdd-white)',
    zIndex: 9999,
    boxShadow: '0 6px 24px rgba(0,0,0,0.20)',
    animation: 'tdd-toastIn 0.3s ease both',
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    minWidth: 260,
    maxWidth: 380,
  },
  toastSuccess: {
    background: 'linear-gradient(135deg, #1a6b3a 0%, #155a30 100%)',
    borderLeft: '4px solid #6ee7b7',
  },
  toastError: {
    background: 'linear-gradient(135deg, #c0392b 0%, #a93226 100%)',
    borderLeft: '4px solid #fca5a5',
  },
  loadingOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(245,247,250,0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderRadius: 'var(--tdd-radius-lg)',
    backdropFilter: 'blur(2px)',
  },
  loadingText: {
    color: 'var(--tdd-navy)',
    fontSize: 13,
    fontWeight: 600,
    marginLeft: 10,
  },
};

export function Toast({ message, type = 'success', visible }) {
  if (!visible) return null;
  const icon = type === 'success' ? '✅' : '❌';
  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        ...feedbackStyles.toast,
        ...(type === 'success'
          ? feedbackStyles.toastSuccess
          : feedbackStyles.toastError),
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span>{message}</span>
    </div>
  );
}