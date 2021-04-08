import { XMLAttributeType } from './util'
import { XMLElement, XMLElementConstructor, XMLSpec } from './XMLElement'

export function XMLAttribute(config: Partial<XMLSpec<XMLAttributeType>> = {}) {
  return (instance: XMLElement, name: string) => {
    const ctor = instance.constructor as XMLElementConstructor
    ctor.spec(ctor).attributes[name] = { name: config.name ?? name, type: config.type ?? 'string', path: config.path ?? [] }
  }
}

export function XMLValue(config: Partial<XMLSpec<XMLAttributeType>> = {}) {
  return (instance: XMLElement, name: string) => {
    const ctor = instance.constructor as XMLElementConstructor
    ctor.spec(ctor).value[name] = { name: config.name ?? name, type: config.type ?? 'string', path: config.path ?? [] }
  }
}

export function XMLChild(config: Partial<XMLSpec<XMLElementConstructor>> = {}) {
  return (instance: XMLElement, name: string) => {
    const ctor = instance.constructor as XMLElementConstructor
    ctor.spec(ctor).child[name] = { name: config.name ?? name, type: config.type ?? XMLElement, path: config.path ?? [] }
  }
}

export function XMLChildren(config: Partial<XMLSpec<XMLElementConstructor>> = {}) {
  return (instance: XMLElement, name: string) => {
    const ctor = instance.constructor as XMLElementConstructor
    ctor.spec(ctor).children[name] = { name: config.name ?? name, type: config.type ?? XMLElement, path: config.path ?? [] }
  }
}
