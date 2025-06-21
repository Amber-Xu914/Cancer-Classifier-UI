export function getInitials(str: string): string {
  const names = str.split(' ');
  if (names.length > 1) {
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  }
  return names[0].charAt(0).toUpperCase() + names[0].charAt(1).toUpperCase();
}
