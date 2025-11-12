export function getDisplayFormat(min: number, sec: number): string {
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export function formatTimeInput(input: string): string {
  let value = input.replace(/\D/g, ''); // 숫자만 남기기
  if (!value) return '';

  let sec = parseInt(value.slice(-2)) || 0; // 뒤 2자리는 초
  let min = parseInt(value.slice(0, -2)) || 0; //나머지는 분

  if (sec >= 60) {
    min += Math.floor(sec / 60);
    sec = sec % 60;
  }

  return getDisplayFormat(min, sec);
}
