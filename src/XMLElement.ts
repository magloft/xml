import { Element, xml2js } from 'xml-js'
import { XMLAttributeType, xmlCoerceAttribute, xmlResolvePath } from './util'

export interface XMLSpec<T> {
  name: string
  type: T
  path: string[]
}

export interface XMLElementSpec {
  attributes: { [key: string]: XMLSpec<XMLAttributeType> }
  child: { [key: string]: XMLSpec<XMLElementConstructor> }
  children: { [key: string]: XMLSpec<XMLElementConstructor> }
  value: { [key: string]: XMLSpec<XMLAttributeType> }
}

export type XMLElementConstructor = typeof XMLElement & { new(...params: unknown[]): XMLElement }

export class XMLElement {
  static specs = new Map<XMLElementConstructor, XMLElementSpec>()

  static spec(ctor: XMLElementConstructor) {
    if (!this.specs.has(ctor)) { ctor.specs.set(ctor, { attributes: {}, child: {}, children: {}, value: {} }) }
    return ctor.specs.get(ctor)
  }

  constructor(input: Element | string) {
    const element = (typeof input === 'string') ? xml2js(input, { compact: false }).elements[0] as Element : input
    const ctor = this.constructor as XMLElementConstructor
    const elementSpec = ctor.specs.get(ctor)
    for (const [name, spec] of Object.entries(elementSpec.attributes)) {
      const target = xmlResolvePath(element, spec.path)
      const value = (target?.attributes?.[spec.name]) ? xmlCoerceAttribute(target.attributes[spec.name] as string, spec.type) : null
      Object.assign(this, { [name]: value })
    }
    for (const [name, spec] of Object.entries(elementSpec.child)) {
      const target = xmlResolvePath(element, spec.path)?.elements?.find((el) => el.name === spec.name)
      const value = target ? new spec.type(target) : null
      Object.assign(this, { [name]: value })
    }
    for (const [name, spec] of Object.entries(elementSpec.children)) {
      const target = xmlResolvePath(element, spec.path)
      const values = (target?.elements ?? []).filter((el) => el.name === spec.name).map((childElement) => new spec.type(childElement))
      Object.assign(this, { [name]: values })
    }
    for (const [name, spec] of Object.entries(elementSpec.value)) {
      const target = xmlResolvePath(element, spec.path)
      const value = target ? target.elements.find(({ type }) => type === 'text')?.text as string : null
      Object.assign(this, { [name]: value })
    }
  }
}
