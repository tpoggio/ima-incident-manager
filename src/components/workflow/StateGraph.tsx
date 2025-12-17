import { useTranslation } from 'react-i18next';
import type { EstadoIncidente } from '@/types';
import { ESTADO_TRANSITIONS } from '@/types';

interface StateGraphProps {
  currentState: EstadoIncidente;
  onStateClick?: (state: EstadoIncidente) => void;
}

interface NodePosition {
  x: number;
  y: number;
}

const NODE_POSITIONS: Record<EstadoIncidente, NodePosition> = {
  NUEVO: { x: 60, y: 120 },
  EN_ANALISIS: { x: 190, y: 120 },
  ASIGNADO: { x: 320, y: 120 },
  EN_CURSO: { x: 450, y: 120 },
  ESPERANDO_CLIENTE: { x: 450, y: 30 },
  ESPERANDO_PROVEEDOR: { x: 450, y: 210 },
  RESUELTO: { x: 580, y: 120 },
  CERRADO: { x: 710, y: 120 },
  CANCELADO: { x: 320, y: 280 },
};

const NODE_WIDTH = 110;
const NODE_HEIGHT = 36;

function getConnectionPoints(
  from: EstadoIncidente,
  to: EstadoIncidente
): { x1: number; y1: number; x2: number; y2: number } {
  const fromPos = NODE_POSITIONS[from];
  const toPos = NODE_POSITIONS[to];
  
  const dx = toPos.x - fromPos.x;
  const dy = toPos.y - fromPos.y;
  
  let x1: number, y1: number, x2: number, y2: number;
  
  if (Math.abs(dy) > 50) {
    // Vertical connection
    if (dy > 0) {
      x1 = fromPos.x + NODE_WIDTH / 2;
      y1 = fromPos.y + NODE_HEIGHT;
      x2 = toPos.x + NODE_WIDTH / 2;
      y2 = toPos.y;
    } else {
      x1 = fromPos.x + NODE_WIDTH / 2;
      y1 = fromPos.y;
      x2 = toPos.x + NODE_WIDTH / 2;
      y2 = toPos.y + NODE_HEIGHT;
    }
  } else {
    // Horizontal connection
    if (dx > 0) {
      x1 = fromPos.x + NODE_WIDTH;
      y1 = fromPos.y + NODE_HEIGHT / 2;
      x2 = toPos.x;
      y2 = toPos.y + NODE_HEIGHT / 2;
    } else {
      x1 = fromPos.x;
      y1 = fromPos.y + NODE_HEIGHT / 2;
      x2 = toPos.x + NODE_WIDTH;
      y2 = toPos.y + NODE_HEIGHT / 2;
    }
  }
  
  return { x1, y1, x2, y2 };
}

export function StateGraph({ currentState, onStateClick }: StateGraphProps) {
  const { t } = useTranslation();

  const connections: Array<{ from: EstadoIncidente; to: EstadoIncidente }> = [];
  Object.entries(ESTADO_TRANSITIONS).forEach(([from, transitions]) => {
    transitions.forEach(to => {
      connections.push({ from: from as EstadoIncidente, to });
    });
  });

  return (
    <div>
      <div className="overflow-x-auto">
        <svg width="830" height="330" className="block">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
            </marker>
          </defs>
          
          {/* Connections */}
          {connections.map(({ from, to }, idx) => {
            const { x1, y1, x2, y2 } = getConnectionPoints(from, to);
            return (
              <line
                key={`${from}-${to}-${idx}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#94a3b8"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            );
          })}
          
          {/* Nodes */}
          {Object.entries(NODE_POSITIONS).map(([state, pos]) => {
            const isCurrent = state === currentState;
            const isValidTransition = ESTADO_TRANSITIONS[currentState]?.includes(state as EstadoIncidente);
            const isClickable = isValidTransition && onStateClick;
            
            return (
              <g
                key={state}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => isClickable && onStateClick(state as EstadoIncidente)}
                className={isClickable ? 'cursor-pointer' : ''}
              >
                <rect
                  width={NODE_WIDTH}
                  height={NODE_HEIGHT}
                  rx="8"
                  ry="8"
                  fill={isCurrent ? '#1a4b8c' : isValidTransition ? '#10b981' : '#ffffff'}
                  stroke={isCurrent ? '#1a4b8c' : isValidTransition ? '#10b981' : '#94a3b8'}
                  strokeWidth="2"
                  className={isClickable ? 'hover:opacity-80 transition-opacity' : ''}
                />
                <text
                  x={NODE_WIDTH / 2}
                  y={NODE_HEIGHT / 2 + 4}
                  textAnchor="middle"
                  fill={isCurrent || isValidTransition ? '#ffffff' : '#374151'}
                  fontSize="11"
                  fontWeight="500"
                >
                  {t(`statuses.${state}`)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-ima-blue" />
          <span>{t('workflow.currentState')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span>{t('workflow.validTransition')}</span>
        </div>
      </div>
    </div>
  );
}
