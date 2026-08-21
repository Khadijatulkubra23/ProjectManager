export const required = (value, message) => {
  if (!value || !value.trim()) {
    return message || 'This field is required.'
  }

  return ''
}

export const minLength = (
  value,
  length,
  message
) => {
  if (!value || value.trim().length < length) {
    return (
      message ||
      `Must be at least ${length} characters.`
    )
  }

  return ''
}