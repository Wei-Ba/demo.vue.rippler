const bem = (block:string, suffix:string, element: string, modifier: string) => {
  let cls = ['loli', block, suffix].filter(Boolean).join('-')
  if(element) cls+=`__${element}`
  if(modifier) cls+=`--${modifier}`
  return cls
}

type Func<P = any, R = any> = P extends unknown[] ? (...args: P) => R : (arg: P[]) => R

const AnyCall:Record<string, Func> = new Proxy({}, {
  get(){
    return () => ''
  }
})

export const useNamespace = (block: string) => {
  const result = {
    b: (suffix = '') => bem(block, suffix, '', ''),
    e: (element: string) => bem(block, '', element, ''),
    m: (modifier: string) => bem(block, '', '', modifier),
    be: (suffix: string, element: string) => bem(block, suffix, element, ''),
    bm: (suffix: string, modifier:string) => bem(block, suffix, '', modifier),
    bem: (suffix: string, element: string, modifier:string) => bem(block, suffix, element, modifier),
    is: (name: string, active?: boolean) => active ? `is-${name}` : '',
    nCssVarName(...clzss:string[]){
      return ['loli', ...clzss].join('-')
    },
    bCssVarName(...clzss: string[]){
      return this.nCssVarName(block, ...clzss)
    },
    var(...clzss: string[]){
      return `var(${this.nCssVarName(...clzss)})`
    },
    bVar(...clzss: string[]){
      return this.var(block, ...clzss)
    },
    when(active?: boolean){
      return active ? result : AnyCall
    }
  }
  return result
}

const isNumber = (val: unknown): val is number => typeof val === 'number'

export type DOMUnit =
  | 'em' | 'ex' | '%' | 'px' | 'cm' | 'mm' | 'in' | 'pt' | 'pc'
  | 'ch' | 'rem' | 'vh' | 'vm' | 'vmin' | 'vmax'
export function unit(value?: string | number, defaultUnit: DOMUnit = 'px'){
  if(value === void 0) return ''
  if(isNumber(value) || !Number.isNaN(Number(value))) return `${value}${defaultUnit}`
  return value
}



type AddUint<T extends number | string | undefined, U extends string> =
T extends number | `${number}` ? `${T}${U}` : T

export function createUnit<Uint extends DOMUnit>(defaultUnit: Uint){
  return <T extends string | number>(value?: T): AddUint<T, Uint> => {
    if(value === void 0) return '' as AddUint<T, Uint>
    if(isNumber(value) || !Number.isNaN(Number(value))) return `${value}${defaultUnit}` as AddUint<T, Uint>
    return value as AddUint<T, Uint>
  }
}
export const px = createUnit('px')
export const em = createUnit('em')
export const rem = createUnit('rem')
export const vh = createUnit('vh')
export const vm = createUnit('vm')
export const percent = createUnit('%')
export const vmin = createUnit('vmin')
export const vmax = createUnit('vmax')
export const pt = createUnit('pt')
export const pc = createUnit('pc')
export const ch = createUnit('ch')
export const ex = createUnit('ex')
export const cm = createUnit('cm')
export const mm = createUnit('mm')
export const inch = createUnit('in')
