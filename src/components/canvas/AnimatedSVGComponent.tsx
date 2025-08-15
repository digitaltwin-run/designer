import React, { useEffect, useRef, useState } from 'react';
import { Html } from 'react-konva-utils';

interface AnimatedSVGComponentProps {
  svgUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  selected: boolean;
  onSelect: () => void;
  className?: string;
}

/**
 * Component for rendering animated SVG with JavaScript support
 * Uses Html wrapper from react-konva-utils to embed DOM elements in Konva canvas
 */
export const AnimatedSVGComponent: React.FC<AnimatedSVGComponentProps> = ({
  svgUrl,
  x,
  y,
  width,
  height,
  visible,
  selected,
  onSelect,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load and inject SVG content
  useEffect(() => {
    const loadSVG = async () => {
      try {
        console.log('🔄 Loading animated SVG:', svgUrl);
        
        const response = await fetch(svgUrl);
        if (!response.ok) {
          throw new Error(`Failed to load SVG: ${response.status}`);
        }
        
        const svgText = await response.text();
        setSvgContent(svgText);
        setIsLoaded(true);
        setError(null);
        
        console.log('✅ SVG loaded successfully:', svgUrl);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('❌ Failed to load SVG:', svgUrl, errorMessage);
        setError(errorMessage);
        setIsLoaded(false);
      }
    };

    if (svgUrl) {
      loadSVG();
    }
  }, [svgUrl]);

  // Inject SVG and initialize scripts
  useEffect(() => {
    if (!isLoaded || !containerRef.current || !svgContent) return;

    const container = containerRef.current;
    
    // Clear previous content
    container.innerHTML = '';
    
    // Create a temporary div to parse SVG
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = svgContent;
    
    const svgElement = tempDiv.querySelector('svg');
    if (!svgElement) {
      console.warn('⚠️ No SVG element found in content');
      return;
    }

    // Set dimensions
    svgElement.setAttribute('width', width.toString());
    svgElement.setAttribute('height', height.toString());
    svgElement.style.display = visible ? 'block' : 'none';
    
    // Add selection styling
    if (selected) {
      svgElement.style.outline = '2px solid #3b82f6';
      svgElement.style.outlineOffset = '2px';
    } else {
      svgElement.style.outline = 'none';
    }

    // Add click handler
    svgElement.style.cursor = 'pointer';
    svgElement.addEventListener('click', (e) => {
      e.stopPropagation();
      onSelect();
    });

    // Append to container
    container.appendChild(svgElement);

    // Execute embedded scripts
    const scripts = svgElement.querySelectorAll('script');
    scripts.forEach((script) => {
      try {
        // Create new script element to ensure execution
        const newScript = document.createElement('script');
        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.textContent = script.textContent;
        }
        
        // Execute in context of the SVG element
        const scriptFunction = new Function('svgElement', script.textContent || '');
        scriptFunction.call(svgElement, svgElement);
        
        console.log('✅ SVG script executed successfully');
      } catch (err) {
        console.warn('⚠️ SVG script execution failed:', err);
      }
    });

    console.log('🎨 Animated SVG component initialized');

    // Cleanup function
    return () => {
      // Clean up any intervals or event listeners that might have been created
      const intervals = ['blinkInterval', 'pollingInterval'];
      intervals.forEach(prop => {
        const element = svgElement as any;
        if (element[prop]) {
          clearInterval(element[prop]);
        }
      });
    }
  }, [isLoaded, svgContent, width, height, visible, selected, onSelect]);

  if (error) {
    return (
      <Html>
        <div
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width,
            height,
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#991b1b',
            fontFamily: 'monospace'
          }}
        >
          SVG Error: {error}
        </div>
      </Html>
    );
  }

  if (!isLoaded) {
    return (
      <Html>
        <div
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width,
            height,
            background: '#f3f4f6',
            border: '1px dashed #d1d5db',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#6b7280'
          }}
        >
          Loading SVG...
        </div>
      </Html>
    );
  }

  return (
    <Html>
      <div
        ref={containerRef}
        className={`animated-svg-component ${className}`}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width,
          height,
          pointerEvents: 'auto', // Enable interactions
          userSelect: 'none'
        }}
      />
    </Html>
  );
};
