import React from "react";
import { ArrowRight, PhilippinePeso } from "lucide-react";
import GcashIcon from "../assets/images/ModeOfPaymentLogos/GCash.jpg";
import MayaIcon from "../assets/images/ModeOfPaymentLogos/Maya.jpg";
import QRphIcon from "../assets/images/ModeOfPaymentLogos/QRph.png";

export const paymentOptions = [
  {
    value: "gcash",
    label: "GCash",
    icon: (
      <img
        src={GcashIcon}
        className="w-6 h-6 rounded-full object-contain"
        alt="GCash"
      />
    ),
  },
  {
    value: "qrph",
    label: "QRPH",
    icon: <img src={QRphIcon} className="w-5 h-5 object-contain" alt="QR PH" />,
  },
  {
    value: "paymaya",
    label: "Maya",
    icon: (
      <img
        src={MayaIcon}
        className="w-6 h-6 rounded-full object-contain"
        alt="Maya"
      />
    ),
  },
];

export const paymentTabs = [
  {
    value: "online",
    label: "Pay Online",
    icon: <ArrowRight size={18} />,
  },
  {
    value: "cash",
    label: "Pay Cash",
    icon: <PhilippinePeso size={18} />,
  },
];
