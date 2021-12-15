// https://github.com/gregberge/react-merge-refs/blob/3dc2804807097562e9952cfa6057a8a3bef9f39f/src/index.js

export function mergeRefs(refs) {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value)
      } else if (ref != null) {
        ref.current = value
      }
    })
  }
}
