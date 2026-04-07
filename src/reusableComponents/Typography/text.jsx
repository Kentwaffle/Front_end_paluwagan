import { formatCurrency } from "../Utils/formatter";

export const OFFSET_CONTENT = ({ responseData, isMature }) => {
  const balance = responseData?.totalSavingsBalance || 0;
  const target = responseData?.targetAmount || 0;

  if (isMature) {
    return {
      title: "Kwalipikado para sa Offset",
      description: (
        <span>
          Pagbati! Ang iyong ipon ay matagumpay nang umabot sa maturity period.
          Matatanggap mo nang buo ang iyong principal na{" "}
          <b>({formatCurrency(balance)})</b> at ang kaukulang interes nito mula
          sa <b>({formatCurrency(target)})</b> target. Walang bawas o penalties
          na ilalapat sa transaksyong ito.
        </span>
      ),
      instruction: (
        <span>
          Upang kumpirmahin, mangyaring i-type ang <b>"I AGREE"</b> sa ibaba.
        </span>
      ),
    };
  }

  return {
    title: "Nais kong mag-offset",
    description: (
      <span>
        Sa pagpapatuloy, kinikilala mo na dahil ang iyong naipon ay hindi pa
        umabot sa isang taong maturity period, ang orihinal na halaga lamang na{" "}
        <b>({formatCurrency(balance)})</b> mula sa iyong target na{" "}
        <b>({formatCurrency(target)})</b> ang maaari mong makuha. Ang anumang
        inaasahang interes ay mapapawalang-bisa at ang prosesong ito ay pinal.
      </span>
    ),
    instruction: (
      <span>
        Upang kumpirmahin, mangyaring i-type ang <b>"I AGREE"</b> sa ibaba.
      </span>
    ),
  };
};
