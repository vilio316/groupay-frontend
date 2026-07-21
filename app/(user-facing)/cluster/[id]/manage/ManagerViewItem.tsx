import { CaretUpIcon, CaretDownIcon } from "@phosphor-icons/react";
import { soraClass } from "@/app/fonts";

export type ManagerViewItem = {
  categoryName: string;
  icon: React.ReactElement;
  childElement?: React.ReactElement;
  count?: number;
};
export function ManagerViewCategory({
  obj,
  array,
  click,
  isActive,
}: {
  obj: ManagerViewItem;
  array: string[];
  click: () => void;
  isActive?: boolean;
}) {
  const { categoryName, icon, childElement, count } = obj;
  const isIncluded = array.includes(categoryName);
  return (
    <div
      className={`hover:bg-aqua/25 rounded-xl categoryContainer ${isIncluded ? "bg-aqua/25" : ""}`}
      onClick={() => click()}
    >
      <div
        className={`rounded-xl category p-3 text-2xl font-bold text-forest-text ${soraClass}  flex items-center gap-x-3 my-2`}
      >
        {icon}
        <p className="w-4/5">{categoryName}</p>
        <span>{count}</span>
        {isIncluded ? <CaretUpIcon /> : <CaretDownIcon />}
      </div>
      <div
        className={`categoryContent px-4 bg-white ${isIncluded ? "h-60" : "h-0"} transition-all duration-200`}
      >
        {isIncluded && childElement}
      </div>
    </div>
  );
}
