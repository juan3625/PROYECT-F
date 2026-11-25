import findrixIcon from "../../assets/findrix-icon.png";
import { useAppData } from "../../context/AppDataContext";
import "./FoxLoadingTransition.css";

export function FoxLoadingTransition({ onReintentar }: { onReintentar: () => void }) {
  const { cargando, errorCarga } = useAppData();
  const hayError = Boolean(errorCarga) && !cargando;

  return (
    <main className="fox-loading" aria-live="polite">
      <div className="fox-loading__card">
        <div className="fox-loading__stage" aria-hidden={hayError ? "true" : undefined}>
          <img className="fox-loading__head" src={findrixIcon} alt="" />
          <svg className="fox-loading__body" viewBox="0 0 260 260" role="img" aria-label="Zorro de madera sosteniendo una moneda">
            <title>El zorro de Findrix está preparando tu espacio</title>
            <ellipse cx="130" cy="242" rx="74" ry="10" className="wood-shadow" />
            <g className="wood-body">
              <path d="M91 102 Q130 88 169 102 L178 194 Q130 212 82 194 Z" className="wood-torso" />
              <path d="M82 116 Q55 126 39 158" className="wood-limb wood-arm-left" />
              <path d="M178 116 Q205 126 220 158" className="wood-limb wood-arm-right" />
              <circle cx="39" cy="158" r="10" className="wood-joint" />
              <circle cx="220" cy="158" r="10" className="wood-joint" />
              <path d="M108 194 L102 232" className="wood-limb wood-leg-left" />
              <path d="M152 194 L158 232" className="wood-limb wood-leg-right" />
              <circle cx="105" cy="193" r="9" className="wood-joint" />
              <circle cx="155" cy="193" r="9" className="wood-joint" />
              <path d="M89 126 Q130 143 171 126" className="wood-grain" />
              <path d="M105 157 Q130 167 155 157" className="wood-grain" />
            </g>
            <g className="fox-coin" aria-label="Moneda">
              <circle cx="231" cy="151" r="17" className="coin-edge" />
              <circle cx="231" cy="151" r="12" className="coin-face" />
              <text x="231" y="157" textAnchor="middle" className="coin-symbol">$</text>
            </g>
          </svg>
        </div>
        <div className="fox-loading__copy">
          {hayError ? (
            <>
              <h1>No pudimos cargar tus datos</h1>
              <p>{errorCarga}</p>
              <button type="button" onClick={onReintentar}>Reintentar</button>
            </>
          ) : (
            <>
              <h1>Preparando tu espacio</h1>
              <p>El zorro está organizando tus finanzas…</p>
              <span className="fox-loading__dots" aria-label="Cargando" />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
