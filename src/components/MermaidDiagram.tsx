import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '13px',
    primaryColor: '#f0f2ff',
    primaryBorderColor: '#c7caff',
    primaryTextColor: '#1a1a2e',
    lineColor: '#9395c7',
    secondaryColor: '#f7f7fb',
    tertiaryColor: '#eef0ff',
    background: '#ffffff',
    mainBkg: '#f0f2ff',
    nodeBorder: '#c7caff',
    clusterBkg: '#f7f7fb',
    titleColor: '#1a1a2e',
    edgeLabelBackground: '#ffffff',
    attributeBackgroundColorEven: '#f7f7fb',
    attributeBackgroundColorOdd: '#ffffff',
  },
  flowchart: { curve: 'natural', padding: 20 },
  securityLevel: 'loose',
});

let counter = 0;

interface Props {
  chart: string;
  className?: string;
}

export function MermaidDiagram({ chart, className }: Props) {
  const id = useRef(`mermaid-${++counter}`).current;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    mermaid.render(id, chart.trim()).then(({ svg }) => {
      if (ref.current) {
        ref.current.innerHTML = svg;
        // Make SVG responsive
        const svgEl = ref.current.querySelector('svg');
        if (svgEl) {
          svgEl.removeAttribute('width');
          svgEl.removeAttribute('height');
          svgEl.style.width = '100%';
          svgEl.style.height = 'auto';
          svgEl.style.maxWidth = '100%';
        }
      }
    }).catch(() => {
      // silently fail — diagram text shown as fallback via pre
    });
  }, [chart, id]);

  return <div ref={ref} className={className} />;
}
