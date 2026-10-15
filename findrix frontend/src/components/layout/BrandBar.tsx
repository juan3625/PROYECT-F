import findrixIcon from "../../assets/findrix-icon.png";

export function BrandBar() {
  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-secondary/30 bg-base px-5 py-2.5">
      <img src={findrixIcon} alt="" className="h-6 w-6 object-contain" />
      <span className="font-display text-base font-semibold text-primary-dark">
        Findrix
      </span>
    </div>
  );
}
