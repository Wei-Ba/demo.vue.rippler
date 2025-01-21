<doc>
涟漪效果带移动, 参考于某个ui框架
</doc>

<script lang="ts" setup>
import './base.scss'
import { percent, px, useNamespace, isArray } from '@util'
import { CSSProperties, watch, shallowRef, triggerRef, Ref, ref } from 'vue'

const ns = useNamespace('rippler')

type RippleData = {el: Ref<HTMLElement | undefined>, style: CSSProperties}

const ripples = shallowRef<RippleData[]>([])

const handleMosuedown = (e: MouseEvent) => {
  const el = e.target as HTMLElement
  if(!el) return
  //const rect = el.getBoundingClientRect()
  const center = {
    x: el.offsetWidth / 2,
    y: el.offsetHeight / 2
  }
  const anchor_center = {
    x: e.pageX - el.offsetLeft - center.x,
    y: e.pageY - el.offsetTop - center.y
  }
  const size = Math.sqrt(center.x ** 2 + center.y ** 2) * 2
  const style: CSSProperties = {
    position: 'absolute',
    width: px(size),
    height: px(size),
    left: px(center.x - size /2),
    top: px(center.y - size /2),
    borderRadius: percent(50)
  }
  const data: RippleData = {
    el: ref(),
    style
  }
  const mount = (el: HTMLElement) => {
    const animate = el.animate([{
      transform: `translate(${anchor_center.x}px,${anchor_center.y}px) scale(.15)`,
    },{
      transform: `translate(0px, 0px) scale(1)`,
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
  <div :class="[useNamespace('button').b()]" @mousedown="handleMosuedown" @mouseup="handleMouseup" ref="el">
    <div :class="[ns.b()]" v-for="{el, style} of ripples" :key="(style as any)">
      <div :class="ns.e('inner')" :ref="el" :style="style"></div>
    </div>
  </div>
</template>