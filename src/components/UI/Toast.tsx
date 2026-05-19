interface ToastProps { message: string }

export default function Toast({ message }: ToastProps) {
  if (!message) return null
  return (
    <div className="fixed bottom-6 right-6 z-[9999] bg-[#1a1a2e] text-white px-[18px] py-2.5 rounded-lg text-[13px] shadow-xl [animation:slideUp_0.2s_ease]">
      {message}
    </div>
  )
}
