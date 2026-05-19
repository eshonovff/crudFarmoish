interface ToastProps {
  message: string
}

export default function Toast({ message }: ToastProps) {
  if (!message) return null
  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(12px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
      <div style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        background: '#1a1a2e',
        color: '#fff',
        padding: '10px 18px',
        borderRadius: 8,
        fontSize: 13,
        zIndex: 9999,
        animation: 'slideUp 0.2s ease',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}>
        {message}
      </div>
    </>
  )
}
