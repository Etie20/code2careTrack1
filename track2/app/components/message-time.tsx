'use client';

type Props = {
  timestamp: Date | undefined;
};

export default function MessageTime({ timestamp }: Props) {
  if (!timestamp) return null;
  const time = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <span className="text-xs text-gray-500 bg-white/60 px-2 py-1 rounded-full">
      {time}
    </span>
  );
}
