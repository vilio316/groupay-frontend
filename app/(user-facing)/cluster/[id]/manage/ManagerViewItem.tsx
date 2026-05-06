import { CaretUpIcon, CaretDownIcon } from "@phosphor-icons/react";
import { soraClass } from "@/app/fonts";

export type ManagerViewItem = {
  categoryName: string;
  icon: React.ReactElement;
  childElement?: React.ReactElement;
};
export function ManagerViewCategory({
  obj,
  array,
  click,
}: {
  obj: ManagerViewItem;
  array: string[];
  click: () => void;
}) {
  const { categoryName, icon, childElement } = obj;
  const isIncluded = array.includes(categoryName);
  return (
    <div
      className={`hover:bg-aqua/25 rounded-xl categoryContainer ${isIncluded ? "bg-aqua/25" : ""}`}
      onClick={() => click()}
    >
      <div
        className={`rounded-xl category p-3 text-2xl font-bold text-forest ${soraClass}  flex items-center gap-x-3 my-2`}
      >
        {icon}
        <p className="w-4/5">{categoryName}</p>
        {isIncluded ? <CaretUpIcon /> : <CaretDownIcon />}
      </div>
      {isIncluded && (
        <div className="categoryContent px-4 bg-white">{childElement}</div>
      )}
    </div>
  );
}
