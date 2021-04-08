import { Element } from 'xml-js'

export type XMLAttributeType = 'string' | 'integer' | 'float' | 'boolean'

export function xmlResolvePath(element: Element | null, path: string[]) {
  return path.reduce((result, name) => result?.elements?.find((el) => el.name === name), element)
}

export function xmlLookupSingle(element: Element | null, path: string): Element | null {
  return path.split('.').reduce((result, name) => result?.elements?.find((el) => el.name === name), element)
}

export function xmlLookupArray(element: Element | null, path: string): Element[] {
  const fragments = path.split('.')
  const target = fragments.slice(0, -1).reduce((result, name) => result?.elements?.find((el) => el.name === name), element)
  return target ? target.elements.filter(({ name }) => name === fragments[fragments.length - 1]) : []
}

export function xmlCoerceAttribute(rawValue: string | null, type: XMLAttributeType) {
  if (type == null) {
    return null
  } else if (type === 'string') {
    return rawValue
  } else if (type === 'float') {
    return parseFloat(rawValue)
  } else if (type === 'integer') {
    return parseInt(rawValue, 10)
  } else {
    return rawValue === 'true'
  }
}
