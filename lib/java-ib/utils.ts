export function toIBPseudocode(name: string): string {
  // Check if the name is a string literal (starts and ends with a quote)
  if (name.startsWith('"') && name.endsWith('"')) {
    return name; // Return string literals as is
  }

  // Handle boolean literals
  if (name.toLowerCase() === 'true') return 'TRUE';
  if (name.toLowerCase() === 'false') return 'FALSE';

  // Handle comparison operators
  name = name.replace(/==/g, '=');
  name = name.replace(/!=/g, '≠');
  name = name.replace(/\//g, ' DIV ');
  name = name.replace(/%/g, ' MOD ');

  // Handle logical operators
  name = name.replace(/&&/g, ' AND ');
  name = name.replace(/\|\|/g, ' OR ');
  name = name.replace(/!/g, 'NOT ');

  // If it's not a string literal, convert it to uppercase
  return name.toUpperCase();
}