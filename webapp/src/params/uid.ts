import type { ParamMatcher } from '@sveltejs/kit'

export const match: ParamMatcher = (param) => /^([\da-fA-F]+)(-[\da-fA-F]+){4}$/.test(param)
