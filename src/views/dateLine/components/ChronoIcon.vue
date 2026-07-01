<script lang="ts">
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'ChronoIcon',
  props: {
    name: { type: String, required: true },
  },
  setup(props) {
    return () => {
      const iconMap: Record<string, import('vue').VNode> = {
        grid: h(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '14',
            height: '14',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2.5',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            class: 'inline-block',
          },
          [
            h('rect', { x: '3', y: '3', width: '7', height: '7' }),
            h('rect', { x: '14', y: '3', width: '7', height: '7' }),
            h('rect', { x: '14', y: '14', width: '7', height: '7' }),
            h('rect', { x: '3', y: '14', width: '7', height: '7' }),
          ],
        ),
        code: h(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '14',
            height: '14',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2.5',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            class: 'inline-block',
          },
          [
            h('polyline', { points: '16 18 22 12 16 6' }),
            h('polyline', { points: '8 6 2 12 8 18' }),
          ],
        ),
        terminal: h(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '14',
            height: '14',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2.5',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            class: 'inline-block',
          },
          [
            h('polyline', { points: '4 17 10 11 4 5' }),
            h('line', { x1: '12', y1: '19', x2: '20', y2: '19' }),
          ],
        ),
        book: h(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '14',
            height: '14',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2.5',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            class: 'inline-block',
          },
          [
            h('path', { d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20' }),
            h('path', { d: 'M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5v-15z' }),
          ],
        ),
        gamepad: h(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '14',
            height: '14',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2.5',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            class: 'inline-block',
          },
          [
            h('line', { x1: '6', y1: '12', x2: '10', y2: '12' }),
            h('line', { x1: '8', y1: '10', x2: '8', y2: '14' }),
            h('line', { x1: '15', y1: '13', x2: '15.01', y2: '13' }),
            h('line', { x1: '18', y1: '11', x2: '18.01', y2: '11' }),
            h('rect', { x: '2', y: '6', width: '20', height: '12', rx: '3' }),
          ],
        ),
        shield: h(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '14',
            height: '14',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2.5',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            class: 'inline-block',
          },
          [h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' })],
        ),
        brush: h(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '14',
            height: '14',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2.5',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            class: 'inline-block',
          },
          [
            h('path', {
              d: 'm12 22 1-1c1.4-1.4 2.4-3.2 3-5.2L18 9l-3-3-7 1.8c-2 0.6-3.8 1.6-5.2 3l-1 1',
            }),
            h('path', { d: 'm19 6 1-1a2.1 2.1 0 0 0-3-3l-1 1' }),
            h('path', { d: 'm14 6-3-3c-1-1-2.5-1-3.5 0L2 8.5' }),
            h('path', { d: 'M2 12.5 12.5 2' }),
          ],
        ),
        coffee: h(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '14',
            height: '14',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2.5',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            class: 'inline-block',
          },
          [
            h('path', { d: 'M18 8h1a4 4 0 0 1 0 8h-1' }),
            h('path', { d: 'M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z' }),
            h('line', { x1: '6', y1: '1', x2: '6', y2: '4' }),
            h('line', { x1: '10', y1: '1', x2: '10', y2: '4' }),
            h('line', { x1: '14', y1: '1', x2: '14', y2: '4' }),
          ],
        ),
        mic: h(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '14',
            height: '14',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2.5',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            class: 'inline-block',
          },
          [
            h('path', { d: 'M12 2a3 3 0 0 0-6 0v7a3 3 0 0 0 6 0V2z' }),
            h('path', { d: 'M19 10v2a7 7 0 0 1-14 0v-2' }),
            h('line', { x1: '12', y1: '19', x2: '12', y2: '22' }),
          ],
        ),
        sparkles: h(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '14',
            height: '14',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2.5',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            class: 'inline-block',
          },
          [
            h('path', {
              d: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.3-6.3-.7.7M6.7 17.3l-.7.7m12.6 0-.7-.7M6.7 6.7l-.7-.7',
            }),
            h('path', { d: 'M12 8a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4z' }),
          ],
        ),
      }
      return iconMap[props.name] || iconMap.grid
    }
  },
})
</script>
