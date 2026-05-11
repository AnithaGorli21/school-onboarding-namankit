export const today = new Date().toISOString().split('T')[0];
export const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
export const year = new Date().getFullYear();