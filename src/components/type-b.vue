<doc>
普通的涟漪效果
</doc>

<script lang="ts" setup>
import './base.scss'
import { percent, px, useNamespace, isArray, isNumber, Indexable } from '@util'
import { CSSProperties, watch, shallowRef, triggerRef, Ref, ref } from 'vue'

// 忘了用来干嘛的了...
// interface Transform{
//   translate: Partial<{x: number, y: number, z: number}> | number
//   scale: Partial<{x: number, y: number, z: number}> | number
// }
// const resovleTransform = {
//   translate(v: Transform['translate']){
//     if(isNumber(v)) return `translate(${px(v)})`
//     return `translate(${px(v.x || 0)}, ${px(v.y || 0)}, ${px(v.z || 0)})`
//   }
// }
// const createTransform = (e: Transform) => {
//   Object.entries(e).map(([k, v]) => {
//     return (resovleTransform[k as Indexable])(v)
//   }).join(' ')
// }

const ns = useNamespace('rippler')

type RippleData = {el: Ref<HTMLElement | undefined>, style: CSSProperties}

const ripples = shallowRef<RippleData[]>([])

const handleMousedown = (e: MouseEvent) => {
  const el = e.target as HTMLElement
  if(!el) return
  //const rect = el.getBoundingClientRect()
  const center = {
    x: el.offsetWidth / 2,
    y: el.offsetHeight / 2
  }
  const point = {
    x: e.pageX - el.offsetLeft - center.x,
    y: e.pageY - el.offsetTop - center.y
  }
  const lx = (Math.abs(e.x - center.x) + center.x)
  const ly = (Math.abs(e.y - center.y) + center.y)
  const size = Math.sqrt(lx ** 2 + ly ** 2) * 2
  const transform = `translate(${px(point.x)}, ${px(point.y)})`
  const style: CSSProperties = {
    position: 'absolute',
    width: px(size),
    height: px(size),
    left: px(center.x - size /2),
    top: px(center.y - size /2),
    borderRadius: percent(50),
    transform
  }
  const data: RippleData = {
    el: ref(),
    style
  }
  const mount = (el: HTMLElement) => {
    const animate = el.animate([{
      transform: `${transform} scale(.15)`,
    },{
      transform: `${transform} scale(1)`,
    }],{
      duration: 300, easing: 'ease-in-out'
    })
    animate.play()
  }
  watch(data.el, (el) => {
    if(!el) return
    mount(isArray(el) ? el[0] as any : el)
  }, { once: true })
  
  ripples.value.push(data)
  triggerRef(ripples)
}

const handleMouseup = () => {
  const ripple = ripples.value.at(-1)
  if(!ripple || !ripple.el.value) return
  const el: HTMLElement = isArray(ripple.el.value) ? ripple.el.value[0] as any : ripple.el.value
  const animations = el.getAnimations()
  const unmount = () => {
    ripples.value.splice(ripples.value.indexOf(ripple), 1)
    triggerRef(ripples)
  }
  const addAnimate = () => {
    const animate = el.animate([{ opacity: 1}, {opacity: 0}], 300)
    animate.onfinish = unmount
    animate.play()
  }
  if(animations.length){
    animations.at(-1)!.onfinish = addAnimate
  } else {
    addAnimate()
  }
}

</script>

<template>
  <div :class="[useNamespace('button').b()]" @mousedown="handleMousedown" @mouseup="handleMouseup" ref="el">
    <div :class="[ns.b()]" v-for="{el, style} of ripples" :key="(style as any)">
      <div :class="ns.e('inner')" :ref="el" :style="style"></div>
    </div>
  </div>
</template>