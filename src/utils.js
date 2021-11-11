
// Zips an array of objects containing multiple strings into a single string.
// Each object's component strings are reduced into a single string joined by spaces.
// Returns a comma-separated list of the reduced object strings.
export function zip_strings(obj)
{
  let strs = []
  obj.forEach(o => strs.push(`${Object.getOwnPropertyNames(o).map(n => o[n]).join(' ')}`))
  return strs.join(', ')
}
