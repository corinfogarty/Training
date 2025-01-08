'use client'

export default function Debug({ data }: { data: any }) {
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg max-w-lg max-h-96 overflow-auto">
      <pre className="text-xs">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
} 